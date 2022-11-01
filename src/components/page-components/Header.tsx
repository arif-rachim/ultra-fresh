import {motion} from "framer-motion";
import {white} from "../../routes/Theme";
import {IoChevronBackOutline} from "react-icons/io5";
import {PropsWithChildren} from "react";

export function Header(props: PropsWithChildren<{ title: string }>) {
    const {title} = props;
    return <div style={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        background: white,
        paddingLeft: 10,
        padding: 5,
        paddingTop: 7,
        paddingRight: 20,
        color: 'rgba(0,0,0,0.6)'
    }}>
        <motion.div onTap={() => window.history.back()}
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}>
            <IoChevronBackOutline style={{fontSize: 26}}/>
        </motion.div>
        <div style={{fontSize: 18, fontWeight: 'bold', lineHeight: 1, marginBottom: 2, marginLeft: 10}}>{title}</div>
        {props.children}
    </div>;
}