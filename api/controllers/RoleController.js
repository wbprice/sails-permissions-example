// api/controllers/RoleController.js

var _ = require('lodash');
var _super = require('sails-permissions/api/controllers/RoleController');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.

  /**
   * @name RoleController#revoke
   * @description
   * A function that handles a request to revoke all the permissions a given
   * Role has for a given Model.  Takes an option :action, which is a string
   * that matches a specific action.
   * @example
   * GET /role/:roleid/revoke/:modelid/:action?
   */

  revoke: function(req, res) {

    var modelId, roleId, actionId;

    roleId = req.param('roleid');
    modelId = req.param('modelid');
    actionId = req.param('action');

    Role.findOne({id: roleId})
    .then(function(role) {

      this.role = role;
      return Model.findOne({id: modelId});

    })
    .then(function(model) {

      this.model = model;
      return Permission.destroy({
          model: model.id,
          role: role.id,
          action: actionId
      });

    })
    .then(function() {

      res.send({
        message: 'Removed permissions for ' + this.model.name + ' from ' + this.role.name,
        status: 200,
        model: {
          id: this.model.id,
          name: this.model.name
        },
        role: {
          id: this.role.id,
          name: this.role.name
        }
      });

    });

  },

  grant: function(req, res) {

    var modelId, roleId, actionId;

    roleId = req.param('roleid');
    modelId = req.param('modelid');
    actionId = req.param('action');

    Role.findOne({id: roleId})
    .then(function(role) {

      this.role = role;
      return Model.findOne({id: modelId});

    })
    .then(function(model) {

      this.model = model;
      return Permission.create({
          model: model.id,
          role: role.id,
          action: actionId
      });

    })
    .then(function() {

      res.send({
        message: 'Removed permissions for ' + this.model.name + ' from ' + this.role.name,
        status: 200,
        model: {
          id: this.model.id,
          name: this.model.name
        },
        role: {
          id: this.role.id,
          name: this.role.name
        }
      });

    });

  },

});
