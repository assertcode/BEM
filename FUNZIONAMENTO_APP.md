# Documentazione Funzionamento App BEM - Consuntivazione Costi

## 📋 Indice
1. [Panoramica Generale](#panoramica-generale)
2. [Architettura Applicativa](#architettura-applicativa)
3. [Struttura del Progetto](#struttura-del-progetto)
4. [Modelli Dati](#modelli-dati)
5. [Flusso dell'Applicazione](#flusso-dellapplicazione)
6. [Viste Principali](#viste-principali)
7. [Controller e Logica](#controller-e-logica)
8. [Integrazione OData](#integrazione-odata)
9. [Come Avviare l'App](#come-avviare-lapp)

---

## 🎯 Panoramica Generale

**Nome Applicazione:** BEM - Consuntivazione Costi

**Versione:** 0.0.1

**Tecnologia:** SAP UI5 (SAPUI5) v1.124.0

**Scopo:** L'applicazione gestisce la consuntivazione e la consultazione dei costi, fornendo un'interfaccia per:
- Ricerca e visualizzazione di dati BEM (Bilancio di Esercizio e Movimentazione)
- Filtraggio avanzato dei dati
- Modifica e gestione di informazioni di protocollo
- Visualizzazione dello storico dei movimenti
- Gestione di allegati e documenti

**Namespace:** `sap.m.bem`

---

## 🏗️ Architettura Applicativa

### Architettura MVC (Model-View-Controller)

L'applicazione segue il pattern MVC di SAPUI5:

```
┌─────────────────────────────────────────────────────────────┐
│                    COMPONENT (Component.js)                  │
│              (Inizializzazione e gestione)                   │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
    ┌───▼────┐   ┌────▼────┐   ┌───▼────┐
    │ MODELS │   │ VIEWS   │   │ROUTING │
    │(JSONs) │   │(XMLs)   │   │(Routes)│
    └────────┘   └────┬────┘   └────────┘
                      │
                  ┌───▼────────┐
                  │ CONTROLLERS│
                  └────────────┘
```

### Backend Integration

L'app si connette a un servizio OData backend:
- **Service:** `ZGTW_BEM_SRV` (SAP BEM Service)
- **Endpoint:** `/sap/opu/odata/sap/ZGTW_BEM_SRV/`
- **Versione OData:** 2.0
- **Metadata Local:** `localService/ZGTW_BEM_SRV/metadata.xml`

---

## 📁 Struttura del Progetto

```
BEM/
├── webapp/                          # Cartella principale dell'applicazione
│   ├── Component.js                 # Componente principale UI5
│   ├── index.html                   # Entry point
│   ├── manifest.json                # Configurazione applicativa
│   ├── controller/
│   │   ├── App.controller.js         # Controller per la shell
│   │   ├── BEM.controller.js         # Controller principale con ricerca/filtri
│   │   ├── AvanzamentoBem.controller.js  # Controller per lo stato di avanzamento
│   │   └── BEMDetail.controller.js   # Controller per i dettagli
│   ├── view/
│   │   ├── App.view.xml              # Vista shell
│   │   ├── BEM.view.xml              # Vista principale con ricerca e table
│   │   ├── AvanzamentoBem.view.xml   # Vista stato avanzamento
│   │   ├── BEMDetail.view.xml        # Vista dettagli
│   │   └── fragment/                 # Frammenti riutilizzabili
│   │       ├── Allegati.fragment.xml
│   │       ├── AutorebemHelpRequest.fragment.xml
│   │       ├── CreazioneBEM.fragment.xml
│   │       ├── DocStz.fragment.xml
│   │       ├── FileUpload.fragment.xml
│   │       ├── RejectDialog.fragment.xml
│   │       └── Storico.fragment.xml
│   ├── model/
│   │   ├── models.js                 # Creazione e configurazione modelli
│   │   ├── formatter.js              # Formattazione dati
│   │   └── type/
│   │       └── formatDecimal.js      # Tipo custom per decimali
│   ├── css/
│   │   └── style.css                 # Stili personalizzati
│   ├── i18n/
│   │   └── i18n.properties           # Etichette multilingua
│   ├── localService/
│   │   └── ZGTW_BEM_SRV/
│   │       └── metadata.xml          # Metadati OData per lo sviluppo
│   └── test/                         # Cartella test
│       ├── unit/                     # Test unitari
│       ├── integration/              # Test di integrazione OPA
│       └── flpSandbox.html           # Sandbox Fiori Launchpad
├── mta.yaml                          # Configurazione MTA (Multi-Target Application)
├── package.json                      # Dipendenze npm
├── ui5.yaml                          # Configurazione build UI5
└── manifest.json                     # Manifest applicativo
```

---

## 📊 Modelli Dati

L'applicazione utilizza diversi modelli JSONModel per la gestione dello stato:

### Modelli Principali (inizializzati in Component.js)

| Nome Modello | Scopo | Struttura |
|---|---|---|
| **DatiTabellaPrimaPagina** | Dati visualizzati nella tabella principale | `{ Dati: [] }` |
| **Message** | Messaggi di errore/validazione | `{ reject: "" }` |
| **NumeroProtDetail** | Numero protocolo del dettaglio | `{ NumeroProtocollo: "" }` |
| **RowSelect** | Riga selezionata dalla tabella | `{ nprot: "" }` |
| **SaveModel** | Stato dei salvataggi | `{ status1:"", value1:"", status2:"", value2:"", status3:"", value3:"" }` |
| **DetailErrorModel** | Gestione errori dettaglio | `{ Visibility: false, Message: "ERROR" }` |
| **VisibleButton** | Visibilità bottoni (Modifica, Salva, Rilascia) | `{ Modifica: true, Salva:false, Rilascia:false }` |
| **EnabledButton** | Abilitazione bottoni | `{ Modifica: true, Salva:false, Rilascia:false }` |
| **CreazioneModel** | Dati per creazione nuovi BEM | `{ Societa:"", Tipo:"", Nprot:"", Addposition: false }` |
| **device** | Informazioni dispositivo (responsive design) | Modello device SAPUI5 |

### Modello OData

- **Service:** Connessione al service backend ZGTW_BEM_SRV (OData v2.0)
- **Entità principali:** Define nel metadata.xml

---

## 🔄 Flusso dell'Applicazione

### Avvio Applicazione

```
1. index.html caricato
   ↓
2. Component.js inizializzato (onInit)
   ↓
3. Modelli JSON creati e impostati
   ↓
4. Router inizializzato
   ↓
5. Vista App.view.xml renderizzata
   ↓
6. Route di default: vista BEM.view.xml
```

### Flusso di Ricerca e Filtro (BEM.view.xml)

```
1. Utente compila filtri nella FilterBar
   ↓
2. Clic su "Ricerca" o apply automatico
   ↓
3. BEM.controller.js → applyData()
   ↓
4. Filtri processati → getFiltersWithValues()
   ↓
5. Chiamata OData al backend
   ↓
6. Risultati caricati in "DatiTabellaPrimaPagina"
   ↓
7. Tabella aggiornata con i dati
```

### Flusso Dettagli Record

```
1. Utente seleziona riga nella tabella
   ↓
2. handleRouteMatched() attivato
   ↓
3. Navigazione a BEMDetail.view.xml
   ↓
4. Numero protocolo caricato in "NumeroProtDetail"
   ↓
5. Dettagli visualizzati con opzioni:
   - Visualizza storico
   - Carica allegati
   - Modifica dati
   - Salva/Rilascia
```

---

## 🖼️ Viste Principali

### 1. App.view.xml
- **Tipo:** Shell/Container
- **Funzione:** Contenitore principale dell'applicazione
- **Componenti:** NavContainer per la navigazione tra viste

### 2. BEM.view.xml
- **Tipo:** Vista di ricerca e listato
- **Componenti:**
  - FilterBar per i filtri avanzati
  - Table (ProductTable) per visualizzare i risultati
  - Bottoni azioni: Modifica, Salva, Rilascia
  - Label per stati di espansione
- **Dati Visualizzati:** Modello `DatiTabellaPrimaPagina`

### 3. BEMDetail.view.xml
- **Tipo:** Vista di dettaglio
- **Funzioni:**
  - Visualizzazione dettagli singolo record
  - Form modifica
  - Allegati (tramite fragment Allegati.fragment.xml)
  - Storico movimenti (tramite fragment Storico.fragment.xml)
  - Sezione documenti (tramite fragment DocStz.fragment.xml)

### 4. AvanzamentoBem.view.xml
- **Tipo:** Vista di stato avanzamento
- **Funzione:** Mostra lo stato di elaborazione/avanzamento BEM

---

## 🎮 Controller e Logica

### BEM.controller.js (Principale)

**Funzionalità:**
- Gestione ricerca e filtri
- Registrazione callback FilterBar:
  - `fetchData()`: Recupera dati da usare nei filtri
  - `applyData()`: Applica i filtri e esegue ricerca
  - `getFiltersWithValues()`: Restituisce filtri con valori
- Routing verso dettagli record
- Import libreria Excel (XLSX) per export dati

**Principali funzioni:**
```javascript
onInit()                     // Inizializzazione controller
handleRouteMatched()         // Handler navigazione tra route
applyData()                  // Applicazione filtri
fetchData()                  // Recupero dati per filtri
getFiltersWithValues()       // Lettura valori filtri
// ... altre funzioni per gestione tabella e dialog
```

### BEMDetail.controller.js

**Funzionalità:**
- Visualizzazione dettagli BEM
- Modifica campi
- Gestione allegati
- Visualizzazione storico
- Salvataggio modifiche

### AvanzamentoBem.controller.js

**Funzionalità:**
- Monitoraggio stato avanzamento
- Aggiornamento stato processuali

### App.controller.js

**Funzionalità:**
- Minimale, gestisce shell principale

---

## 🔌 Integrazione OData

### Endpoint Backend

```
Service: ZGTW_BEM_SRV
Base URL: /sap/opu/odata/sap/ZGTW_BEM_SRV/
OData Version: V2
Metadata: /sap/opu/odata/sap/ZGTW_BEM_SRV/$metadata
```

### Operazioni Principali

| Operazione | Descrizione |
|---|---|
| **GET** | Ricerca e lettura BEM |
| **POST** | Creazione nuovo BEM |
| **PATCH/PUT** | Modifica BEM esistente |
| **DELETE** | Eliminazione BEM |

### Filtri Disponibili

I filtri sono definiti nella FilterBar in BEM.view.xml e possono includere:
- Numero Protocolo
- Società
- Tipo Documento
- Data Creazione
- Stato (Bozza, In Elaborazione, Completato, Rifiutato)
- Causale Operazione

---

## 🚀 Come Avviare l'App

### Prerequisiti

- **Node.js:** Versione LTS (v18 o superiore)
- **npm:** v9 o superiore
- **SAP Fiori Tools:** Installati via npm

### Comandi di Avvio

#### 1. Sviluppo con Fiori Launchpad
```bash
npm start
```
Apre l'app in modalità sandbox Fiori Launchpad
URL: `http://localhost:port/test/flpSandbox.html?sap-ui-xx-viewCache=false#sapmbem-display`

#### 2. Sviluppo Locale (senza Fiori Launchpad)
```bash
npm run start-local
```
Avvia con configurazione locale (ui5-local.yaml)

#### 3. Sviluppo Diretto (senza Fiori)
```bash
npm run start-noflp
```
Apre l'app direttamente su `index.html`

#### 4. Esecuzione Test Unitari
```bash
npm run unit-tests
```

#### 5. Esecuzione Test di Integrazione
```bash
npm run int-tests
```

### Build per Produzione

#### Build Standard
```bash
npm run build
```
Genera artefatti in cartella `/dist`

#### Build Cloud Foundry
```bash
npm run build:cf
```
Build ottimizzato per SAP Cloud Foundry

### Deploy

```bash
npm run deploy
```
Deploy su SAP Cloud Foundry

---

## 🔐 Configurazione Sicurezza

File di configurazione di sicurezza:

- **xs-security.json**: Definisce gli scope e i ruoli di sicurezza
- **xs-app.json**: Configurazione di routing e autenticazione

---

## 📝 Internazionalizzazione

L'app supporta multi-lingua tramite file proprietà:
- **File:** `webapp/i18n/i18n.properties`
- **Gestione:** Modello i18n di SAPUI5
- **Accesso:** `this.getResourceBundle().getText("key")`

---

## 🧪 Testing

L'applicazione include:

### Test Unitari
- **Cartella:** `webapp/test/unit/`
- **Framework:** QUnit
- **File:** `unitTests.qunit.html`

### Test di Integrazione
- **Cartella:** `webapp/test/integration/`
- **Framework:** OPA (One Page Acceptance)
- **Test:** NavigationJourney.js, ecc.

---

## 📌 Note Importanti

1. **Cache Disabilitata:** Nei comandi di avvio è impostato `sap-ui-xx-viewCache=false` per lo sviluppo (evita cache durante sviluppo)

2. **MTA Deployment:** L'app è configurata per il deployment Cloud Foundry tramite file `mta.yaml`

3. **Local Service Mock:** Durante lo sviluppo, se il backend non è disponibile, è possibile usare i metadati mock in `localService/ZGTW_BEM_SRV/metadata.xml`

4. **Responsive Design:** La app è responsive e si adatta a dispositivi diversi tramite il modello "device"

5. **Temi:** Di default usa il tema `sap_horizon`

---

## 🔗 File di Configurazione Chiave

| File | Scopo |
|---|---|
| **manifest.json** | Configurazione e definizione app UI5 |
| **package.json** | Dipendenze npm e script |
| **ui5.yaml** | Configurazione build/run UI5 |
| **mta.yaml** | Configurazione Multi-Target Application |
| **xs-app.json** | Routing e configurazione autenticazione |
| **xs-security.json** | Scopo di sicurezza |

---

## 💡 Suggerimenti di Sviluppo

1. **Debugging:** Usare Developer Tools del browser (F12)
2. **Logging:** Usare `jQuery.sap.log` o console per debug
3. **Breakpoint:** Disponibili in VS Code con debugger integrato
4. **Performance:** Usare SAPUI5 Support Assistant per controlli
5. **Style:** Modificare `style.css` per personalizzazioni CSS

---

**Documento creato:** Marzo 2026  
**Versione Applicazione:** 0.0.1  
**UI5 Version:** 1.124.0
