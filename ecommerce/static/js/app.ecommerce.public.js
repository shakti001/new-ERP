var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'flash', 'ngSanitize', 'mwl.confirm', 'ui.bootstrap.datetimepicker', 'rzModule', 'ngMeta', 'angular-owl-carousel-2']);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider, $provide, $locationProvider) {

  $urlRouterProvider.otherwise('/');
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  $httpProvider.defaults.withCredentials = true;
  $locationProvider.html5Mode(true);
  // $cookies.set("time" : new Date())
});

app.run(['$rootScope', '$state', '$stateParams', '$users', '$http', function($rootScope, $state, $stateParams, $users, $http, $timeout) {
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    $rootScope.preloader = true
  })
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  $rootScope.previousState;
  $rootScope.currentState;
  var startTime = new Date();
  $rootScope.$on("$stateChangeError", console.log.bind(console));
  $rootScope.$on("$stateChangeSuccess", function(params, to, toParams, from, fromParams) {
    $rootScope.preloader = false
    $rootScope.previousState = from.name;
    $rootScope.currentState = to.name;

    document.getElementById('hidemeinallpage').style.display = 'none'
    document.getElementById("catpositionfetch").style.display = "none";
    document.getElementById("searchinnav").style.display = "none";
    document.getElementById("wishicons").style.display = "none";
    document.getElementById("logoinnav").style.display = "none";
    if ($rootScope.$state.current.name == 'ecommerce') {
      document.getElementById('hidemeinallpage').style.display = 'block'
      window.addEventListener("scroll", function(event) {
        if (this.scrollY < 195 && $rootScope.$state.current.name == 'ecommerce') {
          console.log("lllllllllllkkkkkkkkkkkkkkkkk");
          document.getElementById("catpositionfetch").style.display = "none";
          document.getElementById("searchinnav").style.display = "none";
          document.getElementById("wishicons").style.display = "none";
          document.getElementById("logoinnav").style.display = "none";
        } else {
          document.getElementById("catpositionfetch").style.display = "none";
          document.getElementById("searchinnav").style.display = "block";
          document.getElementById("wishicons").style.display = "inline";
          document.getElementById("logoinnav").style.display = "inline";
        }

      });

    } else {
      document.getElementById('hidemeinallpage').style.display = 'none'
      document.getElementById("catpositionfetch").style.display = "none";
      document.getElementById("searchinnav").style.display = "block";
      document.getElementById("wishicons").style.display = "inline";
      document.getElementById("logoinnav").style.display = "inline";
    }

    setTimeout(function() {
      window.scrollTo(0, 0);
    }, 1000)



    var me = $users.get('mySelf');

    var now = new Date();
    var timeSpent = (now.getTime() - startTime.getTime()) / 1000;
    startTime = new Date();
    // console.log('time spent', timeSpent, 'on', $rootScope.previousState);


    function getCookie(cname) {
      // console.log(cname, '##################################');
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      // console.log(decodedCookie, 'hhhhhhhhhhhhhhhhhhhhhh');
      var ca = decodedCookie.split(';');
      // console.log(ca);
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }

    function setCookie(cname, cvalue, exdays) {
      // console.log('set cookie');
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    if (me != null) {
      if ($rootScope.previousState == '') {
        // console.log('logged in ');
        dataToSend = {
          user: me.pk,
          typ: 'loggedIn'
        }

      }

      if ($rootScope.previousState == 'details') {
        var data = {
          timeSpent: timeSpent,
          product: fromParams.id
        }
        data = JSON.stringify(data)
        dataToSend = {
          user: me.pk,
          typ: 'productView',
          product: fromParams.id,
          data: data
        }
        $http({
          method: 'POST',
          url: '/api/ecommerce/activities/',
          data: dataToSend
        }).
        then(function(response) {})
      }

      if ($rootScope.previousState == 'categories') {
        var data = {
          timeSpent: timeSpent,
          category: fromParams.name
        }
        data = JSON.stringify(data)
        dataToSend = {
          user: me.pk,
          typ: 'categoryView',
          data: data
        }
        $http({
          method: 'POST',
          url: '/api/ecommerce/activities/',
          data: dataToSend
        }).
        then(function(response) {})
      }
    } else {
      // console.log('cookieeee', $rootScope.previousState);
      if ($rootScope.previousState == 'details') {
        // console.log(fromParams);
        var data = {
          timeSpent: timeSpent,
          product: fromParams.id
        }
        data = JSON.stringify(data)
        dataToSend = {
          typ: 'productView',
          product: fromParams.id,
          data: data
        }
        detail = getCookie("unknownUserRecentViewed");
        if (detail != "") {
          // console.log('already there');
          document.cookie = encodeURIComponent("unknownUserRecentViewed") + "=deleted; expires=" + new Date(0).toUTCString()
        }
        setCookie("unknownUserRecentViewed", JSON.stringify(dataToSend), 365);
      }
    }

  });
}]);


app.config(function($stateProvider) {

  $stateProvider
    .state('ecommerce', {
      url: "/",
      templateUrl: '/static/ngTemplates/app.ecommerce.list.html',
      controller: 'controller.ecommerce.list'
    })


  $stateProvider
    .state('categories', {
      url: "/categories/:id/:name",
      templateUrl: '/static/ngTemplates/app.ecommerce.categories.html',
      controller: 'controller.ecommerce.categories'
    })

  $stateProvider
    .state('details', {
      url: "/details/:id/:name/:vid",
      templateUrl: '/static/ngTemplates/app.ecommerce.details.html',
      controller: 'controller.ecommerce.details'
    })



  //
  // $stateProvider
  //   .state('blog', {
  //     url: "/blog",
  //     templateUrl: '/static/ngTemplates/app.ecommerce.blog.html',
  //     controller: 'controller.ecommerce.blog'
  //   })
  $stateProvider.state('orderSuccessful', {
    url: "/orderSuccessful/",
    templateUrl: '/static/ngTemplates/app.ecommerce.orderSuccessfull.html',
    controller: 'controller.ecommerce.orderSuccessfull'
  })
  $stateProvider.state('orderFailure', {
    url: "/orderFailure",
    templateUrl: '/static/ngTemplates/app.ecommerce.orderFailure.html',
    controller: 'controller.ecommerce.orderFailure'
  })
  //
  //
  // $stateProvider
  //   .state('pages', {
  //     url: "/:title",
  //     templateUrl: '/static/ngTemplates/app.ecommerce.PagesDetails.html',
  //     controller: 'controller.ecommerce.PagesDetails'
  //   })
  //
  //
  //
  //
  //   $stateProvider
  //     .state('explore', {
  //       url: "/explore/",
  //       templateUrl: '/static/ngTemplates/app.ecommerce.explore.html',
  //       controller: 'controller.ecommerce.explore'
  //     })
  //     $stateProvider
  //       .state('expand', {
  //         url: "/expand/",
  //         templateUrl: '/static/ngTemplates/app.ecommerce.expand.html',
  //         controller: 'controller.ecommerce.expand'
  //       })
  //

  $stateProvider
    .state('checkout', {
      url: "/checkout",
      templateUrl: '/static/ngTemplates/app.ecommerce.checkout.html',
      controller: 'controller.ecommerce.checkout'
    })

  $stateProvider
    .state('address', {
      url: "/checkout/address",
      templateUrl: '/static/ngTemplates/app.ecommerce.address.html',
      controller: 'controller.ecommerce.address'
    })

  $stateProvider
    .state('payment', {
      url: "/checkout/payment",
      templateUrl: '/static/ngTemplates/app.ecommerce.payment.html',
      controller: 'controller.ecommerce.payment'
    })

  //
  //
  // $stateProvider
  //   .state('account', {
  //     url: "/user/account",
  //     views: {
  //       "": {
  //         templateUrl: '/static/ngTemplates/app.ecommerce.account.html',
  //       },
  //       "menu@account": {
  //         templateUrl: '/static/ngTemplates/app.ecommerce.account.menu.html',
  //       },
  //       "topMenu@account": { //this is for top menu for mobile view
  //         templateUrl: '/static/ngTemplates/app.ecommerce.account.topMenu.html',
  //       },
  //       "@account": {
  //         templateUrl: '/static/ngTemplates/app.ecommerce.account.default.html',
  //       }
  //     }
  //   })
  //
  //   .state('account.cart', {
  //     url: "/cart",
  //     templateUrl: '/static/ngTemplates/app.ecommerce.account.cart.html',
  //     controller: 'controller.ecommerce.account.cart'
  //   })
  //   .state('account.orders', {
  //     url: "/orders",
  //     templateUrl: '/static/ngTemplates/app.ecommerce.account.orders.html',
  //     controller: 'controller.ecommerce.account.orders'
  //   })
  //   .state('account.settings', {
  //     url: "/settings",
  //     templateUrl: '/static/ngTemplates/app.ecommerce.account.settings.html',
  //     controller: 'controller.ecommerce.account.settings'
  //   })
  //   .state('account.support', {
  //     url: "/support",
  //     templateUrl: '/static/ngTemplates/app.ecommerce.account.support.html',
  //     controller: 'controller.ecommerce.account.support'
  //   })
  //   .state('account.saved', {
  //     url: "/saved",
  //     templateUrl: '/static/ngTemplates/app.ecommerce.account.saved.html',
  //     controller: 'controller.ecommerce.account.saved'
  //   })



});


app.controller('controller.ecommerce.explore', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash, $window) {


})



app.controller('controller.ecommerce.orderSuccessfull', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash, $window) {
  $scope.currency = "fa-inr";
  var prts = location.href.split('orderid=')
  $scope.orderID = prts[prts.length - 1]

  $http({
    method: 'GET',
    url: '/api/POS/order/' + $scope.orderID + '/'
  }).
  then(function(response) {
    $scope.order = response.data;
  })

})


app.controller('controller.ecommerce.orderFailure', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash, $window) {
  // console.log('bloggggggggggggggggggggggggggggggggggg', BRAND_TITLE);


  // var prts  = location.href.split('orderid=')
  // $scope.orderID = prts[prts.length -1]

  console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjj');
  // $scope.pay = function() {
  //   $scope.dataToSend.modeOfPayment = $scope.data.modeOfPayment
  //   $scope.dataToSend.modeOfShopping = 'online'
  //   $scope.dataToSend.paidAmount = 0
  //   $scope.dataToSend.approved = false
  //   $scope.data.stage = 'processing'
  //   if ($scope.shippingCharges > 0) {
  //     $scope.dataToSend.shippingCharges = $scope.shippingCharges
  //   }
  //
  //   $http({
  //     method: 'POST',
  //     url: '  /api/ecommerce/createOrder/',
  //     data: $scope.dataToSend
  //   }).
  //   then(function(response) {
  //     window.location = '/makeOnlinePayment/?orderid=' + response.data.odnumber;
  //   })
  // }

  $scope.orderID = 261
  $scope.orderqty = 513
  $scope.payMoney = function() {
    window.location = '/makeOnlinePayment/?orderid=' + $scope.orderID;
  }

})

