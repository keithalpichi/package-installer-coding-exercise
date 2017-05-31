import test from 'ava'
import packageInstaller from './index'

test('no input returns null output', t => {
  t.is(packageInstaller(), null)
})

test('empty array as input returns empty array as output', t => {
  t.is(packageInstaller([]).length, 0)
})
