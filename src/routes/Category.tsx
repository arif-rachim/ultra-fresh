import {RouteProps} from "../components/useRoute";
import {useEffect, useMemo} from "react";
import {data, Product} from "../data";
import {ItemIcon} from "../components/page-components/ItemIcon";
import {useAppContext} from "../components/useAppContext";
import {Header} from "../components/page-components/Header";
import {Store, useCreateStore, useStoreValue} from "../components/store/useCreateStore";
import {AnimatePresence, motion} from "framer-motion";
import {blue, blueDarken, white} from "./Theme";
import {MdAddCircle, MdCancel} from "react-icons/md";

function UnitSelector(props: { unit: { unitType: string; unit: string, barcode: string }, selectedStore: Store<any>, selected?: boolean }) {
    const {selectedStore, unit, selected} = props;
    return <motion.div layout whileTap={{scale: 0.95}}
                       initial={{opacity: 0, top: -10}}
                       animate={{
                           opacity: 1,
                           top: 0,
                           background: selected ? blueDarken : white,
                           color: selected ? white : blueDarken
                       }}
                       exit={{opacity: 0, top: -10}}
                       key={unit.unit + unit.unitType} style={{

        margin: 5,
        padding: 5,
        borderRadius: 5,
        fontSize: 12
    }} onTap={() => {
        selectedStore.dispatch({payload: unit, type: 'UNIT_SELECTED'})
    }}>{unit.unit} {unit.unitType}</motion.div>;
}

export default function Category(props: RouteProps) {
    const category = props.params.get('category');
    const groups = useMemo(() => {
        return data.filter(p => p.category === category).reduce((result: { name: string, category: string, barcode: string }[], product: Product, index: number) => {
            if (result.findIndex(r => r.name === product.name && r.category === product.category) < 0) {
                result.push({
                    category: product.category,
                    name: product.name,
                    barcode: product.barcode
                });
            }
            return result;
        }, [])
    }, [category]);

    const {appDimension, store} = useAppContext();
    let totalBox = groups.length < 4 ? 4 : groups.length;
    const imageDimension = Math.floor(appDimension.width / totalBox) - 10;
    const selectedStore = useCreateStore((action) => state => {
        if (action.type === 'GROUP_SELECTED') {
            if (JSON.stringify(state.selectedGroup) !== JSON.stringify(action.payload)) {
                return {...state, selectedGroup: action.payload}
            }
        }
        if (action.type === 'UNIT_SELECTED') {
            if (JSON.stringify(state.selectedUnit) !== JSON.stringify(action.payload)) {
                return {...state, selectedUnit: action.payload}
            }
        }
        return state;
    }, {
        selectedGroup: groups[0],
        selectedUnit: {unit: '', unitType: '', barcode: ''}
    });
    const {selectedGroup, selectedUnit} = useStoreValue(selectedStore, p => p);
    useEffect(() => {
        if (groups.length > 0) {
            const group = groups[0];
            selectedStore.dispatch({type: 'GROUP_SELECTED', payload: group})
        }
    }, [groups])

    const units = useMemo(() => {
        return data.filter(d => d.category === selectedGroup.category && d.name === selectedGroup.name).map(p => ({
            unit: p.unit,
            unitType: p.unitType,
            barcode: p.barcode
        }));
    }, [selectedGroup]);

    useEffect(() => {
        if (units.length > 0) {
            const unit = units[0];
            selectedStore.dispatch({type: 'UNIT_SELECTED', payload: unit});
        }
    }, [units])
    const selectedProduct = data.find(d => d.barcode === selectedUnit.barcode);
    const productId = selectedProduct?.barcode;
    const totalInCart = useStoreValue(store, (value) => {
        return value.shoppingCart.find(s => s.barcode === productId)?.total
    }, [productId]) ?? 0;
    return <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <Header title={category ?? ''}/>
        <div style={{
            display: 'flex',
            flexWrap: "wrap",
            alignContent: "space-between",
            justifyContent: 'center',
        }}>
            {groups.map(group => {
                return <ItemIcon imageDimension={imageDimension}
                                 item={{name: group.name, barcode: group.barcode}}
                                 key={group.barcode} selected={selectedGroup.name === group.name} onTap={() => {
                    selectedStore.dispatch({type: 'GROUP_SELECTED', payload: group})
                }}/>
            })}
        </div>
        <div style={{
            display: 'flex',
            overflow: 'hidden',
            flexWrap: 'wrap',
            justifyContent: 'center',
            height: 35,
            maxHeight: 35,
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            borderTop: '1px solid rgba(0,0,0,0.1)',
            backgroundColor: 'rgba(255,255,255,0.3)',
            flexShrink: 0
        }}>
            <AnimatePresence>
                {units.map(unit => {
                    return <UnitSelector unit={unit} selectedStore={selectedStore} key={unit.unit + unit.unitType}
                                         selected={selectedUnit.unit === unit.unit && selectedUnit.unitType === unit.unitType}/>
                })}
            </AnimatePresence>
        </div>

        <div style={{
            height: '100%',
            background: `radial-gradient(rgba(255,255,255,1) 0%,rgba(250,250,250,1) 50%,rgba(200,200,200,1))`,
            padding: 10
        }}>
            <img src={`/images/${selectedProduct?.barcode}/400/default.png`}
                 width={appDimension.width - 20} alt={'Barcode ' + selectedProduct?.barcode}/>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <AnimatePresence>
                    <motion.div layoutId={'addRemoveContainer'} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: 50,
                        background: 'rgba(255,255,255,0.8)'
                    }}>

                        {totalInCart > 0 &&
                            <motion.div layoutId={'cancelButton'} style={{
                                color: blue,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 56

                            }} whileTap={{scale: 0.95}} onTap={() => {
                                store.dispatch({type: 'remove_from_cart', payload: {barcode: selectedProduct?.barcode}})
                            }} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                                <MdCancel/>
                            </motion.div>
                        }
                        {totalInCart > 0 &&
                            <motion.div layoutId={'totalInCartLabel'} style={{
                                width: '100%',
                                fontSize: 46,
                                marginLeft: 20,
                                marginRight: 20,
                                minWidth: 30
                            }} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                                {totalInCart}
                            </motion.div>
                        }
                        <motion.div layoutId={'addButton'} style={{

                            color: blue,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 56
                        }} whileTap={{scale: 0.95}} onTap={() => {
                            store.dispatch({type: 'add_to_cart', payload: {barcode: selectedProduct?.barcode}})
                        }}>
                            <MdAddCircle/>
                        </motion.div>

                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    </div>
}