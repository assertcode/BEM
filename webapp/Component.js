
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "sap/m/bem/model/models",
    "sap/ui/model/json/JSONModel"
],
    function (UIComponent, Device, models, JSONModel) {
        "use strict";

        return UIComponent.extend("sap.m.bem.Component", {
            metadata: {
                manifest: "json"
            },


            init: function () {
                UIComponent.prototype.init.apply(this, arguments);

                this.getRouter().initialize();

                this.setModel(models.createDeviceModel(), "device");

                this.setModel(new JSONModel({ Dati: [] }), "DatiTabellaPrimaPagina");

                this.setModel(new JSONModel({ reject: "",  }), "Message");

                this.setModel(new JSONModel({ NumeroProtocollo: "" }), "NumeroProtDetail");

                this.setModel(new JSONModel({ nprot: "" }), "RowSelect");

                this.setModel(new JSONModel({  "status1":"", "value1":"", "status2":"", "value2":"" }), "SaveModel");

                this.setModel(new JSONModel({   "Visibility" : false, "Message" : "ERROR" }), "DetailErrorModel");

                this.setModel(new JSONModel({ Modifica: true, Salva:false, Rilascia:false }), "VisibleButton");
                
                this.setModel(new JSONModel({ Modifica: true, Salva:false,Rilascia:false }), "EnabledButton");

                this.setModel(new JSONModel({ Societa: "", Tipo: "" , Nprot: "" , Addposition: false}), "CreazioneModel");

                this.setModel(new JSONModel({ Fornitori: [], Stato: [], Commessa: [], SedeTecnica: [], Cig: [] }), "MatchCode");

                this.setModel(new JSONModel({ Fornitore: [],  descrizione: [], esercizio: [], stanziamenti: []}), "MatchCodeDocStz");

                this.setModel(models.createAreaFModel(), "AreaFModel");

                this.setModel(models.createAreaModel(), "AreaModel");

                this.setModel(new JSONModel({societa:[
                    // { value: '', description: '' },
                    // { value: 'CGEF', description: 'CO.GE.F. soc.cons.r.l.' },
                    // { value: 'SETO', description: 'CONSORZIO SERVIZI TOSCANA' },
                    // { value: 'CIO', description: 'Cons. Ig. Osp. scrl' },
                    // { value: 'CSTA', description: 'Consorzio Stabile CMF' },
                    // { value: 'ENVO', description: 'ENERGYPROJECT S.R.L.' },
                    // { value: 'FERR', description: 'Ferraria Soc. Cons. a r.l' },
                    // { value: 'GETA', description: 'GESTIONE SERVIZI TARANTO' },
                    // { value: 'ISOM', description: 'ISOM GESTIONE SOC.CONS.RL' },
                    // { value: 'INLO', description: 'Infrastrutture Lombardia' },
                    // { value: 'ISOL', description: 'Isom Lavori soc.cons.r.l.' },
                    // { value: 'KANA', description: 'Kanarind soc.cons.r.l.' },
                    // { value: 'MNTC', description: 'MSC S.P.A.' },
                    // { value: 'SINT', description: 'PROGETTO SINTESI SOC. CON' },
                    // { value: 'RAIL', description: 'REKEEP RAIL S.R.L.' },
                    // { value: 'ROMA', description: 'ROMA MULTISERVIZI S.P.A.' },
                    // { value: 'EDIS', description: 'Rekeep Digital s.r.l.' },
                    // { value: 'FACI', description: 'Rekeep SpA' },
                    // { value: 'SANG', description: 'S.AN.GE. S.c. a r.l.' },
                    // { value: 'FLET', description: 'SERVIZI OSPEDALIERI SPA' },
                    // { value: 'SYMA', description: 'SYNCHRON MANUTENZIONE' },
                    // { value: 'GS4', description: 'TREVISO GS4 Soc.cons.a rl' },
                    // { value: 'YUGE', description: 'YOUGENIO SRL IN LIQUIDAZ.' }
                ],
                TipoProtocollo:[
                    { value: '', description: ''},
                    { value: '04', description: 'SI-CONSUNTIVAZIONE COSTI-FORNITURA'},
                    { value: '05', description: 'SI-CONSUNTIVAZIONE COSTI-SERVIZI LAVORI' },
                    { value: '19', description: 'SI-CONSUNTIVAZIONE COSTI- ABANCO' },
                    { value: '54', description: 'IG-CONSUNTIVAZIONE COSTI-FORNITURA' },
                    { value: '55', description: 'IG-CONSUNTIVAZIONE COSTI-SERVIZI' },
                    { value: '74', description: 'SO-CONSUNTIVAZIONE COSTI-FORNITURA' },
                    { value: '75', description: 'SO-CONSUNTIVAZIONE COSTI-SERVIZI' }
                ],
                stato:[
                    {value: '', description: ''},
                    {value: 'B01',description: 'CONSUNTIVAZIONE COSTI APERTA'},
                    {value: 'B02',description: 'CONSUNTIVAZIONE COSTI SALVATA' },
                    {value: 'B03',description: 'CONSUNTIVAZIONE COSTI RILASCIATA' },
                    {value: 'B04',description: 'CONSUNTIVAZIONE COSTI ANNULLATA' }
                ],
                area:[
                    // {description: ''},
                    // {description: 'Adriatica(NON ATTIVA)'},
                    // {description: 'Area telecom' },
                    // {description: 'Costi Generali' },
                    // {description: 'Cross area' },
                    // {description: 'Centro' },
                    // {description: 'Clienti a rete' },
                    // {description: 'Documentale' },
                    // {description: 'EN_volta' },
                    // {description: 'Emilia' },
                    // {description: 'FACI- Digitalizzazione Postalizzazione' },
                    // {description: 'FIAT' },
                    // {description: 'GDO – MASS MARKET RETAIL LOGISTICS PROJE ' },
                    // {description: 'IGIENE' },
                    // {description: 'LAZIO, CAMPANIA, BASILICATA' },
                    // {description: 'NORD OVEST' },
                    // {description: 'Puglia, Abruzzo, Molise' },
                    // {description: 'SMAIL' },
                    // {description: 'Sicilia e Calabria' },
                    // {description: 'Sistemi informativi' },
                    // {description: 'TELEPOST' },
                    // {description: 'Triveneto' },
                ]
            }), "societaModel2");

                this.setModel(new JSONModel({
                    IAufnr: "",
                    IBatch: "",
                    ICommessa: "",
                    IEbeln: "",
                    IGetTicketDetails: "",
                    IKostl: "",
                    ILifnr: "",
                    IModel: "",
                    ISedeTecnica: "",
                    ISocieta: "",
                    ITicket: "",
                    ITipoprotocollo: "",
                    to_OdaForBemEDettaglio: []
                }), "OdaForBem");

                this.setModel(new JSONModel({
                    As: false,
                    A: false,
                    B: false,
                    C: false,
                    D: false,
                    E: false,
                    F: false,
                    G: false,
                    H: false,
                    I: false
                }), "Cont");

                this.setModel(new JSONModel({}), "DatiBemDetail");

                this.setModel(new JSONModel({key:"",text:""}), "CreazioneBemModel");
                this.setModel(new JSONModel(), "BemChange");

                this.setModel(new JSONModel({ enabled: false }), "modify");

                this.setModel(new JSONModel({ nprot: "" }), "NprotGlobal");
                var DataA = new Date();
                var DataDA = new Date();
                DataDA.setDate(DataA.getDate() - 7);
                this.setModel(new JSONModel({
                    INumeroprotocollo: "",
                    DataDABEM: DataDA,
                    A: DataA,
                    Commessa: "",
                    CUP: "",
                    SedeTecnica: "",
                    AutoreBEM: "",
                    CodiceFor: "",
                    NumeroCIG: "",
                    DataBEM: "",
                    Societa: "",
                    Area: "",
                    NumeroODA: "",
                    StatoBEM: "",
                    EstrazioneParziale: true,
                    BEMBenestataria: "",
                    NumeroBenessere: "",
                }), "FilterModelFirstPage");

                this.setModel(new JSONModel({
                    societa:"",
                    fornitore:"",
                    nome:"",
                    localita:"",
                    cap:""
                }), "FornitoriFilterModel");

                this.setModel(new JSONModel({
                    Posid:"",
                }), "CigFilterModel");

                this.setModel(new JSONModel({
                    SedeTecnica:"",
                    Descrizione:"",
                    Societa:"",
                    WBS:"",
                }), "SedeTecnicaFilterModel");


                this.setModel(new JSONModel({
                    wbs:"",
                    definizione:"",
                    commessa:"",
                    responsabile:"",
                    mercato:""
                }), "CommessaFilterModel");

                this.setModel(new JSONModel({
                    "ebeln":[]
                }), "aZebelnValues");

                this.setModel(models.createAllegatiModel(), "AllegatiModel");

                this.setModel(models.FileUpload(), "FileUploadModel");

                this.setModel(models.createAllegatiConfig(), "AllegatiConfig");    
                this.setModel(models.createDocStz(), "DocStzModel"); 

                this.setModel(new JSONModel({
                    wbs:"",
                    esercizio:"",
                    fornitore:""
                  
                }), "DocStzFilterModel");
                
                
            }
        });

    }

);