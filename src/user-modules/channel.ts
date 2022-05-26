/**
 *   Wechaty Chatbot SDK - https://github.com/wechaty/wechaty
 *
 *   @copyright 2016 Huan LI (李卓桓) <https://github.com/huan>, and
 *                   Wechaty Contributors <https://github.com/wechaty>.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import type * as PUPPET from 'wechaty-puppet'

import type { Constructor } from 'clone-class'
import { log } from '../config.js'

import { validationMixin } from '../user-mixins/validation.js'

import {
  wechatifyMixinBase,
} from '../user-mixins/wechatify.js'

class ChannelMixin extends wechatifyMixinBase() {

  /**
   *
   * Create
   *
   */
  static async create (): Promise<ChannelInterface> {
    log.verbose('Channel', 'create()')

    // TODO: get appid and username from wechat
    const payload: PUPPET.payloads.Channel = {
      avatar: 'todo',
      coverUrl: 'todo',
      desc: 'todo',
      extras: 'todo',
      feedType: 4,
      nickname: 'todo',
      thumbUrl: 'todo',
      url: 'todo',
    }

    return new this(payload)
  }

  /*
   * @hideconstructor
   */
  constructor (
    public readonly payload: PUPPET.payloads.Channel,
  ) {
    super()
    log.verbose('Channel', 'constructor()')
  }

  avatar (): undefined | string {
    return this.payload.avatar
  }

  coverUrl (): undefined | string {
    return this.payload.coverUrl
  }

  desc (): undefined | string {
    return this.payload.desc
  }

  extras (): undefined | string {
    return this.payload.extras
  }

  feedType (): undefined | number {
    return this.payload.feedType
  }

  nickname (): undefined | string {
    return this.payload.nickname
  }

  thumbUrl (): undefined | string {
    return this.payload.thumbUrl
  }

  url (): undefined | string {
    return this.payload.url
  }

}

class ChannelImpl extends validationMixin(ChannelMixin)<ChannelInterface>() { }
interface ChannelInterface extends ChannelImpl { }

type ChannelConstructor = Constructor<
  ChannelInterface,
  typeof ChannelImpl
>

export type {
  ChannelConstructor,
  ChannelInterface,
}
export {
  ChannelImpl,
}
