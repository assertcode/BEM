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
            
            var oData = {
                NumeroConsuntivazione: "40174470",
                DataFineLavori: new Date(),
                DataRegistrazione: new Date(),
                Societa: "Cons. lg. Osp. scrl",
                StatoConsuntivazione: "Consuntivazione Costi Aperta",
                AcquisitoIl: new Date("2024-06-04"),
                AutoreAcquisizione: "GIGIACALONE",
                TipoConsuntivazione: "IG-CONSUNTIVAZIONE C",
                Commessa: "",
                Descrizione: "",
                ImportoTotale: 0,
                OrdinatoDa: "",
                Area: "",
                SottoArea: "",
                Fornitore: "",
                RagioneSociale: "",
                BollaConsegna: "",
                LetteraVettura: "",
                GruppoAcquisti: "",
                NumeroODA: ""
            };

            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel);
        
        
            var aBemTableDetail = [
                {   
                    Numero: "Prodotto A",
                    DataCreazioneBEM: new Date("2023-01-15"),
                    DataRegistrazione: new Date("2023-01-16"),
                    Stato: "Stato A",
                    Autore: "Autore A",
                    WbsCdc: "Wbs/Cdc A",
                    DescWbsCdc: "Descriz. Wbs/Cdc A",
                    IdFornitore: "ID Fornitore A",
                    Fornitore: "Fornitore A",
                    ImpTot: 1000,
                    ImpBEM: 500,
                    Noda: "N. OdA A",
                    TipoOdA: "Tipo OdA A",
                    CodiceCUP: "Codice CUP A",
                    CodiceCIG: "Codice CIG A",
                    DescCIG: "Descrizione CIG A",
                    Benestariata: "false",
                    DataAnnullamento: new Date("2023-01-17"),
                    UtenteAnnullamento: "Utente Annullamento A"
                },
                {   
                    Numero: "Prodotto B",
                    DataCreazioneBEM: new Date("2023-02-20"),
                    DataRegistrazione: new Date("2023-02-21"),
                    Stato: "Stato B",
                    Autore: "Autore B",
                    WbsCdc: "Wbs/Cdc B",
                    DescWbsCdc: "Descriz. Wbs/Cdc B",
                    IdFornitore: "ID Fornitore B",
                    Fornitore: "Fornitore B",
                    ImpTot: 2000,
                    ImpBEM: 1000,
                    Noda: "N. OdA B",
                    TipoOdA: "Tipo OdA B",
                    CodiceCUP: "Codice CUP B",
                    CodiceCIG: "Codice CIG B",
                    DescCIG: "Descrizione CIG B",
                    Benestariata: "true",
                    DataAnnullamento: new Date("2023-03-01"),
                    UtenteAnnullamento: "Utente Annullamento B"
                },
                {   
                    Numero: "Prodotto C",
                    DataCreazioneBEM: new Date("2023-03-10"),
                    DataRegistrazione: new Date("2023-03-11"),
                    Stato: "Stato C",
                    Autore: "Autore C",
                    WbsCdc: "Wbs/Cdc C",
                    DescWbsCdc: "Descriz. Wbs/Cdc C",
                    IdFornitore: "ID Fornitore C",
                    Fornitore: "Fornitore C",
                    ImpTot: 1500,
                    ImpBEM: 800,
                    Noda: "N. OdA C",
                    TipoOdA: "Tipo OdA C",
                    CodiceCUP: "Codice CUP C",
                    CodiceCIG: "Codice CIG C",
                    DescCIG: "Descrizione CIG C",
                    Benestariata: "false",
                    DataAnnullamento: new Date("2023-03-12"),
                    UtenteAnnullamento: "Utente Annullamento C"
                },
                {   
                    Numero: "Prodotto D",
                    DataCreazioneBEM: new Date("2023-04-10"),
                    DataRegistrazione: new Date("2023-04-11"),
                    Stato: "Stato D",
                    Autore: "Autore D",
                    WbsCdc: "Wbs/Cdc D",
                    DescWbsCdc: "Descriz. Wbs/Cdc D",
                    IdFornitore: "ID Fornitore D",
                    Fornitore: "Fornitore D",
                    ImpTot: 3000,
                    ImpBEM: 1500,
                    Noda: "N. OdA D",
                    TipoOdA: "Tipo OdA D",
                    CodiceCUP: "Codice CUP D",
                    CodiceCIG: "Codice CIG D",
                    DescCIG: "Descrizione CIG D",
                    Benestariata: "true",
                    DataAnnullamento: new Date("2023-04-12"),
                    UtenteAnnullamento: "Utente Annullamento D"
                },
                {   
                    Numero: "Prodotto E",
                    DataCreazioneBEM: new Date("2023-05-10"),
                    DataRegistrazione: new Date("2023-05-11"),
                    Stato: "Stato E",
                    Autore: "Autore E",
                    WbsCdc: "Wbs/Cdc E",
                    DescWbsCdc: "Descriz. Wbs/Cdc E",
                    IdFornitore: "ID Fornitore E",
                    Fornitore: "Fornitore E",
                    ImpTot: 2500,
                    ImpBEM: 1200,
                    Noda: "N. OdA E",
                    TipoOdA: "Tipo OdA E",
                    CodiceCUP: "Codice CUP E",
                    CodiceCIG: "Codice CIG E",
                    DescCIG: "Descrizione CIG E",
                    Benestariata: "false",
                    DataAnnullamento: new Date("2023-05-12"),
                    UtenteAnnullamento: "Utente Annullamento E"
                }
            ];

            var oMockModel = new JSONModel({ BemTableDetail: aBemTableDetail });
            this.getView().setModel(oMockModel, "bemModel");

            // PROCESS FLOW    
            var sDataPath = sap.ui.require.toUrl("sap/m/bem/flownodes.json");
            var oModel = new JSONModel(sDataPath);
            this.getView().setModel(oModel);

            this.oProcessFlow = this.getView().byId("processflow");
            this.oProcessFlow.updateModel();
        },

        //Bottoni Dettagli Consultivazione

        onPressButton1: function() {
            
        },

        onPressButton2: function() {
           
        },

        onPressButton3: function() {
            
        },

        //Bottoni Tabella

        onPressButton4: function() {
            
        },

        onPressButton5: function() {
           
        },

        onPressButton6: function() {
            
        },
        
        onPressButton6: function() {
            
        }

    });
});
