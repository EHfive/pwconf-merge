import path from 'path'
import { pwConfMerge } from '../lib/index.js'
import { __basedir } from '../lib/constants.js'

async function runLocal() {
  console.time('merge')
  await pwConfMerge(
    path.join(__basedir, 'sample/pwconf-merge'),
    path.join(__basedir, 'sample/pipewire-conf-data'),
    path.join(__basedir, 'sample/pipewire-conf')
  )
  console.timeEnd('merge')
}

runLocal().catch((e) => {
  throw e
})
