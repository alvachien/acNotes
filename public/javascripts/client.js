/* global $ */
/* global angular */
(function() {
	"use strict";	
	
	angular.module('acNoteApp', ["ui.router", "ngAnimate", 'ui.bootstrap', 'ngSanitize', 
		'pascalprecht.translate', 'ngJsTree', 'ngTouch', 'selectize'])
		.run(['$rootScope', '$state', '$stateParams', '$modal', '$timeout', '$log', function ($rootScope,   $state,   $stateParams, $modal, $timeout, $log) {
			 $rootScope.$state = $state;
			 $rootScope.$stateParams = $stateParams;
			    
			 $rootScope.$on('$stateChangeStart', 
		    		function(event, toState, toParams, fromState, fromParams) {
		    			console.log('HIH: state change start, target url is ' + toState.url + "; state is " + toState.name);
		    			
// 		    			if (toState.name === 'login' || toState.name === 'register') {
// 		    				if (angular.isDefined($rootScope.isLogin) && $rootScope.isLogin) {
// 		    					console.log('HIH: state change failed: already login but ask for login page, redirect to home page...');
// 		    					event.preventDefault();
// 		    					$state.go("home.welcome");
// 		    				} 
// 		    				return;
// 		    			}  
// 		    			
// 		    			if (angular.isDefined($rootScope.isLogin) && $rootScope.isLogin) {
// 		    				return;
// 		    			}
// 
// 		    			console.log('HIH: state change failed: not login, redirect to login page...');
// 	    		    	event.preventDefault();
// 	    		    	$state.go("login");
			    	}
			    );
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
        .state('home.node.create', {
        	url: '/create',
        	templateUrl: '/views/note.html',
			controller: 'NoteController'
        })
        .state('home.node.maintain', {
        	url: '/maintain/:id',
        	templateUrl: '/views/note.html',
			controller: 'NoteController'
        })
        .state('home.node.display', {
        	url: '/display/:id',
        	templateUrl: '/views/note.html',
			controller: 'NoteController'
        })
        .state('home.about', {
          url: '/about',
          templateUrl: '/views/about.html',
          controller: 'AboutController'
        });
		
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
	
	.controller('MainController', ['$scope', '$rootScope', '$log', '$translate', function($scope, $rootScope, $log, $translate) {
		$log.info("Entering MainController...");
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
// 		$scope.$on('ShowMessage', function (oEvent, msgHeader, msgDetail, msgType, conf_func) {
// 			console.log('HIH: ShowMessage event occurred');
// 			
// 			if (conf_func && angular.isFunction(conf_func)) {
// 				window.swal({ title: msgHeader,   
// 					text: msgDetail,   
// 					type: msgType || "warning", 
// 					showCancelButton: true, 
// 					confirmButtonColor: "#DD6B55", 
// 					confirmButtonText: "Yes, delete it!", 
// 					closeOnConfirm: true }, 
// 					conf_func
// 					// function() { 
// 					// 	window.swal("Deleted!", "Your imaginary file has been deleted.", "success"); 
// 					// }
// 					);
// 			} else {
// 				window.swal(msgHeader, msgDetail, msgType || "error");
// 			}
// 		});
// 		
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
	
	.controller('HomeController', ['$scope', '$rootScope', '$state', '$http', '$log', '$translate', 
		function($scope, $rootScope, $state, $http, $log, $translate) {		
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
// 		$scope.logout = function() {
// 			$log.info("HIH: Logout triggerd!");
// 			utils.sendRequest( { objecttype: 'USERLOGOUT' }, function (data, status, headers, config) {
// 				
// 				// Clear the current user information
// 				$rootScope.isLogin = false;
// 				$rootScope.CurrentUser = {};
// 				$scope.CurrentUser = {};
// 				
// 				// Redirect to login page
// 				$state.go('login');
// 			}, function(data, status, headers, config) {
// 				// Throw out error message				
// 				$rootScope.$broadcast('ShowMessage', 'Error', 'Failed to logout!');
// 			});
// 		};
// 		
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

	.controller('NoteListController', ['$scope', '$rootScope', '$state', '$http', '$log', function($scope, $rootScope, $state, $http, $log) {
	}])
	.controller('NoteController', ['$scope', '$rootScope', '$state', '$http', '$log', function($scope, $rootScope, $state, $http, $log) {
	}])
	
	;
})();
