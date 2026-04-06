kz-auth-server

示例后端（Node/Express）：发送并验证邮箱验证码。

快速开始

1. 进入目录并安装依赖：

```bash
cd auth-server
npm install
```

2. 复制 `.env.example` 为 `.env` 并填写 SMTP 配置。如果没有 SMTP，可保持为空，服务器会在响应中返回 devCode（仅用于开发测试）。

3. 启动服务器：

```bash
npm start
```

接口

POST /send-code
- 请求体: { "email": "user@example.com" }
- 如果配置了 SMTP，会向邮箱发送验证码并返回 { ok:true }
- 未配置 SMTP（开发模式）会返回 { ok:true, devCode: "123456" }

POST /verify
- 请求体: { "email": "user@example.com", "code": "123456" }
- 返回 { ok:true } 表示通过

示例 curl

发送验证码（开发模式会返回 devCode）：

```bash
curl -X POST http://localhost:3001/send-code -H "Content-Type: application/json" -d '{"email":"you@example.com"}'
```

验证验证码：

```bash
curl -X POST http://localhost:3001/verify -H "Content-Type: application/json" -d '{"email":"you@example.com","code":"123456"}'
```

注意

- 本示例为演示用，内存存储和返回 devCode 仅用于本地开发测试。生产环境请使用持久化存储并通过邮件服务发送验证码，验证通过后发放安全的会话 token（JWT 或服务器 session）。
