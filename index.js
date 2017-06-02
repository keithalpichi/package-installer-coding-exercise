const packageInstaller = deps => {
  if (!deps) { return null }
  if (!Array.isArray(deps)) { throw new TypeError(`Input should be an array but instead got "${typeof deps}"`) }
  if (deps.length === 0) { return [] }
  const { nodes, arrayNodes } = buildGraph(deps)
  const result = []
  const visited = {}

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

    arrayNodes.forEach(node => {
      traverse(node, {})
    })
  }

  sortPackages(nodes)

  return result.join(', ')
}

const buildGraph = deps => {
  const nodes = {}
  const arrayNodes = []
  deps.forEach((packages, i) => {
    if (typeof packages !== 'string' || packages.search(/: /) === -1) { throw new TypeError(`Invalid item type in input at index ${i}.`) }
    const pair = packages.split(': ')
    const pkg = pair[0]
    const dep = pair[1]
    if (!nodes[pkg] && dep.length === 0) { nodes[pkg] = null }
    if (!nodes[pkg] && dep.length > 0) { nodes[pkg] = dep }
    arrayNodes.push(pkg)
  })
  return { nodes, arrayNodes }
}

export default packageInstaller
