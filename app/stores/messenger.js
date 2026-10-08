import { messenger } from '@/store/messenger.module'
import { createPiniaFromVuexModule } from './createPiniaFromVuexModule'

export const useMessengerStore = createPiniaFromVuexModule('messenger', messenger)
