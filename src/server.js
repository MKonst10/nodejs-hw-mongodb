import express from "express";
import cors from "cors";
import pino from "pino-http";

export const startServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json);
  //   app.use(
  //     pino({
  //       transport: {
  //         target: "pino-pretty",
  //       },
  //     })
  //   );

  app.get("/", (req, res) => {
    res.json({
      message: "Start work",
    });
  });

  app.use((req, res) => {
    res.status(404).json({
      message: `${req.url} not found`,
    });
  });

  app.use((error, req, res, next) => {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  });

  const port = Number(process.env.PORT) || 3000;

  app.listen(port, () => console.log("Server running on 3000 port"));
};
