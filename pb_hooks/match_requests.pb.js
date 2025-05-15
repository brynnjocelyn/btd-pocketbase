/**
 * This hook listens for updates to match_requests and creates a match when a request is accepted.
 */

// Handle match request update (when a user accepts/declines a match request)
onRecordUpdateRequest((e) => {
    // Only process for match_requests collection
    if (e.collection.name !== "match_requests") {
        e.next();
        return;
    }

    console.log(`Processing update for match request ${e.record.id}`);

    // Proceed with the update first
    e.next();

    // If the status is changing to ACCEPTED, create a match record
    const oldStatus = e.record.getStringValue("status", "");
    const newStatus = e.data.status;
    
    if (oldStatus !== "ACCEPTED" && newStatus === "ACCEPTED") {
        console.log(`Match request ${e.record.id} has been accepted, creating match record`);
        
        try {
            // Use transaction to ensure data consistency
            e.app.runInTransaction((txApp) => {
                // Get the requester and target users
                const requesterId = e.record.get("requesterId");
                const targetId = e.record.get("targetId");
                
                if (!requesterId || !targetId) {
                    console.error("Missing requesterId or targetId in match request");
                    return;
                }
                
                // Create the match record
                const matchesCollection = txApp.findCollectionByNameOrId("matches");
                const newMatch = new Record(matchesCollection);
                
                newMatch.set("userId1", requesterId);
                newMatch.set("userId2", targetId);
                newMatch.set("matchRequestId", e.record.id);
                newMatch.set("matchedDate", new Date().toISOString());
                newMatch.set("status", "ACTIVE");
                
                // Save the match record
                txApp.save(newMatch);
                
                console.log(`Created new match record with ID: ${newMatch.id}`);
            });
        } catch (error) {
            console.error("Error creating match:", error);
        }
    }
});

// When a match request is created, set default values
onRecordCreateRequest((e) => {
    // Only process for match_requests collection
    if (e.collection.name !== "match_requests") {
        e.next();
        return;
    }
    
    console.log(`Setting defaults for new match request from ${e.record.get("requesterId")}`);
    
    // Set default values if they aren't provided
    if (!e.record.get("status")) {
        e.record.set("status", "PENDING");
    }
    
    if (e.record.get("notificationSent") === undefined) {
        e.record.set("notificationSent", false);
    }
    
    if (e.record.get("notificationRead") === undefined) {
        e.record.set("notificationRead", false);
    }
    
    // Continue with the request
    e.next();
});