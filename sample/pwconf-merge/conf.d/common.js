newPWConf((config, name) => {
  if (
    !name.startsWith('filter-chain') &&
    Array.isArray(config['context.modules'])
  ) {
    for (const module of config['context.modules']) {
      if (module.name === 'libpipewire-module-rtkit') {
        module.name = 'libpipewire-module-rt'
        return config
      }
    }
  } else if (config['stream.properties']) {
    config['stream.properties']['resample.quality'] = 7
    return config
  }
})
