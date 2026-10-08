import { cart } from '@/store/cart.module'
import { createPiniaFromVuexModule } from './createPiniaFromVuexModule'

export const useCartStore = createPiniaFromVuexModule('cart', cart)
