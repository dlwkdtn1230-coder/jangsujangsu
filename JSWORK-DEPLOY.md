# JSWORK GitHub Pages deployment

The `jswork-site` branch is reserved for the new **JSWORK — Lee Jangsu** portfolio. The existing `main` site remains untouched.

## Finish publishing

1. Open [the `jswork-site` branch](https://github.com/dlwkdtn1230-coder/jangsujangsu/tree/jswork-site).
2. Select **Add file → Upload files** and upload the original `JSWORK-GitHub-Pages.zip` (keep this exact filename) to the repository root. Commit to `jswork-site`.
3. Go to **Settings → Pages** and set **Build and deployment → Source → GitHub Actions**. This step requires repository admin access.
4. Open **Actions → Deploy JSWORK portfolio to GitHub Pages** to see the deployment result. If the push did not launch it, choose **Run workflow** for `jswork-site` after the workflow is visible.
5. The resulting Pages address is expected to be `https://dlwkdtn1230-coder.github.io/jangsujangsu/` when deployment succeeds. Do not assume it is live until the action succeeds.

The workflow unpacks the ZIP and publishes its `index.html`, images, fonts, CSS and JS, all preserving the original design.
