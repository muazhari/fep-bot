import axios from "axios";
import cp from "child_process";
import path from "path";
import { BATCH_LIST } from "../../../Bot";

const run = (url) => {
  const filePath = path.join(__dirname, "feplist_cleaner.py");
  const command = `python ${filePath} ${url}`;
  return new Promise((resolve, reject) => {
    cp.exec(command, (error, stdout, stderr) => {
      if (error) reject(error);
      resolve(stdout);
    });
  });
};

export default {
  run,
};
