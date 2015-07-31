// api/controllers/RoleController.js

var _ = require('lodash');
var _super = require('sails-permissions/api/controllers/RoleController');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.

  /**
   * @name RoleController#revoke
   * @description
   * A function that handles a request to remove one or more actions that a given
   * role can take on an entry with a given model.
   * @example
   * GET /role/:roleid/revoke/:modelid/:action?
   * @param {number} :roleid
   * id for the role to be edited
   * @param {number} :modelid
   * id for the model to modify actions on for this role
   * @param {string=} action
   * Optional param. If specified, will remove one particular action.
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

      /**
       * If the action key isn't in the object passed to #destroy, all CRUD
       * actions will be removed.
       */

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
   * A function that handles a request to grant a given role the ability to
   * perform a specific action on an entry belonging to a given model.
   * @example
   * GET /role/:roleid/revoke/:modelid/:action
   * @param {number} :roleid
   * @param {number} :modelid
   * @param {string} :action
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
   * Fuzzy search on a budget.  Matches the beginning of a string
   * and returns an array of similar matches from available Roles.
   * @example
   * GET /role/search/:query
   * @param {string} :query
   * The query to find similar results for.
   * @returns {object}
   * An object containing a status and an array containing matches.
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
    * A method that creates a new role and allows it to perform specified actions
    * on a given number of models.
    * @example
    * POST /role/create
    * @returns {object}
    * An object containing a status code, a message advising the developer what
    * role was created and what permissions were added, and the role object.
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

        _.forEach(model.permissions, function(value, key) {

          if (value) {

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
