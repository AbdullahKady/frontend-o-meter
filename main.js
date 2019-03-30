const recursiveReadDir = require('recursive-readdir');
const fs = require('fs');
const path = require('path');

const { promisify } = require('util');
const { analyzeJS, analyzeCSS } = require('./analyzer');

const readFile = fileName => promisify(fs.readFile)(fileName, 'utf8');

const fileCategorizer = (inputDir, files, extensions) => {
  const result = {};
  extensions.forEach((extension) => {
    result[extension] = files
      .filter(file => path.extname(file) === `.${extension}`)
      .map(file => path.relative(inputDir, file));
  });
  return result;
};

const main = async () => {
  const rawInputDir = process.argv[2];
  const inputDir = path.resolve(rawInputDir);
  const ignoredPatterns = ['node_modules', 'dist', 'build', '.*', '*.env*', '*gulp*', 'config'];
  const files = await recursiveReadDir(inputDir, ignoredPatterns);
  const extensions = ['css', 'scss', 'html', 'js', 'ts'];

  const {
    css, scss, html, js, ts,
  } = fileCategorizer(inputDir, files, extensions);

  const jsMetrics = await Promise.all(
    js.map(async (relativeFileName) => {
      const fileName = path.join(inputDir, relativeFileName);
      const sourceCode = await readFile(fileName);

      return {
        file: relativeFileName,
        metrics: analyzeJS(sourceCode),
      };
    }),
  );

  const cssMetrics = await Promise.all(
    css.map(async (relativeFileName) => {
      const fileName = path.join(inputDir, relativeFileName);
      const sourceCode = await readFile(fileName);
      return {
        file: relativeFileName,
        metrics: await analyzeCSS(sourceCode),
      };
    }),
  );

  const result = {
    files: {
      scss,
      html,
      ts,
      css,
      js,
    },
    metrics: {
      cssMetrics,
      jsMetrics,
    },
  };

  fs.writeFileSync('./out.json', JSON.stringify(result));
};
main();
