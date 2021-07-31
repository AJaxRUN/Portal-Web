import React, { useState, useEffect } from 'react';
import { VideoComponent } from './components/video/video';

async function getMediaStream(constraints: MediaStreamConstraints, setMediaStreamCallback: (mediaStream: MediaStream) => void) {
  const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
  setMediaStreamCallback(mediaStream);
}

function App() {
  const [myMediaStream, setMyMediaStream] = useState<MediaStream|undefined>();

  useEffect(() => {
    getMediaStream({video: true, audio: false}, setMyMediaStream);
  }, []);

  return (
    <div className="App">
      <VideoComponent mediaStream={myMediaStream} mediaType='video' />
    </div>
  );
}

export default App;
