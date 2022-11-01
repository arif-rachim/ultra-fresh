import {useAppContext} from "../components/useAppContext";
import {data} from "../data";
import {useMemo} from "react";
import {motion} from "framer-motion";
import {useNavigate} from "../components/useNavigate";
import {RouteProps} from "../components/useRoute";
import {ItemIcon} from "../components/page-components/ItemIcon";
import {IoSearchCircleOutline} from "react-icons/io5";
import {Product} from "../components/AppState";
import {FooterNavigation} from "../components/page-components/FooterNavigation";


export function CategoryList(props: RouteProps) {
    const {store, appDimension} = useAppContext();
    const navigate = useNavigate();
    const imageDimension = Math.floor(appDimension.width / 3) - 10;

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
            <div style={{margin: '10px', fontWeight: 'bold', color: 'rgba(0,0,0,0.6)', paddingTop: 50}}>Shop by
                Category
            </div>
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
                                     onTap={(item) => navigate('product-with-category/' + item.name)}/>
                })}
            </div>
        </div>
        <div style={{
            boxSizing: 'border-box',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            position: 'absolute',
            top: 0,
            background: 'rgba(255,255,255,0.9)',
            width: appDimension.width,
            display: 'flex',
            paddingLeft: 5,
            paddingRight: 5
        }}>
            <div style={{display: 'flex', flexDirection: 'column', margin: 5}}>
                <div style={{fontSize: 20, color: 'rgba(0,0,0,0.6)', whiteSpace: 'nowrap'}}>Ultra Fresh</div>
                <div style={{fontSize: 12, color: 'rgba(0,0,0,0.6)', whiteSpace: 'nowrap'}}>by Marmum</div>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center', padding: 10}}>
                <div style={{
                    display: "flex",
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: 20,
                    paddingLeft: 10,
                    alignItems: 'center'
                }}>
                    <input placeholder={'What are you looking for ?'}
                           style={{fontSize: 16, border: 'rgba(0,0,0,0)', flexGrow: 1}}/>
                    <motion.div style={{marginBottom: -3}} whileTap={{scale: 0.95}}>
                        <IoSearchCircleOutline style={{fontSize: 26, color: 'rgba(0,0,0,0.5)'}}/>
                    </motion.div>
                </div>
            </div>
        </div>
    </div>
}