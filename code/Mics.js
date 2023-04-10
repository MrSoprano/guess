
CShaker = function (threads) {
    this.updateFlag = false;
    this.Threads = threads;
};

CShaker.prototype.getTweenFunc = function(tween)
{
    switch(tween) {
        case 'line':
            return this.P2Linear;
            break;
        case 'p2out':
            return this.P2EasingOut;
            break;
        case 'p2in':
            return  this.P2EasingIn;
            break;
        case 'p2inout':
            return  this.P2EasingInOut;
            break;
        case 'bounceout':
            return  this.EasingElasticOut;
            break;
    }
    return this.P2Linear;
};

CShaker.prototype.EasingElasticOut = function(k)
{
    if (k === 0) {
        return 0;
    }

    if (k === 1) {
        return 1;
    }

    return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
};

CShaker.prototype.P2Linear = function(k)
{
    return k;
};

CShaker.prototype.P2EasingOut = function(k)
{
    return k * ( 2 - k );
};

CShaker.prototype.P2EasingIn = function(k)
{
    return k * k;
};

CShaker.prototype.P2EasingInOut = function(k)
{
    if ((k *= 2) < 1) {
        return 0.5 * k * k;
    }

    return - 0.5 * (--k * (k - 2) - 1);
};

CShaker.prototype.setShake = function(speed,ang,angRnd,dist,distRnd,distMin,timeRise,timeStay,timeFade,tween,
                                      update,updateContex,funcEnd,funcEndContex)
{
    this.X0 = 0;
    this.Y0 = 0;
    this.Angle = ang;
    this.AngleRnd = angRnd;
    this.TimeRise = timeRise;
    this.TimeStay = timeStay;
    this.TimeFade = timeFade;
    this.TimeCntr = this.TimeRise;
    this.State = 0; // rise
    this.Dist = dist;
    this.DistMin = distMin;
    this.DistRnd = distRnd;
    this.FinalFlag = false;

    if( this.TimeRise<=0) {
        this.Amp = 1;
        this.AmpFlag = false;
        this.State = 1;
        this.TimeCntr = this.TimeStay;
    }
    else {
        this.Amp = 0;
        this.AmpSpeed = 1/this.TimeRise;
        this.AmpFlag = true;
    }

    this.Speed = speed;
    this.Coeff = 0.5;
    var d = this.Amp*(this.Dist + this.DistRnd*Math.random());
    if(d<this.DistMin) d = this.DistMin;
    this.CoeffSpeed = 1.0/(d/this.Speed);
    var a = this.Angle - this.AngleRnd/2 + this.AngleRnd*Math.random();
    this.DistX = Math.cos(a)* d;
    this.DistY = Math.sin(a)* d;

    this.UpdateFunc = update;
    this.UpdateFuncContex = updateContex;
    this.FuncEnd = funcEnd;
    this.FuncEndContex = funcEndContex;
    this.TweenFunc = this.getTweenFunc(tween);
    if(!this.updateFlag) {
        this.Threads.addThread(this, this.updateShake);
        this.updateFlag = true;
    }
};

CShaker.prototype.updateShake = function()
{
    this.Coeff += this.CoeffSpeed*Base.RealTimeInt;

    if( this.Coeff>=1)  {
        if(this.FinalFlag) {
            this.UpdateFunc.call(this.UpdateFuncContex,0,0);
            this.kill();
            if(this.FuncEnd!=null)
                this.FuncEnd.call(this.FuncEndContex);
            return;
        }

        this.Coeff -= 1;
        this.X0 = this.DistX;
        this.Y0 = this.DistY;
        this.Angle = -this.Angle;
        var ang = this.Angle - this.AngleRnd/2 + this.AngleRnd*Math.random();
        var dist = this.Amp*(this.Dist + this.DistRnd*Math.random());
        if(dist<this.DistMin) {
            dist = this.DistMin;
            if(this.State>1) {
                this.FinalFlag = true;
            }
        }
        this.CoeffSpeed = 1.0/(dist/this.Speed);
        this.DistX = Math.cos(ang)* dist;
        this.DistY = Math.sin(ang)* dist;

        if(this.FinalFlag) {
            this.DistX = 0;
            this.DistY = 0;
        }
    }

    if(this.AmpFlag) {
        this.Amp += this.AmpSpeed*Base.RealTimeInt;
        if(this.Amp<0) this.Amp = 0;
        if(this.Amp>1) this.Amp = 1;
      //  this.UpdateFunc.call(this.UpdateFuncContex,this.Amp*(this.X0*(1-coeff) + this.DistX*coeff),
         //   this.Amp*(this.Y0*(1-coeff) + this.DistY*coeff));
    }

    var coeff =  this.TweenFunc(this.Coeff);
    this.UpdateFunc.call(this.UpdateFuncContex,this.X0*(1-coeff) + this.DistX*coeff,
            this.Y0*(1-coeff) + this.DistY*coeff);

    this.TimeCntr-=Base.RealTimeInt;
    if(this.TimeCntr<0) {
        switch(this.State) {
            case 0:
                this.State++;
                this.TimeCntr = this.TimeStay;
                this.Amp = 1;
                this.AmpFlag = false;
                break;
            case 1:
                this.State++;
                this.TimeCntr = this.TimeFade;
                if(this.TimeFade>0) {
                    this.AmpFlag = true;
                    this.AmpSpeed = -1.0/this.TimeFade;
                }
                break;
            case 2:
                this.State++;

                break;
        }
    }
};

CShaker.prototype.kill = function() {
    if(!this.updateFlag)  return;
    this.Threads.removeThread(this, this.updateShake);
    this.updateFlag = false;
};

//####################################
//####################################
CRotor = function (threads) {
    this.updateFlag = false;
    this.Threads = threads;
};

CRotor.prototype.getTweenFunc = function(tween)
{
    switch(tween) {
        case 'line':
            return this.P2Linear;
            break;
        case 'p2out':
            return this.P2EasingOut;
            break;
        case 'p2in':
            return  this.P2EasingIn;
            break;
        case 'p2inout':
            return  this.P2EasingInOut;
            break;
        case 'bounceout':
            return  this.EasingElasticOut;
            break;
    }
    return this.P2Linear;
};

CRotor.prototype.EasingElasticOut = function(k)
{
    if (k === 0) {
        return 0;
    }

    if (k === 1) {
        return 1;
    }

    return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
};

CRotor.prototype.P2Linear = function(k)
{
    return k;
};

CRotor.prototype.P2EasingOut = function(k)
{
    return k * ( 2 - k );
};

CRotor.prototype.P2EasingIn = function(k)
{
    return k * k;
};

CRotor.prototype.P2EasingInOut = function(k)
{
    if ((k *= 2) < 1) {
        return 0.5 * k * k;
    }

    return - 0.5 * (--k * (k - 2) - 1);
};

CRotor.prototype.setRotation = function(ang,add,time,kill,tween,loops,swing,
    update,updateContex,funcEnd,funcEndContex)
{
    this.Angle = ang;
    this.Angle0 = this.Angle;
    this.AngleDist = add;
    this.AngleCoeff = 0;
    this.AngleCoeffSpeed = 1.0/time;
    this.UpdateFunc = update;
    this.UpdateFuncContex = updateContex;
    this.AngleKillFlag = kill;
    this.FuncEnd = funcEnd;
    this.FuncEndContex = funcEndContex;
    this.RotateLoopsCntr = loops;  // if 0 - endless
    this.RotateSwingFlag = swing;
    this.AngleTweenFunc = this.getTweenFunc(tween);
    if(!this.updateFlag) {
        this.Threads.addThread(this, this.updateRotate);
        this.updateFlag = true;
    }
    this.RotatingFlag = true;
};

CRotor.prototype.kill = function() {
    if(!this.updateFlag)  return;
    this.Threads.removeThread(this, this.updateRotate);
    this.updateFlag = false;
};

CRotor.prototype.updateRotate = function()
{
    this.AngleCoeff += this.AngleCoeffSpeed*Base.RealTimeInt;
    if(this.AngleCoeff>=1) {
        this.AngleCoeff = 1;
    }
    var coeff =  this.AngleTweenFunc(this.AngleCoeff);
    this.Angle = this.Angle0 + this.AngleDist*coeff;

    this.Img.rotation = this.Angle;

    if(this.AngleCoeff>=1) {
        if(this.Angle>(2*Math.PI)) this.Angle-=2*Math.PI;
        if(this.Angle<0) this.Angle += 2*Math.PI;

        this.AngleCoeff = 0;
        this.Angle0 = this.Angle;

        if(this.RotateLoopsCntr<=0) {
            //endless
            this.AngleCoeff = 0;
            this.Angle0 = this.Angle;
            if(this.RotateSwingFlag)
                this.AngleDist = -this.AngleDist;
        }
        else
        {
            //counted loops
            this.RotateLoopsCntr--;
            if(this.RotateLoopsCntr<=0) {
                this.RotatingFlag = false;
                if(this.AngleKillFlag)  this.kill();
                if(this.FuncEnd!=null)
                    this.FuncEnd.call(this.FuncEndContex);
            }
            else
            {
                this.AngleCoeff = 0;
                this.Angle0 = this.Angle;
                if(this.RotateSwingFlag)
                    this.AngleDist = -this.AngleDist;
            }
        }
    }

    this.UpdateFunc.call(this.UpdateFuncContex,this.Angle);
};


//##################################
//##################################
//##################################
CBezierMover = function () {
    this.updateFlag = false;
};

CBezierMover.prototype.create = function(threads,tween,func,funcContex)
{
    // curve:{up0,up1,up0dist,up1dist}
    this.Threads = threads;
    this.Tween = this.getTweenFunc(tween);
    this.FuncUpdate = func;
    this.FuncUpdateContex = funcContex;
    if(this.updateFlag) this.kill();
};

CBezierMover.prototype.setMove = function(x,y,x_dest,y_dest,ang0,ang1,dist0,dist1,time,kill,funcEnd,funcEndContex)
{
    this.X = x;
    this.Y = y;
    this.X0 = x;
    this.Y0 = y;
    this.X3 = x_dest;
    this.Y3 = y_dest;
    this.FuncUpdate.call(this.FuncUpdateContex,this.X,this.Y);

    this.Dist = Math.sqrt((this.X3-this.X0)*(this.X3-this.X0)+(this.Y3-this.Y0)*(this.Y3-this.Y0));
    if(this.Dist<1) this.Dist = 1;

    var ang = Math.PI*ang0/180;
    var normx = Math.cos(ang);
    var normy = Math.sin(ang);
    this.X1 =  this.X0 + this.Dist*normx*dist0;
    this.Y1 =  this.Y0 + this.Dist*normy*dist0;

    ang = Math.PI*ang1/180;
    normx = Math.cos(ang);
    normy = Math.sin(ang);
    this.X2 =  this.X3 + this.Dist*normx*dist1;
    this.Y2 =  this.Y3 + this.Dist*normy*dist1;

    this.T = 0;
    this.TSpeed = 1/time;

    this.KillFlag = kill;

    this.FuncEnd = funcEnd;
    this.FuncEndContex = funcEndContex;

    if(!this.updateFlag) {
        this.Threads.addThread(this, this.update);
        this.updateFlag = true;
    }
};

