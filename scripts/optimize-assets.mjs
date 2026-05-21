import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectRoot = process.cwd();
const sourceDir = path.join(projectRoot, "assets", "website Kai maison");
const crawlSourceDir = path.join(projectRoot, "assets", "kaimaison.de-images", "images");
const kaiSourceDir = path.join(projectRoot, "assets", "kai");
const birdSourceDir = path.join(projectRoot, "assets", "bird");
const outputDir = path.join(projectRoot, "public", "generated");
const kaiOutputDir = path.join(outputDir, "kai");
const birdOutputDir = path.join(outputDir, "bird");

const assetMap = [
  ["R1-08607-0005(1).TIF", "neon-window"],
  ["R1-08607-0005.TIF", "neon-arch"],
  ["R1-08607-0006.TIF", "entrance-arch"],
  ["R1-08607-0007.TIF", "flowers-window"],
  ["R1-08607-0017.TIF", "corner-table"],
  ["R1-08607-0021.TIF", "round-table"],
  ["R1-08608-0001.TIF", "dining-room"],
  ["R1-08608-0003.TIF", "bar-tables"],
  ["R1-08608-0006.TIF", "banquette"],
  ["R1-08608-0008.TIF", "mantel-table"],
  ["R1-08608-0011.TIF", "gold-mirror"],
  ["R1-08608-0021.TIF", "garden-table"],
  ["R1-08608-0022.TIF", "window-table"],
  ["R1-08609-0002.TIF", "ceiling-light"],
  ["R1-08609-0005.TIF", "carved-chair"],
  ["R1-08609-0010.TIF", "prep-counter"],
  ["R1-08609-0015.TIF", "terrace-chairs"],
  ["R1-08609-0020.TIF", "outdoor-table"],
  ["R1-08609-0024.TIF", "canal-trees"],
];

const crawledAssetMap = [
  ["001-contact.jpg", "contact-hall"],
  ["002-bo.jpg", "dish-beef"],
  ["003-ca.jpg", "dish-fish"],
  ["004-vit.jpg", "dish-duck"],
  ["006-home-bar.jpg", "home-bar"],
  ["007-kai-maison-home-998x1500.webp", "illustration-home"],
  ["008-kai-maison-menu.webp", "menu-table"],
  ["009-kai-maison-wein.webp", "drink-guest"],
];

const kaiStripAssetMap = [
  ["1.jpg", "strip-food-service"],
  ["2.jpg", "strip-plated-bite"],
  ["3.jpg", "strip-cocktail"],
  ["4.jpg", "strip-dining-service"],
  ["5.jpg", "team-phuong"],
  ["6.jpg", "team-hung"],
  ["7.jpg", "team-group"],
];

const birdAssetMap = [
  ["Xanh dương.png", "blue.png"],
  ["Xanh lá.png", "green.png"],
  ["Đen.png", "black.png"],
  ["Đỏ.png", "red.png"],
];

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(kaiOutputDir, { recursive: true });
await fs.mkdir(birdOutputDir, { recursive: true });

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function generatedAssetsComplete() {
  const required = [
    ...assetMap.flatMap(([, outputName]) => [`${outputName}.webp`, `${outputName}.jpg`]),
    ...crawledAssetMap.flatMap(([, outputName]) => [`kai/${outputName}.webp`, `kai/${outputName}.jpg`]),
    ...kaiStripAssetMap.flatMap(([, outputName]) => [`kai/${outputName}.webp`, `kai/${outputName}.jpg`]),
    ...birdAssetMap.map(([, outputName]) => `bird/${outputName}`),
    "kai-maison-logo.svg",
    "menu-food.pdf",
    "menu-drinks.pdf",
  ];

  const checks = await Promise.all(
    required.map((fileName) => pathExists(path.join(outputDir, fileName))),
  );

  return checks.every(Boolean);
}

if (!(await pathExists(sourceDir))) {
  if (await generatedAssetsComplete()) {
    console.log("Source assets not present; using committed optimized assets.");
    process.exit(0);
  }

  throw new Error(`Missing source assets and generated fallback: ${sourceDir}`);
}

if (!(await pathExists(crawlSourceDir))) {
  if (await generatedAssetsComplete()) {
    console.log("Crawled Kai Maison assets not present; using committed optimized assets.");
    process.exit(0);
  }

  throw new Error(`Missing crawled source assets and generated fallback: ${crawlSourceDir}`);
}

if (!(await pathExists(kaiSourceDir))) {
  if (await generatedAssetsComplete()) {
    console.log("Kai strip assets not present; using committed optimized assets.");
    process.exit(0);
  }

  throw new Error(`Missing Kai strip source assets and generated fallback: ${kaiSourceDir}`);
}

if (!(await pathExists(birdSourceDir))) {
  if (await generatedAssetsComplete()) {
    console.log("Bird assets not present; using committed optimized assets.");
    process.exit(0);
  }

  throw new Error(`Missing bird source assets and generated fallback: ${birdSourceDir}`);
}

const sourceFiles = await fs.readdir(sourceDir);
const tifFiles = sourceFiles.filter((file) => /\.tif$/i.test(file));

if (tifFiles.length !== assetMap.length) {
  throw new Error(`Expected ${assetMap.length} TIF files, found ${tifFiles.length}.`);
}

for (const [sourceName, outputName] of assetMap) {
  const inputPath = path.join(sourceDir, sourceName);
  await sharp(inputPath)
    .rotate()
    .resize({ width: 1800, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(outputDir, `${outputName}.webp`));

  await sharp(inputPath)
    .rotate()
    .resize({ width: 900, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(path.join(outputDir, `${outputName}.jpg`));
}

for (const [sourceName, outputName] of crawledAssetMap) {
  const inputPath = path.join(crawlSourceDir, sourceName);
  await sharp(inputPath)
    .rotate()
    .resize({ width: 1800, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(kaiOutputDir, `${outputName}.webp`));

  await sharp(inputPath)
    .rotate()
    .resize({ width: 900, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(path.join(kaiOutputDir, `${outputName}.jpg`));
}

for (const [sourceName, outputName] of kaiStripAssetMap) {
  const inputPath = path.join(kaiSourceDir, sourceName);
  await sharp(inputPath)
    .rotate()
    .resize({ width: 1800, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(kaiOutputDir, `${outputName}.webp`));

  await sharp(inputPath)
    .rotate()
    .resize({ width: 900, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(path.join(kaiOutputDir, `${outputName}.jpg`));
}

for (const [sourceName, outputName] of birdAssetMap) {
  await fs.copyFile(
    path.join(birdSourceDir, sourceName),
    path.join(birdOutputDir, outputName),
  );
}

await fs.copyFile(
  path.join(sourceDir, "LOGOKAIMAISON_tableetbar.svg"),
  path.join(outputDir, "kai-maison-logo.svg"),
);

await fs.copyFile(
  path.join(sourceDir, "MENU_INNENSEITEN_FOOD.pdf"),
  path.join(outputDir, "menu-food.pdf"),
);

await fs.copyFile(
  path.join(sourceDir, "drink menu-final (mail).pdf"),
  path.join(outputDir, "menu-drinks.pdf"),
);

console.log(
  `Generated ${(assetMap.length + crawledAssetMap.length + kaiStripAssetMap.length) * 2} responsive images, logo, and menu PDFs in ${outputDir}`,
);
