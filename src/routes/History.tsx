import {Header} from "../components/page-components/Header";
import {RouteProps} from "../components/useRoute";
import {useStoreValue} from "../components/store/useCreateStore";
import {useAppContext} from "../components/useAppContext";
import {white} from "./Theme";
import {motion} from "framer-motion";
import {useNavigate} from "../components/useNavigate";

export default function History(props: RouteProps) {
    const {store} = useAppContext();
    const orders = useStoreValue(store, s => s.orders);
    const navigate = useNavigate();
    return <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <Header title={'History'}/>
        <div style={{display: 'flex', flexDirection: 'column'}}>
            {orders.map((order) => {
                return <motion.div key={order.id} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    margin: '5px 10px',
                    background: white,
                    border: '1px solid rgba(0,0,0,0.05)',
                    padding: 20
                }} whileTap={{scale:0.98}} onTap={() => navigate(`order-detail/${order.id}`)}>
                    <div style={{display: 'flex',alignItems:'flex-end',borderBottom:'1px solid rgba(0,0,0,0.1)',paddingBottom:10}}>
                        <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                            <div style={{fontSize: 12}}>Code : {order.id}</div>
                            <div style={{fontSize: 16}}>{formatDateTime(order.date)}</div>
                        </div>
                        <div style={{fontWeight:'bold'}}>
                            AED {order.subTotal}
                        </div>
                    </div>
                    <div style={{fontWeight:'bold',fontSize:14,marginTop:10}}>
                        {order.status}
                    </div>
                </motion.div>
            })}
        </div>
    </div>
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const padZero = (value: number) => {
    return value < 10 ? '0' + value : value
}

export function formatDateTime(dateString: string) {
    const date = new Date(dateString);
    return `${padZero(date.getDate())} ${MONTHS[date.getMonth()]} ${date.getFullYear()} at ${padZero(date.getHours())}:${padZero(date.getMinutes())}`
}
