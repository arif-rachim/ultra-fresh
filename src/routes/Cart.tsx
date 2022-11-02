import {MdOutlinePayments} from "react-icons/md";
import {motion} from "framer-motion";
import {RouteProps} from "../components/useRoute";
import {useAppContext} from "../components/useAppContext";
import {useStoreValue} from "../components/store/useCreateStore";
import {data} from "../data";
import invariant from "tiny-invariant";
import {ButtonTheme, white} from "./Theme";
import {useNavigate} from "../components/useNavigate";
import {Button} from "../components/page-components/Button";

import {AddRemoveButton} from "./ProductWithCategory";
import {useMemo} from "react";
import {Product} from "../components/AppState";
import {IoClose} from "react-icons/io5";

export function useSubTotalCart() {
    const cartItems = useItemsInCart();
    const subTotal = useMemo(() => cartItems.reduce((total, ci) => {
        return total + (ci.total * parseFloat(ci.price));
    }, 0).toFixed(2), [cartItems]);
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
    const isEmpty = cartItems.length === 0;
    return <div style={{
        background:'rgba(255,255,255,0.2)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto'
    }}>
        <div style={{display: 'flex', flexDirection: 'row-reverse', margin: 10}}>
            <motion.div style={{fontSize: 36, color: 'rgba(0,0,0,0.6)'}} whileTap={{scale: 0.95}}
                        onTap={() => window.history.back()}>
                <IoClose/>
            </motion.div>
        </div>
        {isEmpty &&
            <div style={{margin: 20, marginBottom: 30}}>
                <div style={{fontSize: 36, color: 'rgba(0,0,0,0.6)', marginBottom: 10}}>
                    Its Empty
                </div>
                <div>
                    Your shopping cart does not currently contain any items. You are free to begin adding products, and
                    at any time you wish, you can return to this page in order to examine the rundown of the products
                    that you have decided to buy.
                </div>
            </div>
        }
        <div style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: 'rgba(0,0,0,0.5)',
            paddingBottom: 10,
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            paddingLeft: 20
        }}>Your Items ({cartItems.length})
        </div>
        <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'auto'}}>

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
                    <div style={{flexGrow: 1}}>
                        <div style={{flexGrow: 1, fontSize: 14}}>{ci.category} {ci.name} </div>
                        <div style={{flexGrow: 1, fontSize: 14, fontWeight: 'bold'}}>AED {ci.price}</div>
                        <div style={{fontSize: 12}}>{ci.unit} {ci.unitType} </div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', marginRight: 10}}>
                        <AddRemoveButton barcode={ci.barcode} size={'small'} key={`button-${ci.barcode}`}/>
                    </div>
                </div>
            })}
            <div style={{display: 'flex', padding: '10px 20px', borderBottom: '1px solid rgba(0,0,0,0.1)'}}>
                <div style={{flexGrow: 1}}></div>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{fontSize: 12}}>Subtotal</div>
                    <div style={{fontWeight: 'bold', fontSize: 18}}>AED {subTotal}</div>
                </div>
            </div>
        </div>
        <div style={{
            background:'rgba(255,255,255,0.5)',
            padding: '10px 20px',
            borderTop: '1px solid rgba(0,0,0,0.05)',
            display: "flex",
            marginBottom: 52
        }}>
            <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                <div style={{fontSize: 12}}>Subtotal</div>
                <div style={{fontWeight: 'bold', fontSize: 18}}>AED {subTotal}</div>
            </div>
            <div>
                <Button title={'Proceed'} icon={MdOutlinePayments} theme={ButtonTheme.promoted}
                        onTap={() => navigate('shipping')}/>
            </div>
        </div>
    </div>
}