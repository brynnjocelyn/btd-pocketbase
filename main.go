package main

import (
	"log"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	// uncomment once you have at least one .go file in the pb_hooks directory
	hooks "btdApi/pb_hooks"
)

func main() {
	app := pocketbase.New()

	// Register the auth hooks
	hooks.RegisterAuthHooks(app)

	// Register the chat hooks
	hooks.RegisterPreventDuplicateChatCreationHooks(app)

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{Automigrate: true})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
