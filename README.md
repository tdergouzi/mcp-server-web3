# mcp-server-web3

[![smithery badge](https://smithery.ai/badge/@tdergouzi/mcp-server-web3)](https://smithery.ai/server/@tdergouzi/mcp-server-web3)

The web3 function plugin server base on MCP of Anthropic.

## Install the libs

```sh
yarn
```

### Installing via Smithery

To install Web3 Function Plugin Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@tdergouzi/mcp-server-web3):

```bash
npx -y @smithery/cli install @tdergouzi/mcp-server-web3 --client claude
```

## Build the code into index.js
```sh
yarn build
```

## Update the MCP server config according to the client
```sh
# MacOS and Claude client
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

```json
{
    "mcpServers": {
        "web3": {
            "command": "node",
            "args": ["/ABSOLUTE/PATH/TO/PARENT/FOLDER/mcp-server-web3/build/index.js"],
            "env":{
              "CMC_API_KEY": "your cmc api key"
            }
        }
    }
}
```
