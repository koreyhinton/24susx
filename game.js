/*BEGIN*/document.addEventListener('DOMContentLoaded', function() {

var debug=true


var instructions="Welcome amateur detective! Are you ready for your first assignment? Your assignment is to find which traveling merchant is the toy thief. Find all 24 suspects to help you make your decision. Use the left and right arrow controls to steer your vehicle. That's right you get to drive your own vehicle! Don't get too excited it's just a starter vehicle...Starting in.......... Three.............................. Two.............................. One.............................."

if (debug) instructions=""


var angle=225;

function load_game() {
    
}

var idx="D9";
var suspects=0;

function dbg() {
    var els=document.getElementsByClassName("dbg")
    while (els.length>0) {els[0].remove()}//.outerHTML="";els.pop()}
    for (var i=0;i<map[idx].road.length;i++) {
        for (var j=0;j<map[idx].road[i].length;j++) {
            //for (var k=0;k<map[idx][i][j].length;k++) {
                var obj=map[idx].road[i][j];
                var div=document.createElement("span")
                div.style.position="absolute";
                div.style.backgroundColor='blue'
                div.style.width='8px'
                div.style.height='8px'
                div.style.left=obj.x+"px"
                div.style.top=obj.y+"px"
                div.className="dbg"
                div.style.zIndex=10000;
                //div.style.display=""
                document.getElementById("game").appendChild(div)
                //console.log(window.getComputedStyle(div).left+","+window.getComputedStyle(div).top)
            //}
        }
    }
    for (var i=0;i<map[idx].exits.length;i++) {
        var dots=map[idx].exits[i].dots;
        for (var j=0;j<dots.length;j++) {
            var obj=dots[j];
            var div=document.createElement("span")
            div.style.position="absolute";
            div.style.backgroundColor='red'
            div.style.width='8px'
            div.style.height='8px'
            div.style.left=obj.x+"px"
            div.style.top=obj.y+"px"
            div.className="dbg"
            div.style.zIndex=10000;
            document.getElementById("game").appendChild(div)
        }
    }
}

function inside_simple_polygons(pts, polys) {
    // connect every point of inner rectangle (player) with
    // outer polygons (road) vertices
    // if one of the inner points can connect to all 4 quadrants
    // then it is assumed to be within the road
    for (var i=0;i<polys.length;i++) {
        
        for (var j=0;j<pts.length;j++) {
            var pt=pts[j]
            var q1=false;var q2=false;var q3=false;var q4=false;
            for (var k=0;k<polys[i].length;k++) {
                var polypt=polys[i][k];
                if (polypt.x>pt.x && polypt.y>pt.y) q1=true;
                if (polypt.x<pt.x && polypt.y>pt.y) q2=true;
                if (polypt.x<pt.x && polypt.y<pt.y) q3=true;
                if (polypt.x>pt.x && polypt.y<pt.y) q4=true;
            }
            if (q1&&q2&&q3&&q4) {
                return true;
            }
        }
    }
    return false;
}

function inside_rect(pts, rect) {
    for (var i=0; i<pts.length;i++) {
        var pt=pts[i];
        if ( pt.x>rect.x1 && pt.x<rect.x2 &&
             pt.y>rect.y1 && pt.y<rect.y2) {
            return true;
        }
    }
    return false
}

function quadrants_simple_polygons(pts, polys) {
    // connect every point of inner rectangle (player) with
    // outer polygons (road) vertices
    // if one of the inner points can connect to all 4 quadrants
    // then it is assumed to be within the road
    var quads={'q1':false,'q2':false,'q3':false,'q4':false}
    for (var i=0;i<polys.length;i++) {
        
        for (var j=0;j<pts.length;j++) {
            var pt=pts[j]
            var q1=false;var q2=false;var q3=false;var q4=false;
            for (var k=0;k<polys[i].length;k++) {
                var polypt=polys[i][k];
                //if(k>1){console.log(polypt); return quads;}
                //0,720  1280,0
                if (polypt.x>pt.x && polypt.y>pt.y) q1=true;
                if (polypt.x<pt.x && polypt.y>pt.y) q2=true;
                if (polypt.x<pt.x && polypt.y<pt.y) q3=true;
                if (polypt.x>pt.x && polypt.y<pt.y) q4=true;
            }
            if (q1) quads.q1=true
            if (q2) quads.q2=true
            if (q3) quads.q3=true
            if (q4) quads.q4=true
        }
    }
    return quads;
}

function shift_screen(from, to) {
   idx=to
   document.getElementById("cell").innerHTML=to
   var game=document.getElementById("game");
   game.style.backgroundImage="url('images/background/"+map[idx].img+"')"
   var player=document.getElementById("player");
   player.style.left=map[idx].entrances[from].x+"px";
   player.style.top=map[idx].entrances[from].y+"px";
   if (debug) dbg()
   //console.log(map[idx].entrances[from].x+"px")
   if (map[idx].suspects.length>0) {
       map[idx].suspects.shift()
       suspects+=1
       document.getElementById("sus").innerHTML="Suspects: "+suspects
   }
}

function mousedown(e) {
    e = e || window.event;
    console.log("{'x':"+e.clientX + "," + "'y':"+e.clientY+"},")
}

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
var lastX=500;
var lastY=530;
function gameloop() {
    var el=document.getElementById("player");
    var dx=0; var dy=0;
    if (angle>90 && angle<270) {
        dx=-1;
    }
    else if (angle==90||angle==270) {
        dx=0;
    } else {
        dx=1;
    }
    if (angle>180 && angle<360) {
        dy=1;
    }
    else if (angle==180 || angle==360 || angle==0) {
        dy=0;
    } else {
        dy=-1;
    }
    if (debug) {dx*=2;dy*=2}
    var x=parseInt(el.style.left.replace("px",""));
    var y=parseInt(el.style.top.replace("px",""));
    var road=map[idx];
    var img=document.getElementById("player");
    img.style.zIndex="1000";
    var w=parseInt(window.getComputedStyle(img).width.replace("px",""));
    var h=parseInt(window.getComputedStyle(img).height.replace("px",""));
//    console.log((y+h)>=road.y2)
    var pts=[/*
        {'x':x, 'y':y},
        {'x':x+w,'y':y},
        {'x':x,'y':y+h},
        {'x':x+w,'y':y+h},*/
        {'x':x+(w/2.0),'y':y+(h/2.0)}//center-point
    ]
    var valid=inside_simple_polygons(pts,map[idx].road)
    if (valid) {
        el.style.top=(y+dy)+"px";
        el.style.left=(x+dx)+"px";
        lastX=x;
        lastY=y;
        var rect={}
        rect.x1=x+dx;
        rect.y1=y+dy;
        rect.x2=rect.x1+w;
        rect.y2=rect.y1+h;
        for (var i=0;i<map[idx].exits.length;i++) {
            if (inside_rect(map[idx].exits[i].dots, rect)) {
                shift_screen(idx, map[idx].exits[i].name)
            }
        }
    } else {
        /*var quads = quadrants_simple_polygons(pts,map[idx])
        var quad1=quads.quad1;var quad2=quads.quad2;var quad3=quads.quad3;
            var quad4=quads.quad4;*/
        var dy=(lastY-y)*4
        var dx=(lastX-x)*4
        el.style.top=(y+dy)+"px"
        el.style.left=(x+dx)+"px"
        //q1 and q3 are false
        //console.log(quads)
        //return
        /*
        if (!quad1&&!quad2) y+=1
        else if (!quad3&&!quad4) y-=1
        else if (!quad2&&!quad3) x+=1
        else if (!quad1&&!quad4) x-=1
        else if (!quad1) { y-=1;x-=1; }
        else if (!quad2) { y-=1;x+=1; }
        else if (!quad3) { y+=1;x+=1; }
        else if (!quad4) { y+=1;x-=1; } 
        el.style.top=(y)+"px";
        el.style.left=(x)+"px";*/
    }
    /*
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
    }*/
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

        /**/var sus=document.createElement("div");
        sus.style.position="absolute";
        sus.id="sus"
        sus.style.left="0px";
        sus.style.top="0px";
        sus.innerHTML="Suspects: 0"
        game.appendChild(sus);
        /**/var cell=document.createElement("div");
        cell.style.position="absolute";
        cell.id="cell"
        cell.style.left="1200px";
        cell.style.top="0px";
        cell.innerHTML="D9"
        game.appendChild(cell);

        if (debug) dbg();

        document.onkeydown = keydown;
        document.onclick=mousedown;
        setInterval(gameloop, 10);
        return;
    }
    document.getElementById("game").innerHTML=document.getElementById("game").innerHTML+instructions[0];
    instructions=instructions.substring(1);
    //setTimeout(load_game, 2400);
}, 32);

/*END**/});
