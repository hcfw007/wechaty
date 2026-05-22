#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test, sinon } from 'tstest'

import { PuppetMock } from 'wechaty-puppet-mock'

import { WechatyBuilder }   from '../wechaty-builder.js'
import type { WechatyPlugin } from '../plugin.js'

/**
 * Auto-discover and install plugins that a puppet bundles via its `plugins`
 * field. This lets a single npm puppet package ship the standard puppet plus
 * additional WechatyPlugins (e.g. clients for non-standard gRPC endpoints).
 */
test('puppet.plugins are auto-installed by wechaty during init()', async t => {
  const pluginFn: WechatyPlugin = sinon.spy(_bot => () => {})
  Object.defineProperty(pluginFn, 'name', { value: 'BundledTestPlugin' })

  class TestPuppet extends PuppetMock {

    public plugins: WechatyPlugin[] = [pluginFn]

  }

  const wechaty = WechatyBuilder.build({
    name:   'plugins-from-puppet',
    puppet: new TestPuppet(),
  })

  await wechaty.start()
  t.ok((pluginFn as sinon.SinonSpy).calledOnce, 'plugin function should be called exactly once during init')
  t.equal((pluginFn as sinon.SinonSpy).firstCall.args[0], wechaty, 'plugin function should receive the wechaty instance')
  await wechaty.stop()
})

test('puppet without plugins field still works', async t => {
  const wechaty = WechatyBuilder.build({
    name:   'no-bundled-plugins',
    puppet: new PuppetMock(),
  })
  await wechaty.start()
  t.pass('starting a wechaty with a plain puppet should not throw')
  await wechaty.stop()
})

test('puppet.plugins = [] (empty array) is a no-op', async t => {
  class EmptyPluginsPuppet extends PuppetMock {

    public plugins: WechatyPlugin[] = []

  }
  const wechaty = WechatyBuilder.build({
    name:   'empty-bundled-plugins',
    puppet: new EmptyPluginsPuppet(),
  })
  await wechaty.start()
  t.pass('an empty plugins array should be safely ignored')
  await wechaty.stop()
})
