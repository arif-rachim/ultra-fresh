import {RouteProps} from "../components/useRoute";
import {Header} from "../components/page-components/Header";

import {RiAppleLine, RiGoogleLine, RiMastercardLine, RiVisaLine} from "react-icons/ri";
import {blueDarken, white} from "./Theme";
import {Input} from "../components/page-components/Input";
import {Button} from "../components/page-components/Button";
import {IoCardOutline} from "react-icons/io5";
import {useSubTotalCart} from "./Cart";
import {useCallback} from "react";
export default function Payment(props: RouteProps) {
    const subTotal = useSubTotalCart();
    const performPayment = useCallback(() => {
        // disini kita simpen transaksinya
        // kemudian
    },[]);
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
            <div style={{display: 'flex', flexDirection: 'column', margin: '0px 25px 0 25px',background:'white',borderRadius:5,boxShadow:'0 3px 5px -3px rgba(0,0,0,0.2)'}}>
                <Input title={'Card Number'} placeholder={'Enter your card Number here'}/>
                <div style={{display: 'flex'}}>
                    <div style={{width: '70%'}}>
                        <Input title={'Valid Until'} placeholder={'Valid Until'}/>
                    </div>
                    <div style={{width: '30%'}}>
                        <Input title={'CVV'} placeholder={'xxx'}/>
                    </div>
                </div>
                <Input title={'Card Holder Name'} placeholder={'Enter your card Number here'}/>
            </div>
            <div style={{margin:'20px 20px',alignItems:'center',justifyContent:'center',display:'flex'}}>
                <Button title={`Pay AED ${subTotal}`} onTap={() => {
                    performPayment();
                }} icon={IoCardOutline} style={{fontSize:20,padding:'15px 50px'}} />
            </div>
        </div>
    </div>
}