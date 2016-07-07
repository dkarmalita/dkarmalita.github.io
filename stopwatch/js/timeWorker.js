/**
 * Timer.js : the HTML5 worker
 * ===========================
 * 
 * References: 
 * 	* W3C Web Workers specification : https://www.w3.org/TR/workers/
 *  * MDN | Using Web Workers" : https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
 *
 */

var cnt = 0,
interval = 10,
intervalHandle = null;

doTick = function(){
  postMessage(cnt++);
};

onmessage = function(e) {
	switch(e.data[0]){
		case 10: // start
			intervalHandle = setInterval(doTick,interval);
			break;
		case 20: // stop
			clearInterval(intervalHandle);
			break;
		case 30: // set interval
			interval = e.data[1];
			break;
		default:
		  	console.warn('TIMER:','Unknown command!');
	};
};