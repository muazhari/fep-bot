import fs from "fs-extra";
import cp from "child_process";
import path from "path";
import { COMMAND_PREFIX, BATCH_LIST } from "../../Bot";
import PLGenerator from "../../Bot/Helper/PosetLatticeGenerator";
import Store from "../../Services/Store";

export const PosetLattice = (Bot) => {
  const make = (data) => {
    return new Promise((resolve, reject) => {
      PLGenerator.run(data)
        .then((result) => resolve(JSON.parse(result)))
        .catch(reject);
    });
  };

  const generate = (args) => {
    if (args.length >= 1) {
      const data = {};
      data.setList = args[0];
      data.relation = "divisible"; // only this feature available
      const fileName = Bot.getId().origin;
      data.filePath = path.join(
        __dirname,
        "../Helper/PosetLatticeGenerator",
        `${fileName}.jpg`
      );
      data.filePathPreview = path.join(
        __dirname,
        "../Helper/PosetLatticeGenerator",
        `${fileName}-preview.jpg`
      );

      console.log(data);
      make(data)
        .then((result) => {
          console.log(result);
          cp.execSync(
            `convert -resize 240x jpg:${data.filePath} jpg:${data.filePathPreview}`
          );

          Bot.sendMessage({
            type: "image",
            originalContentUrl: data.filePath,
            previewImageUrl: data.filePathPreview,
          });

          Bot.replyText(result);

          fs.unlinkSync(data.filePath);
          fs.unlinkSync(data.filePathPreview);
        })
        .catch((err) => {
          console.log("Error PosetLattice", err);
        });
    } else {
      Bot.replyText("/pl <setList> [edge] [node]");
    }
  };

  return { generate };
};
