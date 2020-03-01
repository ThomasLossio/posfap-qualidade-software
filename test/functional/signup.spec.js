'use strict'

const { test, trait, beforeEach } = use('Test/Suite')('User Registration')
const Database = use('Database')

/** @type {typeof import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

beforeEach(async () => {
  await Database.raw('TRUNCATE users CASCADE')
})

trait('Test/ApiClient')

test('it should be able to sign up', async ({ client }) => {
  const userPayload = {
    password: '123456',
    password_confirmation: '123456'
  }
  const user = await Factory.model('App/Models/User').make(userPayload)

  const response = await client.post('users').send(user.$attributes).end()

  response.assertStatus(201)
})

test('it should not be able to sign up without a name', async ({ client }) => {
  const userPayload = {
    name: '',
    password: '123456',
    password_confirmation: '123456'
  }

  const user = await Factory.model('App/Models/User').make(userPayload)

  const response = await client.post('users').send(user.$attributes).end()

  response.assertStatus(400)
  response.assertError([
    {
      message: 'name é obrigatório.',
      field: 'name',
      validation: 'required'
    }
  ])
})

test('it should not be able to sign up without an email', async ({ client }) => {
  const userPayload = {
    email: '',
    password: '123456',
    password_confirmation: '123456'
  }

  const user = await Factory.model('App/Models/User').make(userPayload)

  const response = await client.post('users').send(user.$attributes).end()

  response.assertStatus(400)
  response.assertError([
    {
      message: 'email é obrigatório.',
      field: 'email',
      validation: 'required'
    }
  ])
})

test('it should not be able to sign up without a valid email', async ({ client }) => {
  const userPayload = {
    email: 'thomas@',
    password: '123456',
    password_confirmation: '123456'
  }

  const user = await Factory.model('App/Models/User').make(userPayload)

  const response = await client.post('users').send(user.$attributes).end()

  response.assertStatus(400)
  response.assertError([
    {
      message: 'email deve ser um e-mail válido.',
      field: 'email',
      validation: 'email'
    }
  ])
})

test('it should not be able to sign up with a duplicated email', async ({ client }) => {
  const userPayload = {
    email: 'thomaslossio@hotmail.com',
    password: '123456'
  }

  await Factory.model('App/Models/User').create(userPayload)

  const userDuplicatedPayload = {
    email: 'thomaslossio@hotmail.com',
    password: '123456',
    password_confirmation: '123456'
  }

  const user = await Factory.model('App/Models/User').make(userDuplicatedPayload)

  const response = await client.post('users').send(user.$attributes).end()

  response.assertStatus(400)
  response.assertError([
    {
      message: 'email já foi utilizado por outra pessoa.',
      field: 'email',
      validation: 'unique'
    }
  ])
})

test('it should not be able to sign up without a password', async ({ client }) => {
  const userPayload = {
    password: '',
    password_confirmation: ''
  }

  const user = await Factory.model('App/Models/User').make(userPayload)

  const response = await client.post('users').send(user.$attributes).end()

  response.assertStatus(400)
  response.assertError([
    {
      message: 'password é obrigatório.',
      field: 'password',
      validation: 'required'
    }
  ])
})

test('it should not be able to sign up without a password confirmation', async ({ client }) => {
  const userPayload = {
    password: '123456'
  }

  const user = await Factory.model('App/Models/User').make(userPayload)

  const response = await client.post('users').send(user.$attributes).end()

  response.assertStatus(400)
  response.assertError([
    {
      message: 'password não foi confirmado corretamente.',
      field: 'password',
      validation: 'confirmed'
    }
  ])
})

test('it should not be able to sign up with a wrong password confirmation', async ({ client }) => {
  const userPayload = {
    password: '123456',
    password_confirmation: '12345'
  }

  const user = await Factory.model('App/Models/User').make(userPayload)

  const response = await client.post('users').send(user.$attributes).end()

  response.assertStatus(400)
  response.assertError([
    {
      message: 'password não foi confirmado corretamente.',
      field: 'password',
      validation: 'confirmed'
    }
  ])
})

test('it should not be able to sign up with a password of less than 6 characters', async ({ client }) => {
  const userPayload = {
    password: '12345',
    password_confirmation: '12345'
  }

  const user = await Factory.model('App/Models/User').make(userPayload)

  const response = await client.post('users').send(user.$attributes).end()

  response.assertStatus(400)
  response.assertError([
    {
      message: 'password não deve ser menor que 6.',
      field: 'password',
      validation: 'min'
    }
  ])
})
