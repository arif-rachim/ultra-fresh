import {Header} from "../components/page-components/Header";
import {FooterNavigation} from "../components/page-components/FooterNavigation";

export function ProductListGroupedByCategory(){
    return <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <Header title={'Product List'}/>
        <div style={{height:'100%',display:'flex',flexDirection:'column',overflow:'auto'}}>

        </div>
        <FooterNavigation/>
    </div>
}