app.controller('controller.ecommerce.blog', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash, $window) {

})

app.controller('ecommerce.body', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash, $window) {



});

app.controller('controller.ecommerce.details', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash, $window, ngMeta, $filter, Flash) {


  $scope.currency = 'fa-inr'

  $scope.id = $state.params.id
  $scope.imagecall = function(image) {
    $scope.imgData = image
  }

  $scope.scrollme = function() {
    var scrollem = document.getElementById('continersss');
    scrollem.scrollTop -= 150;
  }

  $scope.scrollmedec = function() {
    var scrollem = document.getElementById('continersss');
    scrollem.scrollTop += 150;
  }


  $scope.selectedProdVar = {
    data: {},
    value: {},
  }

  $http({
    method: 'GET',
    url: '/api/POS/productDetails/' + $scope.id + '/'
  }).
  then(function(response) {
    $scope.details = response.data
    $scope.selectedProdVar.data = $scope.details.options.options[0]
    if ($scope.selectedProdVar.data.options.length > 0) {
      $scope.imgData = ''
      $scope.selectedProdVar.value = $scope.selectedProdVar.data.options[0]
      if ($scope.selectedProdVar.value.images.length > 0) {
        $scope.imgData = $scope.selectedProdVar.value.images[0].attachment
      }
      if (me != null) {
        for (var i = 0; i < $rootScope.cartData.length; i++) {
          if ($rootScope.cartData[i].productVariant.pk == $scope.selectedProdVar.value.pk) {
            $scope.selectedProdVar.value.cart = $rootScope.cartData[i].qty
            $scope.selectedProdVar.value.cartPk = $rootScope.cartData[i].pk
            $scope.selectedProdVar.value.customDetails = $rootScope.cartData[i].customDetails
            $scope.selectedProdVar.value.customFile = $rootScope.cartData[i].customFile
          }
        }
      } else {
        for (var i = 0; i < $rootScope.addToCart.length; i++) {
          if ($rootScope.addToCart[i].productVariant == $scope.selectedProdVar.value.pk) {
            $scope.selectedProdVar.value.cart = $rootScope.addToCart[i].qty
          }
        }
      }
    }
  })


  $scope.deletecustomization = function() {
    var patchdata = {
      customFile: null,
      customDetails: null
    }
    $http({
      method: 'PATCH',
      url: '/api/POS/cart/' + $scope.selectedProdVar.value.cartPk + '/',
      data: patchdata,
    }).
    then(function(response) {
      for (var i = 0; i < $rootScope.cartData.length; i++) {
        if ($rootScope.cartData[i].pk == $scope.selectedProdVar.value.cartPk) {
          $rootScope.cartData[i] = response.data
          $scope.selectedProdVar.value.customDetails = response.data.customDetails;
          $scope.selectedProdVar.value.customFile = response.data.customFile;
        }
      }
    })
  }

  $scope.getcustomization = function() {
    if ($scope.selectedProdVar.value.cartPk) {
      $scope.trackItem = $scope.selectedProdVar.value.cartPk;
    } else {
      $scope.trackItem = '';
    }
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.ecommerce.getcustomization.html',
      size: 'lg',
      backdrop: true,
      resolve: {
        cartPk: function() {
          return $scope.trackItem;
        },
        selectedProdVarpk: function() {
          return $scope.selectedProdVar.value.pk;
        },
        productpk: function() {
          return $scope.details.pk;
        },
      },
      controller: function($scope, cartPk, $state, $http, $timeout, $uibModal, $users, Flash, $uibModalInstance, selectedProdVarpk, productpk) {

        $scope.customData = {
          'customFile': emptyFile,
          'customDetails': ''
        }
        $scope.cartPk = cartPk

        if ($scope.cartPk > 0) {
          for (var i = 0; i < $rootScope.cartData.length; i++) {
            console.log($rootScope.cartData[i].pk, "1");
            console.log($scope.cartPk, "2");
            if ($rootScope.cartData[i].pk == $scope.cartPk) {
              $scope.customData = $rootScope.cartData[i]
              console.log($scope.customData);
            }
          }
        }

        $scope.uploadcustomization = function() {

          var fd = new FormData()
          if ($scope.customData.customFile != null && $scope.customData.customFile != emptyFile) {
            fd.append('customFile', $scope.customData.customFile);
          }
          if ($scope.customData.customDetails.length > 0) {
            fd.append('customDetails', $scope.customData.customDetails);
          }
          if ($scope.cartPk) {
            $http({
              method: 'PATCH',
              url: '/api/POS/cart/' + $scope.customData.pk + '/',
              transformRequest: angular.identity,
              headers: {
                'Content-Type': undefined
              },
              data: fd,
            }).
            then(function(response) {
              $scope.cartVal = response.data
              for (var i = 0; i < $rootScope.cartData.length; i++) {
                if ($rootScope.cartData[i].pk == $scope.cartVal[i]) {
                  $rootScope.cartData[i] = $scope.cartVal
                }
              }
              $uibModalInstance.dismiss(response.data);
            })
          } else {
            fd.append('qty', 1);
            fd.append('product', productpk);
            fd.append('productVariant', selectedProdVarpk);
            fd.append('store', STORE_PK);
            $http({
              method: 'POST',
              url: '/api/POS/cart/',
              transformRequest: angular.identity,
              headers: {
                'Content-Type': undefined
              },
              data: fd,

            }).
            then(function(response) {
              $rootScope.cartLength += 1
              $rootScope.cartData.push(response.data)
              $uibModalInstance.dismiss(response.data);
            })

          }
        }
      }
    }).result.then(function(data) {}, function(data) {
      $scope.selectedProdVar.value.cart = data.qty
      $scope.selectedProdVar.value.cartPk = data.pk
      $scope.selectedProdVar.value.customDetails = data.customDetails
      $scope.selectedProdVar.value.customFile = data.customFile
    });
  }

  $scope.changeVariantVal = function() {
    if ($scope.selectedProdVar.data.options.length > 0) {
      $scope.selectedProdVar.value = $scope.selectedProdVar.data.options[0]
      $scope.imgData = ''
      if ($scope.selectedProdVar.value.images.length > 0) {
        $scope.imgData = $scope.selectedProdVar.value.images[0].attachment
      }
      if (me != null) {
        for (var i = 0; i < $rootScope.cartData.length; i++) {
          if ($rootScope.cartData[i].productVariant.pk == $scope.selectedProdVar.value.pk) {
            $scope.selectedProdVar.value.cart = $rootScope.cartData[i].qty
            $scope.selectedProdVar.value.cartPk = $rootScope.cartData[i].pk
            $scope.selectedProdVar.value.customDetails = $rootScope.cartData[i].customDetails
            $scope.selectedProdVar.value.customFile = $rootScope.cartData[i].customFile
          }
        }
      } else {
        for (var i = 0; i < $rootScope.addToCart.length; i++) {
          if ($rootScope.addToCart[i].productVariant == $scope.selectedProdVar.value.pk) {
            $scope.selectedProdVar.value.cart = $rootScope.addToCart[i].qty
          }
        }
      }
    }
  }


  $scope.addToCartFun = function() {
    var dataToSend = {
      product: $scope.details.pk,
      productVariant: $scope.selectedProdVar.value.pk,
      qty: 1,
      store: $rootScope.storeData.pk
    }
    $http({
      method: 'POST',
      url: '/api/POS/cart/',
      data: dataToSend
    }).
    then(function(res) {
      $rootScope.cartLength += 1
      $rootScope.cartData.push(res.data)
      $scope.selectedProdVar.value.cart = res.data.qty
      $scope.selectedProdVar.value.cartPk = res.data.pk
    })
  }


  $scope.decrement = function() {
    $scope.selectedProdVar.value.cart -= 1
    if ($scope.selectedProdVar.value.cart == 0) {
      $http({
        method: 'DELETE',
        url: '/api/POS/cart/' + $scope.selectedProdVar.value.cartPk + '/',
      }).
      then(function(res) {
        $rootScope.cartLength -= 1
        for (var i = 0; i < $rootScope.cartData.length; i++) {
          if ($rootScope.cartData[i].pk == $scope.selectedProdVar.value.cartPk) {
            $rootScope.cartData.splice(i, 1)
          }
        }
      })
    } else {
      $http({
        method: 'PATCH',
        url: '/api/POS/cart/' + $scope.selectedProdVar.value.cartPk + '/',
        data: {
          qty: $scope.selectedProdVar.value.cart
        }
      }).
      then(function(res) {
        for (var i = 0; i < $rootScope.cartData.length; i++) {
          if ($rootScope.cartData[i].productVariant.pk == $scope.selectedProdVar.value.pk) {
            $rootScope.cartData[i] = res.data
          }
        }
      })
    }
  }

  $scope.increment = function() {
    $scope.selectedProdVar.value.cart += 1
    $http({
      method: 'PATCH',
      url: '/api/POS/cart/' + $scope.selectedProdVar.value.cartPk + '/',
      data: {
        qty: $scope.selectedProdVar.value.cart
      }
    }).
    then(function(res) {
      for (var i = 0; i < $rootScope.cartData.length; i++) {
        if ($rootScope.cartData[i].productVariant.pk == $scope.selectedProdVar.value.pk) {
          $rootScope.cartData[i] = res.data
        }
      }
    })
  }

  $scope.changeVariant = function(para) {
    $scope.selectedProdVar.value = para
    for (var i = 0; i < $rootScope.cartData.length; i++) {
      console.log($scope.selectedProdVar.value.pk, $rootScope.cartData[i].productVariant.pk);
      if ($rootScope.cartData[i].productVariant.pk == $scope.selectedProdVar.value.pk) {
        $scope.selectedProdVar.value.cart = $rootScope.cartData[i].qty
        $scope.selectedProdVar.value.cartPk = $rootScope.cartData[i].pk
        $scope.selectedProdVar.value.customDetails = $rootScope.cartData[i].customDetails
        $scope.selectedProdVar.value.customFile = $rootScope.cartData[i].customFile
      }
    }
  }

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  $scope.createCookieDetail = function() {
    $scope.selectedProdVar.value.cart = 1
    $scope.item = {
      'product': $scope.details.pk,
      'productVariant': $scope.selectedProdVar.value.pk,
      'qty': $scope.selectedProdVar.value.cart,
      'store': $rootScope.storeData.pk
    }
    detail = getCookie("addToCart");
    $rootScope.addToCart = []
    if (detail != "") {
      $rootScope.addToCart = JSON.parse(detail)
      document.cookie = encodeURIComponent("addToCart") + "=deleted; expires=" + new Date(0).toUTCString()
    }
    $rootScope.addToCart.push($scope.item)
    setCookie("addToCart", JSON.stringify($rootScope.addToCart), 365);
  }

  $scope.incrementCookie = function() {
    $scope.selectedProdVar.value.cart += 1
    for (var i = 0; i < $rootScope.addToCart.length; i++) {
      if ($rootScope.addToCart[i].productVariant == $scope.selectedProdVar.value.pk) {
        $rootScope.addToCart[i].qty = $scope.selectedProdVar.value.cart
        setCookie("addToCart", JSON.stringify($rootScope.addToCart), 365);
      }
    }
  }

  $scope.decrementCookie = function() {
    $scope.selectedProdVar.value.cart -= 1
    for (var i = 0; i < $rootScope.addToCart.length; i++) {
      if ($rootScope.addToCart[i].productVariant == $scope.selectedProdVar.value.pk) {
        if ($scope.selectedProdVar.value.cart == 0) {
          setCookie("addToCart", "", -1, '/');
          $rootScope.addToCart.splice(i, 1);
          setCookie("addToCart", JSON.stringify($rootScope.addToCart), 365);
          return
        } else {
          $rootScope.addToCart[i].qty = $scope.selectedProdVar.value.cart
          setCookie("addToCart", JSON.stringify($rootScope.addToCart), 365);
          return
        }
      }

    }
  }


});


