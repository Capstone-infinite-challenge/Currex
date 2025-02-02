//JWT 생성 및 검증
import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

if (!SECRET_KEY) {
    throw new Error('JWT_SECRET_KEY is not defined in the environment variables');
}

// JWT 생성
function generateToken(payload) {
  const token = sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });
  return token;
}

// JWT 검증
function verifyToken(token) {
  try {
    const decoded = verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

//refresh 토큰 발급
function generateRefreshToken() {
  //refresh token은 payload없이 발급
  const refreshToken = sign({}, SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: "7d",
  });
  return refreshToken;
}

export default {
  generateToken,
  verifyToken,
  generateRefreshToken,
};
