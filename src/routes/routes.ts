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
    'home': {
        component: CategoryList,
        footerComponent:FooterNavigation,
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
        },
        onHidingPrevElement: {
            left:'100%',
            transition: {
                bounce: 0
            }
        }
    },
    categories : {
        component: ProductListGroupedByCategory,
        footerComponent:FooterNavigation,
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
        },
        onHidingPrevElement: {
            left:'100%',
            transition: {
                bounce: 0
            }
        }
    },
    'product-detail/$productId': {
        component: ProductDetail,
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
        onHidingPrevElement: {
            left:'100%',
            transition: {
                bounce: 0
            }
        }
    },
    'cart': {
        component: Cart,
        footerComponent:FooterNavigation,
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
        onHidingPrevElement: {
            left:'100%',
            transition: {
                bounce: 0
            }
        }
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
        },
        onHidingPrevElement: {
            left:'100%',
            transition: {
                bounce: 0
            }
        }
    },
    'product-with-category/$category': {
        component: ProductWithCategory,
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
        onHidingPrevElement: {
            left:'100%',
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
        },
        onHidingPrevElement: {
            left:'100%',
            transition: {
                bounce: 0
            }
        }
    },
    'history':{
        component : History,
        footerComponent:FooterNavigation,
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
        onHidingPrevElement: {
            left:'100%',
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
        },
        onHidingPrevElement: {
            left:'100%',
            transition: {
                bounce: 0
            }
        }
    },
    'user-account' : {
        component : UserAccount,
        footerComponent:FooterNavigation,
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
        onHidingPrevElement: {
            left:'100%',
            transition: {
                bounce: 0
            }
        }
    },
    'reward' : {
        component : Reward,
        footerComponent:FooterNavigation,
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
        onHidingPrevElement: {
            left:'100%',
            transition: {
                bounce: 0
            }
        }
    }

}