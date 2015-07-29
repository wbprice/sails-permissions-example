module.exports.policies = {
  '*': [
    'basicAuth',
    'passport',
    'sessionAuth',
    'ModelPolicy',
    'AuditPolicy',
    'OwnerPolicy',
    'PermissionPolicy',
    'RolePolicy',
    'CriteriaPolicy'
  ],

  AuthController: {
    '*': ['passport']
  },

  UserController: {
    revoke: true,
    grant: true,
    search: true
  },

  RoleController: {
    revoke: true,
    grant: true,
    search: true,
    create: true
  }

};
