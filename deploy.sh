#!/bin/bash
# ============================================================
# Deployment script – BEM
#
# Usage:
#   ./deploy.sh           # interactive environment selection
#   ./deploy.sh quality   # deploy to Quality (TEST)
#   ./deploy.sh prod      # deploy to Production (TARGET)
#
# Credentials can be provided via a .env file placed in this
# folder or in the parent (root) folder. See ../.env.example.
# If no .env is found, the script prompts for username/password.
# ============================================================

set -e

# ---- Load .env file ----------------------------------------
if [ -f ".env" ]; then
    echo "Loading credentials from .env..."
    set -a; source .env; set +a
fi

# ---- Environment selection ---------------------------------
if [ -n "$1" ]; then
    case "$1" in
        quality|Quality|QUALITY|q) ENV_CHOICE=1 ;;
        prod|production|Production|PRODUCTION|p) ENV_CHOICE=2 ;;
        *)
            echo "ERROR: Unknown environment '$1'"
            echo "Usage: ./deploy.sh [quality|prod]"
            exit 1 ;;
    esac
else
    echo ""
    echo "Select deployment environment:"
    echo "  1) Quality  (org: Rekeep-ECC-CF-TESTOrg  /  space: TEST)"
    echo "  2) Production (org: Rekeep S.p.A. prod  /  space: TARGET)"
    echo ""
    read -p "Enter choice [1/2]: " ENV_CHOICE
fi

case "$ENV_CHOICE" in
    1)
        ENV_LABEL="Quality"
        TARGET_ORG="${CF_ORG_QUALITY:-Rekeep-ECC-CF-TESTOrg}"
        TARGET_SPACE="${CF_SPACE_QUALITY:-TEST}"
        ;;
    2)
        ENV_LABEL="Production"
        TARGET_ORG="${CF_ORG_PROD:-Rekeep S.p.A._rekeep-s-p-a-ecc-cf-prod}"
        TARGET_SPACE="${CF_SPACE_PROD:-TARGET}"
        ;;
    *)
        echo "ERROR: Invalid choice '$ENV_CHOICE'"
        exit 1 ;;
esac

API_URL="${CF_API:-https://api.cf.eu10-004.hana.ondemand.com}"

echo ""
echo "============================================================"
echo "  App:    BEM"
echo "  Target: $ENV_LABEL"
echo "  API:    $API_URL"
echo "  Org:    $TARGET_ORG"
echo "  Space:  $TARGET_SPACE"
echo "============================================================"
echo ""

# ---- Credentials (prompt if not set in .env) ---------------
if [ -z "$CF_USER" ]; then
    read -p "CF Username (email): " CF_USER
fi

if [ -z "$CF_PASSWORD" ]; then
    read -s -p "CF Password: " CF_PASSWORD
    echo ""
fi

# ---- Steps -------------------------------------------------
echo "[1/3] Logging in to Cloud Foundry and setting target..."
cf login -a "$API_URL" -u "$CF_USER" -p "$CF_PASSWORD" -o "$TARGET_ORG" -s "$TARGET_SPACE"

echo "[2/3] Building MTA archive..."
npm run build:mta

echo "[3/3] Deploying to $ENV_LABEL..."
npm run deploy

echo ""
echo "============================================================"
echo "  BEM deployed to $ENV_LABEL successfully!"
echo "============================================================"
