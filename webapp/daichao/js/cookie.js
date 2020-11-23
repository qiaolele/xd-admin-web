var Cookie =
{
	set:function(key, val, day)
	{
		var str = key + "="+escape(val);

		if(day > 0)
		{
			var date = new Date();
			var  ms =  day * 24 * 3600 * 1000;
			date.setTime(date.getTime()+ms);
			str += ";expires="+date.toGMTString();

		}
		document.cookie = str;
	},
	get:function(key)
	{
		var arrStr = document.cookie.split("; ");
		for(var i = 0; i < arrStr.length; i++)
		{
			var temp = arrStr [i].split("=");
			if(key == temp[0])
			{
				return unescape(temp[1]);

			}
		}
	},
	del:function(key)
	{
		var date = new Date();
		date.setTime(-1);
		document.cookie = key + "=a;expires=" + date.toGMTString();
	},
	setArr:function(arr, day)
	{
		for(var i = 0; i<arr.length; i++){
			var str = arr[i].key + "="+escape(arr[i].val);

			if(day > 0)
			{
				var date = new Date();
				var  ms =  day * 24 * 3600 * 1000;
				date.setTime(date.getTime()+ms);
				str += ";expires="+date.toGMTString();

			}
			document.cookie = str;
		}
	},
	getAll:function()
	{
		var str = document.cookie;
		var arr = document.cookie.split("; ");
		var valArr = [];
		if(!str)
		{
			console.log("您没有保存任何cookie");
		}else{
			for(var i = 0; i < arr.length; i++)
			{
				var temp = arr[i].split("=");
				valArr.push("key:"+temp[0]+",val:"+unescape(temp[1]));
			}
			return valArr;
		}
	},
	delAll:function(){
		var str = document.cookie;
		var arr = document.cookie.split("; ");
		if(!str)
		{
			console.log("cookie已经为空");
		}else{
			for(var i = 0; i < arr.length; i++)
			{
				var temp = arr[i].split("=");
				var date = new Date();
				date.setTime(-1);
				document.cookie = temp[0] + "=a;expires=" + date.toGMTString();
			}
		}
	}
}