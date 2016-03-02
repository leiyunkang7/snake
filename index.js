$(function(){
	var draw=$('#draw'),
	context=draw[0].getContext('2d');

//单元格工厂
var cellFactory={
	color:'green',
	borderWidth:10,
	point:{x:0,y:0},
	create:function(point,color){
		this.point=$.extend(true,this.point,point);

		context.fillStyle=color||this.color;
		context.fillRect(this.point.x,this.point.y,this.borderWidth,this.borderWidth);
	}
},
snakeFactory={
	points:[
	{x:250,y:150},
	{x:260,y:150},
	{x:270,y:150},
	{x:280,y:150},
	{x:290,y:150}
	],
	direction:'left',
	isRun:false,
	timer:-1,
	furitPoint:{x:0,y:0},
	eatPoint:{x:0,y:0},
	scpoe:{
		x:600,
		y:300
	},
	level:1,
	speed:1000,
	speeds:[1000,800,600,400,200,100],
	score:0,
	$startBtn:$("#startBtn"),
	$level:$("#level"),
	$score:$("#score"),
	init:function(){
		var self=this;
		self.isRun=false;
		clearTimeout(this.timer);
		speed=1000,
		self.direction='left',
		self.points=[
		{x:250,y:150},
		{x:260,y:150},
		{x:270,y:150},
		{x:280,y:150},
		{x:290,y:150}
		];
		if(self.timer!=-1){
			clearInterval(self.timer);
			self.timer=-1;
		}

		self.redraw();
		self.createFruit();
	},
	start:function(){
		var self=this;
		self.isRun=true;
//self.timer=setInterval(function(){
// self.run();
//},self.speed);
self.setTimeout();
self.$startBtn.val('暂停游戏(空格键)');
},
stop:function(){
	this.isRun=false;
	clearTimeout(this.timer);
//clearInterval(this.timer);
//this.timer=-1;
this.$startBtn.val('开始游戏(空格键)');
},
isOver:function(targetPoint){
//判断是否咬到了自己
var isYaodaoziji=this.points.some(function(point){
	return point.x==targetPoint.x&&point.y==targetPoint.y;
});

//判断是否出界了
var isChujie=(targetPoint.x<0||targetPoint.y<0||targetPoint.x>context.canvas.width-10||targetPoint.y>context.canvas.height-10);
return isYaodaoziji;
},
gameOver:function(){
	this.isRun=false;
	clearTimeout(this.timer);
//clearInterval(this.timer);
//this.timer=-1;
ranking.add(this.score);
location.reload();
},
redraw:function(){//重绘
	var self=this;
	context.clearRect(0,0,self.scpoe.x,self.scpoe.y);
	self.points.forEach(function(point,index){
		cellFactory.create(point,index==0?'blue':'');
	});
	cellFactory.create(self.fruitPoint,'red');
},
run:function(){
	var self=this,
	first=self.points[0],
	targetPoint=tp={x:0,y:0};
	switch(self.direction){
		case 'top':
		tp.y=-10;
		break;
		case 'right':
		tp.x=10;
		break;
		case 'down':
		tp.y=10;
		break;
		case 'left':
		tp.x=-10;
		break;
	}

	self.points=self.points.map(function(point,index){
		var targetPoint;
		if(index==0){
			targetPoint={x:first.x+tp.x,y:first.y+tp.y};

			targetPoint.x=targetPoint.x<0?self.scpoe.x-10:targetPoint.x;
			targetPoint.y=targetPoint.y<0?self.scpoe.y-10:targetPoint.y;
			targetPoint.x=targetPoint.x>=self.scpoe.x?0:targetPoint.x;
			targetPoint.y=targetPoint.y>=self.scpoe.y?0:targetPoint.y;

			if(self.isOver(targetPoint)){
				self.gameOver();
			}
			return targetPoint;
		}else{
			if(index==self.points.length-1){
				self.eatPoint=point;
			}
			return self.points[index-1];
		}
	});
	if(self.isEat()){
		self.eat();
	}
	self.redraw();
},
setTimeout:function(){
	var self=this;
	self.timer=setTimeout(function(){
		self.run();
		if(self.isRun){
			self.setTimeout();
		}
	},self.speed);
},
top:function(){
	if(this.direction=='down')return;
	if(this.direction!='top'){
		this.direction='top';
		this.run();
	}
	this.direction='top';
},
right:function(){
	if(this.direction=='left')return;
	if(this.direction!='right'){
		this.direction='right';
		this.run();
	}
	this.direction='right';
},
down:function(){
	if(this.direction=='top')return;
	if(this.direction!='down'){
		this.direction='down';
		this.run();
	}
	this.direction='down';
},
left:function(){
	if(this.direction=='right')return;
	if(this.direction!='left'){
		this.direction='left';
		this.run();
	}
	this.direction='left';
},
isEat:function(){
	return this.points[0].x==this.fruitPoint.x&&this.points[0].y==this.fruitPoint.y
},
eat:function(){
	this.points.push(this.eatPoint);
	this.createFruit();
this.score+=this.level;//根据当前级别加分
this.calcScore();
},
calcScore:function(){
	var level=0;
//计算等级
if(this.score<10){
	level=1;
}
else if(this.score<20){
	level=2;
}
else if(this.score<40){
	level=3;
}
else if(this.score<60){
	level=4;
}
else if(this.score<80){
	level=5;
}
else if(this.score<100){
	level=6;
}
this.speed=this.speeds[level];
this.level=level;
this.$level.html(level);
this.$score.html(this.score);
},
createFruit:function(){
	this.fruitPoint=fruitFactory.create(this.points);
	this.redraw();
}
},
fruitFactory={
	create:function(points){
		var x,y,fruitPoint;
		do{
			x=Math.floor((context.canvas.width-10)/10*Math.random())*10;
			y=Math.floor((context.canvas.height-10)/10*Math.random())*10;
		}while(points.some(function(point){
			return point.x==x&&point.y==y;
		}));

		fruitPoint={x:x,y:y};
		return fruitPoint;
	}
},
ranking={
	$rankingList:$('.rankinglist'),
	scoreArray:[],
	last:10,
	lastScore:0,
	init:function(){
		var self=this;
		db.getAll(function(data){
			self.scoreArray=_.sortBy(data);

//分数去重
var unionScoreArray=_.union(self.scoreArray.map(function(obj){
	return obj.score;
}))

//获取排行榜最后一名的分数
self.lastScore=unionScoreArray[self.last-1<unionScoreArray.length?self.last-1:unionScoreArray.length-1]||0;


self.scoreArray=self.scoreArray.filter(function(obj){
	return obj.score>=self.lastScore;
});
self.scoreArray.forEach(function(obj){
	var tr='<tr><td>'+obj.name+'</td><td>'+obj.score+'</td></tr>';
	self.$rankingList.find('tbody').append(tr);
});
});
	},
	add:function(score){

		if(score>0&&score>=this.lastScore||this.scoreArray.length<this.last){
			var name=prompt('游戏结束 \r 恭喜您创造了新纪录！\r请输入您的名字:')||'佚名';
			db.save({name:name,score:score},function(data){

			});
		}else{
			alert('游戏结束');
		}
	},

};

snakeFactory.init();
ranking.init();
$(document).keydown(function(event){
	if((!snakeFactory.isRun)&&event.keyCode!=32)return;
	switch(event.keyCode){
//上
case 38:
snakeFactory.top();
break;
//右
case 39:
snakeFactory.right();
break;
//下
case 40:
snakeFactory.down();
break;
//左
case 37:
snakeFactory.left();
break;
//空格
case 32:
if(snakeFactory.isRun){
	snakeFactory.stop();
}
else{
	snakeFactory.start();
}
break;
}
});

$("#startBtn").click(function(){
	if(snakeFactory.isRun){
		snakeFactory.stop();
	}
	else{
		snakeFactory.start();
	}
});
});