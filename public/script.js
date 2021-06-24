const socket = io('/')
const videoGrid = document.getElementById('video-grid')

const myPeer = new Peer(undefined,{
    host: '/',
    port: '3001',

})

const MyVideo=document.createElement('video')
MyVideo.muted = true

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream=>{
    addVideoStream(MyVideo,stream)   //adding stream to my video

    myPeer.on('call',call => { 
        console.log('answered the call')            //THIS IS NOT BEING TRIGGERED
        call.answer(stream)  
    })
    socket.on('user-connected',userId =>{   //user is connected send our stream to that userid
        connectToNewUser(userId, stream)
        console.log('USERCOONECTEDIS '+ userId)
    })

    

})

myPeer.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id) //emitting join room event if a new user is sonnected to the server

})

socket.on('user-connected',userId =>{
    console.log('User connected ' + userId)
})




function connectToNewUser(userId, stream){
    const call = myPeer.call(userId,stream)
    const video = document.createElement('video')
    console.log('connectedtonewuser')
    call.on('stream',userVideoStream =>{
        addVideoStream(video,userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })
}

function addVideoStream(video, stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })
    videoGrid.append(video)
}