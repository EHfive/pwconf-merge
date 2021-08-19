newPWConf((config, name) => {
  if (
    config['session.modules'] &&
    Array.isArray(config['session.modules']['with-pulseaudio'])
  ) {
    config['session.modules']['with-pulseaudio'] = config['session.modules'][
      'with-pulseaudio'
    ].filter((key) => ['bluez5-autoswitch', 'logind'].indexOf(key) == -1)

    return config
  }
})
