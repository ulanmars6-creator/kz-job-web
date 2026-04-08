const { jobs } = require('./storage');
const { authenticateToken } = require('./middleware/auth');

export default async function handler(req, res) {
  console.log(`[${new Date().toISOString()}] ${req.method} /api/jobs from ${req.headers['x-forwarded-for'] || 'unknown'}`);

  if (req.method === 'GET') {
    // 获取所有职位
    const jobList = Array.from(jobs.values()).sort((a, b) => b.createdAt - a.createdAt);
    return res.json({ jobs: jobList });
  }

  if (req.method === 'POST') {
    // 发布新职位（需要认证）
    authenticateToken(req, res, () => {
      const { title, company, location, salary, description, requirements, contact, employerEmail } = req.body || {};

      if (!title || !company || !location) {
        return res.status(400).json({ error: '职位标题、公司和地点不能为空' });
      }

      const jobId = Date.now().toString();
      const job = {
        id: jobId,
        title,
        company,
        location,
        salary,
        description,
        requirements,
        contact,
        employerEmail: req.user.email, // 使用认证用户的邮箱
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      jobs.set(jobId, job);
      return res.json({ ok: true, job });
    });
    return;
  }

  if (req.method === 'DELETE') {
    // 删除职位（需要认证，且只能删除自己的职位）
    authenticateToken(req, res, () => {
      const { id } = req.query || {};
      if (!id) {
        return res.status(400).json({ error: '职位ID不能为空' });
      }

      const job = jobs.get(id);
      if (!job) {
        return res.status(404).json({ error: '职位不存在' });
      }

      // 检查是否是职位发布者
      if (job.employerEmail !== req.user.email) {
        return res.status(403).json({ error: '无权删除此职位' });
      }

      jobs.delete(id);
      return res.json({ ok: true });
    });
    return;
  }

  return res.status(405).json({ error: '不支持的请求方法' });
}