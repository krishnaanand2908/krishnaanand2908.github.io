# School Desk — Google Drive edition

## What this version does
- Reads the immediate contents of a single configured Google Drive root folder.
- Shows subfolders and files; clicking a folder navigates into it.
- Supports breadcrumbs, search in the current folder, sorting and refresh.
- Read-only: no upload, create, edit, move or delete actions are exposed by the website.

## Important privacy warning
The website is public. The Apps Script web app runs as its owner and returns the names and links of items inside the configured root folder to anyone who calls the endpoint. Therefore, the root folder and every descendant must contain only material that is safe to disclose publicly. Do not put identity cards, marksheets, medical records, personal documents, private class lists or confidential school files there.

Drive file links still obey Drive sharing permissions. Visitors can open a file only if its sharing settings permit them. For public files, use the least-permissive sharing setting that still allows the intended audience to view them. Do not make your entire My Drive public.

## Setup

### A. Create a dedicated public-content folder
1. In Google Drive, create a folder such as `School Desk - Public`.
2. Put only public-safe documents and folders inside it.
3. Keep private school/personal documents in a separate folder outside this root.
4. Open the root folder and copy its ID from the URL:
   `https://drive.google.com/drive/folders/FOLDER_ID`

### B. Create the Apps Script backend
1. Visit https://script.google.com/ and create a new project.
2. Replace the editor contents with `Code.gs` from this package.
3. In Project Settings → Script Properties, add:
   - Property: `ROOT_FOLDER_ID`
   - Value: the folder ID copied above
4. Save the project.
5. Choose Deploy → New deployment → type **Web app**.
6. Set **Execute as: Me**.
7. Set **Who has access: Anyone**.
8. Deploy and authorize the requested Google Drive access.
9. Copy the Web app URL ending in `/exec`.

The endpoint is publicly callable. The folder-boundary check prevents browsing outside the configured root, but it cannot prevent visitors from seeing names inside that root. Treat all descendants as public metadata.

### C. Connect the webpage
1. Open `school-desk-drive.html` in a text editor.
2. Find `const API_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";`
3. Replace the placeholder with your deployed `/exec` URL.
4. Save and upload this HTML file to your GitHub Pages repository (for example as `index.html`).

### D. Use it
- Create folders and add files directly in the designated Google Drive root.
- Open the School Desk website and press Refresh.
- Click folders to browse; use breadcrumbs to go back.
- The page reads the current folder each time you navigate or refresh.

## Notes
- This version uses JSONP for cross-origin reads from GitHub Pages to Apps Script.
- It does not embed credentials or API keys in the public HTML.
- If you edit the Apps Script code after deployment, create a new deployment version or edit the existing deployment to point to the new version.
- Apps Script and Drive quotas/availability apply.
