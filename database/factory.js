'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

Factory.blueprint('App/Models/User', (faker, _i, data) => {
  return {
    name: faker.name(),
    email: faker.email(),
    password: faker.string({ length: 6 }),
    ...data
  }
})

Factory.blueprint('App/Models/Task', (faker, _i, data) => {
  return {
    title: faker.name(),
    description: faker.string(),
    ...data
  }
})
