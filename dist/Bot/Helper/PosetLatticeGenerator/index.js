"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Bot = require("../../../Bot");

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _child_process = require("child_process");

var _child_process2 = _interopRequireDefault(_child_process);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const run = args => {
  const { filePath, setList, relation, node, edge } = args;
  const scriptPath = _path2.default.join(__dirname, "main.py");
  let command = `python3 ${scriptPath} filePath=${filePath} setList=${setList} relation=${relation}`;
  if (node) {
    command + ` node=${node}`;
  }
  if (edge) {
    command + ` edge=${edge}`;
  }

  return new Promise((resolve, reject) => {
    _child_process2.default.exec(command, (error, stdout, stderr) => {
      if (error || stderr) reject(error);else {
        resolve(stdout);
      }
    });
  });
};

exports.default = { run };
//# sourceMappingURL=index.js.map