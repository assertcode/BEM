sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ushell/Container",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Label",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/CheckBox",
    "sap/m/Text",
    "sap/m/ColumnListItem",
    "sap/ui/core/library",
    "sap/ui/core/Item",
    "sap/ui/core/Fragment",
    "sap/m/PDFViewer"

], function (Controller, JSONModel, MessageToast, Filter, FilterOperator, Container, Dialog, Button, Label, Table, Column, CheckBox, Text, ColumnListItem, coreLibrary, CoreItem, Fragment, PDFViewer) {
    "use strict";

    var addBody;
    var AllegatiFileID;
    var userUploader
    var sPath

    return Controller.extend("sap.m.bem.controller.AvanzamentoBem", {
        onInit: function () {
            var oModel = this.createFlowModel();
            this.getView().setModel(oModel, "modello");

            this.getView().setModel(new JSONModel({}), "ConfermaScrittureIntegrative");
            this.getView().setModel(new JSONModel({}), "SalvaButtonEvent");

            this.oItemsProcessor = [];
            this.globalModel = {}

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("AvanzamentoBem").attachPatternMatched(this.onRouteMatched, this);

        },

        onRouteMatched: function () {

            if (this.getOwnerComponent().getModel("CreazioneModel").getProperty("/Nprot") == "") {
                var oRouter = this.getOwnerComponent().getRouter()
                oRouter.navTo("RouteBEM");
            }

            if (!this.getOwnerComponent().getModel("CreazioneModel").getProperty("/Addposition")) {
                this.getView().getModel("ConfermaScrittureIntegrative").setData({});
                this.getView().getModel("SalvaButtonEvent").setData({});
                this.getView().getModel("DatiBemDetail").setData({});
                this.getView().getModel("SaveModel").setData({ "status1": "", "value1": "", "status2": "", "value2": "" });
                this.getView().getModel("DetailErrorModel").setData({ "Visibility": false, "Message": "ERROR" });
            }
            this.onSearch();
        },

        onSearch: async function () {
            this.byId("AvanzamentoBemPage").setBusyIndicatorDelay(0)
            this.byId("AvanzamentoBemPage").setBusy(true)
            if (this.getOwnerComponent().getModel("CreazioneModel").getProperty("/Addposition") == true) {
                this.byId("AvanzamentoBemPage").setBusy(false)
                this.onChangeAggiornaAnnoStaz();
                this.getOwnerComponent().getModel("CreazioneModel").setProperty("/Addposition", false)
                return
            }
            var that = this
            var nprot = this.getOwnerComponent().getModel("CreazioneModel").getProperty("/Nprot");
            var aFilter = []
            const oModel = that.getOwnerComponent().getModel();
            aFilter.push(new Filter("Znprot", FilterOperator.EQ, nprot));

            return new Promise((resolve) => {
                oModel.read("/GetDetailSet",
                    {
                        filters: aFilter,
                        urlParameters: {
                            "$expand": "DettagliSet,Testata,to_EZTRGT003,ListaCampiSet,ListaFunzioniSet"
                        },
                        success: async function (data) {

                            const aStati = {};

                            for (const d of data.results[0].ListaCampiSet.results) {
                                aStati[d.Zobjname] = {
                                    ...d,
                                    Zvisible: d.Zvisible === '01' ? false : true,
                                    Zstate: d.Zstate === '00' ? false : true
                                };
                            }


                            that.getOwnerComponent().getModel("DatiBemDetail").setProperty("/OTESTATASet", data.results[0].Testata)
                            that.getOwnerComponent().getModel("DatiBemDetail").setProperty("/EZTRGT003", data.results[0].to_EZTRGT003);

                            var tpprot = that.getOwnerComponent().getModel("DatiBemDetail").getProperty("/OTESTATASet/Ztpprot")
                            if (tpprot == "75" && Object.keys(aStati).length > 0) {
                                if (aStati.Zxblnr1) {
                                    aStati.Zxblnr1.Zvisible = true
                                }
                            }

                            that.getOwnerComponent().getModel("DatiBemDetail").setProperty("/INumeroprotocollo", data.results[0].Znprot)
                            that.getOwnerComponent().getModel("DatiBemDetail").setProperty("/IUser", data.IUser)

                            that.getOwnerComponent().getModel("DatiBemDetail").setProperty("/IDettaglioSet", data.results[0].DettagliSet.results);
                            that.getOwnerComponent().getModel("DatiBemDetail").setProperty("/ListaCampiSet", aStati);
                            that.getOwnerComponent().getModel("DatiBemDetail").setProperty("/ListaFunzioniSet", data.results[0].ListaFunzioniSet.results);


                            // logica per eliminazione mandt
                            // var aData = that.getView().getModel("DatiBemDetail").getProperty("/IDettaglioSet"); 
                            // var aFilteredData = aData.filter(function(oRecord) {
                            //     return !oRecord.Mandt; 
                            // });
                            // that.getView().getModel("DatiBemDetail").setProperty("/IDettaglioSet", aFilteredData); 



                            that.getOwnerComponent().getModel("SaveModel").setProperty('/status1', '')
                            that.getOwnerComponent().getModel("SaveModel").setProperty('/value1', '')
                            that.getOwnerComponent().getModel("SaveModel").setProperty('/status2', '')
                            that.getOwnerComponent().getModel("SaveModel").setProperty('/value2', '')


                            if (data.results[0].ListaFunzioniSet.results.length === 1) {
                                that.getOwnerComponent().getModel("SaveModel").setProperty('/status1', data.results[0].ListaFunzioniSet.results[0].Zdescst)
                                that.getOwnerComponent().getModel("SaveModel").setProperty('/value1', data.results[0].ListaFunzioniSet.results[0].Ztpstsu)
                            } else if (data.results[0].ListaFunzioniSet.results.length === 2) {
                                that.getOwnerComponent().getModel("SaveModel").setProperty('/status1', data.results[0].ListaFunzioniSet.results[0].Zdescst)
                                that.getOwnerComponent().getModel("SaveModel").setProperty('/value1', data.results[0].ListaFunzioniSet.results[0].Ztpstsu)
                                that.getOwnerComponent().getModel("SaveModel").setProperty('/status2', data.results[0].ListaFunzioniSet.results[1].Zdescst)
                                that.getOwnerComponent().getModel("SaveModel").setProperty('/value2', data.results[0].ListaFunzioniSet.results[1].Ztpstsu)
                            }

                            that.getOwnerComponent().getModel("DatiBemDetail").refresh(true);

                            that.onFlowCalculator()
                            that.AggiornaImportoTotale()
                            await that.getSyUser()
                            that.byId("AvanzamentoBemPage").setBusy(false)
                            resolve();
                        },
                        error: function (err) {
                            that.byId("AvanzamentoBemPage").setBusy(false)
                            console.error(err)
                            resolve();
                        }
                    });
            });

        },

        onFlowCalculator: function () {
            var modello = this.getView().getModel("modello").getProperty("/nodes");
            var Stato = this.getOwnerComponent().getModel("DatiBemDetail").getProperty("/OTESTATASet/Ztpstato")
            var Enabled = this.getOwnerComponent().getModel("EnabledButton");
            if (Stato === "B03") {
                Enabled.setProperty("/Modifica", false)
                this.getView().getModel("VisibleButton").setProperty("/Salva", false)
                modello.forEach(function (node) {
                    if (node.id === "2" || node.id === "3") {
                        node.state = "Positive";
                    }
                    if (node.id === "4") {
                        node.state = "Negative";
                    }
                });
            } else if (Stato === "B02") {
                Enabled.setProperty("/Modifica", true)
                // this.getView().getModel("VisibleButton").setProperty("/Salva", false)
                modello.forEach(function (node) {
                    if (node.id === "2") {
                        node.state = "Positive";
                    }
                    if (node.id === "3" || node.id === "4") {
                        node.state = "Negative";
                    }
                });
            } else if (Stato === "B01") {
                Enabled.setProperty("/Modifica", true);
                modello.forEach(function (node) {
                    if (node.id === "2" || node.id === "3" || node.id === "4") {
                        node.state = "Negative";
                    }
                });
            } else if (Stato === "B04") {
                Enabled.setProperty("/Modifica", false);
                this.getView().getModel("VisibleButton").setProperty("/Salva", false)
                modello.forEach(function (node) {
                    if (node.id === "2" || node.id === "3" || node.id === "4") {
                        node.state = "Positive";
                    }
                });
            }
            this.byId("processFlow").updateModel();
        },

        createFlowModel: function () {
            return new JSONModel({
                "nodes": [
                    {
                        "id": "1",
                        "lane": "0",
                        "children": ["2"],
                        "state": "Positive",
                        "title": "Node 1",
                        "focused": true
                    },
                    {
                        "id": "2",
                        "lane": "1",
                        "children": ["3"],
                        "state": "Negative",
                        "title": "Node 2",
                        "focused": false
                    },
                    {
                        "id": "3",
                        "lane": "2",
                        "children": [4],
                        "state": "Negative",
                        "title": "Node 3",
                        "focused": false
                    },
                    {
                        "id": "4",
                        "lane": "3",
                        "children": [],
                        "state": "Negative",
                        "title": "Node 4",
                        "focused": false
                    }
                ],
                "lanes": [
                    {
                        "id": "0",
                        "icon": "sap-icon://add-document",
                        "label": "Consuntivazione Costi Aperta",
                        "position": 0
                    },
                    {
                        "id": "1",
                        "icon": "sap-icon://save",
                        "label": "Consuntivazione Costi Salvata",
                        "position": 1
                    },
                    {
                        "id": "2",
                        "icon": "sap-icon://accept",
                        "label": "Consuntivazione Costi Rilasciata",
                        "position": 2
                    }, {
                        "id": "3",
                        "icon": "sap-icon://decline",
                        "label": "Consuntivazione Costi Annullata",
                        "position": 3
                    }
                ]
            });
        },

        onNavigateBEF: function () {

            sap.ushell.Container.getServiceAsync("CrossApplicationNavigation")
                .then(function (oCrossAppNavigator) {
                    var oModel = this.getOwnerComponent().getModel("DatiBemDetail");
                    var sSocieta = oModel.getProperty("/OTESTATASet/Zbukrs");
                    var sFornitore = oModel.getProperty("/OTESTATASet/Zlifnr");
                    var sNprot = this.getOwnerComponent().getModel("CreazioneModel").getProperty("/Nprot");

                    if (!sSocieta || !sFornitore) {
                        sap.m.MessageToast.show("Dati mancanti per la navigazione.");
                        return;
                    }

                    var sSemanticObject = "BEF";
                    var sAction = "display";

                    var oParams = {
                        Societa: sSocieta,
                        Forn: sFornitore,
                        Nprot: sNprot
                    };

                    // Navigazione verso l'applicazione target
                    oCrossAppNavigator.toExternal({
                        target: {
                            semanticObject: sSemanticObject,
                            action: sAction
                        },
                        params: oParams
                    });
                }.bind(this)) // Usa .bind(this) per mantenere il contesto del controller
                .catch(function (oError) {
                    sap.m.MessageToast.show("Errore durante il recupero del servizio di navigazione.");
                    console.error(oError);
                });
        },
        // onNavigateBEF: function () {

        //     var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
        //     var Soc = this.getOwnerComponent().getModel("DatiBemDetail").getProperty("/OTESTATASet/Zbukrs")
        //     var Forn = this.getOwnerComponent().getModel("DatiBemDetail").getProperty("/OTESTATASet/Zlifnr")

        //     var sSemanticObject = "BEF";
        //     var sAction = "display";

        //     // Definire i parametri che vuoi passare all'altra app
        //     var oParams = {
        //         "Societa": Soc,
        //         "Forn": Forn
        //     };


        //     oCrossAppNavigator.toExternal({
        //         target: {
        //             semanticObject: sSemanticObject,
        //             action: sAction
        //         },
        //         params: oParams
        //     });
        // },

        onControlli: function (oEvent) {


            var oButton = oEvent.getSource();
            var oRowContext = oButton.getBindingContext("DatiBemDetail");
            var oTable = this.byId("PositionTable");
            var aContexts = oTable.getBinding("rows").getContexts();
            var iIndex = aContexts.findIndex(function (oContext) {
                return oContext.getObject().Zebelp === oRowContext.getObject().Zebelp;
            });

            var tpprot = this.getOwnerComponent().getModel("DatiBemDetail").getProperty("/OTESTATASet/Ztpprot");

            var sPropertyPath = "/IDettaglioSet/" + iIndex + "/Zsgtxt";
            var Owner = this.getOwnerComponent().getModel("Cont")
            var property = this.getOwnerComponent().getModel("DatiBemDetail").getProperty(sPropertyPath);
            if (property.includes("*")) {
                Owner.setProperty("/As", true)
            } else { Owner.setProperty("/As", false) } if (property.includes("A")) {
                Owner.setProperty("/A", true)
            } else { Owner.setProperty("/A", false) } if (property.includes("B")) {
                Owner.setProperty("/B", true)
            } else { Owner.setProperty("/B", false) } if (property.includes("C")) {
                Owner.setProperty("/C", true)
            } else { Owner.setProperty("/C", false) } if (property.includes("D")) {
                Owner.setProperty("/D", true)
            } else { Owner.setProperty("/D", false) } if (property.includes("E")) {
                Owner.setProperty("/E", true)
            } else { Owner.setProperty("/E", false) } if (property.includes("F")) {
                Owner.setProperty("/F", true)
            } else { Owner.setProperty("/F", false) } if (property.includes("G")) {
                Owner.setProperty("/G", true)
            } else { Owner.setProperty("/G", false) } if (property.includes("H")) {
                Owner.setProperty("/H", true)
            } else { Owner.setProperty("/H", false) } if (property.includes("I")) {
                Owner.setProperty("/I", true)
            } else { Owner.setProperty("/I", false) }

            var oTable = new Table({
                columns: [
                    new Column({
                        header: new Label({ text: "Sel." })
                    }),
                    new Column({
                        header: new Label({ text: "Codice" })
                    }),
                    new Column({
                        header: new Label({ text: "Descrizione" })
                    })
                ]
            });


            if (tpprot == "73") {

                var oModel = new JSONModel({
                    items: [
                        { sel: Owner.getProperty("/As"), codice: "*", descrizione: "TUTTO BENE" },
                        { sel: Owner.getProperty("/A"), codice: "A", descrizione: "RITARDO NELLA CONSEGNA INF. A DUE GG" },
                        { sel: Owner.getProperty("/B"), codice: "B", descrizione: "RITARDO NELLA CONSEGNA SUP. A DUE GG" },
                        { sel: Owner.getProperty("/C"), codice: "C", descrizione: "DIFF. TRA QUANT. CONS. E ORD. INF. 2%" },
                        { sel: Owner.getProperty("/D"), codice: "D", descrizione: "DIFF. TRA QUANT. CONS. E ORD. SUP. 2%" },
                        { sel: Owner.getProperty("/E"), codice: "E", descrizione: "LUOGO DI CONSEGNA" },
                        { sel: Owner.getProperty("/F"), codice: "F", descrizione: "RISPETTO IDENTITÀ DEL BENE" },
                        { sel: Owner.getProperty("/G"), codice: "G", descrizione: "INTEGRITÀ DELL'IMBALLAGGIO" },
                        { sel: Owner.getProperty("/H"), codice: "H", descrizione: "COMPLETEZZA DELLA DOCUMENTAZIONE" },
                        { sel: Owner.getProperty("/I"), codice: "I", descrizione: "SOLLECITI" },
                        { sel: Owner.getProperty("/Z"), codice: "Z", descrizione: "50001: EM NON SIGNIFICATIVA X ISO 50001", editable: false },
                        { sel: Owner.getProperty("/Y"), codice: "Y", descrizione: "50001: MANCATA CONSEGNA DOC. PREVISTA", editable: false },
                        { sel: Owner.getProperty("/X"), codice: "X", descrizione: "50001: NON RISP. TEMPISTICHE FORNIT.", editable: false },
                        { sel: Owner.getProperty("/W"), codice: "W", descrizione: "50001: NON RISP. REG. LEG. E CERTIFIC.", editable: false },
                        { sel: Owner.getProperty("/V"), codice: "V", descrizione: "50001: NON RISP. SPEC. TEC. E REQ. PROG.", editable: false },
                        { sel: Owner.getProperty("/Q"), codice: "Q", descrizione: "50001: PIENAMENTE CONFORME ISO 50001", editable: false }
                    ]
                });

            } else {

                var oModel = new JSONModel({
                    items: [
                        { sel: Owner.getProperty("/As"), codice: "*", descrizione: "TUTTO BENE" },
                        { sel: Owner.getProperty("/A"), codice: "A", descrizione: "NON APPLICAZIONE NORME COMPORTAMENTALI (Es. uso delle divise per trasportatori) " },
                        { sel: Owner.getProperty("/B"), codice: "B", descrizione: "NON RISPETTO TEMPISTICHE (Inizio/fine prestazione o date pianificate)" },
                        { sel: Owner.getProperty("/C"), codice: "C", descrizione: "NON RISPETTO DISPOSIZIONE SICUREZZA S.O" },
                        { sel: Owner.getProperty("/D"), codice: "D", descrizione: "NON ADEGUATEZZA MATERIALI/ATTREZZATURE/PRODOTTI/MEZZI UTILIZZATI (compresa sanificaz. mezzi)" },
                        { sel: Owner.getProperty("/E"), codice: "E", descrizione: "DOCUMENTAZIONE INCOMPLETA" },
                        { sel: Owner.getProperty("/F"), codice: "F", descrizione: "PRESTAZIONE NON ESEGUITA A REGOLA D’ARTE" },
                        { sel: Owner.getProperty("/G"), codice: "G", descrizione: "EVENTUALI DANNEGGIAMENTI ALLA STRUTTURA/BENI DI S.O" },
                        { sel: Owner.getProperty("/H"), codice: "H", descrizione: "SOLLECITI/RECLAMI" },
                        { sel: Owner.getProperty("/I"), codice: "I", descrizione: "ALTRE NON CONFORMITÀ" },
                        { sel: Owner.getProperty("/Z"), codice: "Z", descrizione: "50001: EM NON SIGNIFICATIVA X ISO 50001", editable: false },
                        { sel: Owner.getProperty("/Y"), codice: "Y", descrizione: "50001: MANCATA CONSEGNA DOC. PREVISTA", editable: false },
                        { sel: Owner.getProperty("/X"), codice: "X", descrizione: "50001: NON RISP. TEMPISTICHE FORNIT.", editable: false },
                        { sel: Owner.getProperty("/W"), codice: "W", descrizione: "50001: NON RISP. REG. LEG. E CERTIFIC.", editable: false },
                        { sel: Owner.getProperty("/V"), codice: "V", descrizione: "50001: NON RISP. SPEC. TEC. E REQ. PROG.", editable: false },
                        { sel: Owner.getProperty("/Q"), codice: "Q", descrizione: "50001: PIENAMENTE CONFORME ISO 50001", editable: false }
                    ]
                });
            }
            oTable.setModel(oModel);
            var that = this
            var oTemplate = new ColumnListItem({
                cells: [
                    new CheckBox({
                        selected: "{sel}",
                        editable: "{editable}",
                        select: function (oEvent) {

                            var selected = oEvent.getParameter("selected");
                            var codice = oEvent.getSource().getBindingContext().getProperty("codice");

                            if (selected) {
                                var str = that.getOwnerComponent().getModel("DatiBemDetail").getProperty(sPropertyPath);
                                if (str.includes(codice)) {
                                } else {
                                    if (str.length == 6) {
                                        return
                                    }
                                    var str2 = str + codice
                                    that.getOwnerComponent().getModel("DatiBemDetail").setProperty(sPropertyPath, str2);
                                }

                            } else {

                                var str = that.getOwnerComponent().getModel("DatiBemDetail").getProperty(sPropertyPath);
                                if (str.includes(codice)) {
                                    var nuovaStr = str.replace(codice, "");
                                    that.getOwnerComponent().getModel("DatiBemDetail").setProperty(sPropertyPath, nuovaStr);
                                }

                            }
                        }
                    }),
                    new Text({ text: "{codice}" }),
                    new Text({ text: "{descrizione}" })
                ]
            });

            oTable.bindItems({
                path: "/items",
                template: oTemplate
            });

            var oDialog = new Dialog({
                title: "Controlli in ingresso ed accettazione",
                content: [oTable],
                contentWidth: "45%",
                buttons: [
                    new Button({
                        text: "Conferma",
                        type: "Accept",
                        press: function () {
                            oDialog.close();
                        }
                    }),
                    new Button({
                        text: "Annulla",
                        press: function () {
                            oDialog.close();
                        }
                    })
                ]
            });

            oDialog.open();
        },

        SelezioneOrdineAcquisto: function (oEvent) {
            var oRouter = this.getOwnerComponent().getRouter()
            oRouter.navTo("BEMDetail");
        },
        ModificaButton: function () {

            var Visible = this.getView().getModel("VisibleButton")

            if (Visible.getProperty("/Salva") == false) {
                Visible.setProperty("/Salva", true)
            } else {
                Visible.setProperty("/Salva", false)
            }
        },

        // formatDateWithoutTimezone: function(oDate) {
        //     if (oDate) {
        //         // Imposta l'ora a mezzogiorno per evitare problemi di fuso orario
        //         oDate.setHours(12, 0, 0, 0);
        //         return oDate;
        //     }
        //     return null;
        // },

        CIGValueHelp: function (oEvent) {

            this.getView().getModel("MatchCode").setProperty("/Cig", {});

            var oInput = oEvent.getSource();

            var oBindingContext = oInput.getBindingContext("DatiBemDetail");
            sPath = oBindingContext.getPath();

            var oView = this.getView();
            if (!this.byId("IdHelpRequestCig")) {
                Fragment.load({
                    id: oView.getId(),
                    name: "sap.m.bem.view.fragment.CigMatchcode",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            } else {
                this.byId("IdHelpRequestCig").open();
            }

            this.getOwnerComponent().getModel("CigFilterModel").setProperty("/Posid", this.getOwnerComponent().getModel("DatiBemDetail").getProperty("/OTESTATASet/ZpsPosid"))
        },

        onSearchCIG: function () {
            var that = this;
            var aFilter = [];
            this.byId("CigTable").setBusyIndicatorDelay(0)
            this.byId("CigTable").setBusy(true)
            const oModel = this.getOwnerComponent().getModel("CigFilterModel");
            var Posid = oModel.getProperty("/Posid")
            if (Posid) {
                aFilter.push(new Filter("Posid", FilterOperator.EQ, Posid));
            }

            this.getOwnerComponent().getModel().read('/CIG_MCSet',

                {
                    filters: aFilter,
                    success: function (data) {

                        that.getView().getModel("MatchCode").setProperty("/Cig", data.results);
                        that.byId("CigTable").setBusy(false)


                    },
                    error: function (err) {
                        console.error(err)
                        that.byId("CigTable").setBusy(false)

                    }
                });

        },

        OnSelectCig: function () {

            var oTable = this.byId("CigTable");

            var oSelectedItem = oTable.getSelectedItem();

            var oModel = this.getOwnerComponent().getModel("DatiBemDetail");

            if (oSelectedItem) {

                var oContext = oSelectedItem.getBindingContext("MatchCode");

                var oSelectedData = oContext.getObject();

                oModel.setProperty(`${sPath}/Zcig`, oSelectedData.Cig);

                this.ConfermaCig()

            } else {
                MessageToast.show("Nessun record selezionato");
            }
        },



        ConfermaCig: function () {
            this.byId("CigTable").removeSelections();
            var oDialog = this.byId("IdHelpRequestCig");
            if (oDialog) {
                oDialog.close();
            }
        },

        CommessaValueHelp: function (oEvent) {

            var oInput = oEvent.getSource();

            var oBindingContext = oInput.getBindingContext("DatiBemDetail");
            // Ottieni il path del contesto
            sPath = oBindingContext.getPath();


            var oView = this.getView();
            if (!this.byId("IdCommessaHelpRequest")) {
                Fragment.load({
                    id: oView.getId(),
                    name: "sap.m.bem.view.fragment.CommessaHelpRequest",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            } else {
                this.byId("IdCommessaHelpRequest").open();
            }
        },

        _getSingleDocStz: async function (oDettaglio) {
            const oModel = this.getOwnerComponent().getModel();
            const oBemDetailModel = this.getOwnerComponent().getModel('DatiBemDetail');
            const oTestata = oBemDetailModel.getProperty("/OTESTATASet");
            const aFilters = [];

            // Societa
            aFilters.push(new Filter("IBukrs", FilterOperator.EQ, oTestata.Zbukrs));

            // Fornitore
            if (oTestata.Zlifnr) {
                aFilters.push(new Filter("ILifnr", FilterOperator.Contains, oTestata.Zlifnr));
            }

            // Anno
            if (oDettaglio.ZstaStzahr) {
                aFilters.push(new Filter("IGjahr", FilterOperator.EQ, oDettaglio.ZstaStzahr));
            }

            // Wbe
            if (oDettaglio.ZpsPosid) {
                aFilters.push(new Filter("IPosid", FilterOperator.EQ, oDettaglio.ZpsPosid));
            }

            // Importo
            if (oDettaglio.ZstaDmStz) {
                aFilters.push(new Filter("IDmbtr", FilterOperator.EQ, oDettaglio.ZstaDmStz));
            }

            // Segno
            aFilters.push(new Filter("ISegno", FilterOperator.EQ, "+"));

            // Documento
            if (oDettaglio.ZstaBelnrBm) {
                aFilters.push(new Filter("IBelnr", FilterOperator.EQ, oDettaglio.ZstaBelnrBm));
            }

            // Posizione
            if (oDettaglio.ZstaBuzeiBm) {
                aFilters.push(new Filter("IBuzei", FilterOperator.EQ, oDettaglio.ZstaBuzeiBm));
            }

            aFilters.push(new Filter("ISingle", FilterOperator.EQ, true));

            const [aValori, oError] = await new Promise(function (resolve, reject) {
                oModel.read('/DocStzInputSet', {
                    filters: aFilters,
                    urlParameters: {
                        "$expand": "to_DocStzOutput"
                    },
                    success: function (oData) {
                        resolve([oData.results[0].to_DocStzOutput.results, null]);
                    },
                    error: function (oError) {
                        reject([null, oError]);
                    }
                });
            });

            if (!aValori && oError) {
                console.error(oError);
                return null;
            }

            return aValori.length > 0 ? aValori[0] : null;
        },

        updateCosts: function () {
            const oBemDetailModel = this.getOwnerComponent().getModel("DatiBemDetail");
            const oBemDefaultPosition = oBemDetailModel.getProperty("/EZTRGT003");
            const aDettagli = oBemDetailModel.getProperty("/IDettaglioSet");

            if (!aDettagli || aDettagli.length === 0) {
                return;
            }

            const sTipoBEM = oBemDefaultPosition?.Zpstyp || null;
            const bIsServizio = sTipoBEM === "P";

            let nTotale = 0;

            for (let i = 0; i < aDettagli.length; i++) {
                let nImporto = 0;
                const oDettaglio = aDettagli[i];
                const sDettaglioPath = `/IDettaglioSet/${i}`;
                const nPeinh = 1;

                if (oDettaglio.Zdmbtr && oDettaglio.ZmengeD) {
                    nImporto = parseFloat(oDettaglio.Zdmbtr) * parseFloat(oDettaglio.ZmengeD);
                    nImporto = Math.round((nImporto / nPeinh) * 100) / 100;

                    const sImportoString = nImporto.toFixed(2);

                    oBemDetailModel.setProperty(`${sDettaglioPath}/Zprzsconto`, sImportoString);
                    oBemDetailModel.setProperty(`${sDettaglioPath}/ZstaDmStz`, sImportoString);

                    nTotale += parseFloat(sImportoString);
                }
            }

            // Aggiorna la testata
            oBemDetailModel.setProperty("/OTESTATASet/ZnetwrAk", nTotale.toFixed(2));

            // Refresh della tabella (sap.ui.table.Table con binding rows)
            const oTable = this.byId("PositionTable");
            if (oTable) {
                oTable.getBinding("rows")?.refresh(true);
                oTable.invalidate(); // forza il ridisegno
            }
        },

        checkStanziamenti: async function () {
            const oDetailErrorModel = this.getOwnerComponent().getModel("DetailErrorModel");
            const oBemDetailModel = this.getOwnerComponent().getModel("DatiBemDetail");
            const dtDataFineLavori = oBemDetailModel.getProperty("/OTESTATASet/Zbldat");
            const dtBudat = oBemDetailModel.getProperty("/OTESTATASet/Zbudat");
            const aDettagli = oBemDetailModel.getProperty("/IDettaglioSet");

            if (!dtDataFineLavori) {
                return false;
            }

            if (!dtBudat) {
                oDetailErrorModel.setProperty("/Visibility", true);
                oDetailErrorModel.setProperty("/Message", "Valorizzare la Data Registrazione");
                return false;
            } else {
                oDetailErrorModel.setProperty("/Visibility", false);
                oDetailErrorModel.setProperty("/Message", "ERROR");
            }

            const sAnnoFineLavori = String(dtDataFineLavori.getFullYear());
            const sAnnoCorrente = String(dtBudat.getFullYear());

            const aBlockingMessages = [];
            const aWarningMessages = [];

            for (const [nIndex, oDettaglio] of aDettagli.entries()) {
                if (!oDettaglio.ZstaStzahr || oDettaglio.ZstaStzahr === "0000") {
                    oDettaglio.ZstaStzahr = sAnnoFineLavori;
                }

                const sAnnoStz = oDettaglio.ZstaStzahr;

                if (sAnnoStz !== sAnnoFineLavori) {
                    aBlockingMessages.push(`Il valore dell'Anno Stz. alla riga ${nIndex + 1} non è coerente con l'anno della Data Fine lavori`);
                    continue;
                }

                if (sAnnoStz === sAnnoCorrente) {
                    oDettaglio.ZstaDmStz = new Number(0).toFixed(3);
                    oDettaglio.ZstaBelnrBm = "";
                    oDettaglio.ZstaBuzeiBm = "000";
                } else {
                    const sImpStz = oDettaglio.ZstaDmStz;
                    const sImpPos = oDettaglio.Zprzsconto;

                    if (!sImpStz || parseFloat(sImpStz) === 0) {
                        oDettaglio.ZstaDmStz = sImpPos;
                    }

                    const oValori = await this._getSingleDocStz(oDettaglio);

                    if (oValori) {
                        oDettaglio.ZstaBelnrBm = oValori.Belnr;
                        oDettaglio.ZstaBuzeiBm = oValori.Buzei;
                        oDettaglio.Zsospeso = oValori.Zsospeso;
                        oDettaglio.ZstaGjahrBm = oValori.Gjahr;
                    }

                    if (!oValori || !oValori.Belnr) {
                        aWarningMessages.push(`N. Doc. Stz. e Pos. Stz. non validi alla riga ${nIndex + 1}`);
                    }

                    if (oValori && oValori.Zotherdoc) {
                        aWarningMessages.push(`Sono presenti altri N. Doc. Stz. per la riga ${nIndex + 1}`)
                    }
                }
            }

            oBemDetailModel.setProperty("/IDettaglioSet", aDettagli);
            oBemDetailModel.refresh(true);

            if (aBlockingMessages.length > 0) {
                oDetailErrorModel.setProperty("/Visibility", true);
                oDetailErrorModel.setProperty("/Message", aBlockingMessages.join("\n"));
                return false;
            } else {
                oDetailErrorModel.setProperty("/Visibility", false);
                oDetailErrorModel.setProperty("/Message", "ERROR");
            }

            if (aWarningMessages.length > 0) {
                oDetailErrorModel.setProperty("/Visibility", true);
                oDetailErrorModel.setProperty("/Message", aWarningMessages.join("\n"));
            } else {
                oDetailErrorModel.setProperty("/Visibility", false);
                oDetailErrorModel.setProperty("/Message", "ERROR");
            }

            return true;
        },

        aggiornaAnnoStaz: async function () {
            const oBemDetailModel = this.getOwnerComponent().getModel("DatiBemDetail");
            const dtDataFineLavori = oBemDetailModel.getProperty("/OTESTATASet/Zbldat");
            const aDettagli = oBemDetailModel.getProperty("/IDettaglioSet");

            this.updateCosts();

            if (!(await this.checkStanziamenti())) { return; }

            if (!dtDataFineLavori) {
                return
            }

            const nAnnoDataFineLavori = dtDataFineLavori.getFullYear();

            for (const oDettaglio of aDettagli) {
                oDettaglio.ZstaStzahr = String(nAnnoDataFineLavori);
            }

            oBemDetailModel.setProperty("/IDettaglioSet", aDettagli);


        },

        checkDataFineLavori: function () {
            const oDetailErrorModel = this.getOwnerComponent().getModel("DetailErrorModel");
            const oBemDetailModel = this.getOwnerComponent().getModel("DatiBemDetail");
            const sTipoProtocollo = oBemDetailModel.getProperty("/OTESTATASet/Ztpprot");
            const dtDataFineLavori = oBemDetailModel.getProperty("/OTESTATASet/Zbldat");
            const dtDataCompetenza = oBemDetailModel.getProperty("/OTESTATASet/Zbudat");

            if (!dtDataFineLavori || !dtDataCompetenza) {
                return;
            }

            dtDataFineLavori.setHours(0, 0, 0, 0);
            dtDataCompetenza.setHours(0, 0, 0, 0);

            if (["05", "55", "75"].includes(sTipoProtocollo) && dtDataFineLavori.getTime() === dtDataCompetenza.getTime()) {
                oDetailErrorModel.setProperty("/Visibility", true);
                oDetailErrorModel.setProperty("/Message", "Verificare la Data Fine lavori");
            } else {
                oDetailErrorModel.setProperty("/Visibility", false);
                oDetailErrorModel.setProperty("/Message", "ERROR");
            }
        },

        onChangeAggiornaAnnoStaz: function () {
            this.checkDataFineLavori();
            this.aggiornaAnnoStaz();
        },

        DocStazValueHelp: function (oEvent) {
            var oInput = oEvent.getSource();
            var oBindingContext = oInput.getBindingContext("DatiBemDetail");
            // Ottieni il path del contesto
            sPath = oBindingContext.getPath();
            const oDatiBemDetailModel = this.getOwnerComponent().getModel('DatiBemDetail');
            var wbs = oDatiBemDetailModel.getProperty(sPath + '/ZpsPosid')
            var dateesercizio = this.getOwnerComponent().getModel('DatiBemDetail').getProperty("/OTESTATASet/Zbldat");
            var fornitore = this.getOwnerComponent().getModel('DatiBemDetail').getProperty("/OTESTATASet/Zlifnr");

            this.getView().getModel("MatchCodeDocStz").setProperty("/stanziamenti", []);
            this.getOwnerComponent().getModel("MatchCodeDocStz").setProperty("/OutputSet", []);

            if (dateesercizio) {
                var datewbsyear = dateesercizio.getFullYear();
                this.getOwnerComponent().getModel('DocStzFilterModel').setProperty('/esercizio', datewbsyear);
            }

            if (wbs) {
                this.getOwnerComponent().getModel('DocStzFilterModel').setProperty('/wbs', wbs)
            }

            if (fornitore) {
                this.getOwnerComponent().getModel('DocStzFilterModel').setProperty('/fornitore', fornitore)
            }

            var oView = this.getView();
            if (!this.byId("DocStzHelpRequest")) {
                Fragment.load({
                    id: oView.getId(),
                    name: "sap.m.bem.view.fragment.DocStz",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            } else {
                this.byId("DocStzHelpRequest").open();
            }
        },

        OnCloseStzDialog: function () {
            var oDialog = this.byId("DocStzHelpRequest");
            if (oDialog) {
                oDialog.close();
            }
        },

        // OnSelectStz: function () {
        //     var oTable = this.byId("DocStzTable");
        //     var iSelectedIndex = oTable.getSelectedIndex();
        //     var oContext = oTable.getContextByIndex(iSelectedIndex);
        //     var oSelectedData = oContext.getObject();
        //     var oModel = this.getOwnerComponent().getModel("DatiBemDetail");
        //     var aDettaglioSet = oModel.getProperty("/IDettaglioSet");

        //     if (!Array.isArray(aDettaglioSet) || aDettaglioSet.length === 0) {
        //         sap.m.MessageToast.show("IDettaglioSet non contiene dati.");
        //         return;
        //     }

        //     oModel.setProperty(`${sPath}/ZstaBuzeiBm`, oSelectedData.Buzei);
        //     oModel.setProperty(`${sPath}/Zsospeso`, oSelectedData.Zsospeso);
        //     oModel.setProperty(`${sPath}/ZstaBelnrBm`, oSelectedData.Belnr);

        //     this.byId("DocStzHelpRequest").close();

        //     this.checkStanziamenti();
        // },

        OnSelectStz: function (oEvent) {
            var oTable = oEvent.getSource();
            var aSelectedIndices = oTable.getSelectedIndices();

            if (aSelectedIndices.length > 0) {
                // Ottieni il primo indice selezionato
                var iSelectedIndex = aSelectedIndices[0];

                // Ottieni l'elemento di contesto utilizzando l'indice
                var oBindingContext = oTable.getContextByIndex(iSelectedIndex);

                if (oBindingContext) {
                    // Estrai il valore desiderato
                    var sValue = oBindingContext.getProperty("Zsospeso"); // Assicurati che il campo esista
                    var sValue2 = oBindingContext.getProperty("Belnr"); // Assicurati che il campo esista
                    var sValue3 = oBindingContext.getProperty("Buzei"); // Assicurati che il campo esista

                    this.getOwnerComponent().getModel("DatiBemDetail").setProperty(sPath + "/Zsospeso", sValue)
                    this.getOwnerComponent().getModel("DatiBemDetail").setProperty(sPath + "/ZstaBelnrBm", sValue2)
                    this.getOwnerComponent().getModel("DatiBemDetail").setProperty(sPath + "/ZstaBuzeiBm", sValue3)

                    // Chiudi il dialogo
                    this.byId("DocStzHelpRequest").close();

                    this.checkStanziamenti();
                }
            }
        },

        onSearchCommessa: function () {
            var that = this;
            var aFilter = [];
            this.byId("CommessaTable").setBusyIndicatorDelay(0)
            this.byId("CommessaTable").setBusy(true)
            const oModel = this.getOwnerComponent().getModel("CommessaFilterModel");
            var wbs = oModel.getProperty("/wbs")
            var definizione = oModel.getProperty("/definizione")
            var commessa = oModel.getProperty("/commessa")
            var responsabile = oModel.getProperty("/responsabile")
            var mercato = oModel.getProperty("/mercato")
            if (wbs) {
                aFilter.push(new Filter("IPosid", FilterOperator.Contains, wbs));
            }
            if (definizione) {
                aFilter.push(new Filter("IPost1", FilterOperator.Contains, definizione));
            }
            if (commessa) {
                aFilter.push(new Filter("IPspid", FilterOperator.Contains, commessa));
            }
            if (responsabile) {
                aFilter.push(new Filter("IVerna", FilterOperator.Contains, responsabile));
            }
            if (mercato) {
                aFilter.push(new Filter("IZztipocliente", FilterOperator.Contains, mercato));
            }

            this.getOwnerComponent().getModel().read('/CommessaSet',

                {
                    filters: aFilter,
                    urlParameters: {
                        "$expand": "EValoriSet"
                    },
                    success: function (data) {

                        that.getView().getModel("MatchCode").setProperty("/Commessa", data.results[0].EValoriSet.results);
                        that.byId("CommessaTable").setBusy(false)


                    },
                    error: function (err) {
                        console.error(err)
                        that.byId("CommessaTable").setBusy(false)

                    }
                });

        },

        onSearchDocStz: function () {
            const oDatiBemDetailModel = this.getOwnerComponent().getModel('DatiBemDetail');

            var that = this;
            var aFilter = [];
            this.byId("DocStzTable").setBusyIndicatorDelay(0)
            this.byId("DocStzTable").setBusy(true)
            const oModel = this.getOwnerComponent().getModel("DocStzFilterModel");
            const oTestata = oDatiBemDetailModel.getProperty("/OTESTATASet");
            const oDettaglio = oDatiBemDetailModel.getProperty(sPath);
            var wbs = oModel.getProperty("/wbs")
            var esercizio = oModel.getProperty("/esercizio");

            var fornitore = oModel.getProperty("/fornitore")

            if (wbs) {
                aFilter.push(new Filter("IPosid", FilterOperator.EQ, wbs));
            }
            if (esercizio) {
                aFilter.push(new Filter("IGjahr", FilterOperator.EQ, esercizio));
            }
            if (fornitore) {
                aFilter.push(new Filter("ILifnr", FilterOperator.Contains, fornitore));
            }

            aFilter.push(new Filter("ISegno", FilterOperator.EQ, (parseFloat(oDettaglio.Zdmbtr) || 0) >= 0 ? "+" : "-"));
            aFilter.push(new Filter("IBukrs", FilterOperator.EQ, oTestata.Zbukrs));
            aFilter.push(new Filter("IDmbtr", FilterOperator.EQ, oDettaglio.Zdmbtr));

            this.getOwnerComponent().getModel().read('/DocStzInputSet',

                {
                    filters: aFilter,
                    urlParameters: {
                        "$expand": "to_DocStzOutput"
                    },
                    success: function (data) {

                        that.getView().getModel("MatchCodeDocStz").setProperty("/stanziamenti", data.results);
                        that.byId("DocStzTable").setBusy(false)
                        that.getOwnerComponent().getModel("MatchCodeDocStz").setProperty("/OutputSet", data.results[0].to_DocStzOutput.results);

                    },
                    error: function (err) {
                        console.error(err)
                        that.byId("DocStzTable").setBusy(false)

                    }
                });

        },

        // onRowSelectionChange: function(oEvent) {
        //     var oTable = oEvent.getSource();
        //     var aSelectedIndices = oTable.getSelectedIndices();

        //     if (aSelectedIndices.length > 0) {
        //         // Ottieni il primo indice selezionato
        //         var iSelectedIndex = aSelectedIndices[0];

        //         // Ottieni l'elemento di contesto utilizzando l'indice
        //         var oBindingContext = oTable.getContextByIndex(iSelectedIndex);

        //         if (oBindingContext) {
        //             // Estrai il valore desiderato
        //             var sValue = oBindingContext.getProperty("Zposid"); // Sostituisci "desiredField" con il campo corretto

        //             // Imposta il valore nell'input
        //             var oInput = this.getView().byId("CommessaAvanzamento");
        //             oInput.setValue(sValue);

        //             // Chiudi il dialogo
        //             this.byId("IdCommessaHelpRequest").close();
        //         }
        //     }
        // },

        onRowSelectionChange: function (oEvent) {
            var oTable = oEvent.getSource();
            var aSelectedIndices = oTable.getSelectedIndices();

            if (aSelectedIndices.length > 0) {
                // Ottieni il primo indice selezionato
                var iSelectedIndex = aSelectedIndices[0];

                // Ottieni l'elemento di contesto utilizzando l'indice
                var oBindingContext = oTable.getContextByIndex(iSelectedIndex);

                if (oBindingContext) {
                    // Estrai il valore desiderato
                    var sValue = oBindingContext.getProperty("Zposid"); // Assicurati che il campo esista

                    this.getOwnerComponent().getModel("DatiBemDetail").setProperty(sPath + "/ZpsPosid", sValue)

                    // Chiudi il dialogo
                    this.byId("IdCommessaHelpRequest").close();
                }
            }
        },



        ConfermaCommessa: function () {
            var oDialog = this.byId("IdCommessaHelpRequest");
            if (oDialog) {
                oDialog.close();
            }
        },

        mapDataToModel: function (inputArray) {
            var nprot = this.getOwnerComponent().getModel("CreazioneModel").getProperty("/Nprot");
            const modelTemplate = {
                Znprot: nprot.toString(),
                Zmblnr: "",
                Zmjahr: "",
                Zcig: "",
                Zcup: "",
                Zdesccig: "",
                Zdmbtr: "",
                Zebelp: "",
                Zkbetr: "",
                Zknttp: "",
                Zmaktx: "",
                Zmatkl: "",
                Zmatnr: "",
                Zmeins: "",
                ZmengeD: "",
                Zpltxt: "",
                Zprzsconto: "",
                ZpsPosid: "",
                Zsgtxt: "",
                Zsospeso: "",
                ZstaBelnrBm: "",
                ZstaBuzeiBm: "",
                ZstaDmStz: "",
                ZstaGjahrBm: "",
                ZstaNoteBm: "",
                ZstaPrcStz: "",
                ZstaStzFin: false,
                ZstaStzahr: "",
                ZticketExists: false,
                Ztplnr: "",
                Zxblnr: "",
                Zelikz: false,
            };

            return inputArray.map(item => {
                // Create a new object based on the model template
                const mappedItem = { ...modelTemplate };

                // Map the values from the input to the template structure
                Object.keys(mappedItem).forEach(key => {
                    if (item.hasOwnProperty(key)) {
                        mappedItem[key] = item[key];
                    }
                });

                return mappedItem;
            });
        },

        AggiornaImportoTotale: function () {
            var Dati = this.getView().getModel("DatiBemDetail").getData()
            var dettaglierr = []

            dettaglierr = Dati.IDettaglioSet

            if (!dettaglierr) return;

            const dettagli = this.mapDataToModel(dettaglierr);
            var prezzotot = 0;

            for (var i = 0; i < dettagli.length; i++) {
                var prezzo = parseFloat(dettagli[i].Zprzsconto);
                prezzotot += prezzo;

            }
            this.getOwnerComponent().getModel("DatiBemDetail").setProperty("/OTESTATASet/ZnetwrAk", prezzotot);
            return prezzotot
        },

        presave: async function (oSalvaButtonEvent) {
            const oView = this.getView();
            const oDetailErrorModel = this.getOwnerComponent().getModel("DetailErrorModel");
            const oBemDetailModel = this.getOwnerComponent().getModel("DatiBemDetail");
            const oConfermaScrittureIntegrativeModel = oView.getModel("ConfermaScrittureIntegrative");
            const oSalvaButtonEventModel = oView.getModel("SalvaButtonEvent");
            const { __metadata, ...oTestata } = oBemDetailModel.getProperty("/OTESTATASet");
            const aDettagli = oBemDetailModel.getProperty("/IDettaglioSet");

            this.updateCosts();

            if (!(await this.checkStanziamenti())) {
                return false;
            }

            if (oTestata.Zbldat) {
                oTestata.Zbldat.setHours(6, 0, 0, 0);
            }
            if (oTestata.Zbudat) {
                oTestata.Zbudat.setHours(6, 0, 0, 0);
            }

            const aMappedDettagli = this.mapDataToModel(aDettagli);

            aMappedDettagli.forEach(oDettaglio => {
                oDettaglio.ZmengeD = oDettaglio.ZmengeD.replace(',', '.');
            });

            const oPayload = {
                Znprot: oTestata.Znprot,
                I_TESTATASet: { ...oTestata, ZnetwrAk: typeof oTestata.ZnetwrAk === "number" ? oTestata.ZnetwrAk.toFixed(3) : "0.0" },
                IDettaglioSet: aMappedDettagli,
                E_POS_RIEPILOGOSet: [],
                E_RIEPILOGOSet: [],
            };

            const oModel = this.getOwnerComponent().getModel();
            const [oBemPresave, oError] = await new Promise(function (resolve, reject) {
                oModel.create("/BEM_PRESAVESet", oPayload, {
                    success: function (oData) {
                        console.log(oData);

                        if (oData.ErrorMessage !== "") {
                            oDetailErrorModel.setProperty("/Visibility", true);
                            oDetailErrorModel.setProperty("/Message", oData.ErrorMessage);
                            resolve([null, oData.ErrorMessage]);
                        } else {
                            if (oData.Message !== "") {
                                oDetailErrorModel.setProperty("/Visibility", true);
                                oDetailErrorModel.setProperty("/Message", oData.Message);
                            } else {
                                oDetailErrorModel.setProperty("/Visibility", false);
                                oDetailErrorModel.setProperty("/Message", "ERROR");
                            }
                            resolve([oData, null]);
                        }
                    },
                    error: function (oError) {
                        reject([null, oError]);
                    },
                });
            });

            if (!oBemPresave && oError) {
                console.error(oError);
                return false;
            }

            oBemDetailModel.setProperty("/OTESTATASet", oBemPresave.I_TESTATASet);
            if (oBemPresave.IDettaglioSet) {
                oBemDetailModel.setProperty("/IDettaglioSet", oBemPresave.IDettaglioSet.results);
            }
            oBemDetailModel.refresh(true);

            const oRiepilogo = oBemPresave.E_RIEPILOGOSet.results && oBemPresave.E_RIEPILOGOSet.results.length > 0 ? oBemPresave.E_RIEPILOGOSet.results[0] : null;


            if (oRiepilogo && oRiepilogo.Zshow) {
                oConfermaScrittureIntegrativeModel.setData(oRiepilogo);
                oConfermaScrittureIntegrativeModel.refresh(true);

                oSalvaButtonEventModel.setData(oSalvaButtonEvent);
                oSalvaButtonEventModel.refresh(true);

                if (!this.byId("ConfermaScrittureIntegrative")) {
                    Fragment.load({
                        id: oView.getId(),
                        name: "sap.m.bem.view.fragment.ConfermaScrittureIntegrative",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        oDialog.open();
                    });
                } else {
                    this.byId("ConfermaScrittureIntegrative").open();
                }

                return false;
            }

            return true;
        },

        onConfermaScrittureIntegrativePress: function () {
            const oView = this.getView();
            const oSalvaButtonEventModel = oView.getModel("SalvaButtonEvent");
            const oDialog = this.byId("ConfermaScrittureIntegrative");

            if (oDialog) {
                oDialog.close();
            }

            const oSalvaButtonEvent = oSalvaButtonEventModel.getData();
            this.SalvaButton(oSalvaButtonEvent, false);
        },

        onAnnullaScrittureIntegrativePress: function () {
            const oDialog = this.byId("ConfermaScrittureIntegrative");

            if (oDialog) {
                oDialog.close();
            }
        },

        SalvaButton: async function (oEvent, bCheckPresave = true) {
            const page = this.byId("AvanzamentoBemPage");
            page.setBusyIndicatorDelay(0);
            page.setBusy(true);
            const oDatiBemDetailModel = this.getOwnerComponent().getModel("DatiBemDetail");
            const oTestata = oDatiBemDetailModel.getProperty("/OTESTATASet");
            const sFunz = oEvent.getSource().getText();

            let bPresaveOk = true;

            if (bCheckPresave) {
                if (sFunz && sFunz === "Salva") {
                    // premuto tasto salva
                    bPresaveOk = await this.presave(oEvent);
                } else {
                    //premuto Rilascia
                    const sTipoProt = oTestata.Ztpprot;
                    if (sTipoProt === "04") {
                        //forniture
                        bPresaveOk = await this.presave(oEvent);
                    }
                }

                if(!bPresaveOk) {
                    page.setBusy(false);
                    return;
                }
            }


            var oButton = oEvent.getSource();
            var buttonText = oButton.getText();
            var Dati = this.getView().getModel("DatiBemDetail").getData()

            var Stato = Dati.OTESTATASet.Ztpstato
            var nxStato = ""

            if (this.getOwnerComponent().getModel("SaveModel").getProperty('/status1') === buttonText) {
                nxStato = this.getOwnerComponent().getModel("SaveModel").getProperty('/value1')
            }

            if (this.getOwnerComponent().getModel("SaveModel").getProperty('/status2') === buttonText) {
                nxStato = this.getOwnerComponent().getModel("SaveModel").getProperty('/value2')
            }

            var dettaglierr = []

            // if ( Dati.IDettaglioSet) {
            dettaglierr = Dati.IDettaglioSet

            const dettagli = this.mapDataToModel(dettaglierr);
            // dettagli[0].Zdmbtr = Number(dettagli[0].Zdmbtr)

            // dettagli[0].Zkbetr = Number(dettagli[0].Zkbetr)

            // dettagli[0].Zprzsconto = Number(dettagli[0].Zprzsconto)

            // dettagli[0].ZstaDmStz = Number(dettagli[0].ZstaDmStz)

            // dettagli[0].Zsospeso = Number(dettagli[0].Zsospeso)

            // dettagli[0].ZmengeD = Number(dettagli[0].ZmengeD)

            // dettagli[0].ZstaPrcStz = Number(dettagli[0].ZstaPrcStz)

            // }

            var testata = Dati.OTESTATASet
            if (testata.Zbldat) {
                testata.Zbldat.setHours(6, 0, 0, 0);
            }
            if (testata.Zbudat) {
                testata.Zbudat.setHours(6, 0, 0, 0);
            }

            // var prezzotot = 0;
            var prezzotot = this.AggiornaImportoTotale();

            // for (var i = 0; i < dettagli.length; i++) {
            //     var prezzo = parseFloat(dettagli[i].Zprzsconto);
            //     prezzotot += prezzo;

            // }
            // this.getOwnerComponent().getModel("DatiBemDetail").setProperty("/OTESTATASet/ZnetwrAk" , prezzotot);

            prezzotot = prezzotot.toString();
            var payload = {
                "INumeroprotocollo": testata.Znprot,
                "IStatusnew": nxStato,
                "ICommit": "",
                "Znprot": testata.Znprot,
                "Zbldat": testata.Zbldat,
                "Zbudat": testata.Zbudat,
                "Zebeln": testata.Zebeln,
                "Zekgrp": testata.Zekgrp,
                "ZpsPosid": testata.ZpsPosid,
                "ZpsPost1": testata.ZpsPost1,
                "Zlifnr": testata.Zlifnr,
                "Zname1": testata.Zname1,
                "Zbukrs": testata.Zbukrs,
                "Zuname": testata.Zuname,
                "ZnetwrAk": prezzotot,
                "Ztpprot": testata.Ztpprot,
                "Zerdat": testata.Zerdat,
                "Zernam": testata.Zernam,
                "Ztpstato": testata.Ztpstato,
                "Ztpsotst": testata.Ztpsotst,
                "Ztpogg": testata.Ztpogg,
                "Zdescst": testata.Zdescst,
                "Zdesctp": testata.Zdesctp,
                "Zareat": testata.Zareat,
                "Zdscarea": testata.Zdscarea,
                "Zstarea": testata.Zstarea,
                "Zdscareas": testata.Zdscareas,
                "Zxblnr1": testata.Zxblnr1,
                "Zfrbnr": testata.Zfrbnr,
                "Zeknam": testata.Zeknam,
                "Zlemin": testata.Zlemin,
                "Zautobem": testata.Zautobem,
                "Zmotivsopravv": testata.Zmotivsopravv,
                "Zpernr": testata.Zpernr,
                "Zename": testata.Zename,
                "Zkostl": testata.Zkostl,
                "ZdescrCdc": testata.ZdescrCdc,
                "Zaufnr": testata.Zaufnr,
                "Zauftext": testata.Zauftext,
                "Zmodel": testata.Zmodel,
                "IDettaglioSet": dettagli
            }
            var that = this;
            var oModel = this.getOwnerComponent().getModel();
            oModel.create("/BEM_CHANGESet", payload, {
                success: async function (data) {

                    if (data.Message !== "") {

                        that.getOwnerComponent().getModel("DetailErrorModel").setProperty("/Visibility", true);
                        that.getOwnerComponent().getModel("DetailErrorModel").setProperty("/Message", data.Message);
                        var messagee = data.Message.toString()

                        if (messagee.includes("Il modulo di acquisizione") || messagee.includes("creato con successo")) {
                            that.ModificaButton()
                            await that.onSearch()
                        } else {

                        }
                    } else {
                        that.getOwnerComponent().getModel("DetailErrorModel").setProperty("/Visibility", false);
                        that.getOwnerComponent().getModel("DetailErrorModel").setProperty("/Message", "ERROR");
                        that.ModificaButton()
                        await that.onSearch()
                        MessageToast.show('Operazione Completata');


                    }


                    page.setBusy(false)
                },
                error: function (oError) {
                    page.setBusy(false)
                    MessageToast.show('Errore in fase di salvataggio');
                    console.error(oError);
                },

            });

        },

        onStampa: function () {
            var that = this;
            const filters = [];
            var IZnprot = this.getOwnerComponent().getModel("DatiBemDetail").getProperty("/OTESTATASet/Znprot");

            /*if (IZnprot) {
                filters.push(new sap.ui.model.Filter("INprot", sap.ui.model.FilterOperator.EQ, IZnprot));
            }*/

            var url = "/sap/opu/odata/sap/ZGTW_BEM_SRV/StampaSet('10033464')/$value";
            url = url.replace('10033464', IZnprot);


            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id"),
                appPath = appId.replaceAll(".", "/"),
                appModulePath = jQuery.sap.getModulePath(appPath);

            var opdfViewer = new PDFViewer();
            this.getView().addDependent(opdfViewer);
            var sServiceURL = this.getView().getModel().sServiceUrl;
            var sSource = appModulePath + url;
            opdfViewer.setSource(sSource);
            opdfViewer.setTitle(IZnprot);
            opdfViewer.open();


            /* this.getOwnerComponent().getModel().read("/StampaSet", {
                 filters: filters,
                 urlParameters: {
                     "$expand": "Pdf_RawSet,Pdf_DataSet"
                 },
                 success: function (data) {
 
                     var aFormattLines = [];
                     const aLines = data.results[0].Pdf_RawSet.results;
                     aLines.forEach(aLine => {
                         aFormattLines.push(aLine.Line)
                     });
                     let base64String = aFormattLines.join('');
 
 
                     base64String = base64String.replace(/[^A-Za-z0-9+/=]/g, '');
 
                     const padding = base64String.length % 4;
                     if (padding > 0) {
                         base64String += '='.repeat(4 - padding);
                     }
 
 
 
 
 
                     try {
                         const sDecodedPdfText = window.atob(base64String);
 
                         const blob = new Blob([sDecodedPdfText], { type: 'application/pdf' });
                         const blobUrl = URL.createObjectURL(blob);
 
                         const a = document.createElement('a');
                         a.href = blobUrl;
                         a.download = `${IZnprot}.pdf`;
                         document.body.appendChild(a);
                         a.click();
                         document.body.removeChild(a);
 
                         URL.revokeObjectURL(blobUrl);
                     } catch (e) {
                         console.error("Error decoding PDF:", e);
                         sap.m.MessageToast.show("Errore nella decodifica del PDF.");
                     }
                 },
                 error: function (oError) {
                     var jsonObject = JSON.parse(oError.responseText);
                     sap.m.MessageToast.show(jsonObject.error.message.value);
                 }
             });
             */
        },

        onDeletePosition: function () {
            var oTable = this.byId("PositionTable");
            var aSelectedIndices = oTable.getSelectedIndices();


            if (aSelectedIndices.length === 0) {
                sap.m.MessageToast.show("Nessun record selezionato");
                return;
            }

            var oModel = oTable.getModel("DatiBemDetail");

            var aData = oModel.getProperty("/IDettaglioSet");
            aSelectedIndices.sort(function (a, b) { return b - a; });
            aSelectedIndices.forEach(function (index) {
                aData.splice(index, 1);
            });
            oModel.setProperty("/IDettaglioSet", aData);
            oTable.clearSelection();
            sap.m.MessageToast.show("Record eliminato con successo");



        },

        Chiudi: function (oEvent) {
            this.getOwnerComponent().getModel("DetailErrorModel").setProperty("/Visibility", false);
            this.getOwnerComponent().getModel("DetailErrorModel").setProperty("/Message", "ERROR");
            var oRouter = this.getOwnerComponent().getRouter()
            oRouter.navTo("RouteBEM");
        },

        onCloseAllegati: function () {
            this.getView().byId("AllegatiDialog").close();
        },

        onAllegatiGetDocument: function () {

            var that = this
            that.getOwnerComponent().getModel("AllegatiModel").setProperty("/Allegati", [])
            var oTable = this.byId("UploadSetTable");
            if (oTable) {
                oTable.removeSelections();
            }


            this.zDialog ??= this.loadFragment({
                name: "sap.m.bem.view.fragment.Allegati"
            });
            this.zDialog.then((oDialog) => {
                oDialog.open();

                const oAllegatiTable = this.byId("UploadSetTable");
                if (oAllegatiTable) {
                    if (oAllegatiTable.getBusy()) {

                    } else {
                        oAllegatiTable.setBusyIndicatorDelay(0);
                        oAllegatiTable.setBusy(true);
                    }


                }
            });

            // inizio logica Guid
            var AllegatiConfig = this.getOwnerComponent().getModel("AllegatiConfig").getData();
            var guid = '';
            var oModel = this.getOwnerComponent().getModel("DatiBemDetail");

            var selSocieta = this.getOwnerComponent().getModel("DatiBemDetail").getProperty("/OTESTATASet/Zbukrs");

            guid = AllegatiConfig.filter((AllegatiConfig) => {
                return AllegatiConfig.Societa == selSocieta;
            });

            if (window.location.href.indexOf("test") > 0) {
                guid[0].Id = '556c5111-2fa0-476a-9ff8-43d80b5cdee2'
            }

            var oModel = this.getView().getModel("societaModel2").getProperty("/TipoProtocollo");

            var tpprot = this.getOwnerComponent().getModel("DatiBemDetail").getProperty("/OTESTATASet/Ztpprot");
            // fine logica Guid


            var that = this
            var numeroprotocolloF = this.getOwnerComponent().getModel("CreazioneModel").getProperty("/Nprot");

            var result = oModel.find(function (item) {
                return item.value === tpprot; // Confronta i valori
            });

            var folderID = numeroprotocolloF + " " + result.description

            var body = {
                "Metadata": {
                    "AVA_PF_NumeroProtocollo": numeroprotocolloF
                },
                "Path": folderID,
                // "relativePath":  numeroprotocolloF,
                "Guid": guid[0].Id
            }

            var strbody = JSON.stringify(body)

            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id"),
                appPath = appId.replaceAll(".", "/"),
                appModulePath = jQuery.sap.getModulePath(appPath);

            $.ajax({
                method: "POST",
                url: appModulePath + "/SharePoint/SharePointRWApi/api/get-documents",
                headers: {
                    "Content-Type": "application/json"
                },
                data: strbody,
                success: function (data, result) {

                    that.getOwnerComponent().getModel("AllegatiModel").setProperty("/Allegati", data)

                    that.onSelectionChangeA()
                    that.byId("UploadSetTable").setBusy(false);

                }.bind(this),
                error: function (error) {
                    var oTable = that.byId("UploadSetTable");
                    if (oTable) {
                        oTable.setBusy(false);
                        that.onCloseAllegati()
                    }
                    MessageToast.show("Chiamata Fallita Riprovare");


                }.bind(this),
            })

        },

        onAllegatiGetDocument2: function () {

            var that = this

            var oTable = this.byId("UploadSetTable");
            if (oTable) {
                oTable.removeSelections();
            }


            this.zDialog ??= this.loadFragment({
                name: "sap.m.bem.view.fragment.Allegati"
            });
            this.zDialog.then((oDialog) => {
                oDialog.open();

                const oAllegatiTable = this.byId("UploadSetTable");
                if (oAllegatiTable) {
                    if (oAllegatiTable.getBusy()) {

                    } else {
                        oAllegatiTable.setBusyIndicatorDelay(0);
                        oAllegatiTable.setBusy(true);
                    }


                }
            });

            // inizio logica Guid
            var AllegatiConfig = this.getOwnerComponent().getModel("AllegatiConfig").getData();
            var guid = '';
            var selSocieta = this.getOwnerComponent().getModel("DatiBemDetail").getProperty("/OTESTATASet/Zbukrs");

            guid = AllegatiConfig.filter((AllegatiConfig) => {
                return AllegatiConfig.Societa == selSocieta;
            });

            if (window.location.href.indexOf("test") > 0) {
                guid[0].Id = '556c5111-2fa0-476a-9ff8-43d80b5cdee2'
            }

            var oModel = this.getView().getModel("societaModel2").getProperty("/TipoProtocollo");

            var tpprot = this.getOwnerComponent().getModel("DatiBemDetail").getProperty("/OTESTATASet/Ztpprot");
            // fine logica Guid


            var that = this
            var numeroprotocolloF = this.getOwnerComponent().getModel("CreazioneModel").getProperty("/Nprot");

            var result = oModel.find(function (item) {
                return item.value === tpprot; // Confronta i valori
            });

            var folderID = numeroprotocolloF + " " + result.description

            var body = {
                "Metadata": {
                    "AVA_PF_NumeroProtocollo": numeroprotocolloF
                },
                "Path": folderID,
                // "relativePath":  numeroprotocolloF,
                "Guid": guid[0].Id
            }

            var strbody = JSON.stringify(body)

            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id"),
                appPath = appId.replaceAll(".", "/"),
                appModulePath = jQuery.sap.getModulePath(appPath);

            $.ajax({
                method: "POST",
                url: appModulePath + "/SharePoint/SharePointRWApi/api/get-documents",
                headers: {
                    "Content-Type": "application/json"
                },
                data: strbody,
                success: function (data, result) {

                    that.getOwnerComponent().getModel("AllegatiModel").setProperty("/Allegati", data)

                    that.onSelectionChangeA()
                    that.byId("UploadSetTable").setBusy(false);

                }.bind(this),
                error: function (error) {
                    var oTable = that.byId("UploadSetTable");
                    if (oTable) {
                        oTable.setBusy(false);
                        that.onCloseAllegati()
                    }
                    MessageToast.show("Chiamata Fallita Riprovare");


                }.bind(this),
            })

        },

        getSyUser: async function () {
            const that = this;
            return new Promise((resolve) => {
                that.getOwnerComponent().getModel().read("/SYNAMESet('IUser')", {
                    success: function (data) {
                        userUploader = data.IUser;
                        resolve();
                    },
                    error: function (oError) {
                        MessageToast.show('Impossibile recuperare username');
                        resolve();
                    }
                });
            });
        },


        onBeforeUploadStarts: function (oEvent) {
            const oItem = oEvent.getParameter("item"); // Prende l'elemento caricato
            const oFile = oItem.getFileObject(); // Prende l'oggetto file effettivo
            var today = new Date();

            // Estrai giorno, mese e anno
            var day = String(today.getDate()).padStart(2, '0');    // Aggiunge lo zero iniziale se il giorno è minore di 10
            var month = String(today.getMonth() + 1).padStart(2, '0');
            var year = today.getFullYear();

            // Combina i valori nel formato desiderato
            const dataOggi = day + '/' + month + '/' + year;
            var numeroprotocolloF = this.getOwnerComponent().getModel("CreazioneModel").getProperty("/Nprot");
            var soc = this.getOwnerComponent().getModel("DatiBemDetail").getProperty("/OTESTATASet/Zbukrs");
            var Area = this.getOwnerComponent().getModel("DatiBemDetail").getProperty("/OTESTATASet/Zdscarea");
            var commessa = this.getOwnerComponent().getModel("DatiBemDetail").getProperty("/OTESTATASet/ZpsPosid");
            var Forn = this.getOwnerComponent().getModel("DatiBemDetail").getProperty("/OTESTATASet/Zlifnr");
            var NomeFornitore = this.getOwnerComponent().getModel("DatiBemDetail").getProperty("/OTESTATASet/Zname1");
            var NomeWBE = this.getOwnerComponent().getModel("DatiBemDetail").getProperty("/OTESTATASet/ZpsPost1");
            var AutoreP = this.getOwnerComponent().getModel("DatiBemDetail").getProperty("/OTESTATASet/Zernam");
            var tipoAllegatoKey = this.getOwnerComponent().getModel("FileUploadModel").getProperty("/SelectedCategory");
            var today = new Date();
            // var oModel = this.getView().getModel("societaModel2").getProperty("/TipoProtocollo");
            var tpprotkey = this.getOwnerComponent().getModel("DatiBemDetail").getProperty("/OTESTATASet/Ztpprot");

            var tpprot = this.getTipoProtocolloTextById(tpprotkey)
            var tipoAllegato = this.getCategoryTextById(tipoAllegatoKey)
            // fine logica Guid


            var that = this
            var numeroprotocolloF = this.getOwnerComponent().getModel("CreazioneModel").getProperty("/Nprot");

            // var result = oModel.find(function (item) {
            //     return item.value === tpprot; // Confronta i valori
            // });

            var folderID = numeroprotocolloF + " " + tpprot

            if (oFile) {
                const oReader = new FileReader();

                oReader.onload = (e) => {
                    // Estrae la stringa Base64
                    const sBase64 = e.target.result.split(",")[1];

                    this.addBody = {

                        "Metadata": {
                            "AVA_PF_AreaTerritoriale": Area,
                            "AVA_PF_Societa1": soc,
                            "AVA_PF_AutoreProtocollo": AutoreP,
                            "AVA_PF_AutoreUpload": userUploader,
                            "AVA_PF_NumeroProtocollo": numeroprotocolloF,
                            "AVA_PF_DataProtocollo": today,
                            "AVA_PF_TipoProtocollo": tpprot,
                            "AVA_PF_WBE": commessa,
                            "AVA_PF_Fornitore": Forn,
                            "AVA_PF_DescrizioneFornitore": NomeFornitore,
                            "AVA_PF_DescrizioneWBE": NomeWBE,
                            "AVA_PF_TipoAllegato": tipoAllegato,
                        },
                        "FileName": oFile.name,
                        "FileData": sBase64,
                        "FolderPath": folderID,
                        "FolderType": 0,
                        "Guid": "556c5111-2fa0-476a-9ff8-43d80b5cdee2"

                    }


                };

                oReader.readAsDataURL(oFile);
            } else {
                console.error("File non trovato.");
            }
        },

        getCategoryTextById: function (categoryId) {
            var aCategories = this.getOwnerComponent().getModel("FileUploadModel").getProperty("/FileCategory")
            var oMatch = aCategories.find(function (o) {
                return o.categoryId === categoryId;
            });
            return oMatch ? oMatch.categoryText : ""; // oppure null o "Non trovato"
        },

        getTipoProtocolloTextById: function (categoryId) {
            var aCategories = this.getView().getModel("societaModel2").getProperty("/TipoProtocollo");
            var oMatch = aCategories.find(function (o) {
                return o.value === categoryId;
            });
            return oMatch ? oMatch.description : ""; // oppure null o "Non trovato"
        },


        onUploadCompleted: function () {
            var that = this
            var numeroprotocolloF = this.getOwnerComponent().getModel("CreazioneModel").getProperty("/Nprot");
            var AllegatiConfig = this.getOwnerComponent().getModel("AllegatiConfig").getData();
            var guid = '';
            var selSocieta = this.getOwnerComponent().getModel("DatiBemDetail").getProperty("/OTESTATASet/Zbukrs");

            guid = AllegatiConfig.filter((AllegatiConfig) => {
                return AllegatiConfig.Societa == selSocieta;
            });

            if (window.location.href.indexOf("test") > 0) {
                guid[0].Id = '556c5111-2fa0-476a-9ff8-43d80b5cdee2'
            }

            this.addBody.pathToUpload = "/" + numeroprotocolloF;
            this.addBody.Guid = guid[0].Id;
            this.containerType = "0";

            var body = JSON.stringify(this.addBody)
            that.byId("UploadSetTable").setBusyIndicatorDelay(0);
            that.byId("UploadSetTable").setBusy(true);

            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id"),
                appPath = appId.replaceAll(".", "/"),
                appModulePath = jQuery.sap.getModulePath(appPath);

            $.ajax({
                method: "POST",
                url: appModulePath + "/SharePoint/SharePointRWApi/api/UploadFile",
                headers: {
                    "Content-Type": "application/json"
                },
                data: body,
                success: function (data) {
                    that.onAllegatiGetDocument2()
                    // that.byId("UploadSetTable").setBusy(false);

                }.bind(this),
                error: function (error) {
                    that.byId("UploadSetTable").setBusy(false);
                    MessageToast.show("Chiamata Fallita Riprovare");

                }.bind(this),
            })

        },

        onDownloadFiles: function () {
            var that = this
            that.byId("UploadSetTable").setBusyIndicatorDelay(0);
            that.byId("UploadSetTable").setBusy(true);

            var stringID = JSON.stringify(AllegatiFileID)

            // inizio logica Guid
            var AllegatiConfig = this.getOwnerComponent().getModel("AllegatiConfig").getData();
            var guid = '';
            var selSocieta = this.getOwnerComponent().getModel("DatiBemDetail").getProperty("/OTESTATASet/Zbukrs");

            guid = AllegatiConfig.filter((AllegatiConfig) => {
                return AllegatiConfig.Societa == selSocieta;
            });

            if (window.location.href.indexOf("test") > 0) {
                guid[0].Id = '556c5111-2fa0-476a-9ff8-43d80b5cdee2'
            }

            // fine logica Guid

            var body = {
                "IdSharepoint": stringID,
                "Guid": guid[0].Id
            }

            var stringbody = JSON.stringify(body)
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id"),
                appPath = appId.replaceAll(".", "/"),
                appModulePath = jQuery.sap.getModulePath(appPath);

            $.ajax({
                method: "POST",
                url: appModulePath + "/SharePoint/SharePointRWApi/api/DownloadFile",
                headers: {
                    "Content-Type": "application/json"
                },
                data: stringbody,
                success: function (data) {

                    // try {
                    //     const sDecodedPdfText = window.atob(data.DataFile);
                    //     const blob = new Blob([sDecodedPdfText], { type: 'application/pdf' });
                    //     const blobUrl = URL.createObjectURL(blob);

                    //     const a = document.createElement('a');
                    //     a.href = blobUrl;
                    //     a.download = data.FileName;
                    //     document.body.appendChild(a);
                    //     a.click();
                    //     document.body.removeChild(a);

                    //     URL.revokeObjectURL(blobUrl);
                    // } catch (e) {
                    //     console.error("Error decoding PDF:", e);
                    //     sap.m.MessageToast.show("Errore nella decodifica del PDF.");
                    // }

                    try {
                        const sURLBase64 = `data:application/pdf;base64,${data.DataFile}`;
                        const oLink = document.createElement('a');
                        oLink.href = sURLBase64;
                        oLink.download = data.FileName;
                        oLink.click();
                    } catch (e) {
                        console.error("Error download PDF:", e);
                        sap.m.MessageToast.show("Errore durante download del PDF.");
                    }

                    that.byId("UploadSetTable").setBusy(false);

                }.bind(this),
                error: function (error) {
                    that.byId("UploadSetTable").setBusy(false);

                }.bind(this),
            })
        },



        onDeleteAllegati: function (oEvent) {

            var that = this
            that.byId("UploadSetTable").setBusyIndicatorDelay(0);
            that.byId("UploadSetTable").setBusy(true);

            var stringID = JSON.stringify(AllegatiFileID)

            // inizio logica Guid
            var AllegatiConfig = this.getOwnerComponent().getModel("AllegatiConfig").getData();
            var guid = '';
            var selSocieta = this.getOwnerComponent().getModel("DatiBemDetail").getProperty("/OTESTATASet/Zbukrs");

            guid = AllegatiConfig.filter((AllegatiConfig) => {
                return AllegatiConfig.Societa == selSocieta;
            });

            if (window.location.href.indexOf("test") > 0) {
                guid[0].Id = '556c5111-2fa0-476a-9ff8-43d80b5cdee2'
            }

            // fine logica Guid

            var body = {
                "IdSharepoint": stringID,
                "Guid": guid[0].Id
            }

            var stringbody = JSON.stringify(body)

            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id"),
                appPath = appId.replaceAll(".", "/"),
                appModulePath = jQuery.sap.getModulePath(appPath);

            $.ajax({
                method: "POST",
                url: appModulePath + "/SharePoint/SharePointRWApi/api/DeleteFile",
                headers: {
                    "Content-Type": "application/json"
                },
                data: stringbody,
                success: function (data) {


                    that.onAllegatiGetDocument2()
                    // that.byId("UploadSetTable").setBusy(false);

                }.bind(this),
                error: function (error) {
                    that.byId("UploadSetTable").setBusy(false);

                }.bind(this),
            })
        },

        onSelectionChangeA: function (oEvent) {
            var oTable = this.byId("UploadSetTable");

            var oSelectedItem = oTable.getSelectedItem();

            if (oSelectedItem) {

                var oContext = oSelectedItem.getBindingContext("AllegatiModel");

                var oSelectedData = oContext.getObject();

                AllegatiFileID = oSelectedData.FileId

                this.byId("downloadSelectedButton").setEnabled(true)

            } else {
                this.byId("downloadSelectedButton").setEnabled(false)
            }
        },

        itemValidationCallback: function (oItemInfo) {
            this._oFilesTobeuploaded = [];
            this.oItemsProcessor = [];
            this.getOwnerComponent().getModel("FileUploadModel").setProperty("/ItemName", oItemInfo.oItem.mProperties.fileName)

            const { oItem, iTotalItemsForUpload } = oItemInfo;
            var oItemPromise = new Promise((resolve, reject) => {
                this.oItemsProcessor.push({
                    item: oItem,
                    resolve: resolve,
                    reject: reject
                });
            });

            // if (iTotalItemsForUpload === 1) {
            this.openFileUploadDialog();
            // } else if (iTotalItemsForUpload === this.oItemsProcessor.length) {
            //     this.openFileUploadDialog();
            // }
            this.byId("UploadSetTable").setBusy(false);
            return oItemPromise;

        },


        openFileUploadDialog: function () {
            var items = this.oItemsProcessor;

            this._oFilesTobeuploaded = items;

            var oItemsMap = this._oFilesTobeuploaded.map(function (oItemProcessor) {

                return {
                    fileName: oItemProcessor.item.getFileName(),
                    fileCategorySelected: this.getOwnerComponent().getModel("FileUploadModel").getProperty("/SelectedCategory"),
                    itemInstance: oItemProcessor.item,
                    fnResolve: oItemProcessor.resolve,
                    fnReject: oItemProcessor.reject
                };
            }.bind(this));

            var oModel = new JSONModel({
                "selectedItems": oItemsMap,
                "types": this.documentTypes

            });

            this.globalModel = oModel


            this.zzDialog ??= this.loadFragment({
                name: "sap.m.bem.view.fragment.FileUpload"
            });
            this.zzDialog.then((oDialog) => {
                oDialog.open();

            });

        },

        handleConfirmation: function () {
            var oSelectedItems = this.globalModel.oData.selectedItems
            var oItemToUploadRef = oSelectedItems[0].itemInstance;
            var oItem = oSelectedItems[0]

            oItemToUploadRef.addHeaderField(new CoreItem({
                key: "documentType",
                text: oItem.fileCategorySelected
            }));

            // Risolvi la funzione di callback
            oItem.fnResolve(oItemToUploadRef);

            this.closeFileUplaodFragment()
        },

        closeFileUplaodFragment: function () {
            this.getView().byId("FileUploadDialog").close();
            this._oFilesTobeuploaded = [];
            this.oItemsProcessor = [];
        },

        getCategoryText: function (sCategoryId) {
            var aFileCategories = [
                { categoryId: "01", categoryText: "Preventivo o altro" },
                { categoryId: "02", categoryText: "Contratto" },
                { categoryId: "03", categoryText: "Verbale di coordinamento" },
                { categoryId: "04", categoryText: "Subappalto" },
                { categoryId: "05", categoryText: "Richieste Clienti" }
            ];

            var oCategory = aFileCategories.find(function (category) {
                return category.categoryId === sCategoryId;
            });

            return oCategory ? oCategory.categoryText : ""; // Restituisce il testo o una stringa vuota se non trova corrispondenze
        },

        // onDateChange: function (oEvent) {

        //     var tpprot = this.getOwnerComponent().getModel("DatiBemDetail").getProperty("/OTESTATASet/Ztpprot")
        //     if (tpprot != "74" & tpprot != "75") {

        //         const sValue = oEvent.getParameter("value");

        //         if (sValue) {

        //             var parts = sValue.split("/");

        //             var year = parts[2];

        //             var Dati = this.getView().getModel("DatiBemDetail").getData()
        //             var dettagli = Dati.IDettaglioSet


        //             if (dettagli != []) {
        //                 for (var i = 0; i < dettagli.length; i++) {
        //                     dettagli[i].ZstaStzahr = year
        //                 }
        //             }

        //         }
        //     }
        // },

        // S.Cannavale
        onInputChange: function (oEvent) {
            const oBinding = oEvent.getSource().getParent().getBindingContext("DatiBemDetail");
            const oRow = oBinding.getObject();

            const sSconto = (Number(oRow.ZmengeD) * Number(oRow.Zdmbtr)).toString();
            oBinding.setProperty("Zprzsconto", sSconto);

            this.updateCosts();
        }
    });
});
