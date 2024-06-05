sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Label",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/comp/smartvariants/PersonalizableInfo",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
    
], function(Controller, JSONModel, Label, Filter, FilterOperator, PersonalizableInfo, Fragment, MessageBox) {
    "use strict";
    
    var sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer";

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

            var oModel = new JSONModel(oData, sResponsivePaddingClasses);
            this.getView().setModel(oModel);
        
        
            var aBemTableDetail = [
                {
                    TestoBreveMateriale: "Material A",
                    ElementoWBS: "WBS001",
                    Quantita: 10,
                    ImpDivisaInt: 1000,
                    UMO: "PCE",
                    PrzNetto: 100,
                    Riferimento: "Ref001",
                    AnnoStz: 2024,
                    PercentStz: 50,
                    NumeroDocStz: "Doc001",
                    PosStz: 1,
                    AltriDoc: "Doc002",
                    StzFinale: "Final",
                    ImportoStanziamento: 500,
                    SospesoResiduo: 100,
                    OsservazioniStanziamento: "Observation",
                    CodiceCUP: "CUP001",
                    CodiceCIG: "CIG001",
                    DescrizioneCIG: "Description CIG",
                    DettaglioTicket: "Detail",
                    SedeTecnica: "Technical Site",
                    DescrizioneSedeTecnica: "Description Site"
                },
                {
                    TestoBreveMateriale: "Material B",
                    ElementoWBS: "WBS002",
                    Quantita: 20,
                    ImpDivisaInt: 2000,
                    UMO: "KG",
                    PrzNetto: 200,
                    Riferimento: "Ref002",
                    AnnoStz: 2024,
                    PercentStz: 70,
                    NumeroDocStz: "Doc002",
                    PosStz: 2,
                    AltriDoc: "Doc003",
                    StzFinale: "Final",
                    ImportoStanziamento: 700,
                    SospesoResiduo: 200,
                    OsservazioniStanziamento: "Observation 2",
                    CodiceCUP: "CUP002",
                    CodiceCIG: "CIG002",
                    DescrizioneCIG: "Description CIG 2",
                    DettaglioTicket: "Detail 2",
                    SedeTecnica: "Technical Site 2",
                    DescrizioneSedeTecnica: "Description Site 2"
                },
                {
                    TestoBreveMateriale: "Material C",
                    ElementoWBS: "WBS003",
                    Quantita: 30,
                    ImpDivisaInt: 3000,
                    UMO: "LTR",
                    PrzNetto: 300,
                    Riferimento: "Ref003",
                    AnnoStz: 2024,
                    PercentStz: 90,
                    NumeroDocStz: "Doc003",
                    PosStz: 3,
                    AltriDoc: "Doc004",
                    StzFinale: "Final",
                    ImportoStanziamento: 900,
                    SospesoResiduo: 300,
                    OsservazioniStanziamento: "Observation 3",
                    CodiceCUP: "CUP003",
                    CodiceCIG: "CIG003",
                    DescrizioneCIG: "Description CIG 3",
                    DettaglioTicket: "Detail 3",
                    SedeTecnica: "Technical Site 3",
                    DescrizioneSedeTecnica: "Description Site 3"
                },
                {
                    TestoBreveMateriale: "Material D",
                    ElementoWBS: "WBS004",
                    Quantita: 40,
                    ImpDivisaInt: 4000,
                    UMO: "BOX",
                    PrzNetto: 400,
                    Riferimento: "Ref004",
                    AnnoStz: 2024,
                    PercentStz: 80,
                    NumeroDocStz: "Doc004",
                    PosStz: 4,
                    AltriDoc: "Doc005",
                    StzFinale: "Final",
                    ImportoStanziamento: 800,
                    SospesoResiduo: 400,
                    OsservazioniStanziamento: "Observation 4",
                    CodiceCUP: "CUP004",
                    CodiceCIG: "CIG004",
                    DescrizioneCIG: "Description CIG 4",
                    DettaglioTicket: "Detail 4",
                    SedeTecnica: "Technical Site 4",
                    DescrizioneSedeTecnica: "Description Site 4"
                },
                {
                    TestoBreveMateriale: "Material E",
                    ElementoWBS: "WBS005",
                    Quantita: 50,
                    ImpDivisaInt: 5000,
                    UMO: "PAL",
                    PrzNetto: 500,
                    Riferimento: "Ref005",
                    AnnoStz: 2024,
                    PercentStz: 100,
                    NumeroDocStz: "Doc005",
                    PosStz: 5,
                    AltriDoc: "Doc006",
                    StzFinale: "Final",
                    ImportoStanziamento: 1000,
                    SospesoResiduo: 500,
                    OsservazioniStanziamento: "Observation 5",
                    CodiceCUP: "CUP005",
                    CodiceCIG: "CIG005",
                    DescrizioneCIG: "Description CIG 5",
                    DettaglioTicket: "Detail 5",
                    SedeTecnica: "Technical Site 5",
                    DescrizioneSedeTecnica: "Description Site 5"
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

        onPressButton1: function() { // Tasto Salva
            
        },

        onPressButton2: function() { // Tasto Allegati
           
        },

       
        onPressButton3: function () {
            var sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer";
            var oRouter = this.getOwnerComponent().getRouter();
        
            MessageBox.warning(
                "Sei in modalità modifica. Vuoi uscire senza salvare?",
                {
                    icon: MessageBox.Icon.WARNING,
                    title: "Conferma Chiusura",
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    initialFocus: MessageBox.Action.CANCEL,
                    styleClass: sResponsivePaddingClasses,
                    dependentOn: this.getView(),
                    onClose: function (sAction) {
                        if (sAction === MessageBox.Action.OK) {
                            oRouter.navTo("RouteBEM");
                        }
                    }
                }
            );
        },
        

        // onPressButton10: function() { // Tasto Chiudi
        //     const oRouter = this.getOwnerComponent().getRouter();
        //     oRouter.navTo("RouteBEM");
        // },

        //Bottoni Tabella

        onOpenFragment: function() {
            var oView = this.getView();

            if (!this.byId("BEMFragment")) {
                Fragment.load({
                    id: oView.getId(),
                    name: "sap.m.bem.view.fragment.CreazioneBEM",
                    controller: this
                }).then(function(oDialog) {
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            } else {
                this.byId("BEMFragment").open();
            }
        },

        onCloseFragment: function() {
            if (this.byId("BEMFragment")) {
                this.byId("BEMFragment").close();
            }
        },

        onRowSelectionChange: function(oEvent) {
            var oTable = oEvent.getSource();
            var aSelectedIndices = oTable.getSelectedIndices();
            var oTransferButton = this.byId("transferButton");

            if (aSelectedIndices.length > 0) {
                oTransferButton.setEnabled(true);
            } else {
                oTransferButton.setEnabled(false);
            }
        },

        onTransfer: function() {
            var oSocieta = this.byId("societaMultiComboBox").getSelectedKeys();
            var oProtocollo = this.byId("protocolloMultiComboBox").getSelectedKeys();
            var oCodiceFornitore = this.byId("CodiceFornitoreMultiComboBox").getSelectedKeys();
            var oCodiceODA = this.byId("CodiceODAMultiComboBox").getSelectedKeys();
            var oElementoWBS = this.byId("ElementoWBSMultiComboBox").getSelectedKeys();
            var oNTicket = this.byId("nTicketInput").getValue();
            var oSedeTecnica = this.byId("SedeTecnicaInput").getValue();

            if (oSocieta.length === 0 || oProtocollo.length === 0 || oCodiceFornitore.length === 0 ||
                oCodiceODA.length === 0 || oElementoWBS.length === 0 || !oNTicket || !oSedeTecnica) {
                // MessageBox.error("Per favore, compila tutti i campi di filtro.");
                //return;
            }

            // Da continuare con l'azione di trasferimento con il back-end
            MessageToast.show("Trasferimento effettuato con successo.");
        },

        onPressButton5: function () {
            var oMessageContainer = this.byId("messageContainer");
            oMessageContainer.setVisible(true);
        },

        onPressButton6: function() {
            
        },
        
        onPressButton7: function() {
            var sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer";
            var oRouter = this.getOwnerComponent().getRouter();
        
            MessageBox.warning(
                "Vuoi eliminare la posizione salvata?",
                {
                    icon: MessageBox.Icon.WARNING,
                    title: "Conferma Cancellazione",
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    initialFocus: MessageBox.Action.CANCEL,
                    styleClass: sResponsivePaddingClasses,
                    dependentOn: this.getView(),
                    // onClose: function (sAction) {
                    //     if (sAction === MessageBox.Action.OK) {
                    //         oRouter.navTo("RouteBEM");
                    //     }
                    // }
                }
            );
        }

    });
});
