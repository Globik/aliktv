
 function on_producer_transport_close(){
		console.log("***************************************")
		console.log("producer transport closed")
		console.log("***********************************")
     if (videoProducer) {
        videoProducer.close();
        videoProducer = null;
      }
      if (audioProducer) {
        audioProducer.close();
        audioProducer = null;
      }
      
      producerTransport.observer.removeListener('close', on_producer_transport_close)
      console.log('producerTransport listeners ', producerTransport.observer.listeners('close'))
      producerTransport = null;
      console.log('videoproducer: ', videoProducer)
      console.log('audioproducer: ', audioProducer)
       
    }
   function on_video_transport_closed(){
	   console.log('**************************************')
	   console.log('video transport closed')
	   if (videoProducer) {
        videoProducer.close();
        videoProducer = null;
      }
	   }
	   function on_audio_transport_closed(){
	   console.log('**************************************')
	   console.log('audio transport closed')
	   if (audioProducer) {
        audioProducer.close();
        audioProducer = null;
      }
	   }
   function on_videoproducer_close(n) {
	   console.log("***************************************")
        console.log('videoProducer closed ---', n);
        console.log("***************************************")
      }
      
      function on_audioproducer_close(n) {
		  console.log("***************************************")
        console.log('audioProducer closed ---', n);
        console.log("***************************************")
      }
      
     
      
