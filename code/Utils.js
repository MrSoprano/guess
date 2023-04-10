
CTweens = function () {
    this.tweensVault = [];
    this.tweensRun = [];
    this.tweensRunNum = 0;
};

CTweens.prototype.create = function()
{
    this.tweensRunNum = 0;
};

CTweens.prototype.clear = function()
{
    this.tweensRunNum = 0;
    // called ouside to clean all tweens
};

CTweens.prototype._getFreeTween = function()
{
    for(var i=0;i<this.tweensVault.length;i++)
    {
        if(!this.tweensVault[i].ActiveFlag)
          return this.tweensVault[i];
    }

    var tween = new CTween();
    this.tweensVault.push(tween);
    return tween;
};

CTweens.prototype.addTween = function(tweenOld,funcUpd,funcUpdContex) {

    var tween = null;

    if(tweenOld!=null)
    {
        for (var i = 0; i < this.tweensRunNum; i++) {

            if (this.tweensRun[i].tween==tweenOld) {
                this.tweensRun[i].ActiveFlag = true;
                this.tweensRun[i].funcUpd = funcUpd;
                this.tweensRun[i].funcUpdContex = funcUpdContex;
                return this.tweensRun[i].tween;
            }
        }
    }

    for (i = 0; i < this.tweensRunNum; i++) {

        if (!this.tweensRun[i].tween.ActiveFlag) {
            tween = this.tweensRun[i];
            break;
        }
    }

    if(tween==null)
    {
        if(this.tweensRun[this.tweensRunNum]==undefined)
        {
            this.tweensRun[this.tweensRunNum] = {tween:null};
            this.tweensRun[this.tweensRunNum].tween = new CTween();
        }
        tween =  this.tweensRun[this.tweensRunNum];
        this.tweensRunNum++;
    }

//    tween.tween.setOnUpdate(funcUpd,funcUpdContex);

//    tween.tween = this._getFreeTween();
    tween.funcUpd = funcUpd;
    tween.funcUpdContex = funcUpdContex;
    tween.ActiveFlag = true;
    return tween.tween;
};

CTweens.prototype.update = function()
{
    var last = 0;
    for(var i=0;i<this.tweensRunNum;i++) {

        if(this.tweensRun[i].tween.ActiveFlag)
        {
            last = i + 1;
            this.tweensRun[i].tween.update();
            if(this.tweensRun[i].funcUpd!=null)
                this.tweensRun[i].funcUpd.call(this.tweensRun[i].funcUpdContex);
        }
        else
        {
            //this.tweensRun[i].tween = null;
        }
    }
    this.tweensRunNum = last;
};

//######################################################################
//######################################################################
//######################################################################

CTween = function () {

    this._valuesStart = {};
    this._valuesEnd = null;
    this.CompleteCallback = null;
    this.CompleteCallbackContex = null;
    this.RunFlag = false;
    this.ActiveFlag = false;
};

CTween.prototype.clear = function()
{
    this.DelayFlag = false;
    this.RunFlag = false;
    this.PauseFlag = false;
    this.UpdateCallback = null;
    this.CompleteCallback = null;
    this.CompleteParams = null;

};

CTween.prototype.createLinear = function(obj)
{
    this.clear();
    this._object = obj;
    this._easingFunction = this.Linear;
    this._interpolationFunction = this.InterpolateLinearArray;
    this.ActiveFlag = true;
};

CTween.prototype.createQuadraticOut = function(obj)
{
    this.clear();
    this._object = obj;
    this._easingFunction = this.QuadraticOut;
    this._interpolationFunction = this.InterpolateLinearArray;
    this.ActiveFlag = true;
};

CTween.prototype.createQuanticOut = function(obj)
{
    this.clear();
    this._object = obj;
    this._easingFunction = this.P2QuanticOut;
    this._interpolationFunction = this.InterpolateLinearArray;
    this.ActiveFlag = true;
};

