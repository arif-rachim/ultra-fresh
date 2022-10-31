import {ChangeEventHandler, CSSProperties} from "react";
import {ButtonTheme, theme, white} from "../../routes/Theme";
interface InputStyle{
    containerStyle?:CSSProperties,
    titleStyle? : CSSProperties,
    inputStyle? : CSSProperties,
    errorStyle? : CSSProperties
}
export function Input(props: { title: string, placeholder: string, value?: string, onChange?: ChangeEventHandler<HTMLInputElement> | undefined, error?: string,style?:InputStyle }) {

    const {error, value,style} = props;
    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '5px 10px',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        position:'relative',
        ...style?.containerStyle
    }}>
        <div style={{paddingLeft: 5, fontWeight: 'bold', fontSize: 13,color:'rgba(0,0,0,0.6)',...style?.titleStyle}}>{props.title}</div>
        <input style={{
            backgroundColor: 'rgba(0,0,0,0.03)',
            border: `1px solid ${error ? theme[ButtonTheme.danger] : 'rgba(0,0,0,0.01)'}`,
            padding: '5px 10px',
            borderRadius: 5,
            fontSize: 16,
            minWidth: 0,
            ...style?.inputStyle
        }} placeholder={props.placeholder} value={value} onChange={props.onChange} title={error}/>
        <div style={{
            paddingRight: 5,
            fontSize: 12,
            textAlign: 'right',
            color: theme[ButtonTheme.danger],
            height : 10,
            ...style?.errorStyle
        }}>{props.error}</div>
    </div>;
}