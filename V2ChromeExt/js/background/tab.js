/*
 https://developer.chrome.com/docs/extensions/reference/windows/
 */
var WindowsCreatedByPCE = {};

chrome.windows.onBoundsChanged.addListener(function(win) {
	if (WindowsCreatedByPCE.hasOwnProperty(win.id)) {
		WindowsCreatedByPCE[win.id] = win
	}
})

chrome.windows.onRemoved.addListener(function(windowId) {
	if (WindowsCreatedByPCE.hasOwnProperty(windowId)) {
		delete WindowsCreatedByPCE[windowId]
	}
	if (windowId == WorkWindow.id) {
		WorkWindow = null
	}
})

function CreateWindow(options, callback) {
	chrome.windows.create(options, function(win) {
		WindowsCreatedByPCE[win.id] = win
		if (WorkWindow == null) {
			WorkWindow = win
		}
		callback ? callback(win) : null
	})
}


function RemoveWindow(windowId, callback) {
	chrome.windows.remove(windowId, function() {
		delete WindowsCreatedByPCE[windowId]
		callback ? callback() : null
	})
}

/*
https://developer.chrome.com/docs/extensions/reference/tabs/
*/
var PyChromeExtIndexTab = null;
var WorkWindow = null;
var TabsCreatedByPEC = {};

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

function __createTab(options, callback) {
	// 如果没有设置过windowId, 则将tab创建到默认给工作窗口
	options.windowId = options.windowId ? options.windowId : WorkWindow.id;
	chrome.tabs.create(options, function(tab) {
		TabsCreatedByPEC[tab.id] = tab
		callback ? callback(tab) : null
	});
}

function CreateTab(options, callback) {
	options = options ? options : {}
	// 如果没有创建过默认的工作窗口, 则只需要创建一个新的工作窗口即可
	if (WorkWindow == null) {
		var winOptions = {
			state: "maximized"
		}
		if (options.url) {
			winOptions.url = options.url
		}
		CreateWindow(winOptions, function(win) {
			chrome.tabs.get(win.tabs[0].id, function(tab) {
				TabsCreatedByPEC[tab.id] = tab
				callback ? callback(tab) : null
			})
		})
	} else {
		__createTab(options, callback)
	}

}

function RemoveTab(tabId, callback) {
	chrome.tabs.remove(tabId, function() {
		delete TabsCreatedByPEC[tabId]
		callback ? callback() : null
	})
}

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
