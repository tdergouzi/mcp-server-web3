import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { tools } from "./tools.js";
import { z } from "zod";
import cmc from "./modules/cmc.js";

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
            case "get_token_info": {
                const { contractAddress } = InfoArgsSchema.parse(args);
                const info = {
                    name: "Test Token",
                    symbol: "TT",
                    totalSupply: 1000000,
                };
                return {
                    content: [
                        {
                            type: "text",
                            text: `Name: ${info.name}\nSymbol: ${info.symbol}\nTotal Supply: ${info.totalSupply}`,
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

// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Web3 MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
