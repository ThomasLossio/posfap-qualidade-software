'use strict'

const Antl = use('Antl')

const User = use('App/Models/User')

class UserController {
  async store ({ request, response }) {
    const data = request.only(['name', 'email', 'password'])

    const user = await User.create(data)

    if (user) return response.status(201).send(user)

    return response.status(500).send({ message: Antl.formatMessage('messages.wrong') })
  }
}

module.exports = UserController
