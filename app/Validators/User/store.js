'use strict'

const Antl = use('Antl')

class UserStore {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      name: 'required',
      email: 'required|email|unique:users',
      password: 'required|confirmed|min:6'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = UserStore
