import React, {createContext, useMemo} from 'react';
import './App.css';

import AppShell from "./components/AppShell";

export const WindowSizeContext = createContext<{ width: number, height: number }>({width: 0, height: 0})

function App() {

    let {width,height} = useMemo(() => ({width:window.innerWidth,height:window.innerHeight}),[]);

    const isSimulator = width > 490;
    if(width > 490){
        width = 390;
        height = 844;
    }

    return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
        {isSimulator &&
        <div style={{display:'flex',flexDirection:'column',flexGrow:1}}>
            <div style={{margin:30}}>
            <div style={{fontSize:90}}>Ultra Fresh</div>
            <div>By Marmum</div>
            <div>As Gemba final project candidate Windy Des Nadian</div>
            </div>
        </div>}
        <WindowSizeContext.Provider value={{height, width}}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                background: 'rgba(0,0,0,1)',
                boxShadow : '0 0 3px 2px rgba(255,255,255,0.5) inset, 0px 5px 5px -3px rgba(0,0,0,0.3)',
                borderRadius: isSimulator?30:0,
                transform : isSimulator ? 'scale(0.8)' : 'unset'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height,
                    width,
                    flexShrink:0,
                    overflow: 'hidden',
                    margin: isSimulator?10:0,
                    borderRadius: isSimulator ? 20 : 0
                }}>
                    <AppShell/>
                </div>
            </div>
        </WindowSizeContext.Provider>
    </div>
}

export default App;
