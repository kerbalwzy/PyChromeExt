/*
https://developer.chrome.com/docs/extensions/reference/tabs/
*/
let PyChromeExtIndexTab = null;

let TabsCreatedByPEC = {};

chrome.browserAction.onClicked.addListener(
	function() {
		if (PyChromeExtIndexTab === null) {
			chrome.tabs.create({
				url: chrome.extension.getURL('html/index.html'),
				active: true,
				selected: true,
			}, function(tab) {
				PyChromeExtIndexTab = tab;
			});
		} else {
			chrome.tabs.reload(PyChromeExtIndexTab.id)
			chrome.tabs.update(PyChromeExtIndexTab.id, {
				active: true,
				selected: true,
			})
		}
	}
);

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
	if (PyChromeExtIndexTab && tabId === PyChromeExtIndexTab.id) {
		PyChromeExtIndexTab = null;
	}
	if (TabsCreatedByPEC.hasOwnProperty(tabId)) {
		delete TabsCreatedByPEC[tabId]
	}
})

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
	if (TabsCreatedByPEC.hasOwnProperty(tabId)) {
		Object.keys(changeInfo).map(function(key) {
			TabsCreatedByPEC[tabId][key] = changeInfo[key]
		})
	}
})

function CreateTab(options, callback) {
	chrome.tabs.create(options, function(tab) {
		TabsCreatedByPEC[tab.id] = tab
		callback ? callback(tab) : null
	});
}


function RemoveTab(tabId, callback) {
	chrome.tabs.remove(tabId, function() {
		delete TabsCreatedByPEC[tabId]
		callback ? callback() : null
	})
}
