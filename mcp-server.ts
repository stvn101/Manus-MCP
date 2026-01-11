import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "";
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || "";
const SUPABASE_PROJECT_ID = process.env.VITE_SUPABASE_PROJECT_ID || "tdtrpwdpxvkygulrlfgh";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const server = new Server(
  {
    name: "carbon-construct-mcp",
    version: "1.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Tool to fetch content from Carbon Construct website
 */
async function fetchCarbonConstructContent(path: string = "") {
  try {
    const url = `https://carbonconstruct.com.au${path.startsWith('/') ? '' : '/'}${path}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    $('script, style').remove();
    return {
      title: $('title').text(),
      content: $('body').text().replace(/\s+/g, ' ').trim().substring(0, 5000),
      url: url
    };
  } catch (error: any) {
    return { error: `Failed to fetch content: ${error.message}` };
  }
}

/**
 * Tool to query Supabase data using Management API for admin tasks
 */
async function getSupabaseProjectInfo() {
  try {
    const response = await axios.get(`https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_ID}`, {
      headers: { 'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}` }
    });
    return response.data;
  } catch (error: any) {
    return { error: `Failed to fetch project info: ${error.response?.data?.message || error.message}` };
  }
}

async function listSupabaseTables() {
  try {
    // Using the Management API to list tables requires a different approach or using the SQL API
    // For now, let's use the SQL API if possible, or just fetch project details
    const response = await axios.get(`https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_ID}/database/tables`, {
      headers: { 'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}` }
    });
    return response.data;
  } catch (error: any) {
    return { error: `Failed to list tables: ${error.response?.data?.message || error.message}` };
  }
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_website_content",
        description: "Fetch content from Carbon Construct website",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "The path on the website to fetch (e.g., '/', '/pricing')",
            },
          },
        },
      },
      {
        name: "get_project_info",
        description: "Get administrative information about the Supabase project",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "list_database_tables",
        description: "List all tables in the Supabase database using Management API",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "query_table_data",
        description: "Query data from a specific table using the Anon key",
        inputSchema: {
          type: "object",
          properties: {
            table: { type: "string" },
            limit: { type: "number", default: 10 },
          },
          required: ["table"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "get_website_content": {
      const path = (args?.path as string) || "";
      const result = await fetchCarbonConstructContent(path);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
    case "get_project_info": {
      const result = await getSupabaseProjectInfo();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
    case "list_database_tables": {
      const result = await listSupabaseTables();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
    case "query_table_data": {
      const table = args?.table as string;
      const limit = (args?.limit as number) || 10;
      const { data, error } = await supabase.from(table).select('*').limit(limit);
      return { content: [{ type: "text", text: JSON.stringify(error || data, null, 2) }] };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Carbon Construct Admin MCP Server running");
  console.error(`Connected to Supabase URL: ${SUPABASE_URL}`);
  console.error(`Project ID: ${SUPABASE_PROJECT_ID}`);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
