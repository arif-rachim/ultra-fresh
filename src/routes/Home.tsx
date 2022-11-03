import {MainHeaderSearchPanel, useCategoriesList} from "./Categories";
import {useAppContext} from "../components/useAppContext";
import {useNavigate} from "../components/useNavigate";
import {useGroupFromCategory} from "./ProductWithCategory";
import {motion} from "framer-motion";
import {Image} from "../components/page-components/Image";

export function Home() {

    const categories = useCategoriesList();

    return <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <MainHeaderSearchPanel/>
        <div style={{height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto', paddingTop: 20}}>
            <div style={{
                display: 'flex',
                flexDirection: "column",
                alignContent: "space-between",
                paddingBottom: 50,
                margin: '0px 0px'
            }}>
                {categories.map(d => {
                    return <div key={d.label} style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                        <div style={{marginLeft: 10, marginBottom: 5, fontWeight: 'bold', color: 'rgba(0,0,0,0.5)'}}>
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
        paddingTop: 10,
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
                    border: '1px solid rgba(0,0,0,0.05)',
                    marginLeft: 5,
                    marginRight: 5,
                    borderRadius: 5,
                    background:'radial-gradient(rgba(255,255,255,0.2),rgba(255,255,255,0.8))'
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
                    fontSize: 12,
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