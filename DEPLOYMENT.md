# Express Magic deployment

Express Magic has two independent deployment paths:

1. Railway deploys the connected Railway services from GitHub.
2. The manual GitHub Actions workflows connect to a Linux VPS over SSH.

Railway deployments do not require the VPS secrets documented below. Do not add guessed values just to make a workflow green.

## Production layout

The manual VPS deployment expects this layout:

| Component | VPS path | Public host |
| --- | --- | --- |
| Landing site | `/srv/feathers-global/current/landing` | `fgship.in` |
| Client panel | `/srv/feathers-global/current/courier-cart-client` | `client.fgship.in` |
| Admin panel | `/srv/feathers-global/current/admin-dashboard` | `admin.fgship.in` |
| Backend API | `/srv/feathers-global/current/backend` | `api.fgship.in` |

Nginx configuration is stored in `deploy/nginx/feathers-global.conf`. The backend is managed by PM2 using `backend/ecosystem.config.cjs` and reads `backend/.env.production` on the server. That file must never be committed.

## Workflow behavior

All SSH workflows are manual-only:

- `Deploy VPS (Manual)` deploys the repository to the VPS.
- `Server Debug` inspects the running VPS and PM2 logs.
- `Amazon Shipping Smoke` runs an Amazon Shipping check from the VPS.

Normal pushes are deployed by Railway and do not run the VPS workflow. A manually started VPS workflow intentionally fails when required SSH secrets are absent, because reporting a successful deployment without contacting the server would be misleading.

## Required GitHub Secrets

Use these exact canonical names. Legacy `FEATHERS_GLOBAL_*` aliases are not used.

| Secret | Required value | Where to obtain it |
| --- | --- | --- |
| `FGSHIP_HOST` | The VPS public IPv4 address or DNS hostname only, for example `server.example.com`. Do not include `https://`, a path, username, or port. SSH port 22 is assumed. | VPS provider dashboard, server inventory, or the person who provisioned the VPS. |
| `FGSHIP_USER` | The Linux SSH login username that can access the VPS and run non-interactive `sudo`, such as the provisioned deployment account. This is not a GitHub username unless that is genuinely the Linux account name. | VPS provisioning record or `/etc/passwd` on the server. |
| `FGSHIP_SSH_PRIVATE_KEY` | Full contents of the unencrypted private key whose public key is installed in `~FGSHIP_USER/.ssh/authorized_keys`. Include the `BEGIN ... PRIVATE KEY` and `END ... PRIVATE KEY` lines and preserve newlines. Do not paste the `.pub` key. | The secure machine or password manager where the deployment key pair was created. Create a dedicated key if none exists. |
| `FGSHIP_PASSWORD` | The real SSH password for `FGSHIP_USER`. Use only when private-key authentication is unavailable. | VPS provider credentials or the server administrator. |

`FGSHIP_HOST` and `FGSHIP_USER` are always required. For authentication, provide `FGSHIP_SSH_PRIVATE_KEY` or `FGSHIP_PASSWORD`; the private key is preferred. You do not need both.

### Create a dedicated SSH key

Run this on a trusted administrator machine, not in GitHub Actions:

```bash
ssh-keygen -t ed25519 -C "express-magic-github-actions" -f express-magic-deploy
```

For unattended GitHub Actions deployment, the key must not require an interactive passphrase. Install `express-magic-deploy.pub` in the deployment user's `~/.ssh/authorized_keys` on the VPS. Store the complete contents of `express-magic-deploy` as `FGSHIP_SSH_PRIVATE_KEY`. Keep the private key out of the repository.

Before adding it to GitHub, verify the same credentials manually:

```bash
ssh -i express-magic-deploy FGSHIP_USER@FGSHIP_HOST
sudo -n true
```

Replace `FGSHIP_USER` and `FGSHIP_HOST` with the real values. Both commands must succeed. The workflow uses `sudo`, so an account without non-interactive sudo access is insufficient.

## Optional integration secrets

These do not control SSH access. The deploy workflow skips an integration sync when its required pair is absent.

### Amazon Shipping

