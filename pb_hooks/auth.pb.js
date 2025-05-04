// fires only for "users" and "articles" records
onRecordCreate((e) => {
    // e.app
    // e.record
    // Debug logging removed
    
    e.next()
}, "users")
