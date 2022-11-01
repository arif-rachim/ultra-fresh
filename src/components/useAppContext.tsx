import {createContext, Dispatch, PropsWithChildren, ReactElement, useCallback, useContext, useMemo} from "react";
import {maxWidth} from "./RouterPageContainer";
import {Store} from "./store/useCreateStore";
import {AppState} from "./AppState";


export function useAppContext() {
    return useContext(AppContext);
}

interface Dimension {
    width: number,
    height: number
}

interface AppContextType {
    appDimension: Dimension,
    appType: AppType,
    showModal: <T>(factoryFunction: FactoryFunction<T>) => Promise<T>,
    store: Store<AppState>
}


enum AppType {
    Mobile,
    Tablet,
    Laptop,
    Desktop
}


const Nothing: any = () => {
}
const AppContext = createContext<AppContextType>({
        appDimension: {width: 0, height: 0},
        appType: AppType.Mobile,
        showModal: Nothing,
        store: {
            dispatch: Nothing,
            stateRef: {
                current: {
                    shoppingCart: [],
                    shippingAddress: {
                        addressLine2: '',
                        state: '',
                        addressLine1: '',
                        city: '',
                        firstName: '',
                        country: '',
                        email: '',
                        lastName: '',
                        note: '',
                        phone: '',
                        zipCode: ''
                    },
                    orders: [],
                    cardInfo: {
                        cardNumber: '',
                        cardHolderName: '',
                        validUntil: ''
                    }
                }
            }, addListener: (state: any) => Nothing,
            setState: Nothing
        }
    }
);

type FactoryFunction<T> = (closePanel: (val: T) => void) => ReactElement;

export function AppContextProvider<State extends AppState>(props: PropsWithChildren<{
    setModalPanel: Dispatch<ReactElement | false>, store: Store<State>
}>) {
    const {setModalPanel, store} = props;
    const showModal = useCallback((factory: FactoryFunction<any>) => {
        return new Promise<any>(resolve => {
            const closePanel = (value: any) => {
                setModalPanel(false);
                resolve(value);
            }
            const element = factory(closePanel);
            setModalPanel(element)
        })
    }, [setModalPanel]);

    const contextValue = useMemo(() => {
        const appDimension: Dimension = {
            height: window.innerHeight,
            width: window.innerWidth
        };
        if (appDimension.width > maxWidth) {
            appDimension.width = maxWidth
        }
        let appType = AppType.Desktop;
        if (appDimension.width < 480) {
            appType = AppType.Mobile
        }

        if (appDimension.width < 768) {
            appType = AppType.Tablet
        }

        if (appDimension.width < 1024) {
            appType = AppType.Laptop
        }

        return {appDimension, appType, showModal, store}
    }, [showModal, store]);

    return <AppContext.Provider value={contextValue as any}>
        {props.children}
    </AppContext.Provider>
}
