# pwconf-merge

A cli tool that merge config slices with PipeWire config files.

## Install

```js
$ # Yarn
$ yarn global add pwconf-merge
$ # or NPM
$ npm install -g pwconf-merge
```

For Yarn, you might also need to add `$HOME/.yarn/bin` to `$PATH`.

## Usage

```
Usage: pwconf-merge [options]

Options:
  -V, --version               output the version number
  -s, --slice-dir <paths...>  path to config slice dir (default: ["/etc/pwconf-merge","/home/<user>/.config/pwconf-merge"])
  -d, --data-dir <path>       path to pipewire config data dir (default: "/usr/share/pipewire")
  -c, --conf-dir <path>       path to pipewire config dir (default: "/home/<user>/.config/pipewire")
  -h, --help                  display help for command
```

By default, `pwconf-merge` read config slices from `/etc/pwconf-merge` and `$XDG_CONFIG_HOME/pwconf-merge`, merging with pipewire configs in `/usr/share/pipewire`, then write configs merged into `$XDG_CONFIG_HOME/pipewire` (`/etc/pipewire` if running in root, whose uid is 0) from where `pipewire` read configs.

See [sample](sample/pwconf-merge) for example config slices.

By default, `pwconf-merge` set/override _property value_ if merging _objects_ and append all _array items_ into _array_ to be merged if merging _arrays_. You can use javascript to override the default merging behavior.

For example, to use module `libpipewire-module-rt` instead of `libpipewire-module-rtkit`, the default in `pipewire.conf`,
create a config slice in `<slice-dir>/pipewire.conf.d/use-module-rt.js` (change `pipewire.conf.d` to `conf.d` to match all configs) with content below.

```js
// newPWConf is a callback method which accept a merging function
newPWConf(
  // our custom merger
  // `config`: a javascript object originally read `/usr/share/pipewire`, might already be modified by other config slices
  // `name`: the config path relative to `/usr/share/pipewire`
  function (config, name) {
    // validate the value of `context.modules`
    if (Array.isArray(config['context.modules'])) {
      // iterate array items in `context.modules`
      for (const module of config['context.modules']) {
        // module is a reference to this nested object
        if (module.name === 'libpipewire-module-rtkit') {
          module.name = 'libpipewire-module-rt'
          // return our modified config
          return config
        }
      }
    }
    // nothing merges if falsy value is returned
  }
)
```
