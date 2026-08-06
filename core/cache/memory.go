package cache

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"sync"
)

type CacheEntry struct {
	Body   []byte
	Header http.Header
}

var (
	semanticCache = make(map[string]CacheEntry)
	cacheMutex    sync.RWMutex
)

// GenerateHash creates a fast SHA-256 hash of the request messages
func GenerateHash(messages []interface{}) string {
	bytes, _ := json.Marshal(messages)
	hash := sha256.Sum256(bytes)
	return hex.EncodeToString(hash[:])
}

func Get(hash string) (CacheEntry, bool) {
	cacheMutex.RLock()
	defer cacheMutex.RUnlock()
	entry, exists := semanticCache[hash]
	return entry, exists
}

func Set(hash string, body []byte, header http.Header) {
	cacheMutex.Lock()
	defer cacheMutex.Unlock()
	// Clone headers to avoid race conditions
	clonedHeader := make(http.Header)
	for k, vv := range header {
		clonedHeader[k] = vv
	}
	semanticCache[hash] = CacheEntry{
		Body:   body,
		Header: clonedHeader,
	}
}
