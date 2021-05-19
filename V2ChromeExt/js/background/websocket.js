var pingTime;
var pingPongTimes = [];
var pingPongWait = 0

function ping() {
	pingTime = (new Date).getTime();
	socketCli.emit('ping');
}

function pongCallback() {
	var latency = (new Date).getTime() - pingTime;
	pingPongTimes.push(latency);
	pingPongTimes = pingPongTimes.slice(-30); // keep last 30 samples
	var sum = 0;
	for (var i = 0; i < pingPongTimes.length; i++) {
		sum += pingPongTimes[i];
	}
	pingPongWait = Math.round(10 * sum / pingPongTimes.length) / 10
	if (PyChromeExtIndexTab) {
		chrome.tabs.sendMessage(PyChromeExtIndexTab.id, {
			cmd: "flushNetSpeed",
			value: pingPongWait
		})
	}
}

function CreateSocketCli() {
	var socketCli = io('http://localhost:9410', {
		autoConnect: false
	});
	//
	socketCli.on('pong', pongCallback)
	socketCli.on('connect', function() {
		console.log('connected success')
		ping()
		socketCli.PingInterval = window.setInterval(ping, 3000);
	})
	socketCli.on('close', function() {
		clearInterval(socketCli.PingInterval)
	})
	return socketCli
}
