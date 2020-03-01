'use strict'

const Antl = use('Antl')

class TaskStore {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      title: 'required|unique:tasks',
      description: 'string',
      user_id: 'required'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = TaskStore
