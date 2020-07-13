const functions = require("firebase-functions");
const app = require("express")();
require("dotenv").config();

const {
  fetchAllTodos,
  fetchSingleTodo,
  postNewTodo,
  editTodo,
  deleteTodo,
} = require("./APIs/todos");

const { login } = require("./APIs/users");

app.get("/", (request, response) =>
  response.json({
    app_name: "Express React Firebase Todo App",
    app_version: "1.0.0",
  })
);

app.post("/login", login);

app.get("/todos", fetchAllTodos);
app.get("/todos/:id", fetchSingleTodo);
app.post("/todos", postNewTodo);
app.put("/todos/:id", editTodo);
app.delete("/todos/:id", deleteTodo);

exports.api = functions.https.onRequest(app);
