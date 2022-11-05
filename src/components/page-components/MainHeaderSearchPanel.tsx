import {useAppContext} from "../useAppContext";
import React from "react";

export function MainHeaderSearchPanel() {
    const {appDimension} = useAppContext();
    return <div style={{
        boxSizing: 'border-box',
        boxShadow:'0px -5px 20px -5px rgba(0,0,0,0.2) inset',
        backgroundImage: 'url("/logo/banner-bg.png")',
        width: appDimension.width,
        display: 'flex',
        flexDirection:'row-reverse',
        paddingLeft: 5,
        paddingRight: 5
    }}>
        <div style={{padding:5}}>
        <img src={'/logo/marmum-logo.png'} width={80} height={40} />
        </div>

    </div>
}