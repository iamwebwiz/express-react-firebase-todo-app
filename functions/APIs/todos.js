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
      return response.status(500).json({ error: err.code })
    })
}