CBezierMover.prototype.makeBezierPoint = function(t)
{
    this.X = (1-t)*(1-t)*(1-t)*this.X0 +
        3*(1-t)*(1-t)*t*this.X1 +
        3*(1-t)*t*t*this.X2 +
        t*t*t*this.X3;

    this.Y = (1-t)*(1-t)*(1-t)*this.Y0 +
        3*(1-t)*(1-t)*t*this.Y1 +
        3*(1-t)*t*t*this.Y2 +
        t*t*t*this.Y3;
};

CBezierMover.prototype.makeBezier = function(t)
{
    var cX = 3 * (this.X1 - this.X0),
        bX = 3 * (this.X2 - this.X1) - cX,
        aX = this.X3 - this.X0 - cX - bX;

    var cY = 3 * (this.Y1 - this.Y0),
        bY = 3 * (this.Y2 - this.Y1) - cY,
        aY = this.Y3 - this.Y0 - cY - bY;

    this.X = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + this.X0;
    this.Y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + this.Y0;
};

CBezierMover.prototype.kill = function()
{
    if( this.updateFlag)
        this.Threads.removeThread(this,this.update);
    this.updateFlag = false;
};

CBezierMover.prototype.getTweenFunc = function(tween)
{
    switch(tween) {
        case 'line':
            return this.P2Linear;
            break;
        case 'p2out':
            return this.P2EasingOut;
            break;
        case 'p2in':
            return  this.P2EasingIn;
            break;
        case 'p2inout':
            return  this.P2EasingInOut;
            break;
        case 'p3out':
            return  this.P3EasingOut;
            break;
    }
    return this.P2Linear;
}

CBezierMover.prototype.P2Linear = function(k)
{
    return k;
};

CBezierMover.prototype.P2EasingOut = function(k)
{
    return k * ( 2 - k );
};

CBezierMover.prototype.P2EasingIn = function(k)
{
    return k * k;
};

CBezierMover.prototype.P2EasingInOut = function(k)
{
    if ((k *= 2) < 1) {
        return 0.5 * k * k;
    }

    return - 0.5 * (--k * (k - 2) - 1);
};

CBezierMover.prototype.P3EasingOut = function(k)
{
    return --k * k * k   +  1;
};

CBezierMover.prototype.update= function()
{
    this.T += this.TSpeed*Base.RealTimeInt;
    if(this.T>=1)
        this.T = 1;

    var coeff = this.Tween(this.T);

    this.makeBezierPoint(coeff);

   // this.X = this.X0 + ( this.X3-this.X0)*coeff;
   // this.Y = this.Y0 + ( this.Y3-this.Y0)*coeff;

    this.FuncUpdate.call(this.FuncUpdateContex,this.X,this.Y);

    if(this.T>=1) {

        if(this.KillFlag)
            this.kill();

        if(this.FuncEnd!=null)
            this.FuncEnd.call(this.FuncEndContex);
    }
};


//##################################
//##################################
//##################################
CMover = function () {
    this.updateFlag = false;
};

CMover.prototype.create = function(x,y,threads,update,updateContex)
{
    this.X = x;
    this.Y = y;
    this.X0 = x;
    this.Y0 = y;
    this.Threads = threads;
    this.FuncUpdate = update;
    this.FuncUpdateContex = updateContex;
    if(this.updateFlag) this.kill();
};

CMover.prototype.setMove = function(x_dest,y_dest,time,tween,kill,func,funcContex)
{
 //   this.FuncUpdate.call(this.FuncUpdateContex,this.X,this.Y);
    this.X_dest = x_dest;
    this.Y_dest = y_dest;

    this.dX = this.X_dest - this.X0;
    this.dY = this.Y_dest - this.Y0;

    this.Coeff = 0;
    this.CoeffSpeed = 1/time;

    this.KillFlag = kill;

    this.Tween = this.getTweenFunc(tween);

    this.FuncEnd = func;
    this.FuncEndContex = funcContex;

    if(!this.updateFlag) {
        this.Threads.addThread(this, this.update);
        this.updateFlag = true;
    }
};

CMover.prototype.kill = function()
{
    if( this.updateFlag)
        this.Threads.removeThread(this,this.update);
    this.updateFlag = false;
};

CMover.prototype.getTweenFunc = function(tween)
{
    switch(tween) {
        case 'line':
            return this.P2Linear;
            break;
        case 'p2out':
            return this.P2EasingOut;
            break;
        case 'p2in':
            return  this.P2EasingIn;
            break;
        case 'p2inout':
            return  this.P2EasingInOut;
            break;
        case 'p3out':
            return  this.P3EasingOut;
            break;
    }
    return this.P2Linear;
}

CMover.prototype.P2Linear = function(k)
{
    return k;
};

CMover.prototype.P2EasingOut = function(k)
{
    return k * ( 2 - k );
};

CMover.prototype.P2EasingIn = function(k)
{
    return k * k;
};

CMover.prototype.P2EasingInOut = function(k)
{
    if ((k *= 2) < 1) {
        return 0.5 * k * k;
    }

    return - 0.5 * (--k * (k - 2) - 1);
};

CMover.prototype.P3EasingOut = function(k)
{
    return --k * k * k   +  1;
};

CMover.prototype.update = function()
{
    this.Coeff += this.CoeffSpeed*Base.RealTimeInt;
    if(this.Coeff>=1)
        this.Coeff = 1;

    var coeff = this.Tween(this.Coeff);

    this.X = this.X0 + this.dX*coeff;
    this.Y = this.Y0 + this.dY*coeff;

    this.FuncUpdate.call(this.FuncUpdateContex,this.X,this.Y);

    if(this.Coeff>=1) {

        if(this.KillFlag)
            this.kill();

        if(this.FuncEnd!=null)
            this.FuncEnd.call(this.FuncEndContex);
    }
};

//#######################################
//#######################################
//#######################################

CTweener = function (threads) {
    this.Threads = threads;
    this.updateFlag = false;
};

CTweener.prototype.setTweening = function(val,dest,time,tween,kill,update,updateContex,funcEnd,funcEndContex)
{
    this.Val = val;
    this.Val0 = val;
    this.FuncUpdate = update;
    this.FuncUpdateContex = updateContex;

    this.Val_dest = dest;

    this.dVal = this.Val_dest - this.Val0;

    this.Coeff = 0;
    this.CoeffSpeed = 1/time;

    this.KillFlag = kill;

    this.Tween = this.getTweenFunc(tween);

    this.FuncEnd = funcEnd;
    this.FuncEndContex = funcEndContex;

    this.DelayFlag = false;

    if(!this.updateFlag) {
        this.Threads.addThread(this, this.update);
        this.updateFlag = true;
    }
    return this;
};

CTweener.prototype.setDelay = function(delay,func,funcContex)
{
    this.DelayFunc = func;
    this.DelayFuncContex = funcContex;
    this.DelayTimeCntr = delay;
    this.DelayFlag = true;
};

CTweener.prototype.kill = function()
{
    if( this.updateFlag)
        this.Threads.removeThread(this,this.update);
    this.updateFlag = false;
};

CTweener.prototype.getTweenFunc = function(tween)
{
    switch(tween) {
        case 'line':
            return this.P2Linear;
            break;
        case 'p2out':
            return this.P2EasingOut;
            break;
        case 'p2in':
            return  this.P2EasingIn;
            break;
        case 'p2inout':
            return  this.P2EasingInOut;
            break;
        case 'p3out':
            return  this.P3EasingOut;
            break;
    }
    return this.P2Linear;
};

CTweener.prototype.P2Linear = function(k)
{
    return k;
};

CTweener.prototype.P2EasingOut = function(k)
{
    return k * ( 2 - k );
};

CTweener.prototype.P2EasingIn = function(k)
{
    return k * k;
};

CTweener.prototype.P2EasingInOut = function(k)
{
    if ((k *= 2) < 1) {
        return 0.5 * k * k;
    }

    return - 0.5 * (--k * (k - 2) - 1);
};

CTweener.prototype.P3EasingOut = function(k)
{
    return --k * k * k   +  1;
};

CTweener.prototype.update = function()
{
    if(this.DelayFlag) {
        this.DelayTimeCntr -= Base.RealTimeInt;
        if(this.DelayTimeCntr<0) {
            this.DelayFlag = false;
            if(this.DelayFunc!=null)
                this.DelayFunc.call(this.DelayFuncContex);
        } else return;
    }

    this.Coeff += this.CoeffSpeed*Base.RealTimeInt;
    if(this.Coeff>=1)
        this.Coeff = 1;

    var coeff = this.Tween(this.Coeff);

    if(this.Coeff>=1) {

        coeff = 1;
        this.Val = this.Val0 + this.dVal*coeff;
        this.FuncUpdate.call(this.FuncUpdateContex,this.Val);

        if(this.KillFlag)
            this.kill();

        if(this.FuncEnd!=null)
            this.FuncEnd.call(this.FuncEndContex,this.FuncEndContex);
    } else {
        this.Val = this.Val0 + this.dVal*coeff;
        this.FuncUpdate.call(this.FuncUpdateContex,this.Val);
    }
};

//##################################
//##################################
//##################################


CPulser = function (threads) {
    this.Threads = threads;
    this.updateFlag = false;
};

CPulser.prototype.setPulsing = function(val0,val1,coeff,time,dir,tween,update,updateContex)
{
    this.KillFlag = false;
    this.NumFlag = false;
    this.DelayFlag = false;

  //  this.Val0 = val;
    this.FuncUpdate = update;
    this.FuncUpdateContex = updateContex;

    this.ValStart = val0;
    this.ValEnd = val1;
    this.Dir = dir;
    if(this.Dir>0) {
        this.dVal = this.ValEnd - this.ValStart;
        this.Val0 = this.ValStart; }
    else  {
        this.dVal = this.ValStart - this.ValEnd;
        this.Val0 = this.ValEnd;
    }

   // if(dir>0) this.Val_dest = this.ValEnd;
   // else  this.Val_dest = this.ValStart;
    //this.dVal = this.Val_dest - this.Val0;

    this.Coeff = coeff;
    this.CoeffSpeed = 1/time;

    this.Tween = this.getTweenFunc(tween);

    var coeff = this.Tween(this.Coeff);
    this.Val = this.Val0 + this.dVal*coeff;
    this.FuncUpdate.call(this.FuncUpdateContex,this.Val);

    if(!this.updateFlag) {
        this.Threads.addThread(this, this.update);
        this.updateFlag = true;
    }
    return this;
};

CPulser.prototype.setNum = function(num,fade,funcEnd,funcEndContex)
{
    this.NumFlag = true;
    this.KillFlag = true;
    this.FadeCoeff = fade;
    this.NumCntr = num;
    this.FuncEnd = funcEnd;
    this.FuncEndContex = funcEndContex;
};


CPulser.prototype.setDelay = function(delay,func,funcContex)
{
    this.DelayFunc = func;
    this.DelayFuncContex = funcContex;
    this.DelayTimeCntr = delay;
    this.DelayFlag = true;
};

CPulser.prototype.kill = function()
{
    if( this.updateFlag)
        this.Threads.removeThread(this,this.update);
    this.updateFlag = false;
};

