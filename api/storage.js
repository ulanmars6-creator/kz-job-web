// 共享存储模块 - 使用文件持久化存储
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const CODES_FILE = path.join(DATA_DIR, 'codes.json');
const RATE_LIMIT_FILE = path.join(DATA_DIR, 'rateLimit.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const JOBS_FILE = path.join(DATA_DIR, 'jobs.json');
const SEEKS_FILE = path.join(DATA_DIR, 'seeks.json');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 辅助函数：读取JSON文件
function readJsonFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }
  return {};
}

// 辅助函数：写入JSON文件
function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

// 初始化数据
let codes = new Map(Object.entries(readJsonFile(CODES_FILE)));
let rateLimit = new Map(Object.entries(readJsonFile(RATE_LIMIT_FILE)));
let users = new Map(Object.entries(readJsonFile(USERS_FILE)));
let jobs = new Map(Object.entries(readJsonFile(JOBS_FILE)));
let seeks = new Map(Object.entries(readJsonFile(SEEKS_FILE)));

// 定期保存数据到文件
setInterval(() => {
  writeJsonFile(CODES_FILE, Object.fromEntries(codes));
  writeJsonFile(RATE_LIMIT_FILE, Object.fromEntries(rateLimit));
  writeJsonFile(USERS_FILE, Object.fromEntries(users));
  writeJsonFile(JOBS_FILE, Object.fromEntries(jobs));
  writeJsonFile(SEEKS_FILE, Object.fromEntries(seeks));
}, 30 * 1000); // 每30秒保存一次

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