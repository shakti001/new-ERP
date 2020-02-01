app.controller('businessManagement.ecommerce.configure.offerBanner.explore', function($scope, $http, $aside, $state, Flash, $users, $filter, $permissions,$rootScope) {
  $scope.data = $scope.tab.data.offerBanner;
})


app.controller('businessManagement.ecommerce.configure.offerBanner', function($scope, $http, $aside, $state, Flash, $users, $filter, $permissions,$rootScope) {
$scope.storeId = STORE_PK
  $scope.resetForm = function(){
    $scope.form = {
      image: emptyFile,
      imagePortrait: emptyFile,
      title: '',
      subtitle: '',
      level: 1,
      page: ''
    };
    $scope.url = '/api/POS/offerBannervs/';
    $scope.method = 'POST';
    $scope.mode = 'new'
    $scope.msg = 'Create'
  }
  $scope.resetForm()

  $scope.$on('offerBannerUpdate', function(event, input) {
    console.log("recieved");
    console.log(input.data);
    $scope.msg = 'Update'
    $scope.form = input.data
    $scope.mode = 'edit'
    $scope.url = '/api/POS/offerBannervs/' + input.data.pk + '/?mode=configure';
    $scope.method = 'PATCH';

  });

  $scope.pageSearch = function(query) {
    console.log(query);
    return $http.get('/api/POS/pagesvs/?title__icontains=' + query).
    then(function(response) {
      console.log('**********************', response);
      return response.data;
    })
  }


  $scope.submit = function() {

    if ($scope.form.title.length == 0) {
      Flash.create('danger', 'Please Mention Some Title');
      return;
    }
    var fd = new FormData();
    fd.append('title', $scope.form.title);
    fd.append('level', $scope.form.level);
    fd.append('store', $scope.storeId);
    if ($scope.form.subtitle != null && $scope.form.subtitle.length > 0) {
      fd.append('subtitle', $scope.form.subtitle);
    }
    if ($scope.mode == 'new') {

      if ($scope.form.image == emptyFile) {
        Flash.create('danger', 'No image selected');
        return;
      } else {
        fd.append('image', $scope.form.image);
      }
      if ($scope.form.imagePortrait == emptyFile) {
        Flash.create('danger', 'No Potrait image selected');
        return;
      } else {
        fd.append('imagePortrait', $scope.form.imagePortrait);
      }
      if ($scope.form.page == null || $scope.form.page == '' || typeof $scope.form.page != 'object') {
        Flash.create('danger', 'Please Selcet Some Page');
        return;
      }else {
        fd.append('page', $scope.form.page.pk);
      }
    } else {
      fd.append('active', $scope.form.active);
      if (typeof $scope.form.image != 'string' && $scope.form.image != emptyFile) {
        fd.append('image', $scope.form.image);
      }

      if (typeof $scope.form.imagePortrait != 'string' && $scope.form.imagePortrait != emptyFile) {
        fd.append('imagePortrait', $scope.form.imagePortrait);
      }
      if ($scope.form.page == '') {
        Flash.create('danger', 'Please Selcet Some Page');
        return;
      }else {
        if (typeof $scope.form.page == 'object') {
          fd.append('page', $scope.form.page.pk);
        }
      }
    }
    $http({
      method: $scope.method,
      url: $scope.url,
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      Flash.create('success', response.status + ' : ' + response.statusText);
      $rootScope.$broadcast('forceRefetch', {});
      $scope.resetForm()
    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    });
  }



});

