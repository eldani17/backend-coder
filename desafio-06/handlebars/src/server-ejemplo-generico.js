const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("html", (filePath, options, callback) => {
  fs.readFile(`${filePath}`, (error, content) => {
    if (error) {
      return callback(new Error(error));
    }
    const rendered = content
      .toString()
      .replace("#title#", options.title)
      .replace("#message#", options.message);

    return callback(null, rendered);
  });
});

app.set("views", "./views");
app.set("view engine", "html");

app.get("/", (req, res) => {
  res.render("index", {
    title: "este es el titulo",
    message: "este es el mensaje",
  });
});

app.listen(8080, () => console.log("Server started on 8080"));
