import {Header} from "../components/page-components/Header";
import {RouteProps} from "../components/useRoute";
import {formatDateTime} from "./History";
import {PropsWithChildren, useCallback, useEffect, useState} from "react";
import {supabase} from "../components/supabase";
import {DbOrder} from "../components/model/DbOrder";
import {DbOrderLineItems} from "../components/model/DbOrderLineItems";
import {SkeletonBox} from "../components/page-components/SkeletonBox";
import {TitleIcon} from "../components/page-components/TitleIcon";
import {
    IoBasket,
    IoBasketOutline,
    IoCheckmarkCircleOutline,
    IoClose,
    IoHome,
    IoHomeOutline,
    IoOpenOutline,
    IoRemoveCircleOutline
} from "react-icons/io5";
import {BsPatchCheck, BsPatchCheckFill, BsTruck} from "react-icons/bs";
import {FaTruck} from "react-icons/fa";
import {blueDarken, ButtonTheme} from "./Theme";
import {Button} from "../components/page-components/Button";
import {useAppContext} from "../components/useAppContext";
import invariant from "tiny-invariant";
import {HiOutlineEmojiHappy, HiOutlineEmojiSad} from "react-icons/hi";
import {Input} from "../components/page-components/Input";
import {motion} from "framer-motion";
import {StoreValue, useCreateStore} from "../components/store/useCreateStore";
import {DbOrderConfirmation} from "../components/model/DbOrderConfirmation";
import {DbOrderConfirmationLineItems} from "../components/model/DbOrderConfirmationLineItems";
import {produce} from "immer";
import {isNotEmptyText} from "./Shipping";


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

function ConfirmPanel(props: { order: DbOrder | null, orderLineItems: DbOrderLineItems[], confirmations: DbOrderConfirmation[] }) {
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

                    <div style={{width: 20, fontSize: 30,marginLeft:15, display: 'flex', flexDirection: 'column'}}>
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
        {['Placed','Acknowledge'].indexOf(order?.order_status ?? '') >= 0 &&
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
                return <AcknowledgementNotePanel closePanel={closePanel} order={order} orderLineItems={orderLineItems}
                                                 confirmation={confirmation}
                                                 confirmationLineItems={confirmedLineItems ?? []}
                />
            });
        }} style={{margin: 10}} theme={ButtonTheme.promoted}/>}
    </div>
}

const errors: any = {};

