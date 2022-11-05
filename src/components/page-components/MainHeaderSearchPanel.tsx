import {useAppContext} from "../useAppContext";
import React from "react";

export function MainHeaderSearchPanel() {
    const {appDimension} = useAppContext();
    return <div style={{
        boxSizing: 'border-box',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
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