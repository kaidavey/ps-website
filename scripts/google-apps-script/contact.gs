/**
 * Product Space "Let's Chat" form → Google Sheet.
 *
 * Create this from the sheet itself (Extensions > Apps Script) so the script
 * is bound to that spreadsheet. Each POST appends:
 *   Timestamp, Name, Email, Company, Partnership, Message
 *
 * Setup: scripts/google-apps-script/README.md
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  var locked = false;
  try {
    lock.waitLock(15000);
    locked = true;
    var data = readSubmission_(e);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    sheet.appendRow([
      new Date(),
      asPlainText_(data.name),
      asPlainText_(data.email),
      asPlainText_(data.company),
      asPlainText_(data.partnership),
      asPlainText_(data.message),
    ]);
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false });
  } finally {
    if (locked) lock.releaseLock();
  }
}

/** Opening the /exec URL in a browser should show {"ok":true} when access is Anyone. */
function doGet() {
  return json_({ ok: true });
}

function readSubmission_(e) {
  var data = {};
  var post = e && e.postData;
  if (post && post.contents && String(post.type || '').indexOf('application/json') !== -1) {
    data = JSON.parse(post.contents);
  } else if (e && e.parameter) {
    data = e.parameter;
  }
  return {
    name: asString_(data.name),
    email: asString_(data.email),
    company: asString_(data.company),
    partnership: asString_(data.partnership),
    message: asString_(data.message),
  };
}

function asString_(value) {
  return value == null ? '' : String(value);
}

/** A leading apostrophe stops Sheets from treating =, +, -, or @ as a formula. */
function asPlainText_(value) {
  var text = asString_(value);
  if (/^[=+\-@]/.test(text)) return "'" + text;
  return text;
}

function json_(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
