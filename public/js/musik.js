'use strict';

let mediaRecorder;
let recordedBlobs;
var audioContext, audioContext2, ctx3;
var audioElement = document.getElementById("myaudio");
var cnv = document.getElementById("cnv");
var ctx = cnv.getContext("2d");

var flag = false;
var track,analyser;
let x = 0;
let files = ["/musik/0001rus.wav", "/musik/0002rus.wav", "/musik/0003rus.wav", "/musik/0004rus.wav"];

var si = files.length;

function disabled(n){
	if(n < si){
		zweit.disabled = false;
	}
	if(n > 0){
		first.disabled = false;
	}
	if(n == 0){
		first.disabled = true;
	}
	if(n == si - 1){

		zweit.disabled = true;
	
	}
}
async function getBuf(e){
	let n = Number(e.getAttribute("data-f"));
	
	if(n < 0){
		alert(n);
		
		return;
	}
	disabled(n);
	if(n == si){
	
		return;
	}

	e.disabled = true;
ctx3 = new AudioContext();

var audio3;

let data;

try{
data = await fetch(files[n]);
}catch(e){
	alert(e);
	return;
}
first.setAttribute("data-f", n - 1);
zweit.setAttribute("data-f", n + 1);



let arrayBuffer = await data.arrayBuffer();

let decodedAudio = await ctx3.decodeAudioData(arrayBuffer)
audio3 = decodedAudio;
		console.log(audio3);
		const playSound = ctx3.createBufferSource();
  playSound.buffer = audio3;

		let analyser = ctx3.createAnalyser();
		 analyser.smoothingTimeConstant = 1.0;
		playSound.connect(analyser);
		 analyser.connect(ctx3.destination);
  
  playSound.start(ctx3.currentTime);
  
  analyser.fftSize = 2048;

let bufferLength =  analyser.frequencyBinCount;
console.log(bufferLength);
let dataArray = new Uint8Array(bufferLength);

if(!flag){
	ctx.clearRect(0,0,cnv.width, cnv.height);
	flag = true;
}

drawf();


var drawVisual3;
  
  function drawf(){
	  drawVisual3 = requestAnimationFrame(drawf);
	  
	
	analyser.getByteTimeDomainData(dataArray);

	let d = dataArray;
	
	var sliceWidth =(cnv.width)/ bufferLength;
	
	ctx.lineWidth = 1;
	ctx.strokeStyle = "red";
	
	ctx.beginPath();
ctx.moveTo(x, cnv.height/2);
	
	for (var i = 0; i < bufferLength; i+=80) {

		  const v = (d[i]) / 128.0;
 const y = (v * cnv.height) / 2.0;

  if (i === 0) {
   ctx.moveTo(x, y);
 
  } else {
    ctx.lineTo(x, y);
  
  }

  x += sliceWidth;
}
	ctx.stroke();
  }
  
  playSound.onended = function(){
	  cancelAnimationFrame(drawVisual3);
	  ctx3.close();
	  
	  x=0;
	  
	  e.disabled = false
	disabled(n);
  
	  flag = false;
	  
	  }
  
}



audioElement.onplay = getSound;

function getSound(e){
		
		audioContext = new AudioContext();
	
		
		audioContext.resume().then(function(){


	if(!flag)ctx.clearRect(0, 0, cnv.width, cnv.height);

 
 flag = true;

if(!track){
		track = audioContext.createMediaElementSource(audioElement/*document.getElementById("myaudio")*/);
		 analyser = audioContext.createAnalyser();
		 analyser.smoothingTimeConstant = 1.0;
		 track.connect(analyser);
		 analyser.connect(audioContext.destination);

	}


analyser.fftSize = 2048;

var bufferLength =  analyser.frequencyBinCount;
console.log(bufferLength);
var dataArray = new Uint8Array(bufferLength);



draw();


var drawVisual;

function draw(){

	drawVisual = requestAnimationFrame(draw);
	
	analyser.getByteTimeDomainData(dataArray);

	let d = dataArray;
	
	var sliceWidth =(cnv.width)/ bufferLength;
	
	ctx.lineWidth = 1;
	ctx.strokeStyle = "red";
	
	ctx.beginPath();
ctx.moveTo(x, cnv.height/2);
	

for (var i = 0; i < bufferLength; i+=cnv.width) {
		  const v = (d[i]) / 128.0;
 const y = (v * cnv.height) / 2.0;

  if (i === 0) {
   ctx.moveTo(x, y);
 
  } else {
    ctx.lineTo(x, y);
  
  }

  x += sliceWidth;
}
	ctx.stroke();
}

audioElement.onpause = function(e){
	//alert('stop');
	cancelAnimationFrame(drawVisual);
	//track.disconnect(analyser);
	//flag = false;
	/*
	if (audioContext.state === "running") {
    audioContext.suspend().then(() => {
      console.warn( audioContext.state);
      //track = null;
      audioContext.close().then(() => {console.warn("audioctx closed");
		 // audioElement = null;
		  })
    });
}*/
	
}
audioElement.onended = function(e){
	//alert('end');
	
	cancelAnimationFrame(drawVisual);
	x = 0;
	//track.disconnect(analyser);
	if (audioContext.state === "running") {
   // audioContext.suspend().then(() => {
    //  console.warn( audioContext.state);
   //});
}
//track=undefined;
	flag = false;
}
})}



