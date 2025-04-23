const { User } = require('../user/user.model');
const jwt = require('jsonwebtoken');
const createError = require('http-errors')


async function AuthGuard(req, res, next) {
  try {
    const authorization = req?.headers?.authorization ?? undefined;
    if (!authorization) throw createError(401,  'Login on your account')
    const [bearer, token] =  authorization.split(' ');

    if (!bearer || bearer?.toLowerCase() !== 'bearer') throw createError(401, 'Login on your account');

    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (verified?.userId) {
      const user = await User.findByPk(verified?.userId);
      if (!user) throw createError(401, 'Login on your account');
      req.user = {
        id: user.id,
        mobile: user.mobile,
        fullname: user.fullname
      }
      return next();
    }

    throw createError(401, 'Login on your account')

  } catch (error) {
    next(error);
  }
}


module.exports = AuthGuard;
