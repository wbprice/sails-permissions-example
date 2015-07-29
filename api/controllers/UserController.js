// api/controllers/UserController.js

var _ = require('lodash');
var _super = require('sails-permissions/api/controllers/UserController');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.

  revoke: function(req, res) {

    var userId, roleId,
        userNameToRevoke, roleToRevoke;

    userId = req.param('userid');
    roleId = req.param('roleid');

    User.findOne()
        .where({id: userId})
        .then(function(user) {
          userNameToRevoke = user.username;
          return user;
        })
        .then(function() {

          return Role.findOne()
              .where({id: roleId})
              .then(function(role) {
                roleToRevoke = role.name
                return role;
              });

        })
        .then(function(user) {

          PermissionService.removeUsersFromRole(userNameToRevoke, roleToRevoke).then(function() {
            res.send({
              message: 'should cancel ' + userNameToRevoke + '\'s access to ' + roleToRevoke,
              status: 200,
              role: {
                id: roleId,
                name: roleToRevoke
              }
            });
          });

        });

  }

});
