sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Label",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/comp/smartvariants/PersonalizableInfo",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",

], function (Controller, JSONModel, Label, Filter, FilterOperator, PersonalizableInfo, Fragment, MessageToast) {
    "use strict";

    return Controller.extend("sap.m.bem.controller.BEMDetail", {
        onInit: function () {

            if (this.getOwnerComponent().getModel("CreazioneModel").getProperty("/Nprot") == "") {
                var oRouter = this.getOwnerComponent().getRouter()
                oRouter.navTo("RouteBEM");
            }

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("BEMDetail").attachPatternMatched(this.onClearData, this);

            // var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            // oRouter.getRoute("BEMDetail").attachPatternMatched(this.onSearchBemDetail, this);
        },

        onClearData: function () {

            this.getOwnerComponent().getModel("OdaForBem").setProperty("/ILifnr", "")
            this.getOwnerComponent().getModel("OdaForBem").setProperty("/ISedeTecnica", "")
            this.getOwnerComponent().getModel("OdaForBem").setProperty("/ICommessa", "")
            this.getOwnerComponent().getModel("OdaForBem").setProperty("/IEbeln", this.getOwnerComponent().getModel("DatiBemDetail").getProperty("/OTESTATASet/Zebeln"))
            this.getOwnerComponent().getModel("OdaForBem").setProperty("/to_OdaForBemEDettaglio", []);
            this.getOwnerComponent().getModel("CreazioneModel").setProperty("/Addposition", true)

        },

        onExportTo: function (oEvent) {
            ;
            var oTable = this.byId("ListaOrdini");
            var that = this;
            var aSelectedIndices = oTable.getSelectedIndices();

            var fieldMapping = {
                Mandt: "",
                Zcig: "Zcig",
                Zcup: "Zcup",
                Zdesccig: "Zdesccig",
                Zdmbtr: "Znetpr",
                // Zebeln: "Zebeln",
                Zebelp: "Zebelp",
                Zelikz: false,
                ZglAccount: "",
                Zgsber: "",
                Zkbetr: "Zkbetr",
                Zknttp: "Zknttp",
                Zmaktx: "Ztxz01",
                Zmatkl: "Zmatkl",
                Zmatnr: "Zmatnr",
                Zmblnr: "",
                Zmeins: "Zmeins",
                ZmengeD: "Zmenge",
                Zmjahr: "",
                Znprot: "",
                Znprotbemrif: "",
                Zotherdoc: false,
                Zpltxt: "Zpltxt",
                Zposnrbemrif: "Zposnrbemrif",
                Zprzsconto: "Zponetpr",
                ZpsPosid: "ZpsPosid",
                Zsgtxt: "ZpsPost1T",
                Zsospeso: "Zsconto1",
                ZstaBelnrBm: "ZstaBelnrBm",
                ZstaBuzeiBm: "ZstaBuzeiBm",
                ZstaDmStz: "ZstaDmStz",
                ZstaGjahrBm: "ZstaGjahrBm",
                ZstaNoteBm: "ZstaNoteBm",
                ZstaPrcStz: "ZstaPrcStz",
                ZstaStzFin: "ZstaStzFin",
                ZstaStzahr: "ZstaStzahr",
                ZticketExists: "ZticketExists",
                Ztplnr: "Ztplnr",
                Zxblnr: "",
                Zzeile: "Zzeile"
            };


            if (aSelectedIndices.length > 0) {

                var targetArray = that.getOwnerComponent().getModel("DatiBemDetail").getProperty("/IDettaglioSet");

                aSelectedIndices.forEach(function (iIndex) {
                    var oContext = oTable.getContextByIndex(iIndex);
                    var oData = oContext.getObject();

                    that.mapAndPushData(oData, targetArray, fieldMapping);
                });

                that.getOwnerComponent().getModel("DatiBemDetail").setProperty("/IDettaglioSet", targetArray);

                MessageToast.show("Operazione avvenuta con successo");

                

                var oHistory = sap.ui.core.routing.History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();
                if (sPreviousHash !== undefined) {
                    
                    window.history.go(-1);
                }
            } else {
                MessageToast.show("Nessuna riga selezionata");
            }
        },

        mapAndPushData: function (source, targetArray, mapping) {

            var Tpprot = this.getOwnerComponent().getModel("DatiBemDetail").getProperty("/OTESTATASet/Ztpprot")
            var mappedObject = {};

            this.getOwnerComponent().getModel("DatiBemDetail").setProperty("/OTESTATASet/Zlifnr", source.ZlifnrT);
            this.getOwnerComponent().getModel("DatiBemDetail").setProperty("/OTESTATASet/Zekgrp", source.ZekgrpT);
            this.getOwnerComponent().getModel("DatiBemDetail").setProperty("/OTESTATASet/Zname1", source.Zname1T);
            this.getOwnerComponent().getModel("DatiBemDetail").setProperty("/OTESTATASet/Zebeln", source.Zebeln);


            this.getOwnerComponent().getModel("DatiBemDetail").setProperty("/OTESTATASet/ZpsPosid", source.ZpsPosid);
            this.getOwnerComponent().getModel("DatiBemDetail").setProperty("/OTESTATASet/Zareat", source.Zareat);
            this.getOwnerComponent().getModel("DatiBemDetail").setProperty("/OTESTATASet/Zaufnr", source.Zaufnr);
            this.getOwnerComponent().getModel("DatiBemDetail").setProperty("/OTESTATASet/ZdescrCdc", source.ZdescrCdc);
            this.getOwnerComponent().getModel("DatiBemDetail").setProperty("/OTESTATASet/Zdscarea", source.Zdscarea);
            this.getOwnerComponent().getModel("DatiBemDetail").setProperty("/OTESTATASet/Zeknam", source.Zeknam);

            this.getOwnerComponent().getModel("DatiBemDetail").setProperty("/OTESTATASet/Zkostl", source.Zkostl);
            this.getOwnerComponent().getModel("DatiBemDetail").setProperty("/OTESTATASet/Zmodel", source.Zmodel);

            for (var targetField in mapping) {
                var sourceField = mapping[targetField];
                if (sourceField && source.hasOwnProperty(sourceField)) {

                    mappedObject[targetField] = source[sourceField];

                } else {
                }
            }

            var currentYear = new Date().getFullYear();

            var yearAsString = currentYear.toString();

            if (Tpprot == "75" | Tpprot == "74") {
                mappedObject.ZstaStzahr = yearAsString
            }

            targetArray.push(mappedObject);
        },


        onSearchBemDetail: function () {
            var that = this
            var table = this.byId("ListaOrdini");
            table.setBusy(true);
            const oModel = this.getOwnerComponent().getModel();
            var aFilters = [];

            var Dati = this.getOwnerComponent().getModel("DatiBemDetail").getData()
            var testata = Dati.OTESTATASet


            var ITipoprotocollo = testata.Ztpprot;
            var ISocieta = testata.Zbukrs;
            var ILifnr = this.getOwnerComponent().getModel("OdaForBem").getProperty("/ILifnr")
            var ISedeTecnica = this.getOwnerComponent().getModel("OdaForBem").getProperty("/ISedeTecnica")
            var ICommessa = this.getOwnerComponent().getModel("OdaForBem").getProperty("/ICommessa")
            var IEbeln = this.getOwnerComponent().getModel("OdaForBem").getProperty("/IEbeln")

            if (ITipoprotocollo) {
                aFilters.push(new Filter("ITipoprotocollo", FilterOperator.Contains, ITipoprotocollo));
            }
            if (ISocieta) {
                aFilters.push(new Filter("ISocieta", FilterOperator.EQ, ISocieta));
            }
            if (ILifnr) {
                aFilters.push(new Filter("ILifnr", FilterOperator.EQ, ILifnr));
            }
            if (ISedeTecnica) {
                aFilters.push(new Filter("ISedeTecnica", FilterOperator.Contains, ISedeTecnica));
            }
            if (ICommessa) {
                aFilters.push(new Filter("ICommessa", FilterOperator.Contains, ICommessa));
            }
            if (IEbeln) {
                aFilters.push(new Filter("IEbeln", FilterOperator.Contains, IEbeln));
            }


            oModel.read('/OdaForBemSet', {
                filters: aFilters,
                urlParameters: {
                    "$expand": "to_OdaForBemEDettaglio"
                },
                success: function (data) {

                    that.getOwnerComponent().getModel("OdaForBem").setProperty("/to_OdaForBemEDettaglio", data.results[0].to_OdaForBemEDettaglio.results);
                    table.setBusy(false);
                },
                error: function (err) {
                    table.setBusy(false);
                    console.error(err);
                }
            });
        },

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
                    var sValue = oBindingContext.getProperty("Zposid"); // Sostituisci "desiredField" con il campo corretto

                    // Imposta il valore nell'input
                    var oInput = this.getView().byId("Commessa2");
                    oInput.setValue(sValue);

                    // Chiudi il dialogo
                    this.byId("IdCommessaHelpRequest").close();
                }
            }
        },

        onCodiceFornitoreSelect: function (oEvent) {
            var oTable = oEvent.getSource();
            var aSelectedIndices = oTable.getSelectedIndices();

            if (aSelectedIndices.length > 0) {
                // Ottieni il primo indice selezionato
                var iSelectedIndex = aSelectedIndices[0];

                // Ottieni l'elemento di contesto utilizzando l'indice
                var oBindingContext = oTable.getContextByIndex(iSelectedIndex);

                if (oBindingContext) {
                    // Estrai il valore desiderato
                    var sValue = oBindingContext.getProperty("Lifnr"); // Sostituisci "desiredField" con il campo corretto

                    var lastFiveChars = sValue.slice(-5);
                    // Imposta il valore nell'input
                    var oInput = this.getView().byId("codicefornitoreinput2");
                    oInput.setValue(lastFiveChars);

                    // Chiudi il dialogo
                    this.byId("FragmentCodiceFornitore").close();
                }
            }
        },


        onCloseFragment: function () {
            this.getOwnerComponent().getModel("CreazioneModel").setProperty("/Addposition", true)
            var oRouter = this.getOwnerComponent().getRouter()
            oRouter.navTo("AvanzamentoBem");
        },

        Aprifornitori: function () {
            var oView = this.getView();
            if (!this.byId("FragmentCodiceFornitore")) {
                Fragment.load({
                    id: oView.getId(),
                    name: "sap.m.bem.view.fragment.CodiceFornitoreHelpRequest",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            } else {
                this.byId("FragmentCodiceFornitore").open();
            }
        },

        ConfermaFornitore: function () {
            var oDialog = this.byId("FragmentCodiceFornitore");
            if (oDialog) {
                oDialog.close();
            }
        },

        SelezioneFornitore: function (oEvent) {
            var iSelectedIndex = oEvent.getParameter("rowIndex");
            var oTable = this.byId("tableFornitori");
            var oSelectedContext = oTable.getContextByIndex(iSelectedIndex);
            var oSelectedObject = oSelectedContext.getObject()
            var CodiceFornitore = oSelectedObject.Lifnr
            this.getView().getModel("OdaForBem").setProperty("/ILifnr", CodiceFornitore)
        },


        CodiceFronitoreHelpRequest: function () {
            var that = this;
            var aFilter = [];
            this.byId("tableFornitori").setBusy(true)
            const oModel = this.getOwnerComponent().getModel("FornitoriFilterModel");
            var societa = oModel.getProperty("/societa")
            var fornitore = oModel.getProperty("/fornitore")
            var nome = oModel.getProperty("/nome")
            var localita = oModel.getProperty("/localita")
            var cap = oModel.getProperty("/cap")

            if (societa) {
                aFilter.push(new Filter("Bukrs", FilterOperator.EQ, societa));
            }
            if (nome) {
                aFilter.push(new Filter("Name1", FilterOperator.Contains, nome));
            }
            if (fornitore) {
                aFilter.push(new Filter("Lifnr", FilterOperator.Contains, fornitore));
            }
            if (localita) {
                aFilter.push(new Filter("Ort01", FilterOperator.Contains, localita));
            }
            if (cap) {
                aFilter.push(new Filter("Pstlz", FilterOperator.Contains, cap));
            }

            this.getOwnerComponent().getModel().read('/FornitoriSet',

                {
                    filters: aFilter,
                    success: function (data) {
                        that.getView().getModel("MatchCode").setProperty("/Fornitori", data.results);
                        that.byId("tableFornitori").setBusy(false)


                    },
                    error: function (err) {
                        console.error(err)
                        that.byId("tableFornitori").setBusy(false)

                    }
                });

        },



        CommessaValueHelp: function () {
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
        onSearchCommessa: function () {

            var that = this;
            var aFilter = [];
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
        ConfermaCommessa: function () {
            var oDialog = this.byId("IdCommessaHelpRequest");
            if (oDialog) {
                oDialog.close();
            }
        },
        SelezioneCommessa: function (oEvent) {

            var iSelectedIndex = oEvent.getParameter("rowIndex");
            var oTable = this.byId("CommessaTable");
            var oSelectedContext = oTable.getContextByIndex(iSelectedIndex);
            var oSelectedObject = oSelectedContext.getObject()
            var Commessa = oSelectedObject.Zposid
            this.getView().getModel("OdaForBem").setProperty("/ICommessa", Commessa)
        },

        onOdaControl: function () {
            
            var oTable = this.byId("ListaOrdini");

            var aSelectedIndices = oTable.getSelectedIndices();

            var oZebelnModel = this.getOwnerComponent().getModel("aZebelnValues");
            var aZebelnValues = oZebelnModel.getProperty("/ebeln");
        
            // Svuota l'array per una nuova selezione
            aZebelnValues.splice(0, aZebelnValues.length);

            var sDefaultZebeln = this.getOwnerComponent().getModel("DatiBemDetail").getProperty("/OTESTATASet/Zebeln");

            // Se esiste un valore predefinito valido, assicurati che sia presente nell'array globale
            if (sDefaultZebeln !== null && sDefaultZebeln !== undefined && aZebelnValues.indexOf(sDefaultZebeln) === -1 && sDefaultZebeln !== "") {
                aZebelnValues.push(sDefaultZebeln);
            }
        
            // Flag per verificare se i valori di Zebeln sono uguali
            var bValidSelection = true;
        
            // Controlla i valori di Zebeln nelle righe selezionate
            aSelectedIndices.forEach(function (iIndex) {
                var oContext = oTable.getContextByIndex(iIndex);
                if (oContext) {
                    var oData = oContext.getObject();
                    var sZebeln = oData.Zebeln;
        
                    // Aggiungi Zebeln all'array globale
                    if (aZebelnValues.length === 0) {
                        aZebelnValues.push(sZebeln);
                    } else if (aZebelnValues[0] !== sZebeln) {
                        bValidSelection = false;
                    }
                }
            });
        
            // Aggiorna il modello con i valori selezionati
            oZebelnModel.setProperty("/ebeln", aZebelnValues);
        
            // Se la selezione non è valida, mostra un messaggio e annulla la selezione
            if (!bValidSelection) {
                sap.m.MessageBox.error("Non è possibile selezionare righe con Doc diversi.");
                oTable.clearSelection();
        
                // Svuota l'array globale poiché la selezione è stata annullata
                aZebelnValues.splice(0, aZebelnValues.length);
                oZebelnModel.setProperty("/ebeln", aZebelnValues);
        
                return;
            }
        }

    });
});