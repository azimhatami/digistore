const {Router} = require('express');
const AuthGuard = require('../auth/auth.guard');
const {
  createRoleController,
  createPermissionController,
  assignPermissionToRoleController
} = require('./rbac.controller');
const { assignPermissionToRoleValidation } = require('./rbac.validation');


const router = Router();

router.post('/role', AuthGuard, createRoleController);
router.post('/permission', AuthGuard, createPermissionController);
router.post(
  '/add-permission-to-role', 
  AuthGuard,
  assignPermissionToRoleValidation, 
  assignPermissionToRoleController
);


module.exports = {
  rbacRoutes: router
}
