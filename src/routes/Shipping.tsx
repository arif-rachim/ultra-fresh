import {RouteProps} from "../components/useRoute";
import {Header} from "../components/page-components/Header";
import {Button} from "../components/page-components/Button";
import {MdCancel, MdSave} from "react-icons/md";
import {ButtonTheme} from "./Theme";
import {Input} from "../components/page-components/Input";
import {useCreateStore, StoreValue} from "../components/store/useCreateStore";
import {produce} from "immer";
import { useCallback} from "react";


export function Shipping(props: RouteProps) {
    const store = useCreateStore((action) => produce(state => {
        if (action.type === 'update') {
            const stateAny = state as any;
            stateAny[action.payload.key] = action.payload.value;
            const errorsAny = state.errors as any;
            errorsAny[action.payload.key] = action.payload.value === '' ? 'Value is required' : '';
        }

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
        note: '',
        errors : {
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
            note: '',
        }
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
                <StoreValue store={store} selector={[p => p.firstName,p => p.errors.firstName]} property={['value','error']}>
                    <Input title={'First Name'} placeholder={'Type your first name here'}
                           onChange={(event) => update('firstName', event.target.value)}
                    />
                </StoreValue>
                <StoreValue store={store} selector={[p => p.lastName,p => p.errors.lastName]} property={['value','error']}>
                    <Input title={'Last Name'} placeholder={'Type your last name here'}
                           onChange={e => update('lastName', e.target.value)}/>
                </StoreValue>
                <StoreValue store={store} selector={[p => p.addressLine1,p => p.errors.addressLine1]} property={['value','error']}>
                    <Input title={'Address line 1'} placeholder={'Type address line 1'}
                           onChange={e => update('addressLine1', e.target.value)}/>
                </StoreValue>
                <StoreValue store={store} selector={[p => p.addressLine2,p => p.errors.addressLine2]} property={['value','error']}>
                    <Input title={'Address line 2'} placeholder={'Type address line 2'}
                           onChange={e => update('addressLine2', e.target.value)}/>
                </StoreValue>
                <div style={{display: 'flex'}}>
                    <div style={{width: '50%'}}>
                        <StoreValue store={store} selector={[p => p.city,p => p.errors.city]} property={['value','error']}>
                            <Input title={'City'} placeholder={'Type city'}
                                   onChange={e => update('city', e.target.value)}/>
                        </StoreValue>
                    </div>
                    <div style={{width: '50%'}}>
                        <StoreValue store={store} selector={[p => p.state,p => p.errors.state]} property={['value','error']}>
                            <Input title={'State'} placeholder={'Select state'}
                                   onChange={e => update('state', e.target.value)}/>
                        </StoreValue>
                    </div>
                </div>
                <div style={{display: 'flex'}}>
                    <div style={{width: '50%'}}>
                        <StoreValue store={store} selector={[p => p.zipCode,p => p.errors.zipCode]} property={['value','error']}>
                            <Input title={'Zip/Postal Code'} placeholder={'Type Zip/Postal code'}
                                   onChange={e => update('zipCode', e.target.value)}/>
                        </StoreValue>
                    </div>
                    <div style={{width: '50%'}}>
                        <StoreValue store={store} selector={[p => p.country,p => p.errors.country]} property={['value','error']}>
                            <Input title={'Country'} placeholder={'Select Country'}
                                   onChange={e => update('country', e.target.value)}/>
                        </StoreValue>
                    </div>
                </div>
                <StoreValue store={store} selector={[p => p.email,p => p.errors.email]} property={['value','error']}>
                    <Input title={'Email'} placeholder={'Type email address here'}
                           onChange={e => update('email', e.target.value)}/>
                </StoreValue>
                <StoreValue store={store} selector={[p => p.phone,p => p.errors.phone]} property={['value','error']}>
                    <Input title={'Phone'} placeholder={'Type phone number here'}
                           onChange={e => update('phone', e.target.value)}/>
                </StoreValue>
                <StoreValue store={store} selector={[p => p.note,p => p.errors.note]} property={['value','error']}>
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
