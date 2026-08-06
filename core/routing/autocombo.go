package routing

import (
	"math/rand"
	"omniroute-core/providers"
	"omniroute-core/resilience"
	"strings"
	"time"
)

type Strategy string

const (
	StrategyPriority   Strategy = "priority"
	StrategyRoundRobin Strategy = "round-robin"
	StrategyLeastUsed  Strategy = "least-used"
	StrategyAutoCombo  Strategy = "auto-combo"
)

// ActiveConnections tracks the number of currently active requests to a node
var ActiveConnections = make(map[string]int)
var rrIndex int

// ScoreNode calculates the Auto-Combo composite metric for a provider/model target
// Quota (20%), Health (25%), Cost (20%), Latency (15%), TaskFit (10%), Stability (10%)
func ScoreNode(target string, breaker *resilience.CircuitBreaker) float64 {
	pName, _ := parseModelTarget(target)
	
	state := breaker.GetState(pName)
	if state == resilience.StateDead {
		return 0.0
	}

	score := 0.0

	// 1. Health (25%)
	if state == resilience.StateHealthy {
		score += 0.25
	} else if state == resilience.StateDegraded {
		score += 0.10
	}

	// 2. Latency Inverse (15%)
	avgLat := breaker.GetAverageLatency(pName)
	if avgLat < 500*time.Millisecond {
		score += 0.15
	} else if avgLat < 2*time.Second {
		score += 0.10
	} else {
		score += 0.05
	}

	// 3. Quota/Headroom (20%) - Assuming all have quota for now
	score += 0.20

	// 4. Cost Inverse (20%) - Hardcoded for demo, free/local gets higher
	if pName == "ollama" || pName == "lmstudio" {
		score += 0.20
	} else if pName == "groq" || pName == "deepseek" {
		score += 0.15
	} else {
		score += 0.05 // OpenAI/Anthropic are expensive
	}

	// 5. Task Fit (10%) & Stability (10%)
	score += 0.20

	return score
}

// SelectNextTarget determines which target to use based on the specified strategy
func SelectNextTarget(combos []string, strategy Strategy, breaker *resilience.CircuitBreaker) string {
	if len(combos) == 0 {
		return ""
	}

	// Filter out DEAD nodes
	var alive []string
	for _, target := range combos {
		pName, _ := parseModelTarget(target)
		if breaker.GetState(pName) != resilience.StateDead {
			alive = append(alive, target)
		}
	}

	if len(alive) == 0 {
		return "" // All targets are dead
	}

	switch strategy {
	case StrategyRoundRobin:
		idx := rrIndex % len(alive)
		rrIndex++
		return alive[idx]

	case StrategyLeastUsed:
		minTarget := alive[0]
		minVal := int(^uint(0) >> 1) // Max int
		
		for _, target := range alive {
			pName, _ := parseModelTarget(target)
			if ActiveConnections[pName] < minVal {
				minVal = ActiveConnections[pName]
				minTarget = target
			}
		}
		return minTarget

	case StrategyAutoCombo:
		bestScore := -1.0
		
		for _, target := range alive {
			score := ScoreNode(target, breaker)
			if score > bestScore {
				bestScore = score
			}
		}
		
		// If multiple nodes have exactly the same top score, pick randomly among them
		var topTargets []string
		for _, target := range alive {
			if ScoreNode(target, breaker) == bestScore {
				topTargets = append(topTargets, target)
			}
		}
		
		return topTargets[rand.Intn(len(topTargets))]

	case StrategyPriority:
		fallthrough
	default:
		// Just take the first alive node
		return alive[0]
	}
}

func parseModelTarget(modelInput string) (string, string) {
	if strings.Contains(modelInput, ":") {
		parts := strings.SplitN(modelInput, ":", 2)
		return parts[0], parts[1]
	}
	// Fallback lookup
	for _, p := range providers.GlobalRegistry.GetAll() {
		for _, m := range p.Models {
			if m == modelInput {
				return p.ID, m
			}
		}
	}
	return "openai", modelInput
}