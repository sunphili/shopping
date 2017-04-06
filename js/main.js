var m1=angular.module('shopping',['ui.router']);
m1.factory('user',function(){
	return {
		username:'',
		password:''
	};
})
m1.factory('local',['$window',function($window){
	return{
		set:function(key,value){
			$window.localStorage[key]=value;
		},
		get:function(key,defaultValue){
			return $window.localStorage[key]||defaultValue;
		},
		setObject:function(key,value){
			$window.localStorage[key]=JSON.stringify(value);
		},
		getObject:function(key){
			return JSON.parse($window.localStorage[key]||'[]');
		}
	}
}]);
m1.controller('loginCtrl',function($scope,$state,$window,local,user){
	$scope.user=user;
	$window.localStorage.clear()
	$scope.submitForm=function(){
		local.set('admin',user.username);
		if($scope.user.username=='test'&&$scope.user.password=='test'){	
			$state.go('list',{reload:true})
		}
	}		
})
m1.config(function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.otherwise('/')
	$stateProvider
		.state('list',{
			url:'/list',
			templateUrl:'list.html',
			cache:false
		})
		.state('detail',{
			params:{"id":null,"img":null,"title":null,"price":null,"cnt":null},
			url:'/detail/:img/:title/:price/:cnt',
			templateUrl:'detail.html',
			controller:'detailCtrl',
			cache:false
		})
		.state('cart',{
			url:'/cart',
			templateUrl:'cart.html',
			cache:false
		})
		.state('my',{
			url:'/my/:adds',
			templateUrl:'my.html',
			cache:false
		})
		.state('addres',{
			url:'/addres',
			templateUrl:'addres.html',
			cache:false
		})
		.state('addresList',{
			url:'/addresList/:id/:index',
			templateUrl:'addresList.html',
			cache:false
		})
})

//list
m1.service('data',function(){
	return [
 		{id:1,img:'images/1.jpg',title:'荣耀8青春版',cnt:'10级美肤，爱上自拍',price:'1000'},
 		{id:2,img:'images/2.jpg',title:'红米4X',cnt:'官方标配  限量抢购',price:'1100'},
 		{id:3,img:'images/3.jpg',title:'Meizu/魅族 魅蓝Note5',cnt:'官方标配版 限量开售',price:'1200'},
 		{id:4,img:'images/4.jpg',title:'荣耀 6X玫瑰金',cnt:'裸机放货 12期降200',price:'1300'},
 		{id:5,img:'images/5.jpg',title:'OPPO R9s 旗舰爆款',cnt:'分期免息  购机享豪礼',price:'1400'},
 		{id:6,img:'images/6.jpg',title:'vivo X9Plus星空灰',cnt:'大屏大电池柔光自拍 购机赠豪礼',price:'1500'},
 		{id:7,img:'images/7.jpg',title:'美图T8',cnt:'原封正品 送好礼 分期0首付',price:'1500'},
 		{id:8,img:'images/8.jpg',title:'iPhone 7 Plus 128G',cnt:'6388元 限时抢购',price:'1700'},
 		{id:9,img:'images/9.jpg',title:'苹果 iPhone 7 128G',cnt:'5398元 限时抢购',price:'1800'},
 		{id:10,img:'images/10.jpg',title:'红米Note4X',cnt:'超薄迷你 指纹解锁  拍照智能手机',price:'2000'}
 	]
})
//var data=
function buy(item,index,local){
		var storage=local.getObject("cart");
	  if(storage==''||storage==null){
		  storage.push({title:item.title,con:item.con,price:item.price,num:item.num,img:item.img});
		}
	   else{
			var result=true;
			for(var i=0;i<storage.length;i++){
			  if(storage[i].title==item.title){
				  result=false;
				 }
			}
			if(result){
				storage.push({title:item.title,con:item.con,price:item.price,num:item.num,img:item.img});
				}
		}
		local.setObject("cart",storage);
	}
