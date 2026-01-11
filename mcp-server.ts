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

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const server = new Server(
  {
    name: "carbon-construct-mcp",
    version: "1.0.0",
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
    
    // Remove scripts and styles
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
 * Tool to query Supabase data
 */
async function querySupabase(table: string, query: any = {}) {
  try {
    let supabaseQuery = supabase.from(table).select('*');
    
    if (query.limit) {
      supabaseQuery = supabaseQuery.limit(query.limit);
    }
    
    const { data, error } = await supabaseQuery;
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    return { error: `Supabase query failed: ${error.message}` };
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
        name: "query_database",
        description: "Query the Supabase database for project or material data",
        inputSchema: {
          type: "object",
          properties: {
            table: {
              type: "string",
              description: "The table name to query",
            },
            limit: {
              type: "number",
              description: "Maximum number of records to return",
              default: 10,
            },
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
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
    case "query_database": {
      const table = args?.table as string;
      const limit = (args?.limit as number) || 10;
      const result = await querySupabase(table, { limit });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Carbon Construct MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
