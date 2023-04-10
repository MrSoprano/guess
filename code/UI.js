
CBaseWnd = function (papa,threads,group,groupTop) {
    this.Papa = papa; //papa is Game
    this.Threads = threads;
    this.Group = group;
    this.GroupTop = groupTop;
    this.ActiveFlag = false;

    this.Buttons = [];
    this.Imgs = [];
    this.Texts = [];
    this.TextVecs = [];

    this.Xc = 0;
    this.Yc = 0;

    this.ImgsNum  = 0;
    this.TextsNum = 0;
    this.TextVecsNum = 0;
    this.ButtonsNum = 0;

    this.ShiftX = 0;
    this.ShiftY = 0;

    this.Shifters = [];
    this.ShiftersNum = 0;

    this.Faders = [];
    this.FadersNum = 0;

    this.Groups = [];
    this.GroupsNum = 0;

    this.Alpha = 1;
    this.Scale = 1;
    this.ScaleX = 1;
    this.ScaleY = 1;
};

CBaseWnd.prototype.clear = function() {
    this.ShiftersNum = 0;
    this.FadersNum = 0;
};

CBaseWnd.prototype.P3EasingIn = function(k)
{
    return k * k * k;
};

CBaseWnd.prototype.P3EasingOut = function(k)
{
    return --k * k * k   +  1;

};

CBaseWnd.prototype.P2EasingIn = function(k)
{
    return k * k;
};

CBaseWnd.prototype.P2EasingOut = function(k)
{
    return k * ( 2 - k );
};

CBaseWnd.prototype.initFading = function(func) {
    this.FadersNum = 0;
    this.FadersFunc = func;
    this.Threads.addThread(this,this.updateFadings);
};

CBaseWnd.prototype.addFading = function(img,dest,time,tween,delay) {
    if(this.Faders[this.FadersNum]==undefined)
        this.Faders[this.FadersNum] = {obj:null,flag:false};
    var obj = this.Faders[this.FadersNum];
    this.FadersNum++;
    obj.obj = img;
    obj.time = time;
    obj.timeCntr = 0;
    obj.alpha = img.alphaCoeff;
    obj.alpha0 = img.alphaCoeff;
    obj.alpha1  = dest;
    obj.tweenFunc = tween;
    obj.delay = delay;
    obj.flag = true;
    return obj;
};

CBaseWnd.prototype.updateFadings = function() {

    var last = -1;
    for(var i=0;i<this.FadersNum;i++) {
        var shift = this.Faders[i];
        if(shift.flag) {
            last = i;
            shift.delay-=Base.RealTimeInt;
            if(shift.delay<0) {
                shift.timeCntr+=Base.RealTimeInt;
                if(shift.timeCntr>=shift.time) {
                    shift.timeCntr = shift.time;
                    shift.flag = false;
                }
                var coeff = shift.timeCntr/shift.time;
                coeff = shift.tweenFunc(coeff);
                shift.alpha = shift.alpha0  + (shift.alpha1-shift.alpha0)*coeff;
                if(shift.obj.obj!==null) {
                    shift.obj.alphaCoeff = shift.alpha;
                    shift.obj.obj.alpha = shift.obj.alphaCoeff;
                }
            }
        }
    }
    if(last<0) {
        this.Threads.removeThread(this,this.updateFadings);
        if(this.FadersFunc!=null) this.FadersFunc.call(this);
    }
};

CBaseWnd.prototype.initShifting = function(func) {
    this.ShiftersNum = 0;
    this.ShiftersFunc = func;
    this.Threads.addThread(this,this.updateShiftings)
};

CBaseWnd.prototype.addShifter = function(img,sx,sy,time,tween,delay) {
    if(this.Shifters[this.ShiftersNum]==undefined)
        this.Shifters[this.ShiftersNum] = {obj:null,flag:false};
    var obj = this.Shifters[this.ShiftersNum];
    this.ShiftersNum++;
    obj.obj = img;
    obj.time = time;
    obj.timeCntr = 0;
    obj.sx0 = img.sx;
    obj.sy0 = img.sy;
    obj.sx1  = sx;
    obj.sy1  = sy;
    obj.tweenFunc = tween;
    obj.delay = delay;
    obj.flag = true;
    return obj;
};

CBaseWnd.prototype.updateShiftings = function() {

    var last = -1;
    for(var i=0;i<this.ShiftersNum;i++) {
        var shift = this.Shifters[i];
        if(shift.flag) {
            last = i;
            shift.delay-=Base.RealTimeInt;
            if(shift.delay<0) {
                shift.timeCntr+=Base.RealTimeInt;
                if(shift.timeCntr>=shift.time) {
                    shift.timeCntr = shift.time;
                    shift.flag = false;
                }
                var coeff = shift.timeCntr/shift.time;
                coeff = shift.tweenFunc(coeff);
                if(shift.obj.obj!==null) {
                    shift.obj.sx = shift.sx0  + (shift.sx1 - shift.sx0)*coeff;
                    shift.obj.sy = shift.sy0  + (shift.sy1 - shift.sy0)*coeff;

                    shift.obj.obj.x = this.Xc + shift.obj.x + this.ShiftX + shift.obj.sx;
                    shift.obj.obj.y = this.Yc + shift.obj.y + this.ShiftY + shift.obj.sy;
                }
            }
        }
    }
    if(last<0) {
        this.Threads.removeThread(this,this.updateShiftings);
        if(this.ShiftersFunc!=null) this.ShiftersFunc.call(this);
    }
};

CBaseWnd.prototype.OnResize = function() {

};

CBaseWnd.prototype.setAlpha = function(obj,alpha) {
    obj.alphaCoeff = alpha;
    obj.obj.alpha = this.Alpha*obj.alphaCoeff;
};

CBaseWnd.prototype.setButtonsAlpha = function(alpha) {
    for(var i=0;i<this.ButtonsNum;i++) {
        if(this.Buttons[i].obj!=null)
        {
            this.Buttons[i].alphaCoeff = alpha;
            this.Buttons[i].obj.alpha = this.Alpha*this.Buttons[i].alphaCoeff;
        }
    }
};

CBaseWnd.prototype.setTextsAlpha = function(alpha) {
    for(var i=0;i<this.TextsNum;i++) {
        if(this.Texts[i].obj!=null)
        {
            this.Texts[i].alphaCoeff = alpha;
            this.Texts[i].obj.alpha = this.Alpha*this.Texts[i].alphaCoeff;
        }
    }
};

CBaseWnd.prototype.setTextVecsAlpha = function(alpha) {
    for(var i=0;i<this.TextVecsNum;i++) {
        if(this.TextVecs[i].obj!=null)
        {
            this.TextVecs[i].alphaCoeff = alpha;
            this.TextVecs[i].obj.alpha = this.Alpha*this.TextVecs[i].alphaCoeff;
        }
    }
};

CBaseWnd.prototype.setImgsAlpha = function(alpha) {
    for(var i=0;i<this.ImgsNum;i++) {
        if(this.Imgs[i].obj!=null)
        {
            this.Imgs[i].alphaCoeff = alpha;
            this.Imgs[i].obj.alpha = this.Alpha*this.Imgs[i].alphaCoeff;
        }
    }
};