CPulser.prototype.getTweenFunc = function(tween)
{
    switch(tween) {
        case 'line':
            return this.P2Linear;
            break;
        case 'p2out':
            return this.P2EasingOut;
            break;
        case 'p2in':
            return  this.P2EasingIn;
            break;
        case 'p2inout':
            return  this.P2EasingInOut;
            break;
        case 'p3out':
            return  this.P3EasingOut;
            break;
    }
    return this.P2Linear;
};

CPulser.prototype.P2Linear = function(k)
{
    return k;
};

CPulser.prototype.P2EasingOut = function(k)
{
    return k * ( 2 - k );
};

CTweener.prototype.P2EasingIn = function(k)
{
    return k * k;
};

CPulser.prototype.P2EasingInOut = function(k)
{
    if ((k *= 2) < 1) {
        return 0.5 * k * k;
    }

    return - 0.5 * (--k * (k - 2) - 1);
};

CPulser.prototype.P3EasingOut = function(k)
{
    return --k * k * k   +  1;
};

CPulser.prototype.update = function()
{
    if(this.DelayFlag) {
        this.DelayTimeCntr -= Base.RealTimeInt;
        if(this.DelayTimeCntr<0) {
            this.DelayFlag = false;
            if(this.DelayFunc!=null)
                this.DelayFunc.call(this.DelayFuncContex);
        } else return;
    }

    this.Coeff += this.CoeffSpeed*Base.RealTimeInt;
    if(this.Coeff>=1)
        this.Coeff = 1;

    var coeff = this.Tween(this.Coeff);

    if(this.Coeff>=1) {

        this.Coeff  = 0;
        this.Dir = -this.Dir;
        if(this.Dir>0) {
            this.dVal = this.ValEnd - this.ValStart;
            this.Val0 = this.ValStart;
        }
        else  {
            this.dVal = this.ValStart - this.ValEnd;
            this.Val0 = this.ValEnd;
        }

        this.Val = this.Val0 + this.dVal* this.Coeff;
        this.FuncUpdate.call(this.FuncUpdateContex,this.Val);

        if(this.NumFlag) {

            if(this.Dir>0) {

              /*  if(this.FadeCoeff!=0) {

                }*/

                this.NumCntr--;
                if(this.NumCntr<=0) {
                    if(this.KillFlag)
                        this.kill();

                    if(this.FuncEnd!=null)
                        this.FuncEnd.call(this.FuncEndContex);
                }
            }
        }

    } else {
        this.Val = this.Val0 + this.dVal*coeff;
        this.FuncUpdate.call(this.FuncUpdateContex,this.Val);
    }
};


//##################################
//##################################

CImgChanger = function () {
    this.FadeFlag = false;
    this.ScalingFlag = false;
    this.updateFlag = false;
    this.ActiveFlag = false;
};

CImgChanger.prototype.create = function(img,alpha,scale,ang,threads)
{
    this.FadeFlag = false;
    this.ScalingFlag = false;
    this.RotatingFlag = false;
    this.Threads = threads;
    this.Img = img;
    this.Alpha = 1;
    this.Scale = scale;
    this.Angle = 0;
    this.Aspect = 1;
    this.Img.alpha = this.Alpha;
    this.Img.rotation = this.Angle;
    this.Img.scale.set(this.Scale);
    if(this.updateFlag) this.kill();
    this.ActiveFlag = true;
};

CImgChanger.prototype.OnImgVisible = function()
{
    this.Img.visible = true;
};

CImgChanger.prototype.OffImgVisible = function()
{
    this.Img.visible = false;
};

CImgChanger.prototype.getTweenFunc = function(tween)
{
    switch(tween) {
        case 'line':
            return this.P2Linear;
            break;
        case 'p2out':
            return this.P2EasingOut;
            break;
        case 'p2in':
            return  this.P2EasingIn;
            break;
        case 'p2inout':
            return  this.P2EasingInOut;
            break;
        case 'bounceout':
            return  this.EasingElasticOut;
            break;
    }
    return this.P2Linear;
};

CImgChanger.prototype.EasingElasticOut = function(k)
{
    if (k === 0) {
        return 0;
    }

    if (k === 1) {
        return 1;
    }

    return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
};

CImgChanger.prototype.P2Linear = function(k)
{
    return k;
};

CImgChanger.prototype.P2EasingOut = function(k)
{
    return k * ( 2 - k );
};

CImgChanger.prototype.P2EasingIn = function(k)
{
    return k * k;
};

CImgChanger.prototype.P2EasingInOut = function(k)
{
    if ((k *= 2) < 1) {
        return 0.5 * k * k;
    }

    return - 0.5 * (--k * (k - 2) - 1);
};

CImgChanger.prototype.setRotation = function(add,time,kill,tween,loops,swing,func,funcContex)
{
    this.Angle0 = this.Angle;
    this.AngleDist = add;
    this.AngleCoeff = 0;
    this.AngleCoeffSpeed = 1.0/time;
    this.AngleKillFlag = kill;
    this.AngleFunc = func;
    this.AngleFuncContex = funcContex;
    this.RotateLoopsCntr = loops;  // if 0 - endless
    this.RotateSwingFlag = swing;
    this.AngleTweenFunc = this.getTweenFunc(tween);
    if(!this.updateFlag) {
        this.Threads.addThread(this, this.update);
        this.updateFlag = true;
    }
    this.RotatingFlag = true;
};

CImgChanger.prototype.updateRotate = function()
{
    this.AngleCoeff += this.AngleCoeffSpeed*Base.RealTimeInt;
    if(this.AngleCoeff>=1) {
        this.AngleCoeff = 1;
    }
    var coeff =  this.AngleCoeff;//this.AngleTweenFunc(this.AngleCoeff);
    this.Angle = this.Angle0 + this.AngleDist*coeff;

    this.Img.rotation = this.Angle;

    if(this.AngleCoeff>=1) {
        if(this.Angle>(2*Math.PI)) this.Angle-=2*Math.PI;
        if(this.Angle<0) this.Angle += 2*Math.PI;

        this.AngleCoeff = 0;
        this.Angle0 = this.Angle;

       /* if(this.RotateLoopsCntr<=0) {
            //endless
            this.AngleCoeff = 0;
            this.Angle0 = this.Angle;
            if(this.RotateSwingFlag)
                this.AngleDist = -this.AngleDist;
        }
        else
        {
            //counted loops
            this.RotateLoopsCntr--;
            if(this.RotateLoopsCntr<=0) {
                this.RotatingFlag = false;
                if(this.AngleKillFlag)  this.kill();
                if(this.AngleFunc!=null)
                    this.AngleFunc.call(this.AngleFuncContex);
            }
            else
            {
                this.AngleCoeff = 0;
                this.Angle0 = this.Angle;
                if(this.RotateSwingFlag)
                    this.AngleDist = -this.AngleDist;
            }
        } */
    }
};


CImgChanger.prototype.setScaling = function(dest,time,kill,func,funcContex)
{
    this.Scale0 = this.Scale;
    this.ScaleDist = dest - this.Scale0;
    this.ScaleCoeff = 0;
    this.ScaleCoeffSpeed = 1.0/time;
    this.ScaleKillFlag = kill;
    this.ScaleFunc = func;
    this.ScaleFuncContex = funcContex;
    this.ScalingFlag = true;
    this.ScaleTweenFunc = this.P2Linear;
    if(!this.updateFlag) {
        this.Threads.addThread(this, this.update);
        this.updateFlag = true;
    }
    return this;
};

CImgChanger.prototype.setTweenScaling = function(dest,time,tween,kill,func,funcContex) {
     this.setScaling(dest,time,kill,func,funcContex);
     this.ScaleTweenFunc = this.getTweenFunc(tween);
};

CImgChanger.prototype.setScale = function(scale)
{
     this.Scale = scale;
     this.Img.scale.set(this.Scale,this.Aspect*this.Scale);
};

CImgChanger.prototype.updateScaling = function()
{
    this.ScaleCoeff += this.ScaleCoeffSpeed*Base.RealTimeInt;
    if(this.ScaleCoeff>=1) {
        this.ScaleCoeff = 1;
    }
    var coeff = this.ScaleTweenFunc(this.ScaleCoeff);
    this.Scale = this.Scale0 + this.ScaleDist*coeff;

    this.Img.scale.set(this.Scale,this.Aspect*this.Scale);

    if(this.ScaleCoeff>=1) {
        this.ScalingFlag = false;
        if(this.ScaleKillFlag) {
            this.kill();
        }
        if(this.ScaleFunc!=null)
            this.ScaleFunc.call(this.ScaleFuncContex,this);
    }
};

CImgChanger.prototype.setAlpha = function(alpha)
{
    this.Alpha = alpha;
    this.Img.alpha = this.Alpha;
};

CImgChanger.prototype.setFading = function(dest,time,kill,func,funcContex)
{
    this.FadeDest = dest;
    this.FadeKillFlag = kill;
    this.FadeFunc = func;
    this.FadeFuncContex = funcContex;
    this.AlphaSpeed = (this.FadeDest-this.Alpha)/time;
    this.FadeFlag = true;
    if(!this.updateFlag) {
        this.Threads.addThread(this, this.update);
        this.updateFlag = true;
    }
};

CImgChanger.prototype.updateFade = function()
{
    this.Alpha += this.AlphaSpeed*Base.RealTimeInt;
    if((this.Alpha>=this.FadeDest && this.AlphaSpeed>0) ||
        (this.Alpha<=this.FadeDest && this.AlphaSpeed<0)) {
        this.Alpha = this.FadeDest;
        this.Img.alpha = this.Alpha;
        this.FadeFlag = false;

        if(this.FadeKillFlag)
            this.kill();

        if(this.FadeFunc!=null)
            this.FadeFunc.call(this.FadeFuncContex,this);
        return;
    }
    this.Img.alpha = this.Alpha;
};


CImgChanger.prototype.kill = function()
{
    if( this.updateFlag)
       this.Threads.removeThread(this,this.update);
    this.updateFlag = false;
};

CImgChanger.prototype.killImg = function()
{
    this.Img.kill();
    this.ActiveFlag = false;
};

CImgChanger.prototype.killAll = function()
{
    if(!this.ActiveFlag)  return;
    this.kill();
    this.killImg();
    this.ActiveFlag = false;
};

CImgChanger.prototype.Drag = function(x,y)
{
    this.Img.x = x;
    this.Img.y = y;
};

CImgChanger.prototype.update = function()
{
    if(this.RotatingFlag)
        this.updateRotate();

   if(this.FadeFlag)
     this.updateFade();

    if(this.ScalingFlag)
        this.updateScaling();
};

//############################################################
//############################################################
//############################################################

CImagesNum = function (papa) {
    this.Papa = papa;
    this.Imgs = [];
    this.Widths = [];
    this.Heights = [];
    this.ActiveFlag = false;
};

CImagesNum.prototype.clear = function()
{
    this.HideFlag = false;
    this.ImgsNum = 0;
    for(var i=0;i<this.Imgs.length;i++) {
        if (this.Imgs[i].Img != null) {
            this.Imgs[i].Img.kill();
            this.Imgs[i].Img = null;
        }
    }
};

