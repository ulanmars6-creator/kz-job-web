const { users } = require('./storage');
const { authenticateToken } = require('./middleware/auth');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // 获取用户资料（需要认证）
    authenticateToken(req, res, () => {
      const email = req.user.email;
      const user = users.get(email);
      if (!user) {
        return res.status(404).json({ error: '用户资料不存在' });
      }
      return res.json({ user });
    });
    return;
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    // 创建或更新用户资料（需要认证）
    authenticateToken(req, res, () => {
      const email = req.user.email;
      const { name, phone, location, bio, skills, experience } = req.body || {};

      const user = {
        email,
        name,
        phone,
        location,
        bio,
        skills,
        experience,
        updatedAt: Date.now(),
        createdAt: users.get(email)?.createdAt || Date.now()
      };

      users.set(email, user);
      return res.json({ ok: true, user });
    });
    return;
  }

  return res.status(405).json({ error: '不支持的请求方法' });
}