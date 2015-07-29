// api/controllers/RoleController.js

var _ = require('lodash');
var _super = require('sails-permissions/api/controllers/RoleController');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.

  /**
   * A function that handles a request to revoke all the permissions a given
   * Role has for a given Model.
   * @example
   * GET /role/:roleid/revoke/:modelid
   */

  revokeAll: function(req, res) {

    var modelId, roleId;

    roleId = req.param('roleid');
    modelId = req.param('modelid');

    Role.findOne({id: roleId})
    .then(function(role) {

      this.role = role;
      return Model.findOne({id: modelId});

    })
    .then(function(model) {

      this.model = model;
      return Permission.destroy({
          model: model.id,
          role: role.id
      });

    })
    .then(function() {

      res.send({
        message: 'Removed permissions for ' + this.model.name + ' from ' + this.role.name,
        status: 200
      });

    });

  }

});
