package hooks

import (
	"fmt"
	"sort"
	"strings"

	"github.com/pocketbase/pocketbase/core"
)

func RegisterPreventDuplicateChatCreationHooks(app core.App) {
	// Register the onRecordBeforeCreate hook
	app.OnRecordBeforeCreateRequest().Add(func(e *core.RecordCreateEvent) error {
		if e.Collection.Name == "chats" {
			// Retrieve and validate the 'users' field
			users := e.Record.GetStringSlice("users")
			if len(users) == 0 {
				return fmt.Errorf("The 'users' field cannot be empty")
			}

			// Sort the user IDs
			sort.Strings(users)

			// Generate the participantsKey
			participantsKey := strings.Join(users, "_")

			// Set the participantsKey field
			e.Record.Set("participantsKey", participantsKey)
		}
		return nil
	})
}
