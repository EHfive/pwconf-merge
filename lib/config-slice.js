import path from 'path'
import { readSPAJSON, readVMScript } from './utils.js'

class ConfigSlice {
  _base
  _name
  _paths
  _filePath
  _cache

  constructor(base, ...paths) {
    this._base = base
    this._paths = paths
    this._name = path.join(...paths)
    this._filePath = path.join(this._base, this._name)
  }

  match(name) {
    if (this._name === name) return true

    let overrideDir = this._name.match(/(.*)\.d\/[^\/]*\.(conf|json|js)$/)
    let nameDir = name.match(/(.*)\/[^\/]*\.(conf)$/)
    nameDir = nameDir ? nameDir[1] : ''

    if (!overrideDir) {
      return false
    }

    overrideDir = overrideDir[1]

    if (name.endsWith(overrideDir) || nameDir === overrideDir) {
      return true
    }

    return false
  }

  async load() {
    if (this._name.endsWith('.conf') || this._name.endsWith('.json')) {
      return {
        data: await readSPAJSON(this._filePath),
      }
    } else if (this._name.endsWith('.js')) {
      const script = await readVMScript(this._filePath)
      return {
        script,
      }
    }
  }

  async loadCache() {
    if (this._cache) return this._cache
    return (this._cache = await this.load())
  }
}

export default ConfigSlice
