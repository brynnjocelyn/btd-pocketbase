package hooks

import (
	"log"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
)

func RegisterAuthHooks(app core.App) {
    app.OnRecordAuthRequest("users").Add(func(e *core.RecordAuthEvent) error {
        return onRecordAuthRequest(app, e)
    })
    app.OnModelAfterUpdate("users").Add(func (e *core.ModelEvent) error {
       return onModelAfterUpdate(app, e)
    })
    app.OnModelBeforeCreate().Add(onModelBeforeCreate)
    app.OnModelBeforeDelete().Add(onModelBeforeDelete)
}

func onRecordAuthRequest(app core.App, e *core.RecordAuthEvent) error {
    if e.Collection.Name != "users" {
        return nil
    }

    log.Printf("User authenticated: %s", e.Record.Id)
    
    e.Record.Set("online", true)
    log.Println("Updated user online status to true.")
    
    // Save the record using DAO
    if err := app.Dao().SaveRecord(e.Record); err != nil {
        log.Printf("Error updating user online status: %v", err)
        return err
    }

    log.Println("Saved user with updated online status.")
    return nil
}

func onModelAfterUpdate(app core.App, e *core.ModelEvent) error {
    record, ok := e.Model.(*models.Record)
    if !ok {
        return nil
    }

    if record.Collection().Name != "users" {
        return nil
    }

    // Check if the tokenKey field was updated to an empty string (logout)
    if record.GetString("tokenKey") == "" {
        log.Printf("User logged out: %s", record.Id)
        
        record.Set("online", false)
    log.Println("Updated user online status to false.")
        
        // Save the record using DAO
        if err := app.Dao().SaveRecord(record); err !=nil {
            log.Printf("Error updating user offline status: %v", err)
            return err
        }

        
    log.Println("Saved user with updated online status.")
    }

    return nil
}

func onModelBeforeCreate(e *core.ModelEvent) error {
    record, ok := e.Model.(*models.Record)
    if !ok || record.Collection().Name != "users" {
        return nil
    }

    log.Printf("New user registered: %s", record.Id)
    return nil
}

func onModelBeforeDelete(e *core.ModelEvent) error {
    record, ok := e.Model.(*models.Record)
    if !ok || record.Collection().Name != "users" {
        return nil
    }

    log.Printf("User account deleted: %s", record.Id)
    return nil
}
