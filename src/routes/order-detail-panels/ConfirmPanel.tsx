import {DbOrder} from "../../components/model/DbOrder";
import {DbOrderLineItems} from "../../components/model/DbOrderLineItems";
import {DbOrderConfirmation} from "../../components/model/DbOrderConfirmation";
import {useAppContext} from "../../components/useAppContext";
import {motion} from "framer-motion";
import {TitleValue} from "./utils/TitleValue";
import {formatDateTime} from "../History";
import {Button} from "../../components/page-components/Button";
import {IoCheckmarkCircleOutline, IoClose, IoOpenOutline, IoRemoveCircleOutline} from "react-icons/io5";
import {ButtonTheme} from "../Theme";
import {supabase} from "../../components/supabase";
import invariant from "tiny-invariant";
import {AcknowledgementNotePanel} from "./modal/AcknowledgementNotePanel";
import {BsPatchCheckFill} from "react-icons/bs";

export function ConfirmPanel(props: { order: DbOrder | null, orderLineItems: DbOrderLineItems[], confirmations: DbOrderConfirmation[] }) {
    const appContext = useAppContext();
    const {order, orderLineItems, confirmations} = props;
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
                            <TitleValue title={'Confirmed by'} value={c.confirmed_by} width={'70%'}/>
                            <TitleValue title={'Status'} value={c.status ?? 'N/A'} width={'30%'}/>
                        </div>
                        <TitleValue title={'Recorded at'} value={formatDateTime(c.created_at)} width={'100%'}/>
                    </div>

                    <div style={{width: 20, fontSize: 30, marginLeft: 15, display: 'flex', flexDirection: 'column'}}>
                        {c.status !== 'Complete' &&
                            <motion.div whileTap={{scale: 0.9}} onTap={async () => {
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
                                }
                            }}>
                                <IoRemoveCircleOutline/>
                            </motion.div>
                        }
                        <motion.div whileTap={{scale: 0.9}} onTap={async () => {
                            invariant(order);
                            const {data: confirmedLineItems} = await supabase.from('order_confirmation_line_items').select('*').eq('order_confirmation(id)', c.id);
                            await appContext.showModal(closePanel => {
                                return <AcknowledgementNotePanel closePanel={closePanel} order={order}
                                                                 orderLineItems={orderLineItems}
                                                                 confirmation={c}
                                                                 confirmationLineItems={confirmedLineItems ?? []}
                                />
                            });
                        }}>
                            <IoOpenOutline/>
                        </motion.div>
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
            }} style={{margin: 10}} theme={ButtonTheme.promoted}/>}
    </div>
}