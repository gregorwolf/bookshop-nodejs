sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/base/Log",
	"sap/m/MessageToast"
], function (Controller, Log, MessageToast) {
	"use strict";
	return Controller.extend("my.bookshop.appadmin.controller.NewAuthor", {
		
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf getinge.com.MONA.view.NewAuthor
		 */
		onInit: function () {
			this.handleNavigationWithContext();
			this._oODataModel = this.getOwnerComponent().getModel();
			this._Log = Log;
		},
		/**
		 * Called when new outage should be saved
		 * @memberOf getinge.com.MONA.view.NewAuthor
		 */
		onSave: function () {
			if (!this._oODataModel.hasPendingChanges()) {
				Log.Error("There are no pending changes");
				return;
			}
			//check input
			this._oODataModel.submitChanges();
		},

		/**
		 * @memberOf getinge.com.MONA.view.NewAuthor
		 */
		handleNavigationWithContext: function () {
			var sRouteName;

			function _onBindingChange(oEvent) {
				// No data for the binding
				if (!this.getView().getBindingContext()) {
					//Need to insert default fallback route to load when requested route is not found.
					this.getOwnerComponent().getRouter().getTargets().display("");
				}
			}
			if (this.getOwnerComponent().getRouter) {
				var oRouter = this.getOwnerComponent().getRouter();
				var oManifest = this.getOwnerComponent().getMetadata().getManifest();
				var content = this.getView().getContent();
				if (content) {
					var oNavigation = oManifest["sap.ui5"].routing.additionalData;
					var oContext = oNavigation[this.getView().getViewName()];
					sRouteName = oContext.routeName;
					oRouter.getRoute(sRouteName).attachMatched(this._onRouteMatched.bind(this));
				}
			}
		},
		_onRouteMatched: function (oEvent) {
			var oView = this.getView();
			var properties = {};
			// TODO: Adjust for OData V4
			var oContext = this._oODataModel.createEntry("Authors", {
				properties: properties,
				success: this._fnEntityCreated.bind(this),
				error: this._fnEntityCreationFailed.bind(this)
			});
			oView.setBindingContext(oContext);
		},
		/**
		 * Handles the success of creating an object
		 *@param {object} oData the response of the save action
		 * @private
		 */
		_fnEntityCreated: function (oData) {
			this._Log.info("ID of created Author: " + oData.ID);
			this.getOwnerComponent().getRouter().navTo("object", {
				objectId: oData.ID
			});
		},
		/**
		 * Handles the failure of creating/updating an object
		 * @private
		 */
		_fnEntityCreationFailed: function () {
				this._Log.error("Creation of Author failed");
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf getinge.com.MONA.view.NewAuthor
			 */
			//	onBeforeRendering: function() {
			//
			//	},
			/**
			 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
			 * This hook is the same one that SAPUI5 controls get after being rendered.
			 * @memberOf getinge.com.MONA.view.NewAuthor
			 */
			//	onAfterRendering: function() {
			//
			//	},
			/**
			 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
			 * @memberOf getinge.com.MONA.view.NewAuthor
			 */
			//	onExit: function() {
			//
			//	}
			,
		/**
		 *@memberOf getinge.com.MONA.controller.NewAuthor
		 */
		action: function (oEvent) {
			var that = this;
			var actionParameters = JSON.parse(oEvent.getSource().data("wiring").replace(/'/g, "\""));
			var eventType = oEvent.getId();
			var aTargets = actionParameters[eventType].targets || [];
			aTargets.forEach(function (oTarget) {
				var oControl = that.byId(oTarget.id);
				if (oControl) {
					var oParams = {};
					for (var prop in oTarget.parameters) {
						oParams[prop] = oEvent.getParameter(oTarget.parameters[prop]);
					}
					oControl[oTarget.action](oParams);
				}
			});
			var oNavigation = actionParameters[eventType].navigation;
			if (oNavigation) {
				var oParams = {};
				(oNavigation.keys || []).forEach(function (prop) {
					oParams[prop.name] = encodeURIComponent(JSON.stringify({
						value: oEvent.getSource().getBindingContext(oNavigation.model).getProperty(prop.name),
						type: prop.type
					}));
				});
				if (Object.getOwnPropertyNames(oParams).length !== 0) {
					this.getOwnerComponent().getRouter().navTo(oNavigation.routeName, oParams);
				} else {
					this.getOwnerComponent().getRouter().navTo(oNavigation.routeName);
				}
			}
		}
	});
});