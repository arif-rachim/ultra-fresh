import {ChangeEventHandler} from "react";
import {ButtonTheme, theme, white} from "../../routes/Theme";

export function Input(props: { title: string, placeholder: string, value?: string, onChange?: ChangeEventHandler<HTMLInputElement> | undefined, error?: string }) {
    const {error, value} = props;
    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '5px 10px',
        borderBottom: '1px solid rgba(0,0,0,0.05)'
    }}>
        <div style={{paddingLeft: 5, fontWeight: 'bold', fontSize: 13}}>{props.title}</div>
        <input style={{
            backgroundColor: white,
            border: `1px solid ${error ? theme[ButtonTheme.danger] : 'rgba(0,0,0,0.15)'}`,
            padding: '5px 10px',
            borderRadius: 10,
            fontSize: 16,
            minWidth: 0,
        }} placeholder={props.placeholder} value={value} onChange={props.onChange} title={error}/>
        <div style={{
            paddingRight: 5,
            fontSize: 12,
            textAlign: 'right',
            color: theme[ButtonTheme.danger]
        }}>{props.error}</div>
    </div>;
}