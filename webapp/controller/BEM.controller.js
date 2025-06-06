sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Label",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/comp/smartvariants/PersonalizableInfo",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/DatePicker",
    "sap/m/Button",
    "sap/m/VBox"

], function (Controller, JSONModel, Label, Filter, FilterOperator, PersonalizableInfo, Fragment, MessageToast, Dialog, DatePicker, Button, VBox) {
    "use strict";

    return Controller.extend("sap.m.bem.controller.BEM", {
        onInit: function () {

            jQuery.sap.includeScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.2/xlsx.full.min.js", "xlsx", function () {
            });

            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this._oRouter.attachRouteMatched(this.handleRouteMatched, this);

            this.applyData = this.applyData.bind(this);
            this.fetchData = this.fetchData.bind(this);
            this.getFiltersWithValues = this.getFiltersWithValues.bind(this);

            // this.oSmartVariantManagement = this.getView().byId("svm");
            this.oExpandedLabel = this.getView().byId("expandedLabel");
            this.oSnappedLabel = this.getView().byId("snappedLabel");
            this.oFilterBar = this.getView().byId("filterbar");
            this.oTable = this.getView().byId("ProductTable");

            this.oFilterBar.registerFetchData(this.fetchData);
            this.oFilterBar.registerApplyData(this.applyData);
            this.oFilterBar.registerGetFiltersWithValues(this.getFiltersWithValues);

            var oPersInfo = new PersonalizableInfo({
                type: "filterBar",
                keyName: "persistencyKey",
                dataSource: "",
                control: this.oFilterBar
            });
            // this.oSmartVariantManagement.addPersonalizableControl(oPersInfo);



            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteBEM").attachPatternMatched(this.clearData, this);

        },

        clearData: function () {
            this.getOwnerComponent().getModel("CreazioneModel").setProperty("/Addposition", false)
            this.onGetSoc()
            this.onGetAreaFilter();
        },

        getTpprot: function (oEvent) {

            var that = this
            var Filters = []
            var ISocieta = oEvent.getParameter("selectedItem").getKey();


            if (ISocieta) {
                Filters.push(new Filter("ISocieta", FilterOperator.EQ, ISocieta));
            }

            this.getOwnerComponent().getModel().read("/TpprotSet", {
                filters: Filters,
                success: function (data) {

                    var aEnumerationValues = data.results.map(function (item) {
                        return {
                            value: item.Ztpprot,
                            description: item.Zdesctp
                        };
                    });

                    var oTpprotModel = new sap.ui.model.json.JSONModel({
                        Tp: aEnumerationValues
                    });

                    that.getOwnerComponent().setModel(oTpprotModel, "TpprotModel");

                },
                error: function (oError) {


                }
            });
        },

        onGetSoc: function () {
            var that = this
            this.getOwnerComponent().getModel().read("/ESocSet", {

                success: function (data) {

                    var aEnumerationValues = data.results.map(function (item) {
                        return {
                            value: item.Zbukrs,
                            description: item.Zltext
                        };
                    });

                    // Creazione del modello JSON con i dati mappati
                    var oSocietaModel = new sap.ui.model.json.JSONModel({
                        societa: aEnumerationValues
                    });
                    // Imposta il modello globale con il nome "SocietaModel"
                    that.getOwnerComponent().setModel(oSocietaModel, "societaModel");

                },
                error: function (oError) {


                }
            });
        },

        onGetAreaFilter: function () {
            var that = this;

            const aFilters = [];

            aFilters.push(new Filter("Zvisualizzazione", FilterOperator.EQ, true));

            this.getOwnerComponent().getModel().read("/AreaTSet", {
                filters: aFilters,
                success: function (data) {

                    const aAree = data.results.map((oArea) => ({ value: oArea.Zareat, description: oArea.Zdscarea }));

                    that.getOwnerComponent().getModel("AreaFModel").setProperty("/enumerationValues", aAree.filter((oArea) => oArea.description !== ""));

                },
                error: function (oError) {
                    MessageToast.show('Errore recupero filtri Aree');

                }
            });
        },

        handleRouteMatched: function () {
            // var that = this
            // const oModel = this.getOwnerComponent().getModel();
            // oModel.read('/STATO_LV_GETSet',
            //     {
            //         success: function (data) {
            //             that.getView().getModel("MatchCode").setProperty("/Stato", data.results);
            //             Stato.setBusy(false);
            //             
            //         },
            //         error: function (err) {
            //             console.error(err)
            //             Stato.setBusy(false);

            //         }
            //     });
            // oModel.read("/AREA_MC_GETSet('FACI')",
            //     { 
            //         urlParameters: {
            //         "$expand": "E_VALORI_STATOSet"
            //     },
            //         success: function (data) {
            //             that.getView().getModel("MatchCode").setProperty("/Area", data.results);
            //             Stato.setBusy(false);
            //             
            //         },
            //         error: function (err) {
            //             console.error(err)
            //             Stato.setBusy(false);
            //             

            //         }
            //     });

        },
        LetturaDati: function (oEvent) {
            var Table = this.byId("BEMTable")
            Table.setBusy(true);
            var that = this
            const oModel = this.getOwnerComponent().getModel();
            var INumeroprotocollo = this.getOwnerComponent().getModel("FilterModelFirstPage").getProperty("/INumeroprotocollo");
            var DataDABEM = this.getOwnerComponent().getModel("FilterModelFirstPage").getProperty("/DataDABEM");
            var A = this.getOwnerComponent().getModel("FilterModelFirstPage").getProperty("/A");
            var Commessa = this.getOwnerComponent().getModel("FilterModelFirstPage").getProperty("/Commessa");
            var CUP = this.getOwnerComponent().getModel("FilterModelFirstPage").getProperty("/CUP");
            var SedeTecnica = this.getOwnerComponent().getModel("FilterModelFirstPage").getProperty("/SedeTecnica");
            var AutoreBEM = this.getOwnerComponent().getModel("FilterModelFirstPage").getProperty("/AutoreBEM");
            var CodiceFor = this.getOwnerComponent().getModel("FilterModelFirstPage").getProperty("/CodiceFor");
            var NumeroCIG = this.getOwnerComponent().getModel("FilterModelFirstPage").getProperty("/NumeroCIG");
            var DataBEM = this.getOwnerComponent().getModel("FilterModelFirstPage").getProperty("/DataBEM");
            var Societa = this.getOwnerComponent().getModel("FilterModelFirstPage").getProperty("/Societa");
            var Area = this.getOwnerComponent().getModel("FilterModelFirstPage").getProperty("/Area");
            var NumeroODA = this.getOwnerComponent().getModel("FilterModelFirstPage").getProperty("/NumeroODA");
            var StatoBEM = this.getOwnerComponent().getModel("FilterModelFirstPage").getProperty("/StatoBEM");
            var EstrazioneParziale = this.getOwnerComponent().getModel("FilterModelFirstPage").getProperty("/EstrazioneParziale");
            var BEMBenestataria = this.getOwnerComponent().getModel("FilterModelFirstPage").getProperty("/BEMBenestataria");
            var NumeroBenessere = this.getOwnerComponent().getModel("FilterModelFirstPage").getProperty("/NumeroBenessere");

            var aFilters = [];
            if (INumeroprotocollo) {
                aFilters.push(new Filter("INumeroprotocollo", FilterOperator.Contains, INumeroprotocollo));
            }
            if (DataDABEM) {
                DataDABEM.setHours(6)
                aFilters.push(new Filter("IDataDa", FilterOperator.EQ, DataDABEM.toJSON().split('.')[0]));
            }
            if (A) {
                A.setHours(6)
                aFilters.push(new Filter("IDataA", FilterOperator.EQ, A.toJSON().split('.')[0]));
            }
            if (Commessa) {
                aFilters.push(new Filter("ICommessa", FilterOperator.Contains, Commessa));
            }
            if (CUP) {
                aFilters.push(new Filter("CUP", FilterOperator.Contains, CUP));
            }
            if (SedeTecnica) {
                aFilters.push(new Filter("SedeTecnica", FilterOperator.Contains, SedeTecnica));
            }
            if (AutoreBEM) {
                aFilters.push(new Filter("IAutorebem", FilterOperator.Contains, AutoreBEM));
            }
            if (CodiceFor) {
                aFilters.push(new Filter("ICodicefornitore", FilterOperator.Contains, CodiceFor));
            }
            if (NumeroCIG) {
                aFilters.push(new Filter("ICig", FilterOperator.Contains, NumeroCIG));
            }
            if (DataBEM) {
                DataBEM.setHours(6)
                aFilters.push(new Filter("IDatabem", FilterOperator.EQ, DataBEM.toJSON().split('.')[0]));
            }
            if (Societa) {
                aFilters.push(new Filter("ISocieta", FilterOperator.EQ, Societa));
            }
            if (Area) {
                aFilters.push(new Filter("IArea", FilterOperator.EQ, Area));
            }
            if (NumeroODA) {
                aFilters.push(new Filter("INumerooda", FilterOperator.Contains, NumeroODA));
            }
            // if (EstrazioneParziale) {
            //     aFilters.push(new Filter("IEstrparziale", FilterOperator.Contains, EstrazioneParziale));
            // }
            if (StatoBEM) {
                aFilters.push(new Filter("IStatobem", FilterOperator.EQ, StatoBEM));
            }
            if (BEMBenestataria) {
                // S.Cannavale
                //aFilters.push(new Filter("BEMBenestataria", FilterOperator.EQ, BEMBenestataria));
                const iBef = BEMBenestataria === 'X';
                aFilters.push(new Filter("IBef", FilterOperator.EQ, iBef));
            }
            // if(NumeroBenessere){
            //     aFilters.push(new Filter("NumeroBenessere", FilterOperator.Contains, NumeroBenessere));
            // }
            oModel.read('/GETLISTSet',
                {
                    filters: aFilters,
                    urlParameters: {
                        "$expand": "LISTDOCSet"
                    },
                    success: function (data) {
                        Table.setBusy(false);

                        that.getOwnerComponent().getModel("DatiTabellaPrimaPagina").setProperty("/Dati", data.results)


                    },
                    error: function (err) {
                        console.error(err)
                        Table.setBusy(false);
                    }
                });

        },
        ChangeRow: function (oEvent) {
            var iSelectedIndex = oEvent.getParameter("rowIndex");
            var oTable = this.byId("BEMTable");
            var oSelectedContext = oTable.getContextByIndex(iSelectedIndex);
            var oSelectedObject = oSelectedContext.getObject();
            this.getOwnerComponent().getModel("RowSelect").setData(oSelectedObject)

        },
        onDeletePress: function (oEvent) {

            var that = this;
            const oModel = this.getOwnerComponent().getModel();
            var nprot = this.getOwnerComponent().getModel("RowSelect").getProperty("/Znprot")
            var oDatePicker = new DatePicker({
                width: "100%",
                valueFormat: "yyyy-MM-dd",
                displayFormat: "dd/MM/yyyy",
            });

            oDatePicker.setDateValue(this.getOwnerComponent().getModel("RowSelect").getProperty("/Zbudat"));

            var oVBox = new VBox({
                items: [
                    new Label({ text: "Data registrazione nel documeto:" }),
                    oDatePicker
                ],
            }).addStyleClass("sapUiSmallMargin");

            // Crear el diálogo
            var oDialog = new Dialog({
                title: "Seleziona una data per l'annullamento",
                content: [
                    oVBox
                ],
                beginButton: new Button({
                    text: "Conferma",
                    press: function () {
                        var sSelectedDate = oDatePicker.getDateValue();
                        const Payload = {
                            INumeroprotocollo: nprot,
                            IBudat: sSelectedDate
                        };
                        oModel.create(`/REJECTSet`, Payload,
                            {
                                success: function (data) {
                                    var message = data.Message;
                                    if (message !== "") {
                                        MessageToast.show(message);
                                        2
                                    } else {
                                        MessageToast.show("Operazione Completata");
                                        that.LetturaDati()
                                    }
                                },
                                error: function (err) {
                                    console.error(err)
                                }
                            });
                        oDialog.close();
                    }
                }),
                endButton: new Button({
                    text: "Indietro",
                    press: function () {
                        oDialog.close();
                    }
                })
            });

            // Abrir el diálogo
            oDialog.open();




        },

        Dettaglio: function (oEvent) {

            var oRouter = this.getOwnerComponent().getRouter();
            var nprot = this.getOwnerComponent().getModel("RowSelect").getProperty("/Znprot")
            this.getOwnerComponent().getModel("CreazioneModel").setProperty("/Nprot", nprot)
            if (nprot != undefined) {
                oRouter.navTo("AvanzamentoBem");
            } else {
                MessageToast.show('Nessun record selezionato');
            }

        },

        // onSearchFornitori: function (oEvent) {
        //     var oModel = this.getOwnerComponent().getModel("FornitoriFilterModel")
        //     var societa = oModel.getProperty("/societa")
        //     var fornitore = oModel.getProperty("/fornitore")
        //     var nome = oModel.getProperty("/nome")
        //     var localita = oModel.getProperty("/localita")
        //     var cap = oModel.getProperty("/cap")

        //     var aFilter = []
        //     aFilter.push(new Filter("Pstlz", FilterOperator.EQ, societa));
        //     aFilter.push(new Filter("Lifnr", FilterOperator.Contains, fornitore));
        //     aFilter.push(new Filter("Name1", FilterOperator.Contains, nome));
        //     aFilter.push(new Filter("Ort01", FilterOperator.Contains, localita));
        //     aFilter.push(new Filter("Bukrs", FilterOperator.Contains, cap));

        //     var oTable = this.byId("tableFornitori");
        //     var oBinding = oTable.getBinding("rows");
        //     oBinding.filter(aFilter);
        // },
        Cancel: function () {
            var oModel = this.getOwnerComponent().getModel("FornitoriFilterModel")
            var vuoto = ""
            oModel.setProperty("/societa", vuoto)
            oModel.setProperty("/fornitore", vuoto)
            oModel.setProperty("/nome", vuoto)
            oModel.setProperty("/localita", vuoto)
            oModel.setProperty("/cap", vuoto)
            this.onSearchFornitori();
        },
        clearFilter: function (oEvent) {
            var vuoto = "";
            var DataA = new Date();
            var DataDA = new Date();
            DataDA.setMonth(DataA.getMonth() - 4);
            var oModel = this.getOwnerComponent().getModel("FilterModelFirstPage")
            oModel.setProperty("/INumeroprotocollo", vuoto);
            oModel.setProperty("/DataDABEM", DataDA);
            oModel.setProperty("/A", DataA);
            oModel.setProperty("/Commessa", vuoto);
            oModel.setProperty("/CUP", vuoto);
            oModel.setProperty("/SedeTecnica", vuoto);
            oModel.setProperty("/AutoreBEM", vuoto);
            oModel.setProperty("/CodiceFor", vuoto);
            oModel.setProperty("/NumeroCIG", vuoto);
            oModel.setProperty("/DataBEM", vuoto);
            oModel.setProperty("/Societa", vuoto);
            oModel.setProperty("/Area", vuoto);
            oModel.setProperty("/NumeroODA", vuoto);
            oModel.setProperty("/StatoBEM", vuoto);
            oModel.setProperty("/EstrazioneParziale", vuoto);
            oModel.setProperty("/BEMBenestataria", vuoto);
            oModel.setProperty("/NumeroBenessere", vuoto);
            this.LetturaDati();
        },
        // onExportPress: function () {
        //     var aDati = this.getOwnerComponent().getModel("RowSelect").getData();
        //     var exportData = [];
        //     exportData.push({
        //         "Colonna1": aDati.Znprot,
        //         "Colonna2": aDati.Zbldat,
        //         "Colonna3": aDati.Zbudat,
        //         "Colonna4": aDati.Zdescst,
        //         "Colonna5": aDati.Zernam,
        //         "Colonna6": aDati.Zmodel,
        //         "Colonna7": aDati.Zpspnr,
        //         "Colonna8": aDati.Zlifnr,
        //         "Colonna9": aDati.Zebeln,
        //         "Colonna10": aDati.Znetwr,
        //         "Colonna11": aDati.Zimportobdl,
        //         "Colonna12": aDati.Ztpprotoda,
        //         "Colonna13": aDati.Zcup,
        //         "Colonna14": aDati.Zcig,
        //         "Colonna15": aDati.Zdesccig,
        //         "Colonna16": aDati.Zbef,
        //         "Colonna17": aDati.Zdtannul,
        //         "Colonna18": aDati.Zusannul
        //     });

        //     var ws = XLSX.utils.json_to_sheet(exportData);
        //     var wb = XLSX.utils.book_new();
        //     XLSX.utils.book_append_sheet(wb, ws, "Dati");
        //     XLSX.writeFile(wb, "ExportDati.xlsx");
        // },

        onExcel: function () {

            var aData = this.getOwnerComponent().getModel("DatiTabellaPrimaPagina").getProperty("/Dati/0/LISTDOCSet/results");

            if (!Array.isArray(aData)) {

                MessageToast.show('La tabella non contiene valori');
                return;
            }

            var aCols = [
                { label: "Numero", property: "Znprot" },
                { label: "Data Creazione BEM", property: "Zbldat", type: "sap.ui.model.type.Date", formatOptions: { pattern: "dd/MM/yyyy" } },
                { label: "Data Registrazione", property: "Zbudat", type: "sap.ui.model.type.Date", formatOptions: { pattern: "dd/MM/yyyy" } },
                { label: "Stato", property: "Zdescst" },
                { label: "Autore", property: "Zernam" },
                { label: "Wbs/Cdc", property: "Zmodel" },
                { label: "Descriz. Wbs/Cdc", property: "Zpspnr" },
                { label: "ID Fornitore", property: "Zlifnr" },
                { label: "Fornitore", property: "Zebeln" },
                { label: "Importo Totale", property: "Znetwr" },
                { label: "Importo Benestatario BEM", property: "Zimportobdl" },
                { label: "N. OdA", property: "Ztpprotoda" },
                { label: "Tipo OdA", property: "Zdesctpoda" },
                { label: "Codice CUP", property: "Zcup" },
                { label: "Codice CIG", property: "Zcig" },
                { label: "Descrizione CIG", property: "Zdesccig" },
                { label: "BEM Benestariata", property: "Zbef" },
                { label: "Data Annullamento", property: "Zdtannul", type: "sap.ui.model.type.Date", formatOptions: { pattern: "dd/MM/yyyy" } },
                { label: "Utente Annullamento", property: "Zusannul" }
            ];

            var aExcelData = aData.map(function (oItem) {
                var oExcelItem = {};
                aCols.forEach(function (oCol) {
                    if (oCol.property === 'Zbldat' || oCol.property === 'Zbudat' || oCol.property === 'Zdtannul') {
                        oExcelItem[oCol.label] = oItem[oCol.property] ? new Date(oItem[oCol.property]).toLocaleDateString() : "";
                    } else {
                        oExcelItem[oCol.label] = oItem[oCol.property];
                    }
                });
                return oExcelItem;
            });

            var oWorksheet = XLSX.utils.json_to_sheet(aExcelData);
            var oWorkbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(oWorkbook, oWorksheet, "Sheet1");
            XLSX.writeFile(oWorkbook, "Export.xlsx");



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

        NumeroOdaValueHelp: function () {
            var oView = this.getView();
            if (!this.byId("IdNumeroOdaHelpRequest")) {
                Fragment.load({
                    id: oView.getId(),
                    name: "sap.m.bem.view.fragment.NumeroOdaHelpRequest",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            } else {
                this.byId("IdNumeroOdaHelpRequest").open();
            }
        },
        NumeroCIGValueHelp: function () {
            var oView = this.getView();
            if (!this.byId("IdNumeroCigHelpRequest")) {
                Fragment.load({
                    id: oView.getId(),
                    name: "sap.m.bem.view.fragment.NumeroCigHelpRequest",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            } else {
                this.byId("IdNumeroCigHelpRequest").open();
            }
        },
        AutoreBEMValueHelp: function () {
            var oView = this.getView();
            if (!this.byId("IdAutorebemHelpRequest")) {
                Fragment.load({
                    id: oView.getId(),
                    name: "sap.m.bem.view.fragment.AutorebemHelpRequest",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            } else {
                this.byId("IdAutorebemHelpRequest").open();
            }
        },
        SedeTecnicaValueHelp: function () {
            var oView = this.getView();
            if (!this.byId("IdHelpRequestSedeTecnica")) {
                Fragment.load({
                    id: oView.getId(),
                    name: "sap.m.bem.view.fragment.SedeTecnicaHelpRequest",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            } else {
                this.byId("IdHelpRequestSedeTecnica").open();
            }
        },

        onSedeTecnicaSearch: function () {
            const filters = [];
            var that = this;
            var SedeTecnica = this.getOwnerComponent().getModel("SedeTecnicaFilterModel").getProperty("/SedeTecnica")
            var Societa = this.getOwnerComponent().getModel("SedeTecnicaFilterModel").getProperty("/Societa")
            var Descrizione = this.getOwnerComponent().getModel("SedeTecnicaFilterModel").getProperty("/Descrizione")
            var WBS = this.getOwnerComponent().getModel("SedeTecnicaFilterModel").getProperty("/WBS")


            if (SedeTecnica != "") {
                filters.push(new sap.ui.model.Filter("Tplnr", sap.ui.model.FilterOperator.Contains, SedeTecnica));
            } if (Societa != "") {
                filters.push(new sap.ui.model.Filter("Zbukrs", sap.ui.model.FilterOperator.Contains, Societa));
            } if (WBS != "") {
                filters.push(new sap.ui.model.Filter("Posid", sap.ui.model.FilterOperator.Contains, WBS));
            } if (Descrizione != "") {
                filters.push(new sap.ui.model.Filter("Pltxt", sap.ui.model.FilterOperator.Contains, Descrizione));
            }
            this.byId("SedeTecnicaTable").setBusy(true);
            this.getOwnerComponent().getModel().read("/SedeTecnicaSet", {
                filters: filters, // use sap.ui.model.Filter for filters
                success: function (data) {
                    that.byId("SedeTecnicaTable").setBusy(false);
                    that.getOwnerComponent().getModel("MatchCode").setProperty("/SedeTecnica", data)


                }.bind(that),
                error: function (oError) {
                    that.byId("SedeTecnicaTable").setBusy(false);
                    MessageToast.show('ERRORE DI SISTEMA');
                }
            });



        },

        onSedeTecnicaSelect: function () {

            var oTable = this.byId("SedeTecnicaTable");

            var oSelectedItem = oTable.getSelectedItem();

            if (oSelectedItem) {

                var oContext = oSelectedItem.getBindingContext("MatchCode");

                var oSelectedData = oContext.getObject();

                this.getOwnerComponent().getModel("FilterModelFirstPage").setProperty("/SedeTecnica", oSelectedData.Tplnr);

                this.ConfermaSedeTecnica()

            } else {
                MessageToast.show("Nessun record selezionato");
            }
        },

        ConfermaNumeroCig: function () {
            var oDialog = this.byId("IdNumeroCigHelpRequest");
            if (oDialog) {
                oDialog.close();
            }
        },
        ConfermaNumeroOda: function () {
            var oDialog = this.byId("IdNumeroOdaHelpRequest");
            if (oDialog) {
                oDialog.close();
            }
        },
        ConfermaAutorebem: function () {
            var oDialog = this.byId("IdAutorebemHelpRequest");
            if (oDialog) {
                oDialog.close();
            }
        },
        ConfermaFornitore: function () {
            var oDialog = this.byId("FragmentCodiceFornitore");
            if (oDialog) {
                oDialog.close();
            }
        },
        ConfermaCommessa: function () {
            var oDialog = this.byId("IdCommessaHelpRequest");
            if (oDialog) {
                oDialog.close();
            }
        },
        ConfermaSedeTecnica: function () {
            var oDialog = this.byId("IdHelpRequestSedeTecnica");
            if (oDialog) {
                oDialog.close();
            }
        },
        onOpenFragment: function () {
            var oView = this.getView();

            if (!this.byId("BEMFragment")) {
                Fragment.load({
                    id: oView.getId(),
                    name: "sap.m.bem.view.fragment.CreazioneBEM",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            } else {
                this.byId("BEMFragment").open();
            }
        },
        onClose: function (oEvent) {
            this.byId("BEMFragment").close();
        },

        onSearchFragment: function (oEvent) {
            var that = this;
            var table = this.byId("BEMFragment")
            var oRouter = that.getOwnerComponent().getRouter()
            var soci = this.getOwnerComponent().getModel("CreazioneModel").getProperty("/Societa")
            var tipo = this.getOwnerComponent().getModel("CreazioneModel").getProperty("/Tipo")
            table.setBusy(true)
            var oModel = this.getView().getModel();
            oModel.create('/BEMSet',
                {
                    ENprot: '',
                    IBukrs: soci,
                    ITpprot: tipo
                },
                {
                    success: function (oData) {

                        that.getOwnerComponent().getModel("CreazioneModel").setProperty("/Nprot", oData.ENprot)
                        that.getOwnerComponent().getModel("DetailErrorModel").setProperty("/Visibility", false);
                        that.getOwnerComponent().getModel("DetailErrorModel").setProperty("/Message", "ERROR");

                        table.setBusy(false)

                        oRouter.navTo("AvanzamentoBem");
                    },
                    error: function (err) {
                        this.onClose()
                        console.error(err)
                        MessageToast.show("Creazione Impossibile");
                    }
                });

        },
        onExit: function () {
            this.oModel = null;
            // this.oSmartVariantManagement = null;
            this.oExpandedLabel = null;
            this.oSnappedLabel = null;
            this.oFilterBar = null;
            this.oTable = null;
        },

        fetchData: function () {
            // var aData = this.oFilterBar.getAllFilterItems().reduce(function (aResult, oFilterItem) {
            //     aResult.push({
            //         groupName: oFilterItem.getGroupName(),
            //         fieldName: oFilterItem.getName(),
            //         fieldData: oFilterItem.getControl().getSelectedKeys()
            //     });

            //     return aResult;
            // }, []);

            // return aData;
        },

        applyData: function (aData) {
            aData.forEach(function (oDataObject) {
                var oControl = this.oFilterBar.determineControlByName(oDataObject.fieldName, oDataObject.groupName);
                oControl.setSelectedKeys(oDataObject.fieldData);
            }, this);
        },

        getFiltersWithValues: function () {
            var aFiltersWithValue = this.oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                var oControl = oFilterGroupItem.getControl();

                if (oControl && oControl.getSelectedKeys && oControl.getSelectedKeys().length > 0) {
                    aResult.push(oFilterGroupItem);
                }

                return aResult;
            }, []);

            return aFiltersWithValue;
        },

        onSelectionChange: function (oEvent) {
            // this.oSmartVariantManagement.currentVariantSetModified(true);
            this.oFilterBar.fireFilterChange(oEvent);
        },
        onSearch: function () {
            var aTableFilters = this.oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                var oControl = oFilterGroupItem.getControl(),
                    aSelectedKeys = oControl.getSelectedKeys(),
                    aFilters = aSelectedKeys.map(function (sSelectedKey) {
                        return new Filter({
                            path: oFilterGroupItem.getName(),
                            operator: FilterOperator.Contains,
                            value1: sSelectedKey
                        });
                    });

                if (aSelectedKeys.length > 0) {
                    aResult.push(new Filter({
                        filters: aFilters,
                        and: false
                    }));
                }

                return aResult;
            }, []);

            this.oTable.getBinding("items").filter(aTableFilters);
            this.oTable.setShowOverlay(false);
        },

        onFilterChange: function () {
            this._updateLabelsAndTable();
        },

        onAfterVariantLoad: function () {
            this._updateLabelsAndTable();
        },

        getFormattedSummaryText: function () {
            var aFiltersWithValues = this.oFilterBar.retrieveFiltersWithValues();

            if (aFiltersWithValues.length === 0) {
                return "No filters active";
            }

            if (aFiltersWithValues.length === 1) {
                return aFiltersWithValues.length + " filter active: " + aFiltersWithValues.join(", ");
            }

            return aFiltersWithValues.length + " filters active: " + aFiltersWithValues.join(", ");
        },

        getFormattedSummaryTextExpanded: function () {
            var aFiltersWithValues = this.oFilterBar.retrieveFiltersWithValues();

            if (aFiltersWithValues.length === 0) {
                return "No filters active";
            }

            var sText = aFiltersWithValues.length + " filters active",
                aNonVisibleFiltersWithValues = this.oFilterBar.retrieveNonVisibleFiltersWithValues();

            if (aFiltersWithValues.length === 1) {
                sText = aFiltersWithValues.length + " filter active";
            }

            if (aNonVisibleFiltersWithValues && aNonVisibleFiltersWithValues.length > 0) {
                sText += " (" + aNonVisibleFiltersWithValues.length + " hidden)";
            }

            return sText;
        },

        _updateLabelsAndTable: function () {
            this.oExpandedLabel.setText(this.getFormattedSummaryTextExpanded());
            this.oSnappedLabel.setText(this.getFormattedSummaryText());
            this.oTable.setShowOverlay(true);
        },
        SelezioneFornitore: function (oEvent) {
            var iSelectedIndex = oEvent.getParameter("rowIndex");
            var oTable = this.byId("tableFornitori");
            var oSelectedContext = oTable.getContextByIndex(iSelectedIndex);
            var oSelectedObject = oSelectedContext.getObject()
            var CodiceFornitore = oSelectedObject.Lifnr
            this.getView().getModel("FilterModelFirstPage").setProperty("/CodiceFor", CodiceFornitore)
        },

        SelezioneCommessa: function (oEvent) {

            var iSelectedIndex = oEvent.getParameter("rowIndex");
            var oTable = this.byId("CommessaTable");
            var oSelectedContext = oTable.getContextByIndex(iSelectedIndex);
            var oSelectedObject = oSelectedContext.getObject()
            var Commessa = oSelectedObject.Zposid
            this.getView().getModel("FilterModelFirstPage").setProperty("/Commessa", Commessa)
        },
        onSocietaSelectChange: function (evento) {
            var oSelect = this.byId("societaSelect");
            var oSelectedItem = oSelect.getSelectedItem();
            var sKey = oSelectedItem.getKey();
            var sText = oSelectedItem.getText();
            this.getView().getModel("CreazioneBemModel").setProperty("/key", sKey)
            this.getView().getModel("CreazioneBemModel").setProperty("/text", sText)
        },
        ChangeMercatoCombobox: function (oEvent) {
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
                    var oInput = this.getView().byId("Commessa");
                    oInput.setValue(sValue);

                    // Chiudi il dialogo
                    this.byId("IdCommessaHelpRequest").close();
                }
            }
        },

        SedeTecnicaSelected: function (oEvent) {

            var oSelectedItem = oEvent.getParameter("listItem");


            if (oSelectedItem) {
                var oBindingContext = oSelectedItem.getBindingContext("MatchCode");


                var sWbsValue = oBindingContext.getProperty("Ort01");


                var oInput = this.getView().byId("SedeTecnica");
                oInput.setValue(sWbsValue);


                this.byId('IdHelpRequestSedeTecnica').close();
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
                    var oInput = this.getView().byId("codicefornitoreinput");
                    oInput.setValue(lastFiveChars);

                    // Chiudi il dialogo
                    this.byId("FragmentCodiceFornitore").close();
                }
            }
        }




    });
});