CTween.prototype.createEasingOut = function(obj)
{
    this.clear();
    this._object = obj;
    this._easingFunction = this.P2EasingOut;
    this._interpolationFunction = this.InterpolateLinearArray;
    this.ActiveFlag = true;
};

CTween.prototype.createP3EasingIn = function(obj)
{
    this.clear();
    this._object = obj;
    this._easingFunction = this.P3EasingIn;
    this._interpolationFunction = this.InterpolateLinearArray;
    this.ActiveFlag = true;
};

CTween.prototype.createP3EasingOut = function(obj)
{
    this.clear();
    this._object = obj;
    this._easingFunction = this.P3EasingOut;
    this._interpolationFunction = this.InterpolateLinearArray;
    this.ActiveFlag = true;
};

CTween.prototype.createEasingIn = function(obj)
{
    this.clear();
    this._object = obj;
    this._easingFunction = this.P2EasingIn;
    this._interpolationFunction = this.InterpolateLinearArray;
    this.ActiveFlag = true;
};

CTween.prototype.createEasingInOut = function(obj)
{
    this.clear();
    this._object = obj;
    this._easingFunction = this.P2EasingInOut;
    this._interpolationFunction = this.InterpolateLinearArray;
    this.ActiveFlag = true;
};

CTween.prototype.createP3EasingInOut = function(obj)
{
    this.clear();
    this._object = obj;
    this._easingFunction = this.P3EasingInOut;
    this._interpolationFunction = this.InterpolateLinearArray;
    this.ActiveFlag = true;
};

//################

CTween.prototype.to = function(prop, duration,go,funcEnd,funcEndContex)
{
    this.clear();
    this._valuesEnd = prop;
    this.CompleteCallback = funcEnd;
    this.CompleteCallbackContex = funcEndContex;
    this.Duration = duration; // in seconds

    if(go)  this.start();
};

CTween.prototype.setOnUpdate = function(func,funcContex)
{
    this.UpdateCallback = func;
    this.UpdateCallbackContex = funcContex;
};

CTween.prototype.start = function(delay) {

    if(delay!=undefined && delay>0)
    {
        this.DelayFlag = true;
        this.DelayCntr = delay;
        return false;
    }

    this.TimeCntr = 0;
    for (var property in this._valuesEnd) {

        // If `to()` specifies a property that doesn't exist in the source object,
        // we should not set that property in the object
        if (this._object[property] === undefined) {
            continue;
        }
        // Save the starting value.
        this._valuesStart[property] = this._object[property];
    }

    this.RunFlag = true;
    return true;
};

CTween.prototype.setP2EasingIn = function(k)
{
    this._easingFunction = this.P2EasingIn;
};

CTween.prototype.setP2EasingOut = function(k)
{
    this._easingFunction = this.P2EasingOut;
};

CTween.prototype.P2EasingIn = function(k)
{
    return k * k;
};

CTween.prototype.P2EasingOut = function(k)
{
    return k * ( 2 - k );
};

CTween.prototype.P2EasingInOut = function(k)
{
    if ((k *= 2) < 1) {
        return 0.5 * k * k;
    }

    return - 0.5 * (--k * (k - 2) - 1);

};

CTween.prototype.P2QuanticOut = function(k)
{
    return --k * k * k * k * k + 1;

};

CTween.prototype.QuadraticIn = function(k)
{
    return k * k;
};

CTween.prototype.Linear = function(k)
{
    return k ;
};

CTween.prototype.P2EasingIn = function(k)
{
    return k * k;
};

CTween.prototype.P3EasingIn = function(k)
{
    return k * k * k;
};

CTween.prototype.P3EasingOut = function(k)
{
    return --k * k * k   +  1;

};

CTween.prototype.P3EasingInOut = function(k)
{
    if ((k *= 2) < 1) {
        return 0.5 * k * k * k * k ;
    }

    return 0.5 * ((k -= 2) * k * k * k  + 2);
};


