var sock = null;
var spanWhosOn = gid( "spanWhosOn" );
var loc1 = location.hostname + ':' + location.port;
var loc2 = location.hostname;
var loc3 = loc1 || loc2;
var new_uri;

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
var vV = gid( "vV" );
if(window.location.protocol === "https:"){
new_uri = 'wss:';
}else{
new_uri = 'ws:';
}

function get_socket(){
sock = new WebSocket( new_uri + '//' + loc3 + '/gesamt' );

sock.onopen = function(){
console.log("websocket opened");
}
sock.onerror = function(e){
	note({ content: "Websocket error: " + e, type: "error", time: 5 }); 
	}
sock.onmessage = function(evt){
let a;
try{
	a = JSON.parse( evt.data );
	on_msg( a );
	}catch( e ){
	note({ content: e, type: "error", time: 5 });
}
}
sock.onclose = function(){
	sock = null;
note({ content: "Websocket closed!", type: "error", time: 5 });
}
}
get_socket();
async function on_msg(data){
	//alert(data.type);
if( data.type == 'welcome' ){
	clientId = data.id;
	}else if( data.type == "hi" ){
	if(spanWhosOn) spanWhosOn.textContent = data.value;
	}else if( data.type == "onconsume" ){
			if( vV ) vV.textContent = data.value;
			}else if( data.type == "producer_unpublished" ){
				if( vV ) vV.textContent = 0;
				enableElement("startMediaBtn");
				enableElement("stopMediaBtn");
				}else if( data.type == "producer_published" ){
					disableElement("startMediaBtn");
					disableElement("stopMediaBtn");
					localVideo.poster = data.img_data;
					}else if( data.type == "perror" ){
			
		note({ content: data.info, type: "error", time: 5 });
		}else{
			console.warn("Unknown type: ", data.type);
			}
}

function wsend(obj){
if(!sock)return;
try{
sock.send(JSON.stringify(obj));	
}catch(e){ note({ content: e, type: "error", time: 5 }); }	
}

