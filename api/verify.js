// 简单内存存储，仅用于示例（生产环境请使用数据库）
const { codes } = require('./storage');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, code } = req.body || {};
  if(!email || !code){
    return res.status(400).json({ error: 'invalid_payload' });
  }
  const rec = codes.get(email);
  if(!rec) return res.status(400).json({ ok:false, error: 'no_code' });
  if(Date.now() > rec.expires) { codes.delete(email); return res.status(400).json({ ok:false, error:'expired' }); }
  if(String(rec.code) !== String(code).trim()) return res.status(400).json({ ok:false, error:'invalid' });
  // 验证通过：移除并返回成功（此处应创建会话/发放 token，这里仅示例）
  codes.delete(email);
  return res.json({ ok: true });
}