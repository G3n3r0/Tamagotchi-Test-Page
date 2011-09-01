x$(window).on("load", function() {
    window.$ = x$
    if(!console) {
        window.console = {
            log: function() {}
        }
    }
    if (Touch.isSupported()) { Touch.enable(window.stage); }
    
    var spd = [1,1];
    var alwaysTrue = true;
    var toldAlready = false;
    var beepedAlready = false;
    var awake = true;
    window.tick = function() {
        var d = new Date();
        var time = d.getHours();
        var wo2 = bit.image.width/2*bit.scaleX;
        var ho2 = bit.image.height/2*bit.scaleY;
        if(window.bit.x+wo2>canvas.width || window.bit.x-wo2<0) {
            spd[0] = -spd[0];
        }
        if(window.bit.y+ho2>canvas.height-(CIRCLE_RADIUS*2)+8 || window.bit.y-ho2<(CIRCLE_RADIUS*2.5)) {
            spd[1] = -spd[1];
        }
        save()
        if(window.matrix2s>2 && !window.sick) {
            sick();
        }
        if((window.tamaFood<=0 || window.matrix2s>=9 || window.sickTime>=5400) && !toldAlready) {
            alert("Your dude died, bud.");
            alwaysTrue=false;
            window.tamaFood=0;
            clearInterval(window.hungryInt);
            clearInterval(window.matrixInt);
            toldAlready = true;
            reset()
            alwaysTrue = true;
            toldAlready = false;
            stage.clear();
            stage.visible = false;
            for(i in stage.children) {
                stage.children[i].mouseEnabled = false;
            }
            init();
        } else if(window.tamaFood<=25 && !beepedAlready) {
            beepedAlready = true;
            beep();
        } else if(window.tamaFood>25 && beepedAlready) {
            beepedAlready = false;
        }
        if(!awake) {
            if(time<21 && time>=8) {
                wake()
            }
        } else if(awake) {
            if(time>=21 || time<8) {
                sleep()
            }
        }
        if(alwaysTrue && awake) {
            window.bit.x += spd[0];
            window.bit.y += spd[1];
            stage.update();
        }
    }
    var audSup = !!document.createElement('audio').canPlayType;
    if(audSup){
        var aud = new Audio("http://home.freeuk.net/soundstuff/sounds/wavs1/beep-once-ver1.wav");
    }
    function beep() {
        if(aud) {
            aud.currentTime = 0;
            aud.play();
        }
    }
    function sick() {
        window.sickInt = setInterval(function() {
            sickTime += 1;
        },1000)
        beep();
        window.sick = true;
        window.skull.visible = true;
        stage.update();
    }
    function sickRem() {
        clearInterval(window.sickInt);
        sickTime = 0;
        window.sick = false;
        matrix2rem();
        window.skull.visible = false;
    }
    var hungryTime = 144000;
    var matrixTime = 2700000;
    function hunger() {
        window.tamaFood-=1;
        window.foodText.text = "\u2615"+hungerHearts();
        hungerHearts()
    }
    function pauseGame() {
        alwaysTrue=false;
        clearInterval(window.hungryInt);
        clearInterval(window.matrixInt);
    }
    function unpauseGame() {
        alwaysTrue = true;
        window.hungryInt = setInterval(hunger, hungryTime);
        window.matrixInt = setInterval(matrix2, matrixTime);
    }
    
    function sleep() {
        awake = false;
        clearInterval(window.hungryInt)
        clearInterval(window.matrixInt);
        window.sleepCover = new Shape();
        sleepCover.graphics.beginFill("#333").drawRect(0,0,canvas.width,canvas.height);
	    sleepCover.x = 0;
	    sleepCover.y = 0;
        stage.addChild(sleepCover);
        
        window.sleepTxt = new Text("ZZZ...", CIRCLE_RADIUS*2+"px Arial", "#EEE");
        sleepTxt.x = canvas.width/2-sleepTxt.getMeasuredWidth()/2;
        sleepTxt.y = canvas.height/2;
        sleepTxt.rotation = 10;
        stage.addChild(sleepTxt)
        stage.update();
    }
    function wake() {
        awake = true;
        window.hungryInt = setInterval(hunger, hungryTime);
        window.matrixInt = setInterval(matrix2, matrixTime);
        stage.removeChild(sleepCover);
        stage.removeChild(sleepTxt)
    }
    function hungerHearts() {
        //var a = Math.ceil(window.tamaFood/10)*10;
        var a = window.tamaFood;
        var hearts;
        if(a<=100 && a>75) {
            hearts = "\u2665\u2665\u2665\u2665";
        } else if(a<=75 && a>50) {
            hearts = "\u2665\u2665\u2665\u2661";
        } else if(a<=50 && a>25) {
            hearts = "\u2665\u2665\u2661\u2661";
        } else if(a<=25 && a>0) {
            hearts = "\u2665\u2661\u2661\u2661";
        } else {
            hearts = "\u2661\u2661\u2661\u2661";
        }
        return hearts
    }
    
    var CIRCLE_RADIUS = 14;
    var paused = false;
    function drawButtons() {
        var circStyle = "rgba(255,255,255,0.25)";
        var g = new Graphics();
		g.beginFill(circStyle)
		g.drawCircle(0,0,CIRCLE_RADIUS)
		statCirc = new Shape(g)
        statCirc.x = (CIRCLE_RADIUS/2)*3.75;
    	statCirc.y = (CIRCLE_RADIUS)*1.5;
        statCirc.mouseEnabled = true;
        
        stat = new Text("\u2603", CIRCLE_RADIUS*2+"px Arial", "#000");
		stat.x = (CIRCLE_RADIUS/2)*2;
		stat.y = (CIRCLE_RADIUS)*2;
		stat.name = "stats"
		stat.mouseEnabled=true;
        stat.onClick = function(e) {
            var d = new Date()
            var curTime = d.getTime();
            var ageMS = curTime-window.tamaTime;
            var ageS = Math.floor(ageMS/1000);
            var ageM = Math.floor(ageS/60);
            if(ageM===1) {
                var plur = "";
            } else {
                var plur = "s";
            }
            var stg = "Name: "+window.tamaName+"\nGender: "+window.tamaGend+"\nAge: "+ageM+" minute"+plur+"\n\nHunger: "+hungerHearts()+"\nCraps: "+window.matrix2s;
            alert(stg);
        }
        statCirc.onClick = stat.onClick;
        stage.addChild(statCirc)
        stage.addChild(stat);
        
        var h = new Graphics();
        h.setStrokeStyle(1)
        h.beginFill(circStyle)
		h.drawCircle(0,0,CIRCLE_RADIUS)
		feedCirc = new Shape(h)
        feedCirc.x = (CIRCLE_RADIUS/2)*8.75;
    	feedCirc.y = (CIRCLE_RADIUS)*1.5;
        feedCirc.mouseEnabled = true;
        
        feed = new Text("\u2615", CIRCLE_RADIUS*2+"px Arial", "#000");
		feed.x = (CIRCLE_RADIUS/2)*7;
		feed.y = (CIRCLE_RADIUS)*2;
		feed.name = "food"
		feed.mouseEnabled=true;
        feed.onClick = function(e) {
            window.tamaFood += 25;
            if(window.tamaFood>100) {
                window.tamaFood = 100;
            }
            window.foodText.text = "\u2615"+hungerHearts();
        }
        feedCirc.onClick = feed.onClick;
        stage.addChild(feedCirc);
        stage.addChild(feed);
        
        j = new Graphics();
        j.setStrokeStyle(1)
    	j.beginFill(circStyle)
		j.drawCircle(0,0,CIRCLE_RADIUS)
        crapCirc = new Shape(j);
        crapCirc.x = (CIRCLE_RADIUS/2)*13.75;
        crapCirc.y = CIRCLE_RADIUS*1.5;
        crapCirc.mouseEnabled = true;
        
        crap = new Text("\u2668", CIRCLE_RADIUS*2+"px Arial", "#000");
        crap.x = (CIRCLE_RADIUS/2)*12;
        crap.y = CIRCLE_RADIUS*2;
        crap.name = "matrix 2";
        crap.mouseEnabled = true;
        crap.onClick = function(e) {
            matrix2rem()
        }
        crapCirc.onClick = crap.onClick;
        stage.addChild(crapCirc)
        stage.addChild(crap)
        
        k = new Graphics();
        k.setStrokeStyle(1)
        k.beginFill(circStyle)
		k.drawCircle(0,0,CIRCLE_RADIUS)
        pausCirc = new Shape(k);
        pausCirc.x = canvas.width-(CIRCLE_RADIUS*1.25);
        pausCirc.y = CIRCLE_RADIUS*1.25;
        pausCirc.mouseEnabled = true;
        pause = new Text("\u275A\u275a", CIRCLE_RADIUS+"px Arial", "#000");
        pause.x = canvas.width-(CIRCLE_RADIUS*2);
        pause.y = CIRCLE_RADIUS*1.5;
        pause.name = "play/pause";
        pause.mouseEnabled = true;
        pause.onClick = function(e) {
            if(paused) {
                pause.text = "\u275A\u275a";
                pause.x = canvas.width-(CIRCLE_RADIUS*2);
                stage.update();
                unpauseGame();
                paused = false;
            } else {
                pause.text = "\u25b6";
                pause.x = canvas.width-(CIRCLE_RADIUS*1.5);
                stage.update()
                pauseGame();
                paused = true;
            }
        }
        pausCirc.onClick = pause.onClick;
        stage.addChild(pausCirc)
        stage.addChild(pause)
        
        m = new Graphics();
        m.setStrokeStyle(1)
        m.beginFill(circStyle)
    	m.drawCircle(0,0,CIRCLE_RADIUS)
        healCirc = new Shape(m);
        healCirc.x = (CIRCLE_RADIUS/2)*18.75;
        healCirc.y = CIRCLE_RADIUS*1.5;
        healCirc.mouseEnabled = true;
        heal = new Text("\u211E", CIRCLE_RADIUS*2+"px Arial", "#000");
        heal.x = (CIRCLE_RADIUS/2)*17.5;
        heal.y = CIRCLE_RADIUS*2;
        heal.name = "heal";
        heal.mouseEnabled = true;
        heal.onClick = function(e) {
            sickRem();
        }
        healCirc.onClick = heal.onClick;
        stage.addChild(healCirc)
        stage.addChild(heal)
    }
    function tamaLoaded(e) {
        var container = new Container();
        window.stage.addChild(container);
        window.bit = new Bitmap(window.tama);
        container.addChild(bit);
        bit.x = $("#canvas")[0].width/2;
        bit.y = $("#canvas")[0].height/2;
        bit.name = "tamaBit";
        bit.snapToPixel = false;
        bit.scaleX = bit.scaleY = 0.5;
        bit.regX = bit.image.width/2|0;
    	bit.regY = bit.image.height/2|0;
        drawButtons()
        Ticker.setFPS(12);
        Ticker.addListener(window);
    }
    function reset() {
        localStorage.removeItem("tamaGend");
        localStorage.removeItem("tamaName");
        localStorage.removeItem("tamaTime");
        localStorage.removeItem("tamaFood");
        localStorage.removeItem("tamaCrap");
        localStorage.removeItem("tamaSickTime");
    }
    function save() {
        localStorage.setItem("tamaGend",window.tamaGend);
        localStorage.setItem("tamaName",window.tamaName);
        localStorage.setItem("tamaTime",window.tamaTime)
        localStorage.setItem("tamaFood",window.tamaFood);
        localStorage.setItem("tamaCrap",window.matrix2s);
        localStorage.setItem("tamaSickTime",window.sickTime);
    }
    function matrix2() {
        window.matrix2s += 1;
        window.crapTxt.text = "\u2668"+window.matrix2s;
        beep()
    }
    function matrix2rem() {
        window.matrix2s = 0;
        window.crapTxt.text = "\u2668"+"0"
    }
    function screenshot() {
        var url = canvas.toDataURL("image/png");
        var w = window.open(url,"","width="+canvas.width+", height="+canvas.height)
    }
    function setActiveStylesheet(title) {
        var i, a, main;
        for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
            if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
                a.disabled = true;
                if(a.getAttribute("title") == title) {
                    a.disabled = false;
                }
            }
        }
    }
    $("html").on("keydown", function(e) {
        if(e.which===83 && e.ctrlKey && e.altKey) {
            e.preventDefault();
            e.stopPropagation();
            setActiveStylesheet("Steampunk");
        }
    });
    function init() {
        var arr = ["\u2642","\u2640"];
        var arrS = Math.floor(Math.random()*arr.length);
        var ls = localStorage;
        window.tamaGend = ls.tamaGend||arr[arrS];
        window.tamaName = ls.tamaName||prompt("Enter a name.\n(Hint: It's "+window.tamaGend.toLowerCase()+")")||"Derpo";
        var d = new Date();
        window.tamaTime = ls.tamaTime||d.getTime();
        window.tamaFood = parseInt(ls.tamaFood)||50;
        window.hungryInt = setInterval(hunger, hungryTime);
        window.matrix2s = parseInt(ls.tamaCrap)||0;
        window.matrixInt = setInterval(matrix2, matrixTime);
        window.sickTime = parseInt(ls.tamaSickTime)||0;
        canvas = $("#canvas")[0];
        window.stage = new Stage(canvas);
        stage.enableMouseOver(10);
        window.tama = new Image();
        tama.onload = tamaLoaded;
        tama.onerror = function(e) {
            console.log("Oh God... Something has gone terribly, terribly wrong... Augh!\n4,200 saved, no survivors.\nYeah, so now it's a PNG.")
            //tama.src = "./Images/Mametchi.png"
            var oldSrc = tama.src;
            var newSrc = oldSrc.replace(/\.svg$/gi, ".png");
            console.log(newSrc);
            tama.src = newSrc;
        }
        tama.src = "./Images/Webetchi.svg";
        window.crapTxt = new Text("\u2668"+window.matrix2s, "18px Arial", "#000");
        crapTxt.x = canvas.width-crapTxt.getMeasuredWidth()-2;
        crapTxt.y = canvas.height-crapTxt.getMeasuredLineHeight()/3;
        stage.addChild(crapTxt);
        
        window.foodText = new Text("\u2615"+hungerHearts(), "18px Arial", "#000");
        foodText.x = 2;
        foodText.y = canvas.height-foodText.getMeasuredLineHeight()/3;
        stage.addChild(foodText)
        
        window.skull = new Text("\u2620","18px Arial", "#000");
        skull.x = canvas.width/2;
        skull.y = canvas.height-skull.getMeasuredLineHeight()/3;
        skull.visible = false;
        stage.addChild(skull);
    }
    init();
});