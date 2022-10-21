import {useAppContext} from "../components/useAppContext";
import {data} from "../data";
import {CSSProperties} from "react";
import {motion} from "framer-motion";
import {useNavigate} from "../components/useNavigate";
import {RouteProps} from "../components/useRoute";

const itemStyleSheet: CSSProperties = {
    background: 'radial-gradient(rgba(255,255,255,1),rgba(0,0,0,0.1))',
    borderRadius: 0,
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
    margin: 'auto',
    background:'white'
};


function Home(props:RouteProps) {
    const appContext = useAppContext();
    const navigate = useNavigate();
    const imageDimension = Math.floor(appContext.appDimension.width / 3) - 10
    return <div style={containerStyle}>
        {data.map(d => {
            return <motion.div style={{...itemStyleSheet, width: imageDimension, height: imageDimension + 30}}
                               key={d.barcode} whileTap={{scale: 0.95}} whileHover={{scale: 1.05}}
                               onTap={() => navigate(`/product/${d.barcode}`)}>
                <motion.div style={{display: 'flex', flexDirection: 'column', padding: 5, alignItems: 'center'}}>
                    <motion.img src={`/images/${d.barcode}/THUMB/default.png`}
                                width={imageDimension - 20}/>
                    <div style={{fontSize: 12, textAlign: 'center'}}>
                        {d.name}
                    </div>
                </motion.div>
            </motion.div>
        })}
    </div>
}

export {Home};