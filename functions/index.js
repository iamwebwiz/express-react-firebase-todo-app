const functions = require('firebase-functions')
const app = require('express')()
require('dotenv').config()

const { fetchAllTodos, postNewTodo, deleteTodo } = require('./APIs/todos')

app.get('/', (request, response) =>
  response.json({
    app_name: 'Express React Firebase Todo App',
    app_version: '1.0.0',
  })
)

app.get('/todos', fetchAllTodos)

app.post('/todos', postNewTodo)

app.delete('/todos/:id', deleteTodo)

exports.api = functions.https.onRequest(app)
