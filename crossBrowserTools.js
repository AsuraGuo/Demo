var EventUtil ={

	//为对象添加事件
	addHandler : function(element,type,handler){
		if (element.addEventListener) {
			element.addEventListener(type,handler,false);
		}else if (element.attachEvent) {
			element.attachEvent("on" + type,handler);
		}else{
			element["on" + type] = handler;
		}
	},

	//取得事件对象
	getEvent : function(event){
		return event ? event : window.event;
	},

	//事件目标元素
	getTarget : function(event){
		return event.target || event.srcElement;
	},

	//取消事件的默认行为，
	preventDefault : function(event){
		if (event.preventDefault) {
			event.preventDefault();//DOM中方式
		}else{
			event.returnValue = false;//IE中的事件
		}
	},

	//移除对象的事件
	removeHandler : function(element,type,handler){
		if (element.addEventListener) {
			element.removeEventListener(type,handler,false);
		}else if (element.detachEvent) {
			element.detachEvent("on" + type,handler);
		}else{
			element["on" + type] = null;
		}
	},

	//停止事件冒泡
	stopPropagation : function(event){
		if (event.stopPropagation) {
			event.stopPropagation();
		}else{
			event.cancelBubble = true;
		}
	}
};