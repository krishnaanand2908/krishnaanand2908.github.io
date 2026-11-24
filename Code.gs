/**
 * SCHOOL DESK — READ-ONLY GOOGLE DRIVE BROWSER
 *
 * 1. Create a dedicated Drive folder containing ONLY content safe for public viewing.
 * 2. Copy its folder ID into Script Properties as ROOT_FOLDER_ID.
 * 3. Deploy this project as a Web app:
 *      Execute as: Me
 *      Who has access: Anyone
 * 4. Paste the deployed /exec URL into API_URL in school-desk-drive.html.
 *
 * Security: this endpoint exposes names and links only inside ROOT_FOLDER_ID.
 * It does not support upload, create, edit, delete, or arbitrary Drive searches.
 */

function doGet(e) {
  var callback = (e && e.parameter && e.parameter.callback) || '';
  if (!/^[A-Za-z_$][0-9A-Za-z_$\.]*$/.test(callback)) {
    return ContentService.createTextOutput('Invalid callback')
      .setMimeType(ContentService.MimeType.TEXT);
  }

  var result;
  try {
    var props = PropertiesService.getScriptProperties();
    var rootId = props.getProperty('ROOT_FOLDER_ID');
    if (!rootId) throw new Error('Admin setup incomplete: ROOT_FOLDER_ID is not configured.');

    var root = DriveApp.getFolderById(rootId);
    var requestedId = (e.parameter.folderId || '').trim();
    var folder = requestedId ? DriveApp.getFolderById(requestedId) : root;

    if (!isInsideRoot_(folder, rootId)) {
      throw new Error('That folder is outside the configured School Desk folder.');
    }

    var items = [];
    var folders = folder.getFolders();
    while (folders.hasNext()) {
      var subfolder = folders.next();
      items.push({
        id: subfolder.getId(),
        name: subfolder.getName(),
        isFolder: true,
        mimeType: 'application/vnd.google-apps.folder',
        url: subfolder.getUrl()
      });
    }

    var files = folder.getFiles();
    while (files.hasNext()) {
      var file = files.next();
      items.push({
        id: file.getId(),
        name: file.getName(),
        isFolder: false,
        mimeType: file.getMimeType(),
        modifiedTime: file.getLastUpdated().toISOString(),
        url: file.getUrl()
      });
    }

    // Stable ordering; folders first, then alphabetical names.
    items.sort(function(a, b) {
      if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1;
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });

    result = {
      ok: true,
      folderName: folder.getName(),
      folderUrl: folder.getUrl(),
      items: items
    };
  } catch (err) {
    result = { ok: false, error: String(err && err.message ? err.message : err) };
  }

  var json = JSON.stringify(result).replace(/</g, '\\u003c');
  return ContentService.createTextOutput(callback + '(' + json + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

/**
 * Ensures the requested folder is the configured root or one of its descendants.
 * Parent traversal is capped to avoid pathological loops.
 */
function isInsideRoot_(folder, rootId) {
  var current = folder;
  for (var depth = 0; depth < 50; depth++) {
    if (current.getId() === rootId) return true;
    var parents = current.getParents();
    if (!parents.hasNext()) return false;
    current = parents.next();
  }
  return false;
}
