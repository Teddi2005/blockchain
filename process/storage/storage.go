package diskstorage

import (
	"os"
	"strings"
)

// Tên file dùng để lưu trữ Hash của block mới nhất
const HASH_FILE = "latest_hash.txt"

// Hàm ghi Hash vào file (Ghi đè)
func SaveHashToDisk(hash string) error {
	return os.WriteFile(HASH_FILE, []byte(hash), 0644)
}

// Hàm đọc Hash từ file
func LoadHashFromDisk() (string, error) {
	data, err := os.ReadFile(HASH_FILE)
	if err != nil {
		if os.IsNotExist(err) {
			return "", nil 
		}
		return "", err
	}
	return strings.TrimSpace(string(data)), nil
}