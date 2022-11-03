import {IconType} from "react-icons";
import {CSSProperties} from "react";
import {motion} from "framer-motion";
export function TitleIcon(props: { title: string, icon: IconType, iconSize: number, style?: CSSProperties,onTap?:() => void }) {
    let {icon, title, style, iconSize,onTap} = props;
    iconSize = iconSize ?? 27;
    const Icon = icon;
    return <motion.div whileTap={{scale:0.95}} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color:'rgba(0,0,0,0.6)',
        fontSize:12,
        margin:5,
        ...style
    }} onTap={onTap}>
        <motion.div style={{fontSize: iconSize,marginBottom:-5}} >
            <Icon/>
        </motion.div>
        {title}
    </motion.div>
}