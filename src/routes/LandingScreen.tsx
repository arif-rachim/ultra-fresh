import {motion} from "framer-motion";
import {useNavigate} from "../components/useNavigate";

export function LandingScreen() {
    const navigate = useNavigate();
    return <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <motion.div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center'
        }} onTap={() => {
            navigate('home');
        }}>
            <div>
                <div style={{fontSize: 60}}>Ultra Fresh</div>
                <div>by Marmum</div>
            </div>
        </motion.div>
    </div>

}