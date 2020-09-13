import express from "express";

export function startServer() {
  const server = express();

  server.use(express.static("../public"));
  
}
