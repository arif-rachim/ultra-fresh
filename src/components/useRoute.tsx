import {routes} from "../routes/routes";
import {FunctionComponent, memo, MemoExoticComponent, ReactElement, useEffect, useState} from "react";
import {TargetAndTransition} from "framer-motion";

export interface ParamsAndComponent {
    params: Map<string, string>,
    routeComponent: FunctionComponent<RouteProps>,
    path: string,
    onVisible: TargetAndTransition,
    onHidden: TargetAndTransition
}

export function useRoute(): ParamsAndComponent {
    const route: [string, RouteElement | MotionRouteElement][] = Object.entries(routes);
    const [paramsAndComponent, setParamsRouteComponent] = useState<ParamsAndComponent>(() => getParamsAndComponent(route));
    useEffect(() => {
        const hashChangeListener = () => setParamsRouteComponent(getParamsAndComponent(route));
        window.addEventListener('hashchange', hashChangeListener)
        return () => window.removeEventListener('hashchange', hashChangeListener)
    }, [route]);
    return paramsAndComponent;
}

function getHash() {
    let hash = decodeURI(window.location.hash).trim();
    if (hash.startsWith('#')) {
        hash = hash.substring(1, hash.length);
    }
    return hash
}

function EmptyComponent(props: RouteProps) {
    return <></>
}

interface FilteredComponents {
    paths: string[],
    params: Map<string, any>,
    path: string,
    component: RouteElement,
    onVisible: TargetAndTransition,
    onHidden: TargetAndTransition
}

let defaultOnVisible: TargetAndTransition = {
    opacity: 1,
    zIndex: 0
};

let defaultOnHidden: TargetAndTransition = {
    opacity: 0,
    zIndex: -1
};

function getParamsAndComponent(route: [string, RouteElement | MotionRouteElement][]): ParamsAndComponent {
    const hash = getHash();
    const hashArray = hash.split('/');
    let params = new Map<string, string>();
    let routeComponent: MemoExoticComponent<RouteElement> = memo(EmptyComponent);
    let path: string = '';
    let onVisible: TargetAndTransition = defaultOnVisible;
    let onHidden: TargetAndTransition = defaultOnHidden;
    if (hashArray.length > 0) {
        let filteredComponents: FilteredComponents[] = route.map(([path, componentOrMotionComponent]) => {
            const params: Map<string, any> = new Map();
            let component: RouteElement | undefined;
            let onVisible: TargetAndTransition = defaultOnVisible;
            let onHidden: TargetAndTransition = defaultOnHidden;
            if ('component' in componentOrMotionComponent) {
                component = (componentOrMotionComponent as MotionRouteElement).component;
                onVisible = (componentOrMotionComponent as MotionRouteElement).onVisible;
                onHidden = (componentOrMotionComponent as MotionRouteElement).onHidden;
            } else {
                component = componentOrMotionComponent as RouteElement;
            }
            return {paths: path.split('/'), component, params, path, onVisible, onHidden}
        });
        for (let i = 0; i < hashArray.length; i++) {
            const value = hashArray[i];
            filteredComponents = filteredComponents.filter(({paths, params}) => {
                if (paths.length > i) {
                    const key = paths[i];
                    const isVariable = key.indexOf('$') === 0;
                    if (isVariable) {
                        params.set(key.substring(1, key.length), value);
                        return true;
                    }
                    return value === key;
                }
                return false;
            })
        }
        if (filteredComponents.length > 0) {
            const fc = filteredComponents[0];
            params = fc.params;
            routeComponent = memo(fc.component, (prevProps: any, nextProps: any) => mapsAreEqual(prevProps.params, nextProps.params));
            path = fc.path;
            onVisible = fc.onVisible;
            onHidden = fc.onHidden;
        }
    }
    return {routeComponent, params, path, onVisible, onHidden};
}

export interface RouteProps {
    params: Map<string, string>,
    path: string
}

const mapsAreEqual = (m1: Map<string, any>, m2: Map<string, any>) => m1.size === m2.size && Array.from(m1.keys()).every((key) => m1.get(key) === m2.get(key));
export type RouteElement = (props: RouteProps) => ReactElement;

interface MotionRouteElement {
    component: RouteElement,
    onVisible: TargetAndTransition,
    onHidden: TargetAndTransition
}

export interface Routes {
    [key: string]: RouteElement | MotionRouteElement
}