| Secret | Value to provide | Source |
| --- | --- | --- |
| `AMAZON_SHIPPING_REFRESH_TOKEN` | The production Amazon Shipping OAuth/LWA refresh token for the merchant account. | Amazon Shipping authorization flow or the administrator who completed account authorization. |
| `AMAZON_SHIPPING_LWA_CLIENT_ID` | Production Login with Amazon client ID associated with the Amazon Shipping application. | Amazon Developer Console, under the application's LWA security profile. |
| `AMAZON_SHIPPING_LWA_CLIENT_SECRET` | Matching production LWA client secret. | Amazon Developer Console, from the same security profile. |
| `AMAZON_SHIPPING_GSTIN` | The business's real 15-character GSTIN used for Amazon Shipping tax details. | The company's GST registration record. Required when the Amazon Shipping account/API requires GST tax details. |

Do not substitute AWS access keys, an Amazon password, or sandbox credentials for these values.

### Shopify OAuth

| Secret | Value to provide | Source |
| --- | --- | --- |
| `SHOPIFY_CLIENT_ID` | Client ID for the production Shopify app. | Shopify Partner/Dev Dashboard, app client credentials. |
| `SHOPIFY_CLIENT_SECRET` | Client secret for the same production Shopify app. | Shopify Partner/Dev Dashboard, app client credentials. |

Configure this exact production redirect URI in Shopify:

```text
https://api.fgship.in/api/integrations/shopify/oauth/callback
```

Configure this compliance webhook endpoint in the Shopify app settings:

```text
https://api.fgship.in/api/webhooks/shopify/compliance
```

Shopify scopes are configuration, not credentials. Add them as the optional repository variable `SHOPIFY_SCOPES`, not as a secret. When omitted, the workflow uses the repository's built-in order, customer, product, webhook, and fulfillment scopes.

### Razorpay live mode

| Secret | Value to provide | Source |
| --- | --- | --- |
| `RAZORPAY_KEY_ID_PROD` | Live-mode Razorpay key ID, normally beginning with `rzp_live_`. | Razorpay Dashboard, Account & Settings, API Keys, Live Mode. |
| `RAZORPAY_KEY_SECRET_PROD` | Secret generated with the matching live key ID. | Razorpay Dashboard at key creation time or the approved password manager. Regenerate it if lost. |
| `RAZORPAY_MERCHANT_ID_PROD` | Merchant ID for the production Razorpay account. Optional unless the account flow requires it. | Razorpay Dashboard account details. |
| `RAZORPAY_WEBHOOK_SECRET_PROD` | The exact secret configured for the production webhook endpoint. Optional unless Razorpay webhooks are enabled. | Razorpay Dashboard, Webhooks. This is not the API key secret. |

Never use test-mode `rzp_test_` credentials for this production workflow.

## Repository variables

Variables are configured separately from secrets because they are not credentials.

| Variable | Required | Value |
| --- | --- | --- |
| `DEPLOY_RUNTIME_USER` | No | Linux account that owns and runs the deployed application. Defaults to `deploy`. Set it only when the VPS uses another real account. |
| `SHOPIFY_SCOPES` | No | Comma-separated Shopify OAuth scopes if the app needs to override the built-in defaults. |
| `SHOPIFY_SEND_OAUTH_SCOPE` | No | `true` only when the OAuth request must send scopes explicitly; otherwise omit it or set `false`. |

## Configure GitHub

1. Open the GitHub repository.
2. Go to **Settings > Secrets and variables > Actions**.
3. Under **Secrets**, select **New repository secret**.
4. Add `FGSHIP_HOST` and `FGSHIP_USER` with the real VPS values.
5. Add either `FGSHIP_SSH_PRIVATE_KEY` or `FGSHIP_PASSWORD`.
6. Add only the integration secrets for providers that are actually enabled in production.
7. Under **Variables**, add optional `DEPLOY_RUNTIME_USER`, `SHOPIFY_SCOPES`, or `SHOPIFY_SEND_OAUTH_SCOPE` when needed.

The current workflows read repository-level Actions secrets. Adding similarly named values only in Railway does not make them available to GitHub Actions.

## Run and verify

1. Open **Actions > Deploy VPS (Manual)**.
2. Select **Run workflow** on `main`.
3. Confirm that **Validate deploy secrets** passes.
4. Confirm that **Configure deploy SSH** authenticates successfully.
5. Confirm that the build and deployment steps finish and `.deployed_commit` is updated on the VPS.
6. Verify `https://fgship.in`, `https://client.fgship.in`, `https://admin.fgship.in`, and `https://api.fgship.in`.

If validation reports a missing name, create that exact repository secret. If SSH configuration fails, verify the host, Linux username, port 22 connectivity, key pairing, and non-interactive sudo access. Do not commit credentials to solve either error.
