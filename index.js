import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

let tasks = [];
let lastId = 0;

function getDayOfWeek(today) {
  switch (today) {
    case 0:
      return "Domingo";
    case 1:
      return "Segunda-feira";
    case 2:
      return "Terça-feira";
    case 3:
      return "Quarta-feira";
    case 4:
      return "Quinta-feira";
    case 5:
      return "Sexta-feira";
    case 6:
      return "Sábado";
  }
}

function getDate() {
  const today = new Date();
  const dayWeek = getDayOfWeek(today.getDay());
  const day = today.getDate();
  const month = today.getMonth();

  return `${dayWeek}, ${day}/${month}`;
}

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

app.get("/", (req, res) => {
  const date = getDate();
  res.render("index.ejs", { date: date, tasks: tasks });
});

app.post("/add", (req, res) => {
  lastId++;
  const task = {
    id: lastId,
    text: req.body["input"],
    check: false,
  };
  tasks.unshift(task);
  res.redirect("/");
});
