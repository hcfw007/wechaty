import type { EventEmitter }  from 'events'

import type { Constructor }           from 'clone-class'
import type {
  WechatyMixinProtectedProperty,
}                                     from '../wechaty-mixins/mod.js'
import type { WechatyEventListeners } from '../schemas/mod.js'
import { validationMixin }            from '../user-mixins/mod.js'

import type {
  WechatySkeletonProtectedProperty,
}                                     from './wechaty-skeleton.js'
import {
  WechatyBase,
  WechatyBaseProtectedProperty,
}                                     from './wechaty-base.js'

/**
 * Huan(202111): this is for solving the circyle dependency problem
 *
 *  Construct a `WechatyImpl` based the `WechatyImplBase` with `validationMixin`
 *
 */
class WechatyImplBase extends validationMixin(WechatyBase)<WechatyImplInterface>() {}

/**
 * Plugin extension surface for Wechaty.
 * Third-party plugins may augment this interface to add methods directly on the
 * public `Wechaty` type without forking.
 *
 *   declare module 'wechaty/impls' {
 *     interface WechatyImplPluginExtensions {
 *       translate(text: string, targetLang: string): Promise<string>
 *     }
 *   }
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface WechatyImplPluginExtensions {}
interface WechatyImplInterface extends WechatyImplBase, WechatyImplPluginExtensions {}

class WechatyImpl extends validationMixin(WechatyImplBase)<WechatyInterface>() {}

/**
 * ^ The above code will make a ready-to-use class: `WechatyImpl`
 *  without any cyclic dependency problem.
 */

type AllProtectedProperty =
  | keyof EventEmitter  // Huan(202110): remove all EventEmitter first, and added typed event emitter later: or will get error
  | WechatyMixinProtectedProperty
  | WechatyBaseProtectedProperty
  | WechatySkeletonProtectedProperty
  | `_${string}`// remove all property from interface which is start with `_`

/**
 * Huan(202111):
 * `on`/`off`/`once` must use TypedEventEmitter<WechatyEventListeners> instead of WechatyImpl
 *    or will run into error: cyclic dependency?
 */
interface WechatyEventEmitter {
  on:   <E extends keyof WechatyEventListeners>(event: E, listener: WechatyEventListeners[E]) => WechatyInterface
  off:  <E extends keyof WechatyEventListeners>(event: E, listener: WechatyEventListeners[E]) => WechatyInterface
  once: <E extends keyof WechatyEventListeners>(event: E, listener: WechatyEventListeners[E]) => WechatyInterface
}

type WechatyInterface = Omit<WechatyImplInterface, AllProtectedProperty>
  & WechatyEventEmitter

type WechatyConstructor = Constructor<
  WechatyInterface,
  typeof WechatyImpl
>

export  {
  type WechatyInterface,
  type WechatyConstructor,
  type AllProtectedProperty,
  type WechatyImplPluginExtensions,
  WechatyImpl,
}
