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

        createTrialDataModel: function () {
            var oModel = new JSONModel({

                ConsultCollection : [
                    {
                        "DocAcq": 'Prodotto A',
                        "Pos": '1',
                        "SubappaltoOK": 'true',
                        "Materiale": 'Materiale A',
                        "TestoBreve": 'Descrizione Breve A',
                        "Quantita": 10,
                        "QuantitaResidua": 5,
                        "Valore": 1000,
                        "ValoreResiduo": 500,
                        "ImpDivInt": 100,
                        "UMO": 'PZ',
                        "PrzNetto": 50,
                        "DettaglioTicket": 'true',
                        "DataInizioAttivita": new Date(),
                        "DataFineAttivita": new Date(),
                        "SedeTecnica": 'Sede Tecnica A',
                        "DescSedeTecnica": 'Descrizione Sede Tecnica A'
                    },
                    {
                        "DocAcq": 'Prodotto B',
                        "Pos": '2',
                        "SubappaltoOK": 'false',
                        "Materiale": 'Materiale B',
                        "TestoBreve": 'Descrizione Breve B',
                        "Quantita": 20,
                        "QuantitaResidua": 10,
                        "Valore": 2000,
                        "ValoreResiduo": 1000,
                        "ImpDivInt": 200,
                        "UMO": 'KG',
                        "PrzNetto": 100,
                        "DettaglioTicket": 'false',
                        "DataInizioAttivita": new Date(),
                        "DataFineAttivita": new Date(),
                        "SedeTecnica": 'Sede Tecnica B',
                        "DescSedeTecnica": 'Descrizione Sede Tecnica B'
                    },
                    {
                        "DocAcq": 'Prodotto C',
                        "Pos": '3',
                        "SubappaltoOK": 'true',
                        "Materiale": 'Materiale C',
                        "TestoBreve": 'Descrizione Breve C',
                        "Quantita": 15,
                        "QuantitaResidua": 7,
                        "Valore": 1500,
                        "ValoreResiduo": 700,
                        "ImpDivInt": 150,
                        "UMO": 'L',
                        "PrzNetto": 75,
                        "DettaglioTicket": 'true',
                        "DataInizioAttivita": new Date(),
                        "DataFineAttivita": new Date(),
                        "SedeTecnica": 'Sede Tecnica C',
                        "DescSedeTecnica": 'Descrizione Sede Tecnica C'
                    },
                    {
                        "DocAcq": 'Prodotto D',
                        "Pos": '4',
                        "SubappaltoOK": 'false',
                        "Materiale": 'Materiale D',
                        "TestoBreve": 'Descrizione Breve D',
                        "Quantita": 30,
                        "QuantitaResidua": 15,
                        "Valore": 3000,
                        "ValoreResiduo": 1500,
                        "ImpDivInt": 300,
                        "UMO": 'M',
                        "PrzNetto": 150,
                        "DettaglioTicket": 'false',
                        "DataInizioAttivita": new Date(),
                        "DataFineAttivita": new Date(),
                        "SedeTecnica": 'Sede Tecnica D',
                        "DescSedeTecnica": 'Descrizione Sede Tecnica D'
                    },
                    {
                        "DocAcq": 'Prodotto E',
                        "Pos": '5',
                        "SubappaltoOK": 'true',
                        "Materiale": 'Materiale E',
                        "TestoBreve": 'Descrizione Breve E',
                        "Quantita": 25,
                        "QuantitaResidua": 12,
                        "Valore": 2500,
                        "ValoreResiduo": 1200,
                        "ImpDivInt": 250,
                        "UMO": 'BOX',
                        "PrzNetto": 125,
                        "DettaglioTicket": 'true',
                        "DataInizioAttivita": new Date(),
                        "DataFineAttivita": new Date(),
                        "SedeTecnica": 'Sede Tecnica E',
                        "DescSedeTecnica": 'Descrizione Sede Tecnica E'
                    }
                ]

            });
            return oModel;
        }

        
    };

});