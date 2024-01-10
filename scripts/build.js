const { readdir, mkdir, open, rm } = require("fs/promises");
const path = require("path");

const configPath = "./configs/";
const distPath = "./dist/";

// eslint-disable-next-line unicorn/prefer-top-level-await -- On n'est pas dans un typescript
(async function () {
  await mkdirDist();

  const entries = await readdir(configPath);
  for await (const entry of entries) {
    const { name } = path.parse(entry);
    const outputFilePath = path.join(distPath, `${name}.json`);

    const content = await importScript(entry);
    await writeOutput(content, outputFilePath);
  }
})();

/**
 * Importe le script demandé.
 * @param {string} target - Le nom du script, présent dans le dossier `configs/`
 * @returns {Promise<object>}
 */
async function importScript(target) {
  const entryPath = path.resolve(path.join(configPath, target));
  return import(`file://${entryPath}`).then(val => val.default);
}

/** Créé le dossier `dist/` */
async function mkdirDist() {
  await rm(distPath, { recursive: true });
  await mkdir(distPath);
}

/**
 * Génére le `json` tiré de la configuration.
 *  @param {import('eslint').Linter.Config} obj - Une configuration eslint
*/
async function writeOutput(obj, target) {
  const content = JSON.stringify(obj, undefined, 2);
  const file = await open(target, "w");

  await file.write(content);
  await file.close();
}