app.controller('controller.ecommerce.categories', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash, $window) {

  $scope.filters = {
    varients: {},
    minPrice: 0,
    sort: 'low2high',
    page: 0,
    filters: [],
    view: 'list',
    showClear: false
  }

  $scope.resetFiltes = function() {
    $scope.filters.varients = {};
    $scope.filters.minPrice = 0;
    $scope.refresh();
  }

  $scope.$watch('filters.varients', function(newValue, oldValue) {
    console.log(newValue);
    if (Object.keys(newValue).length === 0 && newValue.constructor === Object) {
      $scope.filters.showClear = false;
    } else {
      $scope.filters.showClear = true;
    }
  }, true)

  $http({
    method: 'GET',
    url: '/api/POS/categorysv/' + $state.params.id + '/'
  }).
  then(function(response) {
    $scope.category = response.data
    $http({
      method: 'GET',
      url: '/api/POS/filtersByCategory/?cat=' + $scope.category.pk
    }).
    then(function(response) {
      $scope.filters.filters = response.data;
    })
  })



  $scope.refresh = function() {
    var params = {
      page: $scope.filters.page,
      filters: $scope.filters.varients,
      sort: $scope.filters.sort,
      minPrice: $scope.filters.minPrice,
      cat: $state.params.id
    };

    $http({
      method: 'GET',
      url: '/api/POS/productsViewLite/',
      params: params
    }).
    then(function(response) {
      $scope.products = response.data
    })
  }


  $scope.refresh();



});



app.controller('controller.ecommerce.account.default', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash) {
  // for the dashboard of the account tab
  // alert('hello')
  $http({
    methof: 'GET',
    url: '/api/ecommerce/userProfileSetting/?user=' + $scope.me.pk
  }).then(function(response) {


    $scope.detailsForm = {
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      email: response.data.email,
      mobile: response.data.mobile,
      oldPassword: '',
      newPassword: ''
    }

    if (settings_isStoreGlobal == false) {
      $scope.isGst = true
      $scope.detailsForm.gst = response.data.gst
      $scope.detailsForm.company = response.data.company
    } else {
      $scope.isGst = false
    }

  })
  $scope.editMode = false

  $scope.edit = function() {
    $scope.editMode = true
    setTimeout(function() {
      document.getElementById('firstName').focus()
    }, 500);
  }

  $scope.save = function() {

    $scope.detailsForm.user = $scope.me.pk

    if ($scope.detailsForm.oldPassword.length == 0 && $scope.detailsForm.newPassword.length > 0) {
      Flash.create('warning', 'Enter old password')
      return
    }

    if ($scope.detailsForm.newPassword.length == 0 && $scope.detailsForm.oldPassword.length > 0) {
      Flash.create('warning', 'Enter new password')
      return
    }

    if ($scope.detailsForm.oldPassword.length == 0 || $scope.detailsForm.newPassword.length == 0) {
      delete $scope.detailsForm.oldPassword
      delete $scope.detailsForm.newPassword
    }

    $http({
      method: 'POST',
      url: '/api/ecommerce/userProfileSetting/',
      data: $scope.detailsForm
    }).then(function(response) {
      $scope.detailsForm = {
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        mobile: response.data.mobile,
        oldPassword: '',
        newPassword: ''
      }

      if ($scope.isGst) {
        $scope.detailsForm.gst = response.data.gst
        $scope.detailsForm.company = response.data.company
      }

      if (response.data.passwordChanged) {
        alert("password has been changed, login again")
        window.location.href = "/";
      }


      $scope.editMode = false
      Flash.create('success', 'Saved Successfully')
    }, function(error) {
      Flash.create('danger', 'Permission Denied')
    })
    // $http({
    //   method:'PATCH',
    //   url:''
    //   data:{}
    // }).then(function (response) {
    //   console.log(response);
    // })
  }






});



app.controller('controller.ecommerce.account.cart', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash, $rootScope, $filter) {


  $scope.data = {
    tableData: [],
  };
  views = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.ecommerce.account.cart.item.html',
  }, ];


  $scope.config = {
    views: views,
    url: '/api/ecommerce/cart/',
    // searchField: 'product__product__name',
    getParams: [{
      key: 'user',
      value: $scope.me.pk
    }, {
      key: 'typ',
      value: 'cart'
    }],
    deletable: true,
    itemsNumPerView: [8, 16, 32],
  }


  document.title = BRAND_TITLE + ' | Shopping Cart'
  document.querySelector('meta[name="description"]').setAttribute("content", BRAND_TITLE + ' Online Shopping')

  // $timeout(function () {
  //   for (var i = 0; i < $scope.data.tableData.length; i++) {
  //     var prod_variants = $scope.data.tableData[i].product.product_variants
  //     for (var j = 0; j < prod_variants.length; j++) {
  //       if (prod_variants[j].sku == $scope.data.tableData[i].prodSku) {
  //         $scope.data.tableData[i].prod_var = prod_variants[j]
  //         console.log($scope.data.tableData[i].prod_var);
  //       }
  //     }
  //   }
  // }, 1000);

  $scope.tableAction = function(target, action, mode) {
    for (var i = 0; i < $scope.data.tableData.length; i++) {
      if ($scope.data.tableData[i].pk == parseInt(target)) {
        if (action == 'deleteItem') {
          $http({
            method: 'DELETE',
            url: '/api/ecommerce/cart/' + $scope.data.tableData[i].pk + '/'
          }).
          then(function(response) {
            Flash.create('success', 'Item removed from cart');
          })
          $scope.data.tableData.splice(i, 1)
          $rootScope.inCart.splice(i, 1)
          // $scope.calcTotal();
        } else if (action == 'addQty') {
          $scope.data.tableData[i].qty = $scope.data.tableData[i].qty + 1;
          $http({
            method: 'PATCH',
            url: '/api/ecommerce/cart/' + $scope.data.tableData[i].pk + '/',
            data: {
              qty: $scope.data.tableData[i].qty
            }
          }).
          then(function(response) {})
          // $scope.calcTotal();
        } else if (action == 'substractQty') {
          $scope.data.tableData[i].qty = $scope.data.tableData[i].qty - 1;
          $http({
            method: 'PATCH',
            url: '/api/ecommerce/cart/' + $scope.data.tableData[i].pk + '/',
            data: {
              qty: $scope.data.tableData[i].qty
            }
          }).
          then(function(response) {})
          // $scope.calcTotal();
        } else if (action == 'favourite') {
          $http({
            method: 'PATCH',
            url: '/api/ecommerce/cart/' + $scope.data.tableData[i].pk + '/',
            data: {
              typ: 'favourite'
            }
          }).
          then(function(response) {
            $rootScope.inFavourite.push(response.data)
          })
          $scope.data.tableData[i].typ = 'favourite';
          $scope.data.tableData.splice(i, 1)
          $rootScope.inCart.splice(i, 1)

        } else if (action == 'unfavourite') {
          $http({
            method: 'PATCH',
            url: '/api/ecommerce/cart/' + $scope.data.tableData[i].pk + '/',
            data: {
              typ: 'cart'
            }
          }).
          then(function(response) {})
          $scope.data.tableData[i].typ = 'cart';
        }
      }
    }
  }






  $scope.currency = settings_currencySymbol
  // $scope.calcTotal = function() {
  //   $scope.total = 0;
  //   var price = 0;
  //   for (var i = 0; i < $scope.data.tableData.length; i++) {
  //     if ($scope.data.tableData[i].prodSku != $scope.data.tableData[i].product.product.serialNo) {
  //       price = $scope.data.tableData[i].prodVarPrice
  //     } else {
  //       price = $scope.data.tableData[i].product.product.discount
  //     }
  //     $scope.total = $scope.total + (price * $scope.data.tableData[i].qty)
  //   }
  //   return $scope.total
  // }



  $scope.checkout = function() {
    $state.go('checkout', {
      pk: 'cart'
    })
  }

});

app.controller('ecommerce.account.cart.item', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash) {
  // for the dashboard of the account tab


  $scope.currency = settings_currencySymbol;
});

