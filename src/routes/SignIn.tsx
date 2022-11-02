import {RouteProps} from "../components/useRoute";
import {Input} from "../components/page-components/Input";
import {Button} from "../components/page-components/Button";
import {MdSms} from "react-icons/md";
import {blue, ButtonTheme, white} from "./Theme";
import {useState} from "react";
import {motion} from "framer-motion";
import {IoClose, IoLogInOutline} from "react-icons/io5";

export function SignIn(props: RouteProps) {
    const [loginWithOtp, setLoginWithOtp] = useState(true);
    return <div style={{height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column',background:'rgba(255,255,255,0.4)'}}>
        <div style={{display: 'flex', flexDirection: 'row-reverse'}}>
            <motion.div style={{fontSize: 36, margin: 20, color: 'rgba(0,0,0,0.6)'}} whileTap={{scale: 0.95}}
                        onTap={() => window.history.back()}>
                <IoClose/>
            </motion.div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 30}}>
            <motion.div style={{
                background: 'rgba(0,0,0,0.03)',
                margin: 10,
                padding: 10,
                borderRadius: 5,
                textDecoration: !loginWithOtp ? 'underline' : 'unset'
            }}
                        animate={{
                            background: loginWithOtp ? blue : white,
                            color: loginWithOtp ? white : 'rgba(0,0,0,0.7)'
                        }}
                        whileTap={{scale: 0.95}}
                        onTap={() => setLoginWithOtp(true)}>
                OTP Login
            </motion.div>
            <motion.div style={{
                background: 'rgba(0,0,0,0.03)',
                margin: 10,
                padding: 10,
                borderRadius: 5,
                textDecoration: loginWithOtp ? 'underline' : 'unset'
            }}
                        whileTap={{scale: 0.95}}
                        animate={{
                            background: !loginWithOtp ? blue : white,
                            color: !loginWithOtp ? white : 'rgba(0,0,0,0.7)'
                        }}
                        onTap={() => setLoginWithOtp(false)}>
                Password Login
            </motion.div>
        </div>
        <motion.div layout style={{display: 'flex', flexDirection: 'column', margin: 30}}>

            <motion.div layout style={{display: 'flex', alignItems: 'flex-end'}}>
                <div style={{marginBottom: 22, fontWeight: 'bold', marginLeft: 10}}>+971</div>
                <Input title={'Enter Mobile number'} placeholder={'501234567'}
                       style={{containerStyle: {borderBottom: 'none', flexGrow: 1}}} type={"number"} inputMode={"tel"}/>
            </motion.div>
            {!loginWithOtp &&
                <motion.div layout>
                    <Input title={'Password'} type={'password'} placeholder={'Please enter password'}
                           style={{containerStyle: {borderBottom: 'none'}}} />
                </motion.div>
            }
            <Button onTap={() => {
            }} title={loginWithOtp ? 'Send OTP' : 'Sign In'} icon={loginWithOtp ? MdSms : IoLogInOutline}
                    theme={ButtonTheme.promoted} style={{marginTop: 10}}/>
        </motion.div>
    </div>
}