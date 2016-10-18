define(['module/select-search/select-search',
		'module/pnotify/pnotify.nonblock',
		'module/datepicker/bootstrap-datetimepicker.min'
		],function(d,PNotify){
	plan.addFrag("adduser",{
		model:function(context){
			/// (☆＿☆) logic ~ 修改初始化的内容
			var searchParam = plan.search();
			if(typeof searchParam.id != 'undefined') {
				var defer = plan.Q.defer();
				$.get("/my-project/genealogy/index.php?member!getById", {id:searchParam.id}, function(data){
					data = JSON.parse(data);
					context.member = data.data[0];
					defer.resolve(data);
				});
				return defer.promise;
			}
		},
		main:"main-body",
		view:"adduser",
		onrender:function(context){
			/// (☆＿☆) logic ~ 业务逻辑内的全局变量
			var parents = [],
				mothers = [],
				spouses = [],
				formElem,
				searchParam = plan.search(),
				memberId = guid();
			/// (☆＿☆) logic ~ 初始化组件,以及全局变量
			formElem = $("#add-member-form")[0];
			// 如果是编辑就用基本信息初始化组件
			if(typeof searchParam.id != 'undefined'){
				// 初始化父亲组件
				getAllParentsInfoById(context.member.parents,context.member.realparent,function(data){
					parents = data;
					createParentComponent("js-add-parent","js-parents-list",parents);
				});
				// 初始化母亲组件
				getAllParentsInfoById(context.member.mothers,context.member.realmother,function(data){
					mothers = data;
					createParentComponent("js-add-mother","js-mothers-list",mothers);
				});
				// 初始化配偶组件
				getAllParentsInfoById(context.member.spouses,context.member.realspouse,function(data){
					spouses = data;
					createParentComponent("js-add-spouses","js-spouses-list",spouses);
				});
				memberId = context.member.id;
			}else{
				// 初始化父亲组件
				createParentComponent("js-add-parent","js-parents-list",parents);
				// 初始化母亲组件
				createParentComponent("js-add-mother","js-mothers-list",mothers);
				// 初始化配偶组件
				createParentComponent("js-add-spouses","js-spouses-list",spouses);
			}

			//日期组件
			// $("#js-chusheng-date").datetimepicker({
			// 	format: 'yyyy-mm-dd',
			// 	minView: 3,
			// 	autoclose:true,
			// 	todayBtn: true
			// });
			formElem.elements["hometown"].addEventListener("blur",function(event){
				if(formElem.elements['currenthome'].value.trim() == ""){
					formElem.elements['currenthome'].value = event.target.value;
				}
			});

			/// (☆＿☆) logic ~ 数据提交
			formElem.addEventListener("submit", function(event){
				event.preventDefault();
				var formData = {};
				// 格式化成员的父亲信息
				formData.parents = parents.map(function(item){
					return item.id
				}).join(",");
				formData.mothers  = mothers.map(function(item){
					return item.id
				}).join(",");
				formData.spouses  = spouses.map(function(item){
					return item.id
				}).join(",");
				formData.realparent  = 0;
				formData.realmother  = 0;
				formData.realspouse  = 0;
				if(parents.length > 0) {
					parents.forEach(function(item){
						if(item.real === true) {
							formData.realparent  = item.id;
						}
					})
				}
				if(mothers.length > 0) {
					mothers.forEach(function(item){
						if(item.real === true) {
							formData.realmother  = item.id;
						}
					})
				}
				if(spouses.length > 0) {
					spouses.forEach(function(item){
						if(item.real === true) {
							formData.realspouse  = item.id;
						}
					})
				}
				formData.name  = formElem.elements['name'].value;
				formData.secondname  = formElem.elements['secondname'].value;
				formData.birthday  = formElem.elements['birthday'].value;
				formData.hometown  = formElem.elements['hometown'].value;
				formData.currenthome  = formElem.elements['currenthome'].value;
				formData.idcard  = formElem.elements['idcard'].value;
				formData.id = memberId;
				if(typeof searchParam.id!="undefined"){
					$.post("/my-project/genealogy/index.php?add!update",formData,function(data){
						data = JSON.parse(data);
						if(data.code == 200 && data.data=='success') {
							new PNotify({
								title: "添加家族成员",
					            text: "操作成功",
					            type: 'info'
							});
							plan.redirect("/index/myhome");
						}
					});
				}else{
					$.post("/my-project/genealogy/index.php?add!add",formData,function(data){
						data = JSON.parse(data);
						if(data.code == 200 && data.data=='success') {
							new PNotify({
								title: "添加家族成员",
					            text: "操作成功",
					            type: 'info'
							});
							if(searchParam.type == 'popup') {
								new PNotify({
									title: "添加家族成员",
						            text: "2s后关闭",
						            type: 'info'
								});
								setTimeout(function(){
									window.close();
								},2000);

							} else {
								plan.redirect("/index/myhome");
							}

						}
					});
				}

			});

			/// (☆＿☆) logic ~ 核心逻辑性函数
			/**
			* 用于生成唯一字符串
			*/
			function guid() {
			    function S4() {
			       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
			    }
			    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
			}

			/**
			* @param ids {string} [父亲id列表，用逗号隔开]
			* @param realid {string} [亲生父亲id]
			* @param callback {function} [回调函数]
			*/
			function getAllParentsInfoById(ids,realid,callback){
				if(ids.trim()=="" || ids.split(",").length==0) {
					callback([]);
					return;
				}

				$.get("/my-project/genealogy/index.php?member!getById", {id:encodeURIComponent(ids)}, function(data){
					var members = JSON.parse(data).data;
					members = members.map(function(item){
						if(item.id==realid){
							item.real = true;
						}
						item.text = item.name;
						return item;
					});
					if(members.filter(function(item){
						return item.real === true;
					}).length==0){
						members[0].real=true;
					}
					callback(members);
				});
			}

			/**
			* @param searchElemId {string} [search组件id]
			* @param resultElemId {string} [父亲或者母亲结果展示元素的id]
			* @param parents {array} [结果存储的对象]
			*/
			function createParentComponent(searchElemId,resultElemId,parents){
				/// (☆＿☆) logic ~ 组件内部全局性变量
				var parentsContainer;//父亲列表元素
				/// (☆＿☆) logic ~ 初始化组件
				var searchUrl = "/my-project/genealogy/index.php?search!searchByName";
				if(searchParam.id){
					searchUrl = searchUrl+"?exclude=" + searchParam.id;
				}
				$('#'+searchElemId).selectSearch({
					url:searchUrl,
					otherBtns:[
						{
							text:"添加新成员",
							callback:function(){
								window.open("#/index/adduser?type=popup","_blank");
							}
						}
					],
					callback:function(value){
						updateParents(value);
					}
				});
				parentsContainer = $('#'+resultElemId)[0];
				parentsContainer.innerHTML = etpl.render("parent-item",{parents:parents});
				/// (☆＿☆) logic ~ 事件监听，组件联动
				// 选择当前亲生父亲
				$(parentsContainer).bind("click",function(event){
					var btnItem = $(event.target).findParents({className:"js-btn-item"});
					$(btnItem).addClass("btn-primary").siblings().removeClass("btn-primary");
					//如果点击的是删除按钮
					if($(event.target).hasClass("js-del-btn")) {
						updateParents({id:btnItem.getAttribute("js-id")}, true);
					} else{
						//否则就更新当前亲生父亲
						for(var i=0,ii=parents.length;i<ii;i++){
							if(parents[i].id == btnItem.getAttribute("js-id")){
								parents[i].real = true;
							} else {
								parents[i].real = false;
							}
						}
					}
				});

				/// (☆＿☆) logic ~ 核心逻辑性函数
				//更新当前所选父亲列表
				function updateParents(newparent,isdelete){
					if(typeof isdelete != "undefined" && isdelete) {
						for(var i=0,ii=parents.length;i<ii;i++){
							if(parents[i].id == newparent.id){
								parents.splice(i,1);
								break;
							}
						}
						console.log(parents);
					}else{
						//检查是否存在，不存在的话，就插入
						if(parents.filter(function(value){
							return value.id == newparent.id;
						}).length==0){
							parents.push(newparent);
						}
					}
					//添加默认亲生父亲
					if(parents.filter(function(value){
						return value.real === true;
					}).length==0){
						if(parents.length>0){
							parents[0].real = true;
						}
					}
					//渲染
					parentsContainer.innerHTML = etpl.render("parent-item",{parents:parents});
				}
			}


		}

	});
	plan.addFrag("renderUserInfo",{
		main:"register-login-wrap",
		view:"userinfo"
	});
})