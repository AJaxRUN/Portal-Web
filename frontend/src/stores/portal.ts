import { makeObservable, observable, action } from "mobx";
import { Instance } from 'simple-peer';

class PortalStore {
    peerObjects = new Map<string, Instance>();
    streams = new Map<string, MediaStream>();
    myMediaStream?: MediaStream;

    constructor() {
        makeObservable(this, {
            peerObjects: observable,
            streams: observable,
            myMediaStream: observable,
            addPeer: action,
            deletePeer: action,
            addStream: action,
            deleteStream: action
        });
    }

    addPeer(socketUid: string, peer: Instance) {
        this.peerObjects.set(socketUid, peer);
    }

    deletePeer(socketUid: string) {
        this.peerObjects.delete(socketUid);
    }

    addStream(socketUid: string, stream: MediaStream) {
        this.streams.set(socketUid, stream);
    }

    deleteStream(socketUid: string) {
        this.streams.delete(socketUid);
    }

}
