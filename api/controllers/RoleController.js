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

    var modelId, roleId, actionName, conf;

    roleId = req.param('roleid');
    modelId = req.param('modelid');
    actionName = req.param('action');

    Role.findOne({id: roleId})
    .then(function(role) {

      this.role = role;
      return Model.findOne({id: modelId});

    })
    .then(function(model) {

      this.model = model;

      destroyConfiguration = {
        model: model.id,
        role: role.id,
      };

      if (actionName) {
        destroyConfiguration.action = actionName;
      }

      return Permission.destroy(destroyConfiguration);

    })
    .then(function() {

      res.send({
        message: actionName ? 'Removed ' + actionName + ' permissions from the model ' + this.model.name + ' from ' + this.role.name :
                              'Removed permissions from the model ' + this.model.name + ' from ' + this.role.name,
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

    var modelId, roleId, actionName;

    roleId = req.param('roleid');
    modelId = req.param('modelid');
    actionName = req.param('action');

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
          action: actionName
      });

    })
    .then(function() {

      res.send({
        message: 'Added ' + actionName + ' permissions to the model ' + this.model.name + ' for ' + this.role.name,
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