CImagesNum.prototype.create = function(x,y,num,first,atlas,frames,group,
                                       align,lefts,shifts,marg,scale,tint,order)
{
    this.clear();

    for(var i=0;i<frames.length;i++)
    {
        var frameData = this.Papa.cache.getFrameData(atlas);
        this.Widths[i] = frameData.getFrameByName(frames[i]).width;
        this.Heights[i] = frameData.getFrameByName(frames[i]).height;
    }

    this.FirstSymb = first;
   // this.ShiftX = sx;
   // this.ShiftY = sy;
    this.Lefts = lefts; // array of x shifts for one, two.. digits
    this.Frames = frames;
    this.Atlas = atlas;
    this.Align = align;
    this.Marg = marg;
    this.ScaleX = scale;
    this.ScaleY = scale;
    this.Group = group;
    this.Tint = tint;
    this.Order = order;
    this.Shifts = shifts;
   this.Group.alive = true;
   this.Group.visible = true;
   this.Group.scale.set(scale);
    this.setNum(num);
    this.Drag(x,y);
    this.ActiveFlag = true;
};

CImagesNum.prototype.Revive = function()
{
    this.setNum(this.Number);
};

CImagesNum.prototype.Hide = function(hide)
{
    if(hide)
    {
        this.Group.visible = false;
       // for(var i=0;i<this.SlotsNum;i++)
         //   this.Imgs[i].Img.visible = false;
    }
    else
    {
        this.Group.visible = true;
      //  for(i=0;i<this.SlotsNum;i++)
        //    this.Imgs[i].Img.visible = true;
    }
};

CImagesNum.prototype.setTint = function(tint)
{
    this.Tint = tint;
     for(var i=0;i<this.SlotsNum;i++)
        this.Imgs[i].Img.tint = tint;
};


CImagesNum.prototype.addImgObj = function(sx,sy,num,slot)
{
    if(this.Imgs[slot]==undefined)
        this.Imgs[slot] = {Num:0,Sx0:0,Sy0:0,Sx:0,Sy:0,ScaleX:1,ScaleY:1,Img:null,HideFlag:false};

    if( this.Imgs[slot].Img==null)
    {
        // x,y,tex,frameName,group,order
        this.Imgs[slot].Img = this.Papa.getZeroImg(0,0,this.Atlas,this.Frames[num],this.Group,this.Order);
    }
    else
    {
        this.Imgs[slot].Img.x = 0;
        this.Imgs[slot].Img.y = 0;
        this.Imgs[slot].Img.frameName = this.Frames[num];
        this.Imgs[slot].Img.revive();
    }
    this.Imgs[slot].Img.x = sx;
    this.Imgs[slot].Img.y = sy;
    this.Imgs[slot].Num = num;
    this.Imgs[slot].Sx0 = sx;
    this.Imgs[slot].Sy0 = sy;
    this.Imgs[slot].Sx = sx;//*this.ScaleX;
    this.Imgs[slot].Sy = sy;//*this.ScaleY;
    this.Imgs[slot].HideFlag = false;
    return this.Imgs[slot];
};

CImagesNum.prototype.kill = function( )
{
    if(!this.ActiveFlag)  return;
    this.clear();
    this.Group.alive = false;
    this.ActiveFlag = false;
};

CImagesNum.prototype.DragUpdate = function()
{
    this.Drag(this.Xc,this.Yc);
};

CImagesNum.prototype.Drag = function(x,y)
{
    this.Xc = x;
    this.Yc = y;
    this.Group.x = this.Xc;
    this.Group.y = this.Yc;
   /* for(var i=0;i<this.SlotsNum;i++)
    {
        this.Imgs[i].Img.x =  this.Imgs[i].Sx;
        this.Imgs[i].Img.y =  this.Imgs[i].Sy;
    }*/
};

CImagesNum.prototype.setAlpha = function(alpha)
{
    this.Group.alpha = alpha;
   // for(var i=0;i<this.SlotsNum;i++)
    //    this.Imgs[i].Img.alpha = alpha;
};

CImagesNum.prototype.setScale = function(scalex,scaley)
{
    this.ScaleX = scalex;
    this.ScaleY = scaley;
    this.Group.scale.set(this.ScaleX,this.ScaleY);
  /*  for(var i=0;i<this.SlotsNum;i++)
    {
        this.Imgs[i].Sx = this.Imgs[i].Sx0*this.ScaleX;
        this.Imgs[i].Sy = this.Imgs[i].Sy0*this.ScaleY;
        this.Imgs[i].Img.x = this.Xc +  this.Imgs[i].Sx;
        this.Imgs[i].Img.y = this.Yc +  this.Imgs[i].Sy;
        this.Imgs[i].Img.scale.set(this.ScaleX,this.ScaleY);
    } */
};

CImagesNum.prototype.setNum = function(number)
{
    this.Number = number;
    var div = 1000000;
    var cntr = 7;
    var val = number;
    var num = 0;
    var flag = false;
    var w = 0;
    var slot = 0;
    var last = -1;
    var shift = 0;

    if(this.FirstSymb>=0 )  {
        num = this.FirstSymb;
        var pic =  this.addImgObj(w+shift,0,num,slot);
       // pic.Img.scale.setTo(this.ScaleX,this.ScaleY);
        pic.Img.anchor.set(0,0.5);
        pic.Img.alpha = 1;
        pic.Img.tint = this.Tint;
        w += this.Widths[num] + this.Marg;
        pic.HideFlag = false;
        slot++;
    }

    while(cntr>0)
    {
        num =  Math.floor(val/div);

        if(flag)
        {
            //var pic = this.Base.MakeImg(this.Xc+w,this.Yc,atlas,names[num]);
            shift = 0; if(this.Shifts!=null && last>=0)  shift = this.Shifts[last][num];
            var pic =  this.addImgObj(w+shift,0,num,slot);
            //   pic.Sx = w; pic.Sy = 0;
          //  pic.Img.scale.setTo(this.ScaleX,this.ScaleY);
            pic.Img.anchor.set(0,0.5);
            pic.Img.alpha = 1;
            pic.Img.tint = this.Tint;
            //  w += pic.Img.width + this.Marg + shift;
            w += this.Widths[num] + this.Marg + shift;
            pic.HideFlag = false;
            slot++;
        }
        else
        {
            if(num>0)
            {
                //  pic = this.Base.MakeImg(this.Xc+w,this.Yc,atlas,names[num]);
                shift = 0; if(this.Shifts!=null && last>=0)  shift = this.Shifts[last][num];
                pic =  this.addImgObj(w+shift,0,num,slot);
                //  pic.Sx = w; pic.Sy = 0;
              //  pic.Img.scale.setTo(this.ScaleX,this.ScaleY);
                pic.Img.anchor.set(0,0.5);
                pic.Img.alpha = 1;
                pic.Img.tint = this.Tint;
                //w += pic.Img.width + this.Marg + shift;
                w += this.Widths[num] + this.Marg + shift;
                flag = true;
                pic.HideFlag = false;
                slot++;
            }
        }

        val -= num*div;
        div /= 10;
        cntr--;
        if(cntr<=0) {
            if(slot==0) {
                //pic = this.Base.MakeImg(this.Xc + w, this.Yc, atlas, names[0]);
                shift = 0; if(this.Shifts!=null && last>=0)  shift = this.Shifts[last][num];//*this.Scale;
                pic =  this.addImgObj(w+shift,0,0,slot);
                //  pic.Sx = w; pic.Sy = 0;
           //     pic.Img.scale.setTo(this.ScaleX,this.ScaleY);
                pic.Img.anchor.set(0,0.5);
                pic.Img.alpha = 1;
                pic.Img.tint = this.Tint;
                w += this.Widths[num] + this.Marg + shift;
                // w += pic.Img.width + shift;
                pic.HideFlag = false;
                slot++;
            }
        }
        last = num;
    }

    this.SlotsNum = slot;

    // clear left imgs
    for(var i=slot;i<this.Imgs.length;i++) {
        if(this.Imgs[i].Img!=null)
        {
            this.Imgs[i].Img.visible = false;
            this.Imgs[i].HideFlag = true;
        }
    }

    switch(this.Align)
    {
        case 0: // center
            for(i=0;i<this.SlotsNum;i++) {
                this.Imgs[i].Sx0 -= w / 2;
                this.Imgs[i].Sy0 = 0;//this.Heights[this.Imgs[i].Num];

            }
            break;
        case 1: // left orient
            if(this.Lefts!=null)
            {
                for(i=0;i<this.SlotsNum;i++) {
                    this.Imgs[i].Sx0 -= this.Lefts[slot-1];
                }
            }
            break;
        case 2:
            if(this.SlotsNum==1)
            {
                for(i=0;i<this.SlotsNum;i++)
                    this.Imgs[i].Sx0 -= w/2;
            }
            else
            {
                if(this.Lefts!=null)
                {
                    for(i=0;i<this.SlotsNum;i++) {
                        this.Imgs[i].Sx0 -= this.Lefts[slot-1];
                    }
                }
            }
            break;
    }

     for(i=0;i<this.SlotsNum;i++) {
         this.Imgs[i].Sx = this.Imgs[i].Sx0;//*this.ScaleX;
         this.Imgs[i].Sy = this.Imgs[i].Sy0;//*this.ScaleY;
         this.Imgs[i].Img.x = this.Imgs[i].Sx;
         this.Imgs[i].Img.y = this.Imgs[i].Sy;
     }

    this.setTint(this.Tint);

    this.DragUpdate();
    return w;
};

//############################################
//############################################
//############################################

CExplGlow = function (papa,thread) {
    this.Papa = papa;
    this.Threads = thread;
    this.dT = 1.0/Base.UPS;//this.Papa.game.time.physicsElapsed;
    this.ActiveFlag = false;
};

CExplGlow.prototype.create = function(x,y,scale0,scale1,life,fade,alpha,atlas,imgStr,group)
{
    //clear
    this.dT = Base.RealTimeInt;
    if(this.dT<0.05) this.dT = 0.05;

    this.Angle = 0;

    this.Alpha = alpha;
    this.AlphaSpeedAddFade = this.dT*(this.Alpha)/fade;

    this.TimeLife = life;
    this.TimeCntr = 0;

    this.Scale = scale0;
    this.ScaleDest = scale1;
    this.ScaleAdd  =  (this.ScaleDest - this.Scale)*this.dT/(life+fade);

    this.X = x;
    this.Y = y;
    this.Img =  this.Papa.getImg(x,y,atlas,imgStr,group,0);
    this.Img.alpha = this.Alpha;
    this.Img.anchor.set( 0.5);
    this.Img.rotation = this.Angle;
    this.Img.scale.set(this.Scale);

    this.Threads.addThread(this,this.update);

    this.ActiveFlag = true;
};

CExplGlow.prototype.setAngle  = function(ang)
{
    this.Angle = ang;
    this.Img.rotation = this.Angle;
}

CExplGlow.prototype.setAnchor  = function(ax,ay) {
    this.Img.anchor.set(ax, ay);
}

CExplGlow.prototype.setScreenSplash  = function(x,y,w,h,life,fade,alpha,atlas,imgStr,group)
{
    this.ScaleAdd = 0;

    this.dT = Base.RealTimeInt;
    if(this.dT<0.05) this.dT = 0.05;

    this.Alpha = alpha;
    this.AlphaSpeedAddFade = this.dT*(this.Alpha)/fade;

    this.TimeLife = life;
    this.TimeCntr = 0;

    this.X = x;
    this.Y = y;
    this.Img =  this.Papa.getZeroImg(x,y,atlas,imgStr,group,0);// group.getFirstDead(false,x,y,'fx',imgStr);
    //this.Papa.getImg(x,y,group,null,order,Shifter.DustImgs[type]);
    //   this.Img.x = this.X;
    //  this.Img.y = this.Y;
    this.Img.alpha = this.Alpha;
    this.Img.anchor.set( 0.5);
    this.Img.width = w;
    this.Img.height = h;

    this.Threads.addThread(this,this.update);

    this.ActiveFlag = true;
};

