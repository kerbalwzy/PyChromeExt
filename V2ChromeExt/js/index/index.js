function showCreatedTabs(tabs) {
	let elem = document.getElementById("created-tabs");
	for (var idx = 0; idx < elem.childNodes.length; idx) {
		var curNode = elem.childNodes.item(idx);
		elem.removeChild(curNode)
	}

	Object.keys(tabs).map(function(tabId) {
		let tab = tabs[tabId];
		let li = document.createElement('li');
		li.innerText = tabId + "@" + tab.title + "@" + tab.url;
		elem.appendChild(li)
	})
}
let flsuhTabsEleBtn = document.getElementById("flush-created-tabs");

flsuhTabsEleBtn.onclick = function(event) {
	chrome.runtime.sendMessage({
		cmd: ["flush-created-tabs"],
	}, function(response) {
		showCreatedTabs(response)
	})

}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log("msg from ext-" + sender.id + ": ", request)
	if (request.hasOwnProperty("cmd")) {
		switch (request.cmd) {
			case "showTabs":
				showCreatedTabs(request.tabs)
				break
		}
	}
})

let sendCmdBtn = document.getElementById("send-cmd");
let cmdInput = document.getElementById('cmd');

sendCmdBtn.onclick = function(event) {
	let cmd = cmdInput.value.trim();
	if (cmd === '') {
		return
	}
	let cmdArr = cmd.split(' ');
	chrome.runtime.sendMessage({
		cmd: cmdArr,
	})
}

cmdInput.onkeypress = function(event) {
	if (event.keyCode === 13) {
		let cmd = cmdInput.value.trim();
		if (cmd === '') {
			return
		}
		let cmdArr = cmd.split(' ');
		chrome.runtime.sendMessage({
			cmd: cmdArr,
		})
	}
}
