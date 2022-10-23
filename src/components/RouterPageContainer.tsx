import {RouteProps, useRoute} from "./useRoute";
import {CSSProperties, FunctionComponent, useEffect, useMemo, useState, createContext, useContext} from "react";
import {motion, Variants} from "framer-motion";
import {produce} from "immer";

export const maxWidth = 480;

/**
 * Router Page Container
 * @constructor
 */
export function RouterPageContainer() {
    const [components, setComponents] = useState<PathAbleComponent[]>([]);
    const {params, routeComponent: RouteComponent, path} = useRoute();
    const Component = useMemo(() => function RouteComponentContainer(props: {isFocused:boolean} & RouteProps) {
        return <motion.div
            style={{position: 'absolute', left: 0, top: 0, height: '100%', width: '100%', overflow: 'auto'}}
            variants={routeVariants}
            initial={'hidden'}
            animate={props.isFocused ? 'visible' : 'hidden'}
        >
            <RouteComponent params={props.params} path={props.path} />
        </motion.div>
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
        <div style={shellContainerStyle}>
        {components.map((c, index) => {
            const Component = c.component;
            const isFocused = c.path === path;
            return <Component key={c.path} params={params} path={c.path} isFocused={isFocused}/>
        })}
    </div>
    </CurrentActivePathContext.Provider>
}

interface PathAbleComponent {
    component: FunctionComponent<{isFocused:boolean} & RouteProps>,
    path: string,
    params: Map<string, string>
}

const CurrentActivePathContext = createContext('');


export function useFocusListener(path:string){
    const currentActivePath = useContext(CurrentActivePathContext);
    const [isFocused,setIsFocused] = useState<boolean>(currentActivePath === path);
    useEffect(() => setIsFocused(currentActivePath === path),[path,currentActivePath]);
    return isFocused;
}

const routeVariants: Variants = {
    visible: {
        opacity: 1,
        left: 0,
        transition: {
            bounce: false
        }
    },
    hidden: {
        opacity: 0,
        left: '-100%'
    }
}


const shellContainerStyle: CSSProperties = {
    maxWidth: maxWidth,
    height: '100%',
    width: '100%',
    overflow: 'auto',
    position: 'relative',
    flexGrow: 1
}
