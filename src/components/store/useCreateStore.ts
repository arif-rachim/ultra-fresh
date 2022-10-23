import {MutableRefObject, useEffect, useRef, useState} from "react";

type Listener = (param: any) => void

export interface Action{
    type:string,
    payload:any,
    [key:string] : any
}

export interface Store<S> {
    stateRef: MutableRefObject<S>,
    addListener: (state: any) => () => void,
    dispatch: (action: Action) => void
}

export function useCreateStore<S>(reducer: (action: Action) => (oldState:S) => S,
                                                    initializer: S | (() => S) ): Store<S> {

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
        listenerRef.current.forEach(l => l.call(null,newState));
    }

    function addListener(selector: (param: S) => any) {
        listenerRef.current.push(selector);
        return () => listenerRef.current.splice(listenerRef.current.indexOf(selector, 1))
    }

    return {dispatch, stateRef, addListener}
}

export function useStoreValue<T, S>(store: Store<T>, selector: (param: T) => S) {
    const [value, setValue] = useState<S>(() => selector(store.stateRef.current));
    const {addListener,stateRef} = store;
    useEffect(() => {
        return addListener((newValue: any) => {
            setValue(selector(newValue));
        });
    }, [addListener,selector])
    useEffect(() => setValue(selector(stateRef.current)), [selector,stateRef])
    return value;
}

function isFunction(functionToCheck: any) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}