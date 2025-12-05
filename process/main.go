package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	// 👇 CHÚ Ý: Đảm bảo đường dẫn này khớp với tên module và folder của bạn
	// Nếu folder là 'block' thì sửa thành ".../block"
	block "github.com/Teddi2005/blockchain/blockchain"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// --- CẤU HÌNH BẢO MẬT ---
const SECRET_API_KEY = "8047468c59139613d5d07b7102148f3fa79cc16586cf398439d7637b53915bc5 "

// --- BIẾN TOÀN CỤC ---
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
	fmt.Println("Đã kết nối MongoDB Atlas thành công!")
	
	// Lưu Block vào DB "blockchain", Collection "blocks"
	collection = client.Database("blockchain").Collection("blocks")
}

// --- LẤY BLOCK MỚI NHẤT (HOẶC TẠO GENESIS) ---
func getLatestBlock() block.Block {
	var result block.Block
	// Sắp xếp giảm dần theo Index để lấy block mới nhất
	opts := options.FindOne().SetSort(bson.D{{Key: "index", Value: -1}})
	
	err := collection.FindOne(ctx, bson.D{}, opts).Decode(&result)
	if err != nil {
		fmt.Println("DB trống, tạo Genesis Block...")
		genesis := block.GenerateGenesisBlock()
		collection.InsertOne(ctx, genesis)
		return genesis
	}
	return result
}

func main() {
	// 1. Khởi động DB
	initMongoDB()
	getLatestBlock() // Kích hoạt tạo Genesis nếu cần

	// 2. Khởi tạo Web Server
	r := gin.Default()

	// --- API 1: THÊM BLOCK (CÓ BẢO MẬT) ---
	r.POST("/add-block", func(c *gin.Context) {
		// A. Kiểm tra mật khẩu (API Key) từ Header
		clientKey := c.GetHeader("X-API-Key")
		if clientKey != SECRET_API_KEY {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Sai mật khẩu bảo mật."})
			return
		}

		// B. Hứng dữ liệu JSON
		var body struct {
			User  string `json:"user"` // Node.js gửi Address vào đây
			Value int    `json:"value"`
			Time  string `json:"time"`
		}

		if err := c.BindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "JSON lỗi"})
			return
		}

		// C. Tạo Block mới
		oldBlock := getLatestBlock()
		
		// Hàm GenerateBlock nhận vào (oldBlock, address, value, time)
		newBlock := block.GenerateBlock(oldBlock, body.User, body.Value, body.Time)

		// D. Lưu vào MongoDB
		_, err := collection.InsertOne(ctx, newBlock)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi lưu DB"})
			return
		}

		fmt.Printf("[DONATION] Block #%d | Addr: %s | Amount: %d\n", newBlock.Index, newBlock.Address, newBlock.Value)

		// E. Trả kết quả
		c.JSON(http.StatusOK, gin.H{
			"status": "success",
			"hash":   newBlock.Hash,
			"index":  newBlock.Index,
		})
	})

	// --- API 2: KIỂM TRA GIAN LẬN (INTEGRITY CHECK) ---
	r.GET("/check-integrity", func(c *gin.Context) {
		// Chỉ lấy 1000 block mới nhất để kiểm tra
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

		if len(checkChain) < 2 {
			c.JSON(200, gin.H{"status": "OK", "message": "Chưa đủ dữ liệu để kiểm tra."})
			return
		}

		isValid := true
		var errorMsg string

		// Duyệt ngược từ mới nhất về cũ hơn
		for i := 0; i < len(checkChain)-1; i++ {
			current := checkChain[i]
			prev := checkChain[i+1]

			// 1. Check Hash (Dữ liệu có bị sửa không?)
			if block.CalculateHash(current) != current.Hash {
				isValid = false
				errorMsg = fmt.Sprintf("GIAN LẬN DATA: Block #%d bị sửa!", current.Index)
				break
			}
			// 2. Check Link (chain có bị đứt không?)
			if current.PreHash != prev.Hash {
				isValid = false
				errorMsg = fmt.Sprintf("GIAN LẬN LIÊN KẾT: Đứt giữa #%d và #%d", current.Index, prev.Index)
				break
			}
		}

		if isValid {
			c.JSON(200, gin.H{
				"status": " AN TOÀN", 
				"message": fmt.Sprintf("Đã kiểm tra %d block. Hệ thống toàn vẹn.", len(checkChain)),
				"newest_hash": checkChain[0].Hash,
			})
		} else {
			c.JSON(409, gin.H{"status": "NGUY HIỂM", "message": errorMsg})
		}
	})

	fmt.Println(" Server Blockchain đang chạy tại cổng 8080...")
	r.Run(":8080")

}
