import {useAppContext} from "../components/useAppContext";
import {data, Product} from "../data";
import {useMemo} from "react";
import {motion} from "framer-motion";
import {useNavigate} from "../components/useNavigate";
import {RouteProps} from "../components/useRoute";
import {MdShoppingCart} from "react-icons/md";
import {useStoreValue} from "../components/store/useCreateStore";
import {ButtonTheme, theme, white} from "./Theme";
import {ItemIcon} from "../components/page-components/ItemIcon";


function Home(props: RouteProps) {
    const {store, appDimension} = useAppContext();
    const navigate = useNavigate();
    const imageDimension = Math.floor(appDimension.width / 3) - 10;
    const itemsInCart = useStoreValue(store, state => {
        return state.shoppingCart.reduce((acc, item) => {
            return acc + item.total
        }, 0);
    });
    const categories = useMemo(() => {
        const categories = data.reduce((categories: { id: string, label: string, barcode: string }[], product: Product, index: number, source: Product[]) => {
            if (categories.findIndex(c => c.id === product.category) < 0) {
                categories.push({id: product.category, label: product.category, barcode: product.barcode});
            }
            return categories;
        }, []);
        return Array.from(categories);
    }, []);
    return <div
        style={{display: 'flex', position: 'relative', flexDirection: 'column', height: '100%', overflow: 'auto'}}>
        <div style={{display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto'}}>
            <div style={{
                display: 'flex',
                flexWrap: "wrap",
                alignContent: "space-between",
                margin: 'auto',
                paddingBottom: 50
            }}>
                {categories.map(d => {
                    return <ItemIcon imageDimension={imageDimension}
                                     item={{name: d.label, barcode: d.barcode}} key={d.barcode}
                                     onTap={(item) => navigate('category/' + item.name)}/>
                })}
            </div>
        </div>
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'absolute',
            bottom: 0,
            width: appDimension.width,
            boxSizing: 'border-box',
            padding: 5,
            background: 'rgba(255,255,255,0.9)',
            borderTop: '1px solid rgba(0,0,0,0.05)'
        }}>
            <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}
                        animate={{color: itemsInCart > 0 ? theme[ButtonTheme.promoted] : theme[ButtonTheme.default]}}
                        style={{position: 'relative'}} onTap={() => {
                navigate('cart');
            }}>
                <MdShoppingCart style={{fontSize: 35}}/>
                {itemsInCart > 0 &&
                    <div style={{
                        position: 'absolute',
                        top: -3,
                        right: 0,
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
    </div>
}

export {Home};