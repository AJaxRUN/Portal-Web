import React, { VoidFunctionComponent } from 'react';
import { StreamObject } from '../../common/types';
import { VideoComponent } from '../video/video';


interface Props {
    streams: Array<StreamObject>;
    noOfParticipants: number;
}

export const LayoutComponent: VoidFunctionComponent<Props> = (props) => {
    let noOfParticipants = props.noOfParticipants;
    const videoElements = props.streams.map(streamObject => {
        noOfParticipants--;        
        return <VideoComponent mediaStream={streamObject.stream} mediaType={streamObject.type} />;
    });
    while(noOfParticipants > 0) {
        videoElements.push(<VideoComponent mediaType='none' />);
        noOfParticipants--;
    }
    return <>{videoElements}</>;
};