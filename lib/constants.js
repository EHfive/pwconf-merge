import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export const __basedir = path.resolve(__dirname, '../')

export const CONFIG_DIR = '/etc/pwconf-merge'

export const PIPEWIRE_CONFDATADIR = '/usr/share/pipewire'
export const PIPEWIRE_CONFIG_DIR = '/etc/pipewire'
