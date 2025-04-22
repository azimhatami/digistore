const { User, Otp } = require('../user/user.model');

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

      return res.json({
        message: 'OTP send successfully',
        code
      });
    }

  } catch (error) {
    next(error);
  }
}

module.exports = { 
  sendOtpController,
}
