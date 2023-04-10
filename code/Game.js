Base.Game = function(game) {
    this.Score = 0;

    this.dT = 0;

    this.TManager = null;
    this.Sounds = null;
    this.BgImg = null;
  //  this.FlashImg = null;
    this.CurrWnd = null;
    this.GamesCntr = 0;
    this.CurrTime = 0;
    this.LastTime = 0;
    this.DelayCalls = null;
    this.DelayCallsNum = 0;
    this.FlashAlpha = 1;

    this.W_temp = 0;
    this.H_temp = 0;
};

Base.Game.prototype = {

    init: function () {
        this.BgImg = null;
    },

    create: function() {

        this.dT =  1.0/Base.UPS;//this.game.time.physicsElapsed;

      //  this.game.camera.flash(0xFFFFFF,300);

        this.BgImg  = this.game.add.image(Base.WidthGame/2, Base.HeightGame/2, 'bg'); //
        this.BgImg.anchor.set(0.5);
        Base.BgImgWidth = this.BgImg.width;
        Base.BgImgHeight = this.BgImg.height;

     //   this.TempImg  = this.game.add.image(Base.WidthGame, Base.HeightGame/2, 'atlas','sound.png'); //
     //   this.TempImg.anchor.set(0.5);

      //  this.BgImg.tint = 0xEEEEEE;

        var scalex = (Base.WidthGame)/Base.BgImgWidth;
        var scaley = (Base.HeightGame)/Base.BgImgHeight;
        if(scalex>scaley) this.BgImg.scale.set(scalex,scalex);
        else this.BgImg.scale.set(scaley,scaley);

        this.BgGroup = this.game.add.group();
        this.BackGroup = this.game.add.group();
        this.GameGroup = this.game.add.group();
        this.GameTopGroup = this.game.add.group();
        this.TopGroup = this.game.add.group();
        this.MenuGroup = this.game.add.group();
        this.MenuTopGroup = this.game.add.group();

     //   this.FlashImg  = this.game.add.image(0, 0, 'atlas', 'white.png');
    //    this.FlashImg.anchor.set(0);
    //    this.FlashImg.scale.set((Base.WidthGame)/this.FlashImg.width,
    //        (Base.HeightGame)/this.FlashImg.height);
   //     this.FlashImg.visible = false;

       // this.WrongOrientFlag = false;
        this.Sounds = Base.Sounds;

        this.TManager = new CThreadManager(this);
        this.TManager.create();

      //  this.music = this.add.audio('music',1,true);

        this.Sounds[Base.SndButton] = this.add.audio('click');
        this.Sounds[Base.SndApplause0] = this.add.audio('applause0');
        this.Sounds[Base.SndApplause1] = this.add.audio('applause1');
        this.Sounds[Base.SndClock] = this.add.audio('clock');
        this.Sounds[Base.SndFirework] = this.add.audio('firework');
        this.Sounds[Base.SndRight] = this.add.audio('right');
        this.Sounds[Base.SndWrong] = this.add.audio('wrong');
        this.Sounds[Base.SndTimeUp] = this.add.audio('timeup');

        this.GetSavedData();

      //  Base.LangJS = this.game.cache.getJSON('language');



        if(Base.MusicFlag)
           this.MuteMusic(!Base.MusicFlag);

         this.game.onPause.add(this.OnPause, this);
         this.game.onResume .add(this.OnResume , this);

         this.game.onFocus.add(this.OnFocus , this);
         this.game.onBlur.add(this.OnBlur , this);

     //    this.game.plugins.add(PhaserInput.Plugin);

        this.DoGame();
    },

    setFlash : function(func,funcContex)
    {
        this.FlashFunc = func;
        this.FlashFuncContex = funcContex;
        this.FlashAlpha = 0;
      //  this.FlashImg.alpha = this.FlashAlpha;
      //  this.FlashImg.visible = true;
        this.FlashAlphaSpeed = 1/0.1;
      //  this.FlashImg.tint = 0x7dd8bf;
        this.TManager.addThread(this,this.updateFlash);
    },

    updateFlash : function()
    {
        this.FlashAlpha += this.FlashAlphaSpeed*Base.RealTimeInt;
        if(this.FlashAlpha>=1) {
            this.FlashAlpha = 1;
            this.FlashAlphaSpeed = -1/0.1;
            if(this.FlashFunc!==null)
                this.FlashFunc.call(this.FlashFuncContex);
        }
        if(this.FlashAlpha<=0) {
            this.FlashAlpha = 0;
            this.TManager.removeThread(this,this.updateFlash);
          //  this.FlashImg.visible = false;
        }

       // this.FlashImg.alpha = this.FlashAlpha;
    },

    OnPause : function()
    {
     //   sgSettings.commands.freezeGame();
        //  Base.FreezeFlag = true;
        //  if(Base.MusicFlag) this.MuteMusic(true);
    },

    OnResume : function()
    {
       // sgSettings.commands.unfreezeGame();

       // Base.FreezeFlag = false;
       // if(Base.MusicFlag) this.MuteMusic(false);
    },


    OnBlur : function()
    {

    },

    OnFocus : function()
    {

    },

     OnDownFirst : function(pnt)
     {
         this.MuteMusic(!Base.MusicFlag);
         this.game.input.onDown.remove(this.OnDownFirst, this);
     },
    //#################################
    freezeGame : function()
    {
        this.game.input.enabled = false;
        Base.FreezeFlag = true;
        if(Base.MusicFlag) this.MuteMusic(true);
    },

    unfreezeGame : function()
    {
        this.game.input.enabled = true;
        Base.FreezeFlag = false;
        if(Base.MusicFlag) this.MuteMusic(false);
    },


    runGame : function()
    {
     //   if(Base.MusicFlag)
        //    this.MuteMusic(!Base.MusicFlag);

        this.game.input.onDown.add(this.OnDownFirst, this);
        this.DoGame();
    },

    startOver : function()
    {
        if(this.CurrWnd!=null)
          this.CurrWnd.OnReplay();
    },

//#################################
// ###########SAVING###############
    //#################################

    GetSavedData : function()
    {

        if (this.game.device.localStorage) {
            // Shifter.HiScore = JSON.parse(this.gatSavedItem("hiScore",0));
          /*  var def = this.gatSavedItem("hiscore0", null);
            if (def != null) Base.HiScores[0] = JSON.parse(def);
            else {
                Base.HiScores[0] = 0;
                this.saveHiScore(0);
            }

            def = this.gatSavedItem("hiscore1", null);
            if (def != null) Base.HiScores[1] = JSON.parse(def);
            else {
                Base.HiScores[1] = 0;
                this.saveHiScore(1);
            }


            def = this.gatSavedItem("hiscore2", null);
            if (def != null) Base.HiScores[2] = JSON.parse(def);
            else {
                Base.HiScores[2] = 0;
                this.saveHiScore(2);
            }

            def = this.gatSavedItem("sound", null);
            if (def != null) Base.SoundFlag = JSON.parse(def);
            else {
                Base.SoundFlag = true;
                this.saveSound();
            } */
        }
    },

    gatSavedItem: function(item,def)
    {
        if(Base.NoLocalStorageFlag) return undefined;

        var val =  localStorage.getItem(item);
        if(val===null && def!=null)
        {
            localStorage.setItem(item,JSON.stringify(def));
            val = JSON.stringify(def);
        }
        return val;
    },

    saveSavedItem: function(item,def)
    {
        if(Base.NoLocalStorageFlag) return false;
        localStorage.setItem(item,JSON.stringify(def));
        return true;
    },

    /*clearGameProgress: function()
    {
        Base.HiScore = 0;

        if(Base.NoLocalStorageFlag) return;

        if (this.game.device.localStorage) {
           // localStorage.setItem("hiScore",Spiky.HiScore);
            this.saveSavedItem('hiscore',0);
        }
    }, */

     saveHiScore: function(type)
    {
        if(Base.NoLocalStorageFlag) return;
        localStorage.setItem("hiscore"+type,Base.HiScores);
    },

    saveSound : function()
    {
        if(Base.NoLocalStorageFlag) return;
        localStorage.setItem("sound",Base.SoundFlag);
    },

    //#################SOUND######################

 /*   MuteSounds: function(mute) {
        Base.MuteFlag = mute;
        for(var i=0;i<this.Sounds.length;i++)
            this.Sounds[i].mute = mute;
    }, */

    MuteMusic: function(mute) {
     //   Base.MusicFlag = !mute;
     /*   if(mute)
        {
            if(this.music.isPlaying)
                this.music.pause();
        }
        else
        {
            if(this.music.paused)
                this.music.resume();
            else {
                if(!this.music.isPlaying)
                   this.music.play('', 0, 1, true);
            }
        } */
    },

    PlaySnd: function(snd) {
        if(Base.SoundFlag)
           return this.Sounds[snd].play();
        return null
    },

    PlaySndVol: function(snd,vol) {
        if(Base.SoundFlag)
            return this.Sounds[snd].play('',0,vol);
        return null
    },

    StopSnd: function(snd) {
        this.Sounds[snd].stop();
    },

    //#####################################

    removeThread: function(thread,func) {
        this.TManager.removeThread(thread,func);
    },

    DoGame: function() { // called from NOT game
        var wnd = this.TManager.getCachedThread(CGame);
        if(wnd==null) wnd = new CGame(this);
        wnd.Create();
        this.TManager.saveThread(wnd);
        this.TManager.addThread(wnd,wnd.update);
        this.CurrWnd = wnd; // stay always
    },

    clearDelayCalls: function()
    {
        for(var i=0;i<this.DelayCallsNum;i++)
             if(this.DelayCalls[i].ActiveFlag)
                 this.DelayCalls[i].kill();
    },

    makeDelayCall: function(delay,func,funcContex,args)
    {
        if(this.DelayCalls==null) this.DelayCalls = [];

        var dcall = null;
        for(var i=0;i<this.DelayCallsNum;i++) {
            if(!this.DelayCalls[i].ActiveFlag)
            {
                dcall = this.DelayCalls[i];
                break;
            }
        }

        if(dcall==null)
        {
            for(i=0;i<this.DelayCalls.length;i++) {
                if(!this.DelayCalls[i].ActiveFlag)
                {
                    dcall = this.DelayCalls[i];
                    this.DelayCallsNum = i + 1;
                    break;
                }
            }
        }
        if(dcall==null)
        {
            dcall = new CDelayCall(this);
            this.DelayCalls[this.DelayCallsNum] = dcall;
            this.DelayCallsNum++;
        }

        //Create = function(delay,func,args,go,kill,papa
        dcall.Create(delay,func,args,true,true,funcContex,this.TManager);
        return dcall;
    },

    setImgLoad : function(id,path) {
        this.load.image(id, path); //    this.load.image('card1', 'images/cards/1.jpg');
        this.load.start();
      //  console.log(path);
    },

    getImg : function(x,y,tex,frameName,group) {
        var img = null;
        for (var i = 0; i < group.children.length; i++)
        {
            if (group.children[i].alive === false &&
                (group.children[i] instanceof Phaser.Image) &&
                (group.children[i].key===tex))
            {
                img = group.children[i];
                break;
            }
        }

        if (img == null) {
            img = this.game.make.image(x, y, tex, frameName);
            group.add(img);
        }
        else {
            img.revive();
            img.x = x;
            img.y = y;
            if(frameName!=null)
                img.frameName = frameName;
        }
        return img;
    },

    AdjustSize: function() {
           // BASE FUNCTION
        if(this.BgImg!==null) {
          //  this.BgImg.scale.set((Base.WidthGame + 40) / 617, (Base.HeightGame + 40) / 944);
            var scalex = (Base.WidthGame)/Base.BgImgWidth;
            var scaley = (Base.HeightGame)/Base.BgImgHeight;
            if(scalex>scaley) this.BgImg.scale.set(scalex,scalex);
            else this.BgImg.scale.set(scaley,scaley);
            this.BgImg.x = Base.WidthGame/2;
            this.BgImg.y = Base.HeightGame/2;

         //   this.TempImg.x = Base.WidthGame;
        //    this.TempImg.y = Base.HeightGame/2;
        }

    //    if(this.FlashImg!==null)
    //        this.FlashImg.scale.set((Base.WidthGame)/128,(Base.HeightGame)/128);

        if(this.CurrWnd!=null)
            this.CurrWnd.OnGameHeightChange();
    },


    update: function() {

        this.CurrTime = this.game.time.now;
        Base.RealTimeInt =  (this.CurrTime-this.LastTime)*0.001;//this.game.time.physicsElapsed;
        if(Base.RealTimeInt>1)  Base.RealTimeInt = this.game.time.physicsElapsed;
        if(Base.RealTimeInt>0.1) Base.RealTimeInt = 0.1;
        this.LastTime = this.CurrTime;

        if(Base.FreezeFlag)  return;

        this.W_temp = Math.max(window.innerWidth, document.documentElement.clientWidth);
        this.H_temp = Math.max(window.innerHeight, document.documentElement.clientHeight);

        if(this.H_temp!=Base.HeightWnd ||this.W_temp!=Base.WidthWnd)
            Base.makeScreenAdjust(this.game); // it will call this correct function AdjustSize

       // if(this.WrongOrientFlag) return;
        this.TManager.update();
    }
};