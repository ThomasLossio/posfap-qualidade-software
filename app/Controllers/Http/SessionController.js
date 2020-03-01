'use strict'

const Antl = use('Antl')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

class SessionController {
  async store ({ request, response, auth }) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.findBy('email', email)

    if (!user) {
      return response.status(401).send({ message: Antl.formatMessage('messages.unauthorized') })
    }

    const token = await auth.attempt(email, password)

    if (token) return response.send({ user, token })

    return response.status(401).send({ message: Antl.formatMessage('messages.unauthorized') })
  }
}

module.exports = SessionController
