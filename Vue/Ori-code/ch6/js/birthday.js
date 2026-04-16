var Birthday = {
    //判断是否闰年
    isLeapYear: function (yearNow) {
        var result = false;
        // 是否闰年， 用于计算天，只在年月都为零时，天数有效
        if ((yearNow % 4 === 0 && yearNow % 100 !== 0) || yearNow % 400 === 0) {
            result = true;
        }
        return result;
    },
    //获得生日格式
    getBirthdayFormat: function (birthday) {
        var returnStr = '';
        var r = birthday.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})/);
        var d = new Date(r[1], r[3] - 1, r[4]);
        var date = new Date();
        var yearNow = date.getFullYear();
        var monthNow = date.getMonth() + 1;
        var dayNow = date.getDate();
        var largeMonths = [1, 3, 5, 7, 8, 10, 12]; //大月， 用于计算天，只在年月都为零时，天数有效
        var lastMonth = monthNow - 1 > 0 ? monthNow - 1 : 12;  // 上一个月的月份
        var isLeapYear = this.isLeapYear(yearNow); // 是否是闰年
        var daysOFMonth = 0; // 当前日期的上一个月多少天
        if (largeMonths.indexOf(lastMonth) > -1) {
            daysOFMonth = 31;
        } else if (lastMonth === 2) {
            if (isLeapYear) {
                daysOFMonth = 29;
            } else {
                daysOFMonth = 28;
            }
        } else {
            daysOFMonth = 30;
        }
        var year = yearNow - parseInt(r[1]);
        var month = monthNow - parseInt(r[3]);
        var day = dayNow - parseInt(r[4]);
        if (day < 0) {
            day = day + daysOFMonth; //借一个月
            month--;
        }
        if (month < 0) {  // 借一年 12个月
            year--;
            month = month + 12; //
        }
        if (year === 0) {
            if (month === 0) {
                returnStr = day + '天';
            } else {
                returnStr = month + '月' + day + '天';
            }
        } else {
            if (month === 0) {
                returnStr = year + '岁' + day + '天';
            } else {
                returnStr = year + '岁' + month + '月' + day + '天';
            }
        }
        return returnStr;
    }
}