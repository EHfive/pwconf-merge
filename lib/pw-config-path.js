import path from 'path'
import { promises as fsPromises } from 'fs'
import { parse } from 'spa-json'
import { readConfigDir } from './utils.js'

const { access, readFile, writeFile, mkdir } = fsPromises

class PWConfigPath {
  _base

  constructor(base) {
    this._base = base
  }

  async list() {
    const arr = []
    for await (const { err, paths } of readConfigDir(this._base)) {
      if (err) continue
      const name = path.join.apply(null, paths.slice(1))
      if (!name.endsWith('.conf')) continue
      try {
        await access(this.resolve(name))
      } catch {
        continue
      }
      arr.push(name)
    }
    return arr
  }

  resolve(name) {
    return path.join(this._base, name)
  }

  async load(name) {
    const file = await readFile(this.resolve(name))
    return parse(file)
  }

  async save(name, data) {
    let str = JSON.stringify(data, null, 2)

    if (str[str.length - 1] != '\n') str += '\n'

    const filePath = this.resolve(name)
    const dirname = path.dirname(filePath)

    try {
      await access(dirname)
    } catch (e) {
      await mkdir(dirname, { recursive: true })
    }

    return await writeFile(filePath, str)
  }
}

class PWConfigCache {
  _loader
  _saver
  _store
  constructor(loader, saver) {
    this._store = new Map()
    this._loader = loader
    this._saver = saver
  }

  async getOrLoad(name) {
    if (this._store.has(name)) {
      return this._store.get(name).data
    }
    const data = await this._loader.load(name)
    this._store.set(name, { data, noSave: true })
    return data
  }

  get(name) {
    if (!this._store.has(name)) {
      throw new Error('config data has not loaded to cache')
    }
    return this._store.get(name).data
  }

  set(name, data) {
    this._store.set(name, { data })
  }

  unset(name) {
    if (!this._store.has(name)) {
      return
    }
    this._store.get(name).noSave = true
  }

  async saveAll() {
    for (const [name, { data, noSave }] of this._store) {
      if (noSave) continue
      console.log('save', name, this._saver.resolve(name))
      await this._saver.save(name, data)
    }
  }
}

export { PWConfigPath, PWConfigCache }
