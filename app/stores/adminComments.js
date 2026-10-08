import { adminComments } from '@/store/adminComments.module'
import { createPiniaFromVuexModule } from './createPiniaFromVuexModule'

export const useAdminCommentsStore = createPiniaFromVuexModule('adminComments', adminComments)
