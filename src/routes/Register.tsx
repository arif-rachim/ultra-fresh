import {motion} from "framer-motion";
import {IoClose} from "react-icons/io5";
import {RouteProps} from "../components/useRoute";
import {Input} from "../components/page-components/Input";
import {Button} from "../components/page-components/Button";
import {AiOutlineUser} from "react-icons/ai";
import {ButtonTheme} from "./Theme";
import {StoreValue, useCreateStore} from "../components/store/useCreateStore";
import {produce} from "immer";
import {useCallback, useEffect, useState} from "react";
import {isNotEmptyText} from "./ShippingAddress";
import {signIn, updateProfile, verifyPin} from "../supabase";
import {useAppContext} from "../components/useAppContext";
import {OtpInput} from "../components/page-components/OtpInput";
import {supabase} from "../components/supabase";

export function Register(props: RouteProps) {
    const localStore = useCreateStore({
        firstName: '',
        lastName: '',
        nationality: '',
        phoneNo: '',
        email: '',
        password: '',
        referralCode: '',
        errors : {
            firstName: '',
            lastName: '',
            nationality: '',
            phoneNo: '',
            email: '',
            password: ''
        }
    });
    const validate = useCallback(() => {
        localStore.setState(produce(state => {
            state.errors.email = isNotEmptyText(state.email) ? '' : 'Email is required';
            state.errors.firstName = isNotEmptyText(state.firstName) ? '' : 'First Name is required';
            state.errors.lastName = isNotEmptyText(state.lastName) ? '' : 'Last Name is required';
            state.errors.nationality = isNotEmptyText(state.nationality) ? '' : 'Nationality is required';
            state.errors.phoneNo = isNotEmptyText(state.phoneNo) ? '' : 'Phone No is required';
            state.errors.password = isNotEmptyText(state.password) ? '' : 'Password is required';
            if(state.password.length < 6){
                state.errors.password = 'Password should be at least 6 characters';
            }

        }));
        const state = localStore.stateRef.current;
        const hasError = Object.keys(state.errors).reduce((hasError, key) => {
            return hasError || ((state.errors as any)[key]).toString().length > 0
        }, false);
        return !hasError;
    },[localStore]);
    const {showModal,refreshSession} = useAppContext();
    return <div style={{display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.4)'}}>
        <div style={{display: 'flex', flexDirection: 'row-reverse'}}>
            <motion.div style={{fontSize: 36, margin: 20, color: 'rgba(0,0,0,0.6)'}} whileTap={{scale: 0.95}}
                        onTap={() => window.history.back()}>
                <IoClose/>
            </motion.div>
        </div>
        <div style={{height: '100%', display: "flex", flexDirection: 'column'}}>
            <div style={{display: 'flex'}}>
                <div style={{display: 'flex', flexDirection: 'column', width: '50%'}}>
                    <StoreValue store={localStore} property={['value','error']} selector={[s => s.firstName,s => s.errors.firstName]}>
                        <Input title={'First Name'} placeholder={'Type your first name'} onChange={e => {
                            localStore.setState(produce(s => {
                                s.firstName = e.target.value;
                                s.errors.firstName = isNotEmptyText(e.target.value) ? '' : 'First Name is required';
                            }))
                        }}/>
                    </StoreValue>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', width: '50%'}}>
                    <StoreValue store={localStore} selector={[s => s.lastName,s => s.errors.lastName]} property={['value','error']}>
                        <Input title={'Last Name'} placeholder={'Type your last name'} onChange={e => {
                            localStore.setState(produce(s => {
                                s.lastName = e.target.value;
                                s.errors.lastName = isNotEmptyText(e.target.value) ? '' : 'First Name is required';
                            }));
                        }}/>
                    </StoreValue>
                </div>
            </div>
            <StoreValue store={localStore} selector={[s => s.nationality,s => s.errors.nationality]} property={['value','error']}>
                <Input title={'Nationality'} placeholder={'Type your nationality'} onChange={e => {
                    localStore.setState(produce(s => {
                        s.nationality = e.target.value;
                        s.errors.nationality = isNotEmptyText(e.target.value) ? '' : 'First Name is required';
                    }));
                }}/>
            </StoreValue>
            <div style={{display: 'flex', alignItems: 'flex-end'}}>
                <div style={{marginBottom: 22, fontWeight: 'bold', marginLeft: 10}}>+971</div>
                <StoreValue store={localStore} selector={[s => s.phoneNo,s => s.errors.phoneNo]} property={['value','error']}>
                    <Input title={'Enter Mobile number'} placeholder={'501234567'} inputMode={'tel'} type={'number'}
                           style={{containerStyle: {borderBottom: 'none', flexGrow: 1}}} onChange={e => {
                        localStore.setState(produce(s => {
                            s.phoneNo = e.target.value;
                            s.errors.phoneNo = isNotEmptyText(e.target.value) ? '' : 'First Name is required';
                        }));
                    }}/>
                </StoreValue>
            </div>
            <StoreValue store={localStore} selector={[s => s.email,s => s.errors.email]} property={['value','error']}>
                <Input title={'Email Address'} type={'email'} inputMode={'email'}
                       placeholder={'Enter your email address'} onChange={e => {
                    localStore.setState(produce(s => {
                        s.email = e.target.value;
                        s.errors.email = isNotEmptyText(e.target.value) ? '' : 'First Name is required';
                    }));
                }}/>
            </StoreValue>
            <StoreValue store={localStore} selector={[s => s.password,s => s.errors.password]} property={['value','error']}>
                <Input title={'Password'} type={'password'} placeholder={'Enter your password'} onChange={e => {
                    localStore.setState(produce(s => {
                        s.password = e.target.value;
                        s.errors.password = isNotEmptyText(e.target.value) ? '' : 'First Name is required';
                    }));
                }}/>
            </StoreValue>
            <StoreValue store={localStore} selector={s => s.referralCode} property={'value'}>
                <Input title={'Referral Code'} placeholder={'Enter your referral code'} onChange={e => {
                    localStore.setState(produce(s => {
                        s.referralCode = e.target.value;
                    }));
                }}/>
            </StoreValue>
            <div style={{display: 'flex', flexDirection: 'column', padding: 20}}>
                <Button title={'Register'} icon={AiOutlineUser} theme={ButtonTheme.promoted} onTap={async () => {

                    if(validate()){
                        await supabase.auth.signOut();

                        const state = localStore.stateRef.current;
                        let phone = '+971'+state.phoneNo;
                        let {email,password,referralCode,nationality,firstName,lastName} = state;
                        const {user,error} = await signIn({phone});
                        if(error){
                            localStore.setState(produce(state => {
                                state.errors.phoneNo = error.message;
                            }));
                            return;
                        }
                        debugger;
                        if(user.user === null){
                            const otp = await showModal(closePanel => {
                                return <ValidatingOtp closePanel={closePanel} phone={phone} />
                            });
                            if(otp === false){
                                return;
                            }
                            await updateProfile({email,firstName,lastName,nationality,password,referralCode});
                            refreshSession();
                            window.history.back();
                        }else{
                            console.log('WE JUST NEED TO VALIDATE YOU !')
                            debugger;
                        }



                    }
                }}/>
            </div>
        </div>
    </div>
}

function ValidatingOtp(props:{closePanel:(result:any) => void,phone:string}){
    const [value,setValue] = useState('');
    const {phone,closePanel} = props;
    const [disabled,setDisabled] = useState(false);
    const [errMessage,setErrMessage] = useState('');
    useEffect(() => {
        (async () => {
            if(value.length === 6){
                setDisabled(true);
                const result = await verifyPin({phone,token:value});
                if(result.error){
                    setErrMessage(result.error.message);
                    setDisabled(false);
                    setValue('');
                    return;
                }
                closePanel(true);
            }
        })();
    },[value,closePanel,phone])
    return <div style={{display:'flex',position:'relative',flexDirection:'column',padding:20,margin:20,backgroundColor:'white',borderRadius:20,boxShadow:'0 5px 10px -7px rgba(0,0,0,1)',border:'1px solid rgba(0,0,0,0.1)'}}>
            <div style={{display:'flex'}}>
            <div style={{display:'flex',flexDirection:'column',marginBottom:10,flexGrow:1}}>
                <div style={{fontSize:16,marginBottom:5}}>
                    OTP has been sent to :
                </div>
                <div style={{display:'flex'}}>
                <div style={{flexGrow:1}}>{phone}</div>
                <div style={{color:'red'}}>{errMessage}</div>
                </div>
            </div>
            </div>
        <motion.div onTap={() => {closePanel(false)}} style={{position:'absolute',top:10,right:10}}>
            <IoClose />
        </motion.div>
            <OtpInput onChange={setValue} value={value} valueLength={6} disabled={disabled} />

    </div>
}