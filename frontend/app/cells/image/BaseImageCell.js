import fetchAsset, { parseEndpoint } from '../../../lib/fetchAsset';
import ImageCanvasCell from './ImageCanvas/ImageCanvasCell';
import { Suspense } from 'react';
import config from '../../../config';
// TODO create a parseDataURL helper

import classNames from 'classnames/bind';
import styles from '../Cell.module.scss';
import Image from 'next/image';
import fetchAssetMetadata from '../../../lib/fetchAssetMetadata';
import CanvasProvider from '../../contexts/CanvasContext';

const cx = classNames.bind(styles);


const PlainImageCell = async ({ value, query, expanded=false, style }) => {
    const endpoint = parseEndpoint({ thumbnail: true, group: !!query?.groupBy });
    const queryString = new URLSearchParams({ 
        assetId: value?.assetId, 
        dgid: query?.dgid, 
        timestamp: query?.timestamp, 
        thumbnail: true,
        endpoint 
    }).toString();

    return (
            <div className={cx("cell-content")} style={style}>
                <img
                    src={`/api/image?${queryString}`}
                    alt="DataGrid Image"
                />
            </div>
    );
};

const ExpandedWrapper = async ({ value, query }) => {
    const labels = await fetchAssetMetadata({ assetId: value?.assetId, dgid: query?.dgid });
    
    return (
        <CanvasProvider
            value={{
                labels: Object.keys(JSON.parse(labels)?.labels)
            }}
        >
            <ImageCanvasCell assets={[value?.assetId]} query={query} />
        </CanvasProvider>
    )
}

const ImageCell = ({ value, query, expanded, style }) => {
    const Component = expanded ? ExpandedWrapper : PlainImageCell;


    return (
        <Suspense fallback={<>Loading</>}>
            <Component value={value} query={query} expanded={expanded} style={style} />
        </Suspense>
    )
}

export default ImageCell;