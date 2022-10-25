import {Home} from "./Home";
import Product from "./Product";
import {Routes} from "../components/useRoute";
import Cart from "./Cart";
import {Shipping} from "./Shipping";

export const routes: Routes = {
    'home': {
        component: Home,
        onVisible: {
            left: 0,
            transition: {
                bounce: 0
            }
        },
        onHidden: {
            left: '-100%',
            transition: {
                bounce: 0
            }

        }
    },
    'product/$productId': {
        component: Product,
        onVisible: {
            right: 0,
            transition: {
                bounce: 0
            }
        },
        onHidden: {
            right: '-100%',
            transition: {
                bounce: 0
            }
        },
    },
    'cart' : {
        component : Cart,
        onHidden : {
            bottom : '-100%',
            transition: {
                bounce: 0
            }
        },
        onVisible : {
            bottom : 0,
            transition: {
                bounce: 0
            }
        },
    },
    'shipping':{
        component : Shipping,
        onVisible : {
            right : 0
        },
        onHidden : {
            right : '-100%'
        }
    }
}