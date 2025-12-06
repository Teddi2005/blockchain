package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	block "github.com/Teddi2005/blockchain/blockchain"
	diskstorage "github.com/Teddi2005/blockchain/storage"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// --- CẤU HÌNH BẢO MẬT & DB ---
const SECRET_API_KEY = "HoaTriDung"

var collection *mongo.Collection
var ctx = context.TODO()

// --- KẾT NỐI MONGODB ---
func initMongoDB() {
	const connectionString = "mongodb+srv://hoavt2005:namsaulayvo@block.i0hqtna.mongodb.net/?appName=Block"

	clientOptions := options.Client().ApplyURI(connectionString)
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal("Lỗi tạo Client Mongo:", err)
	}
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Không kết nối được MongoDB! (Kiểm tra lại IP Whitelist)", err)
	}
	fmt.Println("✅ Đã kết nối MongoDB Atlas thành công!")

	collection = client.Database("blockchain").Collection("blocks")
}

// --- LẤY BLOCK MỚI NHẤT (CÓ CẬP NHẬT FILE TEXT) ---
func getLatestBlock() block.Block {
	var result block.Block
	// Sắp xếp giảm dần theo Index để lấy block mới nhất
	opts := options.FindOne().SetSort(bson.D{{Key: "index", Value: -1}})

	err := collection.FindOne(ctx, bson.D{}, opts).Decode(&result)
	if err != nil {
		fmt.Println("⚠️ DB trống, đang tạo Genesis Block...")
		genesis := block.GenerateGenesisBlock()
		collection.InsertOne(ctx, genesis)

		// [QUAN TRỌNG] Lưu Hash Genesis vào file text luôn
		diskstorage.SaveHashToDisk(genesis.Hash)
		
		return genesis
	}
	return result
}

func main() {
	// 1. Khởi động DB và kiểm tra Block đầu tiên
	initMongoDB()
	getLatestBlock() 

	// 2. Khởi tạo Web Server
	r := gin.Default()

	// --- API 1: THÊM BLOCK (CẬP NHẬT CẢ DB VÀ TEXT FILE) ---
	r.POST("/add-block", func(c *gin.Context) {
		// A. Kiểm tra API Key
		clientKey := c.GetHeader("X-API-Key")
		if clientKey != SECRET_API_KEY {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Sai mật khẩu bảo mật."})
			return
		}

		// B. Hứng dữ liệu JSON
		var body struct {
			User  string `json:"user"` 
			Value int    `json:"value"`
			Time  string `json:"time"`
		}

		if err := c.BindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "JSON lỗi"})
			return
		}

		// C. Tạo Block mới
		oldBlock := getLatestBlock()
		newBlock := block.GenerateBlock(oldBlock, body.User, body.Value, body.Time)

		// D. Lưu vào MongoDB
		_, err := collection.InsertOne(ctx, newBlock)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi lưu DB"})
			return
		}


		// Đây là bước chống xóa node cuối. Nếu DB mất node này, file text vẫn giữ hash của nó.
		errFile := diskstorage.SaveHashToDisk(newBlock.Hash)
		if errFile != nil {
			fmt.Println("Lỗi ghi file text:", errFile)
		}

		fmt.Printf("[NEW BLOCK] #%d | Hash: %s\n", newBlock.Index, newBlock.Hash)

		// F. Trả kết quả
		c.JSON(http.StatusOK, gin.H{
			"status": "success",
			"hash":   newBlock.Hash,
			"index":  newBlock.Index,
		})
	})

	// --- API 2: KIỂM TRA TOÀN VẸN ---
	r.GET("/check-integrity", func(c *gin.Context) {

		limit := int64(1000)
		opts := options.Find().SetSort(bson.D{{Key: "index", Value: -1}}).SetLimit(limit)

		cursor, err := collection.Find(ctx, bson.D{}, opts)
		if err != nil {
			c.JSON(500, gin.H{"error": "Lỗi đọc DB"})
			return
		}

		var checkChain []block.Block
		if err = cursor.All(ctx, &checkChain); err != nil {
			c.JSON(500, gin.H{"error": "Lỗi parse dữ liệu"})
			return
		}

		if len(checkChain) == 0 {
			c.JSON(200, gin.H{"message": "Blockchain trống."})
			return
		}

		// --- BƯỚC 1: KIỂM TRA NODE CUỐI VỚI FILE TEXT ---
		// Lấy Hash thật từ file text
		realLastHash, err := diskstorage.LoadHashFromDisk()
		
		// Nếu file tồn tại và có dữ liệu, so sánh ngay
		if err == nil && realLastHash != "" {
			dbLastHash := checkChain[0].Hash // Block mới nhất trong DB
			
			if dbLastHash != realLastHash {
				// PHÁT HIỆN LỖI: Node cuối trong DB khác với Node cuối đã lưu trong File
				c.JSON(409, gin.H{
					"status": "NGUY HIỂM - NODE CUỐI BỊ THAY ĐỔI",
					"message": fmt.Sprintf("Hash trong DB (%s) không khớp với Hash gốc trong File (%s). Có thể Node cuối đã bị xóa!", dbLastHash, realLastHash),
				})
				return
			}
		}

		// --- BƯỚC 2: KIỂM TRA LIÊN KẾT CHAIN (Logic cũ) ---
		if len(checkChain) < 2 {
			c.JSON(200, gin.H{"status": "OK", "message": "Chưa đủ dữ liệu để kiểm tra chain (nhưng Node cuối khớp file)."})
			return
		}

		isValid := true
		var errorMsg string

		for i := 0; i < len(checkChain)-1; i++ {
			current := checkChain[i]
			prev := checkChain[i+1]

			// Check Hash (Dữ liệu block hiện tại có đúng ko)
			if block.CalculateHash(current) != current.Hash {
				isValid = false
				errorMsg = fmt.Sprintf("GIAN LẬN DATA: Block #%d bị sửa nội dung!", current.Index)
				break
			}
			// Check Link (PreHash có trỏ đúng về block trước ko)
			if current.PreHash != prev.Hash {
				isValid = false
				errorMsg = fmt.Sprintf("GIAN LẬN LIÊN KẾT: Đứt xích giữa #%d và #%d", current.Index, prev.Index)
				break
			}
		}

		if isValid {
			c.JSON(200, gin.H{
				"status": "AN TOÀN", 
				"message": fmt.Sprintf("Verified %d blocks. Node cuối khớp với Text File.", len(checkChain) - 1),
				"last_hash": checkChain[0].Hash,
			})
		} else {
			c.JSON(409, gin.H{"status": "NGUY HIỂM", "message": errorMsg})
		}
	})

	fmt.Println("🚀 Server Blockchain đang chạy tại cổng 8080...")
	r.Run(":8080")
}