/**
 * [x] Make UI live
 * [x] Basic timer
 * [x] Count up timer
 * [x] Count down timer
 * [x] Make count down limit setup live
 * [x] Implement start time buffer to allow reset the down-counter correctly
 * [x] Implement HTML5 web worker for the timer
 * [x] Move main part into window.onload handler
 * [x] Turn off header's text selection
 * [x] Embed Open Sans in the project for offline using
 *
 * About the timer improvement:
 * 	The problem explained : 
 * 		http://stackoverflow.com/questions/5927284/how-can-i-make-setinterval-also-work-when-a-tab-is-inactive-in-chrome
 *  On a blog "HTML5 web workers" : 
 * 		https://robertnyman.com/2010/03/25/using-html5-web-workers-to-have-background-computational-power/
 *  MDN | Using Web Workers : 
 *  	https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
 * 
 * Note that web workers are avaliable since IE10 only: 
 * 	https://msdn.microsoft.com/en-us/library/hh673568(v=vs.85).aspx
 */

/**
 * User Interface Controller object definition
 * Node: don't use methods started with "_" directly, it's "private".
 */
function UI(){

	var self = this;

	//Hours, Minutes, Seconds, Miliseconds
	var _h = _m = _s = _ms = 0, 
	_h0 = _m0 = _s0 = _ms0 = 0; // start time buffer

	/**
	 * Privates: DOM monipulators
	 */
	function _hideSection (xid){
		document.getElementById(xid).className = 'hidden';
	};

	function _showSection (xid){
		document.getElementById(xid).className = '';
	};

	function _setClick (xid, handler){
		document.getElementById(xid).onclick = handler;	
	};

	function _setHtml (xid, val){
		document.getElementById(xid).innerHTML = val;
	};

	function _decorateStart (val,txt){
		_setHtml("btn-start", txt);
		document.getElementById("btn-start").className = 'btn '+val;
	};

	function _showNumpad (){
		document.getElementById("controls").className = 'block-off';		
		document.getElementById("numpad").className = 'block-on';
	};

	function _showControls (){
		document.getElementById("numpad").className = 'block-off';		
		document.getElementById("controls").className = 'block-on';
	};

	/**
	 * Privates: UI manipulators
	 */
	function _hideTimer (){
		_hideSection("timer");	
	};

	function _hideSelector (){
		_hideSection("selector");
	};

	function _setTimeText (val){
		_setHtml("up-value", val);
	};

	function _setMillisecondText (val){
		_setHtml("up-miliseconds", val);
	};

	function _updateDisplay (){

		// Prepare time text, add leading 0 where neccesary
		var t = '';
		t += (_h<10)?'0':'';
		t += _h;
		t += ":";
		t += (_m<10)?'0':'';
		t += _m;
		t += ":";
		t += (_s<10)?'0':'';
		t += _s;

		// Prepare milliseconds text with leading 0 if neccesary
		var m = '';
		m += (_ms<100)?'0':'';
		//m += (_ms< 10)?'0':'';
		m += _ms/10;

		_setMillisecondText(m);
		_setTimeText(t);

	};

	function _clearDisplay (){
		_clearTime();
		_updateDisplay();
	};

	function _clearTime(){
		_ms = _h0; _s = _s0; _m = _m0; _h = _h0;
	};

	function _udateTime (){

		// adjust Miliseconds (add a second is neccesary)
		if     (_ms < 0)    { _s--; _ms = _ms + 1000}
		else if(_ms >= 1000){ _s++; _ms = _ms - 1000};

		// adjust Seconds (add a minute is neccesary)
		if     (_s < 0)  {_m--;_s = _s + 60}
		else if(_s >= 60){_m++;_s = _s - 60};

		// adjust Minutes (add a houre is neccesary)
		if     (_m < 0)  {_h--;_m = _m + 60}
		else if(_m >= 60){_h++;_m = _m - 60};

		// adjust Hours
		if     (_h < 0)  {_h = _h + 24}
		else if(_h >= 24){_h = _h - 24};

		_updateDisplay();

		if (
			  _ms === 0 
			&& _s === 0 
			&& _m === 0 
			&& _h === 0
		){
			//console.info("A*L*A*R*M");
			_doAlarm();
		}
		
	};

	/**
	 * Privates: Event handlers
	 */
	function _doStart (){
		_decorateStart('blue',"Pause");
		_setClick("btn-start", _doPause);
		if( self.onStartClick !=null ){ self.onStartClick() }
	};

	function _doPause (){
		_decorateStart('green',"Cont..");
		_setClick("btn-start", _doContinue);
		if( self.onPauseClick !=null ){ self.onPauseClick() }
	};

	function _doContinue (){
		_decorateStart('blue',"Pause");
		_setClick("btn-start", _doPause);
		if( self.onContinueClick !=null ){ self.onContinueClick() }
	};

	function _doClear (){
		self.clear();
		if( self.onClearClick!=null ){ self.onClearClick() }
	};

	function _doSet (){
		_udateTime();
		_h0 = _h; _m0 = _m; _s0 = _s; _ms0 = _ms;
		if( self.onSetClick !=null ){self.onSetClick()}
	};

	function _doSetClear (){
		_clearDisplay();
		if( self.onSetClearClick !=null ){self.onSetClearClick()}
	};

	function _doNumkey (){
		self.setDigit(this.innerHTML);
		if( self.onNumkeyClick !=null ){self.onNumkeyClick(this.innerHTML)}
	};

	function _doAlarm (){
		self.reset();
		if( self.onAlarm !=null ){self.onAlarm()}
	};

	/**
	 * Public: Methods
	 */
	self.clear = function() {

		// Reset start button decoration
		_decorateStart('green',"Start");

		// Reser timer events handlers
		_setClick("btn-start", _doStart);
		_setClick("btn-clear", _doClear);
		_setClick("btn-set", _doSet);
		_setClick("btn-set-clear", _doSetClear);

		// Reset display values
		_clearDisplay();
		_clearTime();

	};

	self.reset = function() {
		_h0 = _m0 = _s0 = _ms0 = 0; // Clear startup values
		self.clear();
	};

	// Show up/down timer selector 
	self.showSelector = function (){
		_showSection("selector");
		_hideTimer();
		self.reset();
		if( self.onShowSelector !=null ){self.onShowSelector()};
	};

	// Show timer controls pannel
	self.showTimer = function(){

		_showControls();
		_hideSelector();
		_showSection("timer");	
	};

	// Show count down setup pannel
	self.showSetup = function(){
	
			_showNumpad();
			_hideSelector();
			_showSection("timer");	
	};

	// Add ms milliseconds to the current time
	// ms has to be +/- 1000 millisecs
	// ms can be negative for count down timing
	self.addMs = function(ms){

		ms = ms>1000?1000:ms;//limit increment by 1s
		_ms += ms;
		_udateTime();
	};

	// Add dgt digit to the time right, shifting all of the digits
	self.setDigit = function(dgt){

		function sft(x){ return (x%10*10) };
		function rst(x){ return ((x*10) - (x*10)%100)/100 };

		dgt = parseInt(dgt); // make sure the number input

		var r;
		r = rst(_s); _s=sft(_s)+dgt; dgt = r;
		r = rst(_m); _m=sft(_m)+dgt; dgt = r;
		r = rst(_h); _h=sft(_h)+dgt; //dgt = r;

		_updateDisplay ();

	};

	/**
	 * Public: Events
	 */
	self.onShowSelector  = null;
	self.onStartClick    = null;
	self.onPauseClick 	 = null;
	self.onContinueClick = null;
	self.onClearClick    = null;
	self.onSetClick    	 = null;
	self.onSetClearClick = null;
	self.onNumkeyClick   = null; //function(num)
	self.onAlarm		 = null;


	/**
	 * Initialization
	 */
		self.showSelector();

		// Set initial timer state
		self.reset();

		// Connect Selector events
		_setClick("arrow-up", self.showTimer);
		_setClick("arrow-down", self.showSetup);
		_setClick("header", self.showSelector);
		
		// Set numkey events
		for(var i=0;i<10;i++){
			_setClick("nk"+i, _doNumkey);
		}

		//console.info("ui is initialized");

		return this;

};

