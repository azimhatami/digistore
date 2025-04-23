const { Router } = require('express');
const { 
  sendOtpController, 
  checkOtpController, 
  verifyRefreshTokenController
} = require('./auth.controller');

const AuthGuard = require('./auth.guard');

const router = Router();

router.post('/send-otp', sendOtpController);
router.post('/check-otp', checkOtpController);
router.post('/refresh-token', verifyRefreshTokenController);
router.get('/check-login', AuthGuard, (req, res, next) => {
  return res.json(req.user ?? {});
});


module.exports = {
  authRoutes: router,
}

