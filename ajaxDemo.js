var xhr = createXHR();

xhr.onreadystateChange = function(){

	//responseText:作为响应主体被返回的文本
	//responseXML:如果响应的内容类型是"text/xml"或"application/xml",这个属性中将保存包含响应数据的XML DOM文档。
	//status:响应的HTTP状态
	//statusText:HTTP状态说明
	//
	//readyState 0未初始化 1启动(open()调用) 2发送(send()调用) 3接收 4完成

	if (xhr.readyState == 4 ) {
		if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
			console.log(xhr.responseText);
		} else {
			console.log("Request was unsuccessful:" + xhr.status);
		}
	}
};
	// xhr.open("get","url",true);
	// //GET请求
	// function addURLParam(url,name,value){
	// 	url += (url.indexOf("?") == -1 ? "?" : "&");
	// 	url += encodeURLComponent(name) + "=" encodeURLComponent(value);
	// 	return url;
	// }
	//
	//
	//POST请求
	//xhr.open("post","url",true);
	//发送POST请求的第二步就是向send()方法中传入某些数据。
	//默认情况下，服务器对POST请求和提交的Web表单请求并不会一视同仁。因此服务器端必须有程序来读取发送过来的原始数据，并从中解析出有用的部分
	//不过，我们可以使用XHR来模仿表单提交：
	//首先将Content-Type头部信息设置为application/x-www-form-urlencoded，也就是表单提交时的内容类型，
	//其次是以适当的格式创建一个字符串。

xhr.open("post","url",true);
// xhr.setRequestHeader("MyHeader","MyValue");
xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
var form = document.getElementById("user-info");
// xhr.send(null);
xhr.send(serialize(form));



	//Accept
	//HTTP头部信息
	//Accept：浏览器能够处理的内容类型。Accept-Charset,Accept-Encoding,Accept-Language.
	//Connection:浏览器与服务器之间的连接类型。
	//Cookie:当前页面设置的任何Cookie。
	//Host:发出请求的页面所在的域。
	//Referer:发出请求的页面的URL。
	//User-Apent:浏览器的用户代理字符串。

var myHeader = xhr.getResponseHeader("MyHeader");
var allHeader = xhr.getAllResponseHeaders();

function createXHR() {
    if (typeof XMLHttpRequest != "undefined") {
        return new XMLHttpRequest();
    } else if (typeof ActiveXObject != "undefined"){
        if (typeof arguments.callee.activeXString != "string") {
            var versions =["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"],i,len;

            for (i = 0 , len = versions.length ; i < len ; i++)	{
                try{
                    new ActiveXObject(versions[i]);
                    arguments.callee.activeXString = versions[i];
                    break;
                }catch(ex){
                    //跳过
                }
            }
        }
        return new ActiveXObject(arguments.callee.activeXString);
    } else{
        throw new Error("No XHR object available.");
    }
}
//表单序列化
function serialize(form){
    var parts = [],field = null,
        i,j,len,
        optLen,option,optValue;
    for (i = 0 ,len = form.elements.length ; i < len ; i++){
        field = form.elements[i];
        switch (field.type){
            case "select-one":
            case "select-multiple":

                if (field.name.length){
                    for ( j = 0,optLen = field.options.length; j < optLen; j++){
                        option = field.option[j];
                        if (option.selected){
                            optValue = "";
                            if (option.hasAttribute){
                                optValue = (option.hasAttribute("value") ? option.value : option.text );
                            }else{
                                optValue = (option.attributes["value"].specified ? option.value : option.text );
                            }
                            parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(optValue));
                        }
                    }
                }
                break;

            case undefined: //字段集
            case "file"://文件输入
            case "submit"://提交按钮
            case "reset"://重置按钮
            case "button"://自定义按钮
                break;

            case "radio"://单选按钮
            case "checkbox"://复选框
                if (!field.checked){
                    break;
                }
                /*执行默认操作*/
            default:
                //不包含没有名字的表单字段
                if (field.name.length){
                    parts.push(encodeURIComponent(field.name) + "=" +encodeURIComponent(field.value));
                }
        }
    }
    return parts.join("&");
}