const handleMediasoup =  function(ws, data, WebSocket, sock){
	function wsend(ws, obj){
	console.log('hallo wsend')
	let a;
	try{
		a = JSON.stringify(obj);
		console.log('ws.readyState ', ws.readyState);
		console.log('a : ', a)
		if(ws.readyState === WebSocket.OPEN)ws.send(a)
		}catch(e){console.log(e)}
	}
	function broadcast(obj){
		sock.clients.forEach(function(client){
			wsend(client, obj);
			})
		}
		
	
	 function on_consumer_transport_close() {
      const id = getId(ws);
      console.log('--- consumerTransport closed. --')
      let consumer = getVideoConsumer(getId(ws));
      if (consumer) {
        consumer.close();
        removeVideoConsumer(id);
      }
      consumer = getAudioConsumer(getId(ws));
      if (consumer) {
        consumer.close();
        removeAudioConsumer(id);
      }
      removeConsumerTransport(id);
    }
      
	
	
	const mediasoup_t = async function(){
	//console.log("DATA : ", data);
	if(data.type == 'getRouterRtpCapabilities'){
		console.log('videoproducer: ', videoProducer)
		console.log('audioProducer: ', audioProducer)
				//console.log('router : ', router);
				if(data.vid == "publish"){
					if(producerTransport){
						wsend(ws, {type: "error", info: "Busy!"})
						return;
						}
			try{
				await	startWorker();
			}catch(e){console.log(e);return;}
			}
				if (router) {
     // console.log('getRouterRtpCapabilities: ', router.rtpCapabilities);
      var ew = router.rtpCapabilities;
     // ws.send(JSON.stringify({dura:'suka'}))
      wsend(ws, {type: data.type, routerrtpCapabilities: ew});
    }
				}else if(data.type == 'createProducerTransport'){
    console.log('-- createProducerTransport ---');
    producerSocketId = getId(ws);
    console.log('producerSocketId: ', producerSocketId)
    try{
    const { transport, params } = await createTransport();
    producerTransport = transport;
   // producerTransport.on('routerclose', function(){console.log('*** router closed ***')})
   // producerTransport.observer.on('close', on_producer_transport_close);
    //console.log('listeners transport close: ', producerTransport.observer.listeners('close'));
    
    //transport.on('routerclose', fn())
   // producerTransport.observer.removeListener('close', on_producer_close)
    
   // producerTransport.close();
    //console.log('-- createProducerTransport params:', params);
    ws.publish = true;
    let r = {};
    r.type = "createProducerTransport";
    r.params = params
    wsend(ws, r);
}catch(er){
	ws.publish = false;
	wsend(ws, {type: "error", info: er.toString()})
	}
 }else if(data.type == 'connectProducerTransport'){ 
	 console.log('connect producer transport',data);
	let b=data.dtlsParameters;
	 try{
    await producerTransport.connect({ 'dtlsParameters': data.dtlsParameters });
    wsend(ws, {type: "connectProducerTransport"});
}catch(e){
	ws.publish = false;
	console.log('producer transport connect error ', e.toString());
	wsend(ws, {type: "error", info: e.toString()})
	}
    
    }else if(data.type == 'produce'){
    const { kind, rtpParameters } = data;
    console.log('-- produce --- kind=', kind);
    if (kind === 'video') {
		try{
      videoProducer = await producerTransport.produce({ kind, rtpParameters });
      wsend(ws,{type: 'produce', id: videoProducer.id });
  }catch(er){
	  ws.publish = false;
	  wsend(ws, {type: "error", info: er.toString()})
	  }
    }
    else if (kind === 'audio') {
		try{
      audioProducer = await producerTransport.produce({ kind, rtpParameters });
      
      wsend(ws, {type: 'produce', id: audioProducer.id });
  }catch(er){
	  ws.publish = false;
	  wsend(ws, {type: "error", info: er.toString()})
	  }
    }
    else {
      console.error('produce ERROR. BAD kind:', kind);
      ws.publish = false;
      wsend(ws, {type: "produce"});
      return;
    }

    // inform clients about new producer
    console.log('--broadcast newProducer -- kind=', kind);
    broadcast({type: 'newProducer', kind: kind });

  }else if(data.type == 'createConsumerTransport'){
    console.log('-- createConsumerTransport ---');
    try{
    const { transport, params } = await createTransport();
    addConsumerTrasport(getId(ws), transport);
    transport.observer.on('close', function(){
		console.log('consumer transport closed')
		removeConsumerTransport(getId(ws));
		});
    //console.log('-- createTransport params:', params);
    wsend(ws,{type: data.type, params: params}); 
  }catch(er){
	  
	  wsend(ws, {type: "error", info: er.toString()})
  }
	  
  }else if(data.type == 'connectConsumerTransport'){
    console.log('-- connectConsumerTransport ---');
    let transport = getConsumerTrasnport(getId(ws));
    if (!transport) {
      console.error('transport NOT EXIST for id=' + getId(ws));
      wsend(ws,{type: data.type});
      return;
    }
    await transport.connect({ dtlsParameters: data.dtlsParameters });
    wsend(ws,{type: data.type});
  }else if(data.type == 'consume') {
    const kind = data.kind;
    console.log('-- consume --kind=' + kind);

    if (kind === 'video') {
      if (videoProducer) {
        let transport = getConsumerTrasnport(getId(ws));
        if (!transport) {
          console.error('transport NOT EXIST for id=' + getId(ws));
          return;
        }
        const { consumer, params } = await createConsumer(transport, videoProducer, data.rtpCapabilities); // producer must exist before consume
        //subscribeConsumer = consumer;
        const id = getId(ws);
        addVideoConsumer(id, consumer);
        consumer.observer.on('close', () => {
          console.log('consumer closed video---');
           removeVideoConsumer(id);
        })
        consumer.on('producerclose', () => {
          console.log('consumer -- on.producerclose');
          consumer.close();
          removeVideoConsumer(id);

          // -- notify to client ---
          wsend(ws,{type: 'producerClosed', localId: id, remoteId: producerSocketId, kind: 'video' });
        });

        console.log('-- consumer ready ---');
        wsend(ws,{type: data.type, params:params});
      }
      else {
        console.log('-- consume, but video producer NOT READY');
        const params = {type:'producerId', producerId: null, id: null, kind: 'video', rtpParameters: {} };
        wsend(ws, {type: data.type, params: params});
      }
    }
    else if (kind === 'audio') {
      if (audioProducer) {
        let transport = getConsumerTrasnport(getId(ws));
        if (!transport) {
          console.error('transport NOT EXIST for id=' + getId(ws));
          return;
        }
        const { consumer, params } = await createConsumer(transport, audioProducer, data.rtpCapabilities); // producer must exist before consume
        //subscribeConsumer = consumer;
        const id = getId(ws);
        addAudioConsumer(id, consumer);
        consumer.observer.on('close', () => {
          console.log('consumer closed  audio---');
           removeAudioConsumer(id);
        })
        consumer.on('producerclose', () => {
          console.log('consumer -- on.producerclose');
          consumer.close();
          removeAudioConsumer(id);

          // -- notify to client ---
          wsend(ws, {type: 'producerClosed',  localId: id, remoteId: producerSocketId, kind: 'audio' });
        });

        console.log('-- consumer ready ---');
        wsend(ws,{type:data.type, params});
      }
      else {
        console.log('-- consume, but audio producer NOT READY');
        const params = { producerId: null, id: null, kind: 'audio', rtpParameters: {} };
        wsend(ws,{type: data.type, params: params});
      }
    }
    else {
      console.error('ERROR: UNKNOWN kind=' + kind);
    }
  }else if(data.type == 'resume') {
    const kind = data.kind;
    console.log('-- resume -- kind=' + kind);
    if (kind === 'video') {
      let consumer = getVideoConsumer(getId(ws));
      if (!consumer) {
        console.error('consumer NOT EXIST for id=' + getId(ws));
        wsend(ws, {type: data.type});
        return;
      }
      await consumer.resume();
      wsend(ws, {type: data.type});
    }
    else {
      console.warn('NO resume for audio');
    }

						
		}else if(data.type == 'stop'){
			cleanUpPeer();
			}else{}
	}
		
	
		
const  cleanUpPeer = function() {
	console.log("SOCKET CLOSED!!*******************************")
  const id = getId(ws);
  const consumer = getVideoConsumer(id);
  if (consumer) {
    consumer.close();
    removeVideoConsumer(id);
  }
const aconsumer = getAudioConsumer(id);
if(aconsumer){
	aconsumer.close();
removeAudioConsumer(id);
} 
  const transport = getConsumerTrasnport(id);
  if (transport) {
	  console.log("*************************")
	  console.log("closing consumer transport ", id)
	  console.log("*******************************")
    transport.close();
    removeConsumerTransport(id);
  }
  if (producerSocketId === id) {
    console.log('---- cleanup producer ---');
    
    if (videoProducer) {
     videoProducer.close();
     videoProducer = null;
     
    }
    if (audioProducer) {
      audioProducer.close();
     audioProducer = null;
     }

    if (producerTransport) {
      producerTransport.close();
      producerTransport = null;
    }

    producerSocketId = null;

    // --- clenaup all consumers ---
    //console.log('---- cleanup clenaup all consumers ---');
    removeAllConsumers();
    if(router){router.close(); router=null;}
    
    if(worker){worker.close();worker=null;}
  }
}
		
		return { mediasoup_t, cleanUpPeer }
		
	}
	
 
		
	module.exports = { handleMediasoup: handleMediasoup }
	
	
		
		function sendResponse(response, callback) {
    //console.log('sendResponse() callback:', callback);
    callback(null, response);
  }

  // --- send error to client ---
  function sendReject(error, callback) {
    callback(error.toString(), null);
  }

  function sendback(ws, message) {
    wsend(ws, message);
  }


