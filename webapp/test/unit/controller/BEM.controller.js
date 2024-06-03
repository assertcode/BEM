/*global QUnit*/

sap.ui.define([
	"sapm/bem/controller/BEM.controller"
], function (Controller) {
	"use strict";

	QUnit.module("BEM Controller");

	QUnit.test("I should test the BEM controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
