const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;
let myVideoStream;
async function getUserMediaStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      myVideoStream = stream;
      addVideoStream(myVideo, stream);
    } catch (err) {
      console.log('Error accessing media devices:', err);
    }
  }
  getUserMediaStream();

  socket.emit('join-room', ROOM_ID);

  socket.on('user-connected', () => {
    connectToNewUser()
  });


  
function addVideoStream(video, stream){
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => video.play());
    videoGrid.append(video);
}

function connectToNewUser(){
  console.log('------------')
}