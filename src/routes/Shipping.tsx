import {RouteProps} from "../components/useRoute";
import {Header} from "../components/page-components/Header";
import {Button} from "../components/page-components/Button";
import {MdCancel, MdSave} from "react-icons/md";
import {ButtonTheme} from "./Theme";
import {Input} from "../components/page-components/Input";
import {Store, useCreateStore, useStoreValue} from "../components/store/useCreateStore";
import {produce} from "immer";
import {cloneElement, PropsWithChildren, useCallback} from "react";


export function Shipping(props: RouteProps) {
    const store = useCreateStore((action) => produce(state => {
        if (action.type === 'update') {
            (state as any)[action.payload.key] = action.payload.value;
        }
        return state;
    }), {
        firstName: '',
        lastName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        email: '',
        phone: '',
        note: ''
    });
    const update = useCallback((key: string, value: any) => store.dispatch({
        type: 'update',
        payload: {key, value}
    }), [store]);
    const validate = useCallback(() => {
        return true;
    }, []);
    return <div
        style={{
            height: '100%',
            overflow: 'auto',
            background: 'radial-gradient(rgba(255,255,255,1),rgba(0,0,0,0.1))',
            display: 'flex',
            flexDirection: 'column'
        }}>
        <Header title={'Shipping Address'}/>
        <div style={{display: 'flex', flexDirection: 'column', overflow: 'auto', height: '100%'}}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <StoreValue store={store} selector={param => param.firstName} property={'value'}>
                    <Input title={'First Name'} placeholder={'Type your first name here'}
                           onChange={(event) => update('firstName', event.target.value)}
                    />
                </StoreValue>
                <StoreValue store={store} selector={param => param.lastName} property={'value'}>
                    <Input title={'Last Name'} placeholder={'Type your last name here'}
                           onChange={e => update('lastName', e.target.value)}/>
                </StoreValue>
                <StoreValue store={store} selector={param => param.addressLine1} property={'value'}>
                    <Input title={'Address line 1'} placeholder={'Type address line 1'}
                           onChange={e => update('addressLine1', e.target.value)}/>
                </StoreValue>
                <StoreValue store={store} selector={param => param.addressLine2} property={'value'}>
                    <Input title={'Address line 2'} placeholder={'Type address line 2'}
                           onChange={e => update('addressLine2', e.target.value)}/>
                </StoreValue>
                <div style={{display: 'flex'}}>
                    <div style={{width: '50%'}}>
                        <StoreValue store={store} selector={param => param.city} property={'value'}>
                            <Input title={'City'} placeholder={'Type city'}
                                   onChange={e => update('city', e.target.value)}/>
                        </StoreValue>
                    </div>
                    <div style={{width: '50%'}}>
                        <StoreValue store={store} selector={param => param.state} property={'value'}>
                            <Input title={'State'} placeholder={'Select state'}
                                   onChange={e => update('state', e.target.value)}/>
                        </StoreValue>
                    </div>
                </div>
                <div style={{display: 'flex'}}>
                    <div style={{width: '50%'}}>
                        <StoreValue store={store} selector={param => param.zipCode} property={'value'}>
                            <Input title={'Zip/Postal Code'} placeholder={'Type Zip/Postal code'}
                                   onChange={e => update('zipCode', e.target.value)}/>
                        </StoreValue>
                    </div>
                    <div style={{width: '50%'}}>
                        <StoreValue store={store} selector={param => param.country} property={'value'}>
                            <Input title={'Country'} placeholder={'Select Country'}
                                   onChange={e => update('country', e.target.value)}/>
                        </StoreValue>
                    </div>
                </div>
                <StoreValue store={store} selector={param => param.email} property={'value'}>
                    <Input title={'Email'} placeholder={'Type email address here'}
                           onChange={e => update('email', e.target.value)}/>
                </StoreValue>
                <StoreValue store={store} selector={param => param.phone} property={'value'}>
                    <Input title={'Phone'} placeholder={'Type phone number here'}
                           onChange={e => update('phone', e.target.value)}/>
                </StoreValue>
                <StoreValue store={store} selector={param => param.note} property={'value'}>
                    <Input title={'Note'} placeholder={'eg : Doorbell number is 33'}
                           onChange={e => update('note', e.target.value)}/>
                </StoreValue>
                <div style={{display: 'flex', padding: 10, background: 'white'}}>
                    <div style={{display: 'flex', flexDirection: 'column', width: '50%'}}>
                        <Button title={'Save'} onTap={() => {
                            if (validate()) {

                            }
                        }} theme={ButtonTheme.promoted} icon={MdSave}/>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', width: '50%', marginLeft: 10}}>
                        <Button title={'Cancel'} onTap={() => window.history.back()} icon={MdCancel}
                                theme={ButtonTheme.default}/>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

type Selector<T, S> = (param: T) => S;

function StoreValue<T, S>(props: PropsWithChildren<{ store: Store<T>, selector: Selector<T, S>, property: string }>) {
    const {store, property, selector, children} = props;
    const prop: string = property as string;
    const value = useStoreValue(store, selector);
    const childrenAny: any = children;
    return cloneElement(childrenAny, {...childrenAny.props, [prop]: value})

}