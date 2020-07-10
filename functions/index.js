const functions = require('firebase-functions')
const app = require('express')()

const { fetchAllTodos } = require('./APIs/todos')

app.get('/todos', fetchAllTodos)

exports.api = functions.https.onRequest(app)
