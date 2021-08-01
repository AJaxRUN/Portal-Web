import React, { createRef, useEffect, RefObject, VoidFunctionComponent } from 'react';
import { MediaType } from '../../common/types';

import avatarImage from './avatar.png';
import './video.css';


interface Props {
    mediaStream?: MediaStream;
    mediaType?: MediaType;
}

export const VideoComponent: VoidFunctionComponent<Props> = (props) => {
    const ref = createRef<HTMLVideoElement|HTMLAudioElement>();

    useEffect(() => {
        if(props.mediaStream && ref.current) {
            console.log('Playing media');
            ref.current.srcObject = props.mediaStream;
            ref.current.play();
        }
    }, [props.mediaStream, ref]);


    switch(props.mediaType) {
        case 'video':
            return <video className="video-element" ref={ref as RefObject<HTMLVideoElement>} />;
        case 'only-audio':
            return (
                <>
                    <audio ref={ref} />
                    <Avatar />
                </>
            );
        case 'none':
        default:
            return <Avatar />;
    }
}

function Avatar() {
    return <img src={avatarImage} alt="user-avatar" />;
}
