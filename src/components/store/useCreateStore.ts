import {MutableRefObject, useEffect, useRef, useState} from "react";

type AddReducerCallback = <P, S>(reducerCallback: Callback<P, S>) => () => void;
type Listener = (param: any) => void

interface Store<T> {
    stateRef: MutableRefObject<T>,
    addListener: (state: any) => () => void,
    dispatch: (type: string, payload: any) => void
}

type Callback<P, S> = (action: string, payload: P) => (state: S) => S

export function useCreateStore<T>(initial: (addReducer: AddReducerCallback) => () => T): Store<T> {
    const callbacksRef = useRef<Callback<any, any>[]>([]);
    const listenerRef = useRef<Listener[]>([]);

    function dispatch(type: string, payload: any) {
        const callbacksFunctions = callbacksRef.current.map(cb => {
            return cb.call(null, type, payload);
        });
        let oldVal: any = stateRef.current;
        for (const cb of callbacksFunctions) {
            oldVal = cb.call(null, oldVal);
        }
        stateRef.current = oldVal;
        listenerRef.current.forEach(l => l.call(null, stateRef.current))
    }


    const [initialState] = useState<any>(() => {
        function addReducer<P, S>(reducerCallback: Callback<P, S>) {
            callbacksRef.current.push(reducerCallback);
            return () => {
                callbacksRef.current.splice(callbacksRef.current.indexOf(reducerCallback), 1)
            }
        }

        const stateInitial = initial(addReducer);
        return stateInitial();
    });

    const stateRef = useRef(initialState);

    function addListener(selector: (param: any) => any) {
        listenerRef.current.push(selector);
        return () => listenerRef.current.splice(listenerRef.current.indexOf(selector, 1))
    }

    return {dispatch, stateRef, addListener}
}

export function useStoreValue<T, R>(store: Store<T>, selector: (param: T) => R) {
    const [value, setValue] = useState<R>(() => selector(store.stateRef.current));
    const {addListener} = store;
    useEffect(() => {
        return addListener((newValue: any) => {
            setValue(selector(newValue));
        });
        // eslint-disable-next-line
    }, [addListener])

    return value;
}