function sendRequest( obj ) {
    return new Promise(( resolve, reject ) => {
		obj.request = "mediasoup";
      sock.send(JSON.stringify(obj));
      sock.onmessage = function(e){
		  let a;
		  try{
		  a = JSON.parse(e.data);
	  }catch( er ){
		  reject( er );
		  }
	  
		  if( a.type == obj.type ){
			  resolve(a);
			  }else if( a.type == "error" ){
				  reject( a.info );
				  }else{
		  on_msg( a );
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
      .catch(err => { note({ content: err, type: "error", time: 5 })});
  }


 function addRemoteVideo( id ) {
let element = document.getElementById('localVideo');
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
    knopkaSubscribe.style.display = "block";
    anketaForms.classList.toggle("open");
    enableElement("startMediaBtn");
    enableElement("stopMediaBtn");
    	
  }

 
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

  function stopMedia(el) {
	 // if(SENDER){
    if (localStream) {
      pauseVideo(localVideo);
      stopLocalStream(localStream);
      localStream = null;
      SENDER = false;
    }
  el.setAttribute('disabled', 1);
  }
  
   async function publish(el) {
   if(SENDER) return;

if (!localStream) {
      console.warn('WARN: local media NOT READY');
      return;
    }

      try{
      const data = await sendRequest({type: 'getRouterRtpCapabilities', vid: "publish"});
      await loadDevice(data.routerrtpCapabilities);
     // SENDER = true;
  }catch(e){
	  note({ content: e, type: "error", time: 5 });
	  SENDER = false;
	  return;
	  }
        updateButtons();
    const params = await sendRequest({type: 'createProducerTransport'});
    console.log('transport params:', params);
    producerTransport = device.createSendTransport(params.params);
    console.log(' --- join & start publish --');
    producerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      console.log('--trasnport connect', dtlsParameters );
     
      try{
     await sendRequest({ type: 'connectProducerTransport', transportId: producerTransport.id, dtlsParameters: dtlsParameters })
        callback();
       }catch(er){
		   note({ content: er, type: "error", time: 5 });
		   errback(er);
		   };
    });

    producerTransport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
      console.log('--trasnport produce');
      try {
        const { id } = await sendRequest({ type: 'produce', transportId: producerTransport.id, kind, rtpParameters });
        callback({ id });
      } catch (err) {
      note({ content: err, type: "error", time: 5 }); 
       errback(err);
      }
    });

    producerTransport.on('connectionstatechange', (state) => {
		console.warn("state: ", state);
      switch (state) {
        case 'connecting':
          console.log('publishing...');
          break;

        case 'connected':
          SENDER = true; 
          note({ content: "Вы в эфире!", type: "info", time: 5 });
          let img_data = get_screenshot(); wsend({ clientId: clientId, img_data: img_data, type: "pic", request: "mediasoup" });
          disableElement("startMediaBtn");
          disableElement("stopMediaBtn");
          el.setAttribute('disabled', 1);
          enableElement("stopTranslation");
          break;

        case 'disconnected':
        note({ content: "Disconnected!", type: "info", time: 5 });
       if(producerTransport) producerTransport.close();
       el.removeAttribute('disabled');
        unpublish();
       break;
        
        case 'failed':
          note({ content: "Не удалось сконнектиться с сервером!", type: "error", time: 5 });
          if(producerTransport) producerTransport.close();
          unpublish();
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
        try{
        videoProducer = await producerTransport.produce(trackParams);
	}catch(err){
		note({ content: err, type: "error", time: 5 });
		}
      }
    }
    if (useAudio) {
      const audioTrack = localStream.getAudioTracks()[ 0 ];
      if (audioTrack) {
        const trackParams = { track: audioTrack };
        try{
        audioProducer = await producerTransport.produce(trackParams);
	}catch(err){
		note({ content: err, type: "error", time: 5 })
		}
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
enableElement("stopMediaBtn");
el.setAttribute('disabled', 1);
	}
	disableElement('stopMediaBtn');
	disableElement("stopTranslation");
	/*
	function go_ahead(el){
		alert("Under construction!"); 
		}
		*/ 
	async	function subscribe(el){
			if( SENDER ) { note({ content: "Вы не можете на себя подписаться!", type: "info", time: 5 });return; }
			try{
      const data = await sendRequest({type: 'getRouterRtpCapabilities', vid: 'subscribe'});
      await loadDevice(data.routerrtpCapabilities);
    }catch(err){
		note({ content: err, type: "error", time: 5 });
		return;
		}

    updateButtons();

    let params;
    try{
    params = await sendRequest({type: 'createConsumerTransport'});
}catch(err){
		note({ content: err, type: "error", time: 5 });
		return;
	}
    consumerTransport = device.createRecvTransport(params.params);
  
    consumerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      try{
      await sendRequest({type: 'connectConsumerTransport', dtlsParameters: dtlsParameters })
        callback()
        }catch(er){
			note({ content: er, type: "error", time: 5 });
			errback(er);
			}
    });

    consumerTransport.on('connectionstatechange', (state) => {
		console.log("state: ", state);
      switch (state) {
        case 'connecting':
          console.log('subscribing...');
          break;

        case 'connected':
          note({ content: "Вы подключились к трансляции!", type: "info", time: 5 });
          wsend({ type: "onconsume", request: "mediasoup" })
          break;
        case 'disconnected':
        note({ content: 'Disconnected!', type: 'info', time: 5 });
        break;
        
        case 'failed':
          note({ content: 'Failed to subscribe!', type: "error", time: 5 });
        //  producerTransport.close();
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
    let consumer;
    try{
		consumer = await consume(consumerTransport, kind);
	}catch(err){
		note({ content: err, type: "error", time: 5 });
		}
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
            note({ content: err, type: "error", time: 5 });
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
       note({ content: 'Browser not supported!', type: "error", time: 5 });
      }
    }
    try{
    await device.load({ routerRtpCapabilities });
}catch(err){
	note({ content: err, type: "error", time: 5 });
	}
  }
  
  async function consume(transport, trackKind) {
    console.log('--start of consume --kind=' + trackKind);
    const { rtpCapabilities } = device;
    var data;
    try{
    data = await sendRequest({type: 'consume',  rtpCapabilities: rtpCapabilities, kind: trackKind })
      }catch(err){
        note({ contrent: 'Consume ERROR: ' + err, type: "error", time: 5 });
      };
 
    const producerId = data.params.producerId;
    const id = data.params.id;
    const kind = data.params.kind;
    const rtpParameters = data.params.rtpParameters;
    
    if (producerId) {
      let codecOptions = {};
      let consumer;
      try{
		  consumer = await transport.consume({
        id,
        producerId,
        kind,
        rtpParameters,
        codecOptions,
      });
}catch(err){
	note({ content: err, type: "error", time: 5 });
	return null;
	}
      addRemoteTrack(clientId, consumer.track);

      return consumer;
    }else {
      note({ content: 'Remote producer NOT READY', type: "info", time: 5 });

      return null;
    }
  }




  function unpublish() {
	  if( !SENDER ) { return; }
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
    updateButtons();
    // updateButtons2();
     SENDER = false;
     if( vV ) vV.textContent = 0;
      disableElement("stopTranslation");
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
function get_screenshot(){
let cnv = document.createElement('canvas');
let w = 180;
let h = 150;
cnv.width = w;
cnv.height = h;
var c = cnv.getContext('2d');
c.drawImage(localVideo, 0, 0, w, h);
var img_data = cnv.toDataURL('image/png', 0.5);
cnv.remove();
return img_data;
}
localVideo.onloadedmetadata = function(){
startTranslation.removeAttribute('disabled');
//enableElement('stopMediaBtn');
knopkaSubscribe.style.display = "none";	
}
function enableElement(id) {
    let element = document.getElementById(id);
    if (element) {
      element.removeAttribute('disabled');
    }
  }

  function disableElement(id) {
    let element = document.getElementById(id);
    if (element) {
      element.setAttribute('disabled', '1');
    }
  }
