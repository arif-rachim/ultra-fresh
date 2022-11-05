import {CSSProperties} from "react";
import {blueDarken, white} from "../../routes/Theme";
import {motion} from "framer-motion";
import {Image} from "./Image";

const itemStyleSheet: CSSProperties = {
    margin: 5,
    marginTop: 0,
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
}

export function ItemIcon<T extends { barcode: string, name: string }>(props: { imageDimension: number, item: T, onTap: (item: T) => void, selected?: boolean }) {
    const {imageDimension, item, selected} = props;
    return <motion.div style={{...itemStyleSheet, width: imageDimension, height: imageDimension + 30}}
                       key={item.barcode} whileTap={{scale: 0.95}} whileHover={{scale: 1.05}}
                       animate={{
                           background: selected ? blueDarken : 'rgba(255,255,255,0.4)',
                           color: selected ? white : blueDarken
                       }}
                       onTap={() => props.onTap(item)}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{
                borderRadius: 5,
                padding: 10,
                boxShadow: '0 0px 5px 0 rgba(0,0,0,0.03)',
                border: '1px solid rgba(0,0,0,0.05)'
            }}>
                <Image src={`/images/${item.barcode}/THUMB/default.png`}
                       width={imageDimension - 20} height={imageDimension-20} alt={'Barcode ' + item.barcode}/>
            </div>
            <div style={{fontSize: 12, textAlign: 'center', marginTop: 5}}>
                {item.name}
            </div>
        </div>
    </motion.div>;
}