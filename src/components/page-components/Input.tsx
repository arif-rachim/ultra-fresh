import {ChangeEventHandler} from "react";

export function Input(props: { title: string, placeholder: string, value?: string, onChange?: ChangeEventHandler<HTMLInputElement> | undefined, error?: string }) {
    const {error, value} = props;
    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 10,
        background: 'linear-gradient(rgba(255,255,255,0.9),rgba(255,255,255,0.8))',
        borderBottom: '1px solid rgba(0,0,0,0.05)'
    }}>
        <div style={{paddingLeft: 5, fontWeight: 'bold', fontSize: 13}}>{props.title}</div>
        <input style={{
            backgroundColor: 'white',
            border: `1px solid ${error ? 'red' : 'rgba(0,0,0,0.15)'}`,
            padding: '5px 10px',
            borderRadius: 10,
            fontSize: 16,
            minWidth: 0,
        }} placeholder={props.placeholder} value={value} onChange={props.onChange} title={error}/>
    </div>;
}