app.controller('controller.ecommerce.account.saved', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash, $filter) {


  $scope.data = {
    tableData: [],
  };
  views = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.ecommerce.account.saved.item.html',
  }, ];


  $scope.config = {
    views: views,
    url: '/api/ecommerce/cart/',
    searchField: 'Name',
    getParams: [{
      key: 'user',
      value: $scope.me.pk
    }, {
      key: 'typ',
      value: 'favourite'
    }],
    deletable: true,
    itemsNumPerView: [8, 16, 32],
  }

  document.title = BRAND_TITLE + ' | Saved Products'
  document.querySelector('meta[name="description"]').setAttribute("content", BRAND_TITLE + ' Online Shopping')
  $scope.tableAction = function(target, action, mode) {
    for (var i = 0; i < $scope.data.tableData.length; i++) {
      if ($scope.data.tableData[i].pk == parseInt(target)) {
        if (action == 'unfavourite') {
          $http({
            method: 'PATCH',
            url: '/api/ecommerce/cart/' + $scope.data.tableData[i].pk + '/',
            data: {
              typ: 'cart',
              qty: 1
            }
          }).
          then(function(response) {
            $rootScope.inCart.push(response.data)
          })
          $scope.data.tableData.splice(i, 1)
          $rootScope.inFavourite.splice(i, 1)
        } else if (action == 'deleteItem') {
          $http({
            method: 'DELETE',
            url: '/api/ecommerce/cart/' + $scope.data.tableData[i].pk + '/'
          }).
          then(function(response) {
            Flash.create('success', 'Item removed from favourite');
          })
          $scope.data.tableData.splice(i, 1)
          $rootScope.inFavourite.splice(i, 1)
          // $rootScope.inCart.splice(i, 1)
          // $scope.calcTotal();
        }
      }
    }

  }



});

app.controller('controller.ecommerce.account.saved.item', function($scope, $rootScope, $http, $state) {
  $scope.currency = settings_currencySymbol;

})



app.controller('controller.ecommerce.account.orders.item', function($scope, $rootScope, $http, $state, $uibModal) {
  $scope.showDetails = function(val) {
    $scope.trackItem = val
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.ecommerce.orders.trackModal.html',
      size: 'lg',
      backdrop: true,
      resolve: {
        items: function() {
          return $scope.trackItem;
        }
      },
      controller: function($scope, items, $state, $http, $timeout, $uibModal, $users, Flash, $uibModalInstance) {
        $scope.trackItems = items
      }

    })
  }

  $scope.isStoreGlobal = settings_isStoreGlobal;
  $scope.currency = settings_currencySymbol;
})

app.controller('controller.ecommerce.account.orders', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash) {

  $scope.data = {
    tableData: [],
  };
  views = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.ecommerce.account.orders.item.html',
  }, ];


  $scope.config = {
    views: views,
    url: '/api/ecommerce/order/',
    searchField: 'id',
    getParams: [{
      key: 'user',
      value: $scope.me.pk
    }],
    deletable: true,
    itemsNumPerView: [4, 16, 32],
  }



  $timeout(function() {
    for (var i = 0; i < $scope.data.tableData.length; i++) {
      $scope.data.tableData[i].showInfo = false;
      $scope.data.tableData[i].hideCancelBtn = false
      $scope.data.tableData[i].hideReturnBtn = false
      $scope.data.tableData[i].cancelCount = 0;
      $scope.data.tableData[i].returnCount = 0;

      for (var j = 0; j < $scope.data.tableData[i].orderQtyMap.length; j++) {
        $scope.data.tableData[i].orderQtyMap[j].selected = false;
        if ($scope.data.tableData[i].orderQtyMap[j].status == 'cancelled') {
          $scope.data.tableData[i].cancelCount++
        }
        if ($scope.data.tableData[i].orderQtyMap[j].status == 'returned') {
          $scope.data.tableData[i].returnCount++;
        }
      }
      if ($scope.data.tableData[i].cancelCount == $scope.data.tableData[i].orderQtyMap.length) {
        $scope.data.tableData[i].hideCancelBtn = true
      }
      if ($scope.data.tableData[i].returnCount == $scope.data.tableData[i].orderQtyMap.length) {
        $scope.data.tableData[i].hideReturnBtn = true
      }


    }

  }, 2000);


  document.title = BRAND_TITLE + ' | My Orders'
  document.querySelector('meta[name="description"]').setAttribute("content", BRAND_TITLE + ' Online Shopping')

  $scope.tableAction = function(target, action, mode) {
    for (var i = 0; i < $scope.data.tableData.length; i++) {
      if ($scope.data.tableData[i].pk == parseInt(target)) {

        if (action == 'toggleInfo') {
          $scope.data.tableData[i].showInfo = !$scope.data.tableData[i].showInfo;
        } else if (action == 'cancel') {

          $scope.itemsToBeDeleted = [];


          for (var j = 0; j < $scope.data.tableData[i].orderQtyMap.length; j++) {
            if ($scope.data.tableData[i].orderQtyMap[j].selected == true) {
              if ($scope.data.tableData[i].orderQtyMap[j].status == 'created' || $scope.data.tableData[i].orderQtyMap[j].status == 'packed') {
                $scope.itemsToBeDeleted.push($scope.data.tableData[i].orderQtyMap[j])
              } else {
                // $scope.data.tableData[i].orderQtyMap[j].selected = false;
                Flash.create('warning', 'selected items cant be cancelled')
                return
              }
            }
          }



          if ($scope.itemsToBeDeleted.length > 0) {
            $scope.indexofthis = i
            $uibModal.open({
              templateUrl: '/static/ngTemplates/app.ecommerce.orders.cancelModalWindow.html',
              size: 'md',
              backdrop: true,
              resolve: {
                items: function() {
                  return $scope.itemsToBeDeleted;
                }
              },
              controller: function($scope, items, $state, $http, $timeout, $uibModal, $users, Flash, $uibModalInstance) {
                $scope.state = 'cancel';
                $scope.items = items;
                $scope.amtToBeRefunded = 0;
                $scope.currency = settings_currencySymbol

                for (var i = 0; i < $scope.items.length; i++) {
                  $scope.amtToBeRefunded = $scope.amtToBeRefunded + $scope.items[i].paidAmount
                }

                $scope.cancel = function() {
                  for (var i = 0; i < $scope.items.length; i++) {
                    var pk = $scope.items[i].pk
                    $http({
                      method: 'PATCH',
                      url: '/api/ecommerce/orderQtyMap/' + pk + '/',
                      data: {
                        status: 'cancelled'
                      }
                    }).
                    then(function(response) {
                      var toSend = {
                        value: response.data.pk
                      };
                      $http({
                        method: 'POST',
                        url: '/api/ecommerce/sendStatus/',
                        data: toSend
                      }).
                      then(function(response) {})
                      $rootScope.$broadcast('forceRefetch', {});
                      Flash.create('success', 'selected items cancelled')
                      $uibModalInstance.dismiss();
                    })
                  }
                }

              },
            }).result.then(function() {

            }, function(res) {

              $timeout(function() {
                $scope.data.tableData[$scope.indexofthis].cancelCount = 0
                $scope.data.tableData[$scope.indexofthis].returnCount = 0
                for (var j = 0; j < $scope.data.tableData[$scope.indexofthis].orderQtyMap.length; j++) {
                  $scope.data.tableData[$scope.indexofthis].orderQtyMap[j].selected = false;
                  if ($scope.data.tableData[$scope.indexofthis].orderQtyMap[j].status == 'cancelled') {
                    $scope.data.tableData[$scope.indexofthis].cancelCount++
                  }
                  if ($scope.data.tableData[$scope.indexofthis].orderQtyMap[j].status == 'returned') {
                    $scope.data.tableData[$scope.indexofthis].returnCount++;
                  }
                }

                if ($scope.data.tableData[$scope.indexofthis].cancelCount == $scope.data.tableData[$scope.indexofthis].orderQtyMap.length) {
                  $scope.data.tableData[$scope.indexofthis].hideCancelBtn = true
                }
                if ($scope.data.tableData[$scope.indexofthis].returnCount == $scope.data.tableData[$scope.indexofthis].orderQtyMap.length) {
                  $scope.data.tableData[$scope.indexofthis].hideReturnBtn = true
                }
              }, 2000);

            });
          } else {
            Flash.create('warning', 'Please select items to cancel')
          }


        } else if (action == 'return') {

          $scope.itemsToBeReturned = [];

          for (var j = 0; j < $scope.data.tableData[i].orderQtyMap.length; j++) {
            if ($scope.data.tableData[i].orderQtyMap[j].selected == true) {
              if ($scope.data.tableData[i].orderQtyMap[j].status == 'delivered') {
                $scope.itemsToBeReturned.push($scope.data.tableData[i].orderQtyMap[j])
              } else {
                // $scope.data.tableData[i].orderQtyMap[j].selected = false;
                Flash.create('warning', 'selected items cant be returned')
                return
              }
            }
          }

          if ($scope.itemsToBeReturned.length > 0) {
            $uibModal.open({
              templateUrl: '/static/ngTemplates/app.ecommerce.orders.cancelModalWindow.html',
              size: 'md',
              backdrop: true,
              resolve: {
                items: function() {
                  return $scope.itemsToBeReturned;
                }
              },
              controller: function($scope, items, $state, $http, $timeout, $uibModal, $users, Flash, $uibModalInstance) {
                $scope.state = 'return';
                $scope.items = items;
                $scope.amtToBeRefunded = 0;
                $scope.currency = settings_currencySymbol

                for (var i = 0; i < $scope.items.length; i++) {
                  $scope.amtToBeRefunded = $scope.amtToBeRefunded + $scope.items[i].paidAmount
                }

                $scope.return = function() {
                  for (var i = 0; i < $scope.items.length; i++) {
                    var pk = $scope.items[i].pk
                    $http({
                      method: 'PATCH',
                      url: '/api/ecommerce/orderQtyMap/' + pk + '/',
                      data: {
                        status: 'returned'
                      }
                    }).
                    then(function(response) {
                      var toSend = {
                        value: response.data.pk
                      };
                      $http({
                        method: 'POST',
                        url: '/api/ecommerce/sendStatus/',
                        data: toSend
                      }).
                      then(function(response) {})
                      $rootScope.$broadcast('forceRefetch', {});
                      Flash.create('success', 'selected items returned')
                      $uibModalInstance.dismiss();
                    })
                  }

                }

              },
            }).result.then(function() {

            }, function() {

              $timeout(function() {
                $scope.data.tableData[$scope.indexofthis].cancelCount = 0
                $scope.data.tableData[$scope.indexofthis].returnCount = 0
                for (var j = 0; j < $scope.data.tableData[$scope.indexofthis].orderQtyMap.length; j++) {
                  $scope.data.tableData[$scope.indexofthis].orderQtyMap[j].selected = false;
                  if ($scope.data.tableData[$scope.indexofthis].orderQtyMap[j].status == 'cancelled') {
                    $scope.data.tableData[$scope.indexofthis].cancelCount++
                  }
                  if ($scope.data.tableData[$scope.indexofthis].orderQtyMap[j].status == 'returned') {
                    $scope.data.tableData[$scope.indexofthis].returnCount++;
                  }
                }
                if ($scope.data.tableData[$scope.indexofthis].cancelCount == $scope.data.tableData[$scope.indexofthis].orderQtyMap.length) {
                  $scope.data.tableData[$scope.indexofthis].hideCancelBtn = true
                }
                if ($scope.data.tableData[$scope.indexofthis].returnCount == $scope.data.tableData[$scope.indexofthis].orderQtyMap.length) {
                  $scope.data.tableData[$scope.indexofthis].hideReturnBtn = true
                }
              }, 2000);

            });
          } else {
            Flash.create('warning', 'Please select item to return')
          }


        }

      }
    }
  }

});

