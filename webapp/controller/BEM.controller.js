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

    return Controller.extend("sap.m.bem.controller.BEM", {
        onInit: function() {
            this.oModel = new sap.ui.model.json.JSONModel();
        
            var aProductCollection = [
                {	
                    Numero: "Prodotto A",
                    DataCreazioneBEM: new Date(),
                    DataRegistrazione: new Date(),
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
                    DataAnnullamento: new Date(),
                    UtenteAnnullamento: "Utente Annullamento A"
                },
                {	
                    Numero: "Prodotto B",
                    DataCreazioneBEM: new Date(),
                    DataRegistrazione: new Date(),
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
                    DataAnnullamento: new Date(),
                    UtenteAnnullamento: "Utente Annullamento B"
                },
                {	
                    Numero: "Prodotto C",
                    DataCreazioneBEM: new Date(),
                    DataRegistrazione: new Date(),
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
                    DataAnnullamento: new Date(),
                    UtenteAnnullamento: "Utente Annullamento C"
                },
                {	
                    Numero: "Prodotto D",
                    DataCreazioneBEM: new Date(),
                    DataRegistrazione: new Date(),
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
                    DataAnnullamento: new Date(),
                    UtenteAnnullamento: "Utente Annullamento D"
                },
                {	
                    Numero: "Prodotto E",
                    DataCreazioneBEM: new Date(),
                    DataRegistrazione: new Date(),
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
                    DataAnnullamento: new Date(),
                    UtenteAnnullamento: "Utente Annullamento E"
                }
            ];

            var aConsultCollection = [
                {
                    DocAcq: "Prodotto A",
                    Pos: "1",
                    SubappaltoOK: "true",
                    Materiale: "Materiale A",
                    TestoBreve: "Descrizione Breve A",
                    Quantita: 10,
                    QuantitaResidua: 5,
                    Valore: 1000,
                    ValoreResiduo: 500,
                    ImpDivInt: 100,
                    UMO: "PZ",
                    PrzNetto: 50,
                    DettaglioTicket: "true",
                    DataInizioAttivita: new Date(),
                    DataFineAttivita: new Date(),
                    SedeTecnica: "Sede Tecnica A",
                    DescSedeTecnica: "Descrizione Sede Tecnica A"
                },
                {
                    DocAcq: "Prodotto B",
                    Pos: "2",
                    SubappaltoOK: "false",
                    Materiale: "Materiale B",
                    TestoBreve: "Descrizione Breve B",
                    Quantita: 20,
                    QuantitaResidua: 10,
                    Valore: 2000,
                    ValoreResiduo: 1000,
                    ImpDivInt: 200,
                    UMO: "KG",
                    PrzNetto: 100,
                    DettaglioTicket: "false",
                    DataInizioAttivita: new Date(),
                    DataFineAttivita: new Date(),
                    SedeTecnica: "Sede Tecnica B",
                    DescSedeTecnica: "Descrizione Sede Tecnica B"
                },
                {
                    DocAcq: "Prodotto C",
                    Pos: "3",
                    SubappaltoOK: "true",
                    Materiale: "Materiale C",
                    TestoBreve: "Descrizione Breve C",
                    Quantita: 15,
                    QuantitaResidua: 7,
                    Valore: 1500,
                    ValoreResiduo: 700,
                    ImpDivInt: 150,
                    UMO: "L",
                    PrzNetto: 75,
                    DettaglioTicket: "true",
                    DataInizioAttivita: new Date(),
                    DataFineAttivita: new Date(),
                    SedeTecnica: "Sede Tecnica C",
                    DescSedeTecnica: "Descrizione Sede Tecnica C"
                },
                {
                    DocAcq: "Prodotto D",
                    Pos: "4",
                    SubappaltoOK: "false",
                    Materiale: "Materiale D",
                    TestoBreve: "Descrizione Breve D",
                    Quantita: 30,
                    QuantitaResidua: 15,
                    Valore: 3000,
                    ValoreResiduo: 1500,
                    ImpDivInt: 300,
                    UMO: "M",
                    PrzNetto: 150,
                    DettaglioTicket: "false",
                    DataInizioAttivita: new Date(),
                    DataFineAttivita: new Date(),
                    SedeTecnica: "Sede Tecnica D",
                    DescSedeTecnica: "Descrizione Sede Tecnica D"
                },
                {
                    DocAcq: "Prodotto E",
                    Pos: "5",
                    SubappaltoOK: "true",
                    Materiale: "Materiale E",
                    TestoBreve: "Descrizione Breve E",
                    Quantita: 25,
                    QuantitaResidua: 12,
                    Valore: 2500,
                    ValoreResiduo: 1200,
                    ImpDivInt: 250,
                    UMO: "BOX",
                    PrzNetto: 125,
                    DettaglioTicket: "true",
                    DataInizioAttivita: new Date(),
                    DataFineAttivita: new Date(),
                    SedeTecnica: "Sede Tecnica E",
                    DescSedeTecnica: "Descrizione Sede Tecnica E"
                }
            ];
            
        
            this.oModel.setData({ ProductCollection: aProductCollection, ConsultCollection: aConsultCollection});
            this.getView().setModel(this.oModel);
        
            this.applyData = this.applyData.bind(this);
            this.fetchData = this.fetchData.bind(this);
            this.getFiltersWithValues = this.getFiltersWithValues.bind(this);
        
            this.oSmartVariantManagement = this.getView().byId("svm");
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
            this.oSmartVariantManagement.addPersonalizableControl(oPersInfo);
            this.oSmartVariantManagement.initialise(function () {}, this.oFilterBar);
        },

        onExportPress: function() {
            var aData = this.getView().getModel().getProperty("/ProductCollection");
            var aCols = [
                { label: 'Numero', property: 'Numero' },
                { label: 'Data Creazione BEM', property: 'DataCreazioneBEM' },
                { label: 'Data Registrazione', property: 'DataRegistrazione' },
                { label: 'Stato', property: 'Stato' },
                { label: 'Autore', property: 'Autore' },
                { label: 'Wbs/Cdc', property: 'WbsCdc' },
                { label: 'Descriz. Wbs/Cdc', property: 'DescWbsCdc' },
                { label: 'ID Fornitore', property: 'IdFornitore' },
                { label: 'Fornitore', property: 'Fornitore' },
                { label: 'Importo Totale', property: 'ImpTot' },
                { label: 'Importo Benestatario BEM', property: 'ImpBEM' },
                { label: 'N. OdA', property: 'Noda' },
                { label: 'Tipo OdA', property: 'TipoOdA' },
                { label: 'Codice CUP', property: 'CodiceCUP' },
                { label: 'Codice CIG', property: 'CodiceCIG' },
                { label: 'Descrizione CIG', property: 'DescCIG' },
                { label: 'BEM Benestariata', property: 'Benestariata' },
                { label: 'Data Annullamento', property: 'DataAnnullamento' },
                { label: 'Utente Annullamento', property: 'UtenteAnnullamento' }
            ];

            var aExcelData = aData.map(function(oItem) {
                var oExcelItem = {};
                aCols.forEach(function(oCol) {
                    if (oCol.property === 'DataCreazioneBEM' || oCol.property === 'DataRegistrazione' || oCol.property === 'DataAnnullamento') {
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

        onExit: function() {
            this.oModel = null;
            this.oSmartVariantManagement = null;
            this.oExpandedLabel = null;
            this.oSnappedLabel = null;
            this.oFilterBar = null;
            this.oTable = null;
        },

        fetchData: function () {
            var aData = this.oFilterBar.getAllFilterItems().reduce(function (aResult, oFilterItem) {
                aResult.push({
                    groupName: oFilterItem.getGroupName(),
                    fieldName: oFilterItem.getName(),
                    fieldData: oFilterItem.getControl().getSelectedKeys()
                });

                return aResult;
            }, []);

            return aData;
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
            this.oSmartVariantManagement.currentVariantSetModified(true);
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

        getFormattedSummaryText: function() {
            var aFiltersWithValues = this.oFilterBar.retrieveFiltersWithValues();

            if (aFiltersWithValues.length === 0) {
                return "No filters active";
            }

            if (aFiltersWithValues.length === 1) {
                return aFiltersWithValues.length + " filter active: " + aFiltersWithValues.join(", ");
            }

            return aFiltersWithValues.length + " filters active: " + aFiltersWithValues.join(", ");
        },

        getFormattedSummaryTextExpanded: function() {
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
        }
    });
});
