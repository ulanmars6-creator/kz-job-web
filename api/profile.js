const { users } = require('./storage');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // 获取用户资料
    const { email } = req.query || {};
    if (!email) {
      return res.status(400).json({ error: 'missing_email' });
    }

    const user = users.get(email);
    if (!user) {
      return res.status(404).json({ error: 'user_not_found' });
    }

    return res.json({ user });
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    // 创建或更新用户资料
    const { email, name, phone, location, bio, skills, experience } = req.body || {};

    if (!email) {
      return res.status(400).json({ error: 'missing_email' });
    }

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
  }

  return res.status(405).json({ error: 'Method not allowed' });
}