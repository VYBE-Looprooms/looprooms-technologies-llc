const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize, User, Session } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'vybe-dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS, 10) || 12;

const normalizeEmail = (email) => email.trim().toLowerCase();

const buildAuthPayload = (userInstance) => {
  const user = userInstance.toSafeJSON ? userInstance.toSafeJSON() : userInstance.toJSON();
  const token = jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  const decoded = jwt.decode(token);
  const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : null;

  return {
    user,
    token,
    expiresAt,
  };
};

const createSessionRecord = async ({ userId, token, expiresAt, userAgent, ipAddress, transaction }) => {
  await Session.create(
    {
      userId,
      token,
      expiresAt,
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
    },
    { transaction }
  );
};

const register = async ({ firstName, lastName, email, password, userAgent, ipAddress }) => {
  const normalizedEmail = normalizeEmail(email);

  return sequelize.transaction(async (transaction) => {
    const existingUser = await User.unscoped().findOne({
      where: { email: normalizedEmail },
      transaction,
    });

    if (existingUser) {
      const error = new Error('Email already registered');
      error.statusCode = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const user = await User.create(
      {
        firstName,
        lastName,
        email: normalizedEmail,
        passwordHash,
        role: 'user',
        status: 'active',
      },
      { transaction }
    );

    const authPayload = buildAuthPayload(user);

    await createSessionRecord({
      userId: user.id,
      token: authPayload.token,
      expiresAt: authPayload.expiresAt,
      userAgent,
      ipAddress,
      transaction,
    });

    return authPayload;
  });
};

const login = async ({ email, password, userAgent, ipAddress }) => {
  const normalizedEmail = normalizeEmail(email);

  const user = await User.scope('withSensitive').findOne({ where: { email: normalizedEmail } });

  if (!user || !user.passwordHash) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const authPayload = buildAuthPayload(user);

  await createSessionRecord({
    userId: user.id,
    token: authPayload.token,
    expiresAt: authPayload.expiresAt,
    userAgent,
    ipAddress,
  });

  return authPayload;
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const revokeSession = async (token) => {
  await Session.destroy({ where: { token } });
};

const refresh = async ({ token, userAgent, ipAddress }) => {
  const decoded = verifyToken(token);

  if (!decoded?.sub) {
    const error = new Error('Invalid session token');
    error.statusCode = 401;
    throw error;
  }

  const user = await User.findByPk(decoded.sub);

  if (!user) {
    const error = new Error('User not found for session');
    error.statusCode = 404;
    throw error;
  }

  await revokeSession(token);

  const authPayload = buildAuthPayload(user);

  await createSessionRecord({
    userId: user.id,
    token: authPayload.token,
    expiresAt: authPayload.expiresAt,
    userAgent,
    ipAddress,
  });

  return authPayload;
};

module.exports = {
  register,
  login,
  refresh,
  verifyToken,
  revokeSession,
};
