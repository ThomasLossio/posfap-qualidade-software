'use strict'

const Antl = use('Antl')

const Task = use('App/Models/Task')

class TaskController {

    async store ({ request, response }) {
        const data = request.only(['title', 'description', 'user_id'])
    
        const task = await Task.create(data)
    
        if (task) return response.status(201).send(task)
    
        return response.status(500).send({ message: Antl.formatMessage('messages.wrong') })
    }

}

module.exports = TaskController
