import {useEffect, useRef} from "react";

export function usePreviousValue(value:any){
    const valueRef = useRef();
    useEffect(() => {
        valueRef.current = value
    },[value])
    return valueRef.current;
}