CTween.prototype.P4EasingInOut = function(k)
{
    if ((k *= 2) < 1) {
        return 0.5 * k * k * k * k * k;
    }

    return 0.5 * ((k -= 2) * k * k * k * k + 2);
};

CTween.prototype.InterpolateLinear = function(p0, p1, t)
{
    return (p1 - p0) * t + p0;
};

CTween.prototype.InterpolateLinearArray = function(v, k)
{
    var m = v.length - 1;
    var f = m * k;
    var i = Math.floor(f);
    var fn = this.InterpolateLinear;

    if (k < 0) {
        return fn(v[0], v[1], f);
    }

    if (k > 1) {
        return fn(v[m], v[m - 1], m - f);
    }

    return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
};

CTween.prototype.Kill = function() {
    //this.PauseFlag = false;
    this.RunFlag = false;
    this.DelayFlag = false;
    this.ActiveFlag = false;
};

CTween.prototype.update = function() {

    //   if(this.PauseFlag)  return;

    if( this.RunFlag)
    {
        this.TimeCntr += Base.RealTimeInt;

        if( this.TimeCntr>=this.Duration)
        {
            this.TimeCntr = this.Duration;
            // end
            this.RunFlag = false;
        }

        // set objects
        var elapsed = this.TimeCntr / this.Duration;
        elapsed = elapsed > 1 ? 1 : elapsed;

        var value = this._easingFunction(elapsed);

        for (var property in this._valuesEnd) {

            // Don't update properties that do not exist in the source object
            /*if (this._valuesStart[property] === undefined) {
             continue;
             }*/

            var start = this._valuesStart[property] || 0;
            var end = this._valuesEnd[property];

            if (end instanceof Array) {

                this._object[property] = this._interpolationFunction(end, value);

            } else {

                // Parses relative end values with start as base (e.g.: +10, -3)
                /* if (typeof (end) === 'string') {

                 if (end.charAt(0) === '+' || end.charAt(0) === '-') {
                 end = start + parseFloat(end);
                 } else {
                 end = parseFloat(end);
                 }
                 }*/

                // Protect against non numeric properties.
                if (typeof (end) === 'number') {
                    this._object[property] = start + (end - start) * value;
                }
            }
        }

     //   if(this.UpdateCallback!=null)
       //     this.UpdateCallback.call(this.UpdateCallbackContex);

        if(!this.RunFlag)
        {
            this.Kill();
            if(this.CompleteCallback != null)
                this.CompleteCallback.call(this.CompleteCallbackContex,this.CompleteParams);
            return;
        }
    }
    else
    {
        if(this.DelayFlag)
        {
            this.DelayCntr-=Base.RealTimeInt;
            if(this.DelayCntr<0)
            {
                this.DelayFlag = false;
                this.start(0);
            }
        }
    }

};


//#############################TM############################
CThreadManager = function(papa) {

    this.Papa = papa;
    this.Cache = [];
    this.Threads = [];
    this.ThreadsNum = 0;
    this.LastThread = 0;
};

CThreadManager.prototype.create = function() // clear all threads
{
    //clear
    for(var i=0;i<this.Threads.length;i++)
        this.Threads[i].Thread = null;
    this.ThreadsNum = 0;
};

CThreadManager.prototype.getFreeCachedThread = function(type)
{
    // return free thread from cache
    for(var i=0;i<this.Cache.length;i++) {

        if (this.Cache[i] instanceof type) {

            if(this.IsThreadFree(this.Cache[i]))
                return this.Cache[i];
        }
    }
    return null;
};

CThreadManager.prototype.kill = function() // clear all threads
{
    for(var i=0;i<this.Threads.length;i++)
        this.Threads[i].Thread = null;
    this.ThreadsNum = 0;
};

CThreadManager.prototype.IsThreadFree = function(thread,func)
{
    for(var i=0;i<this.ThreadsNum;i++)
        if(this.Threads[i].Thread===thread)
            return false;
    return true;
}

