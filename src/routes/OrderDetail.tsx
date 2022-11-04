import {Header} from "../components/page-components/Header";
import {RouteProps} from "../components/useRoute";
import {formatDateTime} from "./order-detail-panels/utils/formatDateTime";
import {useEffect, useState} from "react";
import {supabase} from "../components/supabase";
import {DbOrder} from "../components/model/DbOrder";
import {DbOrderLineItems} from "../components/model/DbOrderLineItems";
import {SkeletonBox} from "../components/page-components/SkeletonBox";
import {DbOrderConfirmation} from "../components/model/DbOrderConfirmation";
import {produce} from "immer";
import {TitleValue} from "./order-detail-panels/utils/TitleValue";
import {OrderDetailFooter} from "./order-detail-panels/utils/OrderDetailFooter";
import {ConfirmPanel} from "./order-detail-panels/ConfirmPanel";
import {OrderPanel} from "./order-detail-panels/OrderPanel";
import {DispatchPanel} from "./order-detail-panels/DispatchPanel";
import {ReceivedPanel} from "./order-detail-panels/ReceivedPanel";
import {formatOrderNo} from "./order-detail-panels/utils/formatOrderNo";
import {DbDeliveryNote} from "../components/model/DbDeliveryNote";

export default function OrderDetail(props: RouteProps) {
    const orderId = props.params.get('id');
    const [order, setOrder] = useState<DbOrder | null>(null);
    const [orderLineItems, setOrderLineItems] = useState<DbOrderLineItems[]>([]);
    const [selectedPage, setSelectedPage] = useState('order');
    const [confirmations, setConfirmations] = useState<DbOrderConfirmation[]>([]);
    const [deliveryNotes,setDeliveryNotes] = useState<DbDeliveryNote[]>([])
    useEffect(() => {
        setOrder(null);
        setOrderLineItems([]);
        const listenWhenOrderConfirmationChanges = 'listen-when-confirmation-change';
        const listenWhenOrderChanges = 'listen-when-order-change';
        (async () => {
            const {data: order} = await supabase.from('orders').select('*').eq('id', orderId).single();
            const {data: lineItems} = await supabase.from('order_line_items').select('*').eq('order(id)', order.id);
            const {data: orderConfirmations} = await supabase.from('order_confirmations').select('*').eq('order(id)', order?.id);

            const {data: deliveryNotes} = await supabase.from('order_delivery_notes').select('*').filter('order_confirmation','in',`(${orderConfirmations?.map(oc => oc.id).join(',')})`);

            await supabase.channel(listenWhenOrderConfirmationChanges).on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'order_confirmations',
                filter: `order=eq.${order.id}`
            }, (payload) => {
                const newVal: any = payload.new;
                const oldVal: any = payload.old;
                const eventType = payload.eventType;
                debugger;
                if (eventType === 'DELETE') {
                    setConfirmations(old => {
                        return old.filter(o => o.id !== oldVal.id)
                    });
                } else if (eventType === 'INSERT') {
                    setConfirmations(old => [newVal, ...old]);
                } else if (eventType === 'UPDATE') {
                    setConfirmations(produce(draft => {
                        const index = draft.findIndex(d => d.id === newVal.id);
                        draft.splice(index, 1, newVal);
                    }));
                } else {
                    debugger;
                }
            }).subscribe();

            await supabase.channel(listenWhenOrderChanges).on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'orders',
                filter: `id=eq.${order.id}`
            }, (payload) => {
                const newVal: any = payload.new;
                const oldVal: any = payload.old;
                const eventType = payload.eventType;
                debugger;
                if (eventType === 'UPDATE') {
                    setOrder(newVal);
                } else {
                    debugger;
                }
            }).subscribe();


            setOrder(order);
            setOrderLineItems(lineItems ?? []);
            setConfirmations(orderConfirmations ?? []);
            setDeliveryNotes(deliveryNotes??[]);
            return () => {
                (async () => {
                    await supabase.channel(listenWhenOrderConfirmationChanges).unsubscribe()
                    await supabase.channel(listenWhenOrderChanges).unsubscribe();
                })();
            }
        })();
    }, [orderId]);

    return <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <Header title={<SkeletonBox skeletonVisible={order === null}
                                    style={{flexGrow: 1}}>{`Order : ${formatOrderNo(order)}`}</SkeletonBox>}/>
        <div style={{padding: '10px 20px', borderBottom: '1px solid rgba(0,0,0,0.1)'}}>
            <div style={{display: 'flex'}}>
                <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                    <TitleValue title={'Order Date'} value={order && formatDateTime(order?.created_at)}/>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', width: 120}}>
                    <TitleValue title={'Order Status'} value={order?.order_status}/>
                </div>
            </div>
            <TitleValue title={'Sub total'} value={order && `AED ${order?.sub_total}`} width={'100%'}/>
        </div>
        <div style={{
            height: '100%',
            display: 'flex',
            overflow: 'auto',
            flexDirection: 'column'
        }}>
            {selectedPage === 'order' &&
                <OrderPanel order={order} orderLineItems={orderLineItems}/>}
            {selectedPage === 'confirm' &&
                <ConfirmPanel order={order} orderLineItems={orderLineItems} confirmations={confirmations}/>}
            {selectedPage === 'dispatch' &&
                <DispatchPanel order={order} orderLineItems={orderLineItems} confirmations={confirmations} deliveryNotes={deliveryNotes}/>}
            {selectedPage === 'received' && <ReceivedPanel/>}
        </div>
        <div style={{display: 'flex', flexDirection: 'column', position: 'absolute', bottom: 0, width: '100%'}}>
            <OrderDetailFooter value={selectedPage} onChange={setSelectedPage}/>
        </div>
    </div>
}


