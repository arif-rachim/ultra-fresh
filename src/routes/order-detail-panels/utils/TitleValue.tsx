import {SkeletonBox} from "../../../components/page-components/SkeletonBox";

export function TitleValue(props: { value: string | undefined | null, title: string, width?: string | number }) {
    return <div style={{display: 'flex', flexDirection: 'column', marginBottom: 5, width: props.width}}>
        <div style={{fontSize: 14, marginRight: 10}}>{props.title} :</div>
        <SkeletonBox skeletonVisible={props.value === null || props.value === undefined}
                     style={{flexGrow: 1, height: 22, marginRight: 10}}>
            <div style={{fontSize: 18}}>
                {props.value}
            </div>
        </SkeletonBox>
    </div>
}
