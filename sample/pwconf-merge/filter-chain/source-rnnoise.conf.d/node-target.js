newPWConf((config, name) => {
  if (Array.isArray(config['context.modules'])) {
    for (const module of config['context.modules']) {
      if (module.name === 'libpipewire-module-rtkit') {
        module.name = 'libpipewire-module-rt'
      } else if (module.name === 'libpipewire-module-filter-chain') {
        module.args['capture.props']['node.target'] =
          'alsa_input.usb-Samson_Technologies_Samson_C01U_Pro_Mic-00.mono-fallback'
      }
    }
    return config
  }
})
