const socket = io("/");

const myPeer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3000",
});

const peers = {};

const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;
let myVideoStream;

async function getUserMediaStream() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    myPeer.on("call", (call) => {
      call.answer(stream); // Answer the call with the user's stream
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });

    let text = $("#chat_message");
    $("html").keydown(function (event) {
      if (event.which === 13 && text.val().trim().length !== 0) {
        socket.emit("message", text.val());
        text.val(""); // Clear input field after sending
      }
    });

    // receive the message from the server
    socket.on("createMessage", (message) => {
      $("ul.messages").append(
        `<li class='message'><b>user: </b>${message}</li>`
      );
    });
  } catch (err) {
    console.log("Error accessing media devices:", err);
  }
}
getUserMediaStream();

myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

socket.on("user-disconnected", (userId) => {
  // console.log(`User ${userId} disconnected`);
  if (peers[userId]) {
    peers[userId].close();
    delete peers[userId];
  }

  // Remove video from the DOM
  const video = document.querySelector(`video[data-peer-id="${userId}"]`);
  if (video) video.remove();
});

function addVideoStream(video, stream, userId = null) {
  video.srcObject = stream;

  // Add an identifier for cleanup
  if (userId) {
    video.setAttribute("data-peer-id", userId);
  }

  video.addEventListener("loadedmetadata", () => video.play());
  videoGrid.append(video);
}

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");

  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream, userId); // Pass userId
  });

  call.on("close", () => {
    const video = document.querySelector(`video[data-peer-id="${userId}"]`);
    if (video) video.remove(); // Remove video from DOM
    delete peers[userId];
  });

  call.on("error", () => {
    console.error(`Error with peer connection`);
    const video = document.querySelector(`video[data-peer-id="${userId}"]`);
    if (video) video.remove();
    delete peers[userId];
  });

  peers[userId] = call;
}
const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled; // Access the first video track
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false; // Disable video track
    setPlayVideo(); // Update UI to "play" state
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true; // Enable video track
    setStopVideo(); // Update UI to "stop" state
  }
};

function setStopVideo() {
  const html = `<i class="fas fa-video"></i><span>Stop Video</span>`;
  document.querySelector(".main__video_button").innerHTML = html;
}

function setPlayVideo() {
  const html = `<i class="fas fa-video-slash" style="color: #a40a0a;"></i><span>Play Video</span>`;
  document.querySelector(".main__video_button").innerHTML = html;
}

// <i class="fa-solid fa-microphone-slash" style="color: #920202;"></i>

const muteUnmute = () => {
  if (myVideoStream && myVideoStream.getAudioTracks().length > 0) {
    const audioTrack = myVideoStream.getAudioTracks()[0]; // Get the first audio track
    if (audioTrack.enabled) {
      audioTrack.enabled = false; // Disable the audio track
      setUnmute(); // Update UI to "Unmute" state
    } else {
      audioTrack.enabled = true; // Enable the audio track
      setMute(); // Update UI to "Mute" state
    }
  } else {
    alert("No audio track found. Please check microphone permissions or device availability.");
  }
};


function setMute() {
  const html = `<i class="fas fa-microphone"></i><span>Mute</span>`;
  document.querySelector(".main__mute_button").innerHTML = html;
}

function setUnmute() {
  const html = `<i class="fa-solid fa-microphone-slash" style="color: #920202;"></i><span>Unmute</span>`;
  document.querySelector(".main__mute_button").innerHTML = html;
}


