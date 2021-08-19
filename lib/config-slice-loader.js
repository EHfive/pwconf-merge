import { readConfigDir } from './utils.js'
import ConfigSlice from './config-slice.js'

class ConfigSliceLoader {
  _dirs

  constructor(dirs) {
    this._dirs = [].concat(dirs)
  }

  async loadAll() {
    const sliceFiles = []
    for (const dir of this._dirs) {
      for await (const { paths, err } of readConfigDir(dir)) {
        if (err) continue

        sliceFiles.push(paths)
      }
    }

    sliceFiles.sort()
    return sliceFiles.map((paths) => new ConfigSlice(...paths))
  }
}

export { ConfigSliceLoader }