app.controller('controller.ecommerce.account.settings', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash) {
  $scope.me = $users.get('mySelf');
  document.title = BRAND_TITLE + ' | My Settings'
  document.querySelector('meta[name="description"]').setAttribute("content", BRAND_TITLE + ' Online Shopping')

  if (settings_isStoreGlobal) {
    $scope.isStoreGlobal = true
  } else {
    $scope.isStoreGlobal = false
  }

  $scope.refresh = function() {
    $scope.form = {
      title: '',
      landMark: '',
      street: '',
      city: '',
      state: '',
      pincode: null,
      country: 'India',
      primary: false,
      mobileNo: '',
      billingLandMark: '',
      billingStreet: '',
      billingState: '',
      billingPincode: null,
      billingCountry: 'India',
      sameAsShipping: false,
    }
    if (settings_isStoreGlobal) {
      $scope.form.country = ''
    }
  }


  $scope.$watch('form.billingPincode', function(newValue, oldValue) {
    if (newValue != null) {

      $http({
        method: 'GET',
        url: '/api/ecommerce/genericPincode/?pincode__iexact=' + newValue
      }).
      then(function(response) {
        if (response.data.length > 0) {
          $scope.form.billingCity = response.data[0].city
          $scope.form.billingState = response.data[0].state
          $scope.form.billingCountry = 'India'
        } else {
          $scope.form.billingCity = ''
          $scope.form.billingState = ''
        }
      })

    }
  })

  $scope.refresh()
  $scope.update = function(idx) {
    $scope.form = $scope.savedAddress[idx]
    console.log($scope.form, 'lllllllllpppppppppppp');
    if ($scope.savedAddress[idx].pk == $scope.pa) {
      $scope.form.primary = true
    } else {
      $scope.form.primary = false
    }
    // $scope.savedAddress.splice(idx, 1)
  }

  $scope.delete = function(idx) {
    $http({
      method: 'DELETE',
      url: '/api/ecommerce/address/' + $scope.savedAddress[idx].pk + '/'
    }).
    then(function(response) {
      $scope.savedAddress.splice(idx, 1)
      Flash.create('success', "Address Deleted");
    })
  }

  if (settings_isStoreGlobal) {
    $scope.countrySearch = function(query) {
      return $http.get('/api/ecommerce/searchCountry/?query=' + query).
      then(function(response) {
        $scope.countrList = response.data
        return response.data;
      })
    }

    $scope.stateSearch = function(query) {
      if ($scope.selectedCountryObj != undefined) {
        if ($scope.selectedCountryObj.id != undefined) {
          return $http.get('/api/ecommerce/searchCountry/?query=' + query + '&country=' + $scope.selectedCountryObj.id).
          then(function(response) {
            $scope.stateList = response.data
            return response.data;
          })
        }
      }
    }

    $scope.citySearch = function(query) {
      if ($scope.selectedStateObj != undefined) {
        if ($scope.selectedStateObj.id != undefined) {
          return $http.get('/api/ecommerce/searchCountry/?query=' + query + '&state=' + $scope.selectedStateObj.id).
          then(function(response) {
            return response.data;
          })
        }
      }
    }



    $scope.showAddressForm = {
      state: false,
      city: false
    }

    $scope.showBillingAddressForm = {
      state: false,
      city: false
    }

    $scope.$watch('form.country', function(newValue, oldValue) {
      if (newValue != null && newValue != undefined) {

        if (newValue == '') {
          $scope.form.state = ''
        }

        if ($scope.countrList) {
          for (var i = 0; i < $scope.countrList.length; i++) {
            if ($scope.countrList[i].name == newValue) {
              $scope.selectedCountryObj = $scope.countrList[i]
              break;
            } else {
              $scope.selectedCountryObj = ''
            }
          }
        }
        // if (typeof $scope.selectedCountryObj == 'object') {
        //   $scope.showAddressForm.state = true
        // } else {
        //   $scope.showAddressForm.state = false
        // }
        // if ($scope.selectedCountryObj.length) {
        //   $scope.showAddressForm.state = true
        // }else {
        //   $scope.showAddressForm.state = false
        // }
      }
    });

    $scope.$watch('form.billingPincode', function(newValue, oldValue) {
      if (newValue != null) {
        if (newValue.length == 6) {
          $http({
            method: 'GET',
            url: '/api/ecommerce/genericPincode/?pincode__iexact=' + newValue
          }).
          then(function(response) {
            if (response.data.length > 0) {
              $scope.form.billingCity = response.data[0].city
              $scope.form.billingState = response.data[0].state
            } else {}
          })
        }
      }
    })

    $scope.$watch('form.state', function(newValue, oldValue) {
      if (newValue != null && newValue != undefined) {

        if (newValue == '') {
          $scope.form.city = ''
        }

        if ($scope.stateList) {
          for (var i = 0; i < $scope.stateList.length; i++) {
            if ($scope.stateList[i].name == newValue) {
              $scope.selectedStateObj = $scope.stateList[i]
              break;
            } else {
              $scope.selectedStateObj = ''
            }
          }
        }
        // if (typeof $scope.selectedStateObj == 'object') {
        //   $scope.showAddressForm.city = true
        // } else {
        //   $scope.showAddressForm.city = false
        // }
      }
    });
  } else {
    $scope.showAddressForm = {
      state: true,
      city: true
    }

    $scope.showBillingAddressForm = {
      state: true,
      city: true
    }
    $scope.showMessage = false
    $scope.$watch('form.pincode', function(newValue, oldValue) {
      if (newValue != null) {
        if (newValue.length == 6) {
          $http({
            method: 'GET',
            url: '/api/ecommerce/genericPincode/?pincode__iexact=' + newValue
          }).
          then(function(response) {
            if (response.data.length > 0) {
              $scope.showMessage = false
              $scope.form.city = response.data[0].city
              $scope.form.state = response.data[0].state
            } else {
              if (settings_isServiceArea) {
                $scope.showMessage = true
              }
            }
            if (settings_isServiceArea) {
              $http({
                method: 'GET',
                url: '/api/ecommerce/addPincode/?pincodes__iexact=' + newValue
              }).
              then(function(response) {
                if (response.data.length == 0) {
                  $scope.showMessage = true
                }
              })
            } else {
              $scope.showMessage = false
            }

          })
        } else if (newValue.length < 6) {
          $scope.showMessage = false
          // $scope.form.city = ''
          // $scope.form.state = ''
        }
      }
    })
  }








  $scope.fetchaddress = function() {
    $http({
      method: 'GET',
      url: '/api/ecommerce/address/?user=' + $scope.me.pk
    }).
    then(function(response) {
      $scope.savedAddress = response.data
      $scope.pa = 0
      for (var i = 0; i < $scope.savedAddress.length; i++) {
        if ($scope.me.profile.primaryAddress == $scope.savedAddress[i].pk) {
          $scope.pa = $scope.savedAddress[i].pk
        }
      }
    })
  }
  $scope.fetchaddress()


  $scope.saveAddress = function() {

    if ($scope.form.title.length == 0 || $scope.form.country.length == 0 || $scope.form.city.length == 0 || $scope.form.state.length == 0 || $scope.form.pincode.length == 0 || $scope.form.mobileNo.length == 0) {
      Flash.create('warning', 'Fill the required Data')
      return
    }

    dataToSend = {
      city: $scope.form.city,
      country: $scope.form.country,
      landMark: $scope.form.landMark,
      mobileNo: $scope.form.mobileNo,
      pincode: $scope.form.pincode,
      primary: $scope.form.primary,
      state: $scope.form.state,
      street: $scope.form.street,
      title: $scope.form.title,
      sameAsShipping: $scope.form.sameAsShipping
    }

    if (!$scope.isStoreGlobal) {
      if ($scope.form.sameAsShipping == false) {
        dataToSend.billingCity = $scope.form.billingCity
        dataToSend.billingCountry = $scope.form.billingCountry
        dataToSend.billingLandMark = $scope.form.billingLandMark
        dataToSend.billingPincode = $scope.form.billingPincode
        dataToSend.billingState = $scope.form.billingState
        dataToSend.billingStreet = $scope.form.billingStreet
      } else {
        dataToSend.billingCity = ''
        dataToSend.billingCountry = ''
        dataToSend.billingLandMark = ''
        dataToSend.billingPincode = 0
        dataToSend.billingState = ''
        dataToSend.billingStreet = ''
      }
    }


    // if ($scope.form.pincode == null) {
    //   delete dataToSend.pincode
    // }
    var method = 'POST'
    var url = '/api/ecommerce/address/'
    if ($scope.form.pk != undefined) {
      method = 'PATCH'
      url = url + $scope.form.pk + '/'
    }
    $http({
      method: method,
      url: url,
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', 'Added');
      $scope.refresh()
      $scope.fetchaddress()
    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    })
  }
});

app.controller('controller.ecommerce.account.support', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash) {

  document.title = BRAND_TITLE + ' | HelpCenter -  FAQ About Contextual Advertising , Online Advertising , Online Ads'
  document.querySelector('meta[name="description"]').setAttribute("content", BRAND_TITLE + ' Online Shopping')

  $http({
    method: 'GET',
    url: '/api/ecommerce/frequentlyQuestions/'
  }).
  then(function(response) {
    $scope.fAQ = response.data
  })

  $scope.message = {
    invoiceNo: '',
    subject: '',
    body: ''
  };
  $scope.sendMessage = function() {
    if ($scope.me == undefined || $scope.me == '' || $scope.message.invoiceNo == '' || $scope.message.body == '') {
      Flash.create("warning", "Please add all details")
    } else {
      dataToSend = {
        email: $scope.message.email,
        mobile: $scope.me.profile.mobile,
        invoiceNo: $scope.message.invoiceNo,
        subject: $scope.message.subject,
        message: $scope.message.body
      }
    }
    $http({
      method: 'POST',
      url: '/api/ecommerce/supportFeed/',
      data: dataToSend
    }).
    then(function(response) {
      $scope.message = {
        invoiceNo: '',
        subject: '',
        body: ''
      };
      Flash.create('success', response.status + ' : ' + response.statusText);
    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    })
  }


});



