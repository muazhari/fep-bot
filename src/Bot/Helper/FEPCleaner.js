import { batch_list } from "../../Bot/internal";
import axios from "axios";

const hasNumbers = n => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

const store = {};

let file = []

export default async function (url) {
  const response = await axios({
    method: "get",
    url: url,
    responseType: "text"
  });

  file = response.data.split(/\r?\n/);
  run()
  console.log(store)
  return store
};

const set_store = data => {
  if (!Object.keys(store).includes(data.batch)) {
    store[data.batch] = [];

    const selected_user_data = [data.name, data.campus, data.room];

    store[data.batch].push(selected_user_data);
  }
};

const numbers_sect = args => {
  let num = 1;

  args[0].split("").forEach(i => {
    if (hasNumbers(i)) {
      args[0] = args[0].replace(i, "").trim();
      num += i;
    }

    if (args[0][0] == ".") {
      args[0] = args[0].slice(1).trim();
    }
  });

  return num;
};

const batch_validate = str => {
  return !hasNumbers(str) && Object.keys(batch_list).includes(str.toLowerCase());
};

const run = () => {
  const intersected_line = [];
  let batch = ''
  
  for (let line = 0; line < file.length; line += 1) {
    const lsplit = file[line]
    
    if (lsplit.length > 0) {      
      if (file[line] != '' && !batch_validate(file[line][0])) {
        // console.log(file[line])
        batch = file[line][0].toLowerCase();
        continue;
      }

      const ltrim = file[line].trim().split("-");
      
      // console.log("lts", ltrim);

      const args = ltrim.map(str => str.trim());

      // number intact
      args.unshift(numbers_sect(args));
      
      console.log("args", args);

      if (args.length >= 1 && !args.includes(" ")) {
        const data = {
          batch: batch,
          name: args[1],
          campus: args[2],
          room: args.length < 4 ? "" : args[3]
        };

        set_store(data);
      }
    }
  }
};
