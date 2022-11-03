import {Header} from "../components/page-components/Header";
import {RouteProps} from "../components/useRoute";
import {formatDateTime} from "./History";
import {useEffect, useState} from "react";
import {supabase} from "../components/supabase";
import {DbOrder} from "../components/model/DbOrder";
import {DbOrderLineItems} from "../components/model/DbOrderLineItems";
import {SkeletonBox} from "../components/page-components/SkeletonBox";
import {TitleIcon} from "../components/page-components/TitleIcon";
import {IoBasket, IoBasketOutline, IoHome, IoHomeOutline} from "react-icons/io5";
import {BsPatchCheck, BsPatchCheckFill, BsTruck} from "react-icons/bs";
import {FaTruck} from "react-icons/fa";
import {blueDarken} from "./Theme";
import {Input} from "../components/page-components/Input";
import {Button} from "../components/page-components/Button";

function OrderPanel(props: { order: DbOrder | null, orderLineItems: DbOrderLineItems[] }) {
    const {order, orderLineItems} = props;
    return <div style={{
        padding: '0 20px 20px 20px',
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
    }}>
        <SkeletonBox skeletonVisible={order === null} style={{height: 100, marginTop: 10}}>
            <div style={{marginTop: 10, paddingBottom: 30}}>
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
                                fontSize: 12,
                                width: 20,
                                height: 20,
                                borderRadius: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                                display: 'flex',
                                marginTop: 2,
                                whiteSpace: 'nowrap',
                                textAlign: 'right',
                                backgroundColor: 'rgba(0,0,0,0.4)',
                                color: 'white',

                            }}>{index + 1}</div>
                            <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                                <div style={{
                                    fontSize: 18,
                                    marginBottom: 5
                                }}>{item.category} {item.name} {item.unit} {item.unit_type}</div>
                                <div style={{display: "flex"}}>
                                    <div style={{flexGrow: 1}}>{item.requested_amount} x AED {item.price}</div>
                                    <div
                                        style={{fontWeight: 'bold'}}>AED {(item.requested_amount * item.price).toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                })}
            </div>
        </SkeletonBox>
    </div>;
}

function ConfirmPanel() {
    return <div style={{display:'flex',flexDirection:'column',}}>
        <Button title={'Create Acknowledgement Note'} icon={BsPatchCheckFill} onTap={() => {}} style={{margin:10}}/>
        <Input title={'Confirmation Time'} placeholder={''} />
        <div>List of items that is confirmed</div>
    </div>
}

function DispatchPanel() {
    return <div>Dispatched Panel</div>
}

function ReceivedPanel() {
    return <div>Received Panel</div>
}

export default function OrderDetail(props: RouteProps) {
    const orderId = props.params.get('id');
    const [order, setOrder] = useState<DbOrder | null>(null);
    const [orderLineItems, setOrderLineItems] = useState<DbOrderLineItems[]>([]);
    const [selectedPage, setSelectedPage] = useState('order');
    useEffect(() => {
        setOrder(null);
        setOrderLineItems([]);
        (async () => {
            const {data: order} = await supabase.from('orders').select('*').eq('id', orderId).single();
            const {data: lineItems} = await supabase.from('order_line_items').select('*').eq('order(id)', order.id);
            setOrder(order)
            setOrderLineItems(lineItems ?? []);
        })();
    }, [orderId]);

    return <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <Header title={<SkeletonBox skeletonVisible={order === null}
                                    style={{flexGrow: 1}}>{`Order Detail ${order?.id}`}</SkeletonBox>}/>
        <div style={{padding: '10px 20px', borderBottom: '1px solid rgba(0,0,0,0.1)'}}>
            <div style={{display:'flex'}}>
            <div style={{display: 'flex', flexDirection: 'column', marginBottom: 5,flexGrow:1}}>
                <div style={{fontSize: 14, marginRight: 10}}>Order Date :</div>
                <SkeletonBox skeletonVisible={order === null} style={{flexGrow: 1, height: 30}}>
                    <div style={{fontSize: 20}}>
                        {formatDateTime(order?.created_at)}
                    </div>
                </SkeletonBox>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', marginBottom: 5}}>
                <div style={{fontSize: 14, marginRight: 10}}>Order Status :</div>
                <SkeletonBox skeletonVisible={order === null} style={{flexGrow: 1, height: 30}}>
                    <div style={{fontSize: 20}}>
                        {order?.order_status.toUpperCase()}
                    </div>
                </SkeletonBox>

            </div>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', marginBottom: 5}}>
                <div style={{fontSize: 14, marginRight: 10}}>Sub total :</div>
                <SkeletonBox skeletonVisible={order === null} style={{flexGrow: 1, height: 30}}>
                    <div style={{fontSize: 20}}>
                        AED {order?.sub_total}
                    </div>
                </SkeletonBox>
            </div>
        </div>
        <div style={{
            height: '100%',
            display: 'flex',
            overflow: 'auto',
            flexDirection: 'column'
        }}>
            {selectedPage === 'order' &&
                <OrderPanel order={order} orderLineItems={orderLineItems}/>}
            {selectedPage === 'confirm' && <ConfirmPanel />}
            {selectedPage === 'dispatch' && <DispatchPanel />}
            {selectedPage === 'received' && <ReceivedPanel />}
        </div>
        <div style={{display: 'flex', flexDirection: 'column', position: 'absolute', bottom: 0, width: '100%'}}>
            <OrderDetailFooter value={selectedPage} onChange={setSelectedPage}/>
        </div>
    </div>
}


export function OrderDetailFooter(props: { value: string, onChange: (value: string) => void }) {
    const {value, onChange} = props;
    const style = {width: '25%', color: 'rgba(0,0,0,0.6)'};
    const selectedStyle = {width: '25%', color: blueDarken};
    return <div style={{
        backgroundColor: 'rgba(255,255,255,0.9)',
        display: 'flex',
        flexDirection: 'column',
        borderTop: '1px solid rgba(0,0,0,0.1)'
    }}>
        <div style={{display: 'flex'}}>
            <TitleIcon title={'Order'} icon={value === 'order' ? IoBasket : IoBasketOutline} iconSize={27}
                       style={value === 'order' ? selectedStyle : style} onTap={() => onChange('order')}/>
            <TitleIcon title={'Confirm'} icon={value === 'confirm' ? BsPatchCheckFill : BsPatchCheck} iconSize={27}
                       style={value === 'confirm' ? selectedStyle : style} onTap={() => onChange('confirm')}/>
            <TitleIcon title={'Dispatch'} icon={value === 'dispatch' ? FaTruck : BsTruck} iconSize={27}
                       style={value === 'dispatch' ? selectedStyle : style} onTap={() => onChange('dispatch')}/>
            <TitleIcon title={'Received'} icon={value === 'received' ? IoHome : IoHomeOutline} iconSize={27}
                       style={value === 'received' ? selectedStyle : style} onTap={() => onChange('received')}/>
        </div>
    </div>
}