import {useAppContext} from "../useAppContext";
import React from "react";

export function HeaderNavigation() {
    const {appDimension} = useAppContext();
    return <div style={{
        boxSizing: 'border-box',
        boxShadow: '0px -5px 20px -5px rgba(0,0,0,0.2) inset',
        backgroundImage: 'url("/logo/banner-bg.png")',
        width: appDimension.width,
        display: 'flex',
        alignItems:'center'
    }}>
        <div style={{display:'flex',flexDirection:'column',marginTop:5,marginBottom:5}}>
            <div style={{display:'flex',marginLeft:-12}}>
                <img src={'/logo/ultra-fresh-by.svg'} width={200}/>
                <img src={'/logo/marmum-logo.png'} height={30}/>
            </div>
            <img src={'/logo/ultra-fresh-the-freshest-dairy.svg'} width={260}/>
        </div>
    </div>
}