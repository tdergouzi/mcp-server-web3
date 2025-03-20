# mcp-server-web3
Web3 function plugin server based on MCP of Anthropic, with HTTP/SSE transport support.

## 分支说明
此分支 (`sse`) 使用HTTP与SSE传输方式实现MCP服务器，允许Web应用程序和远程客户端连接到服务器。

## 先决条件
- Node.js 16+
- Yarn 或 npm

## 安装依赖
```sh
yarn
```

## 构建项目
```sh
yarn build
```

## 运行服务器
```sh
node build/index.js
```

服务器将在以下端点上运行：
- SSE连接: `http://localhost:3001/sse`
- 消息接收: `http://localhost:3001/messages`
- 状态检查: `http://localhost:3001/status`

## 配置
在运行服务器之前，请确保设置环境变量：
```sh
# CoinMarketCap API密钥，用于获取加密货币价格
CMC_API_KEY=your_api_key_here
```

## 客户端使用
客户端应该先连接到SSE端点，然后使用 `/messages` 端点发送命令。

### 可用工具
- `get_token_price`: 获取加密货币当前价格
  - 参数: `symbol` - 加密货币符号（例如 "BTC"）

## 原始README内容
要使用命令行工具方式连接，请切换到 `main` 分支并参考原始README。

```sh
yarn
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