CBaseWnd.prototype.setGroupsAlpha = function(alpha) {
    for(var i=0;i<this.GroupsNum;i++) {
        if(this.Groups[i].obj!=null)
        {
            this.Groups[i].alphaCoeff = alpha;
            this.Groups[i].obj.alpha = this.Alpha*this.Groups[i].alphaCoeff;
        }
    }
};

CBaseWnd.prototype.killObjs = function() {
  //   = function(obj) {
    for(var i=0;i<this.ImgsNum;i++) {
        if(this.Imgs[i].obj!=null)
        {
            this.killObj(this.Imgs[i].obj);
        }
    }
    this.ImgsNum = 0;

    for(i=0;i<this.ButtonsNum;i++) {
        if(this.Buttons[i].obj!=null)
        {
            this.killObj(this.Buttons[i].obj);
        }
    }
    this.ButtonsNum = 0;

    for(i=0;i<this.TextsNum;i++) {
        if(this.Texts[i].obj!=null)
        {
            this.killObj(this.Texts[i].obj);
        }
    }
    this.TextsNum = 0;
};


CBaseWnd.prototype.makeElementsVisible = function(vis) {
    for(var i=0;i<this.ImgsNum;i++) {
        if(this.Imgs[i].obj!=null)
        {
            this.Imgs[i].obj.visible = vis;
        }
    }
    for(i=0;i<this.ButtonsNum;i++) {
        if(this.Buttons[i].obj!=null)
        {
            this.Buttons[i].obj.visible = vis;
        }
    }
    for(i=0;i<this.TextsNum;i++) {
        if(this.Texts[i].obj!=null)
        {
            this.Texts[i].obj.visible = vis;
        }
    }
    for(i=0;i<this.TextVecsNum;i++) {
        if(this.TextVecs[i].obj!=null)
        {
            this.TextVecs[i].obj.visible = vis;
        }
    }
    for(i=0;i<this.GroupsNum;i++) {
        if(this.Groups[i].obj!=null)
        {
            this.Groups[i].obj.visible = vis;
        }
    }
};

CBaseWnd.prototype.setObjShift = function(obj,sx,sy) {
    obj.sx = sx;
    obj.sy = sy;
};

CBaseWnd.prototype.setObjXY = function(obj,x,y) {
    obj.x = x;
    obj.y = y;
    this.updateObj(obj);
};

CBaseWnd.prototype.killObj = function(obj) {
    if(obj==null)  return;
    if(obj.obj==null)  return;
    obj.obj.kill();
    obj.obj = null;
};

CBaseWnd.prototype.updateObj = function(obj) {
    obj.obj.x = this.Xc + this.ScaleX*(obj.x + this.ShiftX + obj.sx) ;
    obj.obj.y = this.Yc +  this.ScaleY*(obj.y + this.ShiftY + obj.sy) ;
    obj.obj.alpha = this.Alpha*obj.alphaCoeff;
    obj.obj.scale.set(this.Scale*obj.scaleCoeff);
};

CBaseWnd.prototype.updateImg = function(img) {
    img.obj.x = this.Xc + this.ScaleX*(img.x + this.ShiftX + img.sx);
    img.obj.y = this.Yc +  this.ScaleY*(img.y + this.ShiftY + img.sy);
    img.obj.alpha = this.Alpha*img.alphaCoeff;
    img.obj.scale.set(this.Scale*img.scaleCoeffX,this.Scale*img.scaleCoeffY);
};

CBaseWnd.prototype.updateButton = function(butt) {
    butt.obj.x = this.Xc +  this.ScaleX*(butt.x + this.ShiftX + butt.sx) ;
    butt.obj.y = this.Yc +  this.ScaleY*(butt.y + this.ShiftY + butt.sy) ;
    butt.obj.alpha = this.Alpha*butt.alphaCoeff;
    butt.obj.scale.set(this.Scale*butt.scaleCoeff);
};

CBaseWnd.prototype.updateText = function(text) {
    text.obj.x = this.Xc +  this.ScaleX*(text.x + this.ShiftX + text.sx) ;
    text.obj.y = this.Yc +  this.ScaleY*(text.y + this.ShiftY + text.sy) ;
    text.obj.alpha = this.Alpha*text.alphaCoeff;
    text.obj.scale.set(this.Scale*text.scaleCoeff);
};

CBaseWnd.prototype.updateTextVec = function(text) {
    text.obj.x = this.Xc +  this.ScaleX*(text.x + this.ShiftX + text.sx) ;
    text.obj.y = this.Yc +  this.ScaleY*(text.y + this.ShiftY + text.sy) ;
    text.obj.alpha = this.Alpha*text.alphaCoeff;
    text.obj.scale.set(this.Scale*text.scaleCoeff);
};

CBaseWnd.prototype.updateGroup = function(group) {
    group.obj.x = this.Xc +  this.ScaleX*(group.x + this.ShiftX + group.sx) ;
    group.obj.y = this.Yc +  this.ScaleY*(group.y + this.ShiftY + group.sy) ;
    group.obj.alpha = this.Alpha*group.alphaCoeff;
    group.obj.scale.set(this.Scale*group.scaleCoeffX,this.Scale*group.scaleCoeffY);
};

CBaseWnd.prototype.updateElements = function() {

    for(var i=0;i<this.ImgsNum;i++) {
        if(this.Imgs[i].obj!=null)
        {
            this.updateImg(this.Imgs[i]);
        }
    }
    for(i=0;i<this.ButtonsNum;i++) {
        if(this.Buttons[i].obj!=null)
        {
            this.updateButton(this.Buttons[i]);
        }
    }
    for(i=0;i<this.TextsNum;i++) {
        if(this.Texts[i].obj!=null)
        {
            this.updateText(this.Texts[i]);
        }
    }
    for(i=0;i<this.TextVecsNum;i++) {
        if(this.TextVecs[i].obj!=null)
        {
            this.updateTextVec(this.TextVecs[i]);
        }
    }
    for(i=0;i<this.GroupsNum;i++) {
        if(this.Groups[i].obj!=null)
        {
            this.updateGroup(this.Groups[i]);
        }
    }
};

CBaseWnd.prototype.addGroup = function(x,y,group,order)
{
    if(this.Groups[this.GroupsNum]==undefined)
        this.Groups[this.GroupsNum] = {x:0,y:0,obj:null};
    var obj = this.Groups[this.GroupsNum];
    this.GroupsNum++;

    //x,y,tex,frameName,group,order
    obj.obj = this.Papa.game.add.group();
    group.add(obj.obj);
    obj.x = x ;
    obj.y = y ;
    obj.sx = 0 ;
    obj.sy = 0 ;
    obj.scaleCoeff = 1;
    obj.scaleCoeffX = 1;
    obj.scaleCoeffY = 1;
    obj.scalingFlag = false;
    obj.alphaCoeff = 1;
   // obj.obj.anchor.set(0.5);
    obj.obj.Order = order;
    return obj;
};

CBaseWnd.prototype.addImg = function(x,y,tex,frameName,group,order)
{
    if(this.Imgs[this.ImgsNum]==undefined)
        this.Imgs[this.ImgsNum] = {x:0,y:0,obj:null};
    var obj = this.Imgs[this.ImgsNum];
    this.ImgsNum++;

    //x,y,tex,frameName,group,order
    obj.obj = this.Papa.getZeroImg(this.Xc+x+ this.ShiftX,this.Yc+y+ this.ShiftY,
        tex,frameName,group,order);
    obj.x = x ;
    obj.y = y ;
    obj.sx = 0;
    obj.sy = 0;
    obj.scaleCoeff = 1;
    obj.scaleCoeffX = 1;
    obj.scaleCoeffY = 1;
    obj.scalingFlag = false;
    obj.alphaCoeff = 1;
    obj.obj.anchor.set(0.5);
    obj.obj.Order = order;
    return obj;
};

