export const blueDarken = 'rgba(0,122,204,1)';
export const green = 'rgba(0,100,60,1)';
export const blue = 'rgba(2,149,210,1)';
export const red = 'rgba(207,19,33,1)';
export const lightRed = 'rgb(234,67,53,1)';
export const grey = 'rgba(111,119,113,1)';
export const yellow = 'rgba(255,242,0,1)';
export const darkYellow = 'rgb(249,188,6,1)';
export const darkYellowTwo = '#FFB85F';
export const white = 'rgba(255,255,255,1)';

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