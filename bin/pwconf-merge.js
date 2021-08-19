#!/usr/bin/env node
import { program } from 'commander/esm.mjs'
import { pwConfMerge } from '../lib/index.js'
import {
  readPackage,
  getConfigSliceDir,
  getPipewireConfigDir,
} from '../lib/utils.js'
import { PIPEWIRE_CONFDATADIR } from '../lib/constants.js'

async function main() {
  const pkg = await readPackage()

  program.version(pkg.version)
  program
    .option(
      '-s, --slice-dir <paths...>',
      'path to config slice dir',
      getConfigSliceDir()
    )
    .option(
      '-d, --data-dir <path>',
      'path to pipewire config data dir',
      PIPEWIRE_CONFDATADIR
    )
    .option(
      '-c, --conf-dir <path>',
      'path to pipewire config dir',
      getPipewireConfigDir()
    )

  program.parse(process.argv)

  const options = program.opts()

  await pwConfMerge(options.sliceDir, options.dataDir, options.confDir)
}

main().catch((e) => {
  throw e
})