CBaseWnd.prototype.addBitmapText = function(x,y,font,str,size,group,order)
{
    if(this.Texts[this.TextsNum]==undefined)
        this.Texts[this.TextsNum] = {x:0,y:0,obj:null};
    var obj = this.Texts[this.TextsNum];
    this.TextsNum++;

    //x,y,font,str,size,group
    obj.obj = this.Papa.getBitmapText(this.Xc+x+this.ShiftX,this.Yc+y+this.ShiftY,
        font,str,size,group);
    obj.x = x ;
    obj.y = y ;
    obj.sx = 0 ;
    obj.sy = 0 ;
    obj.scaleCoeff = 1;
    obj.alphaCoeff = 1;
    obj.obj.Order = order;
    return obj;
};

CBaseWnd.prototype.addText = function(x,y,text,group,order)
{
    if(this.TextVecs[this.TextVecsNum]==undefined)
        this.TextVecs[this.TextVecsNum] = {x:0,y:0,obj:null};
    var obj = this.TextVecs[this.TextVecsNum];
    this.TextVecsNum++;
    group.add(text);
    //x,y,font,str,size,group
    obj.obj =  text;
    obj.x = x ;
    obj.y = y ;
    obj.sx = 0 ;
    obj.sy = 0 ;
    obj.scaleCoeff = 1;
    obj.alphaCoeff = 1;
    obj.obj.Order = order;
    return obj;
};

CBaseWnd.prototype.addButton = function(x,y,tex,frames,callback,callbackContext,group,order)
{
    if(this.Buttons[this.ButtonsNum]==undefined)
        this.Buttons[this.ButtonsNum] = {x:0,y:0,obj:null};
    var obj = this.Buttons[this.ButtonsNum];
    this.ButtonsNum++;

    /*  obj.butt = this.Papa.game.make.button(0, 0, tex,callback,callbackContext,
     frames[0],frames[1],frames[2],frames[3]);
     obj.x = x;
     obj.y = y;
     obj.butt.Order = order;
     this.Group.add(obj.butt);*/

    //x,y,tex,frames,callback,callbackContext,group
    obj.obj = this.Papa.getButton(this.Xc+x+ this.ShiftX,this.Yc+y+ this.ShiftY,
        tex,frames,callback,callbackContext,group);
    obj.obj.anchor.set(0.5);
    obj.x = x ;
    obj.y = y ;
    obj.sx = 0 ;
    obj.sy = 0 ;
    obj.scaleCoeff = 1;
    obj.alphaCoeff = 1;
    obj.obj.Order = order;
    return obj;
};

//###################################################################################
//###################################################################################
//###################################################################################
//###################################################################################

CWndMenu = function (papa,threads,group,groupTop) {

    CBaseWnd.call(this,papa,threads,group,groupTop);

    this.ButtFrames = ['buttmenu.png','buttmenu.png','buttmenu.png','buttmenu.png'];
};

CWndMenu.prototype = Object.create(CBaseWnd.prototype);
CWndMenu.prototype.constructor = CWndMenu;

CWndMenu.prototype.init = function() {

    this.ButtText0 =  this.addBitmapText(0,0,'CaliFont','Compare coins',35,this.Group,2);
    this.ButtText1 =  this.addBitmapText(0,0,'CaliFont','Count values',35,this.Group,2);
    this.ButtText2 =  this.addBitmapText(0,0,'CaliFont','Make change',35,this.Group,2);

    this.ActiveFlag = false;
};

CWndMenu.prototype.create = function() {

    this.clear();
    //  CPanel.prototype.create.call(Base.Xc,Base.Yc - Base.HeightGame/2);
    this.Xc = Base.Width/2;//Base.Xc;
    this.Yc = Base.HeightGame/2;
    this.EndCall = null;

    this.Type = 0;
   // this.HaltButtonsFlag = false;

    this.BgImg = this.addImg(0,0,'atlas2','coinsbg.png',this.Group,0);
    this.BgImg.obj.anchor.set(0.5);

    this.Y_butt = 25;
    this.ButtStep = 80;

    this.ButtGame0 =  this.addButton(0,this.Y_butt,'atlas',
        this.ButtFrames,this.OnButtGame0,this,this.Group,1);
    this.ButtGame1 =  this.addButton(0,this.Y_butt+this.ButtStep,'atlas',
        this.ButtFrames,this.OnButtGame1,this,this.Group,1);
    this.ButtGame2 =  this.addButton(0,this.Y_butt+2*this.ButtStep,'atlas',
        this.ButtFrames,this.OnButtGame2,this,this.Group,1);

     this.ButtGame0.obj.tint = 0xFFFFFF;
     this.ButtGame1.obj.tint = 0xFFFFFF;
     this.ButtGame2.obj.tint = 0xFFFFFF;

   // this.ButtText0.obj.visible = true;
   // this.ButtText1.obj.visible = true;
   // this.ButtText2.obj.visible = true;

    this.setObjXY(this.ButtText0,0,this.Y_butt+5);
    this.setObjXY(this.ButtText1,0,this.Y_butt+this.ButtStep+5);
    this.setObjXY(this.ButtText2,0,this.Y_butt+2*this.ButtStep+5);

    this.makeElementsVisible(true);

    this.ClickAllowFlag = true;
    this.State = 0;
    this.ActiveFlag = true;

    this.Group.sort('Order',-1);

    this.BlockButtons(false);

//    this.ButtGame1.obj.input.enabled = false; // TEMP
  //  this.ButtGame2.obj.input.enabled = false; // TEMP

    this.OnResize();
};

CWndMenu.prototype.OnButtGame0 = function() {
    this.BlockButtons(true);
    this.ButtGame0.obj.tint = 0xAAAAAA;
    Base.Level = 0;
    this.Papa.setFlash(this.setGame,this);
    this.Papa.PlaySnd(Base.SndButton);
};

CWndMenu.prototype.OnButtGame1 = function() {
    this.BlockButtons(true);
    this.ButtGame1.obj.tint = 0xAAAAAA;
    Base.Level = 1;
    this.Papa.setFlash(this.setGame,this);
    this.Papa.PlaySnd(Base.SndButton);
};

CWndMenu.prototype.OnButtGame2 = function() {


    this.BlockButtons(true);
    this.ButtGame2.obj.tint = 0xAAAAAA;
    Base.Level = 2;
    this.Papa.setFlash(this.setGame,this);
    this.Papa.PlaySnd(Base.SndButton);
};

CWndMenu.prototype.setGame = function() {
    this.OnEnd();
    this.Papa.setGame();
};

CWndMenu.prototype.OnReady = function() {
    this.BlockButtons(false);
};

CWndMenu.prototype.BlockButtons = function(block) {
    this.ButtGame0.obj.input.enabled = !block;
    this.ButtGame1.obj.input.enabled = !block;
    this.ButtGame2.obj.input.enabled = !block;
};

