const socket = io('/');

const myPeer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '3000',
});

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

      socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
      });

    } catch (err) {
      console.log('Error accessing media devices:', err);
    }
  }
  getUserMediaStream();

  myPeer.on('open', (id) => {  
    socket.emit('join-room', ROOM_ID, id);
  });



 


  
function addVideoStream(video, stream){
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => video.play());
    videoGrid.append(video);
}

function connectToNewUser(userId){

  console.log(userId);
}