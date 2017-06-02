import test from 'ava'
import packageInstaller from './index'

const verifyDependencyOrder = (deps, result) => {
  result = result.split(', ')
  let memo = {}
  for (var i = 0; i < deps.length; i++) {
    let packages = deps[i].slice(': ')
    let p = packages[0]
    let dep = packages[1]
    if (!memo[p]) { memo[p] = result.indexOf(p) }
    if (dep && dep.length === 0) { continue }
    if (!memo[dep]) { memo[dep] = result.indexOf(dep) }
    if (memo[dep] > memo[p]) { return false }
  }
  return true
}

test('no input returns null output', t => {
  t.is(packageInstaller(), null)
})

test('empty array as input returns empty array as output', t => {
  t.is(packageInstaller([]).length, 0)
})

test('should throw TypeError if input is not array', t => {
  const error = t.throws(() => {
    packageInstaller('this will throw an error')
  }, TypeError)

  t.is(error.message, 'Input should be an array but instead got "string"')
})

test('should throw a TypeError if any items in input are not valid strings', t => {
  const error = t.throws(() => {
    packageInstaller(['valid: ', 'valid: ', 0, 'valid: '])
  }, TypeError)

  t.is(error.message, 'Invalid item type in input at index 2.')
})

test('should throw a TypeError if any items in input are don\'t contain two a colon', t => {
  const error = t.throws(() => {
    packageInstaller(['invalid', 'valid: '])
  }, TypeError)

  t.is(error.message, 'Invalid item type in input at index 0.')
})

test('single package with no dependencies should return the single package as a string', t => {
  t.is(packageInstaller(['CamelCaser: ']), 'CamelCaser')
})

test('should return a valid dependency path for two packages as a string', t => {
  t.is(packageInstaller(['KittenService: CamelCaser', 'CamelCaser: ']), 'CamelCaser, KittenService')
})

test('should return a valid dependency path for multiple packages as a string', t => {
  const value = packageInstaller(['KittenService: ', 'Leetmeme: Cyberportal', 'Cyberportal: Ice', 'CamelCaser: KittenService', 'Fraudstream: Leetmeme', 'Ice: '])
  const expected = 'KittenService, Ice, Cyberportal, Leetmeme, CamelCaser, Fraudstream'
  t.true(verifyDependencyOrder(value, expected))
})

test('should throw an error if dependencies contain cycles', t => {
  const error = t.throws(() => {
    packageInstaller(['KittenService: ', 'Leetmeme: Cyberportal', 'Cyberportal: Ice', 'CamelCaser: KittenService', 'Fraudstream: ', 'Ice: Leetmeme'])
  }, Error)

  t.is(error.message, 'Invalid input due to cycles in the dependency path')
})
