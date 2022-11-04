import {DbOrder} from "../../components/model/DbOrder";
import {DbOrderLineItems} from "../../components/model/DbOrderLineItems";
import {DbOrderConfirmation} from "../../components/model/DbOrderConfirmation";
import {useAppContext} from "../../components/useAppContext";
import {motion} from "framer-motion";
import {TitleValue} from "./utils/TitleValue";
import {formatDateTime} from "./utils/formatDateTime";
import {Button} from "../../components/page-components/Button";
import {IoCheckmarkCircleOutline, IoClose, IoOpenOutline, IoRemoveCircleOutline} from "react-icons/io5";
import {ButtonTheme} from "../Theme";
import {supabase} from "../../components/supabase";
import invariant from "tiny-invariant";
import {AcknowledgementNotePanel} from "./modal/AcknowledgementNotePanel";
import {BsPatchCheckFill} from "react-icons/bs";
import {formatConfirmationNo} from "./utils/formatConfirmationNo";

export function ConfirmPanel(props: { order: DbOrder | null, orderLineItems: DbOrderLineItems[], confirmations: DbOrderConfirmation[],refresh:() => void }) {
    const appContext = useAppContext();
    const {order, orderLineItems, confirmations,refresh} = props;
    return <div style={{display: 'flex', flexDirection: 'column', paddingBottom: 50}}>
        {confirmations.map(c => {
            return <motion.div key={c.id} style={{
                padding: '5px 20px',
                borderBottom: '1px solid rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{display: 'flex'}}>
                    <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                        <div style={{display: 'flex'}}>
                            <div style={{display: 'flex', flexDirection: 'column',flexGrow:1}}>

                                <TitleValue title={'Confirmation No'} value={order === null ? undefined : formatConfirmationNo(c)}/>
                                <TitleValue title={'Recorded at'} value={order === null ? undefined :formatDateTime(c.created_at)}/>
                            </div>
                            <div style={{width:120,display:'flex',flexDirection:'column',paddingTop:10}}>
                                <Button title={'Detail'} style={{fontSize:14}} theme={ButtonTheme.promoted} icon={IoOpenOutline} onTap={async () => {
                                    invariant(order);
                                    const {data: confirmedLineItems} = await supabase.from('order_confirmation_line_items').select('*').eq('order_confirmation(id)', c.id);
                                    const shouldRefresh = await appContext.showModal(closePanel => {
                                        return <AcknowledgementNotePanel closePanel={closePanel} order={order}
                                                                         orderLineItems={orderLineItems}
                                                                         confirmation={c}
                                                                         confirmationLineItems={confirmedLineItems ?? []}
                                        />
                                    });
                                    if(shouldRefresh){
                                        refresh();
                                    }

                                }}/>
                                {c.status !== 'Complete' &&
                                <Button title={'Delete'} style={{fontSize:14,marginBottom:15}} icon={IoRemoveCircleOutline} onTap={async () => {
                                    const deleteItem = await appContext.showModal(closePanel => {
                                        return <div style={{
                                            background: 'rgba(255,255,255,0.9)',
                                            border: '1px solid rgba(0,0,0,0.1)',
                                            borderRadius: 10,
                                            padding: 10,
                                            margin: 10,
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}>
                                            <div style={{marginBottom: 10}}>Are you sure you want to delete this order
                                                confirmation draft ?
                                            </div>
                                            <div style={{display: 'flex'}}>
                                                <div style={{display: 'flex', flexDirection: 'column', width: '50%'}}>
                                                    <Button onTap={() => closePanel(false)} title={'Cancel'}
                                                            icon={IoClose}/>
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    width: '50%',
                                                    marginLeft: 10
                                                }}>
                                                    <Button onTap={() => closePanel(true)} title={'Yes '}
                                                            icon={IoCheckmarkCircleOutline} theme={ButtonTheme.promoted}/>
                                                </div>
                                            </div>
                                        </div>
                                    });
                                    if (deleteItem) {
                                        await supabase.from('order_confirmation_line_items').delete().eq('order_confirmation', c.id);
                                        await supabase.from('order_confirmations').delete().eq('id', c.id);
                                        refresh();
                                    }
                                }} theme={ButtonTheme.danger}/>}
                            </div>
                        </div>
                        <div style={{display: 'flex'}}>
                            <div style={{display:'flex',flexDirection:'column',flexGrow:1}}>
                            <TitleValue title={'Confirmed by'} value={order === null ? undefined :c.confirmed_by} />
                            </div>
                            <TitleValue title={'Status'} value={order === null ? undefined :c.status ?? 'N/A'} width={120}/>
                        </div>
                    </div>


                </div>

            </motion.div>
        })}
        {['Placed', 'Acknowledge'].indexOf(order?.order_status ?? '') >= 0 &&
            <Button title={'Create Acknowledgement Note'} icon={BsPatchCheckFill} onTap={async () => {
                invariant(order);
                const {data: confirmation} = await supabase.from('order_confirmations').insert({
                    order: order.id,
                    confirmed_by: appContext.user?.phone,
                    status: 'Draft'
                }).select().single();
                const {data: confirmedLineItems} = await supabase.from('order_confirmation_line_items').insert(orderLineItems.map(oli => {
                    return {
                        order_confirmation: confirmation.id,
                        order_line_item: oli.id,
                        amount_fulfilled: 0
                    };
                })).select();
                await appContext.showModal(closePanel => {
                    return <AcknowledgementNotePanel closePanel={closePanel} order={order}
                                                     orderLineItems={orderLineItems}
                                                     confirmation={confirmation}
                                                     confirmationLineItems={confirmedLineItems ?? []}
                    />
                });
                refresh();
            }} style={{margin: 10}} theme={ButtonTheme.promoted}/>}
    </div>
}