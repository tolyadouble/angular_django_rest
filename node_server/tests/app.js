var api_host = 'http://127.0.0.1:8002';
function isEmptyDict(d){for (var k in d) return false; return true}

describe('testModuleInit', function() {

    beforeEach(function () {
        module('wall_app');
    });

    it('testNotNull', function() {
        expect(module).not.to.equal(null);
    });

});

describe('testRouteResolves', function() {

    beforeEach(function () {
        module('wall_app');
        inject(function (_$route_) {
          route = _$route_;
        });
    });

    beforeEach(inject(function($injector) {
        $localStorage = $injector.get('$localStorage');
        $location = $injector.get('$location');
        $localStorage.username = 'test';
        $localStorage.token = '12345';
    }));

    it('testLogin', function() {
        var logoutRoute = route.routes['/login'];
        logoutRoute.resolve['check']($location, $localStorage);
        expect($localStorage.username).to.equal('test');
        expect($localStorage.token).to.equal('12345');
    });

    it('testLogout', function() {
        var logoutRoute = route.routes['/logout'];
        logoutRoute.resolve['check']($location, $localStorage);
        expect($localStorage.username).to.equal(undefined);
        expect($localStorage.token).to.equal(undefined);
    });

});

describe('testDjangoDateFilter', function() {

    var $filter;

    beforeEach(function () {
        module('wall_app');
        inject(function (_$filter_) {
          $filter = _$filter_;
        });
    });

    it('testDate', inject(function($filter) {
        result = $filter('djangoDate')('2016-05-30T10:24:16.000000Z');
        expect(result).to.equal(Date.parse('May 30, 2016 1:24:16 PM'));
    }));

});

describe('testMainController', function() {

    var $controller;

    beforeEach(function() {
        module('wall_app');
        inject(function(_$controller_) {
          $controller = _$controller_;
        });
    });

    it('injectScope', inject(function($filter) {
        var $scope = {};
        var controller = $controller('MainController', { $scope: $scope });
        expect($scope.global).not.to.equal({});
    }));

});

describe('testIndexController', function() {

    var $controller;

    beforeEach(function() {
        module('wall_app');
        inject(function(_$controller_) {
          $controller = _$controller_;
        });
    });

    beforeEach(inject(function($injector) {
        var posts = [{
            'id':1,
            'author': {
                'id':1,
                'username':'test',
                'email':'test@test.te',
                'first_name':'test',
                'last_name':'test'
            },
            'title':'test',
            'body':'test',
            'created_at':'2016-05-30T10:24:16.040622Z'
        }]
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.whenGET(api_host + '/api/posts').respond(posts);
    }));

    it('testHttpRequest', inject(function($injector) {
        var $scope = {};
        var controller = $controller('IndexController', { $scope: $scope });
        $httpBackend.flush();
        expect($scope.posts.length).to.equal(1);
    }));

});

describe('testUsersController', function() {

    var $controller;

    beforeEach(function() {
        module('wall_app');
        inject(function(_$controller_) {
          $controller = _$controller_;
        });
    });

    beforeEach(inject(function($injector) {
        var users = [{
            'id': 1,
            'username': 'test',
            'email': 'test@test.te',
            'first_name': 'test',
            'last_name': 'test'
        }]
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.whenGET(api_host + '/api/users').respond(users);
    }));

    it('testHttpRequest', inject(function($injector) {
        var $scope = {};
        var controller = $controller('UsersController', { $scope: $scope });
        $httpBackend.flush();
        expect($scope.users.length).to.equal(1);
    }));

});

describe('testProfileController', function() {

    var $controller;
    var username = 'test'

    beforeEach(function() {
        module('wall_app');
        inject(function(_$controller_) {
          $controller = _$controller_;
        });
    });

    beforeEach(inject(function($injector) {
        var user_data_response = {
            'id': 1,
            'username': 'test',
            'email': 'test@test.te',
            'first_name': 'test',
            'last_name': 'test'
        }
        $httpBackend = $injector.get('$httpBackend');
        $localStorage = $injector.get('$localStorage');
        $localStorage.username = 'test';
        $httpBackend.whenGET(api_host + '/api/users/' + $localStorage.username).respond(user_data_response);
    }));

    it('testHttpRequest', inject(function($injector) {
        var $scope = {};
        var controller = $controller('ProfileController', { $scope: $scope });
        $httpBackend.flush();
        expect($scope.user.id).to.equal(1);
        expect($scope.user.username).to.equal('test');
        expect($scope.user.email).to.equal('test@test.te');
        expect($scope.user.first_name).to.equal('test');
        expect($scope.user.last_name).to.equal('test');
    }));

    it('testPatchProfileRequestOk', inject(function($injector) {
        var $scope = {};
        var controller = $controller('ProfileController', { $scope: $scope });
        $scope.user = {
            'id': 1,
            'email': 'test@test.te',
            'first_name': 'test',
            'last_name': 'test'
        };
        $scope.patchProfileForm();
        $httpBackend.whenPATCH(api_host + '/api/users/' + $localStorage.username).respond($scope.user);
        $httpBackend.flush();
        expect(isEmptyDict($scope.errors)).to.be.true;
        expect($scope.user.id).to.equal(1);
        expect($scope.user.username).to.equal('test');
        expect($scope.user.email).to.equal('test@test.te');
        expect($scope.user.first_name).to.equal('test');
        expect($scope.user.last_name).to.equal('test');
    }));

    it('testPatchProfileRequestFail', inject(function($injector) {
        var $scope = {};
        var controller = $controller('ProfileController', { $scope: $scope });
        var fail_response = {
            'first_name': [
                'This field may not be blank.'
            ],
            'last_name': [
                'This field may not be blank.'
            ],
            'email': [
                'This field may not be blank.'
            ]
        };
        $scope.user = {
            'id': 1,
            'email': 'test@test.te',
            'first_name': 'test',
            'last_name': 'test'
        };
        $scope.patchProfileForm();
        $httpBackend.whenPATCH(api_host + '/api/users/' + $localStorage.username).respond(403, fail_response);
        $httpBackend.flush();
        expect($scope.user.id).to.equal(1);
        expect(isEmptyDict($scope.errors)).to.be.false;
    }));

});

