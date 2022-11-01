import {RouteProps} from "../components/useRoute";
import {Header} from "../components/page-components/Header";

import {RiAppleLine, RiGoogleLine, RiMastercardLine, RiVisaLine} from "react-icons/ri";
import {blueDarken, white} from "./Theme";
import {Input} from "../components/page-components/Input";
import {Button} from "../components/page-components/Button";
import {IoCardOutline} from "react-icons/io5";
import {useSubTotalCart} from "./Cart";
import {useCallback, useEffect} from "react";
import {useAppContext} from "../components/useAppContext";
import {original, produce} from "immer";
import {useNavigate} from "../components/useNavigate";
import {StoreValue, useCreateStore, useStoreValue} from "../components/store/useCreateStore";
import {isNotEmptyText} from "./ShippingAddress";
import {useFocusListener} from "../components/RouterPageContainer";
import {Address, CartItem, Order} from "../components/AppState";
import {nanoid} from "nanoid";


export default function Payment(props: RouteProps) {
    const subTotal = useSubTotalCart();
    const {store} = useAppContext();
    const cardInfo = useStoreValue(store, s => s.cardInfo);
    const localStore = useCreateStore({
        ...cardInfo,
        cvv: '',
        errors:{
            cardNumber: '',
            validUntil: '',
            cvv: '',
            cardHolderName: '',
        }
    });
    const isFocused = useFocusListener(props.path);
    useEffect(() => {
        if(!isFocused){
            localStore.setState(produce(s => {
                s.cardHolderName = '';
                s.validUntil = '';
                s.cvv = '';
                s.cardNumber = '';
            }))
        }
    },[isFocused]);

    const navigate = useNavigate();

    const performPayment = useCallback(() => {
        if(!validate()){
            return;
        }

        store.setState(produce(state => {
            state.cardInfo.cardHolderName = localStore.stateRef.current.cardHolderName;
            state.cardInfo.cardNumber = localStore.stateRef.current.cardNumber;
            state.cardInfo.validUntil = localStore.stateRef.current.validUntil;
        }));

        // kemudian balik lagi ke home

        store.setState(produce(state => {
            const order: Order = {
                payment: {
                    amount: subTotal,
                    currency: 'aed',
                    method: 'visa',
                    referenceCode: nanoid(),
                    status: 'received',
                    time: new Date().toISOString()
                },
                status: 'Placed',
                id: nanoid(),
                date: new Date().toISOString(),
                subTotal,
                shippingAddress: original(state.shippingAddress) as Address,
                shippingStatus: [],
                lineItem: original(state.shoppingCart) as CartItem[],
            }

            state.orders.push(order);
            state.shoppingCart = [];

            state.shippingAddress = {
                addressLine2: '',
                lastName: '',
                firstName: '',
                city: '',
                country: '',
                addressLine1: '',
                email: '',
                note: '',
                zipCode: '',
                phone: '',
                state: ''
            }
        }));
        navigate('home');
    }, []);

    const validate = useCallback(() => {
        localStore.setState(produce(state => {
            state.errors.cardNumber = isNotEmptyText(state.cardNumber) ? '' : 'Card Number is required';
            state.errors.cardHolderName = isNotEmptyText(state.cardHolderName) ? '' : 'Name is required';
            state.errors.cvv = isNotEmptyText(state.cvv) ? '' : 'CVV is required';
            state.errors.validUntil = isNotEmptyText(state.validUntil) ? '' : 'Valid until is required';
        }));
        const state = localStore.stateRef.current;
        const hasError = Object.keys(state.errors).reduce((hasError,key) => {
            return hasError || ((state.errors as any)[key]).toString().length > 0
        },false);
        return !hasError;
    }, [localStore]);

    return <div
        style={{
            height: '100%',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            background: 'radial-gradient(rgba(255,255,255,1),rgba(0,0,0,0.03))',
        }}>
        <Header title={'Payment'}/>
        <div style={{height: '100%'}}>
            <div style={{
                display: 'flex',
                fontSize: 26,
                justifyContent: 'space-between',
                padding: '10px 20px',
                color: white,
            }}>
                <div style={{
                    margin: 5,
                    backgroundColor: blueDarken,
                    height: 40,
                    width: '25%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 3
                }}>
                    <RiGoogleLine/>
                </div>
                <div style={{
                    margin: 5,
                    backgroundColor: blueDarken,
                    height: 40,
                    width: '25%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 3
                }}>
                    <RiAppleLine/>
                </div>
                <div style={{
                    margin: 5,
                    fontSize: 50,
                    backgroundColor: blueDarken,
                    height: 40,
                    width: '25%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 3
                }}>
                    <RiVisaLine/>
                </div>
                <div style={{
                    margin: 5,
                    fontSize: 40,
                    backgroundColor: blueDarken,
                    height: 40,
                    width: '25%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 3
                }}>
                    <RiMastercardLine/>
                </div>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                margin: '0px 25px 0 25px',
                background: 'white',
                borderRadius: 5,
                boxShadow: '0 3px 5px -3px rgba(0,0,0,0.2)'
            }}>
                <StoreValue store={localStore} selector={[(s) => s.cardNumber,(s) => s.errors.cardNumber]} property={['value','error']}>
                    <Input title={'Card Number'} placeholder={'Enter your card Number here'} onChange={(e) => {
                        localStore.setState(produce(old => {
                            old.cardNumber = e.target.value;
                            old.errors.cardNumber = e.target.value === '' ?  'Card Number is required'  : '';
                        }));
                    }}/>
                </StoreValue>
                <div style={{display: 'flex'}}>
                    <div style={{width: '70%'}}>
                        <StoreValue store={localStore} selector={[s => s.validUntil,s => s.errors.validUntil]} property={['value','error']} >
                            <Input title={'Valid Until'} placeholder={'Valid Until'} onChange={(e) => {
                                localStore.setState(produce(s => {
                                    s.validUntil = e.target.value;
                                    s.errors.validUntil = e.target.value === '' ? 'Valid Until is required' : ''
                                }))
                            }}/>
                        </StoreValue>
                    </div>
                    <div style={{width: '30%'}}>
                        <StoreValue store={localStore} selector={[s => s.cvv,s => s.errors.cvv]} property={['value','error']}>
                            <Input title={'CVV'} placeholder={'xxx'} onChange={(e) => {
                                localStore.setState(produce(s => {
                                    s.cvv = e.target.value;
                                    s.errors.cvv = e.target.value === '' ? 'CVV is required' : ''
                                }))
                            }}/>
                        </StoreValue>
                    </div>
                </div>
                <StoreValue store={localStore} selector={[s => s.cardHolderName,s => s.errors.cardHolderName]} property={['value','error']}>
                    <Input title={'Card Holder Name'} placeholder={'Enter your card Number here'} onChange={(e) => {
                        localStore.setState(produce(s => {
                            s.cardHolderName = e.target.value;
                            s.errors.cardHolderName = e.target.value === '' ?  'Card Name is required'  : '';
                        }))
                    }}/>
                </StoreValue>
            </div>
            <div style={{margin: '20px 20px', alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                <Button title={`Pay AED ${subTotal}`} onTap={() => {
                    performPayment();
                }} icon={IoCardOutline} style={{fontSize: 20, padding: '15px 50px'}}/>
            </div>
        </div>
    </div>
}