app.controller('businessManagement.ecommerce.configure.fAQ.form', function($scope, $http, $aside, $state, Flash, $users, $filter, $permissions,$rootScope,$uibModal) {
$scope.storeId = STORE_PK
  $scope.tinymceOptions = {
    selector: 'textarea',
    content_css : '/static/css/bootstrap.min.css',
    inline: false,
    plugins : 'advlist autolink link image lists charmap preview imagetools paste table insertdatetime code searchreplace ',
    skin: 'lightgray',
    theme : 'modern',
    height : 280,
    toolbar : 'saveBtn publishBtn cancelBtn headerMode bodyMode | undo redo | bullist numlist | alignleft aligncenter alignright alignjustify | outdent  indent blockquote | bold italic underline | image link | style-p style-h1 style-h2 style-h3',
    setup: function (editor ) {

      [ 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(function(name){
       editor.addButton("style-" + name, {
           tooltip: "Toggle " + name,
             text: name.toUpperCase(),
             onClick: function() { editor.execCommand('mceToggleFormat', false, name); },
             onPostRender: function() {
                 var self = this, setup = function() {
                     editor.formatter.formatChanged(name, function(state) {
                         self.active(state);
                     });
                 };
                 editor.formatter ? setup() : editor.on('init', setup);
             }
         })
      });

    },
  };
  $scope.parentSearch = function(query){
    return $http.get('/api/POS/faqCategoryvs/?store='+$scope.storeId+'&name__icontains=' + query+"&limit=10").
    then(function(response){
        return response.data.results;
    })
  };


  $scope.addCategory = function(edit){
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.ecommerce.vendor.configure.category.html',
      size: 'md',
      backdrop: false,
      resolve: {
          edit: function() {
               return edit
           },
          data: function() {
               return $scope.data
           }
         },
      controller: function($scope,edit,$uibModalInstance,data) {
        $scope.storeId = STORE_PK
        $scope.form = {
          name:''
        }
        if(edit){
          $scope.action = 'Edit'
          $scope.url = '/api/POS/faqCategoryvs/'+data.parent.pk+'/';
          $scope.method = 'PATCH';
          $scope.form.name = data.parent.name
        }else{
          $scope.action = 'Create'
          $scope.url = '/api/POS/faqCategoryvs/';
          $scope.method = 'POST';
        }

        $scope.save = function() {
          if($scope.form.name.length == 0){
            Flash.create('warning', 'Enter Category Name');
            return
          }
          var datatsend = $scope.form
          datatsend.store = $scope.storeId
          $http({
            method: $scope.method,
            url: $scope.url,
            data: datatsend,
          }).
          then(function(response) {
            Flash.create('success', 'Created');
            $uibModalInstance.dismiss(response.data)
          })

        }

      },
    }).result.then(function() {

    }, function(data) {
     $scope.data.parent = data
    });
  }

  if (angular.isUndefined($scope.data.pk)) {
    $scope.mode = 'new';
    $scope.msg = 'Create';
    $scope.data = {
      ques: '',
      ans: '',
      parent:'',
    };
    $scope.url = '/api/POS/frequentlyquestionvs/';
    $scope.method = 'POST';
  } else {
    $scope.mdoe = 'edit';
    $scope.msg = 'Update';
    $scope.url = '/api/POS/frequentlyquestionvs/' + $scope.data.pk + '/';
    console.log($scope.data,'ppppppppp');
    // ?mode=configure
    $scope.method = 'PATCH';
  }
  $scope.categoryEdit  = false
  $scope.$watch('data.parent', function (newValue,oldValue) {
    console.log(newValue,oldValue,'jjjjjjjjjjjj');
  if (typeof newValue == 'object') {
    $scope.categoryEdit  = true
   }else{
    $scope.categoryEdit  = false
  }
});

  $scope.saveFAQ = function() {
    var f = $scope.data
    if (f.ques.length == 0) {
      Flash.create('warning', 'Please Write The Question');
      return;
    }
    if (f.ans.length == 0) {
      Flash.create('warning', 'Please Write The Answer');
      return;
    }
    if (f.parent != undefined) {
      var parent = f.parent.pk
    }else{
      var parent = null
    }
    var toSend = {ques:f.ques,ans:f.ans,parent:parent}
    toSend.store = $scope.storeId
    console.log(toSend);
    $http({
      method: $scope.method,
      url: $scope.url,
      data: toSend,
    }).
    then(function(response) {
      if ($scope.mode == 'new') {
        $scope.data = {
          ques: '',
          ans: '',
          parent:'',
        };
        $rootScope.$broadcast('forceRefetch', {});
      }
      Flash.create('success', response.status + ' : ' + response.statusText);
    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    });
  }

});