CExplGlow.prototype.Kill = function()
{
    if(!this.ActiveFlag) return;
    this.Img.kill();
    this.Threads.removeThread(this,this.update);
    this.ActiveFlag = false;
};

CExplGlow.prototype.update = function()
{
    if(this.ScaleAdd!=0)
    {
        this.Scale +=  this.ScaleAdd;
        this.Img.scale.set(this.Scale);
    }

    if((this.TimeCntr += this.dT)>this.TimeLife)
    {
        this.Alpha -= this.AlphaSpeedAddFade;
        if(this.Alpha<0) {
             this.Kill();
             return;
        }
        this.Img.alpha = this.Alpha;
    }
};

//###############################################
//###############################################
//###############################################

CDustParticle = function (papa,thread) {
    this.Papa = papa;
    this.Threads = thread;
    this.dT = 1.0/Base.UPS;//this.Papa.game.time.physicsElapsed;
    this.ActiveFlag = false;
};

CDustParticle.prototype.create = function(x,y,type,time,speedx,speedy,group,alpha)
{
    //clear
    this.dT = Base.RealTimeInt;
    if(this.dT<0.05) this.dT = 0.05;
    this.Def = Base.Dusts[type];

    this.SpeedCoeffMin =  this.Def.speedMin;
    this.ScaleDie =  this.Def.scaleDie;
    this.Alpha = alpha;
    this.TimeLifeCntr = time;
    this.TimeFade = this.Def.timeFade;
    this.AlphaSpeedAddFade = (1.0/this.TimeFade)*this.dT;

    this.TimeCntr = 0;
    this.TimeCoeff = 0;

    //  this.TimeCntr += this.dT;
    this.SpeedCoeff = 1;
    this.SpeedCoeffSpeed = 1.0/(this.TimeFade+time);

    this.Duration = time;

    this.Scale =  this.Def.scale0 + this.Def.scaleRnd*Math.random();
    this.ScaleAdd  = this.dT*(1-this.ScaleDie)/this.TimeFade;

    this.X = x;
    this.Y = y;

    this.SpeedXAdd = speedx*this.dT;
    this.SpeedYAdd = speedy*this.dT;

    this.Img =  this.Papa.getImg(x,y,this.Def.atlas, this.Def.img,group,0);
    //this.Papa.getImg(x,y,group,null,order,Shifter.DustImgs[type]);
    this.Img.alpha = this.Alpha;
    this.Img.anchor.set(0.5);
    this.Img.scale.set(this.Scale);

    this.Threads.addThread(this,this.update);

    this.ActiveFlag = true;
};

CDustParticle.prototype.Kill = function()
{
    if(!this.ActiveFlag) return;
    this.Img.kill();
    this.Threads.removeThread(this,this.update);
    this.ActiveFlag = false;
};

CDustParticle.prototype.update = function()
{
    this.X +=  this.SpeedXAdd*this.SpeedCoeff;
    this.Y +=  this.SpeedYAdd*this.SpeedCoeff;
    this.Img.x = this.X;
    this.Img.y = this.Y;

    this.SpeedCoeff -= this.SpeedCoeffSpeed*Base.RealTimeInt;
    if( this.SpeedCoeff<0)  this.SpeedCoeff = 0;

    if((this.TimeLifeCntr -= this.dT)<0)
    {
        this.Scale -=  this.ScaleAdd;
        this.Img.scale.set(this.Scale);
        if(this.Scale<this.ScaleDie)
        {
            this.Kill();
        }
       // this.Alpha -=  this.AlphaSpeedAddFade;
       // if(this.Alpha<0)  this.Alpha = 0;
       // this.Img.alpha = this.Alpha;
    }
    else
    {
        /* this.Alpha +=  this.AlphaSpeedAdd;
         if(this.Alpha>this.AlphaDest)
         {
         this.Alpha = this.AlphaDest;
         this.Img.alpha = this.Alpha;
         }*/
    }
};

//######################################################
//######################################################
//######################################################

CExplParticle = function (papa,thread) {
    this.Papa = papa;
    this.Threads = thread;
    this.dT = 1.0/Base.UPS;//this.Papa.game.time.physicsElapsed;
    this.ActiveFlag = false;
};

CExplParticle.prototype.create = function(x,y,pic,type,rise,life,scale,speedx,speedy,ang,rot,color,group)
{
    //clear
    this.RotateSpeed = rot;
    this.Angle = ang;

    this.dT = Base.RealTimeInt;
    if(this.dT<0.05) this.dT = 0.05;
    this.Def = Base.Dusts[type];

    this.Scale0 = scale;
    this.SpeedCoeffMin =  this.Def.speedMin;
    this.ScaleDie =  this.Scale0*this.Def.scaleDie;
    this.Alpha = 1;
    this.TimeLifeCntr = life;
    this.TimeFade = this.Def.timeFade;
    this.AlphaSpeedAddFade = (1.0/this.TimeFade)*this.dT;

    this.TimeCntr = 0;
    this.TimeCoeff = 0;

    //  this.TimeCntr += this.dT;
    this.SpeedCoeff = 1;

    this.Duration = rise;////this.Def.timeMove + this.Def.timeMoveRnd*Math.random() + this.TimeFade;

    this.Scale = this.Scale0*(this.Def.scale0 + this.Def.scaleRnd*Math.random());
    this.ScaleSpeed = (1-this.ScaleDie)/this.TimeFade;

    this.X = x;
    this.Y = y;

    this.SpeedX = speedx;
    this.SpeedY = speedy;
    this.SpeedXAdd = speedx*this.dT;
    this.SpeedYAdd = speedy*this.dT;

    this.SpeedGravity = 0;

    var imgStr = pic;
    if(pic==null) imgStr = this.Def.img;
    this.Img =  this.Papa.getImg(x,y, this.Def.atlas, imgStr,group,0);
    //this.Papa.getImg(x,y,group,null,order,Shifter.DustImgs[type]);
    this.Img.x = this.X;
    this.Img.y = this.Y;
    this.Img.alpha = this.Alpha;
    this.Img.anchor.set(0.5);
    this.Img.rotation = this.Angle;
    this.Img.scale.set(this.Scale);
    this.Img.tint = color;

    this.Threads.addThread(this,this.update);
    this.ActiveFlag = true;
};

CExplParticle.prototype.setGravity = function(speed)
{
    this.SpeedGravity = speed;
};

CExplParticle.prototype.Kill = function()
{
    if(!this.ActiveFlag) return;
    this.Img.kill();
    this.Threads.removeThread(this,this.update);
    this.ActiveFlag = false;
};

CExplParticle.prototype.update = function()
{
    this.X +=  this.SpeedX*this.SpeedCoeff*Base.RealTimeInt;
    this.Y +=  this.SpeedY*this.SpeedCoeff*Base.RealTimeInt;
    this.Y += this.SpeedGravity*Base.RealTimeInt;
    this.Img.x = this.X;
    this.Img.y = this.Y;

    this.Angle += this.RotateSpeed*Base.RealTimeInt;
    this.Img.rotation = this.Angle;

    //return k * ( 2 - k ); easing out
    this.TimeCntr+=Base.RealTimeInt;
    var elapsed = this.TimeCntr/this.Duration;
    //elapsed = elapsed > 1 ? 1 : elapsed;
    if(elapsed>1) elapsed = 1;
    this.SpeedCoeff = (1 - elapsed)*(1 - elapsed);//*(2-elapsed);
    if(this.SpeedCoeff<this.SpeedCoeffMin) this.SpeedCoeff = this.SpeedCoeffMin;

    if((this.TimeLifeCntr -= Base.RealTimeInt)<0)
    {
        this.Scale -=  this.ScaleSpeed*Base.RealTimeInt;
        this.Img.scale.set(this.Scale);
        if(this.Scale<this.ScaleDie)
        {
            this.Kill();
        }
        // this.Alpha -=  this.AlphaSpeedAddFade;
        // if(this.Alpha<0)  this.Alpha = 0;
        //  this.Img.alpha = this.Alpha;
    }
    else
    {
        /* this.Alpha +=  this.AlphaSpeedAdd;
         if(this.Alpha>this.AlphaDest)
         {
         this.Alpha = this.AlphaDest;
         this.Img.alpha = this.Alpha;
         }*/
    }

};


//########################################################
CPopUp = function (papa,group,threads) {

    this.Papa = papa;
    this.Group = group;
    this.Threads = threads;
    this.AllParams = [];
    var params = {dist:50,life:1,rise:0.1,stay:0.75,fade:0.25}; // score up
    this.AllParams.push(params);
    params = {dist:50,life:1.5,rise:0.2,stay:1,fade:0.3}; // ghost
    this.AllParams.push(params);
};

CPopUp.prototype.clear = function()
{
    this.Alpha = 0;
    this.Scale = 1;
    this.Time = 0;
    this.TimeCoeff = 0;
    this.DistUp = 0;
    this.DistMaxDest = 0;
    this.DistMaxUpFlag = false;
    this.FadeFlag = false;
};

CPopUp.prototype.create = function(x,y,type,imgStr,pause,func,funcContex)
{
    this.clear();
    this.Type = type;
    this.Func = func;
    this.FuncContex = funcContex;
    this.Params =  this.AllParams[this.Type];
    this.PauseTimeCntr = pause;

    this.Y0 = y;
    this.Xc = x;
    this.Yc = y;
    this.Img = this.Papa.getImg(0,0,'atlas',imgStr,this.Group,0);
    this.Img.x = x;
    this.Img.y = this.Y0 - this.DistUp;
    this.Img.alpha = this.Alpha;
    this.Img.rotation = 0;
    this.Img.scale.set(this.Scale);
    this.Img.anchor.set(0.5);

    this.TimeDuration = this.Params.life;
    this.DistMax = this.Params.dist;

    this.AlphaSpeed = 1.0/this.Params.rise;
    this.updateAlpha = this.updateAlpha0;

    this.Threads.addThread(this,this.update);

    this.ActiveFlag = true;
};

CPopUp.prototype.setShortUp = function(add,time)
{
    if(this.DistMaxUpFlag) {
        this.DistMaxDest += add;
        return;
    }
    this.DistMaxDest = this.DistMax + add;
    this.DistMaxSpeed = (this.DistMaxDest-this.DistMax)/time;
    this.DistMaxUpFlag = true;
};

CPopUp.prototype.kill = function()
{
    if(!this.ActiveFlag) return;
    this.Threads.removeThread(this,this.update);
    this.Img.kill();
    this.ActiveFlag = false;
};

CPopUp.prototype.updateAlpha0 = function()
{
    this.Alpha += this.AlphaSpeed*Base.RealTimeInt;
    if(this.Alpha>=1)
    {
        this.Alpha = 1;
        this.StayTimeCntr = this.Params.stay;
        this.updateAlpha = this.updateAlpha1;
    }
    this.Img.alpha = this.Alpha;
};

