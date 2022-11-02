import {createClient} from "@supabase/supabase-js";
const supabaseURL = process.env.REACT_APP_SUPABASE_URL ?? '';
const supabaseKEY = process.env.REACT_APP_SUPABASE_KEY ?? '';
const supabase = createClient(supabaseURL,supabaseKEY);

export async function signIn(props:{phone:string}){
    let { data:user, error } = await supabase.auth.signInWithOtp({
        phone: props.phone
    });
    return {user,error};
}



export async function verifyPin(props:{phone:string,token:string}){
    let {data:session,error} = await supabase.auth.verifyOtp({
        type : 'sms',
        ...props
    });
    return {session,error}
}
export async function signUp(props:{email:string,password:string,phone:string,firstName:string,lastName:string,nationality:string,referralCode:string}){
    return await supabase.auth.signUp({password:props.password,phone:props.phone,options:{data:{firstName:props.firstName,lastName:props.lastName,nationality:props.nationality,referralCode:props.referralCode,email:props.email}}})
}

export async function updateProfile(props:{email:string,firstName:string,lastName:string,nationality:string,password:string,referralCode:string}){
    const {email,firstName,lastName,nationality,password,referralCode} = props;
    return await supabase.auth.updateUser({password,data:{firstName,lastName,nationality,referralCode,email}})
}