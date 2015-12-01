/* global $ */
/* global angular */
(function() {
	"use strict";	
	
	angular.module('acNoteApp', ["ui.router", "ngAnimate", 'ui.bootstrap', 'ngSanitize','ngResource', 
		'pascalprecht.translate', 'ngJsTree', 'ngTouch', 'selectize', 'ui.tinymce', 'smart-table'])
		.run(['$rootScope', '$state', '$stateParams', '$modal', '$timeout', '$log', function ($rootScope,   $state,   $stateParams, $modal, $timeout, $log) {
			 $rootScope.$state = $state;
			 $rootScope.$stateParams = $stateParams;
			    
			 $rootScope.$on('$stateChangeStart', 
				function(event, toState, toParams, fromState, fromParams) {
					console.log('acNotes: state change start, target url is ' + toState.url + "; state is " + toState.name);
					
					if (toState.name === 'login' || toState.name === 'register') {
						if (angular.isDefined($rootScope.isLogin) && $rootScope.isLogin) {
							console.log('acNotes: state change failed: already login but ask for login page, redirect to home page...');
							event.preventDefault();
							$state.go("home.welcome");
						} 
						return;
					}  
					
					if (angular.isDefined($rootScope.isLogin) && $rootScope.isLogin) {
						return;
					}

					console.log('acNotes: state change failed: not login, redirect to login page...');
					event.preventDefault();
					$state.go("login");
				});
			}
		])

	.config(['$stateProvider', '$urlRouterProvider', '$translateProvider', function ($stateProvider, $urlRouterProvider, $translateProvider) {

      /////////////////////////////
      // Redirects and Otherwise //
      /////////////////////////////

      // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
      $urlRouterProvider

        // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
        .when('/welcome', '/home')
        .when('/about', '/home/about')

        // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
        .otherwise('/home');

      //////////////////////////
      // State Configurations //
      //////////////////////////

      // Use $stateProvider to configure your states.
      $stateProvider
	      
        .state("home", {
        	url: "/home",
        	abstract: true,
        	templateUrl: '/views/home.html',
        	controller: 'HomeController',
        	onEnter: function($rootScope) {
        		console.log('HIH Home: Entering page!');
        	}
        })
        .state('home.welcome', {
        	url: '',
        	templateUrl: '/views/welcome.html'
        })
        .state("home.note", {
	    	url: "/note",
	        abstract: true,
	        template: '<div ui-view></div>'
	    })
		.state('home.note.list', {
        	url: '/',
        	templateUrl: '/views/notelist.html',
			controller: 'NoteListController'
		})
        .state('home.note.create', {
        	url: '/create',
        	templateUrl: '/views/note.html',
			controller: 'NoteController'
        })
        .state('home.note.maintain', {
        	url: '/maintain/:id',
        	templateUrl: '/views/note.html',
			controller: 'NoteController'
        })
        .state('home.note.display', {
        	url: '/display/:id',
        	templateUrl: '/views/note.html',
			controller: 'NoteController'
        })
        .state('home.about', {
          url: '/about',
          templateUrl: '/views/about.html',
          controller: 'AboutController'
        })
		.state("login", {
			url: "/login",
			templateUrl: '/views/login.html',
			controller: 'LoginController'
		})
		.state('register', {
			url: '/register',
			templateUrl: '/views/register.html',
			controller: 'RegisterController'
		})
		;
		
		// Translate configurations
		$translateProvider.useStaticFilesLoader({
		    files: [{
		        prefix: 'locales/',
		        suffix: '.json'
		    }]
		});
		
		// Enable escaping of HTML
  		$translateProvider.useSanitizeValueStrategy('escaped');		
		$translateProvider.registerAvailableLanguageKeys(['en', 'zh'], {
		    'en_US': 'en',
		    'en_UK': 'en',
		    'zh_CN': 'zh',
			'zh-CN': 'zh'
		  })
		  .determinePreferredLanguage()
		  //.preferredLanguage('en')
		  .fallbackLanguage('en');		
	}])
	
	.factory('NoteApi', ["$resource", function($resource) {
    	return $resource('/api/note/:id',{id:'@ID'}, {
        	update: { method: 'PUT' },
			query:  { method: 'GET' },
			create: { method: 'POST' },
			delete: { method: 'DELETE' },
			get:    { method:'GET' }
    	});
	}])
	
	.controller('MainController', ['$scope', '$rootScope', '$log', '$translate', function($scope, $rootScope, $log, $translate) {
// 		$scope.currentTheme = "readable"; 
// 		
// 		var arCSS = utils.getThemeCSSPath($scope.currentTheme);
// 		$scope.bootstrapcss = arCSS[0];
// 		$scope.bootstrap_defaultcss = arCSS[1];
// 		
// 		$scope.$on('ThemeChange', function (oEvent, newtheme) {
// 			$log.info('HIH: Theme has changed!');
// 			
// 			if ($scope.currentTheme !== newtheme) {
// 				$scope.currentTheme = newtheme;
// 				
// 				var arCSS = utils.getThemeCSSPath($scope.currentTheme);
// 				$scope.bootstrapcss = arCSS[0];
// 				$scope.bootstrap_defaultcss = arCSS[1];
// 			}
// 		});
// 		
		$scope.$on('ShowMessage', function (oEvent, msgHeader, msgDetail, msgType, conf_func) {
			console.log('HIH: ShowMessage event occurred');
			
			if (conf_func && angular.isFunction(conf_func)) {
				window.swal({ title: msgHeader,   
					text: msgDetail,   
					type: msgType || "warning", 
					showCancelButton: true, 
					confirmButtonColor: "#DD6B55", 
					confirmButtonText: "Yes, delete it!", 
					closeOnConfirm: true }, 
					conf_func
					);
			} else {
				window.swal(msgHeader, msgDetail, msgType || "error");
			}
		});
 		
// 		$scope.$on('ShowMessageNeedTranslate', function (oEvent, msgHeaderStr, msgDetailStr, msgType, conf_func) {
// 			console.log('HIH: ShowMessage event occurred');
// 			
// 			$translate([msgHeaderStr, msgDetailStr]).then(function (translations) {
// 				var hdr = translations[msgHeaderStr];
// 				var dtal = translations[msgDetailStr];
// 
// 				if (conf_func && angular.isFunction(conf_func)) {
// 					window.swal({ title: hdr,   
// 								text: dtal,   
// 								type: msgType || "warning", 
// 								showCancelButton: true, 
// 								confirmButtonColor: "#DD6B55", 
// 								confirmButtonText: "Yes, delete it!", 
// 								closeOnConfirm: true }, 
// 								conf_func
// 					);
// 				} else {
// 					window.swal(hdr, dtal, msgType || "error");
// 				}
// 			});
// 		});
	}])
	
	.controller('HomeController', ['$scope', '$rootScope', '$state', '$resource', '$log', '$translate', 
		function($scope, $rootScope, $state, $resource, $log, $translate) {		
// 		$scope.CurrentUser = $rootScope.CurrentUser;
// 		
// 		// Load the finance setting out
// 		utils.loadFinanceSettingQ()
// 			.then(function(response) {
// 				// Do nothing here~~~
// 			}, function(reason) {
// 				$rootScope.$broadcast("ShowMessage", "Error", reason);
// 			});
// 		utils.loadFinanceExchangeRateInfoQ()
// 			.then(function(response) {
// 				// Do nothing here~~~
// 			}, function(reason) {
// 				$rootScope.$broadcast("ShowMessage", "Error", reason);
// 			});
// 		
// 		$scope.displayedCollection = [
// 			{userobj: 'ID', 		usercont: $scope.CurrentUser.userid},
// 			{userobj: 'Display As', usercont: $scope.CurrentUser.userdisplayas},
// 			{userobj: 'Gender',		usercont: utils.genderFormatter($scope.CurrentUser.usergender)},
// 			{userobj: 'Created On', usercont: $scope.CurrentUser.usercreatedon}
// 			];
// 		
 		$scope.logout = function() {
 			$log.info("acNotes: Logout triggerd!");

			var req = $resource('/api/logout');				
			req.save(function(response) {
				console.log("acNotes: Logout Successfully!");
				console.log(response);
				$rootScope.isLogin = false;
				
				$state.go("login");
			}, function(reason) {
				console.log("acNotes: Logout Failed!");
				console.log(reason);
				$rootScope.$broadcast('ShowMessage', "Error", reason.data.err);
			});
 		};
// 		$scope.setTheme = function(theme) {
// 			$log.info("HIH: Theme change triggerd!");
// 
// 			var realtheme = "";			
// 			if (theme && theme.length > 0) {
// 				// Now replace the CSS
// 				realtheme = theme;
// 			} else {
// 				// Go for default theme
// 				realtheme = "default";
// 			}			
// 			$rootScope.$broadcast('ThemeChange', realtheme);
// 		};
// 		
// 		$scope.setLanguage = function(newLang) {
// 			$log.info("HIH: Language change triggerd!");
// 			$translate.use(newLang);
// 			
// 		  	// if (newLang === "zh") {
// 			// 	i18nService.setCurrentLang('zh-CN');					  
// 			// } else {
// 			// 	i18nService.setCurrentLang('en');
// 			// }
// 		};
	}])

	.controller('NoteListController', ['$scope', '$rootScope', '$state', '$log', 'NoteApi', function($scope, $rootScope, $state, $log, NoteApi) {
		$scope.Notes = [];
		NoteApi.query().$promise.then(function(response) {
			$scope.Notes = response.json;
			$scope.dispList = [].concat($scope.Notes);
			}, function(reason) {
				// Error handling.
			});
	
		$scope.newItem = function() {
			$state.go('home.note.create');
		};
		
		$scope.displayItem = function(row) {
			var nID = "";
			if (row) {
				nID = row.ID;
			} else {
				for(var i = 0; i < $scope.dispList.length; i ++) {
					if ($scope.dispList[i].isSelected) {
						nID = $scope.dispList[i].ID;
						break;
					}
				}
			}
			
			$state.go("home.note.display",  { id : nID });
		};
		
		$scope.editItem = function(row) {
			var nID = "";
			if (row) {
				nID = row.ID;
			} else {
				for(var i = 0; i < $scope.dispList.length; i ++) {
					if ($scope.dispList[i].isSelected) {
						nID = $scope.dispList[i].ID;
						break;
					}
				}
			}
			
			$state.go("home.note.maintain",  { id : nID });
		};
		
		$scope.deleteItem = function(row) {
			if (row) {
				
			} else {
				
			}
		}		
	}])
	
	.controller('NoteController', ['$scope', '$rootScope', '$state', '$stateParams', '$log', 'NoteApi', function($scope, $rootScope, $state, $stateParams, $log, NoteApi) {
		$scope.isReadonly = false;
		$scope.ContentModified = false;
		$scope.NoteObject = new Note();
		
		//$scope.NoteObject = new 
		$scope.tinymceOptions = {
			onChange: function(e) {
				if (!$scope.isReadonly) {
					$scope.ContentModified = true;
				}
			},
			inline: false,
			menubar: false,
			statusbar: false,
			toolbar: "fontselect fontsizeselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link forecolor backcolor | removeformat",
			plugins : 'advlist autolink link image lists charmap print preview',
			skin: 'lightgray',
			theme : 'modern'
		};
			
		if (angular.isDefined($stateParams.id)) {
			if ($state.current.name === "home.note.maintain") {
			} else if ($state.current.name === "home.note.display") {
			    $scope.isReadonly = true;
			}
 				
			var nID = $stateParams.id;
			var newData = new NoteApi();
			newData.$get({id : nID}, 
				function(nte) {
      				$scope.NoteObject.fromJSON(nte.json);
    			}, function(reason) {
					
				});
		} else {
		    //$scope.Activity = "Common.Create";
		    //$scope.ActivityID = hih.Constants.UIMode_Create;
		};
		
		$scope.submit = function() {
			var newData = new NoteApi();
			newData.Name = $scope.NoteObject.Name;
			newData.Content = $scope.NoteObject.Content;
			
			newData.$save(function(response) {
				$state.go("home.note.display", { id : response.json.insertId });
			});
		}
		
		$scope.close = function() {
			$state.go('home.note.list');
		}
	}])
	
	.controller('ToDoListController', ['$scope', '$rootScope', '$state', '$http', '$log', function($scope, $rootScope, $state, $http, $log) {
		
	}])
	
	.controller('ToDoController', ['$scope', '$rootScope', '$state', '$http', '$log', function($scope, $rootScope, $state, $http, $log) {
		
	}])
	
	.controller('LoginController', ['$scope', '$rootScope', '$state', '$resource', '$translate', function($scope, $rootScope, $state, $resource, $translate) {
		$scope.credentials = {
			username: "",
			password: ""
		};
			
		$scope.login = function() {
			// Verify the inputs first!
			// To-Do
			
			// Then, real logon
			var req = $resource('/api/login');				
			req.save({ Name: $scope.credentials.username, Password: $scope.credentials.password }, function(response) {
				console.log("acNotes: Login Successfully!");
				console.log(response);
				$rootScope.isLogin = true;
				
				$state.go('home.welcome');
			}, function(reason) {
				console.log("acNotes: Login Failed!");
				console.log(reason);
				
				$rootScope.$broadcast('ShowMessage', "Error", reason.data.err);
			});
		};
		
		$scope.register = function() {
			$state.go('login.register');
		};
	}])
	
	// Register controller
	.controller('RegisterController', ['$scope', '$rootScope', '$state', '$translate', '$resource', function($scope, $rootScope, $state, $translate, $resource) {
		//$scope.registerInfo = new hih.UserRegistration();
		$scope.PasswordStrengthValue = 0;
		$scope.ProgressClass = "progress-bar progress-bar-danger";
		$scope.regGender = "0";
			
		// $scope.$watch('registerInfo', function(newVal, oldVal) {
		// 	if (newVal.Password !== oldVal.Password) {
		// 		//var nLevel = hih.ModelUtility.CheckPasswordStrength(newVal.Password);
		// 		if (nLevel === hih.Constants.Login_PwdStrgth_VeryStrong) {
		// 			$scope.PasswordStrengthValue = 100;
		// 			$scope.ProgressClass = "progress-bar progress-bar-success";
		// 		} else if (nLevel === hih.Constants.Login_PwdStrgth_Strong) {
		// 			$scope.PasswordStrengthValue = 80;
		// 			$scope.ProgressClass = "progress-bar progress-bar-info";
		// 			
		// 		} else if (nLevel === hih.Constants.Login_PwdStrgth_Normal) {
		// 			$scope.PasswordStrengthValue = 60;
		// 			$scope.ProgressClass = "progress-bar progress-bar-warning";
		// 		} else if (nLevel === hih.Constants.Login_PwdStrgth_Weak) {
		// 			$scope.PasswordStrengthValue = 30;
		// 			$scope.ProgressClass = "progress-bar progress-bar-danger";
		// 		} else {
		// 			$scope.PasswordStrengthValue = 0;
		// 			$scope.ProgressClass = "progress-bar progress-bar-danger";
		// 		}
		// 	}
		// }, true);
		
		$scope.submitRegister = function() {
			// $scope.registerInfo.Gender = parseInt($scope.regGender);
			// 
			// var msgs = $scope.registerInfo.Verify();
			// if ($.isArray(msgs) && msgs.length > 0) {
			// 	// To-Do
			// 	// 
			// 	$.each(msgs, function(idx, objMsg) {
			// 		$rootScope.$broadcast('ShowMessageNeedTranslate', objMsg, 'Common.Error', 'error');
			// 	})
			// 	return;	
			// } else {
			// 	utils.registerUserQ($scope.registerInfo)
			// 		.then(function(response) {
			// 			$state.go("login");
			// 		}, function(reason) {
			// 			$rootScope.$broadcast('ShowMessage', "Error", reason);
			// 		});
			// }
		};
		
		$scope.cancel = function() {
			$state.go('login');
		};
	}]);
})();
