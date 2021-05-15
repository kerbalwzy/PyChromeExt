/*
 https://developer.chrome.com/docs/extensions/reference/windows/
 */
let WindowsCreatedByPCE = {};


chrome.windows.onBoundsChanged.addListener(function(win) {
	if (WindowsCreatedByPCE.hasOwnProperty(win.id)) {
		WindowsCreatedByPCE[win.id] = win
	}
})

chrome.windows.onRemoved.addListener(function(windowId) {
	if (WindowsCreatedByPCE.hasOwnProperty(windowId)) {
		delete WindowsCreatedByPCE[windowId]
	}
})

function CreateWindow(options, callback) {
	chrome.windows.create(options, function(win) {
		WindowsCreatedByPCE[win.id] = win
		callback ? callback(win) : null
	})
}


function RemoveWindow(windowId, callback) {
	chrome.windows.remove(windowId, function() {
		delete WindowsCreatedByPCE[windowId]
		callback ? callback() : null
	})
}
