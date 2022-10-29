import {CSSProperties, ReactElement, useState} from "react";
import {AppContextProvider} from "./useAppContext";
import {AnimatePresence, motion} from "framer-motion";
import {RouterPageContainer} from "./RouterPageContainer";
import {useCreateStore} from "./store/useCreateStore";
import {storeReducer} from "./AppState";


const shellStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
    overflow: 'auto',
    background: 'radial-gradient(rgba(0,0,0,0.01),rgba(0,0,0,0.02))'
}

const modalStyle: CSSProperties = {
    backgroundColor: 'rgba(0,0,0,0.1)',
    backdropFilter: 'blur(20px)',
    width: '100%',
    height: '100%',
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}

const dialogPanelStyle: CSSProperties = {
    backgroundColor: 'rgba(240,240,240,0.9)',
    minWidth: 100,
    minHeight: 0,
    borderRadius: 5,
    boxShadow: '0 5px 5px -3px rgba(0,0,0,0.1)'
}

export default function AppShell() {
    const [modalPanel, setModalPanel] = useState<ReactElement | false>(false);
    const store = useCreateStore(storeReducer, {
        shoppingCart: []
    });

    return <AppContextProvider setModalPanel={setModalPanel} store={store}>
        <div style={shellStyle}>
            <RouterPageContainer/>
            <AnimatePresence>
                {modalPanel && <motion.div style={modalStyle} initial={{opacity: 0}} animate={{opacity: 1}}
                                           exit={{opacity: 0}} transition={{ease: "easeInOut", duration: 0.3}}
                                           key={'modal'}>
                    <motion.div style={dialogPanelStyle} initial={{y: -30}} animate={{y: 0}} exit={{y: -30}}
                                transition={{ease: "easeInOut", duration: 0.3}}>
                        {modalPanel}
                    </motion.div>
                </motion.div>}
            </AnimatePresence>
        </div>
    </AppContextProvider>
}
