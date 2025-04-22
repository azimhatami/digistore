const { User, Otp } = require('../user/user.model');
const createError = require('http-errors')


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

    return res.json({
      message: 'Logged in successfully',
    });

  } catch (error) {
    next(error);
  }
}

module.exports = { 
  sendOtpController,
  checkOtpController
}
