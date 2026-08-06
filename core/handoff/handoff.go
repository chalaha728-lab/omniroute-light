package handoff

import (
	"encoding/json"
	"fmt"
	"sync"
)

type SessionState struct {
	SessionID string
	LastModel string
}

var (
	mu       sync.RWMutex
	sessions = make(map[string]SessionState)
)

// RecordModelUsage records the model used for a specific session ID
func RecordModelUsage(sessionID, modelName string) {
	if sessionID == "" {
		return
	}
	
	mu.Lock()
	defer mu.Unlock()
	
	sessions[sessionID] = SessionState{
		SessionID: sessionID,
		LastModel: modelName,
	}
}

// DetectAndInjectHandoff checks if a model switch occurred.
// If it did, it generates an XML summary of the context transition
// and prepends it to the messages payload as a system prompt.
func DetectAndInjectHandoff(sessionID, incomingModel string, messages []interface{}) []interface{} {
	if sessionID == "" {
		return messages
	}
	
	mu.RLock()
	state, exists := sessions[sessionID]
	mu.RUnlock()
	
	if !exists {
		return messages
	}
	
	// If the model changed during the same session, inject context handoff
	if state.LastModel != "" && state.LastModel != incomingModel {
		handoffXML := fmt.Sprintf(`
<omniroute_system_transfer>
  <previous_model>%s</previous_model>
  <incoming_model>%s</incoming_model>
  <reason>Auto-Combo Circuit Breaker / Model Fallback Triggered</reason>
  <instruction>You are continuing a session initiated by the previous model. Please preserve the user's ongoing context seamlessly.</instruction>
</omniroute_system_transfer>`, state.LastModel, incomingModel)

		// Create a new system message
		systemMessage := map[string]interface{}{
			"role":    "system",
			"content": handoffXML,
		}
		
		// Prepend to messages
		newMessages := make([]interface{}, 0, len(messages)+1)
		newMessages = append(newMessages, systemMessage)
		newMessages = append(newMessages, messages...)
		
		return newMessages
	}
	
	return messages
}

// ExtractSessionID tries to extract a session ID from HTTP headers or payload
func ExtractSessionID(headers map[string][]string, bodyBytes []byte) string {
	// First check standard omniroute headers
	if val := headers["X-Omniroute-Session-Id"]; len(val) > 0 {
		return val[0]
	}
	
	// Check standard OpenAI session/user parameters in JSON body
	var payload struct {
		User string `json:"user"`
	}
	if err := json.Unmarshal(bodyBytes, &payload); err == nil && payload.User != "" {
		return payload.User
	}
	
	return ""
}