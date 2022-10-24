import {useAppContext} from "../components/useAppContext";
import {RouteProps} from "../components/useRoute";
import {MdAddShoppingCart, MdArrowBackIos, MdRemoveShoppingCart} from "react-icons/md";
import {data} from "../data";
import {AnimatePresence, motion} from "framer-motion";
import {theme} from "./Theme";
import {useStoreValue} from "../components/store/useCreateStore";
import {useEffect, useState} from "react";


function TotalItemsInCartLogo(props: { totalInCart?: number }) {
    const {totalInCart} = props;
    const [scaleUp, setScaleUp] = useState(false);
    useEffect(() => {
        setScaleUp(true);
        setTimeout(() => {
            setScaleUp(false);
        }, 100);
    }, [totalInCart])
    return <motion.div layoutId={'totalItemCartLogo'} animate={{scale: scaleUp ? 1.05 : 1}} style={{
        fontSize: 66,
        background: 'rgba(0,0,0,0.1)',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        marginRight: 20,
        minWidth: 100

    }}>
        {props.totalInCart}
    </motion.div>;
}

export default function Product(props: RouteProps) {
    const {appDimension, store} = useAppContext();
    const {params} = props;

    const productId = params.get('productId');
    const product = data.find(p => p.barcode === productId);


    const totalInCart = useStoreValue(store, (value) => {
        return value.shoppingCart.find(s => s.barcode === productId)?.total
    });

    if (!product) {
        return <div>No Product PRODUCT ID {productId}</div>;
    }

    return <div style={{
        backgroundColor: 'white',
        height: '100%',
        width: appDimension.width,
        display: 'flex',
        flexDirection: 'column'
    }}>
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
                        whileTap={{scale: 0.95}}>
                <MdArrowBackIos style={{fontSize: 36}}/>
            </motion.div>
            <div style={{fontSize: 36, lineHeight: 1, marginBottom: 5}}>{product.name}</div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'auto'}}>
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

            <div style={{display: 'flex', flexDirection: 'column', padding: '0px 20px'}}>
                <div style={{fontSize: 36}}>
                    {product.category} {product.name}
                </div>
                <div style={{display: 'flex'}}>
                    <div style={{fontSize: 26}}>
                        {product.unit} {product.unitType}
                    </div>
                    <div style={{flexGrow: 1}}/>
                    <div style={{fontSize: 26}}>
                        {product.price} AED
                    </div>
                </div>
                <div style={{fontSize: 20}}>
                    Shelf life : {product.shelfLife} {product.shelfLifeType}
                </div>
            </div>
            <AnimatePresence>
                <div style={{display: 'flex', padding: 20}}>
                    {totalInCart &&
                        <TotalItemsInCartLogo totalInCart={totalInCart}/>
                    }
                    <motion.div layoutId={'addButton'} style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                        <motion.button style={{
                            marginBottom: 10,
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
                                           store.dispatch({payload: {barcode: product.barcode}, type: 'add_to_cart'})
                                       }}>
                            <div>Add</div>
                            <div style={{marginBottom: -5, marginLeft: 10}}><MdAddShoppingCart/></div>
                        </motion.button>
                        {totalInCart &&
                            <motion.button layoutId={'removeButton'} style={{
                                fontSize: 18,
                                border: '1px solid rgba(0,0,0,0.03)',
                                borderRadius: 30,
                                padding: '5px 20px',
                                background: theme.dangerBackground,
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                                           whileTap={{scale: 0.98}}
                                           onTap={() => {
                                               store.dispatch({
                                                   payload: {barcode: product.barcode},
                                                   type: 'remove_from_cart'
                                               })
                                           }}>
                                <div>Remove</div>
                                <div style={{marginBottom: -5, marginLeft: 10}}><MdRemoveShoppingCart/></div>
                            </motion.button>
                        }
                    </motion.div>
                </div>
            </AnimatePresence>
        </div>
    </div>
}
