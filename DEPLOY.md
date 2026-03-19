# Deploy – BEM

This guide explains how to deploy the **BEM** app to the SAP BTP Cloud Foundry environments.

---

## Prerequisites

- [CF CLI](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html) installed and available in your `PATH`
- [MTA Build Tool (`mbt`)](https://sap.github.io/cloud-mta-build-tool/) installed globally
- Node.js and npm installed
- Access to the Rekeep BTP subaccount

---

## 1. Set up credentials

Copy the example env file and fill in your personal credentials:

```bash
cp .env.example .env
```

Open `.env` and replace the placeholder values:

```dotenv
CF_USER=your-email@example.com
CF_PASSWORD=your-password
```

> **Note:** `.env` is listed in `.gitignore` and will never be committed to the repository.  
> Do **not** share or commit this file.

---

## 2. Make the script executable (first time only)

```bash
chmod +x deploy.sh
```

---

## 3. Run the deployment

**Interactive mode** – the script will ask you to choose the environment:

```bash
./deploy.sh
```

**Non-interactive mode** – pass the environment as an argument:

```bash
# Deploy to Quality (TEST space)
./deploy.sh quality

# Deploy to Production (TARGET space)
./deploy.sh prod
```

---

## 4. What the script does

| Step | Command |
|------|---------|
| 1 | `cf login` – authenticates against the BTP CF API |
| 2 | `cf target` – sets the org and space for the chosen environment |
| 3 | `npm run build:mta` – builds the MTA archive |
| 4 | `npm run deploy` – deploys the MTA archive via `cf deploy` |

---

## Environments

| Environment | Org | Space |
|-------------|-----|-------|
| Quality | `Rekeep-ECC-CF-TESTOrg` | `TEST` |
| Production | `Rekeep S.p.A._rekeep-s-p-a-ecc-cf-prod` | `TARGET` |

API endpoint: `https://api.cf.eu10-004.hana.ondemand.com`
