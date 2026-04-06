const { jobs } = require('./storage');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // 获取所有职位
    const jobList = Array.from(jobs.values()).sort((a, b) => b.createdAt - a.createdAt);
    return res.json({ jobs: jobList });
  }

  if (req.method === 'POST') {
    // 发布新职位
    const { title, company, location, salary, description, requirements, contact, employerEmail } = req.body || {};

    if (!title || !company || !location) {
      return res.status(400).json({ error: 'missing_required_fields' });
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
      employerEmail,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    jobs.set(jobId, job);
    return res.json({ ok: true, job });
  }

  if (req.method === 'DELETE') {
    // 删除职位（需要验证权限）
    const { id } = req.query || {};
    if (!id) {
      return res.status(400).json({ error: 'missing_job_id' });
    }

    if (jobs.has(id)) {
      jobs.delete(id);
      return res.json({ ok: true });
    } else {
      return res.status(404).json({ error: 'job_not_found' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}