import {useAppContext} from "../components/useAppContext";
import {RouteProps} from "../components/useRoute";
import {MdAddShoppingCart, MdArrowBackIos, MdRemoveShoppingCart} from "react-icons/md";
import {data} from "../data";
import {motion} from "framer-motion";
import {theme} from "./Theme";
import {useStoreValue} from "../components/store/useCreateStore";



export default function Product(props: RouteProps) {
    const {appDimension, store} = useAppContext();
    const {params} = props;

    const productId = params.get('productId');
    const product = data.find(p => p.barcode === productId);
   // const isFocused = useFocusListener(props.path);

    const total = useStoreValue(store, (value) => {
        return value.shoppingCart.find(s => s.barcode === productId)?.total
    });
    if (!product) {
        return false;
    }

    return <div style={{backgroundColor: 'white', height: '100%', width: appDimension.width}}>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            padding: 5,
            paddingLeft: 10,
            paddingRight: 10
        }}>
            <motion.div onTap={() => window.history.back()}
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        style={{height: 26}}>
                <MdArrowBackIos style={{fontSize: 26}}/>
            </motion.div>
            <div style={{fontSize: 26, lineHeight: 1}}>{product.name}</div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{
                padding: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'radial-gradient(rgba(255,255,255,1) 70%,rgba(0,0,0,0.1))',
                borderBottom: '1px solid rgba(0,0,0,0.05)'
            }}>
                <img src={`/images/${productId}/400/1.png`} alt="" width={appDimension.width}
                     height={appDimension.width}/>
            </div>
            <div>Total In Cart {total}</div>
            <div style={{display: 'flex', flexDirection: 'column', padding: '0px 20px'}}>
                <div style={{fontSize: 36}}>
                    {product.category} {product.name}
                </div>
                <div style={{fontSize: 26}}>
                    {product.unit} {product.unitType}
                </div>
                <div style={{fontSize: 26}}>
                    {product.price} AED
                </div>
                <div style={{fontSize: 20}}>
                    Shelf life : {product.shelfLife} {product.shelfLifeType}
                </div>
            </div>

                <motion.button style={{
                    fontSize: 26,
                    border: '1px solid rgba(0,0,0,0.03)',
                    borderRadius: 30,
                    padding: '5px 20px',
                    background: theme.promotedBackground,
                    color: 'white',
                    margin: '5px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                               whileTap={{scale: 0.98}}
                               onTap={() => {
                                   store.dispatch({payload: {barcode: product.barcode}, type: 'add_to_cart'})
                               }}
                >
                    <div>Add To Cart</div>
                    <div style={{marginBottom: -5, marginLeft: 20}}><MdAddShoppingCart/></div>
                </motion.button>
            <motion.button style={{
                fontSize: 26,
                border: '1px solid rgba(0,0,0,0.03)',
                borderRadius: 30,
                padding: '5px 20px',
                background: theme.dangerBackground,
                color: 'white',
                margin: '0px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
                           whileTap={{scale: 0.98}}
                           onTap={() => {
                               store.dispatch({payload: {barcode: product.barcode}, type: 'remove_from_cart'})
                           }}
            >
                <div>Remove from Cart</div>
                <div style={{marginBottom: -5, marginLeft: 20}}><MdRemoveShoppingCart/></div>
            </motion.button>
        </div>
    </div>
}
