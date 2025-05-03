const { validate, Joi } = require('express-validation');


const assignPermissionToRoleValidation = validate({
  body: Joi.object({
    roleId: Joi.number().integer().positive().required().strict(),
    permissions: Joi.array().items(Joi.number().integer()).min(1).optional().strict(),
  }),
});


module.exports = { assignPermissionToRoleValidation };