/**
 * Timer definitions
 */
function timerThread(){
// Use HTML5 worker based timer

	var self = this;

	var _timeWorker = new Worker("js/timeWorker.js");

	var _interval = 10;//Don't set it less than 10 to avoide CPU overload.

	self.onTick = null; // function(interval)

	var doTick = function(){
		if ( self.onTick != null ){self.onTick(
			(self.countDown?-1*_interval:_interval)
		)}
	};

	_timeWorker.onmessage = function(e) {
		doTick();
	};

	self.countDown = false; 

	self.setInterval = function(val){
		_interval = val;
	}

	self.run = function(){
		_timeWorker.postMessage([30,_interval]); // Sending message to set interval for timeWorker
		_timeWorker.postMessage([10,0]); // Sending message to start timeWorker
	};

	self.stop = function(){
		_timeWorker.postMessage([20,0]); // Sending message to stop timeWorker
	};

	return this;

};

function timerFallback(){
// Use fallback without worker 
 
	var self = this;

	var _intervalHandle = null;

	var _interval = 10;//Don't set it less than 10 due of posible ticks loss.

	self.onTick = null; // function(interval)

	var doTick = function(){
		if ( self.onTick != null ){self.onTick(
			(self.countDown?-_interval:_interval)
		)}
	};

	self.countDown = false; 

	self.setInterval = function(val){
		_interval = val;
	}

	self.run = function(){
		_intervalHandle = setInterval(doTick,_interval);
	};

	self.stop = function(){
		if ( _intervalHandle != null ){
			clearInterval(_intervalHandle);
			_intervalHandle = null;
		}
	};

	return this;

};


/**
 * Main
 */
window.onload = function() {

	// Check if Browser supports the Worker api.
	var timer = (window.Worker) ? new timerThread() : new timerFallback();

	var ui = new UI();

	ui.onShowSelector 	= function() {  	
		timer.stop();
		timer.countDown = false;
		//console.info("onShowSelector is happen");
	};
	ui.onStartClick 	= function() { timer.run(); 	
		//console.info("onStartClick is happen");
	};
	ui.onPauseClick 	= function() { timer.stop(); 	
		//console.info("onPauseClick is happen");
	};
	ui.onContinueClick 	= function() { timer.run(); 	
		//console.info("onContinueClick is happen");
	};
	ui.onClearClick 	= function() { timer.stop(); 	
		//console.info("onClearClick is happen");
	};
	timer.onTick 		= function(n){ ui.addMs(n); 	
	//	console.info("onTick is happen");
	};

	ui.onSetClick = function(){
		timer.countDown = true;
		ui.showTimer();
		//console.info("onSetClick is happen");
	};
	ui.onSetClearClick = function()	 { timer.countDown = false;
		//console.info("onSetClearClick is happen");
	};
	ui.onNumkeyClick = function(n)	 {
		//console.info("onNumkeyClick is happen for",n);
	};
	ui.onAlarm = function(n)		 { 
		timer.stop();
		timer.countDown = false;
		//console.info("onAlarm is happen");
	};


	//timer.setInterval(10);
	//ui.showTimer();
	//timer.countDown = true;
	//ui.showSetup();
	//ui.showSelector();

};