app.controller('businessManagement.ecommerce.configure', function($scope, $uibModal, $http, $aside, $state, Flash, $users, $filter, $permissions , $rootScope) {

  $scope.storeId = STORE_PK

  $scope.data = {
    tableFieldData: [],
    tableproductData: [],
    tablePromocodeData: [],
    tableOfferBannersData: [],
  };

  // var fieldViews = [{
  //   name: 'list',
  //   icon: 'fa-th-large',
  //   template: '/static/ngTemplates/genericTable/genericSearchList.html',
  //   itemTemplate: '/static/ngTemplates/app.ecommerce.vendor.configure.field.item.html',
  // }, ];

  var productViews = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.ecommerce.vendor.configure.product.item.html',
  }, ];

  var promocodeViews = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.ecommerce.vendor.configure.promocode.item.html',
  }, ];


  //
  // $scope.fieldConfig = {
  //   views: fieldViews,
  //   url: '/api/ecommerce/field/',
  //   searchField: 'name',
  //   deletable: true,
  //   itemsNumPerView: [12, 24, 48],
  // }

  var productmultiselectOptions = [{
    icon: 'fa fa-plus',
    text: 'bulkUpload'
  },
  {
    icon: 'fa fa-plus',
    text: 'new'
  },];

  $scope.genericProductConfig = {
    views: productViews,
    url: '/api/POS/categorysv/',
    getParams: [{
      key: 'store',
      value: $scope.storeId
    }],
    searchField: 'name',
    deletable: true,
    itemsNumPerView: [12, 24, 48],
    multiselectOptions: productmultiselectOptions,
  }

  $scope.promocodesConfig = {
    views: promocodeViews,
    url: '/api/POS/promocodevs/',
    getParams: [{
      key: 'store',
      value: $scope.storeId
    }],
    searchField: 'name',
    deletable: true,
    itemsNumPerView: [12, 24, 48],
  }


  $scope.offerBannersConfig = {
    views: [{
      name: 'list',
      icon: 'fa-th-large',
      template: '/static/ngTemplates/genericTable/genericSearchList.html',
      itemTemplate: '/static/ngTemplates/app.ecommerce.vendor.form.offerBanner.item.html',
    }, ],
    url: '/api/POS/offerBannervs/',
    getParams: [{
      key: 'store',
      value: $scope.storeId
    }],
    searchField: 'title',
    deletable: true,
    itemsNumPerView: [12, 24, 48],
  }

  $scope.fAQConfig = {
    views: [{
      name: 'table',
      icon: 'fa-bars',
      template: '/static/ngTemplates/genericTable/tableDefault.html'
    }, ],
    url: '/api/POS/frequentlyquestionvs/',
    getParams: [{
      key: 'store',
      value: $scope.storeId
    }],
    deletable: true,
    searchField: 'ques',
    fields: [ 'pk' ,'created' , 'user' , 'ques' , 'ans','category'],
    canCreate: false,
    editorTemplate: '/static/ngTemplates/app.ecommerce.vendor.configure.FAQ.form.html',
  }


  $scope.editorTemplateField = '/static/ngTemplates/app.ecommerce.vendor.form.field.html';

  $scope.editorTemplateGenericProduct = '/static/ngTemplates/app.ecommerce.vendor.form.genericProduct.html';

  // $scope.tableActionFields = function(target, action, mode) {
  //   console.log(target, action, mode);
  //   console.log($scope.data.tableFieldData);
  //
  //   for (var i = 0; i < $scope.data.tableFieldData.length; i++) {
  //     if ($scope.data.tableFieldData[i].pk == parseInt(target)) {
  //       if (action == 'edit') {
  //         console.log('editing');
  //         var title = 'Edit Field : '
  //         var appType = 'editField'
  //       } else if (action == 'info')  {
  //         var title = 'Field Explore : '
  //         var appType = 'fieldExplore'
  //       }
  //       else if (action == 'delete') {
  //         $http({
  //           method: 'DELETE',
  //           url: '/api/ecommerce/field/' + $scope.data.tableFieldData[i].pk + '/'
  //         }).
  //         then(function(response) {
  //           Flash.create('success', 'Deleted Successfully!');
  //         })
  //         $scope.data.tableFieldData.splice(i, 1)
  //         return;
  //       }
  //       // i clicked this $scope.data.tableFieldData[i]
  //       $scope.addTab({
  //         title: title + $scope.data.tableFieldData[i].pk,
  //         cancel: true,
  //         app: appType,
  //         data: {
  //           pk: target,
  //           field: $scope.data.tableFieldData[i]
  //         },
  //         active: true
  //       })
  //     }
  //   }
  //
  // }

  $scope.tableProductAction = function(target, action, mode) {
    console.log(target, action, mode);
    console.log($scope.data.tableproductData);
    if (action == 'bulkUpload') {
     $scope.openProductBulkForm();
   }
   if (action == 'new') {
    $scope.newForm();
  }
   else{
     for (var i = 0; i < $scope.data.tableproductData.length; i++) {
       if ($scope.data.tableproductData[i].pk == parseInt(target)) {
         if (action == 'edit') {
           console.log('editing');
           var title = 'Edit Product : '
           var appType = 'editproduct'
         }else if (action == 'delete') {
           $http({method : 'DELETE' , url : '/api/POS/categorysv/' + target + '/'}).
           then(function(response) {
             Flash.create('success' , 'Deleted');
             $scope.$broadcast('forceRefetch', {});
           })
           return
         } else {
           var title = ' Explore : '
           var appType = 'productExplore'
         }
         // i clicked this $scope.data.tableproductData[i]
         $scope.addTab({
           title: title + $scope.data.tableproductData[i].pk,
           cancel: true,
           app: appType,
           data: {
             pk: target,
             field: $scope.data.tableproductData[i]
           },
           active: true
         })
       }
     }
   }

  }

  $scope.tableActionOfferBanners = function(target, action, mode) {
    console.log(target, action, mode);
    console.log($scope.data.tableOfferBannersData);

    for (var i = 0; i < $scope.data.tableOfferBannersData.length; i++) {
      if ($scope.data.tableOfferBannersData[i].pk == parseInt(target)) {
        if (action == 'edit') {
          console.log('editing');
          // var title = 'Edit OfferBanner : '
          // var appType = 'editOfferBanner'
          $rootScope.$broadcast('offerBannerUpdate', {data:$scope.data.tableOfferBannersData[i]});
        }else if (action == 'delete') {
          $http({method : 'DELETE' , url : '/api/POS/offerBannervs/' + target + '/'}).
          then(function(response) {
            Flash.create('success' , 'Deleted');
            $scope.$broadcast('forceRefetch', {});
          })
        } else {
          var title = 'OfferBanner Explore : '
          var appType = 'offerBannerExplore'
          $scope.addTab({
            title: title + $scope.data.tableOfferBannersData[i].pk,
            cancel: true,
            app: appType,
            data: {
              pk: target,
              offerBanner: $scope.data.tableOfferBannersData[i]
            },
            active: true
          })
        }
        // i clicked this $scope.data.tableOfferBannersData[i]

      }
    }

  }

  $scope.tablePromocodeAction = function(target, action, mode) {
    console.log(target, action, mode);
    console.log($scope.data.tablePromocodeData);

    for (var i = 0; i < $scope.data.tablePromocodeData.length; i++) {
      if ($scope.data.tablePromocodeData[i].pk == parseInt(target)) {
        if (action == 'editPromocode') {
          console.log('editPromocode');
          $rootScope.$broadcast('promoUpdate', {data:$scope.data.tablePromocodeData[i]});
        }
      }
    }

  }
  $scope.openProductBulkForm = function(idx) {


    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.ecommerce.genericProduct.bulkForm.html',
      size: 'md',
      backdrop: true,
      controller: function($scope, ) {

        $scope.bulkForm = {
          xlFile: emptyFile,
          success: false,
          usrCount: 0
        }
        $scope.upload = function() {
          if ($scope.bulkForm.xlFile == emptyFile) {
            Flash.create('warning', 'No file selected')
            return
          }
          console.log($scope.bulkForm.xlFile);
          var fd = new FormData()
          fd.append('xl', $scope.bulkForm.xlFile);
          console.log('*************', fd);
          $http({
            method: 'POST',
            url: '/api/ecommerce/bulkCategoryCreation/',
            data: fd,
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined
            }
          }).
          then(function(response) {
            Flash.create('success', 'Created');
            $scope.bulkForm.usrCount = response.data.count;
            $scope.bulkForm.success = true;
          })

        }

      },
    }).result.then(function() {

    }, function() {

    });


  }

  $scope.newForm = function(){

      $uibModal.open({
        templateUrl: '/static/ngTemplates/app.ecommerce.vendor.modal.html',
        size: 'lg',
        backdrop: true,
      }).result.then(function() {
      }, function() {

      });
  }

  $scope.tabs = [];
  $scope.searchTabActive = true;

  $scope.closeTab = function(index) {
    $scope.tabs.splice(index, 1)
  }

  $scope.addTab = function(input) {
    console.log(JSON.stringify(input));
    $scope.searchTabActive = false;
    alreadyOpen = false;
    for (var i = 0; i < $scope.tabs.length; i++) {
      if ($scope.tabs[i].data.pk == input.data.pk && $scope.tabs[i].app == input.app) {
        $scope.tabs[i].active = true;
        alreadyOpen = true;
      } else {
        $scope.tabs[i].active = false;
      }
    }
    if (!alreadyOpen) {
      $scope.tabs.push(input)
    }
  }
  $scope.pincodelist=[]
  $scope.form={pincodes:''}
  $scope.addPincode = function(){
    console.log('7777777777777777777',typeof $scope.form.pincodes);
    if (typeof $scope.form.pincodes=='undefined'){
        Flash.create('danger', 'Not a valid number!');
    }
    // var method = 'POST'
    // var url = '/api/ecommerce/addPincode/'
    dataToSend = {
      pincodes : $scope.form.pincodes,
    }
    $http({method : 'POST' , url : '/api/ecommerce/addPincode/', data : dataToSend }).
    then(function(response) {
      $scope.pincodelist.push(response.data)
      console.log($scope.pincodelist);
      Flash.create('success', 'Pincode added to list..');
      $scope.form={pincodes:''}

    })

  }

  $scope.delete=function(indx){
    console.log(indx,'kkkkkkkkkkkkkkkkkk');
  }


  $http({method : 'GET' , url : '/api/ecommerce/addPincode/'}).
  then(function(response) {
    $scope.pincodelist=response.data
  })


  $scope.topStaticBanner = false
  $http.get('/api/ERP/appSettings/?app=25&name__iexact=topStaticBanner').
  then(function(response) {
    if (response.data[0] != null) {
      if (response.data[0].flag) {
        $scope.topStaticBanner = true
      }
    }
  })

  $scope,refreshTags = function(){
    $scope.offerForm = {
      name:'',
      product:'',
      products : []
    }

  }
