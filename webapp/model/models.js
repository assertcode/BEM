sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
],
    function (JSONModel, Device) {
        "use strict";

        return {
            /**
             * Provides runtime info for the device the UI5 app is running on as JSONModel
             */
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },

            createAllegatiModel: function () {
                var oModel = new JSONModel({ "Allegati": [] });
                return oModel;

            },

            createAreaFModel: function () {
                var oModel = new JSONModel({ enumerationValues: [] });
                return oModel;
            },

            createAreaModel: function () {
                var oModel = new JSONModel({ enumerationValues: [] });
                return oModel;
            },

            FileUpload: function () {
                var oModel = new JSONModel({
                    "ItemName": "", "SelectedCategory": "01", "FileCategory": [
                        { categoryId: "01", categoryText: "Preventivo o altro" },
                        { categoryId: "02", categoryText: "Contratto" },
                        { categoryId: "03", categoryText: "Verbale di coordinamento" },
                        { categoryId: "04", categoryText: "Subappalto" },
                        { categoryId: "05", categoryText: "Richieste Clienti" },
                        { categoryId: "06", categoryText: "Contabilità lavori – costo" },
                    ]
                });
                return oModel;
            },

            createAllegatiConfig: function () {
                var oModel = new JSONModel([
                    { "Societa": 'FACI', "Id": 'f6cab13f-4db1-4658-a9e7-ba04833c75d0' },
                    { "Societa": 'CSTA', "Id": 'b26e0323-485e-400b-ab7f-ce250a860473' },
                    { "Societa": 'FLET', "Id": 'a8fbf5a8-d793-4404-ad94-a6307f4eda60' },
                    { "Societa": 'GETA', "Id": '97509354-5a07-48d4-ac48-7feef062e81e' },
                    { "Societa": 'GS4', "Id": '54a1f993-0712-4d97-9c33-8a7bee0296f3' },
                    { "Societa": 'INLO', "Id": 'c0b433bc-db8d-4083-b5a3-997619e49f70' },
                    { "Societa": 'ISOM', "Id": '222f712d-0a37-41f8-a36c-7d5e4abc9018' },
                    { "Societa": 'KANA', "Id": '3d35553c-1284-41bd-b238-8cddf0f0984d' },
                    { "Societa": 'RAIL', "Id": 'deacb828-58cd-45eb-8eea-d4854665fb7f' },
                    { "Societa": 'SANG', "Id": 'dafc791c-d166-4570-9e41-d3a65123ec7c' },
                    { "Societa": 'SINT', "Id": '4c60737b-31cc-4931-a306-87df336e9979' }
                ]);
                return oModel;
            },

            createDocStz: function () {
                var oModel = new JSONModel([]);
                return oModel;

            }

        };

    });