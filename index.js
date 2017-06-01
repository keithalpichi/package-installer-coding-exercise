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
      predecessors.push(pkg)
      visited[pkg] = true

      if (nodes[pkg]) {
        if (predecessors.indexOf(nodes[pkg]) >= 0) {
          throw new Error('Invalid input due to cycles in the dependency path')
        }
        traverse(nodes[pkg], predecessors)
      }

      result.push(pkg)
    }
    Object.keys(nodes).forEach(node => {
      traverse(node, [])
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
    if (!nodes[pkg]) { nodes[pkg] = null }
    if (dep && dep.length > 0 && !nodes[dep]) {
      nodes[pkg] = dep
      nodes[dep] = null
    }
  })
  return nodes
}

export default packageInstaller
