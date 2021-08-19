import path from 'path'
import { promises as fsPromises } from 'fs'
import { parse } from 'spa-json'
import { VM, VMScript } from 'vm2'
import { mergeWith, isArray } from 'lodash-es'
import { CONFIG_DIR, __basedir } from '../lib/constants.js'

const { opendir, readFile } = fsPromises

async function* readConfigDir(...basePaths) {
  let dir

  try {
    dir = await opendir(path.join(...basePaths))
  } catch (err) {
    yield { err }
    return
  }

  for await (const dirent of dir) {
    const paths = [...basePaths, dirent.name]
    if (dirent.isDirectory()) {
      yield* readConfigDir(...paths)
    } else {
      yield { paths }
    }
  }
}

async function readSPAJSON(file) {
  return parse(await readFile(file))
}

async function readVMScript(file) {
  return new VMScript((await readFile(file)).toString())
}

function runSliceScript({ name, conf, script, global }) {
  let data
  const _state = {
    name,
    conf,
  }
  const vm = new VM({
    timeout: 1000,
    sandbox: {
      ...global,
      _state,
      console,
      newPWConf(func) {
        _state.dataFunc = func
      },
    },
  })

  try {
    if (typeof script === 'function') {
      script = script()
    }
    vm.run(script)

    if (typeof _state.dataFunc === 'function') {
      data = vm.run('_state.dataFunc(_state.conf, _state.name)')
      if (data !== undefined) {
        return data
      }
    }
  } catch (e) {
    if (e.code !== 'ERR_SCRIPT_EXECUTION_TIMEOUT') throw e
    data = undefined
    console.warn(name, 'ERR_SCRIPT_EXECUTION_TIMEOUT')
  }
}

function mergeCustomizer(objValue, srcValue, key, object, source, stack) {
  if (!isArray(objValue) || !isArray(srcValue)) return

  return objValue.concat(srcValue)
}

function defaultMerge(object, source) {
  return mergeWith(object, source, mergeCustomizer)
}

function getXdgConfigHome() {
  if (process.env.XDG_CONFIG_HOME) {
    return path.resolve(process.env.XDG_CONFIG_HOME)
  } else if (process.env.HOME) {
    return path.resolve(process.env.HOME, '.config')
  }
}

function getConfigSliceDir() {
  const dirs = [CONFIG_DIR]

  if (process.getuid() !== 0) {
    const configDir = getXdgConfigHome()
    if (configDir) {
      dirs.push(path.join(configDir, 'pwconf-merge'))
    }
  }

  return dirs
}

function getPipewireConfigDir() {
  if (process.getuid() === 0) return '/etc/pipewire'

  return path.resolve(process.env.HOME, '.config/pipewire')
}

async function readPackage() {
  return JSON.parse(await readFile(path.join(__basedir, 'package.json')))
}

export {
  readConfigDir,
  readSPAJSON,
  readVMScript,
  runSliceScript,
  defaultMerge,
  getConfigSliceDir,
  getPipewireConfigDir,
  readPackage,
}
