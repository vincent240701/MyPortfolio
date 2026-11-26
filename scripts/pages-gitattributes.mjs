// The repo stores images/PDFs in Git LFS. GitHub Pages can't serve LFS files,
// so turn LFS off for the published gh-pages branch only.
import { writeFileSync } from "node:fs";
writeFileSync("dist/.gitattributes", "* -filter -diff -merge\n");
