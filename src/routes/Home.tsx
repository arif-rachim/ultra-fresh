import {useCategoriesList} from "./Categories";
import {useAppContext} from "../components/useAppContext";
import {useNavigate} from "../components/useNavigate";
import {useGroupFromCategory} from "./ProductWithCategory";
import {motion} from "framer-motion";
import {Image} from "../components/page-components/Image";
import {MainHeaderSearchPanel} from "../components/page-components/MainHeaderSearchPanel";
import {FaShippingFast} from "react-icons/fa";
import {IoRibbonOutline,IoPricetagsOutline} from "react-icons/io5";

export function Home() {

    const categories = useCategoriesList();
    const {appDimension} = useAppContext();
    return <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <MainHeaderSearchPanel/>
        <div style={{height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto', paddingTop: 10}}>
            <div style={{
                display: 'flex',
                flexDirection: "column",
                alignContent: "space-between",
                paddingBottom: 50,
                margin: '0px 0px'
            }}>
                <Image src={'/logo/top-banner-latest.png'} width={appDimension.width - 20}
                       height={(appDimension.width - 20) * 0.5} style={{margin: 10, marginTop: 0}}/>

                <div style={{display: 'flex',marginBottom:30}}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '33.33%'}}>
                        <div style={{width:90,height:90,background:'#33AD00',borderRadius:100,boxShadow:'0 5px 5px 0px rgba(0,0,0,0.3),0 5px 10px 0px rgba(0,0,0,0.1) inset'}}></div>
                        <div style={{background:'red',fontSize:10,padding:'3px 5px',borderRadius:10,fontWeight:'bold',color:'white',marginTop:-15}}>SUBSCRIBE</div>
                        <FaShippingFast style={{fontSize:28,marginTop:-50,color:'white'}}/>
                        <Image src={'/logo/member/regular-delivery.svg'} width={65} height={80} style={{marginTop:-85}}/>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '33.33%'}}>
                        <div style={{width:90,height:90,background:'#004BAD',borderRadius:100,boxShadow:'0 5px 5px 0px rgba(0,0,0,0.3),0 5px 10px 0px rgba(0,0,0,0.1) inset'}}></div>
                        <div style={{background:'#F0B521',fontSize:10,padding:'3px 5px',borderRadius:10,fontWeight:'bold',color:'white',marginTop:-15}}>CLICK HERE</div>
                        <IoRibbonOutline style={{fontSize:28,marginTop:-50,color:'white'}}/>
                        <Image src={'/logo/member/loyalty-program.svg'} width={65} height={80} style={{marginTop:-85}}/>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '33.33%'}}>
                        <div style={{width:90,height:90,background:'#AA00AD',borderRadius:100,boxShadow:'0 5px 5px 0px rgba(0,0,0,0.3),0 5px 10px 0px rgba(0,0,0,0.1) inset'}}></div>
                        <div style={{background:'#3696DD',fontSize:10,padding:'3px 5px',borderRadius:10,fontWeight:'bold',color:'white',marginTop:-15}}>CLICK HERE</div>
                        <IoPricetagsOutline style={{fontSize:28,marginTop:-50,color:'white'}}/>
                        <Image src={'/logo/member/promotion-products.svg'} width={55} height={80} style={{marginTop:-85}}/>

                    </div>
                </div>

                {categories.map(d => {
                    return <div key={d.label} style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                        <div style={{marginLeft: 10, marginBottom: 5}}>
                            {d.label}
                        </div>
                        <CategoryLineRenderer category={d.label}/>
                    </div>
                })}
            </div>
        </div>
    </div>
}

function CategoryLineRenderer(props: { category: string }) {
    const {category} = props;
    const groups = useGroupFromCategory(category);
    const {appDimension} = useAppContext();
    const imageDimension = Math.floor(appDimension.width / 3.3) - 10;
    const navigate = useNavigate();
    return <div style={{
        borderTop: '1px solid rgba(0,0,0,0.1)',
        paddingTop: 5,
        height: 120,
        overflowX: "auto",
        overflowY: 'hidden',
        display: 'flex'
    }}>

        {groups.map(group => {
            return <div style={{display: 'flex', flexDirection: 'column', width: imageDimension, flexShrink: 0}}
                        key={group.name}>
                <motion.div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 5,
                    marginRight: 5,
                    borderRadius: 5,
                    background: 'radial-gradient(rgba(255,255,255,0.2),rgba(255,255,255,0.8))'
                }} onTap={() => {
                    navigate(`product-with-category/${category}/${group.name}`);
                }} whileTap={{scale: 0.95}}
                            whileHover={{scale: 1.05}}>
                    <Image src={`/images/${group.barcode}/THUMB/default.png`}
                           style={{marginTop: 5, marginBottom: 5}}
                           height={70}
                           width={70}
                           alt={'Barcode ' + group.barcode}/>
                </motion.div>
                <div style={{
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    marginTop: 5
                }}>
                    {group.name}
                </div>
            </div>
            // return <CategoryIconSelector imageDimension={imageDimension}
            //                              item={{name: group.name, barcode: group.barcode}}
            //                              key={group.barcode} selected={selectedGroup.name === group.name}
            //                              onTap={() => {
            //                                  selectedStore.dispatch({type: 'GROUP_SELECTED', payload: group})
            //                              }}/>
        })}
    </div>
}