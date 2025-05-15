# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Run Commands
- Start PocketBase server: `go run main.go serve`
- Build executable: `go build`
- Lint: `go vet ./...`
- Format code: `go fmt ./...`
- Run tests: `go test ./...` 
- Run specific test: `go test -run TestName ./path/to/package`

## Code Style Guidelines
- **Imports**: Group standard library imports first, then external packages, then local packages
- **Error Handling**: Always check returned errors and provide context in error messages
- **Naming**: Use camelCase for variables/functions, PascalCase for exported functions
- **Hooks**: PocketBase hooks in Go (`*.go`) or JavaScript (`*.pb.js`)
- **Formatting**: Follow Go standard formatting (use `go fmt`)
- **File Organization**: Place hooks in `pb_hooks/`, migrations in `pb_migrations/` or `migrations/`
- **Logging**: Use `log` package for Go hooks, `console.log` for JS hooks
- **Comments**: Document all exported functions and complex logic
- **Transactions**: Wrap multiple operations in transactions when appropriate

## PocketBase-Specific Patterns
- **Data Filtering**: For collection-wide filtering (like excluding inactive records), use Collection Rules instead of post-processing in hooks. Example rule: `isActive != false`
- **Record Visibility**: Use API Rules to control record access rather than manual filtering in `onRecordsListRequest` hooks
- **Pagination**: Don't attempt to modify pagination query parameters in hooks, as they're applied before hooks execute
- **Database-Level Filters**: Collection rules (listRule, viewRule) are applied at the database level, improving performance and ensuring correct pagination