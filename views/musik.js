const musik = function(n){
	return `<html>
	<head>
	<style>
	div{margin-top: 10px;margin-bottom:10px;padding: 10px;}
	button{padding: 5px;}
	</style>
	</head>
	<body></body>
	<div><button  onclick="getBuf(this);" id="first" data-f = "-1" disabled>Предыдущая</button> &nbsp;&nbsp;&nbsp;<button data-f="0" id="zweit" onclick="getBuf(this);">Следующия</button></div>
	<div>
	<canvas id="cnv" style="border: 1px solid green;height:100px;width:400px;"></canvas><br><audio id="myaudio" src="/musik/0001rus.wav"></audio>
	</div>
		<div>
	<audio id="gum" atoplay unmutd></audio>
	<canvas id='recorded' style='border:1px solid green;width:400px; height:100px;'></canvas>
	
	</div>

    <div>
        <button id="start">Вкл. микрофон</button>
        <button id="record" disabled>Запись</button>
        <button id="play" disabled>Слушать</button>
        <button id="download" disabled>Скачать</button>
    </div>
    <div>
        <span id="errorMsg"></span>
    </div><p>здравствуйте. добро пожаловать. доброе утро. добрый день</p>
	<script src="/js/musik.js"></script>
	</html>`
}
module.exports = {musik}
