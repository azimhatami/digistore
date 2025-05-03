const { Role, Permission, RolePermission } = require('./rbac.model');
const createError = require('http-errors');
const { Op } = require('sequelize');


async function createRoleController(req, res, next) {
  try {
    const { title, description } = req.body;
    const existRole = await Role.findOne({where: {title}});
    if (existRole) throw createError(409, 'already exist role title');
    await Role.create({
      title,
      description
    });

    return res.json({
      message: 'role created successfully',
    });
  } catch (error) {
    next(error);
  }
}

async function createPermissionController(req, res, next) {
  try {
    const { title, description } = req.body;
    const existPermission = await Permission.findOne({where: {title}});
    if (existPermission) throw createError(409, 'already exist permission title');
    await Permission.create({
      title,
      description
    });

    return res.json({
      message: 'permission created successfully',
    });
  } catch (error) {
    next(error);
  }
}

async function assignPermissionToRoleController(req, res, next) {
  try {
    let {roleId, permissions = []} = req.body;
    const role = await Role.findOne({where: {id: roleId}});
    if (!role) throw createError(404, 'not found role');
    if (permissions.length > 0) {
      const permissionCount = await Permission.count({where: {id: {[Op.in]: permissions}}});
      if (permissionCount !== permissions.length) {
        throw createError(400, 'send correct list of permissions');
      };
      const permissionList = permissions.map((per) => ({
        roleId,
        permissionId: per
      }));
      await RolePermission.bulkCreate(permissionList);
    };

    return res.json({
      message: "assigned permissions to role",
    });
  } catch (error) {
    next(error)
  }
}


module.exports = {
  createRoleController,
  createPermissionController,
  assignPermissionToRoleController
}
