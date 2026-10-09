# BEM — Consuntivazione Costi

> Leggi prima [../AGENTS.md](../AGENTS.md) per le regole comuni e la **regola di chiusura** (report di lavorazione a fine ticket).

| | |
|---|---|
| **Scopo** | Consuntivazione e consultazione dei costi di commessa (protocolli BEM) |
| **Namespace** | `sap.m.bem` → path moduli `sap/m/bem` |
| **Servizio BTP** | `sapmbem` |
| **Servizio OData** | `ZGTW_BEM_SRV` |
| **Intent FLP** | `RicercaBEM-display` — tile "Consuntivazione Costi", icona `sap-icon://money-bills` |
| **minUI5** | 1.124.0 |
| **Deploy** | `./deploy.sh quality` / `./deploy.sh prod` — oppure `npm run deploy:qua` / `npm run deploy:prd` |

Esiste già una documentazione funzionale estesa: [FUNZIONAMENTO_APP.md](FUNZIONAMENTO_APP.md).

---

## 1. Struttura

| Rotta | Pattern | View | Controller | Righe |
|---|---|---|---|---|
| `RouteBEM` | `:?query:` | [webapp/view/BEM.view.xml](webapp/view/BEM.view.xml) | [BEM.controller.js](webapp/controller/BEM.controller.js) | 1.089 |
| `BEMDetail` | `BEMDetail` | [webapp/view/BEMDetail.view.xml](webapp/view/BEMDetail.view.xml) | [BEMDetail.controller.js](webapp/controller/BEMDetail.controller.js) | 486 |
| `AvanzamentoBem` | `AvanzamentoBem/:bem:` | [webapp/view/AvanzamentoBem.view.xml](webapp/view/AvanzamentoBem.view.xml) | [AvanzamentoBem.controller.js](webapp/controller/AvanzamentoBem.controller.js) | **2.853** |

```
Ricerca BEM ──(Dettaglio)──► Avanzamento BEM ──(onNavigateBEF)──► app rekeep-bef
     │
     └──(onOdaControl)──────► BEM Detail (ricerca ODA/costi per commessa)
```

`AvanzamentoBem` è il cuore dell'app: lavorazione del protocollo, scritture integrative, allegati, storico, stampa.

---

## 2. Stati del protocollo

| Codice | Descrizione |
|---|---|
| `B01` | Consuntivazione costi **aperta** |
| `B02` | Consuntivazione costi **salvata** |
| `B03` | Consuntivazione costi **rilasciata** |
| `B04` | Consuntivazione costi **annullata** |

Definiti in [webapp/Component.js](webapp/Component.js), modello `societaModel2`, proprietà `/stato`.
Lo stato pilota `VisibleButton` / `EnabledButton` (`Modifica`, `Salva`, `Rilascia`).

## 3. Tipi di protocollo

Modello `societaModel2`, proprietà `/TipoProtocollo`:

| Codice | Descrizione |
|---|---|
| `04` | SI-CONSUNTIVAZIONE COSTI-FORNITURA |
| `05` | SI-CONSUNTIVAZIONE COSTI-SERVIZI LAVORI |
| `19` | SI-CONSUNTIVAZIONE COSTI-ABANCO |
| `54` | IG-CONSUNTIVAZIONE COSTI-FORNITURA |
| `55` | IG-CONSUNTIVAZIONE COSTI-SERVIZI |
| `74` | SO-CONSUNTIVAZIONE COSTI-FORNITURA |
| `75` | SO-CONSUNTIVAZIONE COSTI-SERVIZI |

> Società e aree sono **commentate** in `Component.js` e caricate a runtime da `/ESocSet` e `/AREA_MC_GETSet`. Le liste commentate restano come documentazione dei valori attesi: non riattivarle.

---

## 4. Entity set principali

| Entity set | Uso |
|---|---|
| `/GETLISTSet` | lista protocolli — con `$expand=LISTDOCSet` |
| `/GetDetailSet` | dettaglio protocollo |
| `/BEM_PRESAVESet` | salvataggio (pre-save) |
| `/BEM_CHANGESet` | modifica |
| `/OTESTATASet`, `/IDettaglioSet` | testata e posizioni |
| `/StoricoSet` | storico transizioni |
| `/AutorizzatoriSet` | catena approvativa |
| `/StampaSet`, `/OutputSet` | generazione PDF |
| `/ListaCampiSet`, `/ListaFunzioniSet` | autorizzazioni campi e funzioni |
| `/SedeTecnicaSet`, `/AREA_MC_GETSet`, `/ESocSet`, `/TpprotSet`, `/AreaTSet` | value help |
| `/SYNAMESet` | utente SAP → nome |

Metadata: [webapp/localService/ZGTW_BEM_SRV/metadata.xml](webapp/localService/ZGTW_BEM_SRV/metadata.xml)

---

## 5. Filtri della pagina di ricerca

Modello `FilterModelFirstPage` in [webapp/Component.js](webapp/Component.js):

