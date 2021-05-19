console.log("content js");

function IsNumber(val) {
	let regPos = /^\d+(\.\d+)?$/; //非负浮点数
	let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
	return regPos.test(val) || regNeg.test(val);
}

function GetEventSelector(event) {
	if (!event) {
		return
	}
	let elePath = [];
	for (let i = 0; i < event.path.length; i++) {
		let tempNode = event.path[i];
		if (tempNode.id !== "") {
			if (IsNumber(tempNode.id)) {
				elePath.push("#\\3" + tempNode.id)
			} else {
				elePath.push("#" + tempNode.id)
			}
			break
		}
		if (tempNode.classList.length > 0) {
			elePath.push(tempNode.localName + "." + Array.prototype.slice.call(tempNode.classList).join("."))
		} else {
			elePath.push(tempNode.localName)
		}
	}
	return elePath.reverse().join(" > ")
}


document.onclick = function(event) {
	let selector = GetEventSelector(event)
	console.log(selector)
}
