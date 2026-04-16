/* switchpic.js 图片轮播脚本 */
 // 声明全局变量
 var CurScreen = 1; // 当前显示的图片序号
 var MaxScreen = 5; // 最多切换图片张数
 var timer = null; // 定时器ID
 function $(id) {
 	return document.getElementById(id);
 }

 function switchPic() { // 切换图片的函数，定时调用
 	if (CurScreen == MaxScreen) {
 		CurScreen = 1;
 	} else {
 		CurScreen++;
 	}
 	// 切换图片循环到第一张
 	$("pic").src = "images/example" + CurScreen + ".png"; // 修改图片的文件名
 }

 function reStart() { // 重新开始切换，鼠标移出时调用
 		switchPic(); // 切换下一张图
 		init(); // 初始化定时器
 }

 function pause() { // 暂停切换，鼠标停留时调用
 		clearInterval(timer); // 清除定时器
 }

 function init() { // 初始化函数，在body加载时调用
 		timer = setInterval('switchPic();', 1000); // 每1000毫秒调用一次switchPic()
 }