$scope,refreshTags()

  $scope.productSearch = function(val) {
    return $http.get('/api/POS/productsv/?store='+$scope.storeId+'name__icontains=' + val ).
    then(function(response) {
      return response.data;
    })
  }

$scope.addproductData = function(){
  console.log($scope.offerForm.product);
  $scope.offerForm.products.push($scope.offerForm.product)
  $scope.offerForm.product = ''
}



  $scope.tagsList = []

  $http({
    url: '/api/POS/groupvs/?store='+$scope.storeId,
    method : 'GET'

  }).
  then(function(response) {
    $scope.tagsList = response.data
  });


  $scope.addOfferTag = function(){
    var url = '/api/POS/groupvs/'
    if ($scope.offerForm.pk) {
      var method='PATCH'
      url = url +$scope.offerForm.pk+'/';
    }
    else{
        var method='POST'
    }
    var dataToSend = {
      name :  $scope.offerForm.name,
      store:$scope.storeId
    }

if ($scope.offerForm.products.length>0) {
  var prodata = []
  for (var i = 0; i < $scope.offerForm.products.length; i++) {
      prodata.push($scope.offerForm.products[i].pk)
  }
dataToSend.products = prodata
}
  $http({
    url:url,
    method : method,
    data: dataToSend
  }).
  then(function(response) {
    $scope.tagsList.push(response.data)
    $scope,refreshTags()
    Flash.create('success', 'Updated Added!!!!');
  });
  }


