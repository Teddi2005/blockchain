package block

import (
	"crypto/sha256"
	"encoding/hex"
	"strconv"
	"time"
)

// 1. Định nghĩa cấu trúc Block (Dùng Address thay vì Name)
type Block struct {
	Index   int    `bson:"index" json:"index"`
	Time    string `bson:"time" json:"time"`
	Address string `bson:"address" json:"address"` // Đổi từ Name -> Address
	Value   int    `bson:"value" json:"value"`
	PreHash string `bson:"prehash" json:"prehash"`
	Hash    string `bson:"hash" json:"hash"`
}

// 2. Hàm tính toán Hash
// Logic: Hash = SHA256(Time + Address + Value + PreHash)
func CalculateHash(b Block) string {
	record := b.Time + b.Address + strconv.Itoa(b.Value) + b.PreHash
	h := sha256.New()
	h.Write([]byte(record))
	hashed := h.Sum(nil)
	return hex.EncodeToString(hashed)
}

// 3. Hàm tạo Block mới
func GenerateBlock(oldBlock Block, address string, value int, currentTime string) Block {
	var newBlock Block

	newBlock.Index = oldBlock.Index + 1
	newBlock.Time = currentTime
	newBlock.Address = address // Lưu địa chỉ ví vào đây
	newBlock.Value = value
	newBlock.PreHash = oldBlock.Hash

	newBlock.Hash = CalculateHash(newBlock)

	return newBlock
}

// 4. Hàm tạo Genesis Block
func GenerateGenesisBlock() Block {
	genesis := Block{
		Index:   0,
		Time:    time.Now().UTC().Format(time.RFC3339),
		Address: "Genesis",
		Value:   0,
		PreHash: "",
	}
	genesis.Hash = CalculateHash(genesis)
	return genesis
}