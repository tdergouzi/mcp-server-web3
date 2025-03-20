import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { tools } from "./tools.js";
import { z } from "zod";
import cmc from "./modules/cmc.js";
import express from "express";
import cors from "cors";

// Define Zod schemas for validation
const PriceArgsSchema = z.object({
    symbol: z.string(),
});

const InfoArgsSchema = z.object({
    contractAddress: z.string(),
});

// Create server instance
const server = new Server(
    {
        name: "web3",
        version: "1.0.0",
    },
    {
        capabilities: {
            resources: {},
            tools: {},
            prompts: {},
        },
    }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: tools,
    };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        switch (name) {
            case "get_token_price": {
                const { symbol } = PriceArgsSchema.parse(args);
                const currencyData = await cmc.idMap(symbol);
                if (!currencyData) {
                    throw new Error(`Could not find token with symbol ${symbol}`);
                }
                const price = await cmc.price(currencyData.id);
                return {
                    content: [
                        {
                            type: "text",
                            text: `The price of ${symbol} is $${price}`,
                        },
                    ],
                };
            }
            default:
                throw new Error("Unknown tool");
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(
                `Invalid arguments: ${error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`
            );
        }
        throw error;
    }
});

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Store active transport
let transport: SSEServerTransport | null = null;

// Set up SSE endpoint
app.get("/sse", (req, res) => {
    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    
    console.log("Client connected to SSE");
    
    // Create transport and connect
    transport = new SSEServerTransport("/messages", res);
    server.connect(transport);
    
    // Handle disconnect
    req.on("close", () => {
        console.log("Client disconnected");
        transport = null;
    });
});

// Set up message endpoint
app.post("/messages", (req, res) => {
    if (transport) {
        transport.handlePostMessage(req, res);
    } else {
        res.status(400).json({ error: "No active connection" });
    }
});

// Add a simple status endpoint
app.get("/status", (req, res) => {
    res.json({ 
        status: "Web3 MCP Server is running",
        activeConnection: transport !== null
    });
});

// Start the server
async function main() {
    const PORT = process.env.PORT || 3001;
    
    app.listen(PORT, () => {
        console.log(`Web3 MCP Server running on http://localhost:${PORT}`);
        console.log(`SSE endpoint available at http://localhost:${PORT}/sse`);
        console.log(`Messages endpoint available at http://localhost:${PORT}/messages`);
    });
}

// Make sure we handle errors
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
