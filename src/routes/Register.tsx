import {motion} from "framer-motion";
import {IoClose} from "react-icons/io5";
import {RouteProps} from "../components/useRoute";
import {Input} from "../components/page-components/Input";
import {Button} from "../components/page-components/Button";
import {AiOutlineUser} from "react-icons/ai";
import {ButtonTheme} from "./Theme";

export function Register(props: RouteProps) {
    return <div style={{height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column',background:'rgba(255,255,255,0.4)'}}>
        <div style={{display: 'flex', flexDirection: 'row-reverse'}}>
            <motion.div style={{fontSize: 36, margin: 20, color: 'rgba(0,0,0,0.6)'}} whileTap={{scale: 0.95}}
                        onTap={() => window.history.back()}>
                <IoClose/>
            </motion.div>
        </div>
        <div style={{height: '100%', display: "flex", flexDirection: 'column'}}>
            <div style={{display: 'flex'}}>
                <div style={{display: 'flex', flexDirection: 'column', width: '50%'}}>
                    <Input title={'First Name'} placeholder={'Type your first name'}/>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', width: '50%'}}>
                    <Input title={'Last Name'} placeholder={'Type your last name'}/>
                </div>
            </div>
            <Input title={'Nationality'} placeholder={'Type your nationality'}/>
            <div style={{display: 'flex', alignItems: 'flex-end'}}>
                <div style={{marginBottom: 22, fontWeight: 'bold', marginLeft: 10}}>+971</div>
                <Input title={'Enter Mobile number'} placeholder={'501234567'}
                       style={{containerStyle: {borderBottom: 'none', flexGrow: 1}}}/>
            </div>
            <Input title={'Email Address'} placeholder={'Enter your email address'}/>
            <Input title={'Password'} placeholder={'Enter your password'}/>
            <Input title={'Referral Code'} placeholder={'Enter your referral code'}/>
            <div style={{display: 'flex', flexDirection: 'column', padding: 20}}>
                <Button title={'Register'} icon={AiOutlineUser} theme={ButtonTheme.promoted} onTap={() => {
                }}/>
            </div>
        </div>
    </div>
}