```
INumeroprotocollo  DataDABEM (default: oggi-7)  A (default: oggi)  Commessa  CUP
SedeTecnica  AutoreBEM  CodiceFor  NumeroCIG  DataBEM  Societa  Area  NumeroODA
StatoBEM  EstrazioneParziale  BEMBenestataria  NumeroBenessere
```

Mappatura verso i parametri backend in [BEM.controller.js:184](webapp/controller/BEM.controller.js#L184), funzione `LetturaDati`; la `read('/GETLISTSet')` è a [riga 265](webapp/controller/BEM.controller.js#L265).
Esempio di mappatura non banale: `BEMBenestataria === 'X'` viene tradotto nel booleano `IBef`.

### Aggiungere un filtro

1. Aggiungi la proprietà al JSONModel `FilterModelFirstPage` in `Component.js`
2. Aggiungi il campo in `BEM.view.xml` (dentro la `FilterBar`)
3. Aggiungi la chiave in `i18n/i18n.properties`
4. Aggiungi il `aFilters.push(new Filter("I<Nome>", ...))` in `LetturaDati`
5. Se è una data: `setHours(6)` + `toJSON().split('.')[0]` — vedi [../docs/convenzioni-codice.md](../docs/convenzioni-codice.md#6-formatter-e-tipi)

---

## 6. Fragment (16)

| Fragment | Scopo |
|---|---|
| `CreazioneBEM` | creazione nuovo protocollo |
| `ConfermaScrittureIntegrative` | conferma scritture integrative |
| `DocStz` | documenti di stanziamento |
| `Storico` | storico del protocollo |
| `Allegati`, `FileUpload` | gestione documenti SharePoint |
| `RejectDialog` | rifiuto con nota |
| `CommessaHelpRequest`, `SedeTecnicaHelpRequest`, `CodiceFornitoreHelpRequest`, `AutorebemHelpRequest`, `NumeroCigHelpRequest`, `NumeroOdaHelpRequest`, `CigMatchcode` | value help |

Cartella: `webapp/view/fragment/` (**minuscolo**).

---

## 7. Handler chiave

### `BEM.controller.js` (ricerca)
`onInit` · `LetturaDati` (ricerca principale) · `onSearch` · `clearFilter` · `onExcel` (export)
· `Dettaglio` (navigazione) · `onDeletePress` · `*ValueHelp` / `Conferma*` / `Selezione*` (value help)
· `fetchData`/`applyData`/`getFiltersWithValues` (SmartVariantManagement della FilterBar)

### `AvanzamentoBem.controller.js` (lavorazione)
`onRouteMatched` · `onSearch` · `onFlowCalculator` / `createFlowModel` (diagramma di flusso approvativo)
· `presave` / `SalvaButton` · `ModificaButton` · `onStampa` · `onControlli`
· `onNavigateBEF` (salto all'app Benestare) · `updateCosts` / `checkStanziamenti` / `AggiornaImportoTotale`
· `onConfermaScrittureIntegrativePress` / `onAnnullaScrittureIntegrativePress`
· blocco allegati: `_getAllegati`, `_postToSharePoint`, `onUploadCompleted`, `onDownloadFiles`, `onDeleteAllegati`, `checkAttObb` (allegati obbligatori)
· `onStoricoPress` / `_loadStoricoData` / `getApprovers`

### `BEMDetail.controller.js` (ricerca ODA)
`onSearchBemDetail` · `onOdaControl` · `onExportTo` · value help fornitore/commessa

---

## 8. Specificità di questa app

- **Unica app con `sap.ui.mdc`** tra le `libs` del manifest.
- **Unica con `defaultUpdateMethod: "PUT"`** nelle settings dell'ODataModel.
- `createApproversModel()` restituisce un oggetto con chiavi numeriche `{1:'', 2:'', 3:''}`: tre livelli di approvazione.
- `formatter.js` contiene `formatMillisecondsToTime` e `getFornitoriNumber` (etichetta dinamica "Promemoria fornitura (n)").
- Integrazione bidirezionale con **rekeep-bef**: BEM espone i dati che il benestare legge via `/BDL_GETBEMSet`.

## 9. Trappole

| Trappola | Dettaglio |
|---|---|
| `dist/` committata | contiene una build vecchia — modifica solo `webapp/` |
| `AvanzamentoBem` è enorme | 2.853 righe: usa `Grep` per trovare l'handler, non leggerlo tutto |
| Tre pattern di fragment loading | `Fragment.load` cached, `Fragment.load` non cached, `loadFragment` + `??=`. Per codice nuovo usa l'ultimo (esempi a riga 1746, 1849, 2333) |
| GUID SharePoint hard-coded | in `models.js` → `createAllegatiConfig()`. Nuova società = aggiornare qui |
| `formatDecimal` si registra come `sap.ui.demo.myCustomType` | nome residuo del sample SAP, presente in tutte le app |
| **xlsx caricato da CDN due volte** | `webapp/index.html:25` ha uno `<script>` verso `cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.2/`, e `BEM.controller.js` → `onInit` lo ricarica con `jQuery.sap.includeScript`. Dipendenza esterna a runtime: **l'export Excel non funziona senza accesso a internet dal browser**, ed è un potenziale problema CSP. |