//let mediaRecorder;
//let recordedBlobs;
let cnv2 = document.getElementById("recorded");
let ctx2 = cnv2.getContext("2d");

ctx2.fillStyle='white';
ctx2.fillRect(0,0, cnv2.width, cnv2.height);

let audioCtx, flag2 = false, track2, analyser2,  x2 = 0;


const errorMsgElement = document.querySelector('span#errorMsg');
const recordedVideo = gum;
const recordButton = document.querySelector('button#record');
recordButton.addEventListener('click', () => {
  if (recordButton.textContent === 'Запись') {
    startRecording();
  } else {
    stopRecording();
    recordButton.textContent = 'Запись';
    playButton.disabled = false;
    downloadButton.disabled = false;
    
  }
});

const playButton = document.querySelector('button#play');
playButton.addEventListener('click', () => {
  const mimeType = 'audio/webm';
  const superBuffer = new Blob(recordedBlobs, {type: mimeType});
  recordedVideo.src = null;
  recordedVideo.srcObject = null;
  recordedVideo.src = window.URL.createObjectURL(superBuffer);
 
  recordedVideo.play();
  
	ctx2.fillStyle='white';
    ctx2.fillRect(0,0, cnv2.width, cnv2.height);
  recordedVideo.onplay = function(){
	 
	  getSound2();
	  
  }
});

	

const downloadButton = document.querySelector('button#download');
downloadButton.addEventListener('click', () => {
  const blob = new Blob(recordedBlobs, {type: 'audio/webm'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'test.wav';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
});

function handleDataAvailable(event) {
  console.log('handleDataAvailable', event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}


function startRecording() {
  recordedBlobs = [];
 
  const options = {mimeType: 'audio/webm'};

  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    console.error('Exception while creating MediaRecorder:', e);
    errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
    return;
  }

  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  recordButton.textContent = 'Стоп';
  playButton.disabled = true;
  downloadButton.disabled = true;
 
  mediaRecorder.onstop = (event) => {
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
  mediaRecorder.stop();
 
}

function handleSuccess(stream) {
  recordButton.disabled = false;
  console.log('getUserMedia() got stream:', stream);
  window.stream = stream;

  const gumVideo = document.querySelector('audio#gum');
  gumVideo.srcObject = stream;

}

async function init(constraints) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
  } catch (e) {
    console.error('navigator.getUserMedia error:', e);
    errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
  }
}

document.querySelector('button#start').addEventListener('click', async () => {
  document.querySelector('button#start').disabled = true;

  const constraints = {
    audio: {
      echoCancellation: {exact: true}
    }
    
  };
 console.log('Using media constraints:', constraints);
  await init(constraints);
});
		
		async function getSound2(){
	
			audioCtx = new AudioContext();
			await audioCtx.resume();


	if(!flag2)ctx2.clearRect(0, 0, cnv2.width, cnv2.height);

 
 flag2 = true;
if(!track2){
		track2 = audioCtx.createMediaElementSource(document.getElementById("gum"));
		 analyser2 = audioCtx.createAnalyser();
		 analyser2.smoothingTimeConstant = 1.0;
		 track2.connect(analyser2);
		 analyser2.connect(audioCtx.destination);
    }


	analyser2.fftSize = 2048;

	var bufferLength2 =  analyser2.frequencyBinCount;
	console.log(bufferLength2);
	var dataArray2 = new Uint8Array(bufferLength2);



draw2();


var drawVisual2;
		
		
		
		
function draw2(){

	drawVisual2 = requestAnimationFrame(draw2);
	
	analyser2.getByteTimeDomainData(dataArray2);

	let d = dataArray2;
	
	var sliceWidth2 =(cnv2.width)/ bufferLength2;
	
	

	ctx2.lineWidth = 1;
	ctx2.strokeStyle = "red";
	
	ctx2.beginPath();
for (var i = 0; i < bufferLength2; i+= 80){
		  const v2 = (d[i]) / 128.0;
			const y2 = (v2 * cnv2.height) / 2.0;

  if (i === 0) {
   ctx2.moveTo(x2, y2);
 
  } else {
    ctx2.lineTo(x2, y2);
  
  }

  x2 += sliceWidth2;
}
	ctx2.stroke();
}

gum.onended = function(e){
	
	cancelAnimationFrame(drawVisual2);
	x2 = 0;
   
	flag2 = false;
}

}




