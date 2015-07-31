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

  /**
   * @name RoleController#grant
   * @description
   * A function that handles a request to grant a specific permission a given
   * Role has for a given Model. Requires :action, which is a string
   * that matches a specific action.
   * @example
   * GET /role/:roleid/revoke/:modelid/:action
   */

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

  /**
   * @name RoleController#search
   * @description
   * A function that checks a list of roles that exist in the database.
   * @example
   * GET /role/:roleid/revoke/:modelid/:action
   */

   search: function(req, res) {

     var query = req.param('query');

     Model.find()
     .where({name: {startsWith: query}})
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

   },

   /**
    * @name RoleController#create
    * @description
    * A function that creates a new role, using names and permissions as passed
    * in the request object.
    * @example
    * POST /role/create
    */

    create: function(req, res) {

      var actions = [];

      Role.create({
        name: req.query.name
      })
      .then(function(role) {

        this.role = role;

        return JSON.parse(req.query.props);

      }).map(function(model) {

        this.model = model;

        _.forEach(model.permissions, function(el, key) {

          if (el) {

            actions.push(
              Permission.create({
                model: model.id,
                action: key,
                role: this.role.id
              })
            );

          }

        });

        return Promise.all(actions);

      }).then(function() {

        res.send({
          status: 200,
          message: 'A role ' + this.role.name + ' was created and has actions: ' + JSON.stringify(this.model.permissions) + ' on ' + this.model.name + '.',
          role: this.role
        });

      });

    }

});