CWndMenu.prototype.setFadeOut = function() {

};

CWndMenu.prototype.OnEnd = function() {
    this.makeElementsVisible(false);
 //   this.Papa.PauseOff();

    this.killObj(this.BgImg);
    this.killObj(this.ButtGame0);
    this.killObj(this.ButtGame1);
    this.killObj(this.ButtGame2);

    this.ActiveFlag = false;
    if(this.EndCall!=null) this.EndCall.call(this);
};

CWndMenu.prototype.OnResize = function() {
    if(!this.ActiveFlag)  return;

    this.Yc = Base.HeightGame/2;

    this.updateElements();

    /*
    this.CoinTopPanel.y = -Base.HeightGame/2 + 52;
    this.CoinsTopText.y = -Base.HeightGame/2 + 52 + 11;
    this.ButtClose.y = -Base.HeightGame/2 + 52;


    this.BgImg.obj.scale.set(1,Base.HeightGame/960); */
};

//###################################################################################
//###################################################################################
//###################################################################################
//###################################################################################

//#####################################################################
//#####################################################################
//#####################################################################


//#######################################

CWndPlay = function (papa,threads,group) {

    CBaseWnd.call(this,papa,threads,group,null);

    this.ActiveFlag = false;
};

CWndPlay.prototype = Object.create(CBaseWnd.prototype);
CWndPlay.prototype.constructor = CWndPlay;

CWndPlay.prototype.init = function() {


    this.ActiveFlag = false;
};

CWndPlay.prototype.create = function(func,funcContex) {

    this.clear();

    this.Xc = Base.WidthGame/2;//Base.Xc;
    this.Yc = Base.HeightGame/2;
    this.EndCall = null;
    this.BgAlpha = 1;

    this.FuncPlay = func;
    this.FuncPlayContex = funcContex;

    this.BgAlpha0 = 0.7;

    this.WndImg = this.Papa.getImg(0,0,'bg',null,this.Group,0);
    this.WndImg.anchor.set(0.5);
    this.WndImg.tint = 0x222299;
    this.WndImg.alpha = this.BgAlpha0;

    this.ButtClose = this.addButton(0,0,'ui',
        ['play.png','play.png','play.png','play.png'],this.OnClose,this,this.Group,1);
    this.ButtClose.obj.anchor.set(0.5);
    this.ButtClose.obj.tint = 0xFFFFFF;
    this.ButtClose.obj.scale.set(1);

    this.ScaleSpeed = -0.3;
    this.ScaleButt = 1;

    this.makeElementsVisible(true);

    this.State = 0;
    this.ActiveFlag = true;

    this.Group.sort('Order',-1);
    this.OnReady();

    this.Threads.addThread(this,this.updateScaling);

    this.ActiveFlag = true;
    this.OnResize();
};

CWndPlay.prototype.updateScaling = function() {

    this.ButtClose.scaleCoeff = this.ScaleButt;
    this.ButtClose.obj.scale.set(this.ScaleButt);

    this.ScaleButt += this.ScaleSpeed*Base.RealTimeInt;
    if(this.ScaleButt>1)
        this.ScaleSpeed = -Math.abs(this.ScaleSpeed);

    if(this.ScaleButt<0.8)
        this.ScaleSpeed = Math.abs(this.ScaleSpeed);
};

CWndPlay.prototype.OnClose = function() {
    // this.Papa.OnNoChoice();
    this.ButtClose.obj.tint = 0xDDDDDD;
    this.setFadeOut();
    this.EndCall = null;//this.DoReplay;

    if(this.FuncPlay!=null)
        this.FuncPlay.call(this.FuncPlayContex);
      this.Papa.PlaySnd(Base.SndButton);
};

CWndPlay.prototype.OnReady = function() {
    this.BlockButtons(false);
};

CWndPlay.prototype.BlockButtons = function(block) {

    this.ButtClose.obj.input.enabled = !block;
    // this.ButtContVid.obj.input.enabled = !block;
};

CWndPlay.prototype.setKilled = function() {
    this.KilledFlag = true;
    this.KillAll();
    this.ActiveFlag = false;
};

CWndPlay.prototype.setFadeOut = function() {
    this.BlockButtons(true);

    var tween = this.Papa.Tweens.addTween(null,this.updateBgAlpha,this);
    tween.createEasingOut(this);
    tween.to({BgAlpha:0}, 0.75,true,this.OnEnd,this);
    tween.start();

    // this.Papa.PlaySnd(Base.SndWindow);
};


CWndPlay.prototype.updateBgAlpha = function() {
    if(this.WndImg.obj==null)  return;
    // this.BgImg.alpha = this.BgAlpha* this.BgAlphaCoeff;
    this.WndImg.alpha = this.BgAlpha*this.BgAlpha0;

    this.ButtClose.alphaCoeff = this.BgAlpha;
    this.ButtClose.obj.alpha = this.BgAlpha;
};

CWndPlay.prototype.OnEnd = function() {

    if( this.KilledFlag)  return;

    this.makeElementsVisible(false);

    this.Threads.removeThread(this,this.updateScaling);
    // this.Papa.PauseOff();

    // this.BgImg.kill();
    this.KillAll();

    this.ActiveFlag = false;
    // if(this.FuncEnd!=null) this.FuncEnd.call(this.FuncEndContex);
};

CWndPlay.prototype.KillAll = function() {
    this.WndImg.kill();
    this.killObj(this.ButtClose);
};

CWndPlay.prototype.OnResize = function() {
    if(!this.ActiveFlag)  return;

    this.Xc = Base.WidthGame/2;
    this.Yc = Base.HeightGame/2;

    var scalex = (Base.WidthGame)/256;
    var scaley = (Base.HeightGame)/256;
    if(scalex>scaley) this.WndImg.scale.set(scalex,scalex);
    else this.WndImg.scale.set(scaley,scaley);
    this.WndImg.x = Base.WidthGame/2;
    this.WndImg.y = Base.HeightGame/2;

    this.updateElements();
    //  this.BgImg.obj.scale.set(1,Base.HeightGame/960);
};


//##################################################################
//##################################################################
//##################################################################

CWndDone = function (papa,threads,group,groupTop) {

    CBaseWnd.call(this,papa,threads,group,groupTop);

    this.ActiveFlag = false;
    this.ButtFrames = ['buttclose.png','buttclose.png','buttclose.png','buttclose.png'];
    this.RayScaler = new CTweener(this.Threads);
    this.RayFader = new CTweener(this.Threads);
    this.ScorePulser = new CPulser(this.Threads);
};

CWndDone.prototype = Object.create(CBaseWnd.prototype);
CWndDone.prototype.constructor = CWndDone;

CWndDone.prototype.init = function() {


    this.ActiveFlag = false;
};

