const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const { DefinePlugin } = require("webpack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { merge } = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const md5 = require("md5");

// C'est un import à l'origine, mais osef pour le test javascript.
var pathRootResolve, getCurrentPlatform, CordovaScriptContext;

/**
 *  @typedef {Object} ConfigProps
 *  @property {boolean} DEV
 *  @property {boolean} PROD
 *  @property {boolean} analyze
 */

/** @param {ConfigProps} env */
module.exports = async function (environment) {
  const currentPlatform = await getCurrentPlatform(true);
  const context = await CordovaScriptContext.getInstance(currentPlatform);

  /** @type {import('webpack').Configuration} */
  let config = {
    mode: "none",
    /**
     * This is the main entry point for your application, it's the first file
     * that runs in the main process.
     */
    entry: "./source/index.ts",
    cache: true,
    output: {
      path: pathRootResolve("www"),
      filename: "js/[name].[contenthash].js"
    },
    optimization: {
      moduleIds: "deterministic",
      runtimeChunk: true,
      usedExports: environment.DEV,
      removeAvailableModules: true,
      mangleExports: environment.PROD,
      minimize: environment.PROD,
      removeEmptyChunks: environment.PROD,
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          components: {
            name: "main-vue#components",
            test: /[/\\]source[/\\](components)[/\\]/,
            chunks: "all",
            priority: 2075
          },
          page: {
            name: "main-vue#pages",
            test: /[/\\]source[/\\](pages)[/\\]/,
            chunks: "all",
            priority: 2074
          },
          src: {
            name: "@main",
            test: /[/\\]source[/\\]/,
            chunks: "all",
            priority: 2050
          },
          qrCode: {
            name: "qr-code",
            test: /[/\\]node_modules[/\\](@ericblade[/\\]quagga2|@ericblade[/\\]quagga2-reader-qr|jsqr|phonegap-plugin-barcodescanner)/i,
            chunks: "all",
            priority: 1100
          },
          bootstrapVue: {
            name: "bootstrap-vue",
            test: /[/\\]node_modules[/\\](bootstrap-vue)/,
            chunks: "all",
            priority: 1050
          },
          vue: {
            name: "vuejs",
            test: /[/\\]node_modules[/\\](vue|vuex|vue-router|portal-vue)/,
            chunks: "all",
            priority: 1000
          },
          fns: {
            name: "date-fns",
            test: /[/\\]node_modules[/\\](date-fns)/,
            chunks: "all",
            priority: 999
          },
          lodash: {
            name: "lodash",
            test: /[/\\]node_modules[/\\](lodash)/,
            chunks: "all",
            priority: 998
          },
          pouchdb: {
            name: "pouch",
            test: /(pouchdb-?|[\w-]+pouch|service-local-db|simple-crypto-js)/,
            chunks: "all",
            priority: 900,
            usedExports: true
          },
          vendor: {
            name: "all_others_libraries",
            test: /[/\\]node_modules[/\\]/,
            chunks: "all",
            priority: 100
          }
        }
      }
    },
    stats: {
      errorDetails: true
    },
    module: {
      rules: [
        // Scripts ...
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
                appendTsSuffixTo: [/\.vue$/]
              }
            }
          ]
        },
        // Styles ...
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"]
        },
        {
          test: /\.less$/i,
          use: ["style-loader", "css-loader", "less-loader"]
        },
        // Ressources ...
        {
          test: /translation[/\\].*\.jsonc$/,
          use: "jsonc-loader"
        },
        {
          test: /\.(woff|woff2|eot|ttf)$/i,
          type: "asset/resource"
        },
        {
          test: /\.(png|jpg|gif|svg)$/i,
          type: "asset/inline",
        },
        // .vue files ...
        {
          test: /\.vue$/,
          loader: "vue-loader"
        }
      ]
    },
    plugins: [
      // Remove www/ folder before building anew
      new CleanWebpackPlugin({}),

      // Pour accélerer la compilation typescript ET avoir les erreurs
      new ForkTsCheckerWebpackPlugin({
        eslint: {
          files: "./source/**/*.{ts,tsx,js,jsx,vue}"
        },
        typescript: {
          extensions: {
            vue: true
          }
        }
      }),

      // Vuejs requirement
      new VueLoaderPlugin(),

      // Use an index.html as a template
      new HtmlWebpackPlugin({
        template: pathRootResolve("source", "index.html")
      }),

      // Create global, by webpack (For things that are provided at build time)
      // Remarque: Tout valeur undefined passe à la poubelle et n'apparait pas
      // Ensuite, au moment de la compilation, ces valeurs seront remplacés.
      new DefinePlugin({
        ENABLE_LOGGING: environment.DEV
          ? {
            /** Active le log des `intents` datawedge (Android uniquement) */
            "services.datawedge": false,
            /** Active le log sur pouchdb. */
            "library.pouchdb": false,
            /** Active le log sur le nettoyage automatique des données expirées de la base de donnée locale. */
            "services.cachedb.autoclean": false,
            /** Active le log sur le scannage de code-barre */
            "services.barcode-scanner": false,
            /** Active le log sur la partie cartographie. */
            "services.cartographie": false,
          }
          : {},
        ENCRYPTION_KEY: JSON.stringify(
          md5(`${context.configXml.id}-${"This is my salt"}`)
        ),
        /** Les propriétés qui apparaîtront sur l'objet `cordova.application` */
        CORDOVA_CONFIG: (() => {
          /** @type {Record<string, any>} */
          const parameters = {
            id: context.configXml.id,
            name: context.configXml.name,
            buildType: environment.PROD ? "production" : "development",
            description: context.configXml.description,
            version: `v${context.configXml.version}`,
            compilationDate: new Date().toLocaleString(),
            preferences: {
              ...context.configXml["application-preference"]
            }
          };
          console.log("Imported parameters (cordova.application):", parameters);
          return JSON.stringify(parameters);
        })(),
        /** Est-ce qu'on est dans un build de développement ? */
        IS_DEVELOPPMENT_BUILD: JSON.stringify(!!environment.DEV),
        // Certaines libraries utilisent cette variable pour une optimiser le bundle.
        "process.browser": JSON.stringify(true)
      }),

      // CopyWebpackPlugin ne doit être instancié que si au moins un pattern est défini, sinon il plante.
      (() => {
        /** @type {Array<string | { from: string, to: string }} */
        const patterns = [];

        if (context.targetPlatform === "electron") {
          patterns.push({
            from: pathRootResolve("resources/electron/loading-splash.png"),
            to: "img/loading-splash.png"
          });
        }

        return patterns.length > 0
          ? new CopyWebpackPlugin({ patterns })
          : undefined;
      })(),

      environment.analyze ? new BundleAnalyzerPlugin() : undefined
    ].filter(element => !!element),
    resolve: {
      symlinks: false,
      extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
      alias: {
        "@": pathRootResolve("source"),
        "jquery": "jquery/dist/jquery.slim",
        // CAS PARTICULIER: Permet de ne charger que certains fichiers, selon la plateforme.
        "~~barcode-scanner": (() => {
          switch (currentPlatform) {
            case "android":
              return pathRootResolve("source/services/barcode-scanner/mobile");
            case "ios":
              return pathRootResolve("source/services/barcode-scanner/mobile");
            case "electron":
              return pathRootResolve(
                "source/services/barcode-scanner/electron"
              );
            default:
              return [];
          }
        })(),
        "~~datawedge": (() => {
          switch (currentPlatform) {
            case "android":
              return pathRootResolve("source/services/datawedge/android");
            default:
              return pathRootResolve("source/services/datawedge/default");
          }
        })(),
      },
      fallback: (function () {
        const electronResolve = name => pathRootResolve("source", ".node", name);
        return [
          "child_process",
          "crypto",
          "fs",
          "http",
          "https",
          "os",
          "path",
          "stream",
          "url",
          "util",
          "querystring",
          "zlib"
        ].reduce((accumulator, name) => {
          accumulator[name] = electronResolve(name);
          return accumulator;
        }, {});
      })()
    },
    /** Charge au code d'importer le code d'une autre façon
     *  @see https://webpack.js.org/configuration/externals/
     */
    externals: (function () {
      /** @type {Record<string, string>} */
      const result = {};
      if (currentPlatform === "electron") {
        result.hammerjs = "hammerjs";
      }
      return result;
    })()
  };

  // Différenciation entre PROD et DEV
  if (environment.PROD) {
    config = merge(config, {
      mode: "production"
    });
  } else if (environment.DEV) {
    config = merge(config, {
      mode: "development",
      performance: {
        hints: "warning"
      }
    });
  } else {
    throw new Error(
      "Le type de build demandé est mal configuré. Attendait PROD ou DEV"
    );
  }

  return config;
};
