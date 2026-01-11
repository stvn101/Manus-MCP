# Manus-MCP Server

A specialized Model Context Protocol (MCP) server designed to integrate **Carbon Construct** and **Supabase** capabilities directly into AI workflows. This server allows AI models to interact with the Carbon Construct website and manage data within a Supabase project.

## 🚀 Features

- **Carbon Construct Integration**: Fetch and analyze content from `https://carbonconstruct.com.au`.
- **Supabase Management**: Administrative access to Supabase projects using Personal Access Tokens.
- **Data Querying**: Real-time querying of database tables.
- **Built-in Tools**: A suite of tools for both informational and administrative tasks.

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)
- A Supabase account and project
- A Supabase Personal Access Token

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/stvn101/Manus-MCP.git
   cd Manus-MCP
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your credentials:
   ```env
   VITE_SUPABASE_URL="https://tdtrpwdpxvkygulrlfgh.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key"
   VITE_SUPABASE_PROJECT_ID="tdtrpwdpxvkygulrlfgh"
   SUPABASE_ACCESS_TOKEN="your-personal-access-token"
   ```

## 🚀 Operation

### Starting the Server
To run the MCP server locally using stdio:
```bash
npm run mcp:start
```

### Available Tools

| Tool Name | Description | Parameters |
| --- | --- | --- |
| `get_website_content` | Fetches content from Carbon Construct | `path` (e.g., `/pricing`) |
| `get_project_info` | Gets admin info about the Supabase project | None |
| `list_database_tables` | Lists all tables in the database | None |
| `query_table_data` | Queries data from a specific table | `table` (required), `limit` |

## 🤖 Integration with AI Clients

To use this server with an MCP-compatible AI client (like Claude Desktop), add the following to your configuration file:

### macOS (Claude Desktop)
File: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "carbon-construct": {
      "command": "npx",
      "args": [
        "-y",
        "tsx",
        "/absolute/path/to/Manus-MCP/mcp-server.ts"
      ],
      "env": {
        "VITE_SUPABASE_URL": "https://tdtrpwdpxvkygulrlfgh.supabase.co",
        "VITE_SUPABASE_ANON_KEY": "your-anon-key",
        "VITE_SUPABASE_PROJECT_ID": "tdtrpwdpxvkygulrlfgh",
        "SUPABASE_ACCESS_TOKEN": "your-access-token"
      }
    }
  }
}
```

## 🛡️ Security

- **.env Safety**: The `.env` file is included in `.gitignore` to prevent sensitive credentials from being pushed to version control.
- **Access Control**: Uses Supabase's Anon Key for standard queries and Personal Access Tokens for administrative tasks.

## 📄 License

This project is licensed under the MIT License.
