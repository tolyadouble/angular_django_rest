var app = angular.module('wall_app', ['ngRoute', 'ngStorage']);
var api_host = 'http://127.0.0.1:8002';

app.config(function($routeProvider, $locationProvider, $httpProvider) {

    loginRedirect = {
        "check": function($location, $localStorage) {
            if($localStorage.token) {
                $location.path('/');
            }
        }
    };

    logOut = {
        "check": function($location, $localStorage) {
            delete $localStorage.token;
            delete $localStorage.username;
            $location.path('/login');
        }
    };

    $routeProvider.
    when('/', {
        templateUrl: 'static/js/templates/index.html',
        controller: 'IndexController'
    }).
    when('/users', {
        templateUrl: 'static/js/templates/users.html',
        controller: 'UsersController'
    }).
    when('/profile', {
        templateUrl: 'static/js/templates/profile.html',
        controller: 'ProfileController'
    }).
    when('/add_post', {
        templateUrl: 'static/js/templates/add_post.html',
        controller: 'AddPostController'
    }).
    when('/my_posts', {
        templateUrl: 'static/js/templates/my_posts.html',
        controller: 'MyPostsController'
    }).
    when('/login', {
        templateUrl: 'static/js/templates/login.html',
        controller: 'LoginController',
        resolve: loginRedirect
    }).
    when('/logout', {
        resolve: logOut
    }).
    when('/signup', {
        templateUrl: 'static/js/templates/signup.html',
        controller: 'SignupController',
        resolve: loginRedirect
    }).
    otherwise({templateUrl:'static/js/templates/404.html'});

    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
        return {
            'request': function(config) {
                config.headers = config.headers || {};
                if ($localStorage.token) {
                    config.headers.Authorization = 'Token ' + $localStorage.token;
                }
                return config;
            },
            'responseError': function(response) {
                if(response.status === 401 || response.status === 403) {
                    $location.path('/login');
                }
                return $q.reject(response);
            }
        };
    }]);

});

app.filter('djangoDate', function() {
    return function(item) {
        return new Date(item).getTime();
    };
});

app.controller('MainController', function($scope, $localStorage) {
    $scope.global = {};
    $scope.global = $localStorage;
});

app.controller('IndexController', function($scope, $http) {
    $http.get(api_host + '/api/posts').then(function(response) {
        $scope.posts = response.data;
    });
});

app.controller('UsersController', function($scope, $http) {
    $http.get(api_host + '/api/users').then(function(response) {
        $scope.users = response.data;
    });
});

app.controller('ProfileController', function($scope, $http, $location, $localStorage) {
    $http.get(api_host + '/api/users/' + $localStorage.username).then(function(response) {
        $scope.user = response.data;
    });

    $scope.patchProfileForm = function() {
        data = {
            'email': $scope.user.email,
            'first_name': $scope.user.first_name,
            'last_name': $scope.user.last_name
        };
        $http.patch(api_host + '/api/users/' + $localStorage.username, data).then(function(response) {
            $scope.errors = {};
            $location.path('/');
        }, function errorCallback(response) {
            $scope.errors = response.data;
        });
    };
});

app.controller('AddPostController', function($scope, $http, $location, $localStorage) {
    $scope.post = {};

    $scope.postAddPost = function() {
        data = {
            'title': $scope.post.title,
            'body': $scope.post.body,
        };
        $http.post(api_host + '/api/users/' + $localStorage.username + '/posts', data).then(function(response) {
            $scope.errors = {};
            $location.path('/');
        }, function errorCallback(response) {
            $scope.errors = response.data;
        });
    };
});

app.controller('MyPostsController', function($scope, $http, $localStorage) {
    $http.get(api_host + '/api/users/' + $localStorage.username + '/posts').then(function(response) {
        $scope.posts = response.data;
    });
});

app.controller('LoginController', function($scope, $localStorage, $http, $location, $timeout) {
    $scope.errors = {};

    $scope.postLoginForm = function() {
        data = {
            'username': $scope.username,
            'password': $scope.password,
        };
        $http.post(api_host + '/api/login', data).then(function(response) {
            $scope.errors = {};
            $localStorage.username = $scope.username;
            $localStorage.token = response.data.token;
            $timeout(function() {
                $scope.global = $localStorage;
                $location.path('/');
            });
        }, function errorCallback(response) {
            $scope.errors = response.data;
        });
    };
});

app.controller('SignupController', function($scope, $localStorage, $http, $location, $timeout) {
    $scope.errors = {};

    $scope.postSignup = function() {
        data = {
            'username': $scope.username,
            'email': $scope.email,
            'first_name': $scope.first_name,
            'last_name': $scope.last_name,
            'password': $scope.password,
            'confirm_password': $scope.confirm_password
        };
        $http.post(api_host + '/api/users', data).then(function(response) {
            $scope.errors = {};
            $location.path('/login');
        }, function errorCallback(response) {
            $scope.errors = response.data;
        });
    };
});