var Time = {
    //获得当前时间戳
    getUnix: function () {
        var date = new Date();
        return date.getTime();
    },
    //获得今天0点0分0秒的时间戳
    getTodayUnix: function () {
        var date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date.getTime();
    },
    //获取标准年月日
    getNormalDate: function (time) {
        var date = new Date(time);
        var month = date.getMonth() + 1;
        var monthFormate = month < 10 ? ('0' + month) : month;
        var day = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate();
        return date.getFullYear() + '-' + monthFormate + '-' + day;
    },
    //自定义指令需要调用的函数，参数为毫秒级时间戳
    getFormatTime: function (timeStamp) {
        //获得当前时间戳
        var now = this.getUnix();
        //获得今天0点0分0秒的时间戳
        var today = this.getTodayUnix();
        //转换秒级时间
        var timer = (timeStamp-now) / 1000;
        var timeFormat = '';
        if (timer <= 0) {
            timeFormat = '刚刚';
        } else if (Math.floor(timer / 60) <= 0) { //1分钟以前显示刚刚
            timeFormat = '刚刚';
        } else if (timer < 3600) {//1分钟-1小时，显示XX分钟前
            timeFormat = Math.floor(timer / 60) + '分钟后';
        } else if (timer >= 3600 && (timeStamp - today) >= 0) {//1小时-1天，显示XX小时前
            timeFormat = Math.floor(timer / 3600) + '小时后';
        } else if (timer / 86400 <= 31) {//1天-1个月，显示XX天前
            timeFormat = Math.ceil(timer / 86400) + '天后';
        } else {//大于1个月，显示XX年XX月XX日
            timeFormat = this.getNormalDate(timeStamp);
        }
        return timeFormat;
    }
}