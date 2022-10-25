import {MdAddShoppingCart, MdCancel} from "react-icons/md";
import {motion} from "framer-motion";
import {RouteProps} from "../components/useRoute";
import {useAppContext} from "../components/useAppContext";
import {useStoreValue} from "../components/store/useCreateStore";
import {data, Product} from "../data";
import invariant from "tiny-invariant";
import {theme} from "./Theme";
import {useFocusListener} from "../components/RouterPageContainer";
import {useNavigate} from "../components/useNavigate";

export default function Cart(props:RouteProps) {
    const appContext = useAppContext();
    const isFocused = useFocusListener(props.path);
    const cartItems = useStoreValue(appContext.store,(state) => state.shoppingCart);
    const navigate = useNavigate();
    return <div style={{backgroundColor: 'rgba(0,0,0,0.4)', height: '100%', display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', justifyContent: 'center', padding: 10}}>
            <motion.div whileTap={{scale: 0.95}} onTap={() => window.history.back()}>
                <MdCancel fontSize={35} style={{color: 'rgba(255,255,255,0.8)'}}/>
            </motion.div>
        </div>
        <div style={{
            display: 'flex',
            flexDirection:'column',
            background: 'radial-gradient(rgba(255,255,255,0.8),rgba(255,255,255,1))',
            height: '100%',
            overflow:'auto',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding:20
        }}>
            {cartItems.map(ci => {
                const item:Product|undefined = data.find(c => c.barcode === ci.barcode);
                invariant(item);
                return <div key={ci.barcode} style={{display:'flex',alignItems:'flex-end',borderBottom:'1px solid rgba(0,0,0,0.1)',padding:5}}>
                    <div style={{flexGrow:1,fontSize:14}}>{item.category} {item.name} </div>
                    <div style={{width:100,textAlign:'right',fontSize:12}}>{item.unit} {item.unitType} </div>
                    <div style={{width:50,textAlign:'right',fontSize:12}}>{item.price}</div>
                    <div style={{marginLeft:10,fontSize:12}}>x</div>
                    <div style={{width:20,textAlign:'center',fontSize:12}}>{ci.total}</div>
                </div>
            })}
        </div>
        <div style={{backgroundColor:'white',padding:10,boxShadow:'0 5px 7px -5px rgba(0,0,0,0.5) inset'}}>
            <motion.button style={{

                width: '100%',
                fontSize: 23,
                border: '1px solid rgba(0,0,0,0.03)',
                borderRadius: 30,
                padding: '5px 20px',
                background: theme.promotedBackground,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
                           whileTap={{scale: 0.98}}
                           onTap={() => {
                            navigate('deliveryAddress');
                           }}>
                <div>Checkout</div>
                <div style={{marginBottom: -5, marginLeft: 10}}><MdAddShoppingCart/></div>
            </motion.button>
        </div>
    </div>
}