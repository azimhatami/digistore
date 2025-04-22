const { User, Otp } = require('../user/user.model');
const { RefreshToken } = require('../user/refreshToken.model');
const { config } = require('dotenv');
config()
const createError = require('http-errors')
const jwt = require('jsonwebtoken');


async function sendOtpController (req, res, next) {
  try {
    const { mobile } = req.body;
    let code = Math.floor(Math.random() * 99999 - 10000) + 10000;
    let user = await User.findOne({
      where: { mobile },
    });

    let otp = null;

    if (!user) {
      user = await User.create({
        mobile,
      });
      let otp = await Otp.create({
        code,
        expires_in: new Date(Date.now() + 1000 * 60),
        userId: user?.id
      })

      return res.json({
        message: 'OTP send successfully',
        code
      });
    } else {
      otp = await Otp.findOne({where: {userId: user?.id}});
      otp.code = code;
      otp.expires_in = new Date(Date.now() + 1000 * 60);
      await otp.save();

      return res.json({
        message: 'OTP send successfully',
        code
      });
    }

  } catch (error) {
    next(error);
  }
}

async function checkOtpController (req, res, next) {
  try {
    const { mobile, code } = req.body;
    let user = await User.findOne({
      where: { mobile },
      include: [
        {model: Otp, as: 'otp'}
      ]
    });

    if (!user) {
      throw createError(401, 'User account not found')
    }

    if (!user.otp) {
      throw createError(401, 'No OTP found for this user')
    }

    if (user?.otp?.code !== code) {
      throw createError(401, 'OTP code is invalid')
    }

    if (user?.otp?.expires_in < new Date()) {
      throw createError(401, 'OTP code has expired')
    }

    const {accessToken, refreshToken} = generateTokens({ userId: user.id });

    return res.json({
      message: 'Logged in successfully',
      accessToken,
      refreshToken
    });

  } catch (error) {
    next(error);
  }
}

async function verifyRefreshTokenController(req, res, next) {
  try {
    const {refreshToken: token} = req.body;
    if (!token) throw createError(401,  'Login on your account')
    const verified = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    if (verified?.userId) {
      const user = await User.findByPk(verified?.userId);
      if (!user) throw createError(401, 'Login on your account');

      const existToken = await RefreshToken.findOne({
        where: {
          token
        }
      });
      if (existToken) throw createError(401, 'token expired')
      await RefreshToken.create({
        token,
        userId: user.id
      });

      const {accessToken, refreshToken} = generateTokens({ userId: user.id });
      return res.json({
        accessToken,
        refreshToken
      });
    }

  } catch (error) {
    next(error);
  }
}

function generateTokens(payload) {
  const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: '7d'
  });

  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: '30d'
  });
  return {
    accessToken,
    refreshToken
  };
}

module.exports = { 
  sendOtpController,
  checkOtpController,
  verifyRefreshTokenController
}