$scope.editTags =  function(indx){
  $scope.offerForm = $scope.tagsList[indx]
  $scope.tagsList.splice(indx,1)
}

$scope.deleteproducts = function(indx){
  $scope.offerForm.products.splice(indx,1)
}

$scope.deleteOffer = function(indx){
  $http({
    url: '/api/POS/groupvs/'+$scope.tagsList[indx].pk+'/',
    method : 'DELETE'
  }).
  then(function(response) {
    $scope.tagsList.splice(indx,1)
  });
}

});

app.controller('businessManagement.ecommerce.configure.promocode.form', function($scope, $http, $aside, $state, Flash, $users, $filter, $permissions,$rootScope) {
  $scope.promoForm = {name:'',discount:1,validTimes:1,endDate:new Date()}
  $scope.mode = 'new'
  $scope.msg = 'Create'
  $scope.storeId = STORE_PK
  $scope.$on('promoUpdate', function(event, input) {
    console.log("recieved");
    console.log(input.data);
    $scope.msg = 'Update'
    $scope.promoForm = input.data
    $scope.mode = 'edit'

  });

  $scope.savePromocode = function(){
    console.log('7777777777777777777',$scope.promoForm);
    if ($scope.promoForm.name.length ==0 || $scope.promoForm.discount.length == 0 || $scope.promoForm.validTimes.length == 0) {
      Flash.create('warning', 'Please Fill All The Fields')
      return;
    }

    var method = 'POST'
    var url = '/api/POS/promocodevs/'
    if ($scope.mode == 'edit') {
      method = 'PATCH'
      url = url + $scope.promoForm.pk + '/'
    }
    var f = $scope.promoForm
    dataToSend = {
      name : f.name,
      discount : f.discount,
      validTimes : f.validTimes,
      endDate : f.endDate,
      store:$scope.storeId
    }
    $http({method : method , url : url, data : dataToSend }).
    then(function(response) {
      Flash.create('success', $scope.msg + 'd');
      $rootScope.$broadcast('forceRefetch', {});
      $scope.promoForm = {name:'',discount:1,validTimes:1,endDate:new Date()}
      $scope.mode = 'new'
    })

  }

})