CThreadManager.prototype.getCachedThread = function(type)
{
    for(var i=0;i<this.Cache.length;i++)
        if(this.Cache[i] instanceof type)
            return this.Cache[i];
    return null;
};

CThreadManager.prototype.saveThread = function(thread)
{
    for(var i=0;i<this.Cache.length;i++)
    {
        if(this.Cache[i]===thread)
            return;
    }

    this.Cache.push(thread);
};

CThreadManager.prototype.addThread = function(thread,func)
{
    for(var i=0;i<this.ThreadsNum;i++)
        if(this.Threads[i].Thread===thread && this.Threads[i].Func===func) {
            return i;
        }

    for(i=0;i<this.ThreadsNum;i++)
        if(this.Threads[i].Thread==null) {
            this.Threads[i].Thread = thread;
            this.Threads[i].Func = func;
            return i;
        }

    for(i=0;i<this.Threads.length;i++)
    {
        if(this.Threads[i].Thread==null)
        {
            this.Threads[i].Thread =  thread;
            this.Threads[i].Func = func;
            this.ThreadsNum = i + 1;
            return i;
        }
    }

    var obj = {};
    obj.Thread = thread;
    obj.Func = func;
    this.Threads.push(obj);
    //  if(save)  this.saveThread(obj);
    this.ThreadsNum = this.Threads.length;
    return this.ThreadsNum - 1;
};

CThreadManager.prototype.removeThreadsByType = function(type)
{
    for(var i=0;i< this.Threads.length;i++)
        if(this.Threads[i].Thread instanceof type) {
            this.Threads[i].Thread = null;
        }
};

CThreadManager.prototype.removeThread = function(thread,func)
{
    for(var i=0;i< this.Threads.length;i++) {
        if(this.Threads[i].Thread===thread) {
            if(func)
            {
                if(this.Threads[i].Func===func) {
                    this.Threads[i].Thread = null;
                    return true;
                }
            }
            else
            {
                this.Threads[i].Thread = null;
            }
        }
    }
    return false;
};

CThreadManager.prototype.update = function()
{
    this.LastThread = 0;

    for(var i=0;i<this.ThreadsNum ;i++)
    {
        if(this.Threads[i].Thread!=null)
        {
          //  (this.Threads[i].Thread).update();
            this.Threads[i].Func.call(this.Threads[i].Thread);
            this.LastThread = i + 1;
        }
    }
    this.ThreadsNum = this.LastThread;
};


//###########################################


CDelayCall = function (papa) {

    this.Papa = papa;
    this.dT = 1.0/Base.UPS;//this.Papa.game.time.physicsElapsed;
    this.DelayCntr = 0;
    this.DealyCall = null;
    this.Arguments = null;
    this.RunFlag = false;
    this.PapaCall = null;
    this.KillFlag = false;
    this.ActiveFlag = false;
};

CDelayCall.prototype.Create = function(delay,func,args,go,kill,papa,threads)
{
    this.DelayCntr = delay;
    this.DealyCall = func;
    this.Arguments = args;
    this.Threads = threads;

    if(papa) this.PapaCall = papa;
    else this.PapaCall =  this.Papa;

    this.KillFlag = kill;
    this.RunFlag = go;
    this.Threads.addThread(this,this.update);
    this.ActiveFlag = true;
};

CDelayCall.prototype.kill = function()
{
     if(!this.ActiveFlag) return;
     this.Threads.removeThread(this);
     this.ActiveFlag = false;
};

CDelayCall.prototype.update = function()
{
    if(this.RunFlag)
    {
        this.DelayCntr-=Base.RealTimeInt;
        if(this.DelayCntr<0)
        {
            this.RunFlag = false;
            if(this.KillFlag)  this.kill();

            if(this.DealyCall!=null)
                this.DealyCall.apply(this.PapaCall,this.Arguments);
        }
    }
};