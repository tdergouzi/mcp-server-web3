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
    },
    {
      name: "get_token_info",
      description: "Get token details",
      inputSchema: {
          type: "object",
          properties: {
              contractAddress: {
                  type: "string",
                  description: "The token contract address",
              },
          },
          required: ["contractAddress"],
      },
  },
];
