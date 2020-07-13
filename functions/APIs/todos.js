const { db } = require("../utilities/admin");

exports.fetchAllTodos = (request, response) => {
  db.collection("todos")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let todos = [];

      data.forEach(document => {
        todos.push({
          todoId: document.id,
          title: document.data().title,
          body: document.data().body,
          createdAt: document.data().createdAt,
        });
      });

      return response.status(200).json(todos);
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

exports.fetchSingleTodo = (request, response) => {
  const todoId = request.params.id;

  db.collection("todos")
    .doc(todoId)
    .get()
    .then(document => {
      let todo = {};

      todo.id = document.id;
      todo.title = document.data().title;
      todo.body = document.data().body;
      todo.createdAt = document.data().createdAt;

      return response.status(200).json(todo);
    })
    .catch(err => {
      console.error(err);

      return response.status(500).json({
        error: `Unable to fetch the todo item: ${err}`,
      });
    });
};

exports.postNewTodo = (request, response) => {
  if (request.body.body.trim() === "") {
    return response.status(422).json({
      body: "Must not be empty",
    });
  }

  if (request.body.title.trim() === "") {
    return response.status(422).json({
      title: "Must not be empty",
    });
  }

  const newTodo = {
    title: request.body.title,
    body: request.body.body,
    createdAt: new Date().toISOString(),
  };

  db.collection("todos")
    .add(newTodo)
    .then(todo => {
      const todoItem = newTodo;
      todoItem.id = todo.id;

      return response.status(201).json(todoItem);
    })
    .catch(err => {
      console.error(err);
      return response
        .status(500)
        .json({ error: "Something went wrong while adding todo" });
    });
};

exports.deleteTodo = (request, response) => {
  const todoId = request.params.id;

  db.collection("todos")
    .doc(todoId)
    .delete()
    .then(() => {
      return response
        .status(200)
        .json({ message: "Todo deleted successfully" });
    })
    .catch(err => {
      console.error(`An error occured while deleting todo: ${err}`);
      return response.status(500).json({
        error: `An error occured while deleting todo: ${err}`,
      });
    });
};

exports.editTodo = (request, response) => {
  if (request.body.todoId || request.body.createdAt) {
    return response
      .status(403)
      .json({ message: "You are not permitted to edit this item" });
  }

  let document = db.collection("todos").doc(request.params.id);

  document
    .update(request.body)
    .then(() => {
      return response
        .status(200)
        .json({ message: "Todo updated successfully" });
    })
    .catch(err => {
      console.error(err);

      return response.status(500).json({
        error: `An error occured while updating todo: ${err}`,
      });
    });
};
