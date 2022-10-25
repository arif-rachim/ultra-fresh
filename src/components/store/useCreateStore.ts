import {
    cloneElement,
    Dispatch,
    MutableRefObject,
    PropsWithChildren,
    SetStateAction,
    useEffect,
    useRef,
    useState
} from "react";

type Listener = (param: any) => void

export interface Action {
    type: string,
    payload: any,

    [key: string]: any
}

export interface Store<S> {
    stateRef: MutableRefObject<S>,
    addListener: (state: any) => () => void,
    dispatch: (action: Action) => void
}

export function useCreateStore<S>(reducer: (action: Action) => (oldState: S) => S,
                                  initializer: S | (() => S)): Store<S> {

    const listenerRef = useRef<Listener[]>([]);


    const [initialState] = useState<S>(() => {
        let stateInitial: any = initializer;
        if (isFunction(initializer)) {
            stateInitial = (initializer as any)();
        }
        return stateInitial as S;
    });
    const stateRef = useRef<S>(initialState);

    function dispatch(action: Action) {
        const newState = reducer(action)(stateRef.current);
        stateRef.current = newState;
        listenerRef.current.forEach(l => l.call(null, newState));
    }

    function addListener(selector: (param: S) => any) {
        listenerRef.current.push(selector);
        return () => listenerRef.current.splice(listenerRef.current.indexOf(selector, 1))
    }

    return {dispatch, stateRef, addListener}
}

function updateNextState<S, T>(setValue: Dispatch<SetStateAction<S>>, selector: (param: T) => S, nextState: any, compareArrayContent: boolean) {
    setValue(currentValue => {
        const nextValue = selector(nextState);
        if (compareArrayContent && Array.isArray(nextValue) && Array.isArray(currentValue) && nextValue.length === currentValue.length) {
            const isMatch = (currentValue as any[]).reduce((match, val, index) => (match && val === nextValue[index]), true);
            if (isMatch) {
                return currentValue;
            }
        }
        return nextValue;
    });
}

export function useStoreValue<T, S>(store: Store<T>, selector: (param: T) => S, config?: { compareArrayContent: boolean }) {
    const [value, setValue] = useState<S>(() => selector(store.stateRef.current));
    const compareArrayContent = config?.compareArrayContent ?? false;
    const {addListener, stateRef} = store;
    const propsRef = useRef({compareArrayContent, selector});
    propsRef.current = {compareArrayContent, selector};
    useEffect(() => {
        return addListener((nextState: any) => {
            const {compareArrayContent, selector} = propsRef.current;
            updateNextState(setValue, selector, nextState, compareArrayContent);
        });
    }, [addListener])
    useEffect(() => updateNextState(setValue, propsRef.current.selector, stateRef.current, propsRef.current.compareArrayContent), [selector])
    return value;
}

function isFunction(functionToCheck: any) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

type Selector<T, S> = (param: T) => S;

export function StoreValue<T, S>(props: PropsWithChildren<{ store: Store<T>, selector: (Selector<T, S> | Selector<T, S>[]), property: (string | string[]) }>) {
    const {store, property, selector, children} = props;
    //const prop: string = property as string;
    if(Array.isArray(selector) || Array.isArray(property)){
        if(!(Array.isArray(selector) && Array.isArray(property))){
            throw new Error('Expecting both selector and property are either both array or single');
        }
        if(selector.length !== property.length){
            throw new Error('Expecting both selector and property have same array length');
        }
    }
    const value:any = useStoreValue(store, (param) => {
        if(Array.isArray(selector)){
            return selector.map(s => s(param));
        }
        return selector(param);
    },{compareArrayContent:true});
    const childrenAny: any = children;
    const childrenProps = {...childrenAny};
    if(Array.isArray(property)){
        property.forEach((props,index) => {
            childrenProps[props] = value[index];
        })
    }else{
        childrenProps[property] = value;
    }
    return cloneElement(childrenAny, childrenProps)

}