import { randomBytes } from 'node:crypto';

import { Session } from '../models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
};

export const createSession = async (userId) => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

export const setSessionCookies = (res, session) => {
  res.cookie('accessToken', session.accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: FIFTEEN_MINUTES,
  });
  res.cookie('refreshToken', session.refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: ONE_DAY,
  });
  res.cookie('sessionId', session._id.toString(), {
    ...COOKIE_OPTIONS,
    maxAge: ONE_DAY,
  });
};

export const clearSessionCookies = (res) => {
  res.clearCookie('accessToken', COOKIE_OPTIONS);
  res.clearCookie('refreshToken', COOKIE_OPTIONS);
  res.clearCookie('sessionId', COOKIE_OPTIONS);
};