CPopUp.prototype.updateAlpha1 = function()
{
    this.StayTimeCntr-=Base.RealTimeInt;
    if(this.StayTimeCntr<=0)
    {
        this.updateAlpha = this.updateAlpha2;
        this.AlphaSpeed = 1.0/this.Params.fade;
        this.FadeFlag = true;
    }
};

CPopUp.prototype.updateAlpha2 = function()
{
    this.Alpha -= this.AlphaSpeed*Base.RealTimeInt;
    if(this.Alpha<=0)
    {
        this.Alpha = 0;
        this.kill();
        if(this.Func!=null)  this.Func.call(this.FuncContex);
    }
    else
        this.Img.alpha = this.Alpha;
};

CPopUp.prototype.update = function()
{
    this.PauseTimeCntr-=Base.RealTimeInt;
    if(this.PauseTimeCntr>0) return;

    this.Time += Base.RealTimeInt;
    this.TimeCoeff =  this.Time/this.TimeDuration;
    this.TimeCoeff = this.TimeCoeff > 1 ? 1 : this.TimeCoeff;

    this.TimeCoeff = this.TimeCoeff * ( 2 - this.TimeCoeff);

    if(this.DistMaxUpFlag)
    {
        this.DistMax +=  this.DistMaxSpeed*Base.RealTimeInt;
        if( this.DistMax>=this.DistMaxDest)
        {
            this.DistMax = this.DistMaxDest;
            this.DistMaxUpFlag = false;
        }
    }

    this.DistUp = this.DistMax*this.TimeCoeff;
    this.Yc = this.Y0 - this.DistUp;
    this.Img.y =  this.Yc;

    this.updateAlpha.call(this);
};

//####################################################################
//####################################################################
//####################################################################

CImgGroup = function (game,papa,threads) {

    Phaser.Group.call(this,game,null);

    this.Papa = papa; // CGame
    this.x = 0;
    this.y = 0;
    this.game = game;
    this.Imgs = [];
    this.ImgsNum = 0;

    this.Threads = threads;
    this.ActiveFlag = false;

};

CImgGroup.prototype = Object.create(Phaser.Group.prototype);
CImgGroup.prototype.constructor = CImgGroup;

CImgGroup.prototype.clear = function() {
    this.ScalingFlag = false;
    this.Scale = 1;
    this.ImgsNum = 0;
};

CImgGroup.prototype.create = function(x,y,dy,ang,scale) {

    this.clear();
    this.x = x;
    this.y = y;
    this.angle = ang;
    this.rotation = ang;
    this.Scale = scale;
    this.scale.set(scale);

    this.ActiveFlag = true;
};

CImgGroup.prototype.setAngle = function(ang)
{
    this.angle = ang;
    this.rotation = ang;
    this.update();
};

CImgGroup.prototype.addImgObj = function(x,y,tex,frameName,order,scale,ang)
{
    var img = this.addImg(x,y,tex,frameName,order);

    img.anchor.set(0.5);
    img.alpha = 1;

    var slot = this.ImgsNum;
    if(this.Imgs[slot]==undefined)
        this.Imgs[slot] = {Sx:0,Sy:0,Scale:scale,Img:null};

    this.Imgs[slot].Img = img;
    this.Imgs[slot].Sx = x;
    this.Imgs[slot].Sy = y;
    this.Imgs[slot].Scale = scale;
    this.Imgs[slot].Angle = ang;

    this.Imgs[slot].Img.scale.set(this.Imgs[slot].Scale);
    this.Imgs[slot].Img.rotation =  this.Imgs[slot].Angle;

    this.ImgsNum++;
    return this.Imgs[slot];
};

CImgGroup.prototype.setScale = function(scale) {

    this.Scale = scale;
    this.scale.set(this.Scale);

    /*  this.Number.setScale(this.NumberScale*this.Scale,this.NumberScale*this.Scale);

     for(var i=0;i<this.ImgsNum;i++)
     this.Imgs[i].Img.scale.set( this.Imgs[i].Scale*this.Scale);*/
};

CImgGroup.prototype.setScaling = function(dest,time,hide) {

    this.ScaleDest = dest;
    this.ScaleSpeed = (this.ScaleDest-this.Scale)/time;
    this.ScalingHideFlag = hide;
    if(this.ScalingFlag==false)  this.Threads.addThread(this,this.scalingUpdate);
    this.ScalingFlag = true;
};

CImgGroup.prototype.scalingUpdate = function() {
    if(this.ScalingFlag)
    {
        this.Scale += this.ScaleSpeed*Backet.RealTimeInt;
        if((this.Scale>this.ScaleDest && this.ScaleSpeed>0) ||
            (this.Scale<this.ScaleDest && this.ScaleSpeed<0))
        {
            this.Scale = this.ScaleDest;
            if(this.ScalingHideFlag)
                this.Hide(true);
            this.ScalingFlag = false;
            this.Threads.removeThread(this,this.scalingUpdate);
        }
        this.setScale(this.Scale);
    }
};

CImgGroup.prototype.kill = function() {
    if(!this.ActiveFlag)  return;

    for (var i = 0; i < this.children.length; i++)
    {
        if (this.children[i].alive)
            this.children[i].kill();
    }
    if(this.ScalingFlag)
        this.Threads.removeThread(this,this.scalingUpdate);
    this.ImgsNum = 0;
    this.ActiveFlag = true;
};

CImgGroup.prototype.Hide = function(hide) {
    this.Number.Hide(hide);
    if(hide)
    {
        for (var i = 0; i < this.children.length; i++)
        {
            if (this.children[i].visible)
                this.children[i].visible = false;
        }
    }
    else
    {
        for (i = 0; i < this.children.length; i++)
        {
            if (this.children[i].alive)
                this.children[i].visible = true;
        }
    }
};


CImgGroup.prototype.addImg = function(x,y,tex,frameName) {
    var img = null;
    for (var i = 0; i < this.children.length; i++)
    {
        if (this.children[i].alive === false &&
            (this.children[i] instanceof Phaser.Image) &&
            (this.children[i].type==Phaser.IMAGE) &&
            (this.children[i].key===tex))
        {
            img = this.children[i];
            break;
        }
    }

    if (img == null) {
        img = this.game.make.image(x, y, tex, frameName);
        this.add(img);
    }
    else {
        img.revive();
        img.x = x;
        img.y = y;
        if(frameName!=null)
            img.frameName = frameName;
    }

    img.Order = 0;
    //  group.sort('Order',-1);
    return img;
};


//#####################################################################
//#####################################################################


//########################################################
CTextPopUp = function (papa,threads) {

    this.Papa = papa;
//    this.Group = group;
    this.Threads = threads;
    this.AllParams = [];
    this.AllParams.push({dist:80,timeup:0.6,rise:0.1,stay:0.5,fade:0.25,
        scale:{scale:0.3,scaleRise:1,rise:0.25,scaleFade:0.1,fade:0.4}});
    this.AllParams.push({dist:40,timeup:2,rise:0.1,stay:1.5,fade:0.5});
    this.AllParams.push({dist:40,timeup:1.4,rise:0.1,stay:1,fade:0.3,
        scale:{scale:0,scaleRise:1,rise:0.25,fade:0.2}}); // level Done
    this.AllParams.push({dist:40,timeup:1,rise:0.1}); // score moved to
};

CTextPopUp.prototype.clear = function()
{
    this.Alpha = 0;
    this.Scale = 1;
    this.Time = 0;
    this.TimeCoeff = 0;
    this.DistUp = 0;
    this.DistMaxDest = 0;
    this.DistMaxUpFlag = false;
    this.FadeFlag = false;
};

CTextPopUp.prototype.init = function(text)
{
    this.Text = text;
    this.Text.visible = false;
   // this.Text.alive = false;
};

CTextPopUp.prototype.create = function(x,y,type,str,scale,color)
{
    this.clear();
    this.Type = type;
    this.Params =  this.AllParams[this.Type];
    this.PauseTimeCntr = 0;

    this.UpFlag  = false;
    this.ScalingFlag = false;
    this.MoveDestFlag = false;
    this.FadeFlag = false;

    this.FuncEnd = null;
    this.FuncEndContex = null;

    this.Y0 = y;
    this.Xc = x;
    this.Yc = y;
    this.Text.x = x;
    this.Text.y = this.Y0 - this.DistUp;
    this.Text.alpha = this.Alpha;
    this.Text.rotation = 0;
    this.Scale = scale;
    this.Text.scale.set(this.Scale);
    this.Text.tint = color;
    this.Text.anchor.set(0.5);
    this.Text.visible = true;
  //  this.Text.alive = true;
    this.Text.setText(str);
   // if(w_max>0) this.setWidthMax(w_max);

    //this.Params.rise + this.Params.stay + this.Params.fade;
    this.DistMax = this.Params.dist;
    if(this.DistMax!=undefined && this.DistMax!=0) {
        this.TimeDuration = this.Params.timeup;
        this.UpFlag  = true;
    }

    if(this.Params.rise!=undefined) {
        this.FadeFlag = true;
        this.AlphaSpeed = 1.0/this.Params.rise;
        this.updateAlpha = this.updateAlpha0;
    }

    if(this.Params.scale!=undefined)
      this.setScalingUp(this.Params.scale);

    if(!this.ActiveFlag )
        this.Threads.addThread(this,this.update);

    this.ActiveFlag = true;
};

CTextPopUp.prototype.setFuncEnd = function(func,funcContex)
{
    this.FuncEnd = func;
    this.FuncEndContex = funcContex;
};

CTextPopUp.prototype.setMoveDest = function(x,y,time,delay)
{
    this.Xc_dest = x;
    this.Yc_dest = y;
    this.MoveTimeCntr = 0;
    this.MoveDelayCntr = delay;
    this.MoveDelayFlag = true;
    this.MoveTime = time;
    this.MoveDestFlag = true;
};

CTextPopUp.prototype.updateMoveDest = function()
{
    if(this.MoveDelayFlag) {
        this.MoveDelayCntr -= Base.RealTimeInt;
        if(this.MoveDelayCntr<0) {
            this.DistDestX = this.Xc_dest - this.Xc;
            this.DistDestY = this.Yc_dest - this.Yc;
            this.MoveDelayFlag = false;
        } else  return;
    }
    this.MoveTimeCntr += Base.RealTimeInt;
    var coeff = this.MoveTimeCntr/this.MoveTime;
    coeff = coeff*coeff;
    if(coeff>1) coeff = 1;

    this.Xc = this.Xc_dest - this.DistDestX*(1-coeff);
    this.Yc = this.Yc_dest - this.DistDestY*(1-coeff);

    this.Text.x =  this.Xc;
    this.Text.y =  this.Yc;

    if(!this.FadeFlag) {
        if((this.MoveTime-this.MoveTimeCntr)<0.1)
            this.setFadeOut(0.1);
    }
};

CTextPopUp.prototype.setScale = function(scale) {
    this.Scale = scale;
    this.Text.scale.set(this.Scale);
};

