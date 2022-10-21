import {routes} from "../routes/routes";
import {FunctionComponent, useEffect, useState} from "react";

export interface ParamsAndComponent {
    params: Map<string, string>,
    routeComponent: FunctionComponent<RouteProps>,
    path:string
}

export function useRoute(): ParamsAndComponent {
    const route:[string, any][] = Object.entries(routes);
    const [paramsAndComponent, setParamsRouteComponent] = useState<ParamsAndComponent>(() => getParamsAndComponent(route));

    useEffect(() => {
        const hashChangeListener = () => setParamsRouteComponent(getParamsAndComponent(route));
        window.onhashchange = hashChangeListener;
        // eslint-disable-next-line
    }, []);
    return paramsAndComponent;
}

function getHash() {
    let hash = decodeURI(window.location.hash).trim();
    if (hash.startsWith('#')) {
        hash = hash.substring(1, hash.length);
    }
    return hash
}

export function EmptyComponent() {
    return <></>
}


function getParamsAndComponent( route: [string, (() => JSX.Element)][]) {
    const hash = getHash();
    const hashArray = hash.split('/');
    let params = new Map<string, string>();
    let routeComponent = EmptyComponent;
    let path:string = '';
    if (hashArray.length > 0) {
        let filteredComponents = route.map(([path, component]) => {
            const params: any = {};
            return {paths: path.split('/'), component, params,path}
        });
        for (let i = 0; i < hashArray.length; i++) {
            const value = hashArray[i];

            filteredComponents = filteredComponents.filter(({paths,  params}) => {
                if (paths.length > i) {
                    const key = paths[i];
                    const isVariable = key.indexOf('$') === 0;
                    if (isVariable) {
                        params[key.substring(1, key.length)] = value;
                        return true;
                    }
                    return value === key;
                }
                return false;
            })
        }
        if (filteredComponents.length > 0) {
            const fc = filteredComponents[0];
            params = new Map(Object.entries(fc.params));
            routeComponent = fc.component;
            path = fc.path;
        }
    }
    return {routeComponent, params,path};
}

export interface RouteProps{
    params:Map<string,string>,
    path:string,
    isFocused:boolean
}
