x$(window).on("load", function() {
    window.$ = x$
    if(!console) {
        window.console = {
            log: function() {}
        }
    }
    if (Touch.isSupported()) { Touch.enable(window.stage); }
    
    /*var dropbox = document.getElementById("canvas")
    // init event handlers
    dropbox.addEventListener("dragenter", noop, false);
	dropbox.addEventListener("dragexit", noop, false);
	dropbox.addEventListener("dragover", noop, false);
	dropbox.addEventListener("drop", drop, false)
	function noop(evt) {
		evt.stopPropagation();
		evt.preventDefault();
	}
	function drop(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		var files = evt.dataTransfer.files;
		var count = files.length;
		// Only call the handler if 1 or more files was dropped.
		if (count > 0) {
			handleFiles(files)
		}
	}
	function handleFiles(files) {
		var file = files[0];
		console.log(file)
		//document.getElementById("droplabel").innerHTML = "Processing " + file.name;
		var reader = new FileReader();
		console.log(reader)
		//get error handling set up
		reader.onerror = readError;
		// init the reader event handlers
		reader.onloadend = handleReaderLoadEnd;
		// begin the read operation
		reader.readAsDataURL(file)
	}
	function readError(evt) {
		alert("Teh brows3r herpd teh derp.")
		console.log(evt)
	}
	function handleReaderLoadEnd(evt) {
        evt.stopPropagation()
		//console.log(evt.target, window.tama,window.bit);
        var oldWidth = window.bit.image.width*window.bit.scaleX;
        var oldHeigh = window.bit.image.height*window.bit.scaleY;
        console.log(oldWidth,oldHeigh);
        //window.bit.visible = false;
		//var img = document.getElementById("preview");
		//img.src = evt.target.result;
		//$("#droplabel").html("Drop file here...")
		//document.getElementById("droplabel").innerHTML = "Drop file here...";
        window.bit.image.src = evt.target.result;
        //window.bit.scaleX = (119/2)/window.bit.width;
        window.bit.scaleX = oldWidth/window.bit.image.width;
        window.bit.scaleY = oldHeigh/window.bit.image.height;
        console.log(window.bit)
	}*/
    
    var spd = [1,1];
    var alwaysTrue = true;
    var toldAlready = false;
    var beepedAlready = false;
    var awake = true;
    //var txtColor = "#000"
    //var d = new Date("October 13, 1975 08:59:59");
    /*setTimeout(function() {
        d.setHours(9);
    }, 2000)*/
    window.tick = function() {
        //var d = new Date("October 13, 1975 08:59:00");
        var d = new Date();
        var time = d.getHours();
        //console.log(d, time)
        //var arr = [2,-2,0];
        //var mx = arr[Math.floor(Math.random()*arr.length)]
        //console.log(window.bit.x)
        //console.log(bit)
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
            /*if(confirm("Make a new guy?")) {
                reset();
                alwaysTrue=true;
                toldAlready=false;
                init();
            }*/
            reset()
            alwaysTrue = true;
            toldAlready = false;
            stage.clear();
            stage.visible = false;
            //delete stage;
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
        //console.log(time)
        if(!awake) {
            if(time<21 && time>=8) {
                wake()
            }
        } else if(awake) {
            //alert("Boom")
            //console.log(time)
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
    //console.log(!!document.createElement('audio').canPlayType)
    var audSup = !!document.createElement('audio').canPlayType;
    if(audSup){
        var aud = new Audio("http://home.freeuk.net/soundstuff/sounds/wavs1/beep-once-ver1.wav");
    }
    function beep() {
        //var aud = new Audio("http://home.freeuk.net/soundstuff/sounds/wavs1/beep-once-ver1.wav");
        //aud.src = "http://home.freeuk.net/soundstuff/sounds/wavs1/beep-once-ver1.wav";
        if(aud) {
            aud.currentTime = 0;
            aud.play();
        }
        //console.log(aud)
        //delete aud
    }
    /*window.sickTime = 0;
    window.sick = false;*/
    function sick() {
        window.sickInt = setInterval(function() {
            sickTime += 1;
            //console.log(sickTime)
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
    //var hungryTime = 16000;
    var hungryTime = 144000;
    //var matrixTime = 900000;
    //var matrixTime = 5000;
    //var matrixTime = 1800000;
    var matrixTime = 2700000;
    function hunger() {
        window.tamaFood-=1;
        //window.foodText.text = "\u2615"+window.tamaFood+"%";
        window.foodText.text = "\u2615"+hungerHearts();
        hungerHearts()
    }
    function pauseGame() {
        alwaysTrue=false;
        //window.tamaFood=0;
        clearInterval(window.hungryInt);
        clearInterval(window.matrixInt);
        //toldAlready = true;
        //reset()
        //alwaysTrue = true;
        //toldAlready = false;
        //init();
    }
    function unpauseGame() {
        alwaysTrue = true;
        window.hungryInt = setInterval(hunger, hungryTime);
        window.matrixInt = setInterval(matrix2, matrixTime);
        //canvas.width = canvas.width;
        //init();
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
        //console.log(sleepTxt.getMeasuredWidth())
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
        //console.log(a);
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
        //console.log(hearts)
        return hearts
    }
    
    //var CIRCLE_RADIUS = 7;
    var CIRCLE_RADIUS = 14;
    var paused = false;
    function drawButtons() {
        var circStyle = "rgba(255,255,255,0.25)";
        var g = new Graphics();
    	//g.setStrokeStyle(1)
		g.beginFill(circStyle)
		g.drawCircle(0,0,CIRCLE_RADIUS)
        //g.drawRect(0,0,CIRCLE_RADIUS*2,CIRCLE_RADIUS*2)
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
            //var stg = "Name: "+window.tamaName+"\nGender: "+window.tamaGend+"\nAge: "+ageM+" minute"+plur+"\n\nFullness: "+window.tamaFood+"%"+"\nCraps: "+window.matrix2s;
            var stg = "Name: "+window.tamaName+"\nGender: "+window.tamaGend+"\nAge: "+ageM+" minute"+plur+"\n\nHunger: "+hungerHearts()+"\nCraps: "+window.matrix2s;
            alert(stg);
        }
        stat.onMouseOver = function(e) {
            //console.log(e)
        }
        statCirc.onClick = stat.onClick;
        //console.log(stat)
        stage.addChild(statCirc)
        stage.addChild(stat);
        
        var h = new Graphics();
        h.setStrokeStyle(1)
		//h.beginFill(Graphics.getRGB(255,0,0))
        h.beginFill(circStyle)
		h.drawCircle(0,0,CIRCLE_RADIUS)
        //g.drawRect(0,0,CIRCLE_RADIUS*2,CIRCLE_RADIUS*2)
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
            //window.foodText.text = "\u2615"+window.tamaFood+"%";
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
        //pausCirc.x = (CIRCLE_RADIUS/2)*13.75;
        pausCirc.x = canvas.width-(CIRCLE_RADIUS*1.25);
        pausCirc.y = CIRCLE_RADIUS*1.25;
        pausCirc.mouseEnabled = true;
        //pause = new Text("\u25b6", CIRCLE_RADIUS+"px Arial", "#000");
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
                //console.log(pause.text)
                pauseGame();
                paused = true;
            }
        }
        pausCirc.onClick = pause.onClick;
        stage.addChild(pausCirc)
        stage.addChild(pause)
        
        /*scree = new Text("\u279A", CIRCLE_RADIUS+"px Arial", "#000");
        scree.x = canvas.width-(CIRCLE_RADIUS*4);
        scree.y = CIRCLE_RADIUS*1.5;
        scree.name = "screenshot";
        scree.mouseEnabled = true;
        scree.onClick = function(e) {
            screenshot()
        }
        stage.addChild(scree)*/
        m = new Graphics();
        m.setStrokeStyle(1)
        m.beginFill(circStyle)
    	m.drawCircle(0,0,CIRCLE_RADIUS)
        healCirc = new Shape(m);
        //pausCirc.x = (CIRCLE_RADIUS/2)*13.75;
        healCirc.x = (CIRCLE_RADIUS/2)*18.75;
        healCirc.y = CIRCLE_RADIUS*1.5;
        healCirc.mouseEnabled = true;
        //pause = new Text("\u25b6", CIRCLE_RADIUS+"px Arial", "#000");
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
        //console.log(heal.color);
    }
    function tamaLoaded(e) {
        //alert("Badaboom?")
        //if(!window.tamaLoadedDone) {
        var container = new Container();
        window.stage.addChild(container);
        window.bit = new Bitmap(window.tama);
        container.addChild(bit);
        bit.x = $("#canvas")[0].width/2;
        bit.y = $("#canvas")[0].height/2;
        bit.name = "tamaBit";
        //bit.image.width = 64;
        //bit.image.height = 60;
        bit.snapToPixel = false;
        //alert("Tama Loaded!")
        //console.log(bit.scaleX, bit.scaleY)
        bit.scaleX = bit.scaleY = 0.5;
        bit.regX = bit.image.width/2|0;
    	bit.regY = bit.image.height/2|0;
        //stage.update();
        //Ticker.setInterval(200);
        drawButtons()
        Ticker.setFPS(12);
        Ticker.addListener(window);
        //window.tamaLoadedDone = true;
        //}
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
        //alert("Boom?")
        /*localStorage.tamaGend = window.tamaGend;
        localStorage.tamaName = window.tamaName;
        localStorage.tamaTime = window.tamaTime;
        localStorage.tamaFood = window.tamaFood;
        localStorage.tamaCrap = window.matrix2s;*/
        //console.log(tamaGend,tamaName,tamaFood,matrix2s)
        localStorage.setItem("tamaGend",window.tamaGend);
        localStorage.setItem("tamaName",window.tamaName);
        localStorage.setItem("tamaTime",window.tamaTime)
        localStorage.setItem("tamaFood",window.tamaFood);
        localStorage.setItem("tamaCrap",window.matrix2s);
        localStorage.setItem("tamaSickTime",window.sickTime);
    }
    //window.matrix2s = 0;
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
    }/*
    function resize(opt) {
        canvas.width = window.innerWidth-2;
        canvas.height = window.innerHeight-3.5;
        if(opt) {
            crapTxt.x = canvas.width-crapTxt.getMeasuredWidth();
            crapTxt.y = canvas.height-crapTxt.getMeasuredLineHeight()/3;
            foodText.y = canvas.height-foodText.getMeasuredLineHeight()/3;
        }
    }
    window.onresize = function() {
        resize(true)
    }*/
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
        //console.log(e.which)
        if(e.which===83 && e.ctrlKey && e.altKey) {
            e.preventDefault();
            e.stopPropagation();
            setActiveStylesheet("Steampunk");
            //setActiveStylesheet("Steampunk");
            //console.log(this)
            //this.onkeydown({which: 83, ctrlKey: true, altKey: true})
        }
    });
    function init() {
        //var arr = ["Male","Female"];
        var arr = ["\u2642","\u2640"];
        /*var arrS = Math.round(Math.random()*arr.length);
        while(arrS>=arr.length) {
            console.log(arrS)
            arrS = Math.round(Math.random()*arr.length);
        }*/
        var arrS = Math.floor(Math.random()*arr.length);
        //window.tamaGend = arr[Math.floor(Math.random()*arr.length)];
        var ls = localStorage;
        window.tamaGend = ls.tamaGend||arr[arrS];
        window.tamaName = ls.tamaName||prompt("Enter a name.\n(Hint: It's "+window.tamaGend.toLowerCase()+")")||"Derpo";
        //console.log(tamaName)
        //localStorage.tamaName = tamaName;
        //console.log(localStorage.tamaName)
        var d = new Date();
        window.tamaTime = ls.tamaTime||d.getTime();
        window.tamaFood = parseInt(ls.tamaFood)||50;
        window.hungryInt = setInterval(hunger, hungryTime);
        window.matrix2s = parseInt(ls.tamaCrap)||0;
        window.matrixInt = setInterval(matrix2, matrixTime);
        window.sickTime = parseInt(ls.tamaSickTime)||0;
        /*if(window.sickTime>0) {
            window.sick = true;
        } else {
            window.sick = false;
        }*/
        canvas = $("#canvas")[0];
        /*if((window.innerWidth<=320 && window.innerHeight<=480) || (window.innerWidth<=480 && window.innerHeight<=320)) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }*/
        //resize();
        window.stage = new Stage(canvas);
        stage.enableMouseOver(10);
        window.tama = new Image();
        tama.onload = tamaLoaded;
        tama.onerror = function(e) {
            //alert("Exterminate!");
            /*console.log(e)
            console.log(this.width,this.height)
            for(i in e) {
                console.log(i,e[i])
            }*/
            console.log("Oh God... Something has gone terribly, terribly wrong... Augh!\n4,200 saved, no survivors.\nYeah, so now it's a PNG.")
            //tama.src = "./Images/Mametchi.png"
            var oldSrc = tama.src;
            var newSrc = oldSrc.replace(/\.svg$/gi, ".png");
            console.log(newSrc);
            tama.src = newSrc;
        }
        tama.src = "./Images/Webetchi.svg";
        //tama.src = "Images/Mametchi.svg";
        /*tama.width = 64;
        tama.height = 60;
        tama.naturalWidth = 64;
        tama.naturalHeight = 60;*/
        //console.log(window.matrix2s);
        window.crapTxt = new Text("\u2668"+window.matrix2s, "18px Arial", "#000");
        //crapTxt.x = 200;
        //crapTxt.x = 228;
        crapTxt.x = canvas.width-crapTxt.getMeasuredWidth()-2;
        //crapTxt.y = 250;
        crapTxt.y = canvas.height-crapTxt.getMeasuredLineHeight()/3;
        stage.addChild(crapTxt);
        
        //window.foodText = new Text("\u2615"+window.tamaFood+"%", "18px Arial", "#000");
        window.foodText = new Text("\u2615"+hungerHearts(), "18px Arial", "#000");
        foodText.x = 2;
        //foodText.y = 250;
        foodText.y = canvas.height-foodText.getMeasuredLineHeight()/3;
        stage.addChild(foodText)
        
        window.skull = new Text("\u2620","18px Arial", "#000");
        skull.x = canvas.width/2;
        skull.y = canvas.height-skull.getMeasuredLineHeight()/3;
        skull.visible = false;
        stage.addChild(skull);
    }
    init();
    //beep();
    //sleep();
    //wake();
    //matrix2();
    //screenshot();
});