import React, { useState, useEffect, useRef, createRef, RefObject, useLayoutEffect } from 'react'
import SimplePeer from 'simple-peer';
import io, {Socket} from 'socket.io-client';
import { payloadInterface, peerObjectsType, streamObjectsType } from './types';

async function getUserMediaFromBrowser(constraints: MediaStreamConstraints) {
	const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
	return mediaStream;
}

function closePeersAndStream(peers: peerObjectsType, stream: MediaStream|undefined|null) {
	peers.forEach(value => {
		value.destroy();
	});
	closeStream(stream);
}

export function closeStream(stream: MediaStream|null|undefined) {
    if(stream)
        stream.getTracks().forEach(track => {
            track.stop();
        });
}

const CallRoom = (props: any) => {
    const socket = useRef<Socket>();
	const [myMediaStream, setMyMediaStream] = useState<MediaStream>();
	const peerObjects = useRef<peerObjectsType>(new Map());
    
    const [streamObjects, setStreamObjects] = useState<streamObjectsType>(new Map()); 
    
    useEffect(() => {
		socket.current = io()
		async function initialise() {
			setMyMediaStream(await getUserMediaFromBrowser({audio: false, video: true}));
			peerObjects.current.forEach(peer => {
				if(myMediaStream)
					peer.addStream(myMediaStream);
			});
		}
		initialise();
		if(socket.current) {
			console.log("Socket id:" + socket.current.id)
			socket.current.emit('joinRoom');
			socket.current.on('allUsers', receiveAllUsers);
			socket.current.on('userJoined', newUserInRoom);
			socket.current.on('receivingReturnedSignal', gotReturnOffer);
			socket.current.on('removeClient', removeClient);
		}
	}, []);
    
    function receiveAllUsers(users: Array<string>) {
		console.log(users);
		users.forEach(userToSignal => {
			const peer = initPeer('init', userToSignal);
			console.log("receiveing users/....")
			peer.on('signal', (signal: SimplePeer.SignalData) => {
				if(signal.type && signal.type.toString().toLowerCase() === 'offer' && socket.current)
					socket.current.emit('sendingSignal', { userToSignal, signal });
			});
		});
	}

    function initPeer(type: 'init'|'notInit', userId: string) {
		console.log(myMediaStream);
		const peer = new SimplePeer({
			initiator: (type === 'init'),
			stream: myMediaStream
		});
		peer.on('stream', (stream: MediaStream) => {
			console.log('Received stream');
			console.log(stream);
			addStream(userId, stream);
		});
		peer.on('close', () => {
			console.log('Deleting connection');
			peerObjects.current.delete(userId);
			deleteStream(userId);
			peer.destroy();
		});
		peerObjects.current.set(userId, peer);
		return peer;
	}

    function removeClient(id: string) {
		console.log('Deleting connections');
		const peer = peerObjects.current.get(id);
		peerObjects.current.delete(id);
		if(peer)
			peer.destroy();
		deleteStream(id);
	}

    function gotReturnOffer(payload: payloadInterface) {
		const { callerId, signal } = payload;
		const peer = peerObjects.current.get(callerId);
		if(peer)
			peer.signal(signal);
	}

    function newUserInRoom(payload: payloadInterface) {
		const { callerId, signal } = payload;
		const peer = initPeer('notInit', callerId);
		peer.on('signal', (signal: SimplePeer.SignalData) => {
			if(signal.type && (signal.type.toString()).toLowerCase() === 'answer' && socket.current)
				socket.current.emit('returningSignal', { signal, callerId });
		});
		peer.signal(signal);
	}

    function addStream(id: string, stream: MediaStream) {
		setStreamObjects(prevStream => {
			const tempStream = new Map(prevStream);
			tempStream.set(id, stream);
			return tempStream;
		});
	}

	function deleteStream(id: string) {
		setStreamObjects(prevStream => {
			const tempStream = new Map(prevStream);
			tempStream.delete(id);
			return tempStream;
		});
	}

    return(
        <>
        {
            [...Array.from(streamObjects.values()), myMediaStream].map((streamObj, idx) =>
                <VideoComponent mediaStream={streamObj} key={idx} />
            )
        }
        </>
    )

}

function setSrcObjectAndPlay(ref: RefObject<HTMLVideoElement>, stream: MediaStream|null|undefined) {
	if(ref.current && stream) {
		ref.current.srcObject = stream;
		ref.current.play();
	}
}

function VideoComponent({mediaStream}: {mediaStream?: MediaStream}){
    const videoRef = createRef<HTMLVideoElement>()
    useLayoutEffect(() =>{ 
            console.log("Hii in useEffect");
            console.log(mediaStream)
            setSrcObjectAndPlay(videoRef, mediaStream);
        }
    )
    return(
        <video autoPlay className='video' ref={videoRef} />
    )
}

  
export default CallRoom;