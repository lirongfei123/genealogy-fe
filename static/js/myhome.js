define(['./dragView'], function(dragView){
	plan.addFrag("myhome",{
		main:"main-body",
		view:"myhome",
		onrender:function(){
            $.get("/my-project/genealogy/index.php?member!getUserInfo",function(data){
                data = JSON.parse(data).data;
                dragView('myhome-wrap',data.parentid,data.myselfid);
            });

		}
	});
});