const { seeks } = require('./storage');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // 获取所有求职意向
    const seekList = Array.from(seeks.values()).sort((a, b) => b.time - a.time);
    return res.json({ seeks: seekList });
  }

  if (req.method === 'POST') {
    // 发布新求职意向
    const { name, contact, city, position, summary, salary } = req.body || {};

    if (!position) {
      return res.status(400).json({ error: 'missing_position' });
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
      time: Date.now()
    };

    seeks.set(seekId, seek);
    return res.json({ ok: true, seek });
  }

  if (req.method === 'DELETE') {
    // 删除求职意向
    const { id } = req.query || {};
    if (!id) {
      return res.status(400).json({ error: 'missing_seek_id' });
    }

    if (seeks.has(id)) {
      seeks.delete(id);
      return res.json({ ok: true });
    } else {
      return res.status(404).json({ error: 'seek_not_found' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}