export const tools = [
    {
        name: "get_token_price",
        description: "Get token current price",
        inputSchema: {
            type: "object",
            properties: {
                symbol: {
                    type: "string",
                    description: "The token symbol",
                },
            },
            required: ["symbol"],
        },
    }
];
