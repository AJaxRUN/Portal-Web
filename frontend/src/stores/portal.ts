import { makeObservable, observable, action, computed } from "mobx";
import { Instance } from 'simple-peer';

class PortalStore {
    peerObjects = new Map<string, Instance>();
    streams = new Map<string, MediaStream>();

    constructor() {
        makeObservable(this, {
            peerObjects: observable,
            streams: observable,
            addPeer: action,
            addStream: action,
            streamAsArray: computed
        });
    }

    addPeer(socketUid: string, peer: Instance) {
        this.peerObjects.set(socketUid, peer);
    }

    addStream(socketUid: string, stream: MediaStream) {
        this.streams.set(socketUid, stream);
    }

    get streamAsArray() {
        return this.streams.values();
    }
}