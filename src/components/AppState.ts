import {Action} from "./store/useCreateStore";
import {produce} from "immer";

interface CartItem {
    barcode: string,
    total: number
}

interface Address {
    firstName: string,
    lastName: string,
    addressLine1: string,
    addressLine2: string,
    city: string,
    state: string,
    zipCode: string,
    country: string,
    email: string,
    phone: string,
    note: string
}

export interface AppState {
    shoppingCart: CartItem[];
    shippingAddress: Address
}

export const storeReducer = (action: Action) => produce((oldState: AppState) => {

    if (action.type === 'add_to_cart') {
        const itemIndex = oldState.shoppingCart.findIndex(s => s.barcode === action.payload.barcode);
        if (itemIndex >= 0) {
            oldState.shoppingCart[itemIndex].total += 1;
        } else {
            oldState.shoppingCart.push({
                barcode: action.payload.barcode,
                total: 1
            })
        }
    }
    if (action.type === 'remove_from_cart') {
        const itemIndex = oldState.shoppingCart.findIndex(s => s.barcode === action.payload.barcode);
        if (itemIndex >= 0) {
            oldState.shoppingCart[itemIndex].total -= 1;
            const total = oldState.shoppingCart[itemIndex].total;
            if (total === 0) {
                oldState.shoppingCart.splice(itemIndex, 1);
            }
        }
    }
});