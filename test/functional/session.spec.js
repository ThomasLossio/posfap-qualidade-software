'use strict'

const { test, trait, beforeEach } = use('Test/Suite')('Session')
const Database = use('Database')

/** @type {typeof import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
// const User = use('App/Models/User')

beforeEach(async () => {
  await Database.raw('TRUNCATE users CASCADE')
})

trait('Test/ApiClient')

test('it should return JWT token when session created', async ({ assert, client }) => {
  const userPayload = {
    email: 'teste@teste.com',
    password: '123456'
  }

  await Factory.model('App/Models/User').create(userPayload)
  const user = await Factory.model('App/Models/User').make(userPayload)

  const response = await client.post('sessions').send(user.$attributes).end()

  response.assertStatus(200)
  assert.exists(response.body.token)
})

test('it should not be able to sign in without an email address', async ({ assert, client }) => {
  const userPayload = {
    email: '',
    password: '123456'
  }

  const user = await Factory.model('App/Models/User').make(userPayload)
  const response = await client.post('sessions').send(user.$attributes).end()

  response.assertStatus(400)
  response.assertError([
    {
      message: 'email é obrigatório.',
      field: 'email',
      validation: 'required'
    }
  ])
})

test('it should not be able to sign in without a valid email', async ({ assert, client }) => {
  const userPayload = {
    email: 'teste',
    password: '123456'
  }

  const user = await Factory.model('App/Models/User').make(userPayload)
  const response = await client.post('sessions').send(user.$attributes).end()

  response.assertStatus(400)
  response.assertError([
    {
      message: 'email deve ser um e-mail válido.',
      field: 'email',
      validation: 'email'
    }
  ])
})

test('it should not be able to sign in without a password', async ({ assert, client }) => {
  const userPayload = {
    password: ''
  }

  const user = await Factory.model('App/Models/User').make(userPayload)
  const response = await client.post('sessions').send(user.$attributes).end()

  response.assertStatus(400)
  response.assertError([
    {
      message: 'password é obrigatório.',
      field: 'password',
      validation: 'required'
    }
  ])
})

test('it should not be able to sign in with a password of less than 6 characters', async ({ assert, client }) => {
  const userPayload = {
    password: '12345'
  }

  const user = await Factory.model('App/Models/User').make(userPayload)
  const response = await client.post('sessions').send(user.$attributes).end()

  response.assertStatus(400)
  response.assertError([
    {
      message: 'password não deve ser menor que 6.',
      field: 'password',
      validation: 'min'
    }
  ])
})

test('it should not be able to sign in with a user that does not exist', async ({ assert, client }) => {
  const userPayload = {
    password: '123456'
  }

  await Factory.model('App/Models/User').create()
  const user = await Factory.model('App/Models/User').make(userPayload)

  const response = await client.post('sessions').send(user.$attributes).end()

  response.assertStatus(401)
})
