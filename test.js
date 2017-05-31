import test from 'ava'
import packageInstaller from './index'

test('no input returns null output', t => {
  t.is(packageInstaller(), null)
})

test('empty array as input returns empty array as output', t => {
  t.is(packageInstaller([]).length, 0)
})

test('should throw TypeError if input is not array', t => {
  const error = t.throws(() => {
    packageInstaller('this throw an error')
  }, TypeError)

  t.is(error.message, 'Input should be an array but instead got "this throw an error"')
})

test.skip('single package with no dependencies should return the single packade', t => {
  t.is(packageInstaller(['CamelCaser: ']), 'CamelCaser')
})

test.skip('should throw an error if dependencies contain cycles', t => {
  t.throws(() => {
    packageInstaller(['KittenService: ', 'Leetmeme: Cyberportal', 'Cyberportal: Ice', 'CamelCaser: KittenService', 'Fraudstream: ', 'Ice: Leetmeme'])
  }, Error)
})
