import { batch_list } from '../../../Bot'
import axios from "axios";
import cp from "child_process";
import path from "path";

const run = url => {
  const filePath = path.join(__dirname, "../Helper/FEPCleaner", "feplist_cleaner.py");
  const command = `python ${filePath} ${url}`;
  return new Promise((resolve, reject) => {
    cp.exec(command, (error, stdout, stderr) => {
      if (error) reject(error);
      resolve(stdout);
    });
  });
};

export default {
  run
};
