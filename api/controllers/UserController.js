// api/controllers/UserController.js

var _ = require('lodash');
var _super = require('sails-permissions/api/controllers/UserController');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.

  /**
   * @name UserController#revoke
   * @description
   * A method that handles a request to remove a specific role from a given user.
   * @example
   * GET /user/:userid/revoke/:roleid
   * @param {number} :userid
   * id for the model to modify actions on for this role
   * @param {number} :roleid
   * id for the role to be edited
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
   * @name UserController#grant
   * @description
   * A method that handles a request to add a given role to a specific user.
   * @example
   * GET /user/:userid/grant/:roleid
   * @param {number} :userid
   * @param {number} :roleid
   * @returns {object}
   * An object containing a status code and a message advising what role was
   * added to the user.
   */

  grant: function(req, res) {

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

      return PermissionService.addUsersToRole(
        this.user.username,
        this.role.name
      );

    }).then(function() {

      res.send({
        status: 200,
        message: 'the role ' + this.role.name + ' was added to the user ' + this.user.username
      });

    });

  },

  /**
   * @name UserController#search
   * @description
   * Fuzzy search on a budget for Users. Matches using startsWith.
   * @example
   * GET /user/search/:query
   * @param {string} :query
   * @returns {object}
   * An object containing a status code and a list of matches.
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
