
const traverse = require('traverse')
const uglify = require('uglify-es')// require("uglify-js")
const FIRST_INDEX = 0
const SECOND_INDEX = 1

class IsCommonJS {
  /**
   * @param {string} src
   * @return {boolean}
   */
  static isCommonJS (src) {
    let hasRequires = false
    let hasExports = null
    try {
      hasRequires = IsCommonJS._hasRequire(src)
      hasExports = src.match(/module.exports.\w+/) || src.match(/exports.\w+/) || src.match(/module.exports\s?=/)
    } catch (error) {
      console.warn('handled error below so returning false')
      console.error(error)
    }

    return hasRequires || hasExports != null
  }

  /**
   * @param {string} src
   * @return {boolean}
   */
  static _hasRequire (src) {
    let hasRequire = false
    const ast = uglify.parse(src.toString())

    traverse(ast).forEach(function (node) {
      const potentialNode = Array.isArray(node) && node[FIRST_INDEX]
      if (!potentialNode) {
        return undefined
      }

      if (IsCommonJS.isNamedCall(node, 'require')) {
        hasRequire = true
      }
    })

    return hasRequire
  }

  /**
   * @param {Node} node
   * @param {string} word
   * @return {boolean}
   */
  static isNamedCall (node, word) {
    const NODE_NAME_INDEX = 0
    const NODE_VALUE_INDEX = 1

    const nodeName = node[NODE_NAME_INDEX]
    const nodeValue = node.slice(NODE_VALUE_INDEX)

    return nodeName === 'call' &&
                nodeValue[FIRST_INDEX][FIRST_INDEX] === 'name' &&
                nodeValue[FIRST_INDEX][SECOND_INDEX] === word
  }
}

module.exports = IsCommonJS
