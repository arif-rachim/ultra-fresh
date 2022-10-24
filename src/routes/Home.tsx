import {useAppContext} from "../components/useAppContext";
import {data, Product} from "../data";
import {CSSProperties} from "react";
import {motion} from "framer-motion";
import {useNavigate} from "../components/useNavigate";
import {RouteProps} from "../components/useRoute";
import {MdShoppingCart} from "react-icons/md";
import {useStoreValue} from "../components/store/useCreateStore";


const itemStyleSheet: CSSProperties = {
    background: 'radial-gradient(rgba(255,255,255,1)  ,rgba(255,255,255,1) )',
    borderRadius: 10,
    margin: 5,
    padding: 0,
    boxShadow: '0 3px 5px -3px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
}

const containerStyle: CSSProperties = {
    display: 'flex',
    flexWrap: "wrap",
    alignContent: "space-between",
    margin: 'auto'
};


function ItemIcon(props: { imageDimension: number, product: Product }) {
    const navigate = useNavigate();
    const {imageDimension, product: d} = props;
    const totalInCart = useStoreValue(useAppContext().store,(state) => state.shoppingCart.find(s => s.barcode === d.barcode)?.total || 0)
    return <motion.div style={{...itemStyleSheet, width: imageDimension, height: imageDimension + 30}}
                       key={d.barcode} whileTap={{scale: 0.95}} whileHover={{scale: 1.05}}
                       onTap={() => navigate(`/product/${d.barcode}`)}>
        <div style={{display: 'flex', flexDirection: 'column', padding: 5, alignItems: 'center'}}>
            <img src={`/images/${d.barcode}/THUMB/default.png`}
                 width={imageDimension - 20} alt={'Barcode '+d.barcode}/>
            <div style={{fontSize: 12, textAlign: 'center'}}>
                {d.name}
            </div>
            {totalInCart > 0 &&
                <div style={{
                    position: 'absolute',
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    top: -5,
                    right: -5,
                    backgroundColor: 'darkred',
                    color: 'white',
                    borderRadius: 20,
                    fontSize:12,
                    width: 25,
                    height: 25,
                }}>
                    {totalInCart}
                </div>
            }
        </div>
    </motion.div>;
}

function Home(props: RouteProps) {
    const {store, appDimension} = useAppContext();

    const navigate = useNavigate();
    const imageDimension = Math.floor(appDimension.width / 3) - 10;
    const itemsInCart = useStoreValue(store, state => {
        return state.shoppingCart.reduce((acc, item) => {
            return acc + item.total
        }, 0);
    });

    return <div style={{display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto'}}>
        <div style={{display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto'}}>
            <div style={containerStyle}>
                {data.map(d => {
                    return <ItemIcon imageDimension={imageDimension} product={d} key={d.barcode}/>
                })}
            </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', padding: 5}}>
            <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}
                        animate={{color: itemsInCart > 0 ? '#0045B4' : 'rgba(0,0,0,0.5)'}}
                        style={{position: 'relative'}} onTap={() => {
                navigate('cart');
            }}>
                <MdShoppingCart style={{fontSize: 35}}/>
                {itemsInCart > 0 &&
                    <div style={{
                        position: 'absolute',
                        top: -3,
                        right: 0,
                        backgroundColor: 'red',
                        color: 'white',
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
    </div>
}

export {Home};