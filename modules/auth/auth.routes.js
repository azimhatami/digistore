const { Router } = require('express');
const { sendOtpController, checkOtpController} = require('./auth.controller');

const router = Router();

router.post('/send-otp', sendOtpController);
router.post('/check-otp', checkOtpController);


module.exports = {
  authRoutes: router,
}

