import {Header} from "../components/page-components/Header";
import {RouteProps} from "../components/useRoute";
import {useAppContext} from "../components/useAppContext";
import {useStoreValue} from "../components/store/useCreateStore";
import invariant from "tiny-invariant";
import {formatDateTime} from "./History";

export default function OrderDetail(props: RouteProps) {
    const orderId = props.params.get('id');
    const {store} = useAppContext();
    const order = useStoreValue(store, s => s.orders.find(o => o.id === orderId), [orderId]);
    invariant(order);
    return <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <Header title={`Order Detail ${order.id}`}/>
        <div style={{padding:10,borderBottom:'1px solid rgba(0,0,0,0.1)'}}>
            <div style={{display:'flex',alignItems:'flex-end'}}>
                <div style={{fontSize:14,marginRight:10}}>Transaction Date :</div> {formatDateTime(order.date)}
            </div>
            <div  style={{display:'flex',alignItems:'flex-end'}}>
                <div style={{fontSize:14,marginRight:10}}>Order Status :</div> {order.status}
            </div>
            <div  style={{display:'flex',alignItems:'flex-end'}}>
                <div style={{fontSize:14,marginRight:10}}>Sub total :</div> AED {order.subTotal}
            </div>
        </div>
        <div style={{padding: '0 20px 20px 20px', height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column'}}>

            <div style={{marginTop: 10}}>
                {order.lineItem.map((item, index) => {
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
                                    style={{fontSize: 14}}>{item.category} {item.name} {item.unit} {item.unitType}</div>
                                <div style={{display: "flex"}}>
                                    <div style={{flexGrow: 1}}>{item.total} x AED {item.price}</div>
                                    <div>AED {(item.total * parseFloat(item.price)).toFixed(2)}</div>
                                </div>

                            </div>
                        </div>
                    </div>
                })}
            </div>
        </div>
    </div>
}