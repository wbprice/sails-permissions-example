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
    revoke: true
  },

  RoleController: {
    revoke: true,
    grant: true
  }

};
