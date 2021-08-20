import { cloneDeep, isObject, isArray } from 'lodash-es'

import { PIPEWIRE_CONFDATADIR } from './constants.js'
import { ConfigSliceLoader } from './config-slice-loader.js'
import { PWConfigPath, PWConfigCache } from './pw-config-path.js'
import {
  runSliceScript,
  defaultMerge,
  getConfigSliceDir,
  getPipewireConfigDir,
} from './utils.js'

function parseOptions(args) {
  if (isObject(args[0]) && !isArray(args[0])) {
    return args[0]
  } else {
    console
    return {
      configSliceDir: args[0],
      pipewireConfDataDir: args[1],
      pipewireConfigDir: args[2],
    }
  }
}

async function pwConfMerge(...args) {
  const opt = parseOptions(args)

  const sliceLoader = new ConfigSliceLoader(
    opt.configSliceDir || getConfigSliceDir()
  )

  const pwLoadPath = new PWConfigPath(
    opt.pipewireConfDataDir || PIPEWIRE_CONFDATADIR
  )

  const pwSavePath = new PWConfigPath(
    opt.pipewireConfigDir || getPipewireConfigDir()
  )
  const pwConfigCache = new PWConfigCache(pwLoadPath, pwSavePath)

  const names = await pwLoadPath.list()

  for (const slice of await sliceLoader.loadAll()) {
    for (const name of names) {
      if (!slice.match(name)) continue

      // console.log('match', slice._name, name)

      let data, sliceData
      try {
        sliceData = await slice.loadCache()
      } catch (e) {
        console.warn(`err: failed to load ${slice._filePath}`, e.name)
        // go to next slice
        break
      }

      const conf = await pwConfigCache.getOrLoad(name)

      if (sliceData.script) {
        data = runSliceScript({
          name,
          conf: cloneDeep(conf),
          script: sliceData.script,
        })
      } else if (sliceData.data) {
        data = defaultMerge(conf, sliceData.data)
      }

      if (!data) continue

      pwConfigCache.set(name, data)
    }
  }

  await pwConfigCache.saveAll()
}

export { pwConfMerge }
