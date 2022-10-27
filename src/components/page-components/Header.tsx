import {motion} from "framer-motion";
import {MdArrowBackIos} from "react-icons/md";
import {white} from "../../routes/Theme";

export function Header(props: { title: string }) {
    const {title} = props;
    return <div style={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        background: white,
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10
    }}>
        <motion.div onTap={() => window.history.back()}
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}>
            <MdArrowBackIos style={{fontSize: 30}}/>
        </motion.div>
        <div style={{fontSize: 26, lineHeight: 1, marginBottom: 5}}>{title}</div>
    </div>;
}