/* eslint-disable no-unused-vars */
const { create, Client } = require("@open-wa/wa-automate");
const { color, options } = require("./tools");
const { version, bugs } = require("./package.json");

const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();
const PORT_API = 5500;

const start = (openWa = new Client()) => {
  console.log(color("=> Bot successfully loaded! Database:", "yellow"));
  console.log(color("=> Source code version:", "yellow"), color(version));
  console.log(color("[BOT]"), color(" now online!", "yellow"));

  openWa.onStateChanged((state) => {
    console.log(color("[BOT]"), state);
    if (state === "UNPAIRED" || state === "CONFLICT" || state === "UNLAUNCHED")
      openWa.forceRefocus();
  });

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use("/", router);

  router.get("/", (req, res) => {
    let target = req.query.target;
    let message = req.query.message;

    headNumber = target[0] + target[1];
    if (headNumber == "08") {
      target = `62${target.slice(1)}@c.us`;
    } else {
      target = `62${target.slice(2)}@c.us`;
    }

    if (!target && !message) {
      res.status(400).send("Please provide a target and a message");
    } else {
      openWa.sendText(target, message);
      console.log(
        color("[BOT]"),
        color(" Sending message to", "yellow"),
        target
      );
      res.setHeader("content-type", "text/plain");
      res.send(
        JSON.stringify({
          status: "success",
          data: { target: target, message: message },
        })
      );
    }
  });

  app.listen(PORT_API, () => {
    console.log(
      color("[BOT]"),
      color(` API running on ${PORT_API} PORT`, "yellow")
    );
  });
};

create(options(start))
  .then((openWa) => start(openWa))
  .catch((err) => console.error(err));
