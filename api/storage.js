// 共享存储模块 - 用于验证码和数据存储
const codes = new Map(); // email -> { code, expires }
const rateLimit = new Map(); // email -> { lastSent }
const users = new Map(); // email -> user profile
const jobs = new Map(); // jobId -> job data
const seeks = new Map(); // seekId -> seek data

// 清理过期验证码
setInterval(() => {
  const now = Date.now();
  for (const [email, rec] of codes.entries()) {
    if (now > rec.expires) {
      codes.delete(email);
    }
  }
}, 60 * 1000); // 每分钟清理一次

module.exports = {
  codes,
  rateLimit,
  users,
  jobs,
  seeks
};