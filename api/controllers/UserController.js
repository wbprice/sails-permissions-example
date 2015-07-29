// api/controllers/UserController.js

var _ = require('lodash');
var _super = require('sails-permissions/api/controllers/UserController');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.


  /**
   * @name UserController#revoke
   * @description
   * A function that handles a request to remove a role from a given user.
   * @example
   * GET /user/:userid/revoke/:roleid
   */

  revoke: function(req, res) {

    var userId, roleId;

    userId = req.param('userid');
    roleId = req.param('roleid');

    User.findOne({id: userId})
    .then(function(user) {

      this.user = user;
      return Role.findOne({id: roleId});

    })
    .then(function(role) {

      this.role = role;
      return PermissionService.removeUsersFromRole(
        this.user.username,
        this.role.name
      );

    })
    .then(function() {

      res.send({
        message: 'Cancelled ' + this.user.name + '\'s access to the role ' + this.role.name,
        status: 200,
        role: {
          id: this.role.id,
          name: this.role.name
        },
        user: {
          id: this.user.id,
          name: this.user.username
        }
      });

    });

  },

  /**
   * @name UserController#search
   * @description
   * A function that checks the list of users to see if any users have names that
   * match the submitted query.
   * @example
   * GET /user/search/:query
   */

  search: function(req, res) {

    var query = req.param('query');

    Role.find()
    .where({name : {startsWith: query}})
    .then(function(response) {

      if (response.length > 0) {
        res.send({
          status: 200,
          matches: response
        });
      } else {
        res.send({
          status: 404,
          matches: [],
          message: 'No matches were found.'
        });
      }

    });

  }

});
