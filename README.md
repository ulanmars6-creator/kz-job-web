# 哈萨克斯坦华人职通车

一个专为在哈萨克斯坦的华人打造的双语（中文/哈萨克语）招聘平台。

## 功能特性

- ✅ **双语支持**：中文和哈萨克语切换
- ✅ **邮箱验证登录**：安全的邮箱验证码登录
- ✅ **职位发布**：雇主可以发布招聘信息
- ✅ **求职发布**：求职者可以发布求职意向
- ✅ **个人资料**：用户可以管理个人资料
- ✅ **搜索过滤**：支持职位搜索和城市过滤
- ✅ **数据同步**：支持本地存储和服务器同步

## 部署指南

### 1. Vercel 环境变量配置

在 Vercel 项目设置中添加以下环境变量来启用真实邮件发送：

```bash
# SMTP 配置（必需，用于真实邮件发送）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false

# 可选配置
FROM_EMAIL=your-email@gmail.com
MAIL_SUBJECT=你的登录验证码
```

### Gmail SMTP 设置

1. 启用两步验证
2. 生成应用密码（App Password）
3. 使用应用密码作为 `SMTP_PASS`

### 其他 SMTP 服务商

- **QQ邮箱**：
  ```
  SMTP_HOST=smtp.qq.com
  SMTP_PORT=587
  SMTP_USER=your-qq@qq.com
  SMTP_PASS=your-authorization-code
  ```

- **163邮箱**：
  ```
  SMTP_HOST=smtp.163.com
  SMTP_PORT=465
  SMTP_SECURE=true
  SMTP_USER=your-163@163.com
  SMTP_PASS=your-authorization-code
  ```

## 本地开发

```bash
# 安装依赖
npm install

# 启动本地服务器
python3 -m http.server 8000

# 访问 http://localhost:8000
```

## 项目结构

```
├── index.html          # 主页面
├── api/
│   ├── send-code.js    # 发送验证码 API
│   ├── verify.js       # 验证验证码 API
│   ├── jobs.js         # 职位管理 API
│   ├── seeks.js        # 求职管理 API
│   ├── profile.js      # 用户资料 API
│   └── storage.js      # 共享存储模块
├── vercel.json         # Vercel 部署配置
└── README.md           # 项目说明
```

## API 端点

- `POST /api/send-code` - 发送验证码
- `POST /api/verify` - 验证验证码
- `GET/POST /api/jobs` - 职位管理
- `GET/POST /api/seeks` - 求职管理
- `GET/POST /api/profile` - 用户资料管理

## 技术栈

- **前端**：HTML, CSS (Tailwind), JavaScript
- **后端**：Node.js, Vercel Serverless Functions
- **邮件**：Nodemailer
- **存储**：内存存储（生产环境建议使用数据库）
- **部署**：Vercel

## 数据库集成

当前使用内存存储，生产环境建议集成数据库：

- MongoDB
- PostgreSQL
- Firebase
- Supabase

## 许可证

MIT License