m1.controller('list',function($scope,local,$state,data){
 	$scope.list=data;
 	$scope.searchicon=false;
 	$scope.showSearch=function(){
 		$scope.searchicon=!$scope.searchicon;
 		if($scope.searchicon){
 			$scope.addstyle={"margin-top":"50px"}
 		}
 		else{
 			$scope.addstyle={"margin-top":"0"}
 		}
 	}
 	
 	$scope.buy=function(item,index){
 		buy(item,index,local)
 	}
 	$scope.detailList=function(index){
 		var s={id:index,img:data[index].img,title:data[index].title,price:data[index].price,cnt:data[index].cnt};
 		$state.go('detail',s,{reload:true});
 	}
});
m1.controller('detailCtrl',function($scope,local,$state,$stateParams){
	local.setObject('detail',$stateParams);
	$scope.detail={
		id:$stateParams.id,
		img:$stateParams.img,
		title:$stateParams.title,
		price:$stateParams.price,
		cnt:$stateParams.cnt
	}
	$scope.buy=function(item,index){
		buy(item,index,local);
		$state.go('cart',{reload:true})
	}
})
m1.directive('pageHeader',function(){
	return{
		restrict:'AE',
		templateUrl :'header.html'
	}
})
m1.directive('pageFooter',function(){
	return{
		restrict:'AE',
		templateUrl :'footer.html'
	}
})
m1.controller('cartCtrl',function($scope,local){
	$scope.hashop=false;
	$scope.checked=[];
	$scope.edit='全选';
	$scope.list=local.getObject("cart");

	if($scope.list.length!=0){
		$scope.hashop=true;
		var arr=[];
		var len=$scope.list.length;
		for(var i=0; i<len;i++){
			arr[i]=1;
		}
		$scope.varlist={
			itemNum:arr,
			total:0
		};
		$scope.selectAll=function(){	
			if($scope.select_all){
				$scope.edit='取消';
				$scope.checked=[];
				angular.forEach($scope.list,function(v){
					v.checked=true;
					$scope.checked.push(v);
					getTotal();
				})
			}else{
				$scope.edit='全选';
				angular.forEach($scope.list,function(v){
					v.checked=false;
					$scope.checked=[];
					getTotal();
				})
			}
		}		
		$scope.selectOne=function(){	
			angular.forEach($scope.list,function(v){
				var index=$scope.checked.indexOf(v);
				if(v.checked&&index==-1){
					$scope.checked.push(v);	
					getTotal()			
				}
				else if(!v.checked&&index!=-1){
					$scope.checked.splice(index,1);
					getTotal();
				}
			});
			if($scope.checked.length==$scope.list.length){
				$scope.select_all=true;
			}else{
				$scope.select_all=false;
			}
		}
		$scope.reduce=function(v,ind){
			if($scope.varlist.itemNum[ind]==1)return;
			else{
				$scope.varlist.itemNum[ind]--;					
			}	
			if(v.checked){
				getTotal();
			}
			
		};
		$scope.add=function(v,ind){
			$scope.varlist.itemNum[ind]++;
			if(v.checked){
				getTotal();
			}
		}
		function getTotal(){
			$scope.varlist.total=0
			angular.forEach($scope.list,function(v,index){
				if(v.checked){
					$scope.varlist.total += v.price*$scope.varlist.itemNum[index];	
				}
			})
			return $scope.varlist.total;
		}
	}else{
		$scope.hashop=false;
	}	
})
m1.controller('myCtrl',function($scope,user,local,$state,$stateParams){
	var admin=local.get('admin');
	$scope.user={
		username:admin
		}
	$scope.a='修改/添加';
	$scope.show=false;
	$scope.sex='女';
	$scope.tel='13456235486';
	 if($stateParams.adds!=''){
		$scope.a=JSON.parse($stateParams.adds).cnt;
	}
	$scope.$watch('user.username',function(newValue,oldValue){
		$scope.close=function(){
			$scope.vm={
				activeTab:false
			}
			local.set('admin',newValue)
		}
	})
	$scope.thumb={
		imgSrc:'images/pic.jpg'
	}
	$scope.addres=function(){
		$state.go('addres');
	}
})
m1.directive('imgUpload',function(){
	return{
		restrict:'AE',
		scope:false,
		template:'<input type="file" neme="text" id="file" accept=".jpg,.png">',
		replace:true,
		link:function(scope,ele,attrs){			
			ele.bind('change',function(){
				scope.file = ele[0].files; 
				if(scope.file.size>52428800){
					alert("图片大小不大于50M");
					scope.file=null;
					return false;
				}
				scope.fileName=scope.file[0].name;
				var postfix=scope.fileName.substring(scope.fileName.lastIndexOf(".")+1).toLowerCase();
				if(postfix!="jpg"&&postfix!='png'){
					alert("图片仅支持png、jpg类型的文件");
					scope.file=null;
					scope.$apply();
					return false;
				}
				scope.$apply()
				scope.reader=new FileReader();
				if(scope.file){
					scope.reader.readAsDataURL(scope.file[0]);
					scope.reader.onload=function(ev){
						scope.$apply(function(){
							scope.thumb={
								imgSrc:ev.target.result
							}
						})
					}
				}else{alert('上传图片不能为空')}
			})
		 }
	}
})
m1.directive('adds',function(){
		return{
			restrict:'E',
			template:'<div class="addres-list">'+
			'<div class="list" ng-repeat="(k,v) in addres" ng-if="v.showadd">'+
				'<div class="title">'+
					'<h4>{{v.name}}</h4>'+
					'<span class="tel">{{v.tel}}</span>'+
				'</div>'+
				'<div class="cnt">'+
					'<p>{{v.cnt}}</p>'+
				'</div>'+
				'<div class="bottom">'+
					// '<input type="radio" name="" id="setaddres" ng-model="v.setadds">'+
					'<label for="setaddres" ng-class="{active:currentId==k}" ng-click="setaddres(k)">设为默认</label>'+
					'<div class="btn-group">'+
						'<button class="btn btn-default" ng-click="modify(k)">修改</button>'+
						'<button class="btn btn-default" ng-click="delete(k)">删除</button>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>',
		replace:true,		
		}
	})
