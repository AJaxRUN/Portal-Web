import React, { useState, useEffect } from 'react';
import { StreamObject } from './common/types';
import { LayoutComponent } from './components/layout/layout';

async function getMediaStream(constraints: MediaStreamConstraints, setMediaStreamsCallback: (mediaStream: Array<StreamObject>) => void) {
  const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
  const streamObjects: Array<StreamObject> = [{stream: mediaStream, type: 'video'}, {stream: mediaStream, type: 'video'}, {type: 'none'}];
  setMediaStreamsCallback(streamObjects);
}

function App() {
  const [mediaStreams, setMediaStreams] = useState<Array<StreamObject>>([]);

  useEffect(() => {
    getMediaStream({video: true, audio: false}, setMediaStreams);
  }, []);

  return (
    <div>
      <LayoutComponent streams={mediaStreams} noOfParticipants={4} />
    </div>
  );
}

export default App;
