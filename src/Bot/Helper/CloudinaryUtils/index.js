import {SharedProps} from "../../../Bot";
import storage from "node-persist";
import Store from "../../../Services/Store";
import FEPStoreCRUD from "../../../Bot/Helper/FEPStoreCRUD";
import cloudinary from "cloudinary";
import fs from "fs-extra";
import request from "request";
import cp from "child_process";
import path from "path";

const uploadQueue = {};

// const upload = file => {
//   return new Promise(resolve => {
//     cloudinary.uploader.upload(file, result => {
//       resolve({url: result.url, id: result.public_id});
//     }, {resource_type: "auto"});
//   });
// };

const upload = (url, filePath) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(url, {public_id: filePath}).then(file => {
      console.log("** File Upload (Promise)");
      console.log("* " + file.public_id);
      console.log("* " + file.url);
      resolve(file);
    }).catch(err => {
      console.log("** File Upload (Promise)");
      if (err) {
        console.warn(err);
        reject(err);
      }
    });
  });
};

const waitForAllUploads = (type, limit, fileMeta, callback) => {
  uploadQueue[type] = {
    ...uploadQueue[type],
    ...fileMeta
  };
  const ids = Object.keys(uploadQueue[type]);
  if (ids.length === limit) {
    console.log("**  uploaded all files (" + ids.join(",") + ") to cloudinary");
    callback();
  }
};

export default {upload, waitForAllUploads};
