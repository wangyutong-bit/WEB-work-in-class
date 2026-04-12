/* switchpic.js */
 //定义全局变量
 var CurScreen = 1; //当前显示的图像
 var MaxScreen = 5; //最多可切换图像数
 var timer = null; //定时器变量
 function $(id) {
 	return document.getElementById(id);
 }

 function switchPic() { //切换图像函数，定时触发
 	if (CurScreen == MaxScreen) {
 		CurScreen = 1;
 	} else {
 		CurScreen++;
 	}
 	//切换图像到最大值时返回1
 	$("pic").src = "images/example" + CurScreen + ".png"; //更换图像的文件名
 }

 function reStart() { //重新开始，鼠标移出时触发
 	switchPic(); //切换下一张图
 	init(); //开始定时器
 }

 function pause() { //暂停切换，鼠标悬停时触发
 	clearInterval(timer); //清除定时器
 }

 function init() { //初始化函数，在body加载时触发
 	timer = setInterval('switchPic();', 1000);
 }