CWndDone.prototype.create = function(answers,score,win) {

    this.clear();

    this.WaitFlag = false;
    this.ScoreAddFlag = false;

    this.Xc = Base.WidthGame/2;//Base.Xc;
    this.Yc = Base.HeightGame/2;
    this.EndCall = null;
    this.BgAlpha = 0;
    this.RaysFlag = false;

    this.WinFlag = win;

    this.Params = Base.Params.donewnd;
    this.RaysValidFlag = false;//Base.getBooleanParam(this.Params.rays.valid,false);

    //getZeroImg = function(x,y,tex,frameName,group,order)
    this.BgImg = this.Papa.getZeroImg(this.Xc,this.Yc,'bg',null,this.Group,0);
    //this.addImg(0,0,'atlas','white.png',this.Group,0);
    this.BgImg.anchor.set(0.5);
    this.BgImg.tint = 0x444444;
    this.BgAlphaCoeff =  0.3;
    this.BgImg.alpha = 0;
    this.BgImg.scale.set(1,1);//(Base.WidthWnd+50)/128,(Base.HeightWnd+50)/128);

    /* if(this.RaysValidFlag ) {
     this.RaysAngle = 0;
     this.RaysAngleSpeed = Math.PI/4;
     this.RaysImg = this.addImg(0,0,'ui','rays.png',this.Group,1);
     this.RaysImg.obj.anchor.set(0.5);
     //   this.RaysImg.obj.rotation = this.RaysAngle;
     this.RaysImg.obj.tint =  Base.getIntParam(this.Params.rays.color,0xffffff);
     this.RaysImg.alphaCoeff = 0;
     this.RaysScaleMax =  Base.getFloatParam(this.Params.rays.scale,1);
     this.RaysFlag = true;
     }*/

    this.WndImg = this.addImg(0,0,'ui',Base.getStrParam(this.Params.wnd.img,"wnd.png"),this.Group,2);
    this.WndImg.obj.anchor.set(0.5);
    this.WndImg.obj.tint = Base.getIntParam(this.Params.wnd.color,0xFFFFFF);

    //  CPanel.prototype.create.call(Base.Xc,Base.Yc - Base.HeightGame/2);
    this.WndImg.alphaCoeff = this.BgAlpha;
    this.WndImg.obj.alpha = this.BgAlpha;
    var tween = this.Papa.Tweens.addTween(null,this.updateBgAlpha,this);
    tween.createEasingOut(this);
    tween.to({BgAlpha:1}, 0.5,true,null,this);
    tween.start();


    this.Score = score;
    /* if(win && this.Score>1000) {
     this.Score = 0;
     this.ScoreDest = score;
     this.ScoreAdd = this.ScoreDest/20;
     this.ScoreAddRateCntr = 0;
     this.Threads.addThread(this,this.updateScoreCount);
     this.ScoreAddFlag = true;
     }*/

    this.Y_close = Base.getIntParam(this.Params.button.y,300);
    var color = Base.getIntParam(this.Params.button.color,0xFFFFFF);
    this.ButtReplay = this.addButton(0,this.Y_close,'ui',this.ButtFrames,this.OnReplay,this,this.Group,3);
    this.ButtReplay.obj.tint = color;

    //  this.ButtReplayText = this.addBitmapText(0,this.Y_close,'MainFont','Close',90,this.Group,4);
    //   this.ButtReplayText.obj.tint = colorButtText;

    var strDone = Base.getStrParam(this.Params.top.done,'Level done !');
    var strFail = Base.getStrParam(this.Params.top.fail,'Level failed');
    var y =  Base.getIntParam(this.Params.top.y,-100);
    var size = Base.getIntParam(this.Params.top.size,-100);
    color = Base.getIntParam(this.Params.top.color,0x000000);

    if(win) this.TextLevel = this.addBitmapText(0,y,'MainFont',strDone,size,this.Group,3);
    else  this.TextLevel = this.addBitmapText(0,y,'MainFont',strFail,size,this.Group,3);
    this.TextLevel.obj.tint = color;

    var text = Base.getStrParam(this.Params.answers.text,'Answers');
    y =  Base.getIntParam(this.Params.answers.y,-100);
    var dy = Base.getIntParam(this.Params.answers.dy,100);
    var color0 = Base.getIntParam(this.Params.answers.color0,0x000000);
    var color1 = Base.getIntParam(this.Params.answers.color1,0x000000);
    var size0 = Base.getIntParam(this.Params.answers.size0,50);
    var size1 = Base.getIntParam(this.Params.answers.size1,85);

    this.TextAnwsers = this.addBitmapText(0,y,'MainFont',text,size0,this.Group,3);
    this.TextAnwsers.obj.tint = color0;

    this.TextAnwsersNum = this.addBitmapText(0,y+dy,'MainFont',answers,size1,this.Group,3);
    this.TextAnwsersNum.obj.tint = color1;

    text = Base.getStrParam(this.Params.score.text,'Score');
    y =  Base.getIntParam(this.Params.score.y,-100);
    dy = Base.getIntParam(this.Params.score.dy,100);
    color0 = Base.getIntParam(this.Params.score.color0,0x000000);
    color1 = Base.getIntParam(this.Params.score.color1,0x000000);
    size0 = Base.getIntParam(this.Params.score.size0,50);
    size1 = Base.getIntParam(this.Params.score.size1,85);

    this.TextScore = this.addBitmapText(0,y,'MainFont',text,size0,this.Group,3);
    this.TextScore.obj.tint = color0;

    this.TextScoreNum = this.addBitmapText(0,y+dy,'MainFont',score+'',size1,this.Group,3);
    this.TextScoreNum.obj.tint = color1;

    // setPulsing = function(val0,val1,coeff,time,dir,tween,update,updateContex)
    // this.ScorePulser.setPulsing(0.9,1,0,0.7,1,'p2inout',this.updateScorePulse,this);
    // this.ScorePulser.setDelay(0.75,null,null);

    this.makeElementsVisible(true);

    this.setTextsAlpha(0);
    this.setButtonsAlpha(0);
    this.setImgsAlpha(0);

    this.initFading(null);
    this.initShifting(null);

    this.setObjShift(this.TextLevel,-700,0);
    this.addFading(this.TextLevel,1,0.4,this.P3EasingIn,0);
    this.addShifter(this.TextLevel,0,0,0.5,this.P3EasingOut,0);

    this.setObjShift(this.TextAnwsers,700,0);
    this.addFading(this.TextAnwsers,1,0.4,this.P3EasingIn,0);
    this.addShifter(this.TextAnwsers,0,0,0.5,this.P3EasingOut,0);

    this.setObjShift(this.TextAnwsersNum,-700,0);
    this.addFading(this.TextAnwsersNum,1,0.4,this.P3EasingIn,0);
    this.addShifter(this.TextAnwsersNum,0,0,0.5,this.P3EasingOut,0);

    this.setObjShift(this.TextScore,700,0);
    this.addFading(this.TextScore,1,0.4,this.P3EasingIn,0);
    this.addShifter(this.TextScore,0,0,0.5,this.P3EasingOut,0);

    this.setObjShift(this.TextScoreNum,-700,0);
    this.addFading(this.TextScoreNum,1,0.4,this.P3EasingIn,0);
    this.addShifter(this.TextScoreNum,0,0,0.5,this.P3EasingOut,0);

    this.setObjShift(this.ButtReplay,700,0);
    this.addFading(this.ButtReplay,1,0.4,this.P3EasingIn,0);
    this.addShifter(this.ButtReplay,0,0,0.5,this.P3EasingOut,0);

    //  this.setObjShift(this.ButtReplayText,700,0);
//    this.addFading(this.ButtReplayText,1,0.4,this.P3EasingIn,0);
    //   this.addShifter(this.ButtReplayText,0,0,0.5,this.P3EasingOut,0);

    this.State = 0;
    this.ActiveFlag = true;

    this.BlockButtons(true);
    this.DelayCntr = 1.5;
    this.Threads.addThread(this,this.updateDelay);
    this.Threads.addThread(this,this.update);

    this.Stage = 0;
    this.setWait(1,this.OnStage,this);

    this.Group.sort('Order',-1);

    this.OnResize();
};

