Base.Preloader = function(game) {
    this.preloadBar = null;
    this.ready = false;
    this.State = 0;
    this.W_temp = 0;
    this.H_temp = 0;
};

Base.Preloader.prototype = {
	
	preload: function () {

        Base.clear();
        Base.firstThings();

        this.load.onLoadComplete.add(this.loadComplete, this);

        this.State = 0;

        this.ImgsToLoad = [];

        this.ParamsLoadedFlag = false;

        this.BgImg = null;
        this.AtlasLoadedFlag = false;

        this.GroupBase = this.add.group();

        this.Group0 = this.make.group();
        this.GroupBase.add(this.Group0);

        this.Group0.scale.set(Base.Scale);

        this.preloadBarBack = null;
        this.preloadBar = null;

        this.TimerFunc = function()
        {
           this.checkScreenChange();

            if(!this.ParamsLoadedFlag) {
                if(this.game.cache.checkJSONKey('params')) {
                    this.ParamsLoadedFlag = true;
                    // this.load.image('bg', 'images/bg.png');
                    // this.load.image('logo', 'images/logo.png');
                    //
                    Base.Params = this.game.cache.getJSON('params');

                   // console.log("Params loaded");
                  //  console.log(Base.Params);

                    if(Base.Params.bg!=undefined) {
                        var path = Base.getStrParam(Base.Params.bg.path,'images/bg.png');
                        this.load.image('bg', path);
                        this.ImgsToLoad.push('bg');
                    }

                    if(Base.Params.logo!=undefined) {
                        path = Base.getStrParam(Base.Params.logo.path,'images/logo.png');
                        this.load.image('logo', path);
                        this.ImgsToLoad.push('logo');
                    }

                    if(Base.Params.imgs!=undefined) {
                        for(i=0;i<Base.Params.imgs.length;i++) {
                            if(Base.Params.imgs[i].name!=undefined &&
                                Base.Params.imgs[i].path!=undefined) {
                                this.ImgsToLoad.push(Base.Params.imgs[i].name);
                                this.load.image(Base.Params.imgs[i].name, Base.Params.imgs[i].path);
                            }
                        }
                    }

                    if(Base.Params.company!=undefined) {
                        for(i=0;i<Base.Params.company.length;i++) {
                            if(Base.Params.company[i].name!=undefined &&
                                Base.Params.company[i].path!=undefined) {
                               // this.ImgsToLoad.push(Base.Params.company[i].name);
                                this.load.image(Base.Params.company[i].name, Base.Params.company[i].path);
                            }
                        }
                    }

                    if(Base.Params.atlas!=undefined) {
                        for(var i=0;i<Base.Params.atlas.length;i++) {
                            if(Base.Params.atlas[i].name!=undefined &&
                                Base.Params.atlas[i].path!=undefined &&
                                Base.Params.atlas[i].json!=undefined) {

                                this.ImgsToLoad.push(Base.Params.atlas[i].name);
                                this.load.atlas(Base.Params.atlas[i].name,Base.Params.atlas[i].path,
                                    Base.Params.atlas[i].json);
                            }
                        }
                    }

                  //  path = Base.getStrParam(Base.Params.prizes.path,'images/prizes.png');
                 ///   var json =  Base.getStrParam(Base.Params.prizes.json,'images/prizes.json');
                   // this.load.atlas('prizes', path, json);

                    this.ParamsLoadedFlag = true;
                   // parseInt
                   // if(Base.Params.bg)
                }
            }

            if((!this.AtlasLoadedFlag) && this.game.cache.checkImageKey('loaderatlas')) {
                this.AtlasLoadedFlag = true;
                // load all when ready

                this.BgImg = this.make.image(Base.Xc, Base.Yc, 'loaderatlas','bg.png');
                if(this.BgImg!=null)
                  this.BgImg.scale.set(Base.WidthGame/256,Base.HeightGame/256);
                this.BgImg.anchor.setTo(0.5);
                this.Group0.add(this.BgImg);

                this.preloadBarBack = this.make.image(Base.Xc, Base.Yc, 'loaderatlas','sliderbg.png');
                this.preloadBarBack.anchor.setTo(0.5, 0.5);
                this.Group0.add(this.preloadBarBack);

                this.preloadBar = this.make.image(Base.Xc, Base.Yc,'loaderatlas','slider.png');
                this.preloadBar.anchor.setTo(0.5, 0.5);
                this.Group0.add(this.preloadBar);

                var frameData = this.cache.getFrameData('loaderatlas');
                this.PreloaderWidth = frameData.getFrameByName('sliderbg.png').width;
                this.preloadBar.x -= this.PreloaderWidth/2;
                this.preloadBar.anchor.setTo(0, 0.5);
                this.load.setPreloadSprite(this.preloadBar);

              //  console.log('loader loaded');
            }
        };

        this.TimerEvt = this.game.time.events.loop(30,this.TimerFunc, this);

        this.load.json('params', 'settings.json');

        this.load.bitmapFont('MainFont', 'fonts/font.png', 'fonts/font.fnt');

        this.load.audio('click', 'audio/click.mp3');
        this.load.audio('applause0', 'audio/applause0.mp3');
        this.load.audio('applause1', 'audio/applause1.mp3');
        this.load.audio('firework', 'audio/firework.mp3');
        this.load.audio('clock', 'audio/clock.mp3');
        this.load.audio('wrong', 'audio/wrong.mp3');
        this.load.audio('right', 'audio/right.mp3');
        this.load.audio('timeup', 'audio/timeup.mp3');

        this.load.atlas('atlas', 'images/atlas.png', 'images/atlas.json');
        this.load.atlas('ui', 'images/ui.png', 'images/ui.json');
	},

    loadComplete:  function ()  {
        this.load.onLoadComplete.remove(this.loadComplete, this);
    },

	create: function () {
	//	this.preloadBar.cropEnabled = false;
	},

    checkScreenChange: function() {
        // CALLED EVERY 1/30 sec
        this.W_temp = Math.max(window.innerWidth, document.documentElement.clientWidth);
        this.H_temp = Math.max(window.innerHeight, document.documentElement.clientHeight);

        if(this.H_temp!=Base.HeightWnd || this.W_temp!=Base.WidthWnd)
            Base.makeScreenAdjust(this.game); // it will call this correct function AdjustSize
    },

    AdjustSize: function() {
        // BASE FUNCTION

        if(this.preloadBarBack!=null)
        {
            this.preloadBarBack.x = Base.Xc;
            this.preloadBarBack.y = Base.Yc;

            this.preloadBar.x = Base.Xc;
            this.preloadBar.y = Base.Yc;
            this.preloadBar.x -= this.PreloaderWidth/2;

            this.BgImg.x = Base.Xc;
            this.BgImg.y = Base.Yc;
            this.BgImg.scale.set(Base.WidthGame/256,Base.HeightGame/256);

        }
    },

    freezeGame : function()
    {
        this.game.input.enabled = false;
        Base.FreezeFlag = true;
    },

    unfreezeGame : function()
    {
        this.game.input.enabled = true;
        Base.FreezeFlag = false;
    },

	update: function () {

        switch (this.State) {
            case 0:

                var check = true;
                for(var i=0;i< this.ImgsToLoad.length;i++) {
                    if(!this.game.cache.checkImageKey(this.ImgsToLoad[i]))
                        check = false;
                }

                if (check &&
                    this.ready == false &&
                    this.game.cache.checkImageKey('atlas') &&
                    this.game.cache.checkImageKey('ui') &&
                    this.game.cache.checkBitmapFontKey('MainFont')) {

                    //   this.scale.setUserScale(Spiky.ScaleX,Spiky.ScaleY);
                    //    this.Group0Alpha = 1;
                    //      this.Group0.setAll('alpha',this.Group0Alpha);

                    this.ready = true;
                    this.State = 1;
                    //  this.game.camera.flash(0xFFFFFF,400);
                }
                break;

            case 1:
                    this.game.time.events.remove(this.TimerEvt);
                    Base.TimeStartGame = this.game.time.now;
                     this.state.start('Game');
                break;

        }
    }
};

