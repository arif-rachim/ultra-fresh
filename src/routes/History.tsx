import {Header} from "../components/page-components/Header";
import {RouteProps} from "../components/useRoute";
import {useAppContext} from "../components/useAppContext";
import {white} from "./Theme";
import {motion} from "framer-motion";
import {useNavigate} from "../components/useNavigate";
import {useEffect, useState} from "react";
import {supabase} from "../components/supabase";
import {DbOrder} from "../components/model/DbOrder";

export default function History(props: RouteProps) {
    const {user} = useAppContext();
    const [orders,setOrders] = useState<DbOrder[]>([]);
    useEffect(() => {
        (async () => {
            const {data} = await supabase.from('orders').select('*').eq('created_by',user?.phone);
            setOrders(data??[]);
        })();
    },[user?.phone])
    const navigate = useNavigate();
    const isEmpty = orders.length === 0;
    useEffect(() => {
        const channelName = `new_order_created`;
        (async () => {
            await supabase.channel(channelName).on('postgres_changes',{
                event : 'INSERT',
                schema : 'public',
                table:'orders',
                filter : `created_by=eq.${user?.phone}`
            },(payload) => {
                const newData:any = payload.new;
                setOrders(old => ([...old,newData]));
            }).subscribe();
        })();
        return () => {
            (async () => {
                console.log('UnSubscribe channel ',channelName);
                await supabase.channel(channelName).unsubscribe();
            })()

        }

    },[user?.phone]);

    return <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <Header title={'Order Status'}/>
        {isEmpty &&
            <div style={{margin: 20}}>
                <div style={{fontSize: 36, color: 'rgba(0,0,0,0.6)', marginBottom: 10}}>
                    Its Empty
                </div>
                <div>
                    The reason why it is empty is because you have not yet placed any orders. After placing an order,
                    you can return to this page at any time to view details regarding that order as well as its history.
                </div>
            </div>
        }
        <div style={{height:'100%',overflow:'auto',paddingBottom:52,display:'flex',flexDirection:'column'}}>
        <div style={{display: 'flex', flexDirection: 'column', paddingTop: 10}}>
            {orders.map((order) => {
                return <motion.div key={order.id} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    margin: '10px 20px',
                    background: white,
                    border: '1px solid rgba(0,0,0,0.05)',
                    padding: 20
                }} whileTap={{scale: 0.98}} onTap={() => navigate(`order-detail/${order.id}`)}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        borderBottom: '1px solid rgba(0,0,0,0.1)',
                        paddingBottom: 10
                    }}>
                        <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                            <div style={{fontSize: 12}}>Code : {order.id}</div>
                            <div style={{fontSize: 16}}>{formatDateTime(order?.created_at)}</div>
                        </div>
                        <div style={{fontWeight: 'bold'}}>
                            AED {order.sub_total}
                        </div>
                    </div>
                    <div style={{fontWeight: 'bold', fontSize: 14, marginTop: 10}}>
                        {order.order_status}
                    </div>
                </motion.div>
            })}
        </div>
        </div>
    </div>
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const padZero = (value: number) => {
    return value < 10 ? '0' + value : value
}

export function formatDateTime(dateString?: string) {
    if(dateString === undefined || dateString === null){
        return '';
    }
    const date = new Date(dateString);
    return `${padZero(date.getDate())} ${MONTHS[date.getMonth()]} ${date.getFullYear()} at ${padZero(date.getHours())}:${padZero(date.getMinutes())}`
}
