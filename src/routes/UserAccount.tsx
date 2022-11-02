import {Header} from "../components/page-components/Header";
import {motion} from "framer-motion";
import {IoLogInOutline} from "react-icons/io5";
import {AiOutlineUserAdd} from "react-icons/ai";
import {blueDarken, white} from "./Theme";
import {useNavigate} from "../components/useNavigate";

export function UserAccount() {
    const navigate = useNavigate();
    return <div style={{display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden'}}>
        <Header title={'User Account Information'}/>
        <div style={{display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto', marginBottom: 52}}>

            <div style={{margin: 20}}>
                <div style={{fontSize: 26, marginBottom: 10}}>
                    You are anonymous.
                </div>
                You have been logged in as a guess at this time. Logging in or registering for an account with the
                system
                is necessary in order to be able to execute checkout, or remember your previous transactions.
            </div>


            <div style={{display: 'flex'}}>
                <motion.div style={{
                    margin: 20,
                    border: '1px solid rgba(0,0,0,0.1)',
                    padding: 10,
                    width: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    borderRadius: 10,
                    flexDirection: 'column',
                    background:'rgba(255,255,255,0.2)'
                }} whileTap={{scale: 0.95}} onTap={() => navigate('sign-in')}>
                    <div style={{
                        fontSize: 30,
                        backgroundColor: blueDarken,
                        color: white,
                        padding: '5px 8px 5px 2px',
                        width: 30,
                        height: 30,
                        borderRadius: 50
                    }}>
                        <IoLogInOutline/>
                    </div>
                    <div>Sign In</div>
                </motion.div>
                <motion.div style={{
                    margin: 20,
                    border: '1px solid rgba(0,0,0,0.1)',
                    padding: 10,
                    width: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    borderRadius: 10,
                    flexDirection: 'column',
                    background:'rgba(255,255,255,0.2)'
                }} whileTap={{scale: 0.95}} onTap={() => navigate('register')}>
                    <div style={{
                        fontSize: 30,
                        backgroundColor: blueDarken,
                        color: white,
                        padding: 5,
                        width: 30,
                        height: 30,
                        borderRadius: 50
                    }}>
                        <AiOutlineUserAdd/>
                    </div>
                    <div>Register</div>
                </motion.div>
            </div>

        </div>
    </div>
}