CTextPopUp.prototype.setScalingUp = function(params) {
    this.ScaleParams = params;
    if(this.ScaleParams.scale!=undefined)
       this.setScale(this.ScaleParams.scale);

    if(this.ScaleParams.scaleRise!=undefined) {
        this.ScaleDest = this.ScaleParams.scaleRise;
        this.ScaleSpeed = (this.ScaleDest - this.Scale)/this.ScaleParams.rise;
        this.ScalingFlag = true;
        this.updateScaling =  this.updateScalingRise;
    }
};

CTextPopUp.prototype.setScalingDown = function(params) {
    this.ScaleParams = params;

    if(this.ScaleParams.fade!=undefined) {
        this.ScaleDest = this.ScaleParams.scaleFade;
        this.ScaleSpeed = (this.ScaleDest - this.Scale)/this.ScaleParams.fade;
        this.ScalingFlag = true;
        this.updateScaling =  this.updateScalingDown;
    }
};

CTextPopUp.prototype.updateScalingRise = function() {
    this.Scale += this.ScaleSpeed*Base.RealTimeInt;
    if(this.Scale>=this.ScaleDest) {
        this.Scale = this.ScaleDest;
        this.ScalingFlag = false;
    }
    this.setScale(this.Scale);
};

CTextPopUp.prototype.updateScalingDown = function() {
    this.Scale += this.ScaleSpeed*Base.RealTimeInt;
    if(this.Scale<=this.ScaleDest) {
        this.Scale = this.ScaleDest;
        this.ScalingFlag = false;
    }
    this.setScale(this.Scale);
};

CTextPopUp.prototype.updateScalingFade = function() {
    this.Scale += this.ScaleSpeed*Base.RealTimeInt;
    if(this.Scale<=this.ScaleDest) {
        this.Scale = this.ScaleDest;
        this.ScalingFlag = false;
    }
    this.setScale(this.Scale);
};


CTextPopUp.prototype.setColor = function(color) {
    this.Text.tint = color;
};

CTextPopUp.prototype.setWidthMax = function(w_max)
{
    var w = this.Text.width;
    if(w>w_max) this.Scale = w_max/w;
    this.Text.scale.set(this.Scale);
};

CTextPopUp.prototype.setShortUp = function(add,time)
{
    if(this.DistMaxUpFlag) {
        this.DistMaxDest += add;
        return;
    }
    this.DistMaxDest = this.DistMax + add;
    this.DistMaxSpeed = (this.DistMaxDest-this.DistMax)/time;
    this.DistMaxUpFlag = true;
};

CTextPopUp.prototype.kill = function()
{
    if(!this.ActiveFlag) return;
    this.Threads.removeThread(this,this.update);
    this.Text.visible = false;
 //   this.Text.alive = false;
    this.ActiveFlag = false;

    if(this.FuncEnd!=null)
        this.FuncEnd.call(this.FuncEndContex);
};

CTextPopUp.prototype.updateAlpha0 = function()
{
    this.Alpha += this.AlphaSpeed*Base.RealTimeInt;
    if(this.Alpha>=1)
    {
        this.Alpha = 1;
        if(this.Params.stay!=undefined) {
            this.StayTimeCntr = this.Params.stay;
            this.updateAlpha = this.updateAlpha1;
        }
        else
          this.FadeFlag = false;
    }
    this.Text.alpha = this.Alpha;
};

CTextPopUp.prototype.updateAlpha1 = function()
{
    this.StayTimeCntr-=Base.RealTimeInt;
    if(this.StayTimeCntr<=0)
    {
        this.updateAlpha = this.updateAlpha2;
        this.AlphaSpeed = 1.0/this.Params.fade;
        this.FadeFlag = true;

        if(this.Params.scale!=undefined)
            this.setScalingDown(this.Params.scale);
    }
};

CTextPopUp.prototype.setFadeOut = function(time) {
    this.updateAlpha = this.updateAlpha2;
    this.AlphaSpeed = this.Alpha/time;
    this.FadeFlag = true;
};

CTextPopUp.prototype.updateAlpha2 = function()
{
    this.Alpha -= this.AlphaSpeed*Base.RealTimeInt;
    if(this.Alpha<=0)
    {
        this.Alpha = 0;
        this.kill();
     //   if(this.Func!=null)  this.Func.call(this.FuncContex);
    }
    else
        this.Text.alpha = this.Alpha;
};

CTextPopUp.prototype.update = function()
{
    this.PauseTimeCntr-=Base.RealTimeInt;
    if(this.PauseTimeCntr>0) return;

    if(this.UpFlag) {
        this.Time += Base.RealTimeInt;
        this.TimeCoeff =  this.Time/this.TimeDuration;
        this.TimeCoeff = this.TimeCoeff > 1 ? 1 : this.TimeCoeff;

        this.TimeCoeff = this.TimeCoeff * ( 2 - this.TimeCoeff);

        if(this.DistMaxUpFlag)
        {
            this.DistMax +=  this.DistMaxSpeed*Base.RealTimeInt;
            if( this.DistMax>=this.DistMaxDest)
            {
                this.DistMax = this.DistMaxDest;
                this.DistMaxUpFlag = false;
            }
        }

        this.DistUp = this.DistMax*this.TimeCoeff;
        this.Yc = this.Y0 - this.DistUp;
        this.Text.y =  this.Yc;
    }

    if(this.FadeFlag)
       this.updateAlpha.call(this);

    if(this.ScalingFlag)
        this.updateScaling.call(this);

    if( this.MoveDestFlag)
        this.updateMoveDest();
};

//#####################################################################
//#####################################################################
//#####################################################################

CPopNum = function (papa,group,threads) {

    this.Papa = papa;
    this.Group = group;
    this.Threads = threads;
    this.AllParams = [];
    var params = {dist:50,life:0.6,rise:0.1,stay:0.5,fade:0.25,marg:1}; // score up
    this.AllParams.push(params);
    this.Number = new CImagesNum(this.Papa);
    this.GroupNum = this.Papa.game.add.group();
    this.Group.add(this.GroupNum);
};

CPopNum.prototype.clear = function()
{
    this.Alpha = 0;
    this.Scale = 1;
    this.Time = 0;
    this.TimeCoeff = 0;
    this.DistUp = 0;
    this.DistMaxDest = 0;
    this.DistMaxUpFlag = false;
    this.FadeFlag = false;
    this.Number.clear();
    this.Row = 0;
    this.Col = 0;
};

CPopNum.prototype.create = function(x,y,type,num,alpha,tint,pause,scale,func,funcContex)
{
    this.clear();
    this.Type = type;
    this.Func = func;
    this.FuncContex = funcContex;
    this.Params =  this.AllParams[this.Type];
    this.PauseTimeCntr = pause;

    this.Y0 = y;
    this.Xc = x;
    this.Yc = y;

    //x,y,num,first,atlas,frames,group,
     //   align,lefts,shifts,marg,scale)

    this.Number.create(x,y,num,10,'atlas',Base.WhiteNums,this.GroupNum,0,
                       null,null,this.Params.marg,scale);
    this.Number.setAlpha(alpha);
    this.Number.setTint(tint);

    this.TimeDuration = this.Params.life;
    this.DistMax = this.Params.dist;

    this.AlphaMax = alpha;
    this.AlphaSpeed = this.AlphaMax/this.Params.rise;
    this.updateAlpha = this.updateAlpha0;

    this.Threads.addThread(this,this.update);

    this.ActiveFlag = true;
};

CPopNum.prototype.setNumber = function(num)
{
    this.Number.setNum(num);
};

CPopNum.prototype.setRowCol = function(row,col)
{
    this.Row = row;
    this.Col = col;
};

CPopNum.prototype.setShortUp = function(add,time)
{
    if(this.DistMaxUpFlag) {
        this.DistMaxDest += add;
        return;
    }
    this.DistMaxDest = this.DistMax + add;
    this.DistMaxSpeed = (this.DistMaxDest-this.DistMax)/time;
    this.DistMaxUpFlag = true;
};

CPopNum.prototype.kill = function()
{
    if(!this.ActiveFlag) return;
    this.Threads.removeThread(this,this.update);
    this.Number.kill();
    this.ActiveFlag = false;
};

CPopNum.prototype.updateAlpha0 = function()
{
    this.Alpha += this.AlphaSpeed*Base.RealTimeInt;
    if(this.Alpha>=this.AlphaMax)
    {
        this.Alpha = this.AlphaMax;
        this.StayTimeCntr = this.Params.stay;
        this.updateAlpha = this.updateAlpha1;
    }
    this.Number.setAlpha(this.Alpha);
};

CPopNum.prototype.updateAlpha1 = function()
{
    this.StayTimeCntr-=Base.RealTimeInt;
    if(this.StayTimeCntr<=0)
    {
        this.updateAlpha = this.updateAlpha2;
        this.AlphaSpeed = 1.0/this.Params.fade;
        this.FadeFlag = true;
    }
};

CPopNum.prototype.updateAlpha2 = function()
{
    this.Alpha -= this.AlphaSpeed*Base.RealTimeInt;
    if(this.Alpha<=0)
    {
        this.Alpha = 0;
        this.kill();
        if(this.Func!=null)  this.Func.call(this.FuncContex);
    }
    else
        this.Number.setAlpha(this.Alpha);
};

CPopNum.prototype.update = function()
{
    this.PauseTimeCntr-=Base.RealTimeInt;
    if(this.PauseTimeCntr>0) return;

    this.Time += Base.RealTimeInt;
    this.TimeCoeff =  this.Time/this.TimeDuration;
    if(this.TimeCoeff>1) this.TimeCoeff = 1;
    //this.TimeCoeff = this.TimeCoeff > 1 ? 1 : this.TimeCoeff;
  //  this.TimeCoeff = this.TimeCoeff * ( 1 - this.TimeCoeff);
    this.TimeCoeff =  --this.TimeCoeff*this.TimeCoeff*this.TimeCoeff + 1;
//--k * k * k   +  1;
  /*  if(this.DistMaxUpFlag)
    {
        this.DistMax +=  this.DistMaxSpeed*Base.RealTimeInt;
        if( this.DistMax>=this.DistMaxDest)
        {
            this.DistMax = this.DistMaxDest;
            this.DistMaxUpFlag = false;
        }
    } */

    this.DistUp = this.DistMax*this.TimeCoeff;
    this.Yc = this.Y0 + this.DistUp;
    this.Number.Drag(this.Xc,this.Yc);

    this.updateAlpha.call(this);
};

//####################################################################


CCameraShake = function (camera,threads) {

    this.Camera = camera;
    this.Threads = threads;
    this.ActiveFlag = false;
};

CCameraShake.prototype.create = function(rad,speed,time)
{
    this.Rad = rad;
    this.Speed = speed;
    this.TimeCntr = time;

    this.RadsFlag = false;
    if(this.Rad instanceof Array)
    {
        this.Rads = rad;
        this.RadsIndex = 0;
        this.RadsIndexNext = 1;
        this.Rad = this.Rads[this.RadsIndex];
        if(this.Rads.length>1) {
            this.RadsTime =  this.TimeCntr/(this.Rads.length-1);
            this.RadsTimeCntr = 0;
            this.RadsFlag = true;
        }
    }

    if(this.ActiveFlag) {
        this.Angle += Math.PI/2 +  Math.PI*Math.random();
        if(this.Angle>=(2*Math.PI)) this.Angle -= 2*Math.PI;
    }
    else {
        this.Angle = Math.random()*Math.PI;
        this.X = 0;
        this.Y = 0;
    }

    var r = this.Rad/3 + 2*Math.random()*this.Rad/3;
    this.X_dest = r*Math.cos(this.Angle);
    this.Y_dest = r*Math.sin(this.Angle);
    var dist = Math.sqrt((this.X_dest-this.X)*(this.X_dest-this.X)+
        (this.Y_dest-this.Y)*(this.Y_dest-this.Y));
    this.dX = this.X_dest - this.X;
    this.dY = this.Y_dest - this.Y;

    this.CoeffTime =  dist/this.Speed;
    this.CoeffTimeCntr = 0;
    this.Coeff = this.CoeffTimeCntr/this.CoeffTime;

    if(!this.ActiveFlag)
       this.Threads.addThread(this,this.update);

    this.FinishFlag = false;
    this.ActiveFlag = true;
};

