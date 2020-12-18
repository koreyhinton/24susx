/*BEGIN*/document.addEventListener('DOMContentLoaded', function() {

var debug=false


var instructions="Welcome amateur detective! Are you ready for your first assignment? Your assignment is to find which traveling merchant is the toy thief. Find all 24 suspects to help you make your decision. Use the left and right arrow controls to steer your vehicle. That's right you get to drive your own vehicle! Don't get too excited it's just a starter vehicle...Starting in.......... Three.............................. Two.............................. One.............................."

if (debug) instructions=""


var angle=225;

function load_game() {
    
}

var idx=0;
var map = [
    //{'x1':0,'y1':691,'x2':1280,'y2':412}
    //{'x1':0,'y1':675,'x2':1280,'y2':500}
    {'x1':0,'y1':700,'x2':1280,'y2':480}
];

function keydown(e) {
    e = e || window.event;
    if (e.keyCode == '37') {
        // left
        var el=document.getElementById("player");
        angle = ((angle + 45) % 360)
        el.src="images/player"+angle+".png";
    }
    else if (e.keyCode == '39') {
        // right
        var el=document.getElementById("player");
        angle=((angle - 45) % 360)
        if (angle<0) angle+=360;
        el.src="images/player"+angle+".png";
    }
    else if (debug && e.keyCode=='13') {
        var el=document.getElementById("player");
        console.log(" "+el.style.left.replace("px","")+","+el.style.top.replace("px",""))
    }
}

function gameloop() {
    var el=document.getElementById("player");
    var dx=0; var dy=0;
    if (angle>90 && angle<270) {
        dx=-1;
    } else {
        dx=1;
    }
    if (angle>180 && angle<360) {
        dy=1;
    } else {
        dy=-1;
    }
    var x=parseInt(el.style.left.replace("px",""));
    var y=parseInt(el.style.top.replace("px",""));
    var road=map[idx];
    var img=document.getElementById("player");
    img.style.zIndex="1000";
    var w=parseInt(window.getComputedStyle(img).width.replace("px",""));
    var h=parseInt(window.getComputedStyle(img).height.replace("px",""));
//    console.log((y+h)>=road.y2)
    if (x>=road.x1 && (x+w)<=road.x2 && (y+h)<=road.y1 && (y)>=road.y2) {
        el.style.top=(y+dy)+"px";
        el.style.left=(x+dx)+"px";    
    } else {
        while ((y)<(road.y2)) {//((y-h)<(road.y2)) {
            y+=1
        }
        while ((y+h)>road.y1) {
            y-=1
        }
        while (x<road.x1) {
            x+=1
        }
        while ((x+w)>road.x2) {
            x-=1
        }
        el.style.top=(y)+"px";
        el.style.left=(x)+"px";
    }
}

var intId=setInterval(function(){
    if (instructions.length==0) {
        clearInterval(intId);
        var game=document.getElementById("game");
        game.innerHTML="";
        game.style.backgroundImage="url('images/background/lawn-3291164_1280.png')"
        var el=document.createElement("img");
        el.id="player";
        el.src="images/player225.png";
        el.style.position="absolute";
        el.style.left="500px";
        el.style.top="530px";
        game.appendChild(el);

        var dbg=document.createElement("div");
        dbg.style.backgroundColor="red";
        dbg.style.position="absolute";
        dbg.style.left="0px";
        dbg.style.top=(map[idx].y2)+"px";
        dbg.style.height=(map[idx].y1-map[idx].y2)+"px";
        dbg.style.width="1280px";
        //game.appendChild(dbg);

        document.onkeydown = keydown;
        setInterval(gameloop, 10);
        return;
    }
    document.getElementById("game").innerHTML=document.getElementById("game").innerHTML+instructions[0];
    instructions=instructions.substring(1);
    //setTimeout(load_game, 2400);
}, 32);

/*END**/});