function getId(ws) {
  return ws.id;
}

const mediasoup = require("mediasoup");
const mediasoupOptions = {
  // Worker settings
  worker: {
    rtcMinPort: 10000,
    rtcMaxPort: 10100,
    logLevel: 'warn',
    logTags: [
      'info',
      'ice',
      'dtls',
      'rtp',
      'srtp',
      'rtcp',
      // 'rtx',
      // 'bwe',
      // 'score',
      // 'simulcast',
      // 'svc'
    ],
  },
  // Router settings
  router: {
    mediaCodecs:
      [
        {
          kind: 'audio',
          mimeType: 'audio/opus',
          clockRate: 48000,
          channels: 2
        },
        {
          kind: 'video',
          mimeType: 'video/VP8',
          clockRate: 90000,
          parameters:
          {
            'x-google-start-bitrate': 1000
          }
        },
      ]
  },
  // WebRtcTransport settings
  webRtcTransport: {
    listenIps: [
      { ip: (process.env.DEVELOPMENT == "yes" ? '127.0.0.1' : "45.89.66.225") , announcedIp: null }
    ],
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
    maxIncomingBitrate: 1500000,
    initialAvailableOutgoingBitrate: 1000000,
  }
};

let worker = null;
let router = null;
let producerTransport = null;
let videoProducer = null;
let audioProducer = null;
let producerSocketId = null;
//let consumerTransport = null;
//let subscribeConsumer = null;