app.controller('controller.ecommerce.account', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash) {

});

app.controller('controller.ecommerce.address', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash, $window) {
  $rootScope.dataToSend = {}
  $scope.currency = "fa-inr"
  $scope.me = $users.get('mySelf');

  var url = new URL(window.location.href)
  var action = url.searchParams.get("action")
  // if (action == 'retry') {
  //   $scope.data.stage = 'payment';
  // } else if (action == 'success') {
  //   $http({
  //     method: 'GET',
  //     url: '/api/ecommerce/order/' + url.searchParams.get('orderid') + '/'
  //   }).
  //   then(function(response) {
  //     $scope.data.stage = 'confirmation';
  //     $scope.order = {
  //       odnumber: response.data.pk,
  //       dt: new Date(),
  //       paymentMode: 'Online'
  //     }
  //   })
  // } else {
  //
  // }
  // //
  $scope.data = {}
  $scope.data.stage = 'review'
  $scope.deleteFromCart = function(indx, value) {
    $http({
      method: 'DELETE',
      url: '/api/POS/cart/' + value + '/',
    }).
    then(function(response) {
      Flash.create("success", 'Product Removed')
      $rootScope.cartData.splice(indx, 1)
      $rootScope.cartLength -= 1
      $rootScope.calcTotal()
    })
  }

  if ($rootScope.total == undefined) {
    $state.go('checkout')
  }


  $scope.data = {
    quantity: 1,
    shipping: 'express',
    stage: '',
    promoCode: '',
    modeOfPayment: 'Card',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      mobileNo: $scope.me.profile.mobile,
      landMark: ''
    },
    billingAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      mobileNo: $scope.me.profile.mobile,
      billingLandMark: ''
    }
  };
  $scope.fetchaddress = function() {
    $http({
      method: 'GET',
      url: '/api/POS/address/?user=' + $scope.me.pk + '&store=' + STORE_PK
    }).
    then(function(response) {
      $scope.savedAddress = response.data
      $scope.pa = 0
      for (var i = 0; i < $scope.savedAddress.length; i++) {
        if ($scope.me.profile.primaryAddress == $scope.savedAddress[i].pk) {
          $scope.pa = $scope.savedAddress[i].pk
          $scope.data.address = $scope.savedAddress[i]
          if ($scope.getAddr != undefined) {
            if ($scope.getAddr == $scope.savedAddress[i].pk) {
              // $scope.saved = true
              $scope.idx = i
            }
          }
          if ($scope.data.address.mobileNo == null || $scope.data.address.mobileNo.length == 0) {
            $scope.data.address.mobileNo = $scope.me.profile.mobile
          }
        }
      }
    })
  }

  $scope.fetchaddress()
  $scope.saved = false

  $scope.ChangeAdd = function(idx, value) {
    $scope.errormsg = ""
    if (value == "use") {
      $scope.addressview = false
      $scope.idx = null
      $scope.show(idx)

    } else if (value == "edit") {
      $scope.idx = null
      $scope.idxVal = idx
      $scope.addressview = true
    }
    $scope.data.address = $scope.savedAddress[idx]
    $rootScope.dataToSend.sameAsShipping = $scope.data.address.sameAsShipping
    $scope.data.billingAddress = {
      street: $scope.data.address.billingStreet,
      landMark: $scope.data.address.billingLandMark,
      city: $scope.data.address.billingCity,
      state: $scope.data.address.billingState,
      country: $scope.data.address.billingCountry,
      pincode: $scope.data.address.billingPincode,
    }

    if ($scope.data.address.mobileNo == null || $scope.data.address.mobileNo.length == 0) {
      $scope.data.address.mobileNo = $scope.me.profile.mobile
    }
  }


  $scope.$watch('data.address.pincode', function(newValue, oldValue) {
    if (newValue != null) {
      if (newValue.length == 6) {
        $http({
          method: 'GET',
          url: '/api/POS/genericPincode/?pincode__iexact=' + newValue
        }).
        then(function(response) {
          if (response.data.length > 0) {
            $scope.showMessage = false
            $scope.data.address.city = response.data[0].city
            $scope.data.address.state = response.data[0].state
          }

          $scope.showMessage = false

        })
      } else if (newValue.length < 6) {
        $scope.showMessage = false
      }
    }
  })
  //
  $scope.$watch('data.billingAddress.pincode', function(newValue, oldValue) {
    if (newValue != null) {
      if (newValue.length == 6) {
        $http({
          method: 'GET',
          url: '/api/POS/genericPincode/?pincode__iexact=' + newValue
        }).
        then(function(response) {
          if (response.data.length > 0) {
            $scope.data.billingAddress.city = response.data[0].city
            $scope.data.billingAddress.state = response.data[0].state
            $scope.data.billingAddress.country = 'India'
          }
        })
      } else if (newValue.length < 6) {
        $scope.data.billingAddress.city = ''
        $scope.data.billingAddress.state = ''
      }
    }
  })
  // }
  //
  $scope.change = function() {
    $scope.saved = false
    $scope.data.address = {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      mobileNo: $scope.me.profile.mobile,
      landMark: ''
    }
    $scope.data.billingAddress = {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      landMark: ''
    }
    if (settings_isStoreGlobal) {
      $scope.data.address.country = ''
    }
  }
  $scope.cancel = function() {
    $scope.newAdr = false
    $scope.addressview = false
  }

  $scope.resetAdd = function() {
    $scope.newAdr = true
    $scope.idx = null
    $scope.addressview = false
    $scope.data.address = {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      mobileNo: $scope.me.profile.mobile,
      landMark: ''
    }
    $scope.data.billingAddress = {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      mobileNo: $scope.me.profile.mobile,
      landMark: ''
    }

  }

  $scope.show = function(idx) {
    $scope.addressview = false
    $scope.idx = idx
    $scope.newAdr = false
  }

  $scope.saveAdd = function() {
    if ($scope.data.address.pincode.length == 0 || $scope.data.address.city.length == 0 || $scope.data.address.state.length == 0 || $scope.data.address.country.length == 0 || $scope.data.address.mobileNo == null || $scope.data.address.mobileNo.length == 0) {
      Flash.create('danger', 'Please Fill Address Details');
      return;
    }

    if ($rootScope.dataToSend.sameAsShipping == false) {
      $scope.data.address.billingCity = $scope.data.billingAddress.city
      $scope.data.address.billingState = $scope.data.billingAddress.state
      $scope.data.address.billingLandMark = $scope.data.billingAddress.landMark
      $scope.data.address.billingCountry = $scope.data.billingAddress.country
      $scope.data.address.billingPincode = $scope.data.billingAddress.pincode
      $scope.data.address.billingStreet = $scope.data.billingAddress.street
    } else {
      $scope.data.address.billingCity = ''
      $scope.data.address.billingState = ''
      $scope.data.address.billingLandMark = ''
      $scope.data.address.billingCountry = ''
      $scope.data.address.billingPincode = 0
      $scope.data.address.billingStreet = ''
    }
    $scope.data.address.sameAsShipping = $rootScope.dataToSend.sameAsShipping

    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.ecommerce.checkout.addressmodel.html',
      size: 'md',
      backdrop: true,
      resolve: {
        add: function() {
          return $scope.data.address;
        }
      },
      controller: function($scope, $state, $http, $timeout, $uibModal, $users, Flash, $uibModalInstance, add) {
        $scope.adrForm = add;
        if ($scope.adrForm.title == undefined) {
          $scope.adrForm.title = ''
        }
        $scope.adrForm.primary = false
        $scope.saveAdrForm = function() {
          if ($scope.adrForm.title.length == 0) {
            Flash.create('danger', 'Please Mention Some Title');
            return;
          }
          if ($scope.adrForm.pincode.length == 0) {
            delete $scope.adrForm.pincode
          }
          $scope.adrForm.store = STORE_PK
          var method = 'POST'
          var url = '/api/POS/address/'
          if ($scope.adrForm.pk) {
            method = 'PATCH'
            url += $scope.adrForm.pk + '/'
          }
          $http({
            method: method,
            url: url,
            data: $scope.adrForm
          }).
          then(function(response) {
            Flash.create('success', 'Added');
            $scope.adrForm = response.data
            $uibModalInstance.dismiss($scope.adrForm);
          }, function(response) {
            Flash.create('danger', response.status + ' : ' + response.statusText);
          })

        }
      },
    }).result.then(function() {

    }, function(f) {
      if (typeof(f) != 'string') {
        if ($scope.data.address.pk) {

        } else {
          $scope.data.address.pk = f.pk
          $scope.savedAddress.push($scope.data.address)
        }

      }

    });
  }



  $scope.$watch('dataToSend.sameAsShipping', function(newValue, oldValue) {
    if (newValue == false) {
      $scope.showFields = true;

    } else {
      $scope.showFields = false;
      $rootScope.dataToSend.billingAddress = ''
    }
  })
  $scope.errormsg = ''
  $scope.next = function() {

    window.scrollTo(0, 0);

    if ($scope.data.address.mobileNo == '' || $scope.data.address.mobileNo == null || $scope.data.address.city == '' || $scope.data.address.pincode == '' || $scope.data.address.country == '' || $scope.data.address.state == '' || $scope.data.address.street == '') {
      $scope.errormsg = "Please Select Address"
      return
    } else {
      $rootScope.dataToSend.mobile = $scope.me.profile.mobile
      $rootScope.dataToSend.address = $scope.data.address
      if ($scope.data.billingAddress.state == '' && $rootScope.dataToSend.sameAsShipping == false) {
        Flash.create('warning', 'Please Add Billing Address')
        return
      } else if ($rootScope.dataToSend.sameAsShipping == true) {
        $rootScope.dataToSend.billingAddress = $scope.data.address
      } else {
        $rootScope.dataToSend.billingAddress = $scope.data.billingAddress
      }
    }


    if ($rootScope.dataToSend.address.pk == undefined) {
      var addressToPost = $rootScope.dataToSend.address
      addressToPost.title = $rootScope.dataToSend.address.street
      addressToPost.primary = false
      $http({
        method: 'POST',
        url: '/api/POS/address/',
        data: addressToPost
      }).
      then(function(response) {
        $rootScope.dataToSend.address = response.data
        $scope.savedAddress.push($rootScope.dataToSend.address)
        $scope.resetAdd()
      }, function(response) {
        Flash.create('danger', response.status + ' : ' + response.statusText);
      })
    }
    // $scope.data.stage = 'payment'

    $state.go('payment')

  }

  $scope.prev = function() {
    $state.go('checkout')
  }

  $scope.data.stage = 'shippingDetails'




})