app.controller('businessManagement.ecommerce.configure.form', function($scope, $http, $aside, $state, Flash, $users, $filter, $permissions) {
  $scope.storeId = STORE_PK
  $scope.me = $users.get('mySelf');


  $scope.resetForm = function() {
    $scope.form = {
      parent: '',
      name: '',
      unit: '',
      fields: [],
      minCost: 0,
      restricted:false,
      visual: emptyFile,
      bannerImage:emptyFile,
      mobileBanner:emptyFile,
      categoryIndex:0,

    }
    $scope.editing = false
  }

  $scope.resetForm();
  $scope.ChoiceValues = []

  if ($scope.tab == undefined) {
    $scope.mode = 'new';
    $scope.resetForm();
  } else {
    $scope.mode = 'edit';
    console.log($scope.tab.data.field);
    $scope.form = $scope.tab.data.field;

  }



  $scope.parentSearch = function(query) {
    console.log(query);
    return $http.get('/api/POS/categorysv/?store='+$scope.storeId+'&name__contains=' + query).
    then(function(response) {
      console.log('**********************', response);
      return response.data;
    })
  }

  $scope.submit = function() {
    d = $scope.form;
    if (d.name == '' || d.name.length == 0) {
      Flash.create('warning', 'Name Should Not Be Blank')
      return;
    }
      var fd = new FormData();
      fd.append('name', d.name);
      re = /\$|,|@|#|~|`|\%|\*|\^|\&|\(|\)|\+|\=|\[|\-|\_|\]|\[|\}|\{|\;|\:|\'|\"|\<|\>|\?|\||\\|\!|\$| |\./g;
      var alias = d.name.replace(re, '')
      console.log(alias,'llllllllllllllllllllllllll');
      fd.append('alias', alias);
      fd.append('minCost', d.minCost);
      fd.append('restricted', d.restricted);
      if (d.categoryIndex != null && d.categoryIndex != undefined) {
        fd.append('categoryIndex', d.categoryIndex);
      }
      if (d.parent != null && d.parent.pk != undefined) {
        fd.append('parent', d.parent.pk);
      }
      if (d.visual != null && typeof d.visual != 'string') {
        fd.append('visual', d.visual);
      }
      if (d.bannerImage != null && typeof d.bannerImage != 'string') {
        fd.append('bannerImage', d.bannerImage);
      }
      if (d.mobileBanner != null && typeof d.mobileBanner != 'string') {
        fd.append('mobileBanner', d.mobileBanner);
      }
      fd.append('store', $scope.storeId);
      url = '/api/POS/categorysv/';
      console.log(fd);


      url = '/api/POS/categorysv/';
      console.log(fd);


    if ($scope.form.pk ) {
      url += $scope.form.pk + '/';
      method = 'PATCH';
    } else {
      method = 'POST';
    }

      $http({
        method: method,
        url: url,
        data: fd,
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      }).
      then(function(response) {
        Flash.create('success', 'Saved');
      })
  }
});
