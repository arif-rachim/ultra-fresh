import {useNavigate} from "../useNavigate";
import {useAppContext} from "../useAppContext";
import {useStoreValue} from "../store/useCreateStore";
import {motion} from "framer-motion";
import {ButtonTheme, theme, white} from "../../routes/Theme";
import {IoCartOutline, IoHomeOutline, IoListCircleOutline, IoPersonOutline} from "react-icons/io5";
import {GiCrown} from "react-icons/gi";
import {AiOutlineOrderedList} from "react-icons/ai";

export function FooterNavigation() {
    const navigate = useNavigate();
    const {store, appDimension} = useAppContext();
    const itemsInCart = useStoreValue(store, state => {
        return state.shoppingCart.reduce((acc, item) => {
            return acc + item.total
        }, 0);
    });
    return <div style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        position: 'absolute',
        bottom: 0,
        width: appDimension.width,
        boxSizing: 'border-box',
        padding: 5,
        background: 'rgba(255,255,255,0.9)',
        borderTop: '1px solid rgba(0,0,0,0.05)',
    }}>
        <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}
                    animate={{color: itemsInCart > 0 ? theme[ButtonTheme.promoted] : theme[ButtonTheme.default]}}
                    style={{position: 'relative', alignItems: 'center', display: 'flex', flexDirection: 'column'}}
                    onTap={() => navigate('home')}>
            <IoHomeOutline style={{fontSize: 28}}/>
            <div style={{fontSize: 12}}>Home</div>
        </motion.div>
        <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}
                    animate={{color: itemsInCart > 0 ? theme[ButtonTheme.promoted] : theme[ButtonTheme.default]}}
                    style={{position: 'relative', alignItems: 'center', display: 'flex', flexDirection: 'column'}}
                    onTap={() => navigate('categories')}>
            <IoListCircleOutline style={{fontSize: 28}}/>
            <div style={{fontSize: 12}}>Categories</div>
        </motion.div>
        <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}
                    animate={{color: itemsInCart > 0 ? theme[ButtonTheme.promoted] : theme[ButtonTheme.default]}}
                    style={{position: 'relative', alignItems: 'center', display: 'flex', flexDirection: 'column'}}
                    onTap={() => navigate('reward')}>
            <GiCrown style={{fontSize: 28}}/>
            <div style={{fontSize: 12}}>Reward</div>
        </motion.div>
        <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}
                    animate={{color: itemsInCart > 0 ? theme[ButtonTheme.promoted] : theme[ButtonTheme.default]}}
                    style={{position: 'relative', alignItems: 'center', display: 'flex', flexDirection: 'column'}}
                    onTap={() => navigate('user-account')}>
            <IoPersonOutline style={{fontSize: 28}}/>
            <div style={{fontSize: 12}}>Account</div>
        </motion.div>

        <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}
                    animate={{color: itemsInCart > 0 ? theme[ButtonTheme.promoted] : theme[ButtonTheme.default]}}
                    style={{position: 'relative', alignItems: 'center', display: 'flex', flexDirection: 'column'}}
                    onTap={() => {
                        navigate('history');
                    }}>
            <AiOutlineOrderedList style={{fontSize: 28}}/>
            <div style={{fontSize: 12}}>Order Status</div>
        </motion.div>

        <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}
                    animate={{color: itemsInCart > 0 ? theme[ButtonTheme.promoted] : theme[ButtonTheme.default]}}
                    style={{position: 'relative', alignItems: 'center', display: 'flex', flexDirection: 'column'}}
                    onTap={() => {
                        navigate('cart');
                    }}>
            <IoCartOutline style={{fontSize: 28}}/>
            <div style={{fontSize: 12}}>Cart</div>
            {itemsInCart > 0 &&
                <div style={{
                    position: 'absolute',
                    top: -3,
                    right: -3,
                    backgroundColor: theme[ButtonTheme.danger],
                    color: white,
                    borderRadius: 25,
                    fontSize: 12,
                    width: 16,
                    height: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {itemsInCart}
                </div>
            }
        </motion.div>
    </div>
}