var sock = null;
var spanWhosOn = gid("spanWhosOn");
var loc1 = location.hostname+':'+location.port;
var loc2 = location.hostname;
var loc3 = loc1 || loc2;
var new_uri;
var yourLang = gid('yourLang');

var SENDER = false;
	
  const localVideo = document.getElementById('localVideo');
  const stateSpan = document.getElementById('state_span');
  let localStream = null;
  let clientId = null;
  let device = null;
  let producerTransport = null;
  let videoProducer = null;
  let audioProducer = null;
  let consumerTransport = null;
  let videoConsumer = null;
  let audioConsumer = null;


var clientNick;
if(window.location.protocol === "https:"){
new_uri = 'wss:';
}else{
new_uri = 'ws:';
}

function get_socket(){
sock=new WebSocket(new_uri + '//' + loc3 + '/gesamt');

sock.onopen = function(){
console.log("websocket opened");
}
sock.onerror = function(e){console.error("websocket error",e);}
sock.onmessage = function(evt){
let a;try{a=JSON.parse(evt.data);on_msg(a);}catch(e){console.error(e);
}}
sock.onclose = function(){
console.log("Websocket closed");
}
}
get_socket();
async function on_msg(data){
if(data.type == 'welcome'){
	clientId = data.id;
	}else{}
}

function wsend(obj){
if(!sock)return;
try{
sock.send(JSON.stringify(obj));	
}catch(e){}	
}
function sendRequest(obj) {
    return new Promise((resolve, reject) => {
		obj.request = "mediasoup";
      sock.send(JSON.stringify(obj));
      sock.onmessage = function(e){
		  let a;
		  try{
		  a = JSON.parse(e.data);
	  }catch(er){reject(er)}
	  
		  if(a.type == obj.type){resolve(a);}else if(a.type == "error"){reject(a.info);}else{
		  on_msg(a)
	  }
		  }
		 
    });
    
  }
  function addRemoteTrack(id, track) {
	//if(SENDER)return;
    let video = findRemoteVideo(id);
   // if (!video) {
      video = addRemoteVideo(id);
   // }

    if (video.srcObject) {
      video.srcObject.addTrack(track);
      return;
    }

    const newStream = new MediaStream();
    newStream.addTrack(track);
    playVideo(video, newStream)
      .then(() => { video.volume = 1.0 })
      .catch(err => { console.error('media ERROR:', err) });
  }


 function addRemoteVideo(id) {
	 //if !SENDER
    //let existElement = findRemoteVideo(id);
    //if (existElement) {
      //console.warn('remoteVideo element ALREADY exist for id=' + id);
      //return existElement;
    //}

    let element = document.getElementById('localVideo');
    //remoteContainer.appendChild(element);
   // element.id = 'remote_' + id;
    element.width = 240;
    element.height = 180;
    element.volume = 0;
    //element.controls = true;
    element.style = 'border: solid black 1px;';
    return element;
  }
  
  function findRemoteVideo(id) {
    let element = document.getElementById('localVideo');
    return element;
  }
  
  function stopLocalStream(stream) {
    let tracks = stream.getTracks();
    if (!tracks) {
      console.warn('NO tracks');
      return;
    }

    tracks.forEach(track => track.stop());
  }

  // return Promise
  function playVideo(element, stream) {
    if (element.srcObject) {
      console.warn('element ALREADY playing, so ignore');
      return;
    }
    element.srcObject = stream;
    element.volume = 0;
    return element.play();
  }
  
   
  function pauseVideo(element) {
    element.pause();
    element.srcObject = null;
  }
 function checkUseVideo() {
    const useVideo = document.getElementById('use_video').checked;
    return useVideo;
  }

  function checkUseAudio() {
    const useAudio = document.getElementById('use_audio').checked;
    return useAudio;
  }

  function startMedia() {
	  //if sender
    if (localStream) {
      console.warn('WARN: local media ALREADY started');
      return;
    }

    const useVideo = checkUseVideo();
    const useAudio = checkUseAudio();

    navigator.mediaDevices.getUserMedia({ audio: useAudio, video: useVideo })
      .then((stream) => {
        localStream = stream;
        playVideo(localVideo, localStream);
        updateButtons();
      })
      .catch(err => {
        console.error('media ERROR:', err);
      });
  }

  function stopMedia() {
	 // if(SENDER){
    if (localStream) {
      pauseVideo(localVideo);
      stopLocalStream(localStream);
      localStream = null;
      SENDER = false;
    }
    updateButtons();
//}
  }
   async function publish() {
   

if (!localStream) {
      console.warn('WARN: local media NOT READY');
      return;
    }

   
      // --- get capabilities --
      try{
      const data = await sendRequest({type: 'getRouterRtpCapabilities', vid: "publish"});
      console.log('getRouterRtpCapabilities:');
      await loadDevice(data.routerrtpCapabilities);
  }catch(e){
	  alert(e);
	  return;
	  }
    

    updateButtons();

    // --- get transport info ---
    console.log('--- createProducerTransport --');
    const params = await sendRequest({type: 'createProducerTransport'});
    console.log('transport params:',params);
    producerTransport = device.createSendTransport(params.params);
   console.log('createSendTransport:');

    console.log(' --- join & start publish --');
    producerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      console.log('--trasnport connect',dtlsParameters );
     
      try{
     await sendRequest({type: 'connectProducerTransport', transportId: producerTransport.id, dtlsParameters: dtlsParameters })
        //.then(callback)
        //alert(callback);
        callback();
        //alert('suka');
       }catch(er){
		   //alert(JSON.stringify(er));
		   errback(er);};
    });

    producerTransport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
      console.log('--trasnport produce');
      try {
        const { id } = await sendRequest({type: 'produce', transportId: producerTransport.id,kind, rtpParameters});
        callback({ id });
      } catch (err) {
      // alert(JSON.stringify(err)); 
       errback(err);
      }
    });

    producerTransport.on('connectionstatechange', (state) => {
      switch (state) {
        case 'connecting':
          console.log('publishing...');
          break;

        case 'connected':
          console.log('published');SENDER = true;
          break;

        case 'failed':
          console.log('failed');
          producerTransport.close();SENDER = false;
          break;

        default:
          break;
      }
    });

    const useVideo = checkUseVideo();
    const useAudio = checkUseAudio();
    if (useVideo) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        const trackParams = { track: videoTrack };
        videoProducer = await producerTransport.produce(trackParams);
      }
    }
    if (useAudio) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        const trackParams = { track: audioTrack };
        audioProducer = await producerTransport.produce(trackParams);
      }
    }

    updateButtons();
  }