function AcknowledgementNotePanel(props: {
    order: DbOrder,
    orderLineItems: DbOrderLineItems[],
    closePanel: (result: any) => void,
    confirmation: DbOrderConfirmation,
    confirmationLineItems: DbOrderConfirmationLineItems[]
}) {
    const {orderLineItems, order, confirmation, confirmationLineItems, closePanel} = props;
    const {user, appDimension} = useAppContext();
    const isComplete = confirmation.status === 'Complete';
    const localStore = useCreateStore({
        order,
        orderLineItems,
        confirmation,
        confirmationLineItems,
        errors
    });
    const validate = useCallback(() => {
        localStore.setState(produce(state => {
            for (const confirmationLineItem of state.confirmationLineItems) {
                if (confirmationLineItem.unable_to_fulfill) {
                    if (!isNotEmptyText(confirmationLineItem.reason_unable_to_fulfill)) {
                        state.errors[confirmationLineItem.id.toString()] = 'Item must have reason why it cannot be fulfilled';
                    } else {
                        state.errors[confirmationLineItem.id.toString()] = '';
                    }
                } else {
                    const amountToBeFulfilled = confirmationLineItem.amount_fulfilled;
                    const orderLineItem = state.orderLineItems.find(oli => oli.id === confirmationLineItem.order_line_item);
                    invariant(orderLineItem);
                    if (amountToBeFulfilled <= 0 && (orderLineItem.requested_amount - orderLineItem.fulfilled_amount) > 0 ) {
                        state.errors[confirmationLineItem.id.toString()] = 'Item must have value';
                    } else if (amountToBeFulfilled > ((orderLineItem?.requested_amount ?? 0)  - (orderLineItem?.fulfilled_amount ?? 0)) ) {
                        state.errors[confirmationLineItem.id.toString()] = 'Quantity exceed requested quantity'
                    } else {
                        state.errors[confirmationLineItem.id.toString()] = ''
                    }
                }
            }
        }));
        const errors = localStore.stateRef.current.errors;
        const hasErrors = Object.keys(errors).reduce((hasError, key) => {
            return hasError || errors[key].length > 0
        }, false);
        return !hasErrors;

    }, [localStore]);
    return <div style={{
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: '10px 0px 10px 0px',
        boxSizing: 'border-box',
        height: '100%',
        width: appDimension.width,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
    }}>
        <div style={{fontSize: 22, borderBottom: '1px solid rgba(0,0,0,0.1)', padding: '0 10px 5px 10px'}}>Requested
            Items
        </div>

        <div style={{display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto'}}>
            {orderLineItems.map(oli => {

                return <div key={oli.id}
                            style={{
                                padding: '5px 0px 5px 0px',
                                borderBottom: '1px solid rgba(0,0,0,0.1)',
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                    <div style={{display: 'flex', flexDirection: 'row', padding: '5px 15px'}}>
                        <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, fontSize: 14}}>
                            <div>{oli.barcode}</div>
                            <div>{oli.category} {oli.name}</div>
                            <div>{oli.unit} {oli.unit_type}</div>
                        </div>

                        <div style={{display: 'flex', flexDirection: 'column'}} >
                            <div style={{fontSize: 12}}>Requested</div>
                            <div style={{fontSize: 30, fontWeight: 'bold', textAlign: 'right'}}>
                                {oli.requested_amount}
                            </div>
                        </div>

                    </div>
                    <div style={{display: 'flex'}}>
                        <motion.div style={{display: 'flex', flexDirection: 'column', marginRight: 0}}
                                    whileTap={{scale: 0.9}} onTap={() => {
                            localStore.setState(produce(draft => {
                                const confirmationLineItem = draft.confirmationLineItems.find(cli => cli.order_line_item === oli.id);
                                invariant(confirmationLineItem);
                                confirmationLineItem.unable_to_fulfill = !confirmationLineItem.unable_to_fulfill;
                            }))
                        }}>
                            <div style={{
                                fontSize: 36,
                                marginLeft: 10,
                                marginTop: 15,
                                fontWeight: 'bold',
                                textAlign: 'right'
                            }}>
                                <StoreValue store={localStore} selector={s => {
                                    return s.confirmationLineItems.find(cli => cli.order_line_item === oli.id)?.unable_to_fulfill !== true
                                }} property={'value'}>
                                <ShouldDisplay>
                                    <HiOutlineEmojiHappy/>
                                </ShouldDisplay>
                                </StoreValue>
                                <StoreValue store={localStore} selector={s => {
                                    return s.confirmationLineItems.find(cli => cli.order_line_item === oli.id)?.unable_to_fulfill === true
                                }} property={'value'}>
                                <ShouldDisplay>
                                    <HiOutlineEmojiSad/>
                                </ShouldDisplay>
                                </StoreValue>
                            </div>
                        </motion.div>
                        <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                            <StoreValue store={localStore} selector={s => {
                                const confirmationLineItem = s.confirmationLineItems.find(cli => cli.order_line_item === oli.id);
                                invariant(confirmationLineItem);
                                return confirmationLineItem.unable_to_fulfill !== true;
                            }} property={'value'}>
                                <ShouldDisplay>
                                    <StoreValue store={localStore}
                                                selector={[
                                                    s => s.confirmationLineItems.find(cli => cli.order_line_item === oli.id)?.amount_fulfilled.toString(),
                                                    s => {
                                                        const confirmationLineItem = s.confirmationLineItems.find(cli => cli.order_line_item === oli.id);
                                                        return s.errors[confirmationLineItem?.id.toString() ?? '']
                                                    }
                                                ]}
                                                property={['value', 'error']}>
                                        <Input title={'Total item can be fulfilled'} type={'number'}
                                               inputMode={'numeric'}
                                               disabled={isComplete}
                                               placeholder={'Enter total items can be fulfilled'}
                                               style={{containerStyle: {borderBottom: 'none'}}}
                                               onChange={(e) => {
                                                   localStore.setState(produce(draft => {
                                                       const index = draft.confirmationLineItems.findIndex(cli => cli.order_line_item === oli.id);
                                                       const amountToBeFulfilled = parseInt(e.target.value || '0');
                                                       draft.confirmationLineItems[index].amount_fulfilled = amountToBeFulfilled;

                                                       if (amountToBeFulfilled <= 0 && (oli.requested_amount - oli.fulfilled_amount) > 0) {
                                                           draft.errors[draft.confirmationLineItems[index].id.toString()] = 'Item must have value or mark as unable to fulfill';
                                                       } else if (amountToBeFulfilled > (oli.requested_amount - oli.fulfilled_amount) ) {
                                                           draft.errors[draft.confirmationLineItems[index].id.toString()] = 'Quantity exceed requested quantity'
                                                       } else {
                                                           draft.errors[draft.confirmationLineItems[index].id.toString()] = ''
                                                       }

                                                   }))
                                               }}
                                        />
                                    </StoreValue>
                                </ShouldDisplay>
                            </StoreValue>

                            <StoreValue store={localStore} selector={s => {
                                const confirmationLineItem = s.confirmationLineItems.find(cli => cli.order_line_item === oli.id);
                                invariant(confirmationLineItem);
                                return confirmationLineItem.unable_to_fulfill === true;
                            }} property={'value'}>
                                <ShouldDisplay>
                                    <StoreValue store={localStore}
                                                selector={[
                                                    s => s.confirmationLineItems.find(cli => cli.order_line_item === oli.id)?.reason_unable_to_fulfill,
                                                    s => {
                                                        const confirmationLineItem = s.confirmationLineItems.find(cli => cli.order_line_item === oli.id);
                                                        return s.errors[confirmationLineItem?.id.toString() ?? '']
                                                    }
                                                ]}
                                                property={['value', 'error']}>
                                        <Input title={'Reason why it cannot be fulfilled'} type={'text'}
                                               inputMode={'text'}
                                               placeholder={'Enter reason why it cannot be fulfilled'}
                                               style={{containerStyle: {borderBottom: 'none'}}}
                                               disabled={isComplete}
                                               onChange={(e) => {
                                                   localStore.setState(produce(draft => {
                                                       const index = draft.confirmationLineItems.findIndex(cli => cli.order_line_item === oli.id);
                                                       draft.confirmationLineItems[index].reason_unable_to_fulfill = e.target.value;
                                                       if (!isNotEmptyText(e.target.value)) {
                                                           draft.errors[draft.confirmationLineItems[index].id.toString()] = 'Reason for not being able to be fulfilled must have value';
                                                       } else {
                                                           draft.errors[draft.confirmationLineItems[index].id.toString()] = ''
                                                       }
                                                   }))
                                               }}
                                        />
                                    </StoreValue>
                                </ShouldDisplay>
                            </StoreValue>
                        </div>
                        <motion.div style={{display: 'flex', flexDirection: 'column',marginRight:15,marginTop:5}} whileTap={{scale: 0.98}}
                                    onTap={() => {
                                        localStore.setState(produce(draft => {
                                            const index = draft.confirmationLineItems.findIndex(cli => cli.order_line_item === oli.id);
                                            draft.confirmationLineItems[index].amount_fulfilled = oli.requested_amount - oli.fulfilled_amount;
                                            draft.errors[draft.confirmationLineItems[index].id.toString()] = '';
                                        }));
                                    }}>
                            <div style={{fontSize: 12}}>Remaining</div>
                            <div style={{fontSize: 30, fontWeight: 'bold', textAlign: 'right'}}>
                                {oli.requested_amount - oli.fulfilled_amount}
                            </div>
                        </motion.div>
                    </div>
                </div>
            })}
        </div>
        <div style={{display: 'flex', padding: '5px 10px 0px 10px'}}>
            <div style={{display: 'flex', flexDirection: 'column', marginTop: 5, flexGrow:1}}>
                <Button title={'Close'} onTap={() => {
                    props.closePanel(true)
                }} icon={IoClose}/>
            </div>
            {!isComplete &&
            <div style={{display: 'flex', flexDirection: 'column', marginTop: 5, marginLeft: 10, flexGrow:1}}>
                <Button title={'Confirm'} onTap={async () => {
                    if (validate()) {
                        const confirmationLineItems = localStore.stateRef.current.confirmationLineItems;
                        await supabase.from('order_confirmation_line_items').upsert(confirmationLineItems).select();
                        await supabase.from('order_confirmations').update({status:'Complete'}).eq('id',confirmation.id);
                        let orderLineItems = localStore.stateRef.current.orderLineItems;
                        let allComplete = true;
                        orderLineItems = orderLineItems.map(oli => ({...oli}));
                        orderLineItems.forEach(oli => {
                            const confirmedLineItem = confirmationLineItems.find(cli => cli.order_line_item === oli.id);
                            oli.fulfilled_amount = (oli.fulfilled_amount ?? 0) + (confirmedLineItem?.amount_fulfilled ?? 0);
                            allComplete = allComplete && (oli.fulfilled_amount === oli.requested_amount);
                        });
                        await supabase.from('order_line_items').upsert(orderLineItems).select();
                        await supabase.from('orders').update({order_status:allComplete?'Confirmed':'Acknowledge'}).eq('id',order.id);
                        props.closePanel(true)
                    }

                }} icon={BsPatchCheckFill} theme={ButtonTheme.promoted}/>
            </div>
            }
        </div>
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
    const [confirmations, setConfirmations] = useState<DbOrderConfirmation[]>([]);
    useEffect(() => {
        setOrder(null);
        setOrderLineItems([]);
        const listenWhenOrderConfirmationChanges = 'listen-when-confirmation-change';
        const listenWhenOrderChanges = 'listen-when-order-change';
        (async () => {
            const {data: order} = await supabase.from('orders').select('*').eq('id', orderId).single();
            const {data: lineItems} = await supabase.from('order_line_items').select('*').eq('order(id)', order.id);
            const {data: orderConfirmations} = await supabase.from('order_confirmations').select('*').eq('order(id)', order?.id);

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
                }else if (eventType === 'INSERT') {
                    setConfirmations(old => [newVal, ...old]);
                }else if (eventType === 'UPDATE') {
                    setConfirmations(produce(draft => {
                        const index = draft.findIndex(d => d.id === newVal.id);
                        draft.splice(index,1,newVal);
                    }));
                }else{
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
                }else{
                    debugger;
                }
            }).subscribe();


            setOrder(order);
            setOrderLineItems(lineItems ?? []);
            setConfirmations(orderConfirmations ?? []);
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
                                    style={{flexGrow: 1}}>{`Order Detail ${order?.id}`}</SkeletonBox>}/>
        <div style={{padding: '10px 20px', borderBottom: '1px solid rgba(0,0,0,0.1)'}}>
            <div style={{display: 'flex'}}>
                <div style={{display:'flex',flexDirection:'column',flexGrow:1}}>
                <TitleValue title={'Order Date'} value={order && formatDateTime(order?.created_at)} />
                </div>
                <div style={{display:'flex',flexDirection:'column',width:120}}>
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
            {selectedPage === 'dispatch' && <DispatchPanel/>}
            {selectedPage === 'received' && <ReceivedPanel/>}
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

function TitleValue(props: { value: string | undefined | null, title: string, width?: string | number }) {
    return <div style={{display: 'flex', flexDirection: 'column', marginBottom: 5, width: props.width}}>
        <div style={{fontSize: 14, marginRight: 10}}>{props.title} :</div>
        <SkeletonBox skeletonVisible={props.value === null || props.value === undefined}
                     style={{flexGrow: 1, height: 22, marginRight: 10}}>
            <div style={{fontSize: 18}}>
                {props.value}
            </div>
        </SkeletonBox>
    </div>
}

function ShouldDisplay(props: PropsWithChildren<{ value?: boolean }>) {
    if (!props.value) {
        return <></>;
    }
    return <>{props.children}</>
}