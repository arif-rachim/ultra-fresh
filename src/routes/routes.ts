import {CategoryList} from "./CategoryList";
import {ProductDetail} from "./ProductDetail";
import {Routes} from "../components/useRoute";
import Cart from "./Cart";
import {ShippingAddress} from "./ShippingAddress";
import ProductWithCategory from "./ProductWithCategory";
import Payment from "./Payment";
import History from "./History";
import OrderDetail from "./OrderDetail";
import {ProductListGroupedByCategory} from "./ProductListGroupedByCategory";
import {FooterNavigation} from "../components/page-components/FooterNavigation";
import {UserAccount} from "./UserAccount";
import {Reward} from "./Reward";

export const routes: Routes = {
    'categories': {
        component: CategoryList,
        footerComponent:FooterNavigation,
        animateIn: {
            left: 0,
            transition: {
                bounce: 0
            }
        },
        animateOut: {
            left: '-100%',
            transition: {
                bounce: 0
            }
        },
        initial: {
            left:'-100%'
        }
    },
    'home' : {
        component: ProductListGroupedByCategory,
        footerComponent:FooterNavigation,
        animateIn: {
            left: 0,
            transition: {
                bounce: 0
            }
        },
        animateOut: {
            left: '-100%',
            transition: {
                bounce: 0
            }
        },
        initial: {
            left:'-100%'
        }
    },
    'product-detail/$productId': {
        component: ProductDetail,
        animateIn: {
            right: 0,
            transition: {
                bounce: 0
            }
        },
        animateOut: {
            right: '-100%',
            transition: {
                bounce: 0
            }
        },
        initial: {
            right:'-100%'
        }
    },
    'cart': {
        component: Cart,
        footerComponent:FooterNavigation,
        animateOut: {
            bottom: '-100%',
            transition: {
                bounce: 0
            }
        },
        animateIn: {
            bottom: 0,
            transition: {
                bounce: 0
            }
        },
        initial: {
            bottom:'-100%'
        }
    },
    'shipping': {
        component: ShippingAddress,
        animateIn: {
            right: 0,
            transition: {
                bounce: 0
            }
        },
        animateOut: {
            right: '-100%',
            transition: {
                bounce: 0
            }
        },
        initial: {
            right:'-100%'
        }
    },
    'product-with-category/$category/$group': {
        component: ProductWithCategory,
        animateIn: {
            right: 0,
            transition: {
                bounce: 0
            }
        },
        animateOut: {
            right: '-100%',
            transition: {
                bounce: 0
            }
        },
        initial: {
            right:'-100%'
        }
    },
    'payment':{
        component : Payment,
        animateIn: {
            right: 0,
            transition: {
                bounce: 0
            }
        },
        animateOut: {
            right: '-100%',
            transition: {
                bounce: 0
            }
        },
        initial: {
            right:'-100%'
        }
    },
    'history':{
        component : History,
        footerComponent:FooterNavigation,
        animateIn: {
            right: 0,
            transition: {
                bounce: 0
            }
        },
        animateOut: {
            right: '-100%',
            transition: {
                bounce: 0
            }
        },
        initial: {
            right:'-100%'
        }
    },
    'order-detail/$id':{
        component : OrderDetail,
        animateIn: {
            right: 0,
            transition: {
                bounce: 0
            }
        },
        animateOut: {
            right: '-100%',
            transition: {
                bounce: 0
            }
        },
        initial: {
            right:'-100%'
        }
    },
    'user-account' : {
        component : UserAccount,
        footerComponent:FooterNavigation,
        animateIn: {
            right: 0,
            transition: {
                bounce: 0
            }
        },
        animateOut: {
            right: '-100%',
            transition: {
                bounce: 0
            }
        },
        initial: {
            right:'-100%'
        }
    },
    'reward' : {
        component : Reward,
        footerComponent:FooterNavigation,
        animateIn: {
            right: 0,
            transition: {
                bounce: 0
            }
        },
        animateOut: {
            right: '-100%',
            transition: {
                bounce: 0
            }
        },
        initial: {
            right:'-100%'
        }
    }

}