import {Header} from "../components/page-components/Header";
import {RouteProps} from "../components/useRoute";
import {formatDateTime} from "./History";
import {useEffect, useState} from "react";
import {supabase} from "../components/supabase";
import {DbOrder} from "../components/model/DbOrder";
import {DbOrderLineItems} from "../components/model/DbOrderLineItems";
import {SkeletonBox} from "../components/page-components/SkeletonBox";

export default function OrderDetail(props: RouteProps) {
    const orderId = props.params.get('id');
    const [order,setOrder] = useState<DbOrder|null>(null);
    const [orderLineItems,setOrderLineItems] = useState<DbOrderLineItems[]>([]);
    useEffect(() => {
        setOrder(null);
        setOrderLineItems([]);
        (async () => {
            const {data:order} = await supabase.from('orders').select('*').eq('id',orderId).single();
            const {data:lineItems} = await supabase.from('order_line_items').select('*').eq('order(id)',order.id);
            setOrder(order)
            setOrderLineItems(lineItems??[]);
        })();
    },[orderId]);

    return <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <Header title={<SkeletonBox skeletonVisible={order === null} style={{flexGrow:1}}>{`Order Detail ${order?.id}`}</SkeletonBox>}/>
        <div style={{padding: 20, borderBottom: '1px solid rgba(0,0,0,0.1)'}}>
            <div style={{display: 'flex', alignItems: 'flex-end', marginBottom: 5}}>
                <div style={{fontSize: 14, marginRight: 10}}>Transaction Date :</div>
                <SkeletonBox skeletonVisible={order === null} style={{flexGrow:1}}>
                    {formatDateTime(order?.created_at)}
                </SkeletonBox>
            </div>
            <div style={{display: 'flex', alignItems: 'flex-end', marginBottom: 5}}>
                <div style={{fontSize: 14, marginRight: 10}}>Order Status :</div>
                <SkeletonBox skeletonVisible={order === null} style={{flexGrow:1}}>
                    {order?.order_status}
                </SkeletonBox>

            </div>
            <div style={{display: 'flex', alignItems: 'flex-end', marginBottom: 5}}>
                <div style={{fontSize: 14, marginRight: 10}}>Sub total :</div>
                <SkeletonBox skeletonVisible={order === null} style={{flexGrow:1}}>
                    AED {order?.sub_total}
                </SkeletonBox>
            </div>
        </div>
        <div style={{
            padding: '0 20px 20px 20px',
            height: '100%',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <SkeletonBox skeletonVisible={order === null} style={{height:100,marginTop:10}}>
            <div style={{marginTop: 10}}>
                {orderLineItems.map((item, index) => {
                    return <div key={item.barcode}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: '10px 0px',
                                    borderBottom: '1px solid rgba(0,0,0,0.1)'
                                }}>
                        <div style={{display: 'flex'}}>
                            <div style={{
                                marginRight: 10,
                                fontSize: 13,
                                width: 10,
                                whiteSpace: 'nowrap',
                                textAlign: 'right',
                                color: 'rgba(0,0,0,0.5)'
                            }}>{index + 1}</div>
                            <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                                <div
                                    style={{fontSize: 14}}>{item.category} {item.name} {item.unit} {item.unit_type}</div>
                                <div style={{display: "flex"}}>
                                    <div style={{flexGrow: 1}}>{item.requested_amount} x AED {item.price}</div>
                                    <div>AED {(item.requested_amount * item.price).toFixed(2)}</div>
                                </div>

                            </div>
                        </div>
                    </div>
                })}
            </div>
            </SkeletonBox>
            </div>
    </div>
}