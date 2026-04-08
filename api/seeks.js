const { seeks } = require('./storage');
const { authenticateToken } = require('./middleware/auth');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // 获取所有求职意向
    const seekList = Array.from(seeks.values()).sort((a, b) => b.time - a.time);
    return res.json({ seeks: seekList });
  }

  if (req.method === 'POST') {
    // 发布新求职意向（需要认证）
    authenticateToken(req, res, () => {
      const { name, contact, city, position, summary, salary } = req.body || {};

      if (!position) {
        return res.status(400).json({ error: '职位不能为空' });
      }

      const seekId = Date.now().toString();
      const seek = {
        id: seekId,
        name,
        contact,
        city,
        position,
        summary,
        salary,
        email: req.user.email, // 使用认证用户的邮箱
        time: Date.now()
      };

      seeks.set(seekId, seek);
      return res.json({ ok: true, seek });
    });
    return;
  }

  if (req.method === 'DELETE') {
    // 删除求职意向（需要认证，且只能删除自己的）
    authenticateToken(req, res, () => {
      const { id } = req.query || {};
      if (!id) {
        return res.status(400).json({ error: '求职ID不能为空' });
      }

      const seek = seeks.get(id);
      if (!seek) {
        return res.status(404).json({ error: '求职意向不存在' });
      }

      // 检查是否是发布者
      if (seek.email !== req.user.email) {
        return res.status(403).json({ error: '无权删除此求职意向' });
      }

      seeks.delete(id);
      return res.json({ ok: true });
    });
    return;
  }

  return res.status(405).json({ error: '不支持的请求方法' });
}