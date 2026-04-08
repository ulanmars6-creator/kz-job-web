const nodemailer = require('nodemailer');
const { codes, rateLimit } = require('./storage');

// 创建邮件传输（如果未配置，会保留为 null）
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER) {
  transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

function generateCode(){
  return String(Math.floor(100000 + Math.random()*900000));
}

function canSend(email){
  const rec = rateLimit.get(email);
  if(!rec) return true;
  const now = Date.now();
  // 最小间隔 60s
  return (now - rec.lastSent) > 60*1000;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '不支持的请求方法' });
  }

  const { email } = req.body || {};
  if(!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
    return res.status(400).json({ error: '邮箱格式不正确' });
  }
  if(!canSend(email)){
    return res.status(429).json({ error: '发送过于频繁，请稍后再试' });
  }
  const code = generateCode();
  const expires = Date.now() + 15*60*1000; // 15 分钟
  codes.set(email, { code, expires });
  rateLimit.set(email, { lastSent: Date.now() });

  if(transporter){
    try{
      const info = await transporter.sendMail({
        from: process.env.FROM_EMAIL || process.env.SMTP_USER,
        to: email,
        subject: process.env.MAIL_SUBJECT || '你的登录验证码',
        text: `你的验证码：${code} 。15分钟内有效。`
      });
      return res.json({ ok: true, messageId: info.messageId });
    } catch(err){
      console.error('mail send error', err);
      return res.status(500).json({ ok:false, error: '邮件发送失败，请稍后重试' });
    }
  } else {
    // 开发模式：将验证码返回给客户端（仅用于本地测试）
    console.log('[DEV] generated code for', email, code);
    return res.json({ ok: true, devCode: code });
  }
}