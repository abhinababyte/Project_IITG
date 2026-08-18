const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded; // Contains { id: user.id }
    next();
  } catch (ex) {
    res.status(400).json({ error: 'Invalid token.' });
  }
}

module.exports = verifyToken;
