# Sur le plugin '@nalca/eslint-plugin'

## Description

Un jeu de règle eslint centralisé pour décider à un seul endroit des règles à appliquer de façon générale sur les projets javascript linté.

## Règles disponible

- `javascript-base` : Un jeu de règles utilisant uniquement les règles eslint disponibles par défault, à destination des fichiers javascript.
- `javascript-plugins` : Un jeu de règles utilisant le plugin **eslint-plugin-unicorn** & **eslint-plugin-promise**, principalement sur des questions de styles.
- `javascript-node`: Un jeu de règles étendant `javascript-plugins`, mais à destination de nodejs.
- `typescript-base` : Un jeu de règles typescript + unicorn + promise, avec certaines règles javascript désactivées car en conflit avec typescript.
- `typescript-node`: Un jeu de règles étendant `typescript-base`, mais à destination de nodejs / typescript.
- `typescript-type-checked` : Un jeu de règles typescript plus avancées, mais qui nécessite de fournir les projets **tsconfig.json**

<span style="color:red"> /!\ </span><span style="padding: 0.25rem">Ce jeu de règle nécessite de définir l'option **parserOptions.project**</span><span style="color:red"> /!\ </span>

- `typescript-vue` : Un jeu de règles typescript *type-checké* avec vuejs.

<span style="color:red"> /!\ </span><span style="padding: 0.25rem">Ce jeu de règle nécessite de définir l'option **parserOptions.project**</span><span style="color:red"> /!\ </span>

## Dépendances npm

***eslint***, bien sûr.

Les autres dépendances sont optionnelles ***(OU PAS), SELON LE JEU DE REGLES CHOISI***.

- `javascript-base` : Pas de dépendances supplémentaires.
- `javascript-plugins` : ***eslint-plugin-unicorn*** et ***eslint-plugin-promise***
- `javascript-node`: Même dépendances que `javascript-plugins`.
- `typescript-base` : ***@typescript-eslint/parser*** et ***@typescript-eslint/eslint-plugin***, avec les dépendances de `javascript-plugins`
- `typescript-node`: Même dépendances que `typescript-base`.
- `typescript-type-checked` : Les dépendances de `typescript-base`, et ***eslint-plugin-sonarjs***
- `typescript-vue` : ***eslint-plugin-vue***, avec les dépendances de `typescript-type-checked`

## Exemples d'utilisation

Dans un fichier *.eslintrc:*

```jsonc
{
  "extends": [
    // L'une des règles fournies par ce module
    "plugin:@nalca/typescript-type-checked"
  ],
  "parserOptions": {
    "sourceType": "module",
    // Les différents projets utilisant les règles de lintage.
    // Ceci est l'un des prérequis de certaines règles typescript utilisées,
    // et n'est requis que pour certaines configurations.
    "project": ["tsconfig.json", "tests/tsconfig.json"]
  },
  // Permet d'utiliser ce module
  "plugins": ["@nalca"]
}
```

## Développement et tests

Pour lancer les tests, il faut au préalable aller dans le dossier `test/` et lancer la commande `npm i`.
C'est une fois cette opération réalisée que la commande `npm run test` fonctionnera (ailleurs que dans le dossier `test/`).

### Sur les tests du linteurs

Sauf exception précisée (Un test dédié ?), les tests ne sont pas sensés faire remontés d'avertissement / d'erreurs.

