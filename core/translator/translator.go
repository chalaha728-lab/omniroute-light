package translator

import (
	"encoding/json"
	"strings"
)

// AnthropicRequest represents the expected payload for Anthropic APIs
type AnthropicRequest struct {
	Model       string                   `json:"model"`
	MaxTokens   int                      `json:"max_tokens"`
	Messages    []AnthropicMessage       `json:"messages"`
	System      string                   `json:"system,omitempty"`
	Temperature *float64                 `json:"temperature,omitempty"`
	Stream      bool                     `json:"stream,omitempty"`
}

type AnthropicMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// TranslateToAnthropic converts an OpenAI ChatRequest payload into Anthropic's format
func TranslateToAnthropic(openAIPayload []byte, modelName string) ([]byte, error) {
	var req map[string]interface{}
	if err := json.Unmarshal(openAIPayload, &req); err != nil {
		return nil, err
	}

	anthropicReq := AnthropicRequest{
		Model:     modelName,
		MaxTokens: 4096, // Default fallback if not provided
	}

	if maxTokens, ok := req["max_tokens"].(float64); ok {
		anthropicReq.MaxTokens = int(maxTokens)
	}
	if temp, ok := req["temperature"].(float64); ok {
		anthropicReq.Temperature = &temp
	}
	if stream, ok := req["stream"].(bool); ok {
		anthropicReq.Stream = stream
	}

	if messages, ok := req["messages"].([]interface{}); ok {
		for _, msgObj := range messages {
			if msgMap, ok := msgObj.(map[string]interface{}); ok {
				role := "user"
				if r, ok := msgMap["role"].(string); ok {
					role = r
				}
				content := ""
				if c, ok := msgMap["content"].(string); ok {
					content = c
				}

				if role == "system" {
					anthropicReq.System = content
				} else {
					anthropicReq.Messages = append(anthropicReq.Messages, AnthropicMessage{
						Role:    role,
						Content: content,
					})
				}
			}
		}
	}

	if len(anthropicReq.Messages) == 0 {
		anthropicReq.Messages = append(anthropicReq.Messages, AnthropicMessage{Role: "user", Content: "Hello"})
	}

	return json.Marshal(anthropicReq)
}

// NeedsTranslation determines if a provider ID strongly implies a non-OpenAI format
func NeedsTranslation(providerID string) string {
	providerID = strings.ToLower(providerID)
	if strings.Contains(providerID, "anthropic") || strings.Contains(providerID, "claude") {
		return "anthropic"
	}
	return ""
}
