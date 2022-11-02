import {motion, MotionProps} from "framer-motion";
import {ImgHTMLAttributes, PropsWithoutRef, useRef} from "react";
import './Image.css';
import invariant from "tiny-invariant";

export function Image(props: PropsWithoutRef<ImgHTMLAttributes<HTMLImageElement>> & MotionProps) {
    let {onLoad, onError,style, ...properties} = props;
    const loadingRef = useRef<HTMLDivElement>(null);
    const motionRef = useRef<HTMLImageElement>(null);
    style = style ?? {};
    return <div style={{display: 'flex', flexDirection: 'column', position: 'relative'}}>
        <div style={{display:'flex',position:'absolute',top:0,left:0,width:'100%',justifyContent:'center'}} >
        <div className="lds-ellipsis" ref={loadingRef} >
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        </div>
        <motion.img ref={motionRef} {...properties} style={{opacity:0,...style}} onLoad={() => {
            invariant(motionRef.current);
            invariant(loadingRef.current);
            motionRef.current.style.opacity = '1';
            loadingRef.current.style.opacity = '0';
        }} onError={() => {
            invariant(motionRef.current);
            invariant(loadingRef.current);
            motionRef.current.style.opacity = '0';
            loadingRef.current.style.opacity = '0';
        }} />

    </div>
}