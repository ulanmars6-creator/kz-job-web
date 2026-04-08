// 验证邮箱验证码并发放JWT token
const { codes } = require('./storage');
const { generateToken } = require('./middleware/auth');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, code } = req.body || {};
  if(!email || !code){
    return res.status(400).json({ error: '邮箱和验证码不能为空' });
  }
  const rec = codes.get(email);
  if(!rec) return res.status(400).json({ ok:false, error: '验证码不存在' });
  if(Date.now() > rec.expires) { codes.delete(email); return res.status(400).json({ ok:false, error:'验证码已过期' }); }
  if(String(rec.code) !== String(code).trim()) return res.status(400).json({ ok:false, error:'验证码错误' });

  // 验证通过：移除验证码并发放JWT token
  codes.delete(email);
  const token = generateToken({ email });
  return res.json({ ok: true, token, user: { email } });
}