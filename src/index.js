import http from "http";
import https from "https";
import fs from "fs-extra";
import app from "./app";

const { PORT, PORT_SSL, BASE_URL } = process.env;

const { SSL_PRIVATE_KEY, SSL_CERTIFICATE, SSL_CHAIN } = process.env;

// Certificate
const privateKey = fs.readFileSync(SSL_PRIVATE_KEY, "utf8");
const certificate = fs.readFileSync(SSL_CERTIFICATE, "utf8");
const chain = fs.readFileSync(SSL_CHAIN, "utf8");

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: chain,
};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(PORT, () => {
  console.log(`HTTP Server running on ${BASE_URL}:${PORT}`);
});

httpsServer.listen(PORT_SSL, () => {
  console.log(`HTTPS Server running on ${BASE_URL}:${PORT_SSL}`);
});
