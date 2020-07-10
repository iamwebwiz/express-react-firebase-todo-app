const { db } = require('../utilities/admin')

exports.fetchAllTodos = (request, response) => {
  db.collection('todos')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      let todos = []

      data.forEach(document => {
        todos.push({
          todoId: document.id,
          title: document.data().title,
          body: document.data().body,
          createdAt: document.data().createdAt,
        })
      })

      return response.json(todos)
    })
    .catch(err => {
      console.error(err)
      response.status(500).json({ error: err.code })
    })
}

exports.postNewTodo = (request, response) => {
  if (request.body.body.trim() === '') {
    return response.status(422).json({
      body: 'Must not be empty',
    })
  }

  if (request.body.title.trim() === '') {
    return response.status(422).json({
      title: 'Must not be empty',
    })
  }

  const newTodo = {
    title: request.body.title,
    body: request.body.body,
    createdAt: new Date().toISOString(),
  }

  db.collection('todos')
    .add(newTodo)
    .then(todo => {
      const todoItem = newTodo
      todoItem.id = todo.id

      return response.status(201).json(todoItem)
    })
    .catch(err => {
      console.error(err)
      response
        .status(500)
        .json({ error: 'Something went wrong while adding todo' })
    })
}