async function startWorker() {
	try{
  const mediaCodecs = mediasoupOptions.router.mediaCodecs;
  worker = await mediasoup.createWorker();
  router = await worker.createRouter({ mediaCodecs });
  //producerTransport = await router.createWebRtcTransport(mediasoupOptions.webRtcTransport);
  router.on('workerclose', function(){
	  console.log('worker closed so router closed')
	  })
	  router.observer.on('close', function(){console.log('router closed')})
	  worker.observer.on('close', function(){
		  console.log('worker closed')
		  })
  console.log('-- mediasoup worker start. --')
}catch(e){console.log(e);}
}

// startWorker();

//
// Room {
//   id,
//   transports[],
//   consumers[],
//   producers[],
// }
//

// --- multi-consumers --
let transports = {};
let videoConsumers = {};
let audioConsumers = {};

function getConsumerTrasnport(id) {
  return transports[id];
}

function addConsumerTrasport(id, transport) {
  transports[id] = transport;
  console.log('consumerTransports count=' + Object.keys(transports).length);
}

function removeConsumerTransport(id) {
  delete transports[id];
  console.log('consumerTransports count=' + Object.keys(transports).length);
}

function getVideoConsumer(id) {
  return videoConsumers[id];
}

function addVideoConsumer(id, consumer) {
  videoConsumers[id] = consumer;
  console.log('videoConsumers count=' + Object.keys(videoConsumers).length);
}

function removeVideoConsumer(id) {
  delete videoConsumers[id];
  console.log('videoConsumers count=' + Object.keys(videoConsumers).length);
}

function getAudioConsumer(id) {
  return audioConsumers[id];
}

function addAudioConsumer(id, consumer) {
  audioConsumers[id] = consumer;
  console.log('audioConsumers count=' + Object.keys(audioConsumers).length);
}

function removeAudioConsumer(id) {
  delete audioConsumers[id];
  console.log('audioConsumers count=' + Object.keys(audioConsumers).length);
}

function removeAllConsumers() {
  for (const key in videoConsumers) {
    const consumer = videoConsumers[key];
    console.log('key=' + key + ',  consumer:', consumer);
    consumer.close();
    delete videoConsumers[key];
  }
  console.log('removeAllConsumers videoConsumers count=' + Object.keys(videoConsumers).length);

  for (const key in audioConsumers) {
    const consumer = audioConsumers[key];
    console.log('key=' + key + ',  consumer:', consumer);
    consumer.close();
    delete audioConsumers[key];
  }
}

async function createTransport() {
  const transport = await router.createWebRtcTransport(mediasoupOptions.webRtcTransport);
  console.log('-- create transport id=' + transport.id);

  return {
    transport: transport,
    params: {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters
    }
  };
}

async function createConsumer(transport, producer, rtpCapabilities) {
  let consumer = null;
  if (!router.canConsume(
    {
      producerId: producer.id,
      rtpCapabilities,
    })
  ) {
    console.error('can not consume');
    return;
  }

  //consumer = await producerTransport.consume({ // NG: try use same trasport as producer (for loopback)
  consumer = await transport.consume({ // OK
    producerId: producer.id,
    rtpCapabilities,
    paused: producer.kind === 'video',
  }).catch(err => {
    console.error('consume failed', err);
    return;
  });

  //if (consumer.type === 'simulcast') {
  //  await consumer.setPreferredLayers({ spatialLayer: 2, temporalLayer: 2 });
  //}

  return {
    consumer: consumer,
    params: {
      producerId: producer.id,
      id: consumer.id,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
      type: consumer.type,
      producerPaused: consumer.producerPaused
    }
  };
}


  
  
  
  
  
  
  
  

