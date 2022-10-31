import {MdOutlinePayments, MdCancel} from "react-icons/md";
import {motion} from "framer-motion";
import {RouteProps} from "../components/useRoute";
import {useAppContext} from "../components/useAppContext";
import {useStoreValue} from "../components/store/useCreateStore";
import {data, Product} from "../data";
import invariant from "tiny-invariant";
import {ButtonTheme, white} from "./Theme";
import {useNavigate} from "../components/useNavigate";
import {Button} from "../components/page-components/Button";

import {AddRemoveButton} from "./Category";
import {useMemo} from "react";

export function useSubTotalCart() {
    const cartItems = useItemsInCart();
    const subTotal = useMemo(() => cartItems.reduce((total, ci) => {
        return total + (ci.total * parseFloat(ci.price));
    }, 0).toFixed(2),[cartItems]);
    return subTotal;
}

export function useItemsInCart() {
    const appContext = useAppContext();
    const cartItems = useStoreValue(appContext.store, (state) => {
        return state.shoppingCart.map(sc => {
            const item: Product | undefined = data.find(c => c.barcode === sc.barcode);
            invariant(item);
            return {
                ...sc,
                ...item
            }
        })
    }, []);
    return cartItems;
}

export default function Cart(props: RouteProps) {
    const navigate = useNavigate();
    const cartItems = useItemsInCart();
    const subTotal = useSubTotalCart();
    return <div style={{backgroundColor: 'rgba(0,0,0,0.4)', height: '100%', display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', justifyContent: 'center', padding: 10}}>
            <motion.div whileTap={{scale: 0.95}} onTap={() => window.history.back()}>
                <MdCancel fontSize={35} style={{color: 'rgba(255,255,255,0.8)'}}/>
            </motion.div>
        </div>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'radial-gradient(rgba(255,255,255,0.8),rgba(255,255,255,1))',
            height: '100%',
            overflow: 'auto',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20
        }}>
            <div style={{fontSize:16,fontWeight:'bold',color:'rgba(0,0,0,0.5)',marginBottom:10,paddingLeft:5}}>Your Items ({cartItems.length})</div>
            {cartItems.map(ci => {
                return <div key={ci.barcode} style={{
                    display: 'flex',
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                    padding: 5
                }}>
                    <div>
                        <img src={`/images/${ci.barcode}/THUMB/default.png`}
                              alt={'Barcode ' + ci.barcode} height={50}/>
                    </div>
                    <div style={{flexGrow:1}}>
                        <div style={{flexGrow: 1, fontSize: 14}}>{ci.category} {ci.name} </div>
                        <div style={{flexGrow: 1, fontSize: 14,fontWeight:'bold'}}>AED {ci.price}</div>
                        <div style={{fontSize: 12}}>{ci.unit} {ci.unitType} </div>
                    </div>
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <AddRemoveButton barcode={ci.barcode} size={'small'} key={`button-${ci.barcode}`}/>
                    </div>
                </div>
            })}
        </div>
        <div style={{
            backgroundColor: white,
            padding: 10,
            boxShadow: '0 5px 7px -5px rgba(0,0,0,0.5) inset',
            display: "flex",
        }}>
            <div style={{display:'flex',flexDirection:'column',flexGrow:1}}>
                <div style={{fontSize:12}}>Subtotal</div>
                <div style={{fontWeight:'bold',fontSize:18}}>AED {subTotal}</div>
            </div>
            <div>
            <Button title={'Proceed'} icon={MdOutlinePayments} theme={ButtonTheme.promoted}
                    onTap={() => navigate('shipping')}/>
            </div>
        </div>
    </div>
}