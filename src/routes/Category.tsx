import {RouteProps} from "../components/useRoute";
import {CSSProperties, useEffect, useMemo} from "react";
import {data, Product} from "../data";
import {useAppContext} from "../components/useAppContext";
import {Header} from "../components/page-components/Header";
import {Store, useCreateStore, useStoreValue} from "../components/store/useCreateStore";
import {AnimatePresence, motion} from "framer-motion";
import {blue, blueDarken, white, yellow} from "./Theme";
import {MdAddCircle, MdCancel} from "react-icons/md";


function UnitSelector(props: { unit: { unitType: string; unit: string, barcode: string }, selectedStore: Store<any>, selected?: boolean }) {
    const {selectedStore, unit, selected} = props;
    return <motion.div layout whileTap={{scale: 0.95}}
                       initial={{opacity: 0, top: -10}}
                       animate={{
                           opacity: 1,
                           top: 0,
                           background: selected ? yellow : white,
                           color: selected ? blueDarken : blueDarken
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
    let totalBox = groups.length < 6 ? 6 : groups.length;
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
        selectedUnit: {unit: '', unitType: '', barcode: '',image:1}
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
    const iconsWidth = appDimension.width / 4;
    return <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <Header title={category ?? ''}/>
        <div style={{
            display: 'flex',
            flexWrap: "wrap",
            alignContent: "space-between",
            justifyContent: 'center'
        }}>
            {groups.map(group => {
                return <CategoryIconSelector imageDimension={imageDimension}
                                             item={{name: group.name, barcode: group.barcode}}
                                             key={group.barcode} selected={selectedGroup.name === group.name}
                                             onTap={() => {
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
            borderTop: '1px solid rgba(0,0,0,0.2)',
            backgroundColor: blueDarken,
            flexShrink: 0,
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
            padding: 10,
            boxShadow: '0 7px 10px -3px rgba(0,0,0,0.2) inset',
        }}>
            <img src={`/images/${selectedProduct?.barcode}/400/default.png`}
                 width={appDimension.width - 20} alt={'Barcode ' + selectedProduct?.barcode}/>
            <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center',position:'absolute',bottom:0,paddingBottom:10}}>
                <AnimatePresence>
                    <div style={{display: 'flex'}}>
                        <div style={{
                            background: 'radial-gradient(rgba(255,255,255,0.9),rgba(0,0,0,0.1))',
                            boxShadow:'0 0 3px 1px rgba(0,0,0,0.1) inset',
                            borderRadius: iconsWidth,
                            padding: 10,
                            height: iconsWidth - 20,
                            width: iconsWidth - 20,
                            margin: 10,
                            boxSizing: 'border-box',
                            display: 'flex'
                        }}>
                            <motion.img src={`/images/${selectedProduct?.barcode}/THUMB/1.png`}
                                        height={iconsWidth - 40}
                                        alt={'Barcode ' + selectedProduct?.barcode} whileTap={{scale: 0.95}}
                                        whileHover={{scale: 1.05}}/>
                        </div>
                        <div style={{
                            background: 'rgba(255,255,255,0.9)',
                            borderRadius: iconsWidth,
                            padding: 10,
                            height: iconsWidth - 20,
                            width: iconsWidth - 20,
                            margin: 10,
                            boxSizing: 'border-box',
                            display: 'flex'
                        }}>
                            <motion.img src={`/images/${selectedProduct?.barcode}/THUMB/2.png`}
                                        height={iconsWidth - 40}
                                        alt={'Barcode ' + selectedProduct?.barcode} whileTap={{scale: 0.95}}
                                        whileHover={{scale: 1.05}}/>
                        </div>
                        <div style={{
                            background: 'rgba(255,255,255,0.9)',
                            borderRadius: iconsWidth,
                            padding: 10,
                            height: iconsWidth - 20,
                            width: iconsWidth - 20,
                            margin: 10,
                            boxSizing: 'border-box',
                            display: 'flex'
                        }}>
                            <motion.img src={`/images/${selectedProduct?.barcode}/THUMB/3.png`}
                                        height={iconsWidth - 40}
                                        alt={'Barcode ' + selectedProduct?.barcode} whileTap={{scale: 0.95}}
                                        whileHover={{scale: 1.05}}/>
                        </div>
                        <div style={{
                            background: 'rgba(255,255,255,0.9)',
                            borderRadius: iconsWidth,
                            padding: 10,
                            height: iconsWidth - 20,
                            width: iconsWidth - 20,
                            margin: 10,
                            boxSizing: 'border-box',
                            display: 'flex'
                        }}>
                            <motion.img src={`/images/${selectedProduct?.barcode}/THUMB/4.png`}
                                        height={iconsWidth - 40}
                                        alt={'Barcode ' + selectedProduct?.barcode} whileTap={{scale: 0.95}}
                                        whileHover={{scale: 1.05}}/>
                        </div>

                    </div>
                    <motion.div layoutId={'addRemoveContainer'} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: 50,
                        background: 'rgba(255,255,255,0.8)',
                        position:'relative'
                    }} >

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


const itemStyleSheet: CSSProperties = {
    background: white,
    borderRadius: 10,
    margin: 5,
    marginBottom: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    padding: 0,
    display: 'flex',
    flexDirection:'column',
    alignItems: 'center',
    position: 'relative',
    border: '1px solid rgba(0,0,0,0.1)',
    boxSizing: 'border-box'
}


function CategoryIconSelector<T extends { barcode: string, name: string }>(props: { imageDimension: number, item: T, onTap: (item: T) => void, selected?: boolean }) {
    const {imageDimension, item, selected} = props;
    return <motion.div style={{...itemStyleSheet, width: imageDimension, height: imageDimension + 10}}
                       key={item.barcode}
                       animate={{background: selected ? blueDarken : white, color: selected ? white : blueDarken}}
                       onTap={() => props.onTap(item)}>
            <motion.img src={`/images/${item.barcode}/THUMB/default.png`}
                        style={{marginTop:5}}
                        width={imageDimension - 20} alt={'Barcode ' + item.barcode} whileTap={{scale: 0.95}}
                        whileHover={{scale: 1.05}}/>
            <div style={{fontSize: 10, textAlign: 'center',textOverflow:'ellipsis',position:'absolute',bottom:0,height:25,display:'flex',alignItems:'center',justifyContent:'center'}}>
                {item.name}
            </div>

        {selected &&
            <div style={{background: blueDarken, position: 'absolute', bottom: -2, width: '100%', height: 3}}/>
        }
    </motion.div>;
}