app.controller('controller.ecommerce.payment', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash, $window) {


  $scope.currency = "fa-inr"
  $scope.me = $users.get('mySelf');

  if ($rootScope.total == undefined || $rootScope.dataToSend.address == undefined) {
    $state.go('checkout')
  }
  $scope.data = {}


  $scope.errormsg = ''


  $scope.prev = function() {
    $state.go('address')
  }



  $scope.pay = function() {
    $rootScope.dataToSend.modeOfPayment = $scope.data.modeOfPayment
    $rootScope.dataToSend.modeOfShopping = 'online'
    $rootScope.dataToSend.paidAmount = 0
    $rootScope.dataToSend.approved = false
    $scope.data.stage = 'processing'
    $rootScope.dataToSend.products = $rootScope.cartData
    $http({
      method: 'POST',
      url: '  /api/ecommerce/createOrder/',
      data: $rootScope.dataToSend
    }).
    then(function(response) {
      window.location = '/makeOnlinePayment/?orderid=' + response.data.odnumber;
    })
  }
  //
  $scope.order = function() {
    $rootScope.dataToSend.modeOfPayment = $scope.data.modeOfPayment
    $rootScope.dataToSend.store = $scope.storeData.pk
    $rootScope.dataToSend.total = $rootScope.total
    $rootScope.dataToSend.modeOfShopping = 'online'
    if ($rootScope.dataToSend.modeOfPayment == 'COD') {
      $rootScope.dataToSend.paidAmount = 0
    } else {
      $rootScope.dataToSend.paidAmount = 0
    }
    if (typeof $rootScope.couponData == 'object' && $rootScope.couponData != undefined) {
      $rootScope.dataToSend.coupon = $rootScope.couponData.pk
    }
    $scope.data.stage = 'processing';

    $http({
      method: 'POST',
      url: '  /api/POS/createOrder/',
      data: $rootScope.dataToSend
    }).
    then(function(response) {
      $scope.order = response.data
      window.location = '/orderSuccessful/?orderid=' + $scope.order.pk;
      $scope.data.stage = 'confirmation';
      $rootScope.inCart = [];
      $rootScope.inFavourite = [];
      $scope.item = [];

    })

  }
  $scope.data.stage = 'payment'

})


app.controller('controller.ecommerce.checkout', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash, $filter) {

  $scope.currency = "fa-inr"
  $scope.me = $users.get('mySelf');

  var url = new URL(window.location.href)
  var action = url.searchParams.get("action")
  // if (action == 'retry') {
  //   $scope.data.stage = 'payment';
  // } else if (action == 'success') {
  //   $http({
  //     method: 'GET',
  //     url: '/api/ecommerce/order/' + url.searchParams.get('orderid') + '/'
  //   }).
  //   then(function(response) {
  //     $scope.data.stage = 'confirmation';
  //     $scope.order = {
  //       odnumber: response.data.pk,
  //       dt: new Date(),
  //       paymentMode: 'Online'
  //     }
  //   })
  // } else {
  //
  // }
  // //
  $scope.data = {}
  $scope.data.stage = 'review'
  $scope.deleteFromCart = function(indx, value) {
    $http({
      method: 'DELETE',
      url: '/api/POS/cart/' + value + '/',
    }).
    then(function(response) {
      Flash.create("success", 'Product Removed')
      $rootScope.cartData.splice(indx, 1)
      $rootScope.cartLength -= 1
      $rootScope.calcTotal()
    })
  }

  $rootScope.calcTotal = function() {
    $rootScope.total = 0;
    $rootScope.shippingCharges = 0;
    $rootScope.grandTotal = 0
    for (var i = 0; i < $rootScope.cartData.length; i++) {
      var tot = 0
      var shipping = 0
      var tot = $rootScope.cartData[i].qty * $rootScope.cartData[i].productVariant.sellingPrice
      var shipping = $rootScope.cartData[i].qty * $rootScope.cartData[i].productVariant.shippingCost
      $rootScope.total += tot
      $rootScope.shippingCharges += shipping
    }
    $rootScope.grandTotal = $rootScope.total + $rootScope.shippingCharges
    if (typeof $rootScope.couponData == 'object' && $rootScope.couponData != undefined) {
      $rootScope.discountedPrice = ($rootScope.couponData.discount / 100) * $rootScope.grandTotal
      $rootScope.grandTotal = $rootScope.grandTotal - $rootScope.discountedPrice
    }
  }
  $timeout(function() {
    $rootScope.calcTotal()
  }, 500);



  $scope.changeQty = function(pk, indx, val) {
    if (val == 'increment') {
      $rootScope.cartData[indx].qty += 1
    }
    if (val == 'decrement') {
      $rootScope.cartData[indx].qty -= 1
    }
    if ($rootScope.cartData[indx].qty <= 1) {
      $rootScope.cartData[indx].qty = 1
    }
    $http({
      method: 'PATCH',
      url: '/api/POS/cart/' + $rootScope.cartData[indx].pk + '/',
      data: {
        qty: $rootScope.cartData[indx].qty
      }
    }).
    then(function(res) {})
    $rootScope.calcTotal()
  }

  $scope.next = function() {
    //
    // if ($rootScope.limitValue) {
    //   if ($scope.totalAfterPromo > $rootScope.limitValue || $scope.totalAfterDiscount > $rootScope.limitValue) {
    //     $scope.totalLimit = true
    //   } else {
    //     $scope.totalLimit = false
    //   }
    // }
    window.scrollTo(0, 0);
    $state.go('address')

  }
  $scope.data.stage = 'review'
})

app.controller('applyCoupon', function($scope, $rootScope, $state, $http, $timeout) {

  $rootScope.getCoupon = function() {
    $rootScope.couponData = ''
    $rootScope.discountedPrice = 0
    $http({
      method: 'GET',
      url: '/api/POS/promocodevs/?coupon_name=' + $scope.coupon + '&store=' + STORE_PK,
    }).
    then(function(response) {
      if (response.data.length > 0) {
        $rootScope.couponData = response.data[0]
        $scope.coupon = ''
      }
      $rootScope.calcTotal()
    })
  }

})

app.controller('controller.ecommerce.shippingError.modal', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, $interval, Flash, $uibModalInstance) {

  $http.get('/api/ERP/appSettings/?app=25&name__iexact=email').
  then(function(response) {
    $scope.supportEmail = response.data[0].value
  })

  $http.get('/api/ERP/appSettings/?app=25&name__iexact=phone').
  then(function(response) {
    $scope.supportPhone = response.data[0].value
  })

  $scope.clickedOkay = function() {
    $uibModalInstance.dismiss();
  }
})


