(function($) {
	var lightBox = function () {
		var self = this;

		//创建遮罩和弹出框
		this.popupMask = $('<div id="lightbox-mask">');
		this.popupWin = $('<div id="lightbox-popup">');

		//保存body
		this.bodyNode = $(document.body);

		//渲染剩余的DOM，并插入到body
		this.renderDOM();

		this.picViewArea     = this.popupWin.find("div.lightbox-pic-view");
		this.popupPic        = this.popupWin.find("img.lightbox-image");
		this.picCaptionArea  = this.popupWin.find("div.lightbox-caption-area");
		this.nextBtn         = this.popupWin.find("span.lightbox-next-btn");
		this.prevBtn          = this.popupWin.find("span.lightbox-prev-btn");
		this.captionText     = this.popupWin.find("p.lightbox-pic-desc");
		this.currentIndex    = this.popupWin.find("span.lightbox-of-index");
		this.closeBtn        = this.popupWin.find("span.lightbox-close-btn");

		this.groupName = null;

		//放置同一组数据
		this.groupData = [];

		this.bodyNode.delegate(".js-lightbox,*[data-role=lightbox]","click",function (e) {
			//阻止事件冒泡
			e.stopPropagation;

			var currentGroupName = $(this).attr("data-group");

			if (currentGroupName != self.groupName) {
				self.groupName = currentGroupName;
				self.getGroup();
			}

			self.initPopup($(this));
		});

		this.popupMask.click(function() {
			$(this).fadeOut();
			self.popupWin.fadeOut();
		});

		this.flag = true;

		this.prevBtn.hover(function() {
			if (!$(this).hasClass('disabled') && self.groupData.length > 1 ) {
				$(this).addClass('lightbox-prev-btn-show');
			}
		}, function() {
			if (!$(this).hasClass('disabled') && self.groupData.length > 1 ) {
				$(this).removeClass('lightbox-prev-btn-show');
			}
		}).click(function(e) {
			if (!$(this).hasClass('disabled') && self.flag) {
				self.flag = false;
				e.stopPropagation();
				self.goto("prev");
			}
		});

		this.nextBtn.hover(function() {
			if (!$(this).hasClass('disabled') && self.groupData.length > 1 ) {
				$(this).addClass('lightbox-next-btn-show');
			}
		}, function() {
			if (!$(this).hasClass('disabled') && self.groupData.length > 1 ) {
				$(this).removeClass('lightbox-next-btn-show');
			}
		}).click(function(e) {
			if (!$(this).hasClass('disabled') && self.flag) {
				self.flag = false;
				e.stopPropagation();
				self.goto("next");
			}
		});


		this.closeBtn.click(function() {
			self.popupMask.fadeOut();
			self.popupWin.fadeOut();
		});

	}

	lightBox.prototype = {

		goto: function (dir) {

			if (dir === "next") {
				this.picIndex ++ ;
				if (this.picIndex >= this.groupData.length-1) {
					this.nextBtn.addClass('disabled').removeClass('lightbox-next-btn-show');
				}
				if (this.picIndex != 0) {
					this.prevBtn.removeClass('disabled');
				}
				var src = this.groupData[this.picIndex].src;
				this.loadPic(src);

			}else if (dir === "prev") {

				this.picIndex -- ;
				if (this.picIndex <= 0) {
					this.prevBtn.addClass('disabled').removeClass('lightbox-prev-btn-show');
				}
				if (this.picIndex != this.groupData.length -1) {
					this.nextBtn.removeClass('disabled');
				}
				var src = this.groupData[this.picIndex].src;
				this.loadPic(src);
			}

		},

		loadPic:function (picSource){
			var self = this ;

			self.popupPic.css({
				width:"auto",
				height:"auto"
			}).hide();

			this.preLoading(picSource,function () {
				self.popupPic.attr('src',picSource);
				var picWidth = self.popupPic.width();
				var picHeight = self.popupPic.height();
				console.log( picWidth + ":" + picHeight);
				self.changePic(picWidth,picHeight);
			});
		},

		changePic:function (width,height) {
			var self = this ;
			var winWidth = $(window).width();
			var winHeight = $(window).height();

			//如果图片的宽高大于浏览器视口的宽高比例时
			var scale = Math.min(winWidth/(width+10),winHeight/(height+10),1);
			width = width * scale;
			height = height * scale;

			this.picViewArea.animate({
				width: width-10,
				height: height-10
			});

			this.popupWin.animate({
				width: width,
				height: height,
				marginLeft: -width/2,
				top: (winHeight-height)/2
			},function() {
				self.popupPic.css({
					width: width-10,
					height: height-10
					}).fadeIn();
				self.picCaptionArea.fadeIn();
				self.flag = true;
			});

			//设置描述文字和索引
			this.captionText.text(this.groupData[this.picIndex].caption);
			this.currentIndex.text("当前索引：" + (this.picIndex) + " of " + this.groupData.length);
		},

		preLoading:function (src,callback) {
			var img = new Image();
			if (!!window.ActiveXObject){
				img.onreadystatechange = function () {
					if (this.readyState == "complete") {
						callback();
					}
				}
			}else{
				img.onload = function () {
					callback();
				}
			}
			img.src = src ;
		},

		showMaskAndPopup:function (picSource,currentId) {
			var self = this;

			this.popupPic.hide();
			this.picCaptionArea.hide();

			this.popupMask.fadeIn();

			var winWidth  = $(window).width();
			var winHeight = $(window).height();

			this.picViewArea.css({
				width:winWidth/2,
				height:winHeight/2
			});

			this.popupWin.fadeIn();

			this.popupWin
				.css({
					width:winWidth/2,
					height:winHeight/2,
					marginLeft:-256,
					top:-(197+winHeight/2)
				})
				.animate({top:(winHeight/2-197)},function () {
					self.loadPic(picSource);
				});

			//根据当前点击元素的id获取在当前组别里面的索引
			this.picIndex = this.getPicIndex(currentId);

			var groupDataLen = this.groupData.length;
			console.log("groupDataLen:" + this.picIndex);

			if (groupDataLen > 1 ){
				if (this.picIndex === 0) {
					this.prevBtn.addClass('disabled');
					this.nextBtn.removeClass('disabled');
				}else if (this.picIndex === groupDataLen-1) {
					this.prevBtn.removeClass('disabled');
					this.nextBtn.addClass('disabled');
				}else{
					this.prevBtn.removeClass('disabled');
					this.nextBtn.removeClass('disabled');
				}
			}

		},

		getPicIndex:function (currentId) {
			var picIndex = 0;
			$(this.groupData).each(function (index) {
				picIndex = index;
				if (this.id === currentId){
					return false;
				}
			});
			return picIndex ;
		},

		initPopup:function (currentObj) {
			var self = this;

			var picSource = currentObj.attr("data-source");
			var currentId = currentObj.attr("data-id");

			this.showMaskAndPopup(picSource,currentId);

		},

		getGroup:function () {
			var self = this;
			//根据当前的组别名称获取页面中所有相同组别的对象
			var groupList = this.bodyNode.find("*[data-group=" + this.groupName + "]");


			self.groupData.length = 0 ;

			groupList.each(function() {
				self.groupData.push({
					src:$(this).attr('data-source'),
					id:$(this).attr('data-id'),
					caption:$(this).attr('data-caption')
				});
			});

		},

		renderDOM:function () {
			var strDOM =
				'<div class="lightbox-pic-view">'
					+'<span class="lightbox-btn lightbox-prev-btn"></span>'
					+'<img class="lightbox-image" src="images/1-1.jpg" alt="">'
					+'<span class="lightbox-btn lightbox-next-btn"></span>'
				+'</div>'
				+'<div class="lightbox-pic-caption">'
					+'<div class="lightbox-caption-area">'
						+'<p class="lightbox-pic-desc">图片标题</p>'
						+'<span class="lightbox-of-index">当前索引：</span>'
					+'</div>'
					+'<span class="lightbox-close-btn"></span>'
				+'</div>';

			//strDOM插入到popupWin中
			this.popupWin.html(strDOM);

			//将遮罩和弹出框插入到body
			this.bodyNode.append(this.popupMask,this.popupWin);

		}

	};


	window['lightBox'] = lightBox;
})(jQuery);
