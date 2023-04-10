
var Base = {
	HiScore: 0,
	SoundFlag: true,
	MusicFlag: true,
	//MuteFlag: false,
	FullscreenFlag: false,
	DecktopFlag: false,
	Lang:'en',
	LangIndex:0,
	LangScale:1,
	Saves:null,

	Clients: [],

	Mode: 1,

	Dusts: [],

	PauseFlag: false,

	Params: null, // JSON object

	EditModeFlag: true, // !!!

	MobileFlag: false,
	NoUpSoundFlag: false,
	NoLocalStorageFlag: false,

	PI2: Math.PI*2,

	BottomUp: 0, // up after scaling in mobile mode

	RealTimeInt: 1/30,

	Width: 2048, // const
	Height: 1500, // const

	WidthGame: 0,
	HeightGame: 0,

	WidthWnd: 0,
	HeightWnd: 0, // used to dynamic scaling in desktor browser

	// SOUNDS
	Sounds: [],

	GamesCount: 0,
	ScaleX : 1,
	ScaleY: 1,
	ScaleSaveX : 1,
	ScaleSaveY: 1,
	UPS: 30,
	FSCntr: 0,
	MarginTopStr: "0px",
	MarginLeftStr: "0px",
	MarginLeftSaveStr: "0px",

	ScalingDoneFlag: false,
	DistOut: 0,

	SndButton: 0,
	SndApplause0: 1,
	SndApplause1: 2,
	SndFirework: 3,
	SndClock: 4,
	SndWrong: 5,
	SndRight: 6,
	SndTimeUp: 7,

	//BgImgHeight: 965,
	BgIndex: 0,

	BgImgWidth:0,
	BgImgHeight:0,

    HCoeff: 1,
	Aspect: 1,

	Confeti:['conf0.png','conf1.png','conf2.png','conf3.png','conf4.png']
};

Base.clear = function()
{
	Base.SoundFlag = true;
	Base.MusicFlag = true;
};

Base.firstThings = function()
{
	Base.Dusts[0] = {speedMin:0,atlas:'atlas',scaleDie:0.1,timeFade:0.25,scale0:0.7,scaleRnd:0.3};
	Base.Dusts[1] = {speedMin:0.05,atlas:'atlas',scaleDie:0.1,timeFade:0.7,scale0:0.6,scaleRnd:0.6};
};

Base.addClient = function(name,org)
{
    var obj = {name:name,org:org};
	Base.Clients.push(obj);
};

Base.getStrParam = function(obj,def)
{
    if(obj===undefined)  return def;
	return obj;
};

Base.getFloatParam = function(obj,def)
{
	if(obj===undefined)  return def;
	return parseFloat(obj);
};

Base.getIntParam = function(obj,def)
{
	if(obj===undefined)  return def;
	return parseInt(obj);
};

Base.getBooleanParam = function(obj,def)
{
	if(obj===undefined)  return def;
	if(obj=='true')  return true;
	return false
};


Base.makeStrSeq = function(strbase,num0,num1,loopback) {
	var anim = [];
	for(var i=num0;i<=num1;i++)
	{
		 anim.push(strbase+i+'.png');
	}

	if(loopback)
		for(i=num1-1;i>num0;i--)
			anim.push(anim[i]);

	return anim;
};


Base.makeScreenAdjust = function(game) {

//	if(Backet.MobileFlag)  return;

//	Base.WidthWnd = window.innerWidth;
//	Base.HeightWnd = window.innerHeight;


	Base.WidthWnd = Math.max(window.innerWidth, document.documentElement.clientWidth);
	Base.HeightWnd = Math.max(window.innerHeight, document.documentElement.clientHeight);

//	console.log("wnd "+Base.WidthWnd+"  "+Base.HeightWnd);

	if((Base.HeightWnd /Base.WidthWnd)>(Base.Height/Base.Width))
	{
		// screen is tall so need to change
		// make size by width
	 	game.scale.setGameSize(Base.Width, Base.Width * (Base.HeightWnd / Base.WidthWnd));
		Base.ScaleX = Base.WidthWnd / (game.width);
	}
	else
	{
		// set by height
		game.scale.setGameSize(Base.Height*( Base.WidthWnd/Base.HeightWnd), Base.Height);
		Base.ScaleX = Base.HeightWnd / (game.height);
	}

//	game.canvas.style.marginLeft = '100px'

	Base.ScaleY = Base.ScaleX ;
	Base.ScaleSaveX = Base.ScaleX;
	Base.ScaleSaveY = Base.ScaleY;
	game.scale.setUserScale(Base.ScaleX, Base.ScaleY);

	//Base.HCoeff = (Base.Width * (Base.HeightWnd / Base.WidthWnd))/Base.Height;
//	Base.Aspect =  game.width/game.height;

	Base.WidthGame = game.width;
	Base.HeightGame = game.height;

	//console.log("game "+Base.WidthGame+"  "+Base.HeightGame);

	Base.Xc = game.width/2;
	Base.Yc = game.height/2;

	var state = game.state.getCurrentState(); // Boot,  Preloader,  Game
	if(state!=null)  state.AdjustSize();
};

