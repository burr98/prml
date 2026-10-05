/**
 * Google Apps Script backend: saves website sign-ups to a Google Sheet.
 * Paste this into Extensions > Apps Script in your Google Sheet, then deploy as a Web App.
 */

const SHEET_NAME = "Leads";
const HEADERS = ["Timestamp", "Name", "Phone", "Platform", "Status", "Page", "User Agent"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const p = e.parameter || {};
    const name = clean(p.name, 80);
    const phone = clean(p.phone, 20);

    if (name.length < 2 || phone.replace(/\D/g, "").length < 7) {
      return json({ result: "error", error: "Invalid name or phone" });
    }

    const sheet = getSheet();
    sheet.appendRow([
      new Date(),
      name,
      phone,
      clean(p.platform, 30),
      "New",
      clean(p.page, 200),
      clean(p.userAgent, 300),
    ]);

    return json({ result: "success" });
  } catch (err) {
    return json({ result: "error", error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Lets you open the Web App URL in a browser to check it is live
function doGet() {
  return json({ result: "ok", message: "Endpoint is live" });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Trims, limits length, and stops values being run as spreadsheet formulas
function clean(value, maxLen) {
  let s = String(value || "").trim().slice(0, maxLen);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