describe('testAddPostController', function() {

    var $controller;
    var username = 'test'

    beforeEach(function() {
        module('wall_app');
        inject(function(_$controller_) {
          $controller = _$controller_;
        });
    });

    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $localStorage = $injector.get('$localStorage');
    }));

    it('testPostAddPostOk', inject(function($injector) {
        var $scope = {};
        var controller = $controller('AddPostController', { $scope: $scope });
        $scope.post = {
            'title': 'test',
            'body': 'test'
        };
        $scope.postAddPost();
        $httpBackend.whenPOST(api_host + '/api/users/' + $localStorage.username + '/posts').respond($scope.post);
        $httpBackend.flush();
        expect(isEmptyDict($scope.errors)).to.be.true;
    }));

    it('testPostAddPostFail', inject(function($injector) {
        var $scope = {};
        var controller = $controller('AddPostController', { $scope: $scope });
        var fail_response = {
            'title': [
                'This field may not be blank.'
            ],
            'body': [
                'This field may not be blank.'
            ]
        };
        $scope.postAddPost();
        $httpBackend.whenPOST(api_host + '/api/users/' + $localStorage.username + '/posts').respond(403, fail_response);
        $httpBackend.flush();
        expect(isEmptyDict($scope.errors)).to.be.false;
    }));

});

describe('testMyPostsController', function() {

    var $controller;
    var username = 'test'

    beforeEach(function() {
        module('wall_app');
        inject(function(_$controller_) {
          $controller = _$controller_;
        });
    });

    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $localStorage = $injector.get('$localStorage');
    }));

    it('testHttpRequest', inject(function($injector) {
        var $scope = {};
        var controller = $controller('MyPostsController', { $scope: $scope });
        var posts = [{
            'id':1,
            'author': {
                'id':1,
                'username':'test',
                'email':'test@test.te',
                'first_name':'test',
                'last_name':'test'
            },
            'title':'test',
            'body':'test',
            'created_at':'2016-05-30T10:24:16.040622Z'
        }]
        $httpBackend.whenGET(api_host + '/api/users/' + $localStorage.username + '/posts').respond(posts);
        $httpBackend.flush();
        expect($scope.posts.length).to.equal(1);
    }));

});

describe('testLoginController', function() {

    var $controller;
    var username = 'test'

    beforeEach(function() {
        module('wall_app');
        inject(function(_$controller_) {
          $controller = _$controller_;
        });
    });

    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $localStorage = $injector.get('$localStorage');
    }));

    it('testHttpRequestOk', inject(function($injector, $timeout) {
        var $scope = {};
        var controller = $controller('LoginController', { $scope: $scope });
        var token = {
            'token': '12345'
        } ;
        $scope.username = 'test'
        $scope.postLoginForm();
        $httpBackend.whenPOST(api_host + '/api/login').respond(token);
        $httpBackend.flush();
        $timeout.flush()
        expect($localStorage.username).to.equal('test');
        expect($localStorage.token).to.equal(token['token']);
        expect($localStorage.username).to.equal($scope.global.username);
        expect($localStorage.token).to.equal($scope.global.token);
    }));

    it('testHttpRequestFail', inject(function($injector) {
        var $scope = {};
        var controller = $controller('LoginController', { $scope: $scope });
        var fail_response = {
          'non_field_errors': [
            'Unable to log in with provided credentials.'
          ]
        };
        $scope.postLoginForm();
        $httpBackend.whenPOST(api_host + '/api/login').respond(403, fail_response);
        $httpBackend.flush();
        expect(isEmptyDict($scope.errors)).to.be.false;
    }));

});

describe('testSignupController', function() {

    var $controller;
    var username = 'test'

    beforeEach(function() {
        module('wall_app');
        inject(function(_$controller_) {
          $controller = _$controller_;
        });
    });

    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $localStorage = $injector.get('$localStorage');
    }));

    it('testHttpRequestOk', inject(function($injector, $timeout) {
        var $scope = {};
        var controller = $controller('SignupController', { $scope: $scope });
        var token = {
            'token': '12345'
        } ;
        $scope.username = 'test'
        $scope.email = 'test@test.te'
        $scope.first_name = 'test'
        $scope.last_name = 'test'
        $scope.password = '123'
        $scope.confirm_password = '123'
        $scope.postSignup();
        $httpBackend.whenPOST(api_host + '/api/users').respond(token);
        $httpBackend.flush();
        expect(isEmptyDict($scope.errors)).to.be.true;
    }));

    it('testHttpRequestFail', inject(function($injector) {
        var $scope = {};
        var controller = $controller('SignupController', { $scope: $scope });
        var fail_response = {
            'username': [
                'This field may not be blank.'
            ],
            'confirm_password': [
                'This field is required.'
            ],
            'first_name': [
                'This field is required.'
            ],
            'last_name': [
                'This field is required.'
            ],
            'password': [
                'This field is required.'
            ],
            'email': [
                'This field may not be blank.'
            ]
        };
        $scope.postSignup();
        $httpBackend.whenPOST(api_host + '/api/users').respond(403, fail_response);
        $httpBackend.flush();
        expect(isEmptyDict($scope.errors)).to.be.false;
    }));

});
