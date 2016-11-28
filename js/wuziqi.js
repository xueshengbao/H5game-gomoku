$( function () {
    var canvas = $("canvas").get(0);
    var ctx = canvas.getContext("2d");
    //格子的宽度
    var r=30;
    //定义开关
    var kaiguang=true;
    var audio=$(".audio").get(0);
    var audio1=$(".audio").get(1);
    var time;
    var  min=0;
    var second=0;	
    var t;
   	var times;
    var  mins; 
    var tt;
    var seconds=0;
    var zi={}	
    var AI=false;
   	var gameState=true;
   	var kongbai={};

//////////////////////////////////////////////////////////////////////


    //位置转换（划整）
    
    function l(x){
    	return (x + 0.5) * r + 0.5;
    }
    
    //棋盘制作
    
	function Qipan(){
	ctx.clearRect(0,0,450,450);
	ctx.beginPath();
	
	for(var i=0;i<15;i++){
		ctx.moveTo(l(0),l(i));
		ctx.lineTo(l(14),l(i));
		ctx.moveTo(l(i),l(0));
		ctx.lineTo(l(i),l(14));
	}
	ctx.stroke()	
	ctx.closePath()
	//五个坐位点儿
	ctx.fillRect(12.5+ 3*30,12.5+ 3*30,6,6)
	ctx.fillRect(12.5+ 11*30,12.5+ 3*30,6,6)
	ctx.fillRect(12.5+ 7*30,12.5+ 7*30,6,6)
	ctx.fillRect(12.5+ 3*30,12.5+ 11*30,6,6)
	ctx.fillRect(12.5+ 11*30,12.5+ 11*30,6,6)
	for(var i=0;i<15;i++){
	        for(var j=0;j<15;j++){
	            kongbai[M(i,j)]=true;
	        }
	    }
	}
	Qipan();
	
	//棋子制作
	
	
	function qizi(x,y,b){
		ctx.save();
		ctx.translate(l(x),l(y));
		ctx.beginPath();
		ctx.arc(0,0,13,0,Math.PI*2)
		if(b=="b"){
			//黑子
			var g=ctx.createRadialGradient(-5,-7,3,0,0,20);
			g.addColorStop(0,'#ccc');
			g.addColorStop(0.4,'black');
			g.addColorStop(1,'black');
			ctx.fillStyle=g;
			audio.play();	
    		jishi();
    		time=0;
    		min=0;
    		sj()
		}else{
			//白子
			var g=ctx.createRadialGradient(-5,-7,3,0,0,20);
			g.addColorStop(0,'#fff');
			g.addColorStop(0.4,'#D3D3D3');
			g.addColorStop(1,'#D3D3D3');
			ctx.fillStyle=g;
			audio1.play();   		
    		jishis();
    		times=0;
    		mins=0;
    		sj()
		}	
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		ctx.shadowBlur = 2;
		ctx.shadowColor = "rgba(0, 0, 0, 0.5)";

		ctx.fill()
		ctx.closePath();			
		ctx.restore() ;		
		
		console.log(kongbai)
		delete kongbai[M(x,y)];
		gameState=false;
		zi[M(x,y)]=b;
	}

    
    //时间判断
		
	//钟表一计时
	
	function jishi(){
        t=setInterval(function(){
            time +=1;
            second=time%60;
            if(time%60 == 0){
                min = parseInt(min);
                min += 1;
            }
        },1000);
        clearInterval(tt)
    }
		  
	//钟表二计时
	
	function jishis(){
        tt=setInterval(function(){
            times +=1;
            seconds=times%60;
            if(times%60 == 0){
                mins = parseInt(min);
                mins += 1;
            }
        },1000);
        clearInterval(t)
    }

	//超时判断
    
    function sj(){
    	if(min>=1){
    		$("#over").css("display","block");
    		$("#over").show()
    		$(".over").html("已超时:黑棋胜！");
    		clearInterval(t)
    		clearInterval(tt)
    	}else if(mins>=1){
    		$("#over").css("display","block");
    		$("#over").show()
    		$(".over").html("已超时:白棋胜！")
    		clearInterval(t)
    		clearInterval(tt)
    	}
  
    }
    
    function ai() {
    	var max1 = -Infinity;
    	var max2 = -Infinity;
    	var pos1 = {};
    	var pos2 = {};
    	for(var k in kongbai){
    		var x = parseInt(k.split('-')[0]);
    		var y = parseInt(k.split('-')[1]);
    		var m1 = panduan(x,y,"b")
    		var m2 = panduan(x,y,"w")
    		console.log(m1)
    		if(m1>max1){
    			max1=m1;
    			pos1={x:x,y:y};
    		}
    		if(m2>max2){
    			max2=m2;
    			pos2={x:x,y:y};
    		}
    	}
    	if(max1>max2){
    		return pos1;
    	}else{
    		return pos2;
    		
    	}
    	
    	
    }
    
    
    
    
     //棋子落子函数

    $(canvas).on("click",function(e){
    	var x=Math.floor(e.offsetX/r);
    	var y=Math.floor(e.offsetY/r);
 		if(zi[x+"-"+y]){
 			return;
 		}
 		if(AI){
 			qizi(x,y,'b');
 			if(panduan(x,y,'b')>=5){
                $("#over").css("display","block");
    			$("#over").show()
    			$(".over").html("黑棋胜");
                $(canvas).off('click');
                clearInterval(t)
                clearInterval(tt)
				qipu()
				anniu()
                return;
           }
 			var p=ai()
 			qizi(p.x,p.y,'w');
 			if(panduan(p.x,p.y,'w')>=5){
                $("#over").css("display","block");
    			$("#over").show()
    			$(".over").html("白棋胜");
                $(canvas).off('click');
                clearInterval(t)
                clearInterval(tt)
 				qipu()
 				anniu()
                return;
          } 
          
          
          return;
 		}
    	if(kaiguang){
    		console.log(555)
    		qizi(x,y,'b');   		
    		if(panduan(x,y,'b')>=5){
                $("#over").css("display","block");
    			$("#over").show()
    			$(".over").html("黑棋胜");
                $(canvas).off('click');
                clearInterval(t)
                clearInterval(tt)
				qipu()
				anniu()
                return;
           }
    		

		console.log(1)
    		
		}else{ 		
    		qizi(x,y,'w');
    		
    		if(panduan(x,y,'w')>=5){
                $("#over").css("display","block");
    			$("#over").show()
    			$(".over").html("白棋胜");
                $(canvas).off('click');
                clearInterval(t)
                clearInterval(tt)
 				qipu()
 				anniu()
                return;
          }  		
    		
    		gameState=false;
    	}
    	kaiguang=!kaiguang;	
    })
    
    $(".computer").on("click",function(){
    	if(!gameState){
    		console.log(111)
    		return;
    	}
    	$(this).addClass("red");
    	$(".player").removeClass("red");
    	AI = true;
    })
    $(".player").on("click",function(){
    	if(!gameState){
    		return;
    	}
    	$(".computer").removeClass("red");
    	
    	$(this).addClass("red");
    	AI = false;
    })
    
    
    //格式转换
    
    function M(a,b){
    	return a+"-"+b;
    }
    
	//判断

    function panduan(x,y,color){
    	var i;
    	
    	//横
    	
    	i=1;
    	var row=1;
    	while(zi[M(x+i,y)]===color){
    		i++;
    		row++;
    	}
    	i=1;
    	while(zi[M(x-i,y)]===color){
    		i++;
    		row++;
    	}
    	
    	//竖
    	
    	i=1;
    	var lie=1;
    	while(zi[M(x+i,y-i)]===color){
    		i++;
    		lie++;
    	}
    	i=1;
    	while(zi[M(x-i,y+i)]===color){
    		i++;
    		lie++;
    	}
    	
    	//左斜
    	
    	i=1;
    	var zx=1;
    	while(zi[M(x+i,y+i)]===color){
    		i++;
    		zx++;
    	}
    	i=1;
    	while(zi[M(x-i,y-i)]===color){
    		i++;
    		zx++;
    	}
    	
    	
    	//右斜
    	
    	i=1;
    	var yx=1;
    	while(zi[M(x,y-i)]===color){
    		i++;
    		yx++;
    	}
    	i=1;
    	while(zi[M(x,y+i)]===color){
    		i++;
    		yx++;
    	}
    	console.log(Math.max(row, lie, zx, yx))
    	return Math.max(row, lie, zx, yx);
    	
    }
	
	//棋谱
			
	qipu=function (){
		ctx.save()	
		var i=1;
		for(var z in zi){
    		var arr=z.split('-');
    		
    		if (zi[z]==='b'){
	            ctx.fillStyle='#fff';
	        }else{
	            ctx.fillStyle='#000';
	        }
	        ctx.font="15px/1 Helvetica";
	        ctx.textAlign="center";
			ctx.textBaseline="midden";
	        ctx.fillText(i++,l(parseInt(arr[0])),l(parseInt(arr[1]))+r/7);
    	}
		
		ctx.restore()
		
	}
	
	//生成棋谱
	
    anniu=function(){
    	$("#qi").css("display","block");
    }   
    $("#qi").on("click",function(){
    	console.log(1)
    	$(".qipu").css("display","block")
    	$("<img>").attr('src',canvas.toDataURL()).appendTo(".qipu");
    	$("#qi").css("display","none");
    })

	



//////////////////////////////////////////////////////////////////////

	//开始游戏

    $(".button").eq(0).on("click",function(){
		$(".st").css("display","none");
	})
    
    //重新开始
    
	$(".button").eq(1).on("click",function(){
		window.location.reload();
//		Qipan();
//		zi={}
//		kaiguang=true;
//		$("#over").css("display","none");
//		$("#over").hide()
//		$(".over").html("");
	})
	
	 //模式挑选
    
	$(".player").hide(0);
	$(".computer").hide(0)
 	$(".button").eq(2).on("click",function(){
		$(".player").fadeToggle("slow");
		$(".computer").fadeToggle("slow")
	})
 	
 	//游戏规则

    $(".button").eq(3).on("click",function(){
		if(!$(".hint").hasClass("dbclick")&&!$(".hint").hasClass("click")){
		$(".hint").addClass("dbclick");console.log(2)
    	}else if($(".hint").hasClass("dbclick")){
    		console.log(1)
    		$(".hint").removeClass("dbclick").addClass("click")
    	}else if($(".hint").hasClass("click")){
    		$(".hint").removeClass("click").addClass("dbclick")
    		console.log(3)
    	} 		
    })
    
    //退出游戏
   
	$(".button").eq(4).on("click",function(){
		window.close();
	})


//  //AI
//	
//  function AI() {
//      var max1 = -Infinity;
//      var max2 = -Infinity;
//      var pos1;
//      var pos2;
//      for(var i in zi){
//      	console.log(zi)
//          var score1 = check(k2o(i),'b');
//          var score2 = check(k2o(i),'w');
//      	console.log(score1)
//      	console.log(score2)
//          
//          if(score1>max1){
//              max1 = score1;
//              pos1 = k2o(i);
//          }
//          if(score2>max2){
//              max2 = score2;
//              pos2 = k2o(i);
//          }
//      }
//      if(max1>=max2){
//          return pos1;
//      }else{
//          return pos2;
//      }
//      
//  }

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
//////////////////////////////////////////////////////////////////////

	//钟表一

	var canvas1 = document.getElementById("canvas1");
    var ctx1 = canvas1.getContext("2d");
  
    ctx1.save()
    ctx1.clearRect(0,0,180,180);
     
    function miao(){
    	ctx1.save()
    	ctx1.beginPath();
        ctx1.arc(0,0,5,0,Math.PI*2)
        ctx1.moveTo(0,5);
        ctx1.lineTo(0,10);
        ctx1.moveTo(0,-5);
        ctx1.lineTo(0,-45);
        ctx1.closePath();       	
        ctx1.stroke()
        ctx1.restore()
    }   
    function fen(){
    	ctx1.save()
    	ctx1.beginPath();
        ctx1.arc(0,0,5,0,Math.PI*2)
        ctx1.moveTo(0,5);
        ctx1.lineTo(0,7);
        ctx1.moveTo(0,-5);
        ctx1.lineTo(0,-35);
        ctx1.closePath();       	
        ctx1.stroke()
        ctx1.restore()
    }
    function pan(){
    	
    	ctx1.save()
    	for(var i=0;i<60;i++){
    		ctx1.beginPath();		
    		if(i%5==0){
    			ctx1.moveTo(0,-60);
    		}else{
    			ctx1.moveTo(0,-66);  			
    		}	
	        ctx1.lineTo(0,-70);
	        ctx1.rotate(Math.PI/30)
        	ctx1.closePath();   
        	ctx1.stroke()
    	}   	
    	ctx1.restore()
    }
    function renden(){
    	ctx1.translate(0,0)
    	ctx1.clearRect(0,0,180,180);
    	ctx1.font="30px Helvetica";
		ctx1.fillStyle="#000";
		ctx1.textAlign="center";
		ctx1.textBaseline="midden";
		ctx1.fillText("黑",20,30);

    	//秒
    	ctx1.save()
    	ctx1.translate(90,90)
    	pan()
    	var s=second;
    	ctx1.rotate(s*(2*Math.PI/60))
    	miao();    	
    	ctx1.restore()
    	//分
    	ctx1.save()
    	ctx1.translate(90,90)
    	pan()
    	var m=min;
    	ctx1.rotate((m*60+s)/3600*2*Math.PI); 	
    	fen();
    	ctx1.restore()
    	
    }    

    setInterval(renden,30)      
    ctx1.restore();
    
	//钟表二
	
	var canvas2 = document.getElementById("canvas2");
    var ctx2 = canvas2.getContext("2d");
	ctx2.save()
    ctx2.clearRect(0,0,180,180);
    function miao2(){
    	ctx2.save()
    	ctx2.beginPath();
        ctx2.arc(0,0,5,0,Math.PI*2)
        ctx2.moveTo(0,5);
        ctx2.lineTo(0,10);
        ctx2.moveTo(0,-5);
        ctx2.lineTo(0,-45);
        ctx2.closePath();       	
        ctx2.stroke()
        ctx2.restore()
    }   
    function fen2(){
    	ctx2.save()
    	ctx2.beginPath();
        ctx2.arc(0,0,5,0,Math.PI*2)
        ctx2.moveTo(0,5);
        ctx2.lineTo(0,7);
        ctx2.moveTo(0,-5);
        ctx2.lineTo(0,-35);
        ctx2.closePath();       	
        ctx2.stroke()
        ctx2.restore()
    }
    function pan2(){
    	
    	ctx2.save()
    	for(var i=0;i<60;i++){
    		ctx2.beginPath();		
    		if(i%5==0){
    			ctx2.moveTo(0,-60);
    		}else{
    			ctx2.moveTo(0,-66);  			
    		}	
	        ctx2.lineTo(0,-70);
	        ctx2.rotate(Math.PI/30)
        	ctx2.closePath();   
        	ctx2.stroke()
    	}   	
    	ctx2.restore()
    }
    function renden2(){
    	ctx2.translate(0,0)
    	ctx2.clearRect(0,0,180,180);
    	ctx2.font="30px Helvetica";
		ctx2.fillStyle="#000";
		ctx2.textAlign="center";
		ctx2.textBaseline="midden";
		ctx2.fillText("白",20,30);
    	//秒
    	ctx2.save()
    	ctx2.translate(90,90)
    	pan2()
    	var s=seconds;
    	ctx2.rotate(s*(2*Math.PI/60))
    	miao2();    	
    	ctx2.restore()
    	//分
    	ctx2.save()
    	ctx2.translate(90,90)
    	pan2()
    	var m=mins;
    	ctx2.rotate((m*60+s)/3600*2*Math.PI); 	
    	fen2();
    	ctx2.restore()
    	
    }    
    setInterval(renden2,30)      
	ctx2.restore();
	
	
	
	
	
	
	
	
	
	















































})