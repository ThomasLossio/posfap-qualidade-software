'use strict'

// import { truncate } from '@adonisjs/lucid/src/Lucid/Model'

const { test, trait, beforeEach } = use('Test/Suite')('Task Registration')
const Database = use('Database')

/** @type {typeof import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

beforeEach(async () => {
  await Database.raw('TRUNCATE users CASCADE')
})

trait('Test/ApiClient')

test('it should be able to create a task', async ({ client }) => {

  const user = await Factory.model('App/Models/User').create()  

  const task = await Factory.model('App/Models/Task').make({ user_id: user.id })

  const response = await client.post('tasks').send(task.$attributes).end()
  response.assertStatus(201)
})

test('it should not be able to create a task without a title', async ({ client }) => {

    var user = await Factory.model('App/Models/User').create()  

    const taskPayload = {
        title : '',
        user_id : user.id
    }

    const task = await Factory.model('App/Models/Task').make(taskPayload)

    const response = await client.post('tasks').send(task.$attributes).end()

    response.assertStatus(400)
    response.assertError([
        {
        message: 'title é obrigatório.',
        field: 'title',
        validation: 'required'
        }
  ])
})

test('it should not be able to create a task with the same title', async ({ client }) => {

    var user = await Factory.model('App/Models/User').create()  

    const taskPayload = {
        title : 'dorine',
        user_id : user.id, 
    }

    await Factory.model('App/Models/Task').create(taskPayload)

    const task = await Factory.model('App/Models/Task').make(taskPayload)

    const response = await client.post('tasks').send(task.$attributes).end()

    response.assertStatus(400)
    response.assertError([
        {
          message: 'title já foi utilizado por outra pessoa.',
          field: 'title',
          validation: 'unique'
        }
      ])
})

test('it should not be able to create a task without a description as string', async ({ client }) => {

    var user = await Factory.model('App/Models/User').create()  

    const taskPayload = {
        description : 2.00,
        user_id : user.id
    }

    const task = await Factory.model('App/Models/Task').make(taskPayload)

    const response = await client.post('tasks').send(task.$attributes).end()

    response.assertStatus(400)
    response.assertError([
        {
        message: 'description deve ser uma STRING.',
        field: 'description',
        validation: 'string'
        }
  ])
})

test('it should not be able to create a task without an user_id', async ({ client }) => {

    const task = await Factory.model('App/Models/Task').make()

    const response = await client.post('tasks').send(task.$attributes).end()

    response.assertStatus(400)
    response.assertError([
        {
        message: 'user_id é obrigatório.',
        field: 'user_id',
        validation: 'required'
        }
  ])
})