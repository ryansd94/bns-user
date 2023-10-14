import path from "path";

module.exports = {
  root: path.resolve(__dirname, "../", "../"),
  outputPath: path.resolve(__dirname, "../", "../", "build/"),
  entryPath: path.resolve(__dirname, "../", "../", "src/index.js"),
  templatePath: path.resolve(__dirname, "../", "../", "src/index.html"),
  imagesFolder: path.resolve(__dirname, "../", "../", "src/assets/images"),
  // fontsFolder: path.resolve(__dirname, '../', '../', 'src/assets/fonts'),
  jsFolder: "js",
};
