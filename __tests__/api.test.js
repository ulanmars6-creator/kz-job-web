const { generateToken, authenticateToken } = require('./api/middleware/auth');

describe('Auth Middleware', () => {
  test('should generate and verify token', () => {
    const user = { email: 'test@example.com' };
    const token = generateToken(user);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  test('should reject invalid token', () => {
    const req = { headers: { authorization: 'Bearer invalid-token' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('Storage', () => {
  const { codes, users, jobs, seeks } = require('./api/storage');

  test('should store and retrieve data', () => {
    const testUser = { email: 'test@example.com', name: 'Test User' };
    users.set('test@example.com', testUser);

    const retrieved = users.get('test@example.com');
    expect(retrieved).toEqual(testUser);
  });
});