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

    console.log(userId, roleId);

    // User.findOne({id: userID}).then(function(err, response) {
    //   console.log('user:');
    //   console.log(response);
    //   return userNameToRevoke = response.username;
    // }).then(function(obj) {
    //   return Role.findOne({id: roleID}).exec(function(err, response) {
    //     console.log('response:');
    //     console.log(response);
    //     return roleToRevoke = response.name;
    //   });
    // }).then(function(obj) {
    //
    //   res.send('should cancel ' + userNameToRevoke + '\'s access to ' + roleToRevoke);
    //
    // });

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
            res.send('should cancel ' + userNameToRevoke + '\'s access to ' + roleToRevoke);
          });

        });

  }

});
