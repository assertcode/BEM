sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Label",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/comp/smartvariants/PersonalizableInfo",
    "sap/ui/core/Fragment"
    
], function(Controller, JSONModel, Label, Filter, FilterOperator, PersonalizableInfo, Fragment) {
    "use strict";

    return Controller.extend("sap.m.bem.controller.BEMDetail", {
        onInit: function() {                  
        
        var sDataPath = sap.ui.require.toUrl("sap/m/bem/flownodes.json");
        var oModel = new JSONModel(sDataPath);
        this.getView().setModel(oModel);
        
        this.oProcessFlow = this.getView().byId("processflow");
        this.oProcessFlow.updateModel(); }

    });
});