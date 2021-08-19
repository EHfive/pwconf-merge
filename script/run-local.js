import path from 'path'
import { pwConfMerge } from '../lib/index.js'
import { __basedir } from '../lib/constants.js'

async function runLocal() {
  await pwConfMerge(
    path.join(__basedir, 'sample/pwconf-merge'),
    path.join(__basedir, 'sample/pipewire-conf'),
    path.join(__basedir, 'sample/pipewire-conf-data')
  )
}

runLocal().catch((e) => {
  throw e
})
