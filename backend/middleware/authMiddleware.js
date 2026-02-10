import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'smartloansecret';

// Simple auth middleware that reads JWT from `x-auth-token`
export const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'No auth token, access denied' });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);

    // We store `{ user: { id } }` in the token
    req.user = data.user;
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(401).json({ message: 'Invalid auth token' });
  }
};

