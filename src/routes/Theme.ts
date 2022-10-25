const blue = '#0295D2';
const red = '#CF1321';
const grey = '#6F7785';
const yellow = '#FFF200';

export enum ButtonTheme {
    promoted,
    danger,
    default
}


export const theme = {
    [ButtonTheme.promoted]: blue,
    [ButtonTheme.danger]: red,
    [ButtonTheme.default]: grey
}