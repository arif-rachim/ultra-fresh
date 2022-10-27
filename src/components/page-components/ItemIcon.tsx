import {CSSProperties} from "react";
import {blueDarken, white} from "../../routes/Theme";
import {motion} from "framer-motion";

const itemStyleSheet: CSSProperties = {
    background: white,
    borderRadius: 10,
    margin: 5,
    padding: 0,
    boxShadow: '0 3px 5px -3px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
}

export function ItemIcon<T extends { barcode: string, name: string }>(props: { imageDimension: number, item: T, onTap: (item: T) => void, selected?: boolean }) {
    const {imageDimension, item, selected} = props;
    return <motion.div style={{...itemStyleSheet, width: imageDimension, height: imageDimension + 30}}
                       key={item.barcode} whileTap={{scale: 0.95}} whileHover={{scale: 1.05}}
                       animate={{background: selected ? blueDarken : white, color: selected ? white : blueDarken}}
                       onTap={() => props.onTap(item)}>
        <div style={{display: 'flex', flexDirection: 'column', padding: 5, alignItems: 'center'}}>
            <img src={`/images/${item.barcode}/THUMB/default.png`}
                 width={imageDimension - 20} alt={'Barcode ' + item.barcode}/>
            <div style={{fontSize: 12, textAlign: 'center'}}>
                {item.name}
            </div>
        </div>
    </motion.div>;
}