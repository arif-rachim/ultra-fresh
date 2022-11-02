import React, {createContext, useMemo} from 'react';
import './App.css';
import {supabase} from "./components/supabase";

import AppShell from "./components/AppShell";

export const WindowSizeContext = createContext<{ width: number, height: number }>({width: 0, height: 0})

function App() {
    console.log(supabase);
    let {width, height} = useMemo(() => ({width: window.innerWidth, height: window.innerHeight}), []);

    const isSimulator = width > 490;
    if (width > 490) {
        width = 390;
        height = 844;
    }


    return <div style={{display: 'flex', height: '100%', overflow: 'auto'}}>
        {isSimulator &&
            <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1,justifyContent:'center'}}>
                <div style={{margin: 60,marginTop:0}}>
                    <div style={{fontSize: 90}}>Ultra Fresh</div>
                    <div style={{fontSize:40}}>By Marmum</div>
                    <div>Build and designed by Windy Des Nadian for INSEAD GEMBA Final Project.</div>
                </div>
            </div>}
        <WindowSizeContext.Provider value={useMemo(() => ({width, height}), [height, width])}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                height,
                width,
                flexShrink: 0,
                overflow: 'auto',
                margin: isSimulator ? 10 : 0,
                borderRadius: isSimulator ? 30 : 0,
                transform: isSimulator ? 'scale(0.8)' : 'unset',
                border: isSimulator ? '10px solid rgba(0,0,0,1)' : 'none',
                marginRight : isSimulator ? 50 : 0,
            }}>
                <AppShell/>
            </div>
        </WindowSizeContext.Provider>
    </div>
}

export default App;
