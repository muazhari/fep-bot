"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Bot = require("../../../Bot");

var _nodePersist = require("node-persist");

var _nodePersist2 = _interopRequireDefault(_nodePersist);

var _Store = require("../../../Services/Store");

var _Store2 = _interopRequireDefault(_Store);

var _FEPStoreCRUD = require("../../../Bot/Helper/FEPStoreCRUD");

var _FEPStoreCRUD2 = _interopRequireDefault(_FEPStoreCRUD);

var _cloudinary = require("cloudinary");

var _cloudinary2 = _interopRequireDefault(_cloudinary);

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

var _child_process = require("child_process");

var _child_process2 = _interopRequireDefault(_child_process);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const uploadQueue = {};

// const upload = file => {
//   return new Promise(resolve => {
//     cloudinary.uploader.upload(file, result => {
//       resolve({url: result.url, id: result.public_id});
//     }, {resource_type: "auto"});
//   });
// };

const upload = (url, filename) => {
  return new Promise((resolve, reject) => {
    _cloudinary2.default.uploader.upload(url, { public_id: filename }).then(file => {
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
  uploadQueue[type] = _extends({}, uploadQueue[type], fileMeta);
  const ids = Object.keys(uploadQueue[type]);
  if (ids.length === limit) {
    console.log("**  uploaded all files (" + ids.join(",") + ") to cloudinary");
    callback();
  }
};

exports.default = { upload, waitForAllUploads };
//# sourceMappingURL=index.js.map