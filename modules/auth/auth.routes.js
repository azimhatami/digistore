const { Router } = require('express');
const { sendOtpController } = require('./auth.controller');

const router = Router();

router.post('/send-otp', sendOtpController);


module.exports = {
  authRoutes: router,
}