m1.controller('addresCtrl',function($scope,$state,$window,local){
	var adds=local.getObject('addres');
	$scope.addshow=false;
	if(adds.length!=0){
		$scope.addshow=true;
		var arr=[];
		for(var i=0;i<adds.length;i++){
			adds[i].setadds=false;
			adds[i].showadd=true;
			arr.push(adds[i]);			
			$scope.addres=arr;			
		}
		$scope.setaddres=function(ind){
			angular.forEach($scope.addres,function(value,key){
				if(ind==key){
					$scope.currentId=key
				}
			 $state.go('my',{adds:JSON.stringify(value)})
			})

		}
	}
	else{
		$scope.addshow=false;
	}
	$scope.modify=function(ind){
		$state.go('addresList',{'id':2,'index':ind});
	}
	$scope.delete=function(ind){
		angular.forEach($scope.addres,function(value,key){
			if(ind==key){		
				value.showadd=false;
				var adds=local.getObject('addres');
				if(adds.length!=0){
					adds.pop(value)
					local.setObject('addres',adds);
				}
			}
		})
	}
	$scope.addAddres=function(){

		$state.go('addresList',{id:1})
	}
})
m1.controller('addlistCtrl',function($scope,$state,$stateParams,local){
	if($stateParams.id==1){
		$scope.addres={
		name:'',
		tel:'',
		cnt:''
		}		
	}
	else if($stateParams.id==2){
		var s=local.getObject('addres');
		for(var i=0;i<s.length;i++){
			if($stateParams.index==i){
				$scope.addres={
					name:s[i].name,
					tel:s[i].tel,
					cnt:s[i].cnt
				}
			}
		}		
	}
	var arr=[];
	arr.push($scope.addres)
	$scope.saveAdds=function(){
		var s=local.getObject('addres')||[];
		if(s.length==0&&$scope.addres.name!=''){
			s.push({name:$scope.addres.name,tel:$scope.addres.tel,cnt:$scope.addres.cnt})
		}
		else if(s.length!=0&&$scope.addres.name!=''){			
			var result=true;
			for(var i=0;i<s.length;i++){
			  if(s[i].tel==$scope.addres.tel){
				  result=false;
				 }
			}
			if(result){
				s.push({name:$scope.addres.name,tel:$scope.addres.tel,cnt:$scope.addres.cnt});
				}
		}
	 	local.setObject('addres',s)
	 	$state.go('addres');
	 }
 
})

