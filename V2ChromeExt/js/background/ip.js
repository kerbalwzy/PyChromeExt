function GetLocalIPs(callback) {
	var ips = [];
	var RTCPeerConnection = window.RTCPeerConnection ||
		window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
	var pc = new RTCPeerConnection({
		// Don't specify any stun/turn servers, otherwise you will
		// also find your public IP addresses.
		iceServers: [{
				url: 'stun:stun1.l.google.com:19302'
			},
			{
				url: 'stun:stun2.l.google.com:19302'
			},
			{
				url: 'stun:stun3.l.google.com:19302'
			},
			{
				url: 'stun:stun4.l.google.com:19302'
			},
			{
				url: 'stun:stunserver.org'
			},
		]
	});
	// Add a media line, this is needed to activate candidate gathering.
	pc.createDataChannel('');
	// onicecandidate is triggered whenever a candidate has been found.
	pc.onicecandidate = function(e) {
		if (!e.candidate) { // Candidate gathering completed.
			pc.close();
			callback(ips);
			return;
		}
		var ip = /^candidate:.+ (\S+) \d+ typ/.exec(e.candidate.candidate)[1];
		if (ips.indexOf(ip) == -1) // avoid duplicate entries (tcp/udp)
			ips.push(ip);
	};
	pc.createOffer(function(sdp) {
		pc.setLocalDescription(sdp);
	}, function onerror() {});
}
