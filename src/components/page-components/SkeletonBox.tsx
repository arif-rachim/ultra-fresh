import {HTMLAttributes, PropsWithChildren} from "react";
import './SkeletonBox.css';

export function SkeletonBox(props:PropsWithChildren<HTMLAttributes<HTMLDivElement> & {skeletonVisible:boolean}>){
    const {children,skeletonVisible,style,...propsDiv} = props;

    if(skeletonVisible){
        return <div className={'skeleton-box'} style={{minWidth:100,minHeight:19,...style}} {...propsDiv}/>
    }
    return <>{children}</>;
}