Base.Boot = function(game) {};

Base.Boot.prototype = {
    preload: function() {
	//	this.load.crossOrigin =  'anonymous';
		this.load.atlas('loaderatlas', 'images/loader.png', 'images/loader.json');
	//	this.load.image('logo', 'images/logo.png');
    },

	AdjustSize: function() {
		// BASE FUNCTION
	},

    create: function() {
     	this.stage.backgroundColor = '#f7be17';

        this.input.maxPointers = 1;
		this.stage.disableVisibilityChange = true;

		Base.ScaleY = 1;
		Base.ScaleX = 1;
		//Base.Width = 960;//  constant
		//Base.Height = 960;// constant
		Base.Scale = this.game.height/Base.Height;

		var params = getAllUrlParams(window.location.href);
		if(params.admin!=undefined) {
			  Base.Mode = 1;
 		}

		if(params.client!=undefined) {
			Base.Mode = 0;
		}

		this.game.time.advancedTiming = true;
		this.game.time.desiredFps = 30;

		var desktop = this.game.device.desktop;
		if(this.game.device.android) desktop = false;
		if(this.game.device.iOS) {
			desktop = false;
			//Spiky.NoLocalStorageFlag = true;
		}
		Base.DecktopFlag = desktop;

	//	Base.NoLocalStorageFlag = false;
		//if(!this.game.device.localStorage)
		//	Base.NoLocalStorageFlag = true;

		if (desktop)
		{
			Base.MobileFlag = false;
			this.stage.disableVisibilityChange = true;

			this.scale.fullScreenScaleMode = Phaser.ScaleManager.USER_SCALE;
			this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
			this.scale.pageAlignHorizontally = true;
			this.scale.pageAlignVertically = true;

		//	this.game.scale.setGameSize(this.game.width, this.game.height-150); //###

			Base.makeScreenAdjust(this.game);
		}
		else {
			Base.MobileFlag = true;

			this.scale.fullScreenScaleMode = Phaser.ScaleManager.USER_SCALE;
			this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
			this.scale.pageAlignHorizontally = true;
			this.scale.pageAlignVertically = true;

			Base.makeScreenAdjust(this.game);
		}


		/*document.addEventListener("pause", Base.onPause, false);
		document.addEventListener("resume", Base.onPause, false);

		document.addEventListener("resign", Base.onPause, false);
		document.addEventListener("active", Base.onPause, false); */

		//this.state.getCurrentState(); // Boot,  Preloader,  Game
        this.state.start('Preloader');
    }
};



function getAllUrlParams(url) {

	// get query string from url (optional) or window
	var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

	// we'll store the parameters here
	var obj = {};

	// if query string exists
	if (queryString) {

		// stuff after # is not part of query string, so get rid of it
		queryString = queryString.split('#')[0];

		// split our query string into its component parts
		var arr = queryString.split('&');

		for (var i = 0; i < arr.length; i++) {
			// separate the keys and the values
			var a = arr[i].split('=');

			// set parameter name and value (use 'true' if empty)
			var paramName = a[0];
			var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

			// (optional) keep case consistent
			paramName = paramName.toLowerCase();
			if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

			// if the paramName ends with square brackets, e.g. colors[] or colors[2]
			if (paramName.match(/\[(\d+)?\]$/)) {

				// create key if it doesn't exist
				var key = paramName.replace(/\[(\d+)?\]/, '');
				if (!obj[key]) obj[key] = [];

				// if it's an indexed array e.g. colors[2]
				if (paramName.match(/\[\d+\]$/)) {
					// get the index value and add the entry at the appropriate position
					var index = /\[(\d+)\]/.exec(paramName)[1];
					obj[key][index] = paramValue;
				} else {
					// otherwise add the value to the end of the array
					obj[key].push(paramValue);
				}
			} else {
				// we're dealing with a string
				if (!obj[paramName]) {
					// if it doesn't exist, create property
					obj[paramName] = paramValue;
				} else if (obj[paramName] && typeof obj[paramName] === 'string'){
					// if property does exist and it's a string, convert it to an array
					obj[paramName] = [obj[paramName]];
					obj[paramName].push(paramValue);
				} else {
					// otherwise add the property
					obj[paramName].push(paramValue);
				}
			}
		}
	}

	return obj;
}
