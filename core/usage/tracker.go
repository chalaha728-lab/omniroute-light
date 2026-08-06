package usage

import (
	"encoding/json"
	"os"
	"sync"
	"time"
)

type UsageEntry struct {
	Provider         string `json:"provider"`
	Model            string `json:"model"`
	PromptTokens     int    `json:"prompt_tokens"`
	CompletionTokens int    `json:"completion_tokens"`
	Timestamp        string `json:"timestamp"`
}

var (
	usageMutex sync.Mutex
	usageFile  = "usage.json" // Will be created in core/ working directory
)

func RecordUsage(provider, model string, promptTokens, completionTokens int) {
	entry := UsageEntry{
		Provider:         provider,
		Model:            model,
		PromptTokens:     promptTokens,
		CompletionTokens: completionTokens,
		Timestamp:        time.Now().Format(time.RFC3339),
	}

	go func() {
		usageMutex.Lock()
		defer usageMutex.Unlock()

		var entries []UsageEntry
		data, err := os.ReadFile(usageFile)
		if err == nil {
			json.Unmarshal(data, &entries)
		}

		entries = append(entries, entry)
		out, _ := json.MarshalIndent(entries, "", "  ")
		os.WriteFile(usageFile, out, 0644)
	}()
}
