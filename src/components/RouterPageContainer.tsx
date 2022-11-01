import {RouteProps, useRoute} from "./useRoute";
import {createContext, CSSProperties, FunctionComponent, useContext, useEffect, useMemo, useState} from "react";
import {motion, Target} from "framer-motion";
import {produce} from "immer";

export const maxWidth = 480;

/**
 * Router Page Container
 * @constructor
 */
export function RouterPageContainer() {
    const [components, setComponents] = useState<PathAbleComponent[]>([]);
    const {params, routeComponent: RouteComponent, path, onVisible, onHidden,routeFooterComponent:RouteFooterComponent} = useRoute();
    const Component = useMemo(() => function RouteComponentContainer(props: { isFocused: boolean } & RouteProps) {
        return <motion.div
            initial={onHidden as Target}
            style={{position: 'absolute', height: '100%', width: '100%', overflow: 'auto'}}
            animate={props.isFocused ? onVisible : onHidden}
        >
            <RouteComponent params={props.params} path={props.path}/>
        </motion.div>
        // eslint-disable-next-line
    }, [RouteComponent]);

    useEffect(() => {
        setComponents(produce(draft => {
            const currentIndex = draft.findIndex(old => old.path === path);
            if (currentIndex >= 0) {
                draft[currentIndex].params = params;
            } else {
                draft.push({params, path, component: Component});
            }
        }))
    }, [Component, path, params]);

    return <CurrentActivePathContext.Provider value={path}>
        <div style={{
            maxWidth: maxWidth,
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            position: 'relative',
            flexGrow: 1,
            display:'flex',
            flexDirection:'column'
        }}>
            {components.map((c) => {
                const Component = c.component;
                const isFocused = c.path === path;
                return <Component key={c.path} params={c.params} path={c.path} isFocused={isFocused}/>
            })}
            <div style={{position:'absolute',bottom:0,width:'100%'}}>
                <RouteFooterComponent path={path} params={params}/>
            </div>
        </div>
    </CurrentActivePathContext.Provider>
}

interface PathAbleComponent {
    component: FunctionComponent<{ isFocused: boolean } & RouteProps>,
    path: string,
    params: Map<string, string>
}

const CurrentActivePathContext = createContext('');

export function useFocusListener(path: string) {
    const currentActivePath = useContext(CurrentActivePathContext);
    const [isFocused, setIsFocused] = useState<boolean>(currentActivePath === path);
    useEffect(() => setIsFocused(currentActivePath === path), [path, currentActivePath]);
    return isFocused;
}


