import jwt from 'jsonwebtoken';

export const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });

  // In development, we need to set the cookie without httpOnly temporarily to debug
  const cookieOptions = {
    httpOnly: true,
    secure: false, // Must be false in development (http://localhost)
    sameSite: 'lax', // 'lax' works better for localhost
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/',
    domain: undefined // Don't set domain for localhost
  };

  res.cookie('token', token, cookieOptions);

  return token;
};
