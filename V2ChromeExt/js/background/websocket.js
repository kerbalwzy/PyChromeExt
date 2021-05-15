let pingTime;
let pingPongTimes = [];
let pingPongWait = 0

function ping() {
	pingTime = (new Date).getTime();
	socketCli.emit('ping');
}

function pongCallback() {
	let latency = (new Date).getTime() - pingTime;
	pingPongTimes.push(latency);
	pingPongTimes = pingPongTimes.slice(-30); // keep last 30 samples
	let sum = 0;
	for (let i = 0; i < pingPongTimes.length; i++) {
		sum += pingPongTimes[i];
	}
	pingPongWait = Math.round(10 * sum / pingPongTimes.length) / 10
}

function CreateSocketCli() {
	let socketCli = io.connect('http://127.0.0.1:9410');
	//
	socketCli.on('pong', pongCallback)
	socketCli.on('connect', function() {
		console.log('connected')
		ping()
		window.setInterval(ping, 10000);
	})
	return socketCli
}
