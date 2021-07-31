import React, { createRef, useEffect, RefObject } from 'react';

import avatarImage from './avatar.png';
import './video.css';

type MediaType = 'video' | 'only-audio' | 'none';

interface Props {
    mediaStream?: MediaStream;
    mediaType?: MediaType;
}

export function VideoComponent({mediaStream, mediaType}: Props) {
    const ref = createRef<HTMLVideoElement|HTMLAudioElement>();

    useEffect(() => {
        if(mediaStream && ref.current) {
            console.log('Playing media');
            ref.current.srcObject = mediaStream;
            ref.current.play();
        }
    }, [mediaStream, ref.current]);


    switch(mediaType) {
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