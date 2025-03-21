import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { tools } from "./tools.js";
import { z } from "zod";
import cmc from "./modules/cmc.js";
import express, { Request, Response } from "express";
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
const transports: { [sessionId: string]: SSEServerTransport } = {};

app.get("/sse", async (_: Request, res: Response) => {
    const transport = new SSEServerTransport("/messages", res);
    transports[transport.sessionId] = transport;
    res.on("close", () => {
        delete transports[transport.sessionId];
    });
    await server.connect(transport);
});

app.post("/messages", async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;
    const transport = transports[sessionId];
    if (transport) {
        await transport.handlePostMessage(req, res);
    } else {
        res.status(400).send("No transport found for sessionId");
    }
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
