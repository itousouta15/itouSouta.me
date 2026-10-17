import { readFile, writeFile } from "node:fs/promises";
import { readComments } from "./import-blog.mjs";

// Refresh approved/public old-site comments without touching authored posts.
// Run once more immediately before deploying old-domain redirects.
const routes = JSON.parse(
  await readFile(
    new URL("../content/blog/redirects.json", import.meta.url),
    "utf8"
  )
);
const archive = {};
for (const { slug, legacyPath } of routes) {
  archive[`/writing/${slug}`] = await readComments(legacyPath);
  console.log(`${slug}: ${archive[`/writing/${slug}`].length} threads`);
}
await writeFile(
  new URL("../content/blog/legacy-comments.json", import.meta.url),
  JSON.stringify(archive, null, 2) + "\n"
);
const metadataUrl = new URL("../content/blog/migration.json", import.meta.url);
const metadata = JSON.parse(await readFile(metadataUrl, "utf8"));
metadata.historyRefreshedAt = new Date().toISOString();
metadata.commentCount = Object.values(archive)
  .flat()
  .reduce((count, entry) => count + 1 + entry.replies.length, 0);
await writeFile(metadataUrl, JSON.stringify(metadata, null, 2) + "\n");
console.log(
  "Public history refreshed; no remote KV writes or notification emails."
);
