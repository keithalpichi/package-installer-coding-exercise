const packageInstaller = deps => {
  if (!deps) { return null }
  if (!Array.isArray(deps)) { throw new TypeError(`Input should be an array but instead got "${typeof deps}"`) }
  if (deps.length === 0) { return [] }
  let nodes = buildGraph(deps)
  let result = []
  let visited = {}

  const sortPackages = nodes => {
    const traverse = (pkg, predecessors) => {
      if (visited[pkg]) { return }
      visited[pkg] = true
      let dependency = nodes[pkg]
      if (dependency) {
        if (predecessors[dependency]) {
          throw new Error('Invalid input due to cycles in the dependency path')
        }
        predecessors[pkg] = true
        traverse(dependency, predecessors)
      }

      result.push(pkg)
    }
    Object.keys(nodes).forEach(node => {
      traverse(node, {})
    })
  }

  sortPackages(nodes)

  return result.join(', ')
}

const buildGraph = deps => {
  let nodes = {}
  deps.forEach((packages, i) => {
    if (typeof packages !== 'string') { throw new TypeError(`Invalid item type in input at index ${i}. All items should be strings`) }
    let pair = packages.split(': ')
    let pkg = pair[0]
    let dep = pair.length > 0 && pair[1]
    if (!nodes[pkg] && !dep) { nodes[pkg] = null }
    if (!nodes[pkg] && dep && dep.length > 0) { nodes[pkg] = dep }
  })
  return nodes
}

export default packageInstaller