function updateButtons(){}

function subscribe_webpush(el){
	el.className = "puls";
	 var OneSignal = window.OneSignal || [];
  OneSignal.push(function() {
    OneSignal.init({
      appId: "bdd08819-3e41-4e1b-a1bf-13da2ff35f7c"
    });
    OneSignal.setExternalUserId("1");
});
    OneSignal.isPushNotificationsEnabled(function(isenabled){
		if(isenabled){
		logp("push notifications are enabled!");
		OneSignal.getUserId(function(userid){
			logp("userid: " + userid);
			})
		}else{
			console.log("push notifications are not enabled yet");
			logp("push notifications are not enabled yet");
		}
		})
	OneSignal.on('permissionPromptDisplay', function () {
    console.log("The prompt displayed");
    logp("The promt displayd");
  });
		OneSignal.push(["getNotificationPermission", function(permission) {
    console.log("Site Notification Permission:", permission);
    logp("Site Notification Permission: " + permission);
}]);
OneSignal.push(function() {
  OneSignal.on('subscriptionChange', function (isSubscribed) {
    console.log("The user's subscription state is now:", isSubscribed);
    logp("The user's subscription state is now: " + isSubscribed);
    el.className = "";
  });
});
OneSignal.push(function() {
  OneSignal.on('notificationDisplay', function(event) {
    console.warn('OneSignal notification displayed:', event);
    logp("OneSignal notification displayed: " + event);
    el.className = "";
  });
  
  });
}

function logp(t){
let out = gid("out7");
if(out){
return out.innerHTML+= t + "<br>";
}
}
var myusername;
function showAnketaForms(el){
anketaForms.classList.toggle("open");	
startMedia();
	}
	function go_ahead(el){
		alert("Under construction!"); 
		}
	async	function subscribe(el){
			//if(SENDER)return;
			 // --- get capabilities --
      const data = await sendRequest({type: 'getRouterRtpCapabilities', vid: 'subscribe'});
      console.log('getRouterRtpCapabilities:', data);
      await loadDevice(data.routerrtpCapabilities);
    //}

    updateButtons();

    // --- prepare transport ---
    console.log('--- createConsumerTransport --');
    const params = await sendRequest({type: 'createConsumerTransport'});
    console.log('transport params:', params);
    consumerTransport = device.createRecvTransport(params.params);
    console.log('createConsumerTransport:', consumerTransport);

    // --- NG ---
    //sendRequest('connectConsumerTransport', { dtlsParameters: dtlsParameters })
    //  .then(callback)
    //  .catch(errback);

    // --- try --- not well
    //sendRequest('connectConsumerTransport', { dtlsParameters: params.dtlsParameters })
    //  .then(() => console.log('connectConsumerTransport OK'))
    //  .catch(err => console.error('connectConsumerTransport ERROR:', err));

    // --- join & start publish --
    consumerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      console.log('--consumer trasnport connect');
      try{
      await sendRequest({type: 'connectConsumerTransport', dtlsParameters: dtlsParameters })
        callback()
        }catch(er){errback(er);}

      //consumer = await consumeAndResume(consumerTransport);
    });

    consumerTransport.on('connectionstatechange', (state) => {
      switch (state) {
        case 'connecting':
          console.log('subscribing...');
          break;

        case 'connected':
          console.log('subscribed');
          break;

        case 'failed':
          console.log('failed');
          producerTransport.close();
          break;

        default:
          break;
      }
    });

    videoConsumer = await consumeAndResume(consumerTransport, 'video');
    audioConsumer = await consumeAndResume(consumerTransport, 'audio');

    updateButtons();
  }


 async function consumeAndResume(transport, kind) {
    const consumer = await consume(consumerTransport, kind);
    if (consumer) {
      console.log('-- track exist, consumer ready. kind=' + kind);
      console.log('----- consumer: ', consumer);
      updateButtons();
      if (kind === 'video') {
        console.log('-- resume kind=' + kind);
        try{
        await sendRequest({type: 'resume',  kind: kind })
          
            console.log('resume OK');
           // alert('resume ok');
            return consumer;
          }catch(err){
            console.error('resume ERROR:', err);
            return consumer;
          }
      }
      else {
        console.log('-- do not resume kind=' + kind);
      }
    }
    else {
      console.log('-- no consumer yet. kind=' + kind);
      return null;
    }
  }
