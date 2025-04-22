const { Router } = require('express');
const { 
  sendOtpController, 
  checkOtpController, 
  verifyRefreshTokenController
} = require('./auth.controller');

const router = Router();

router.post('/send-otp', sendOtpController);
router.post('/check-otp', checkOtpController);
router.post('/refresh-token', verifyRefreshTokenController);


module.exports = {
  authRoutes: router,
}