CWndDone.prototype.updateScorePulse = function(scale) {
    this.TextScoreNum.scaleCoeffX = scale;
    this.TextScoreNum.scaleCoeffY = scale;
    this.TextScoreNum.obj.scale.set(this.Scale*scale,this.Scale*scale);
};

CWndDone.prototype.updateScoreCount = function() {

    this.ScoreAddRateCntr-=Base.RealTimeInt;
    if(this.ScoreAddRateCntr<0) {
        this.ScoreAddRateCntr+=0.1;

        this.Score+= this.ScoreAdd;
        if(this.Score>this.ScoreDest) {
            this.Score = this.ScoreDest;
            this.Threads.removeThread(this,this.updateScoreCount);
            this.ScoreAddFlag = false;
        }

        //  this.TextScoreNum.obj.text = ''+this.Score;
    }
};

CWndDone.prototype.setRaysScale = function(scale) {

    this.RaysImg.scaleCoeffX = scale;
    this.RaysImg.scaleCoeffY = scale;
    this.RaysImg.obj.scale.set(this.Scale*scale,this.Scale*scale);
};

CWndDone.prototype.setRaysFade = function(alpha) {

    this.RaysImg.alphaCoeff = alpha;
    this.RaysImg.obj.alpha = this.Alpha*alpha;
};

CWndDone.prototype.updateDelay = function() {
    this.DelayCntr -= Base.RealTimeInt;
    if(this.DelayCntr<0) {
        this.Threads.removeThread(this,this.updateDelay);
        this.OnReady();
        //   this.Papa.PlaySnd(Base.SndEnd);
    }
};

CWndDone.prototype.OnReplay = function() {
    // this.Papa.OnNoChoice();
    //  this.ButtReplay.obj.tint = 0xAAAAAA;
    this.FinishStage = 0;
    this.BlockButtons(true);
    this.Papa.PlaySnd(Base.SndButton);

    this.OnFinishStage();
};

CWndDone.prototype.OnFinishStage = function() {
    //  if(this.FinishStage==0) {
    this.setFadeOut();
    this.EndCall = this.DoReplay;
    //   }
};

CWndDone.prototype.DoReplay = function() {
    this.Papa.OnDoneClose();
};

CWndDone.prototype.OnReady = function() {
    this.BlockButtons(false);

};

CWndDone.prototype.BlockButtons = function(block) {

    this.ButtReplay.obj.input.enabled = !block;
};

CWndDone.prototype.setFadeOut = function() {
    this.BlockButtons(true);

    this.initFading(null);
    this.initShifting(null);

    //TextTop  TextAnswers  TextAnswersNum  TextScore  TextScoreNum

    this.addFading(this.TextLevel,0,0.4,this.P2EasingOut,0);
    this.addShifter(this.TextLevel,-800,0,0.5,this.P3EasingOut,0);

    this.addFading(this.TextAnwsers,0,0.4,this.P2EasingOut,0);
    this.addShifter(this.TextAnwsers,800,0,0.5,this.P3EasingOut,0);

    this.addFading(this.TextAnwsersNum,0,0.4,this.P2EasingOut,0);
    this.addShifter(this.TextAnwsersNum,-800,0,0.5,this.P3EasingOut,0);

    this.addFading(this.TextScore,0,0.4,this.P2EasingOut,0);
    this.addShifter(this.TextScore,800,0,0.5,this.P3EasingOut,0);

    this.addFading(this.TextScoreNum,0,0.4,this.P2EasingOut,0);
    this.addShifter(this.TextScoreNum,-800,0,0.5,this.P3EasingOut,0);

    this.addFading(this.ButtReplay,0,0.4,this.P2EasingOut,0);
    this.addShifter(this.ButtReplay,800,0,0.5,this.P3EasingOut,0);

    //  this.addFading(this.ButtReplayText,0,0.4,this.P2EasingOut,0);
    //  this.addShifter(this.ButtReplayText,800,0,0.5,this.P3EasingOut,0);

    var tween = this.Papa.Tweens.addTween(null,this.updateBgAlpha,this);
    tween.createEasingOut(this);
    tween.to({BgAlpha:0}, 0.6,true,this.OnEnd,this);
    tween.start();

    // this.Papa.PlaySnd(Base.SndWindow);
};

CWndDone.prototype.OnStage = function() {
    switch(this.Stage) {
        case 0:
            if(this.RaysFlag) {
                //    this.addFading(this.RaysImg, 1, 1, this.P2EasingIn, 0);
                this.RayScaler.setTweening(1, this.RaysScaleMax, 1, 'p2out', true, this.setRaysScale, this, null, this);
                this.RayFader.setTweening(0, 1, 0.5, 'p2out', true, this.setRaysFade, this, null, this);
            }
            if(this.WinFlag) this.Papa.PlaySnd(Base.SndApplause1);
            //xc,yc,span,num,ang0,angmax
            //   this.Papa.makeConnfetiFontan(this.Xc-650,
            //       this.Yc+650,30,3,3*Math.PI/2+Math.PI/8,Math.PI/4);
            //    this.Papa.makeConnfetiFontan(this.Xc+650,
            //      this.Yc+650,30,3,3*Math.PI/2-Math.PI/8,Math.PI/4);


            //  this.Papa.PlaySnd(Base.SndFirework);
            //  this.Stage++;
            //  this.setWait(1,this.OnStage,this);

            break;
        case 1:
            this.Papa.makeConnfetiFontan(this.Xc-650,
                this.Yc+450,30,5,3*Math.PI/2+Math.PI/8,Math.PI/4);
            this.Papa.makeConnfetiFontan(this.Xc+650,
                this.Yc+450,30,5,3*Math.PI/2-Math.PI/8,Math.PI/4);
            this.setWait(2,this.OnStage,this);
            this.Papa.PlaySnd(Base.SndFirework);
            this.Stage++;
            break;
        case 2:
            this.Papa.makeConnfetiFontan(this.Xc-650,
                this.Yc+650,30,5,3*Math.PI/2+Math.PI/8,Math.PI/4);
            this.Papa.makeConnfetiFontan(this.Xc+650,
                this.Yc+650,30,5,3*Math.PI/2-Math.PI/8,Math.PI/4);
            this.Papa.PlaySnd(Base.SndFirework);
            //  this.setWait(1,this.OnStage,this);
            //  this.RiseStage++;
            break;

    }
};

CWndDone.prototype.updateBgAlpha = function() {
    if(this.WndImg.obj==null)  return;
    this.BgImg.alpha = this.BgAlpha* this.BgAlphaCoeff;
    this.WndImg.alphaCoeff = this.BgAlpha;
    this.WndImg.obj.alpha = this.BgAlpha;

    //this.ButtReplay.alphaCoeff = this.BgAlpha;
    // this.ButtReplay.obj.alpha = this.BgAlpha;
    //  this.ButtReplayText.alphaCoeff = this.BgAlpha;
    // this.ButtReplayText.obj.alpha = this.BgAlpha;
};

