import axios from "axios";
import cp from "child_process";
import path from "path";
import { BATCH_LIST } from "../../../Bot";

const run = (args) => {
  const { filePath, setList, relation, node, edge } = args;
  const scriptPath = path.join(__dirname, "main.py");
  const command = `python3 ${scriptPath} filePath=${filePath} setList=${setList} relation=${relation}`;
  if (node) {
    `${command} node=${node}`;
  }
  if (edge) {
    `${command} edge=${edge}`;
  }

  return new Promise((resolve, reject) => {
    cp.exec(command, (error, stdout, stderr) => {
      if (error || stderr) reject(error);
      else {
        resolve(stdout);
      }
    });
  });
};

export default { run };
