
var WIN_WIDTH= 1000;
var WIN_HEIGHT= 650;
var RADIUS= 12;         //默认圆半径
var SPACING= 1;        //默认点的间隔
var TOP= 200;       //默认距离顶部位置
var DEFAULT_LEFT=50;//默认距离左边位置

//每个字的宽度+间隔宽度
var DIGITAL_WIDTH=(RADIUS*2+1)*digit[0][0].length+30;

//倒计时时间
var minute=1;
var second=0;

function Ball(x, y, vx, vy, color){
    //记得赋值
    this.x=x;
    this.y=y;
    this.r=RADIUS;
    this.vx=vx;
    this.vy=vy;
    this.g=2;
    this.color=color;
}
var colors=["#F8F92C","#C787F9","#58F9B3","#F98ECD","#31F9DB","#B2CBF9","#23F95B","#2787F9","#9BF999","#F96B7A"];
var balls=[];
///绘制
function canvasTime(ctx) {

    var minutes=getNum(minute);
    var seconds=getNum(second);
    ///清空画布
    ctx.clearRect(0,0,WIN_WIDTH,WIN_HEIGHT);
    ///画球
    drawBalls(ctx);
    ///绘制数字
    drawDigital(ctx,minutes[0],1);
    drawDigital(ctx,minutes[1],2);
    drawDigital(ctx,10,3);
    drawDigital(ctx,seconds[0],4);
    drawDigital(ctx,seconds[1],5);

}
//画球
function drawBalls(ctx) {
    for(var i=0;i<balls.length;i++){
        ctx.beginPath();
        ctx.arc(balls[i].x, balls[i].y, balls[i].r, 0,2*Math.PI);
        ctx.closePath();
        ctx.fillStyle=balls[i].color;
        ctx.fill();

    }
}


///生成小球
function getBalls(num,position) {
    var LEFT;
    if(position<=3){
        LEFT= DIGITAL_WIDTH*(position-1);
    }else{                              //加上冒号宽度
        LEFT=DIGITAL_WIDTH*(position-2)+(RADIUS*2+1)*digit[10][0].length;
    }

    for(var i=0; i<digit[num].length; i++){
        for(var j=0; j<digit[num][i].length; j++){
            if(digit[num][i][j]===1){
                var bx=(2*j+1)*(RADIUS+SPACING)+LEFT+DEFAULT_LEFT;
                var by=(2*i+1)*(RADIUS+SPACING)+TOP;
                var rand_color=parseInt(Math.random()*10);
                var vx=parseInt(Math.random()*20-10);
                var vy=parseInt(Math.random()*10-5);
                balls.push(new Ball(bx, by, vx, vy, colors[rand_color]));
            }
        }

    }

}
//判断改变前后 影响的的数字个数,并加到数组里    0代表添加分钟，1代表添加秒
function addBalls(sbefor,safter,flag) {
    var safters=getNum(safter);
    if(parseInt(sbefor/10)!== parseInt(safter/10)){
        if(flag===0){
            getBalls(safters[0],1);
            getBalls(safters[1],2);
        }else {
            getBalls(safters[0], 4);
            getBalls(safters[1], 5);
        }
    }else{
        if(flag===0) {
            getBalls(safters[1], 2);
        }else {
            getBalls(safters[1], 5);
        }
    }
}

    ///更新时间，添加球
function updateTime() {
    ///倒计时
    if(minute>0||second>0) {
        var sbefor=second;
        second--;
        if (second < 0) {
            var mbefor=minute;
            minute--;
            second = 59;
            var mafter=minute;
            addBalls(mbefor,mafter,0);
        }
        var safter=second;
        addBalls(sbefor,safter,1);


    }
}


//解析数字
function getNum(num) {
    var time=[];
    time[0]=parseInt(num/10);
    time[1]=num%10;
    return time;
}

////画数字
function drawDigital(ctx,num,position) {
    var LEFT;
    if(position<=3){
        LEFT= DIGITAL_WIDTH*(position-1);
    }else{                              //加上冒号宽度
        LEFT=DIGITAL_WIDTH*(position-2)+(RADIUS*2+1)*digit[10][0].length;
    }

    ctx.fillStyle="pink";
    for(var i=0; i<digit[num].length; i++){
        for(var j=0; j<digit[num][i].length; j++){
            if(digit[num][i][j]===1){
                ctx.beginPath();
                ctx.arc((2*j+1)*(RADIUS+SPACING)+LEFT+DEFAULT_LEFT, (2*i+1)*(RADIUS+SPACING)+TOP, RADIUS, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fill();
            }
        }

    }



}

//更新球状态
function updateBalls() {
    for(var i=0;i<balls.length;i++){
        balls[i].x+= balls[i].vx;
        balls[i].y+= balls[i].vy;
        balls[i].vy+= balls[i].g;
        //小球碰到地板
        if(balls[i].r>=WIN_HEIGHT-balls[i].y){
            balls[i].y=WIN_HEIGHT-balls[i].r;
            //这一句写在第一个if里面
            balls[i].vy=-parseInt(balls[i].vy*0.6);
            if(Math.abs(balls[i].vy)<=2){
                balls[i].vy=0;
            }
        }
        ///如果球弹出边界就清除
        if(-balls[i].r>=balls[i].x||balls[i].x-WIN_WIDTH>=balls[i].r){
            balls.splice(i,1);
        }

    }

}


///入口函数
window.onload=function () {
    var canvas=document.getElementById("canvas");
    canvas.width=WIN_WIDTH;
    canvas.height=WIN_HEIGHT;
    var ctx=canvas.getContext("2d");

    //开始更新倒计时数字
    setInterval(function () {
        updateTime();
    }, 1000);

    setInterval(function () {
        updateBalls();
        canvasTime(ctx);
    }, 50);


}