CCameraShake.prototype.kill = function()
{
     if(!this.ActiveFlag )  return;
     this.X = 0;
     this.Y = 0;
     this.Camera._shake.x = this.X;
     this.Camera._shake.y = this.Y;
     this.Threads.removeThread(this,this.update);
     this.ActiveFlag = false;
};

CCameraShake.prototype.update = function()
{
    this.TimeCntr-=Base.RealTimeInt;
    this.CoeffTimeCntr+=Base.RealTimeInt;
    this.Coeff = this.CoeffTimeCntr/this.CoeffTime;
    this.X = this.X_dest - this.dX*(1-this.Coeff);
    this.Y = this.Y_dest - this.dY*(1-this.Coeff);
     this.Camera._shake.x = this.X;
     this.Camera._shake.y = this.Y;
   // this.Camera._shake.x = this.Rad*Math.random();
   // this.Camera._shake.y = this.Rad*Math.random();

    if(this.RadsFlag) {
        this.RadsTimeCntr+=Base.RealTimeInt;
        if(this.RadsTimeCntr>=this.RadsTime) {
            this.RadsIndex++;
            this.RadsIndexNext = this.RadsIndex  + 1;
            if(this.RadsIndex>=this.Rads.length)
                this.RadsIndex = 0;
            if(this.RadsIndexNext>=this.Rads.length)
                this.RadsIndexNext = 0;
            this.RadsTimeCntr = 0;
        }
    }

    if(this.Coeff>=1) {
        if(this.TimeCntr<0)
        {
            if(this.FinishFlag) {
                this.kill();
                return;
            }
            else
                this.FinishFlag = true;
        }
        if(this.RadsFlag)
           this.Rad = this.Rads[this.RadsIndex] +
              (this.RadsTimeCntr/this.RadsTime)*(this.Rads[this.RadsIndexNext] - this.Rads[this.RadsIndex]);

        this.Angle += Math.PI/2 +  Math.PI*Math.random();
        if(this.Angle>=(2*Math.PI)) this.Angle -= 2*Math.PI;
        var rad = this.Rad/2 + Math.random()*this.Rad/2;
        this.X_dest = rad*Math.cos(this.Angle);
        this.Y_dest = rad*Math.sin(this.Angle);
        if(this.FinishFlag) {
            this.X_dest = 0;
            this.Y_dest = 0;
        }
        var dist = Math.sqrt((this.X_dest-this.X)*(this.X_dest-this.X)+
            (this.Y_dest-this.Y)*(this.Y_dest-this.Y));
        this.dX = this.X_dest - this.X;
        this.dY = this.Y_dest - this.Y;
        this.CoeffTime =  dist/this.Speed;
        this.CoeffTimeCntr = 0;
    }
};

///################################################################################
//#################################################################################


CRoundShake = function (threads) {

    this.Threads = threads;
    this.ActiveFlag = false;
};

CRoundShake.prototype.create = function(rad,speed,time,update,updateContex)
{
    this.Rad = rad;
    this.Speed = speed;
    this.TimeCntr = time;
    this.Update = update;
    this.UpdateContex = updateContex;

    this.RadsFlag = false;
    if(this.Rad instanceof Array)
    {
        this.Rads = rad;
        this.RadsIndex = 0;
        this.RadsIndexNext = 1;
        this.Rad = this.Rads[this.RadsIndex];
        if(this.Rads.length>1) {
            this.RadsTime =  this.TimeCntr/(this.Rads.length-1);
            this.RadsTimeCntr = 0;
            this.RadsFlag = true;
        }
    }

    if(this.ActiveFlag) {
        this.Angle += Math.PI/2 +  Math.PI*Math.random();
        if(this.Angle>=(2*Math.PI)) this.Angle -= 2*Math.PI;
    }
    else {
        this.Angle = Math.random()*Math.PI;
        this.X = 0;
        this.Y = 0;
    }

    var r = this.Rad/3 + 2*Math.random()*this.Rad/3;
    this.X_dest = r*Math.cos(this.Angle);
    this.Y_dest = r*Math.sin(this.Angle);
    var dist = Math.sqrt((this.X_dest-this.X)*(this.X_dest-this.X)+
        (this.Y_dest-this.Y)*(this.Y_dest-this.Y));
    this.dX = this.X_dest - this.X;
    this.dY = this.Y_dest - this.Y;

    this.CoeffTime =  dist/this.Speed;
    this.CoeffTimeCntr = 0;
    this.Coeff = this.CoeffTimeCntr/this.CoeffTime;

    if(!this.ActiveFlag)
        this.Threads.addThread(this,this.update);

    this.FinishFlag = false;
    this.ActiveFlag = true;
};

CRoundShake.prototype.kill = function()
{
    if(!this.ActiveFlag)  return;
    this.X = 0;
    this.Y = 0;
   // this.Camera._shake.x = this.X;
  //  this.Camera._shake.y = this.Y;
    this.Threads.removeThread(this,this.update);
    this.ActiveFlag = false;
};

CRoundShake.prototype.update = function()
{
    this.TimeCntr-=Base.RealTimeInt;
    this.CoeffTimeCntr+=Base.RealTimeInt;
    this.Coeff = this.CoeffTimeCntr/this.CoeffTime;
    this.X = this.X_dest - this.dX*(1-this.Coeff);
    this.Y = this.Y_dest - this.dY*(1-this.Coeff);
    this.Update.call(this.UpdateContex,this.X,this.Y);

    if(this.RadsFlag) {
        this.RadsTimeCntr+=Base.RealTimeInt;
        if(this.RadsTimeCntr>=this.RadsTime) {
            this.RadsIndex++;
            this.RadsIndexNext = this.RadsIndex  + 1;
            if(this.RadsIndex>=this.Rads.length)
                this.RadsIndex = 0;
            if(this.RadsIndexNext>=this.Rads.length)
                this.RadsIndexNext = 0;
            this.RadsTimeCntr = 0;
        }
    }

    if(this.Coeff>=1) {
        if(this.TimeCntr<0)
        {
            if(this.FinishFlag) {
                this.kill();
                return;
            }
            else
                this.FinishFlag = true;
        }
        if(this.RadsFlag)
            this.Rad = this.Rads[this.RadsIndex] +
                (this.RadsTimeCntr/this.RadsTime)*(this.Rads[this.RadsIndexNext] - this.Rads[this.RadsIndex]);

        this.Angle += Math.PI/2 +  Math.PI*Math.random();
        if(this.Angle>=(2*Math.PI)) this.Angle -= 2*Math.PI;
        var rad = this.Rad/2 + Math.random()*this.Rad/2;
        this.X_dest = rad*Math.cos(this.Angle);
        this.Y_dest = rad*Math.sin(this.Angle);
        if(this.FinishFlag) {
            this.X_dest = 0;
            this.Y_dest = 0;
        }
        var dist = Math.sqrt((this.X_dest-this.X)*(this.X_dest-this.X)+
            (this.Y_dest-this.Y)*(this.Y_dest-this.Y));
        this.dX = this.X_dest - this.X;
        this.dY = this.Y_dest - this.Y;
        this.CoeffTime =  dist/this.Speed;
        this.CoeffTimeCntr = 0;
    }
};


//#####################################
//#####################################
//#####################################

CVertShake = function (threads) {

    this.Threads = threads;
    this.ActiveFlag = false;
};

CVertShake.prototype.create = function(rad,speed,time,update,updateContex)
{
    this.Rad = rad;
    this.Speed = speed;
    this.TimeCntr = time;
    this.Update = update;
    this.UpdateContex = updateContex;

    this.RadsFlag = false;
    if(this.Rad instanceof Array)
    {
        this.Rads = rad;
        this.RadsIndex = 0;
        this.RadsIndexNext = 1;
        this.Rad = this.Rads[this.RadsIndex];
        if(this.Rads.length>1) {
            this.RadsTime =  this.TimeCntr/(this.Rads.length-1);
            this.RadsTimeCntr = 0;
            this.RadsFlag = true;
        }
    }


    this.Angle = -1
    this.X = 0;
    this.Y = 0;


    var r = this.Rad;
    this.Y_dest = r*this.Angle;
    var dist = r;
    this.dY = this.Y_dest - this.Y;

    this.CoeffTime =  dist/this.Speed;
    this.CoeffTimeCntr = 0;
    this.Coeff = this.CoeffTimeCntr/this.CoeffTime;

    if(!this.ActiveFlag)
        this.Threads.addThread(this,this.update);

    this.FinishFlag = false;
    this.ActiveFlag = true;
};

CVertShake.prototype.kill = function()
{
    if(!this.ActiveFlag)  return;
    this.X = 0;
    this.Y = 0;
    this.Threads.removeThread(this,this.update);
    this.ActiveFlag = false;
};

CVertShake.prototype.update = function()
{
    this.TimeCntr-=Base.RealTimeInt;
    this.CoeffTimeCntr+=Base.RealTimeInt;
    this.Coeff = this.CoeffTimeCntr/this.CoeffTime;
    this.Y = this.Y_dest - this.dY*(1-this.Coeff);
    this.Update.call(this.UpdateContex,this.X,this.Y);

    if(this.RadsFlag) {
        this.RadsTimeCntr+=Base.RealTimeInt;
        if(this.RadsTimeCntr>=this.RadsTime) {
            this.RadsIndex++;
            this.RadsIndexNext = this.RadsIndex  + 1;
            if(this.RadsIndex>=this.Rads.length)
                this.RadsIndex = 0;
            if(this.RadsIndexNext>=this.Rads.length)
                this.RadsIndexNext = 0;
            this.RadsTimeCntr = 0;
        }
    }

    if(this.Coeff>=1) {
        if(this.TimeCntr<0)
        {
            if(this.FinishFlag) {
                this.kill();
                this.Update.call(this.UpdateContex,this.X,this.Y);
                return;
            }
            else
                this.FinishFlag = true;
        }
        if(this.RadsFlag)
            this.Rad = this.Rads[this.RadsIndex] +
                (this.RadsTimeCntr/this.RadsTime)*(this.Rads[this.RadsIndexNext] - this.Rads[this.RadsIndex]);

        this.Angle  = -this.Angle;
        var rad = this.Rad;
        this.Y_dest = rad*this.Angle;
        if(this.FinishFlag) {
            this.X_dest = 0;
            this.Y_dest = 0;
        }
        var dist = rad;
        this.dY = this.Y_dest - this.Y;
        this.CoeffTime =  dist/this.Speed;
        this.CoeffTimeCntr = 0;
    }
};


