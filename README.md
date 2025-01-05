# mcp-server-web3
The web3 function plugin server base on MCP of Anthropic.

```sh
# For MacOS
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