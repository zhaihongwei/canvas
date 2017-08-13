var app = angular.module('kfl', ['ng', 'ngRoute']);
app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/main', {
			templateUrl: 'page/main.html',
			controller: 'mainCtrl'
		}) //detail/1
		.when('/detail/:myid', {
			templateUrl: 'page/detail.html',
			controller: 'detailCtrl'
		})
		.when('/order/:did', { //#/order/{{dish.did}}
			templateUrl: 'page/order.html',
			controller: 'orderCtrl'
		})
		.when('/myOrder', {
			templateUrl: 'page/myOrder.html',
			controller: 'myOrderCtrl'
		})
		.when('/start', {
			templateUrl: 'page/start.html'
		})
		.otherwise({
			redirectTo: '/start'
		})

}]);
app.config(function($httpProvider) {
	$httpProvider.defaults.headers.post = {
		'Content-Type': 'application/x-www-form-urlencoded'
	}
})
app.factory('tools', function($location) {
	var obj = {};
	obj.jump = function(url) {
		$location.path(url);
	}
	return obj;
})

app.controller('parentCtrl', ['$scope', '$location', 'tools', function($scope, $location, tools) {
	$scope.jump = tools.jump;
}])
app.controller('mainCtrl', ['$scope', '$http', function($scope, $http) {
	
	
		var start = 0;
		$scope.hasMore = true;
		$http({
			url: "http://47.92.37.168/kfl/dish_getbypage.php",
			method: "post",
			data: $.param({
				"start": start
			})
		}).success(function(data) {
			console.log(data);
			$scope.dishList = data;
		});
		$scope.$watch('kw', function() {
				if($scope.kw) {
//					$http.get('' + $rootScope.url + '/project/data/dish_getbykw.php?kw=' + $scope.kw).
//					success(function(data) {
//						$scope.dishList = data;
//					})
		$http({
			url: "http://47.92.37.168/kfl/dish_getbykw.php",
			method: "post",
			data: $.param({
				"kw": $scope.kw
			})
		}).success(function(data) {
			console.log(data);
			$scope.dishList = data;
		});
		
				}
		})

	}])
	//<button  ng-show="hasMore"  class="btn btn-block btn-success">加载更多</button>
app.directive('hasMore', function() {
	return {
		restrict: "E",
		template: '<button ng-show="hasMore">加载更多</button>',
		replace: true,
		link: function(scope, element, attr) {
			element.addClass("btn btn-block btn-success");
			element.on('click', function() {
				scope.loadMore();
			})
		},
		controller: function($scope, $http) {
			var start = 0;
			$scope.loadMore = function() {
				start += 5;
				$http({
					url: "http://47.92.37.168/kfl/dish_getbypage.php",
					method: "post",
					data: $.param({
						"start": start
					})
				}).success(function(data) {
					$scope.dishList = $scope.dishList.concat(data);
					if(data.length < 5) {
						$scope.hasMore = false;
					}
				})

			}
		}
	}
})
app.controller('detailCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
	//	var id = $routeParams.id; 
	//	alert(id);
	//路由参数
	$http({
		url: "http://47.92.37.168/kfl/dish_getbyid.php",
		method: "post",
		data: $.param({
			"id": $routeParams.myid //根据id的值 去后台查找这个菜 的详情
		})
	}).success(function(data) {
		$scope.dish = data[0];
		console.log($scope.dish);
		//		$scope.dishList = data;
	});
}])

app.controller('orderCtrl', function($scope, $routeParams, $http, $rootScope) {
	$scope.submitOrder = function() {
		$http({
			url: "http://47.92.37.168/kfl/order_add.php",
			method: "post",
			data: $.param({
				"user_name": $scope.user_name,
				"phone": $scope.phone, //订餐的时候的联系人手机号
				"addr": $scope.addr,
				"sex": $scope.sex, //
				"did": $routeParams.did
			})
		}).success(function(data) {
			if(data[0].msg == 'succ') {
				alert('订餐成功了');
				//			$rootScope.phone=$scope.phone;
				sessionStorage.setItem('phone', $scope.phone);
			}
		});

	}
})
app.controller('myOrderCtrl', function($scope, $http, $rootScope) {
	//第一步 就是拿到 订餐者的手机号
	//	alert(sessionStorage.getItem('phone'));
	//第二步 发起请求
	$http({
		url: "http://47.92.37.168/kfl/order_getbyphone.php",
		method: "post",
		data: $.param({
			phone: sessionStorage.getItem('phone')
		})
	}).success(function(data) {
		$scope.arr = data;
	});
})