CWndDone.prototype.OnEnd = function() {
    this.makeElementsVisible(false);
    // this.Papa.PauseOff();

    //if(this.ScoreAddFlag)
    //  this.Threads.removeThread(this,this.updateScoreCount);

    //   this.ScorePulser.kill();

    this.BgImg.kill();
    this.killObj(this.WndImg);
    this.killObj(this.ButtReplay);
    //this.killObj(this.ButtReplayText);

    this.killObj(this.TextLevel);
    this.killObj(this.TextAnwsers);
    this.killObj(this.TextAnwsersNum);
    this.killObj(this.TextScore);
    this.killObj(this.TextScoreNum);

    this.Threads.removeThread(this,this.update);

    this.ActiveFlag = false;
    if(this.EndCall!=null) this.EndCall.call(this);
};

CWndDone.prototype.setWait = function(time,func,funcContex)
{
    this.WaitCntr = time;
    this.WaitFunc = func;
    this.WaitFuncContex = funcContex;
    this.WaitFlag = true;
};


CWndDone.prototype.OnResize = function() {
    if(!this.ActiveFlag)  return;

    this.Xc = Base.WidthGame/2;
    this.Yc = Base.HeightGame/(2*Base.Scale);

    this.BgImg.y = this.Yc;
    this.BgImg.scale.set((Base.WidthGame+50)/(128),(Base.HeightGame+50)/(128));

    this.updateElements();
    //  this.BgImg.obj.scale.set(1,Base.HeightGame/960);
};

CWndDone.prototype.update = function() {

    /*  if( this.RaysFlag) {
     this.RaysAngle+=this.RaysAngleSpeed*Base.RealTimeInt;
     if(this.RaysAngle>=(2*Math.PI)) this.RaysAngle-=2*Math.PI;
     this.RaysImg.obj.rotation = this.RaysAngle;
     } */

    if(this.WaitFlag) {
        this.WaitCntr -= Base.RealTimeInt;
        if(this.WaitCntr<0) {
            this.WaitFlag = false;
            if( this.WaitFunc!=null)
                this.WaitFunc.call( this.WaitFuncContex);
        }
    }
};

//##################################################################
//##################################################################
//##################################################################

CWndHelp = function (papa,threads,group) {

    CBaseWnd.call(this,papa,threads,group);

    this.ActiveFlag = false;
    this.ButtFrames = ['buttplay.png','buttplay.png','buttplay.png','buttplay.png'];
   // this.ButtScaler = new CTweener(this.Threads);
   // this.ButtFader = new CTweener(this.Threads);
    this.Pulser = new CPulser(this.Threads);
    this.Candies = [];
};

CWndHelp.prototype = Object.create(CBaseWnd.prototype);
CWndHelp.prototype.constructor = CWndHelp;

CWndHelp.prototype.init = function() {

    this.ActiveFlag = false;
};

CWndHelp.prototype.create = function(func,funcContex) {

    this.clear();

    this.WaitFlag = false;

    this.Params = Base.Params.start;

    this.Xc = Base.WidthGame/2;//Base.Xc;
    this.Yc = Base.HeightGame/2;
    this.EndCall = null;
    this.BgAlpha = 0;

    this.FuncEnd = func;
    this.FuncEndContex = funcContex;

    //getZeroImg = function(x,y,tex,frameName,group,order)
    this.BgImg = this.Papa.getZeroImg(this.Xc,this.Yc,'bg',null,this.Group,0);
    //this.addImg(0,0,'atlas','white.png',this.Group,0);
    this.BgImg.anchor.set(0.5);
    this.BgImg.tint = 0x153d0e;
    this.BgAlphaCoeff =  0.3;
    this.BgImg.alpha = 0;
    this.BgImg.scale.set(1,1);//(Base.WidthWnd+50)/128,(Base.HeightWnd+50)/128);

    this.WndImg = this.addImg(0,0,'ui','wnd.png',this.Group,1);
    this.WndImg.obj.anchor.set(0.5);
    this.WndImg.obj.scale.set(1);
    this.WndImg.obj.tint = 0xFFFFFF;
    this.WndImg.scaleCoeffX = 1;
    this.WndImg.scaleCoeffY = 1;

    var widthMax = this.WndImg.obj.width-130;

    //  CPanel.prototype.create.call(Base.Xc,Base.Yc - Base.HeightGame/2);
    this.WndImg.alphaCoeff = this.BgAlpha;
    this.WndImg.obj.alpha = this.BgAlpha;
    var tween = this.Papa.Tweens.addTween(null,this.updateBgAlpha,this);
    tween.createEasingOut(this);
    tween.to({BgAlpha:1}, 1,true,null,this);
    tween.start();

    var y_top =  Base.getIntParam(this.Params.top.y,-100);
    var size =  Base.getIntParam(this.Params.top.size,100);
    this.TextTop = this.addBitmapText(0,y_top,'MainFont',this.Params.top.text,size,this.Group,2);
    this.TextTop.obj.tint = Base.getIntParam(this.Params.top.color,0x000000);
    this.TextTop.obj.align = 'center';
    this.TextTop.obj.anchor.set(0.5);
    this.TextTop.obj.update();
    if(this.TextTop.obj.width>widthMax) {
        this.TextTop.scaleCoeffX = widthMax/this.TextTop.obj.width;
        this.TextTop.scaleCoeffY = widthMax/this.TextTop.obj.width;
    }

    var y_ok = Base.getIntParam(this.Params.play.y,100);
    this.ButtOK = this.addButton(0,y_ok,'ui',this.ButtFrames,this.OnOK,this,this.Group,2);
    this.ButtOK.obj.tint =  Base.getIntParam(this.Params.play.color,0xFFFFFF);

    this.CandyNum = this.Params.objs.length;
    for(var i=0;i<this.CandyNum;i++) {
        var sx = Base.getIntParam(this.Params.objs[i].x,0);
        var sy = Base.getIntParam(this.Params.objs[i].y,0);
        var scale = Base.getFloatParam(this.Params.objs[i].scale,1);
        var ang = Base.getFloatParam(this.Params.objs[i].ang,0);
        this.Candies[i] = this.addImg(sx,sy,'atlas',this.Params.objs[i].img,this.Group,4);
        this.Candies[i].obj.tint = 0xFFFFFF;
        this.Candies[i].obj.rotation = Math.PI*ang/180;
        this.Candies[i].obj.anchor.set(0.5);
        this.Candies[i].scaleCoeffX = scale;
        this.Candies[i].scaleCoeffY = scale;
    }

    this.makeElementsVisible(true);

    this.TextTop.obj.visible = false;
    this.ButtOK.obj.visible = false;

    this.setTextsAlpha(0);
    this.setButtonsAlpha(0);
    this.setImgsAlpha(0);

    this.initFading(null);
    this.initShifting(null);

 //   this.setObjShift(this.TextTop,-700,0);
   // this.addFading(this.TextTop,1,0.4,this.P3EasingIn,0);
  //  this.addShifter(this.TextTop,0,0,0.5,this.P3EasingOut,0);

  //  for(i=0;i<this.CandyNum;i++)
   //     this.addFading(this.Candies[i],1,0.6,this.P2EasingIn,0);

   /* this.setObjShift(this.ButtReplay,-700,0);

    this.addShifter(this.ButtReplay,0,0,0.5,this.P3EasingOut,0);*/

    this.State = 0;
    this.ActiveFlag = true;

    this.BlockButtons(true);

    this.Stage = 0;
    this.setWait(0.5,this.OnStage,this);
    this.Threads.addThread(this,this.update);

    this.Group.sort('Order',-1);

    this.OnResize();
};

