var ExtId = chrome.runtime.id;

function dispatchRuntimeMsg(request) {
	// TODO 处理来自浏览器本身的消息
}


chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (sender.id !== ExtId) {
			return
		}
		resp = dispatchRuntimeMsg(request)
		sendResponse(resp)
	}
)

let socketCli = CreateSocketCli();
socketCli.on('my_response', function(msg, cb) {
	console.log(msg)
	if (cb)
		cb();
});

socketCli.on('connect_error', function(error) {
	console.log(error)
})


GetLocalIPs(function(ips) {
	console.log(ips)
})
// console.log(socketCli.connected)
// socketCli.connect()
// // setTimeout(function() {
// // 	console.log(socketCli.connected)
// // 	socketCli.disconnect()
// // 	console.log(socketCli.connected)
// // }, 5000)
