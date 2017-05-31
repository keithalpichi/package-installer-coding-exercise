const packageInstaller = deps => {
  if (!deps) { return null }
  if (!Array.isArray(deps)) { throw new TypeError(`Input should be an array but instead got "${deps}"`) }
  if (deps.length === 0) { return [] }
}

export default packageInstaller