CWndHelp.prototype.updatePulse = function(scale) {
    this.TextTop.scaleCoeffX = scale;
    this.TextTop.scaleCoeffY = scale;
    this.TextTop.obj.scale.set(this.Scale*scale,this.Scale*scale);
};

CWndHelp.prototype.OnOK = function() {

    this.BlockButtons(true);
    this.Papa.PlaySnd(Base.SndButton);

    this.Stage = 4;
    this.setWait(0.5,this.OnStage,this); // wait for mole out

    this.Pulser.kill();
   // this.EndCall = this.DoReplay;
};

CWndHelp.prototype.OnStage = function() {
    switch(this.Stage) {
        case 0:
            this.ScaleCandy = 0;
            tween = this.Papa.Tweens.addTween(null,this.updateScaleCandy,this);
            tween.createEasingOut(this);
            tween.to({ScaleCandy:1}, 0.75,true,null,this);
            tween.start();

            this.setWait(0.5,this.OnStage,this);
            this.Stage++;
            break;
        case 1:
            //
            this.TopAlpha = 0;
            tween = this.Papa.Tweens.addTween(null,this.updateTop,this);
            tween.createEasingOut(this);
            tween.to({TopAlpha:1}, 0.75,true,null,this);
            tween.start();
            this.TextTop.obj.visible = true;

            this.setWait(0.8,this.OnStage,this);
            this.Stage++;
            break;
        case 2:
            this.Pulser.setPulsing(1,0.9,0,1,1,'p2inout',this.updatePulse,this);

            this.ButtOKAlpha = 0;
            var tween = this.Papa.Tweens.addTween(null,this.updateOKButt,this);
            tween.createEasingOut(this);
            tween.to({ButtOKAlpha:1}, 0.5,true,null,this);
            tween.start();

            this.ButtOK.obj.visible = true;
            this.updateOKButt();

            this.Stage++;
            this.setWait(1,this.OnStage,this);
            break;
        case 3:
            this.OnReady();
            this.updateObj(this.WndImg);
            break;
        case 4:
            this.setFadeOut();

            if(this.FuncEnd!=null)
                this.FuncEnd.call(this.FuncEndContex);
            break;
    }
};

CWndHelp.prototype.OnReady = function() {
    this.BlockButtons(false);
};

CWndHelp.prototype.BlockButtons = function(block) {

    this.ButtOK.obj.input.enabled = !block;
};

CWndHelp.prototype.setFadeOut = function() {
    this.BlockButtons(true);

    this.initFading(null);
    this.initShifting(null);

    //TextTop  TextAnswers  TextAnswersNum  TextScore  TextScoreNum

    this.addFading(this.TextTop,0,0.4,this.P2EasingOut,0);
    this.addShifter(this.TextTop,-800,0,0.5,this.P3EasingOut,0);

    for(var i=0;i<this.CandyNum;i++) {
        this.addFading(this.Candies[i],0,0.4,this.P2EasingOut,0);
        this.addShifter(this.Candies[i],800,0,0.5,this.P3EasingOut,0);
    }

    this.addFading(this.ButtOK,0,0.4,this.P2EasingOut,0);
    this.addShifter(this.ButtOK,-800,0,0.5,this.P3EasingOut,0);

    var tween = this.Papa.Tweens.addTween(null,this.updateBgAlpha,this);
    tween.createEasingOut(this);
    tween.to({BgAlpha:0}, 0.6,true,this.OnEnd,this);
    tween.start();

    // this.Papa.PlaySnd(Base.SndWindow);
};

CWndHelp.prototype.updateScaleCandy = function() {
    for(var i=0;i<this.CandyNum;i++) {
      //  this.Candies[i].scaleCoeffX = this.ScaleCandy;
      //  this.Candies[i].scaleCoeffY = this.ScaleCandy;
        this.Candies[i].obj.scale.set(this.Candies[i].scaleCoeffX*this.Scale*this.ScaleCandy,
            this.Candies[i].scaleCoeffY*this.Scale*this.ScaleCandy);
        this.Candies[i].alphaCoeff = this.ScaleCandy;
        this.Candies[i].obj.alpha = this.ScaleCandy;
    }
};

CWndHelp.prototype.updateTop = function() {

    this.TextTop.alphaCoeff = this.TopAlpha;
    this.TextTop.obj.alpha = this.TopAlpha;

    this.TextTop.scaleCoeffX = this.TopAlpha;
    this.TextTop.scaleCoeffY = this.TopAlpha;
    this.TextTop.obj.scale.set(this.Scale*this.TopAlpha,this.Scale*this.TopAlpha);
};

CWndHelp.prototype.updateOKButt = function() {

    this.ButtOK.alphaCoeff = this.ButtOKAlpha;
    this.ButtOK.obj.alpha = this.ButtOKAlpha;

    this.ButtOK.scaleCoeffX = this.ButtOKAlpha;
    this.ButtOK.scaleCoeffY = this.ButtOKAlpha;
    this.ButtOK.obj.scale.set(this.Scale*this.ButtOKAlpha,this.Scale*this.ButtOKAlpha);
};

CWndHelp.prototype.updateBgAlpha = function() {
    if(this.WndImg.obj==null)  return;
    this.BgImg.alpha =  this.BgAlpha*this.BgAlphaCoeff;
    this.WndImg.alphaCoeff = this.BgAlpha;
    this.WndImg.obj.alpha =  this.BgAlpha;
};

CWndHelp.prototype.OnEnd = function() {
    this.makeElementsVisible(false);
    // this.Papa.PauseOff();

    this.Pulser.kill();

    this.BgImg.kill();
    for(var i=0;i<this.CandyNum;i++)
        this.killObj(this.Candies[i]);
    this.killObj(this.WndImg);
    this.killObj(this.ButtOK);

    this.Threads.removeThread(this,this.update);

    this.ActiveFlag = false;
    if(this.EndCall!=null) this.EndCall.call(this);

 //   if(this.FuncEnd!=null)
  //      this.FuncEnd.call(this.FuncEndContex);
};

CWndHelp.prototype.setWait = function(time,func,funcContex)
{
    this.WaitCntr = time;
    this.WaitFunc = func;
    this.WaitFuncContex = funcContex;
    this.WaitFlag = true;
};

CWndHelp.prototype.OnResize = function() {
    if(!this.ActiveFlag)  return;

    this.Xc = Base.WidthGame/2;
    this.Yc = Base.HeightGame/2;

    this.BgImg.y = this.Yc;
    this.BgImg.scale.set((Base.WidthGame+50)/(128),(Base.HeightGame+50)/(128));

    this.updateElements();
    //  this.BgImg.obj.scale.set(1,Base.HeightGame/960);
};

CWndHelp.prototype.update = function() {

    if(this.WaitFlag) {
        this.WaitCntr -= Base.RealTimeInt;
        if(this.WaitCntr<0) {
            this.WaitFlag = false;
            if( this.WaitFunc!=null)
                this.WaitFunc.call( this.WaitFuncContex);
        }
    }
};

