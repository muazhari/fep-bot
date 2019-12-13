"use strict";

var _photoeditorsdkServer = require("photoeditorsdk-server");

var _photoeditorsdkServer2 = _interopRequireDefault(_photoeditorsdkServer);

var _lisence = require("./lisence");

var _lisence2 = _interopRequireDefault(_lisence);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const pesdkServer = new _photoeditorsdkServer2.default({
  license: _lisence2.default, // <-- Please replace this with your license. Please make sure this is in *string* format, not *object*.
  editor: {
    preferredRenderer: "webgl", // or 'canvas'
    export: {
      format: "image/jpeg",
      type: _photoeditorsdkServer2.default.SDK.RenderType.BUFFER
    }
  },
  assets: {
    baseUrl: "../node_modules/photoeditorsdk-server/assets" // <-- This should be the absolute path to your `assets` directory
  }
});

// example that converts the image to black and white
// require the sdk
const configuration = {
  version: "3.0.0",
  operations: [{
    type: "filter",
    options: {
      intensity: 1,
      identifier: "imgly_lut_bw"
    }
  }]
};

/** Variant 1: Load image data and call PesdkServer#setImage directly **/
const result = _photoeditorsdkServer2.default.ImageLoader.load("URI TO INPUT IMAGE").then(inputImage => {
  pesdkServer.setImage(inputImage);
  pesdkServer.render(configuration); // Apply the serialization to the input image
});

/** Variant 2: Update image uri in serialization file **/
// serialization.image |= {}
// serialization.image.uri = 'URI TO INPUT IMAGE'
// const result = pesdkServer.render(serialization) // Apply the serialization to the input image

// Finally wait for the promise to be resolved and process the resulting output image buffer
result.then(outputImageBuffer => {
  // do Something with the image data. e.g. write to file
  console.log("Done!");
}).catch(e => {
  console.log(e);
});
//# sourceMappingURL=photoEditor.js.map