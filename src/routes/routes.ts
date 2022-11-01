import {Home} from "./Home";
import Product from "./Product";
import {Routes} from "../components/useRoute";
import Cart from "./Cart";
import {ShippingAddress} from "./ShippingAddress";
import Category from "./Category";
import Payment from "./Payment";
import History from "./History";
import OrderDetail from "./OrderDetail";

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
    'cart': {
        component: Cart,
        onHidden: {
            bottom: '-100%',
            transition: {
                bounce: 0
            }
        },
        onVisible: {
            bottom: 0,
            transition: {
                bounce: 0
            }
        },
    },
    'shipping': {
        component: ShippingAddress,
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
        }
    },
    'category/$category': {
        component: Category,
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
        }
    },
    'payment':{
        component : Payment,
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
        }
    },
    'history':{
        component : History,
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
        }
    },
    'order-detail/$id':{
        component : OrderDetail,
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
        }
    }

}