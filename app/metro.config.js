const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
    // Support pnpm symlinks
    unstable_enableSymlinks: true,
    nodeModulesPaths: [path.resolve(__dirname, "node_modules"), path.resolve(__dirname, "../node_modules")],
    // Help Metro resolve modules from the project root for pnpm
    extraNodeModules: {
      // Create an alias to resolve app files from the correct location
      ...Object.fromEntries(["App", "App.tsx", "src", "assets"].map((name) => [name, path.resolve(__dirname, name)])),
    },
  };

  // Watch parent node_modules and project root for pnpm workspace
  config.watchFolders = [path.resolve(__dirname, "../node_modules"), path.resolve(__dirname)];

  // Set project root to help with resolution
  config.projectRoot = __dirname;

  return config;
})();
