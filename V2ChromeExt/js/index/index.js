let tabStr = "&nbsp;&nbsp;&nbsp;&nbsp;"

function showCreatedTabs(tabs) {
	let elem = document.getElementById("created-tabs");
	for (var idx = 0; idx < elem.childNodes.length; idx) {
		var curNode = elem.childNodes.item(idx);
		elem.removeChild(curNode)
	}

	Object.keys(tabs).map(function(tabId) {
		let tab = tabs[tabId];
		let li = document.createElement('li');
		li.innerText = tabId + tabStr + tab.title + tabStr + tab.url;
		elem.appendChild(li)
	})
}


function flushNetSpeed(value) {
	let elem = document.getElementById('net-speed');
	elem.innerText = value
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log("msg from ext-" + sender.id + ": ", request)
	if (request.hasOwnProperty("cmd")) {
		switch (request.cmd) {
			case "showTabs":
				showCreatedTabs(request.tabs)
				break;
			case "flushNetSpeed":
				flushNetSpeed(request.value);
				break;
		}
	}
})
