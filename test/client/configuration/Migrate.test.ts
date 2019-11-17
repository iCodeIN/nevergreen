import {migrate, moveData} from '../../../src/client/configuration/Migrate'
import * as migrations from '../../../src/client/configuration/migrations'
import {APPLIED_MIGRATIONS_ROOT} from '../../../src/client/configuration/MigrationsReducer'

const isoDateTime = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/

it('should migrate the given data by mutating it, including adding any applied migrations', () => {
  const migrationId = '20191004195445_A'
  jest.spyOn(migrations, 'getOrderedMigrations').mockReturnValue([
    {id: migrationId, migrate: (data) => moveData(data, 'foo', 'baz')}
  ])
  const data = {foo: 'bar'}

  migrate(data)

  expect(data).toHaveProperty('baz', 'bar')
  expect(data).toHaveProperty(APPLIED_MIGRATIONS_ROOT, [{
    id: migrationId,
    timestamp: expect.stringMatching(isoDateTime)
  }])
  expect(data).not.toHaveProperty('foo')
})

it('should apply migrations in the order they are returned', () => {
  jest.spyOn(migrations, 'getOrderedMigrations').mockReturnValue([
    {id: '20191004195445_A', migrate: (data) => moveData(data, 'foo', 'baz')},
    {id: '20191005125402_B', migrate: (data) => moveData(data, 'baz', 'bux')},
    {id: '20191006120427_C', migrate: (data) => moveData(data, 'bux', 'fiz')}
  ])
  const data = {foo: 'bar'}

  migrate(data)

  expect(data).toHaveProperty('fiz', 'bar')
})

it('should not apply already applied migrations', () => {
  const migrationId = '20191004195445_A'
  const migration = jest.fn()
  jest.spyOn(migrations, 'getOrderedMigrations').mockReturnValue([
    {id: migrationId, migrate: migration}
  ])
  const data = {
    [APPLIED_MIGRATIONS_ROOT]: [
      {
        id: migrationId,
        timestamp: 'some-timestamp'
      }
    ],
    baz: 'bar'
  }

  migrate(data)

  expect(migration).not.toHaveBeenCalled()
})
