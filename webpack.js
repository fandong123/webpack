const path = require('path').posix;
const fs = require('fs');
const parse = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');

const ModuleParse = (filename) => {
  const content = fs.readFileSync(filename, 'utf-8');
  const ast = parse.parse(content, { sourceType: 'module' });
  const dependencies = { };
  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(filename);
      const newPath = './' + path.join(dirname, node.source.value);
      dependencies[node.source.value] = newPath
    }
  })
  const { code } = babel.transformFromAstSync(ast, null, {
    presets: ['@babel/preset-env']
  })
  return {
    filename,
    dependencies,
    code
  }
}

const makeGraph = (entry) => {
  const graph = ModuleParse(entry);
  const moduleGraph = [graph];
  for (let index = 0; index < moduleGraph.length; index++) {
    const { dependencies } = moduleGraph[index];
    if (dependencies) {
      for (const key in dependencies) {
        moduleGraph.push(ModuleParse(dependencies[key]))
      }
    }
  }
  const obj = {};
  moduleGraph.forEach(item => {
    obj[item.filename] = {
      dependencies: item.dependencies,
      code: item.code,
    }
  })
  return obj;
}

const generateCode = (entry) => {
  const graph = JSON.stringify(makeGraph(entry));
  return `
    (function(graph) {
      function start(module) {
        function require(relativePath) {
          return start(graph[module].dependencies[relativePath])
        }
        var exports = {};
        eval(graph[module].code);
        return exports;
      }
      start('${entry}')
    })(${graph})
  `
}

const code = generateCode('./src/index.js');
fs.mkdirSync('./dist');
fs.writeFileSync('./dist/boundle.js', code);