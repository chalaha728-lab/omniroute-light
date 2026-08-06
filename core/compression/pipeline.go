package compression

import (
	"regexp"
	"strings"
)

var (
	ansiRegex     = regexp.MustCompile(`\x1b\[[0-9;]*m`)
	fillerPhrases = []string{
		"here is the code",
		"certainly!",
		"i apologize for the confusion",
		"as an ai language model",
		"i hope this helps",
		"let me know if you need anything else",
		"sure, i can help with that",
		"here's the updated version",
		"please find the code below",
	}
)

// RTKMode (Rust Token Killer) strips structural noise like ANSI codes
// and deduplicates continuous repeated log lines.
func RTKMode(content string) string {
	// 1. Strip ANSI
	cleaned := ansiRegex.ReplaceAllString(content, "")

	// 2. Deduplicate lines (if >5 identical consecutive lines, squash to 1 + "... [repeated]")
	lines := strings.Split(cleaned, "\n")
	var result []string
	
	count := 1
	for i := 1; i <= len(lines); i++ {
		if i < len(lines) && strings.TrimSpace(lines[i]) == strings.TrimSpace(lines[i-1]) && strings.TrimSpace(lines[i]) != "" {
			count++
		} else {
			result = append(result, lines[i-1])
			if count > 5 {
				result = append(result, "... [repeated line stripped by RTK]")
			}
			count = 1
		}
	}
	
	return strings.Join(result, "\n")
}

// CavemanMode semantic condensation for natural language prose.
// Strips polite hedging but preserves code blocks.
func CavemanMode(content string) string {
	// Split by markdown code blocks to preserve them
	parts := strings.Split(content, "```")
	
	for i := 0; i < len(parts); i++ {
		// Even indices are natural language prose. Odd indices are code blocks.
		if i%2 == 0 {
			lowerPart := strings.ToLower(parts[i])
			originalPart := parts[i]
			
			for _, phrase := range fillerPhrases {
				// Case insensitive replace (crude but effective)
				idx := strings.Index(lowerPart, phrase)
				if idx != -1 {
					// We just strip the phrase and replacing it with empty string
					// In a real implementation we'd use a regex for exact word boundary case-insensitive match
					re := regexp.MustCompile(`(?i)\b` + regexp.QuoteMeta(phrase) + `\b[.,!?]*`)
					originalPart = re.ReplaceAllString(originalPart, "")
				}
			}
			// Clean up double spaces created by stripping
			parts[i] = strings.ReplaceAll(originalPart, "  ", " ")
		}
	}
	
	return strings.Join(parts, "```")
}

func ProcessPipeline(content string, applyRTK bool, applyCaveman bool) string {
	if applyRTK {
		content = RTKMode(content)
	}
	if applyCaveman {
		content = CavemanMode(content)
	}
	return content
}