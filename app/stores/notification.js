import { notification } from '@/store/notification.module'
import { createPiniaFromVuexModule } from './createPiniaFromVuexModule'

export const useNotificationStore = createPiniaFromVuexModule('notification', notification)
