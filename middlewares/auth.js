const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const secretKey = 'dev-secret';

function generateToken(payload) {
  return jwt.sign(payload, secretKey, { expiresIn: '7d' });
}

function checkToken(token) {
  if (!token) {
    return false;
  }
  try {
    return jwt.verify(token, secretKey);
  } catch {
    return false;
  }
}

function checkAuth(req, res, next) {
  const token = req.cookies.jwt;
  const tokenPayload = checkToken(token);
  if (tokenPayload) {
    req.user = tokenPayload;
    return next();
  }
  return res.status(401).json({ message: 'Доступ запрещен' });
}

module.exports = {
  generateToken, checkAuth, secretKey,
};
