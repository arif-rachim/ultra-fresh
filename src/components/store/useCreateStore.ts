import {
    ComponentType,
    createElement,
    DependencyList,
    MutableRefObject,
    PropsWithChildren,
    useCallback,
    useEffect,
    useMemo,
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
    const reducerRef = useRef(reducer)
    reducerRef.current = reducer;

    const [initialState] = useState<S>(() => {
        let stateInitial: any = initializer;
        if (isFunction(initializer)) {
            stateInitial = (initializer as any)();
        }
        return stateInitial as S;
    });
    const stateRef = useRef<S>(initialState);

    const dispatch = useCallback(function dispatch(action: Action) {
        const newState = reducerRef.current(action)(stateRef.current);
        if (newState === stateRef.current) {
            return;
        }
        stateRef.current = newState;
        listenerRef.current.forEach(l => l.call(null, newState));
    }, []);

    const addListener = useCallback(function addListener(selector: (param: S) => any) {
        listenerRef.current.push(selector);
        return () => listenerRef.current.splice(listenerRef.current.indexOf(selector, 1))
    }, []);

    return useMemo(() => ({dispatch, stateRef, addListener}), [addListener, dispatch])
}

export function useStoreValue<T, S>(store: Store<T>, selector: (param: T) => S, deps?: DependencyList | undefined) {
    const [value, setValue] = useState<S>(() => selector(store.stateRef.current));

    const {addListener, stateRef} = store;
    const propsRef = useRef({selector});
    propsRef.current = {selector};
    useEffect(() => {
        return addListener((nextState: any) => {
            const {selector} = propsRef.current;
            setValue(selector(nextState));
        });
    }, [])
    useEffect(() => setValue(selector(stateRef.current)), deps)
    return value;
}

function isFunction(functionToCheck: any) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

type Selector<T, S> = (param: T) => S;

interface StoreValueProps<T, S, PropsType> {
    store: Store<T>,
    selector: (Selector<T, S> | Selector<T, S>[]),
    property: (string | string[]),
    component: ComponentType<PropsType>
}

export function StoreValue<T, S, PT, Z extends PT>(props: PropsWithChildren<StoreValueProps<T, S, PT> & Z>) {
    const {store, property, selector, component, ...cp} = props;
    if (Array.isArray(selector) || Array.isArray(property)) {
        if (!(Array.isArray(selector) && Array.isArray(property))) {
            throw new Error('Expecting both selector and property are either both array or single');
        }
        if (selector.length !== property.length) {
            throw new Error('Expecting both selector and property have same array length');
        }
    }
    const value: any = useStoreValue(store, (param) => {
        if (Array.isArray(selector)) {
            return selector.map(s => s(param));
        }
        return selector(param);
    }, [selector]);
    const Component: any = component;
    const childrenProps: any = {...cp};
    if (Array.isArray(property)) {
        property.forEach((props, index) => {
            childrenProps[props] = value[index];
        })
    } else {
        childrenProps[property] = value;
    }
    return createElement(Component, childrenProps)

}