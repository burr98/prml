# TaskPath: AI Training Work Coaching Site

A static landing page that helps people get onto Handshake AI or Outlier, sets honest expectations,
and collects name + phone number into a Google Sheet. Includes WhatsApp and Telegram contact buttons.

```
recruitment-site/
├── index.html          # the page
├── styles.css          # styling (mobile friendly)
├── script.js           # settings (CONFIG) + form logic
└── apps-script/Code.gs # Google Sheets backend
```

## 1. Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a blank sheet, e.g. "Website Leads".

## 2. Connect the Sheet with Apps Script

1. In the sheet: **Extensions > Apps Script**.
2. Delete the sample code, paste everything from `apps-script/Code.gs`, click **Save**.
3. **Deploy > New deployment**, click the gear icon, choose **Web app**.
4. Set **Execute as: Me** and **Who has access: Anyone**, then **Deploy**.
5. Approve permissions. If you see "Google hasn't verified this app", click **Advanced > Go to (project name)**. It's your own script.
6. Copy the **Web app URL** (ends in `/exec`). Opening it in a browser should show `"Endpoint is live"`.

Sign-ups appear in a **Leads** tab (created automatically) with columns:
Timestamp, Name, Phone, Platform, Status, Page, User Agent. Use the Status column to track follow-ups.

> If you edit `Code.gs` later, use **Deploy > Manage deployments > Edit > New version** so the same URL keeps working.

## 3. Configure the site

Edit the `CONFIG` block at the top of `script.js`:

| Setting | Example |
|---|---|
| `brandName` | `"TaskPath"` |
| `whatsappNumber` | `"2348012345678"` (digits only, with country code) |
| `telegramUsername` | `"taskpath_support"` (no `@`) |
| `whatsappMessage` | the pre-filled WhatsApp message |
| `sheetEndpoint` | the `/exec` URL from step 2 |

Also update the FAQ answer "How do you make money?" in `index.html` to match your real pricing.

## 4. Publish on Netlify (free)

1. Download this folder (on GitHub: **Code > Download ZIP**, then unzip).
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag the `recruitment-site` folder onto the page.
3. Your site is live. Create a free account to keep it and rename it (e.g. `taskpath.netlify.app`).
4. Optional: add your own domain under **Domain settings**.

**Auto-deploy from GitHub (optional):** in Netlify, **Add new site > Import from Git**, pick this repo and branch,
set **Base directory** to `recruitment-site`, leave the build command empty. Every push then redeploys.

## 5. Test

Submit the form with your own details. You should see a new row in the sheet and a
"Continue on WhatsApp" button on the page.
