var ExtId = chrome.runtime.id;

function dispatchRequest(request) {
	// TODO
}


chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (sender.id !== ExtId) {
			return
		}
		resp = dispatchRequest(request)
		sendResponse(resp)
	}
)

let socketCli = CreateSocketCli();
socketCli.on('my_response', function(msg, cb) {
	console.log(msg)
	if (cb)
		cb();
});
