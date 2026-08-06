package resilience

import (
	"sync"
	"time"
)

type NodeState string

const (
	StateHealthy  NodeState = "HEALTHY"
	StateDegraded NodeState = "DEGRADED"
	StateDead     NodeState = "DEAD"
)

type CircuitBreaker struct {
	mu           sync.RWMutex
	Failures     map[string]int
	Successes    map[string]int
	LastFailure  map[string]time.Time
	Latencies    map[string][]time.Duration
}

var GlobalBreaker = NewCircuitBreaker()

func NewCircuitBreaker() *CircuitBreaker {
	return &CircuitBreaker{
		Failures:    make(map[string]int),
		Successes:   make(map[string]int),
		LastFailure: make(map[string]time.Time),
		Latencies:   make(map[string][]time.Duration),
	}
}

func (cb *CircuitBreaker) RecordSuccess(nodeID string, latency time.Duration) {
	cb.mu.Lock()
	defer cb.mu.Unlock()

	cb.Successes[nodeID]++
	cb.Failures[nodeID] = 0 // Reset failures on success

	// Keep last 10 latencies
	lats := cb.Latencies[nodeID]
	lats = append(lats, latency)
	if len(lats) > 10 {
		lats = lats[1:]
	}
	cb.Latencies[nodeID] = lats
}

func (cb *CircuitBreaker) RecordFailure(nodeID string) {
	cb.mu.Lock()
	defer cb.mu.Unlock()

	cb.Failures[nodeID]++
	cb.LastFailure[nodeID] = time.Now()
}

func (cb *CircuitBreaker) GetState(nodeID string) NodeState {
	cb.mu.RLock()
	defer cb.mu.RUnlock()

	failures := cb.Failures[nodeID]
	lastFail := cb.LastFailure[nodeID]

	// If failed 3 or more times, and last failure was within 5 minutes -> DEAD
	if failures >= 3 && time.Since(lastFail) < 5*time.Minute {
		return StateDead
	}

	// If failed 1-2 times recently -> DEGRADED
	if failures > 0 && time.Since(lastFail) < 2*time.Minute {
		return StateDegraded
	}

	return StateHealthy
}

func (cb *CircuitBreaker) GetAverageLatency(nodeID string) time.Duration {
	cb.mu.RLock()
	defer cb.mu.RUnlock()

	lats := cb.Latencies[nodeID]
	if len(lats) == 0 {
		return 500 * time.Millisecond // Default baseline assumption
	}

	var total time.Duration
	for _, l := range lats {
		total += l
	}
	return total / time.Duration(len(lats))
}