app.controller('ecommerce.main', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, $interval, Flash, $sce) {


  $scope.me = $users.get('mySelf')

  $http({
    method: 'GET',
    url: '/api/POS/store/' + STORE_PK + '/'
  }).then(function(response) {
    $rootScope.storeData = response.data
  })

  $http.get('/api/POS/categorysortlist/').
  then(function(response) {
    $scope.categoriesList = response.data
  })

  $scope.showcat = function() {
    if (document.getElementById("catpositionfetch").style.display == "block") {
      document.getElementById("catpositionfetch").style.display = "none";
    } else {
      document.getElementById("catpositionfetch").style.display = "block";
    }
  }

  $scope.onDropdownEnterProfile = false
  $scope.headerSmallProfile = function() {
    $scope.onDropdownEnterProfile = !$scope.onDropdownEnterProfile
  }


  $scope.selectedOne = function(data) {
    $scope.childData = data
  }
  $scope.selectedDropdown = function(data) {
    $scope.childData = data
    $scope.onChildEnter = true

  }

  $rootScope.cartData = 0
  $rootScope.cartLength = []
  if ($scope.me != null) {
    $http({
      method: 'GET',
      url: '/api/POS/cart/?store=' + STORE_PK + '&user=' + $scope.me.pk
    }).then(function(response) {
      $rootScope.cartData = response.data
      $rootScope.cartLength = response.data.length
      if ($rootScope.addToCart.length > 0) {
        for (var i = 0; i < $rootScope.addToCart.length; i++) {
          $rootScope.addToCart[i].added = false
          for (var j = 0; j < $rootScope.cartData.length; j++) {
            if ($rootScope.cartData[j].productVariant.pk == $rootScope.addToCart[i].productVariant) {
              $rootScope.addToCart[i].added = true
              var dataToSend = {
                qty: $rootScope.addToCart[i].qty,
              }
              $http({
                method: 'PATCH',
                url: '/api/POS/cart/' + $rootScope.cartData[j].pk + '/',
                data: dataToSend
              }).
              then(function(res) {
                $rootScope.cartData[j] = response.data
              })
            }
          }
          if ($rootScope.addToCart[i].added == false) {
            var dataToSend = {
              product: $rootScope.addToCart[i].product,
              productVariant: $rootScope.addToCart[i].productVariant,
              qty: $rootScope.addToCart[i].qty,
              store: STORE_PK
            }

            $http({
              method: 'POST',
              url: '/api/POS/cart/',
              data: dataToSend
            }).
            then(function(res) {
              $rootScope.cartLength += 1
              $rootScope.cartData.push(res.data)
            })

          }

          function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
          }
          detail = getCookie("addToCart");
          if (detail != "") {
            setCookie("addToCart", "", -1);
          }
        }
        $rootScope.addToCart = []
        $state.go('checkout')
      }
    });

  }


  $scope.me = $users.get('mySelf')

  $rootScope.addToCart = []
  $scope.addTCart = getCookie('addToCart')
  if ($scope.addTCart != '') {
    $rootScope.addToCart = JSON.parse($scope.addTCart)
  }

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  $scope.loginPage = function() {
    window.location = '/login';
  }
  $scope.logoutPage = function() {
    window.location = '/logout';
  }

  $scope.goToAdmin = function() {
    window.location = '/ERP/';
  }

  $scope.registerPage = function() {
    window.location = '/register';
  }

});
app.controller('controller.ecommerce.pincodeEnquiry.modal', function($scope, $rootScope, $state, $http, $users, $interval, $uibModal, $uibModalInstance, Flash) {
  $scope.close = function() {
    $uibModalInstance.close();
  }
  $scope.form = {
    pincode: ''
  }

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {

        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function createCookieDetail(pincode) {
    detail = getCookie("userPincode");
    if (detail != "") {
      document.cookie = encodeURIComponent("userPincode") + "=deleted; expires=" + new Date(0).toUTCString()
    }
    setCookie("userPincode", pincode, 365);
  }

  $scope.checkPincode = function() {
    if ($scope.form.pincode.toString().length != 6) {
      Flash.create('danger', "Please enter a correct Pincode");
      return
    }


    $scope.showSpinner = false

    $http.get('/api/POS/store/?pincode=' + $scope.form.pincode).
    then(function(response) {
      $scope.stores = response.data
      if (response.data.length > 0) {
        $rootScope.pin = response.data[0].pincode
        createCookieDetail(response.data[0].pincode)
        $scope.showSpinner = true
        $rootScope.$broadcast('filterForStore', {
          pin: response.data[0].pincode
        });
        $rootScope.$broadcast('filterForCategoryStore', {
          pin: response.data[0].pincode
        });
        setTimeout(function() {
          $scope.showSpinner = false
          $uibModalInstance.close();
        }, 2000);
      } else {
        $scope.form.pincode = ''
      }
    })
  }
});

app.controller('controller.ecommerce.FAQ.modal', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash, $uibModalInstance, $sce) {
  $scope.me = $users.get('mySelf')

  $scope.close = function() {
    $uibModalInstance.close();
  }


  $http({
    method: 'GET',
    url: '/api/ecommerce/frequentlyQuestions/'
  }).
  then(function(response) {
    $scope.fAQ = response.data
    for (var i = 0; i < $scope.fAQ.length; i++) {
      $scope.fAQ[i].ans = $sce.trustAsHtml($scope.fAQ[i].ans)
    }
  })
  $scope.ind = -1
  $scope.collapsed = function(indx) {
    $scope.ind = indx
  }

  $scope.message = {
    email: '',
    mobile: '',
    invoiceNo: '',
    subject: '',
    body: ''
  };
  $scope.sendMessage = function() {
    if ($scope.me == null || $scope.me == undefined) {
      if ($scope.message.invoiceNo == '' || $scope.message.body == '' || $scope.message.mobile == '' || $scope.message.email == '') {
        Flash.create("warning", "Please Add Email and Mobile")
      } else {
        var dataToSend = {
          email: $scope.message.email,
          mobile: $scope.message.mobile,
          invoiceNo: $scope.message.invoiceNo,
          subject: $scope.message.subject,
          message: $scope.message.body
        }
      }
    } else {
      if ($scope.message.invoiceNo == '' || $scope.message.body == '' || $scope.message.email == '') {
        Flash.create("warning", "Please Add Email and Mobile")
      } else {
        var dataToSend = {
          email: $scope.message.email,
          mobile: $scope.me.profile.mobile,
          invoiceNo: $scope.message.invoiceNo,
          subject: $scope.message.subject,
          message: $scope.message.body
        }
      }

    }

    $http({
      method: 'POST',
      url: '/api/ecommerce/supportFeed/',
      data: dataToSend
    }).
    then(function(response) {
      $scope.message = {
        email: '',
        mobile: '',
        invoiceNo: '',
        subject: '',
        body: ''
      };
      Flash.create('success', response.status + ' : ' + response.statusText);
    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    })
  }


});
app.controller('controller.ecommerce.feedBack.modal', function($scope, $rootScope, $state, $http, $users, $interval, $uibModal, $uibModalInstance, Flash) {
  $scope.me = $users.get('mySelf')
  $scope.close = function() {
    $uibModalInstance.close();
  }

  $scope.feedback = {
    email: '',
    subject: '',
    mobile: null,
    message: ''
  };
  $scope.sendFeedback = function() {
    if ($scope.me == null || $scope.me == undefined) {
      if ($scope.feedback.email == '' || $scope.feedback.mobile == 5 || $scope.feedback.message == '') {
        Flash.create("warning", "Please Add Email and Mobile")
      } else {
        var toSend = {
          email: $scope.feedback.email,
          mobile: $scope.feedback.mobile,
          subject: $scope.feedback.subject,
          message: $scope.feedback.message,
        }
      }
    } else {
      if ($scope.feedback.email == '' || $scope.feedback.message == '') {
        Flash.create("warning", "Please Add Email and Mobile")
      } else {
        var toSend = {
          email: $scope.feedback.email,
          mobile: $scope.me.profile.mobile,
          subject: $scope.feedback.subject,
          message: $scope.feedback.message,
        }
      }

    }
    $http({
      method: 'POST',
      url: '/api/ecommerce/supportFeed/',
      data: toSend
    }).
    then(function(response) {
      Flash.create('success', 'Thank you!');
      $scope.feedback = {
        email: '',
        subject: '',
        mobile: null,
        message: ''
      };
    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    });
  }
});

app.controller('controller.ecommerce.contact.modal', function($scope, $rootScope, $state, $http, $users, $interval, $uibModal, $uibModalInstance, Flash) {

  $scope.close = function() {
    $uibModalInstance.close();
  }


  $scope.sendFeedback = function() {

    if ($scope.feedback.email == '') {
      Flash.create('danger', 'Please provide details')
    } else {
      var toSend = {
        email: $scope.feedback.email,
        mobile: $scope.feedback.mobile,
        message: $scope.feedback.message,
      }
    }

    $http({
      method: 'POST',
      url: '/api/ecommerce/supportFeed/',
      data: toSend
    }).
    then(function(response) {
      Flash.create('success', 'Thank you!');
      $scope.feedback = {
        email: '',
        mobile: null,
        message: ''
      };
    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    });
  }
});

app.controller('controller.ecommerce.list', function($scope, $rootScope, $state, $http, Flash, $users, $interval, $filter, $timeout, $parse, $sce) {

  $scope.currency = 'fa-inr'
  $scope.openDetails = function(id, name, vid) {
    $state.go('details', {
      id: id,
      name: name,
      vid: vid
    })
  }

  $http({
    method: 'GET',
    url: '/api/POS/fetchallproducts/'
  }).
  then(function(response) {
    $scope.offerbanner1 = response.data.offerbanners1
    $scope.offerbanner2 = response.data.offerbanners2
    $scope.dealsoftheweek = response.data.dealsoftheweek
    $scope.dealsfeatured = response.data.dealsfeatured
    $scope.dealsonsale = response.data.dealsonsale
    $scope.dealsbestrated = response.data.dealsbestrated
    $scope.hotfeatured = response.data.hotfeatured
    $scope.hotonsale = response.data.hotonsale
    $scope.hotbestrated = response.data.hotbestrated
    $scope.leve3listno1 = response.data.leve3listno1
    $scope.leve3listno2 = response.data.leve3listno2
    $scope.leve3listno3 = response.data.leve3listno3
    $scope.popularcat = response.data.popularcat
    $scope.trends = response.data.trends
    console.log(response.data, "jjjjjjjjjjjjjjjjjjjjjjjjjj");
  })
  console.log(STORE_PK, 'ppppppppppp');
  $scope.tabData = 1;
  $scope.showFirstTab = function(indx) {
    $scope.tabData = indx
  }
  $scope.secondtabData = 1;
  $scope.showSecondTab = function(indx) {
    $scope.secondtabData = indx
  }
  $scope.thirdtabData = 1;
  $scope.showThirdTab = function(indx) {
    $scope.thirdtabData = indx
  }
  $scope.curosel1_properties = {
    lazyLoad: true,
    items: 1,
    loop: true,
    autoplay: false,
    autoplayTimeout: 5000,
    dots: false,
    smartSpeed: 1000,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 1
      }
    },
    navContainer: '#dealsNav ',
    navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
  };
  //homepage carousels


  // $("#popular_caousel").owlCarousel({
  //   autoPlay: 3000, //Set AutoPlay to 3 seconds
  //   items: 4,
  //   itemsDesktop: [1199, 3],
  //   itemsDesktopSmall: [979, 3],
  // });
  $scope.curosel2_properties = {
    lazyLoad: false,
    items: 4,
    loop: true,
    autoplay: false,
    autoplayTimeout: 5000,
    dots: false,
    responsive: {
      0: {
        items: 1
      },
      479: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 5,
      }
    },
    navContainer: '#trendsNav ',
    navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
  };
  $scope.curosel4_properties = {
    lazyLoad: true,
    items: 3,
    loop: true,
    autoplay: true,
    autoplayTimeout: 5000,
    dots: false,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 4
      }
    },
    navContainer: '.trendsNav ',
    navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
  };
  $scope.curosel1mobile_properties = {
    lazyLoad: false,
    items: 1,
    loop: true,
    autoplay: true,
    autoplayTimeout: 10000,
    dots: false,
    responsive: {
      0: {
        items: 1
      },
      479: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 1,
      }
    },
  };

  //homepage endcarousels
  var curday;
  var secTime;
  var ticker;

  function getSeconds() {
    var nowDate = new Date();
    var dy = 6; //Sunday through Saturday, 0 to 6
    var countertime = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), 00, 0, 0); //20 out of 24 hours = 8pm

    var curtime = nowDate.getTime(); //current time
    var atime = countertime.getTime(); //countdown time
    var diff = parseInt((atime - curtime) / 1000);
    if (diff > 0) {
      curday = dy - nowDate.getDay()
    } else {
      curday = dy - nowDate.getDay() - 1
    } //after countdown time
    if (curday < 0) {
      curday += 7;
    } //already after countdown time, switch to next week
    if (diff <= 0) {
      diff += (86400 * 7)
    }
    startTimer(diff);
  }

  function tick() {
    var secs = secTime;
    if (secs > 0) {
      secTime--;
    } else {
      clearInterval(ticker);
      getSeconds(); //start over
    }

    var days = Math.floor(secs / 86400);
    secs %= 86400;
    var hours = Math.floor(secs / 3600);
    secs %= 3600;
    var mins = Math.floor(secs / 60);
    secs %= 60;

    //update the time display
    $scope.days = curday;
    $scope.hours = ((hours < 10) ? "0" : "") + hours;
    $scope.mins = ((mins < 10) ? "0" : "") + mins;
    $scope.secs = ((secs < 10) ? "0" : "") + secs;
  }

  function startTimer(secs) {
    secTime = parseInt(secs);
    // ticker = setInterval(tick(),1000);
    tick(); //initial count display
  }




  $interval(getSeconds, 1000);
  $(document).ready(function() {
    getSeconds();
  });



});
