# Let's Chat → Google Sheet

The For Companies contact form (`/for-companies`, `#contact`) posts to the same-origin Vercel function `/api/contact`. That function checks the fields and forwards them to the Apps Script web app whose `/exec` URL is in `CONTACT_GAS_URL`. The newsletter form is not part of this.

`CONTACT_GAS_URL` is read only on the server. Do not create a `VITE_CONTACT_FORM_ENDPOINT` for this, and do not put the script URL in client code.

## 1. Create the sheet

1. Create a Google Sheet.
2. On the first tab, set row 1 to exactly these headers:

   `Timestamp` | `Name` | `Email` | `Company` | `Partnership` | `Message`

The script appends to the first tab. Later rows are one submission each. The timestamp uses the spreadsheet's timezone.

## 2. Add the script

1. With that sheet open, choose **Extensions > Apps Script**.
2. Replace the default contents with `scripts/google-apps-script/contact.gs` from this repo.
3. Save.

The script has to be created from the sheet. A standalone script has no active spreadsheet, and `getActiveSpreadsheet()` will fail.

## 3. Deploy the web app

1. **Deploy > New deployment**.
2. Click the gear and choose **Web app**.
3. **Execute as:** Me.
4. **Who has access:** Anyone.
   Choose **Anyone**, not "Anyone with a Google account". The Vercel function is not signed in to Google.
5. Deploy, authorize the requested sheet access, and copy the **Web app URL**. It must end in `/exec`, not `/dev`.

Open that URL in a browser. You should see `{"ok":true}`. A Google sign-in page means the access setting is not Anyone.

If you change the script later: **Deploy > Manage deployments > Edit (pencil) > Version: New version > Deploy**. The existing `/exec` URL keeps serving the previous version until you do this.

## 4. Set the Vercel env var and redeploy

1. Open the Vercel project for this site.
2. **Settings > Environment Variables**.
3. Name: `CONTACT_GAS_URL`. Value: the `/exec` URL.
4. Enable it for **Production** and **Preview**.
5. Save, then redeploy. Deployments > the latest deployment > **Redeploy** is enough. Saving the variable does not update the deployment that is already running.

Until `CONTACT_GAS_URL` is set on that deployment, `/api/contact` returns 503 and the form shows "Your message could not be sent. Please try again. Your answers are still here."

## Local check

`node --test tests/contact-form.test.ts` exercises validation, the honeypot, and the missing-env error without calling Google.

`npm run dev` serves `POST /api/contact` with the same handler. With `CONTACT_GAS_URL` unset, that route returns 503. To send a real row from your machine, put the `/exec` URL in `.env.local` (gitignored) and restart the dev server.