async function loadDevice(routerRtpCapabilities) {
    try {
      device = new MediasoupClient.Device();
    } catch (error) {
      if (error.name === 'UnsupportedError') {
        console.error('browser not supported');
      }
    }
    await device.load({ routerRtpCapabilities });
  }
  
  async function consume(transport, trackKind) {
    console.log('--start of consume --kind=' + trackKind);
    const { rtpCapabilities } = device;
    //const data = await socket.request('consume', { rtpCapabilities });
    var data;
    try{
    data = await sendRequest({type: 'consume',  rtpCapabilities: rtpCapabilities, kind: trackKind })
      }catch(err){
        console.error('consume ERROR:', err);
      };
 /*   const {
      producerId,
      id,
      kind,
      rtpParameters,
    } = data.params;
    */
    console.log("data.params:^^^^^6666 ", data.params);
console.log("DATA&&&&&&&&&&&&&&&&&&&&: ", data.params.producerId);
    const producerId = data.params.producerId;
    const id = data.params.id;
    const kind = data.params.kind;
    const rtpParameters = data.params.rtpParameters;
    
    if (producerId) {
      let codecOptions = {};
      const consumer = await transport.consume({
        id,
        producerId,
        kind,
        rtpParameters,
        codecOptions,
      });
      //const stream = new MediaStream();
      //stream.addTrack(consumer.track);

      addRemoteTrack(clientId, consumer.track);

      console.log('--end of consume');
      //return stream;

      return consumer;
    }else {
      console.warn('--- remote producer NOT READY');

      return null;
    }
  }




  function unpublish() {
	  wsend({type: "stop", request: "mediasoup"});
    if (localStream) {
      pauseVideo(localVideo);
      stopLocalStream(localStream);
      localStream = null;
    }
    if (videoProducer) {
      videoProducer.close();
            videoProducer = null;
    }
    if (audioProducer) {
      audioProducer.close(); // localStream will stop
      audioProducer = null;
    }
    if (producerTransport) {
      producerTransport.close(); // localStream will stop
      producerTransport = null;
    }

   // disconnectSocket();
    updateButtons();
     updateButtons2();
  }
    function disconnect2() {
    if (videoConsumer) {
      videoConsumer.close();
      videoConsumer = null;
    }
    if (audioConsumer) {
      audioConsumer.close();
      audioConsumer = null;
    }
    SENDER = false;
    if (consumerTransport) {
      consumerTransport.close();
      consumerTransport = null;
    }

   // removeAllRemoteVideo();

   // disconnectSocket();
   // updateButtons2();
  }



function hide_chat(el){
chatsection.classList.toggle("hide");
	}
	/*
function buser(){
return (buserBname.value ? true : false);
}
function sendi(ev){
if(ev.key === "Enter"){
send_up();
}
} */
/*
textarea.addEventListener('keydown', sendi, false);

function send_up(el){
if(!textarea.value)return;
let d = {};
d.type = "msg";
d.msg = textarea.value;
d.roomname = 'gesamt';//modelName.value;
d.from = myusername;// yourNick.value;
console.log(d)
wsend(d);	
//if(el)el.className = "puls";
textarea.value = "";
}
function insert_message(ob){
//sendChat.className = "";
let m = document.createElement('div');
m.className = "chat-div";
m.innerHTML = '<span class="chat-user">' + ob.from + ': </span><br><span class="chat-message">' + ob.msg + '</span>';
chat.appendChild(m);
chat.scrollTop = chat.clientHeight + chat.scrollHeight;
}
function set_username(){
myusername = (buser() ? buserBname.value :  clientNick);
wsend({type: "username", owner: false, name: myusername, roomname: "gesamt"});
}
function broadcasting(el){
	alert("To be implemented.");
	}
*/

