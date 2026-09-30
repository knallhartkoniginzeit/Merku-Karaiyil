# Preview Run Doc

## No build artifacts needed

This is a static HTML/CSS/JS project with no build step, package manager, or dependencies.

## How to run the server

```bash
node .freebuff/preview-server.js
```

This starts a minimal HTTP server on port 4567 serving files from the project root.

The server now properly handles URL-encoded paths (e.g., spaces in folder names like "Film mood/1.png" are decoded from "Film%20mood/1.png"). It also includes security checks to prevent directory traversal.
