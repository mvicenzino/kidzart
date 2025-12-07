# Kidzart MCP Server

An MCP (Model Context Protocol) server for monitoring and maintaining the Kidzart application.

## Setup

```bash
cd mcp-server
npm install
```

## Usage

### With Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "kidzart": {
      "command": "node",
      "args": ["/path/to/kidzart/mcp-server/server.js"]
    }
  }
}
```

### Available Tools

| Tool | Description |
|------|-------------|
| `check_build` | Run npm build and check for errors |
| `get_errors` | Get current build/runtime errors |
| `list_components` | List all React components |
| `get_component` | Get source code of a component |
| `check_env` | Check environment variables |
| `get_artwork_count` | Count artworks in gallery |
| `suggest_fix` | Get fix suggestions for an error |

### Available Resources

| Resource | Description |
|----------|-------------|
| `kidzart://structure` | App structure overview |
| `kidzart://taxonomy` | Art categories and filters |

## Example Prompts

When using with an AI assistant:

- "Check if the Kidzart app builds successfully"
- "What components does Kidzart have?"
- "Show me the Navbar component code"
- "How many artworks are in the gallery?"
- "Suggest a fix for: useClerk hook error"
