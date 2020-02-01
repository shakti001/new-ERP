app.controller('sudo.manageUsers.explore', function($scope, $http, $aside, $state, Flash, $users, $filter, $timeout) {

  $scope.data = $scope.tab.data;
  $scope.isStoreGlobal = false;
  $http.get('/api/ERP/appSettings/?app=25&name__iexact=isStoreGlobal').
  then(function(response) {
    if (response.data[0] != null) {
      $scope.isStoreGlobal = response.data[0].flag
    }
  })


  $scope.details = {
    Address: '',
    Company: '',
    GST: '',
    agree: '',
    designation: '',
    email: '',
    emailOTP: '',
    firstName: '',
    lastName: '',
    mobile: '',
    mobileOTP: '',
    password: '',
    pincode: '',
    rePassword: '',
    reg: '',
    statecode: '',
    token: ''
  }

  $scope.addresses = [];
  $http({
    method: 'GET',
    url: '/api/ecommerce/address/?user=' + $scope.data.pk
  }).then(function(response) {
    $scope.addresses = response.data
  })

  // $scope.details = ''
  $scope.updateProfile = false
  if ($scope.data.profile) {
    if ($scope.data.profile.details) {
      $scope.detailsUser = $scope.data.profile.details
      valid = $scope.detailsUser.replace(/u'/g, "'")
      valid = valid.replace(/'/g, '"')
      valid = valid.replace(/True/g, 'true')
      valid = valid.replace(/None/g, '""')
      $scope.details = JSON.parse(valid)
    }

  }
  $scope.updateData = function() {
    $scope.updateProfile = true
  }

  $scope.updateDetails = function() {
    // console.log($scope.details);
    $http({
      method: 'PATCH',
      url: '/api/HR/profile/' + $scope.data.profile.pk + '/',
      data: {
        details: $scope.details,
      }
    }).
    then(function(response) {
      Flash.create('success', 'Saved!')
      $scope.updateProfile = false
    })
  }


});


app.controller('admin.manageUsers.userform', function($scope, $http, $aside, $state, Flash, $users, $filter, $timeout, $uibModal) {

  console.log($scope.tab);


  $scope.resetForm = function() {
    $scope.data = {
      first_name : "",
      username : "",
      last_name : "",
      password : "",
      mobile : "",
      email : '',
      gstin : '',
      companyName : '',
      pk : null
    }
  }

  $scope.createUser = function() {
    var method = 'POST';
    var url = '/api/HR/usersAdminMode/'
    if ($scope.data.pk) {
      method = 'PATCH';
      url += $scope.data.pk + '/';
    }
    $http({method : method , url : url , data : $scope.data}).
    then(function(response) {
      Flash.create('success' , 'New User Created');
      $scope.resetForm();
    })
  }

  if ($scope.tab != null && $scope.tab != undefined) {
    var p = $scope.tab.data;
    $scope.data = {
      pk : p.pk,
      first_name : p.first_name,
      username : p.username,
      last_name : p.last_name,
      password : '',
      mobile : p.profile.mobile,
      email : p.email,
      gstin : p.profile.gstin,
      companyName : p.profile.companyName
    }
  }else{
    $scope.resetForm();
  }



});


app.controller('admin.manageUsers', function($scope, $http, $aside, $state, Flash, $users, $filter, $timeout, $uibModal) {

  $scope.openStore = function(indx) {
    // console.log(indx, 'jsdjk');
    $scope.addTab({
      title: 'Edit:' + indx.pk,
      cancel: true,
      app: 'storeEditor',
      data: indx,
      active: true
    })
  }
  $scope.editUserDetails = function(d) {
    // console.log(d, 'jsdjk');
    $scope.addTab({
      title: 'Edit User :' + d.pk,
      cancel: true,
      app: 'editProfile',
      data: d,
      active: true
    })
  }

  $scope.openStoreInfo = function(indx) {
    // console.log(indx, 'jsdjk');
    $scope.addTab({
      title: 'View:' + indx.pk,
      cancel: true,
      app: 'storeInfo',
      data: indx,
      active: true
    })
  }

  $scope.tabs = [];
  $scope.searchTabActive = true;

  $scope.closeTab = function(index) {
    $scope.tabs.splice(index, 1)
  }

  $scope.addTab = function(input) {
    // console.log(JSON.stringify(input));
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
  $scope.form = {
    searchValue: '',
    sort: '',
    page: 0,
  }
  $scope.limit = 20
  $scope.offset = 0
  $scope.next = function() {
    $scope.offset += $scope.limit
    console.log($scope.limit);
    $scope.finalstoreData()
  }
  $scope.prev = function() {
    if ($scope.limit > 0) {
      $scope.offset -= $scope.limit

      $scope.finalstoreData()
    }

  }
  $scope.searchStore = function() {
    $scope.finalstoreData()
  }

  // $scope.sortValue = false
  $scope.storeData = []
  $scope.finalstoreData = function() {
    var url = '/api/POS/store/?limit=' + $scope.limit + '&offset=' + $scope.offset + '&name__icontains=' + $scope.form.searchValue;

    // url = url + '&sort=' + $scope.form.sort
    if ($scope.form.sort.length > 0) {

      if ($scope.form.searchValue.length > 0) {
        url = url + '&sort=' + $scope.form.sort
      } else {
        url = url + '&sort=' + $scope.form.sort
      }
    }
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.storeData = response.data.results

      // console.log(response.data, 'askldfklsad');
    })
  }
  $scope.finalstoreData()
  $scope.Storesorting = function(val) {
    $scope.form.sort = val
    $scope.finalstoreData()
  }

  $scope.userform = {
    userText: '',
    sort: ''
  }

  $scope.Usernext = function() {
    $scope.offset += $scope.limit
    console.log($scope.limit);
    $scope.usersData()
  }
  $scope.prevUser = function() {
    if ($scope.limit > 0) {
      $scope.offset -= $scope.limit

      $scope.usersData()
    }

  }

  $scope.allUsers = []
  $scope.usersData = function() {
    var url = '/api/HR/users/?limit=' + $scope.limit + '&offset=' + $scope.offset
    if ($scope.userform.userText.length > 0) {
      url = url + '&username__icontains=' + $scope.userform.userText
    }

    if ($scope.userform.sort.length > 0) {
      if ($scope.userform.userText.length > 0) {
        url = url + '&username__icontains=' + $scope.userform.userText
      }
      url = url + '&sort=' + $scope.userform.sort
    }
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.allUsers = response.data.results
    })
  }
  $scope.usersData()
  $scope.searchUser = function() {
    $scope.usersData()
  }
  $scope.Usersorting = function(val) {
    $scope.userform.sort = '-' + val
    console.log($scope.userform.sort);
    $scope.usersData()
  }
})

app.controller('controller.user.upload', function($scope, $http, $aside, $state, Flash, $users, $filter, $timeout, $uibModal) {

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
    $scope.locationData = window.location
    console.log($scope.bulkForm.xlFile);
    var fd = new FormData()
    fd.append('xl', $scope.bulkForm.xlFile);
    fd.append('locationData', $scope.locationData);
    console.log('*************', fd);
    $http({
      method: 'POST',
      url: '/api/HR/bulkUserCreation/',
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      Flash.create('success', 'Created');
      // $scope.bulkForm.usrCount = response.data.count;
      // $scope.bulkForm.success = true;
    })

  }

});



app.controller("sudo.managestores.store.form", function($scope, $http, Flash, $uibModal, $rootScope, $state) {

  $scope.$watch('form.pincode', function(newvalue, oldvalue) {
    // console.log(newvalue, "k");

    if (newvalue != undefined && newvalue.length == 6) {
      $http.get('/api/POS/genericPincode/?pincode__contains=' + newvalue).
      then(function(response) {
        console.log(response.data[0], "kkkkkkkkkkk");
        $scope.form.state = response.data[0].state
        $scope.form.city = response.data[0].city
        $scope.form.country = response.data[0].country
      })
    }

  });

  $scope.genericUserSearch = function(query) {
    return $http.get('/api/HR/userSearch/?first_name__contains=' + query).
    then(function(response) {
      return response.data;
    })
  };
  $scope.bankList = [
    'Allahabad Bank',
    'Andhra Bank',
    'Bank of Baroda',
    'Bank of India',
    'Bank of Maharashtra',
    'Canara Bank',
    'Central Bank of India',
    'Corporation Bank',
    'Dena Bank',
    'Indian Bank',
    'Indian Overseas Bank',
    'Oriental Bank of Commerce',
    'Punjab National Bank',
    'Punjab & Sind Bank',
    'Syndicate Bank',
    'UCO Bank',
    'Union Bank of India',
    'United Bank of India',
    'Vijaya Bank',
    'IDBI Bank Ltd',
    'Bharatiya Mahila Bank',
    'State Bank of India',
    'State Bank of Bikaner',
    'State Bank of Hyderabad',
    'State Bank of Mysore',
    'State Bank of Patiala',
    'State Bank of Travancore',
  ]

  $scope.usergroup = []

  $scope.resetForm = function() {
    $scope.form = {
      company: '',
      name: '',
      address: '',
      pincode: '',
      mobile: '',
      email: '',
      gstin: '',
      cin: '',
      gstincert: emptyFile,
      personelid: emptyFile,
      owner: '',
      logo: emptyFile,
      copyrightHolder: '',
      fbLink: '',
      twitterLink: '',
      linkedinLink: '',
      playstoreLink: '',
      appstoreLink: '',
      pinterestLink: '',
      pos: false,
      cod: false,
      rating: false,
      filter: false,
      categoryBrowser: false,
      searchfieldplaceholder: '',
      codLimit: '',
      bankaccountNumber: '',
      ifsc: '',
      bankName: '',
      bankType: '',
      moderators: '',
      moderatorslist: [],
      themeColor: '',
      payPal: false,
      paytm: false,
      payU: false,
      ccAvenue: false,
      googlePay: false,
      cartImage: emptyFile,
      paymentImage: emptyFile,
      paymentPotraitImage: emptyFile,
      searchBackgroundImg: emptyFile,
      blogBackgroundImg: emptyFile,
      logoinverted: emptyFile
    }

  }
  $scope.addmoderators = function() {
    if (typeof $scope.form.moderators == 'object') {
      $scope.form.moderatorslist.push($scope.form.moderators)
      $scope.form.moderators = "";
    }
  }
  $scope.deletemoderators = function(indx) {
    $scope.form.moderatorslist.splice(indx, 1)
  }


  if ($scope.tab != undefined) {
    $scope.resetForm()
    $scope.mode = 'edit';
    console.log('aaaaaaaaaaaa', $scope.tab.data);
    $scope.form = $scope.tab.data;
    $scope.form.moderatorslist = $scope.form.moderators
    $scope.form.moderators = ''
  } else {
    $scope.mode = 'new';
    $scope.resetForm()
  }

  $scope.multiStore = STORE_TYPE
  $scope.firstStore = STORE_COUNT == "0";

  $scope.save = function() {
    console.log('entered');
    var f = $scope.form;
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if ($scope.multiStore == 'MULTI-OUTLET') {
        $scope.columnWidth = "col-lg-8 col-lg-offset-2"
      if (f.name == null || f.name.length == 0) {
        Flash.create('warning', 'Please Add Store Name')
        return
      }
      // if (f.moderators == null || f.moderators.length == 0) {
      //   Flash.create('warning', 'Please Add Moderators')
      //   return
      // }
      if (f.mobile == null || f.mobile.length == 0) {
        Flash.create('warning', 'Please Add Mobile Number')
        return
      }
      if (f.address == null || f.address.length == 0) {
        Flash.create('warning', 'Please Add Address')
        return
      }
      if (f.pincode == null || f.pincode.toString().length != 6) {
        Flash.create('warning', 'Please Add Pincode')
        return
      }
      if (f.gstin == null || f.gstin.length == 0) {
        Flash.create('warning', 'Please Add GSTIN')
        return
      }

    }
    if ($scope.multiStore == 'MULTI-VENDOR') {
      if (f.company == null || f.company.length == 0) {
        Flash.create('warning', 'Please Add Company Name')
        return
      }
      if (f.name == null || f.name.length == 0) {
        Flash.create('warning', 'Please Add Store Name')
        return
      }

      if (f.mobile == null || f.mobile.length == 0) {
        Flash.create('warning', 'Please Add Mobile Number')
        return
      }
      if (f.email.match(mailformat)) {
        var email = true;
      } else {
        var email = false;
      }
      if (f.email == null || f.email.length == 0 || !email || f.email == undefined) {
        Flash.create('warning', 'Please Add Email')
        return
      }
      if (f.address == null || f.address.length == 0) {
        Flash.create('warning', 'Please Add Address')
        return
      }
      if (f.pincode == null || f.pincode.toString().length != 6) {
        Flash.create('warning', 'Please Add Pincode')
        return
      }
      if (f.gstin == null || f.gstin.length == 0) {
        Flash.create('warning', 'Please Add GSTIN')
        return
      }

      if (f.cin == null || f.cin.length == 0) {
        Flash.create('warning', 'Please Add CIN')
        return
      }
      if (f.gstincert == emptyFile) {
        Flash.create('warning', 'Please Add GSTIN Certificate')
        return
      }
      if (f.personelid == emptyFile) {
        Flash.create('warning', 'Please Add Personel Id')
        return
      }
    }
    if ($scope.multiStore == 'MULTI-PLATFORM') {
      if (f.company == null || f.company.length == 0) {
        Flash.create('warning', 'Please Add Company Name')
        return
      }
      if (f.name == null || f.name.length == 0) {
        Flash.create('warning', 'Please Add Store Name')
        return
      }
      if (f.mobile == null || f.mobile.length == 0) {
        Flash.create('warning', 'Please Add Mobile Number')
        return
      }
      if (f.email.match(mailformat)) {
        var email = true;
      } else {
        var email = false;
      }
      if (f.email == null || f.email.length == 0 || !email || f.email == undefined) {
        Flash.create('warning', 'Please Add Email')
        return
      }
      if (f.address == null || f.address.length == 0) {
        Flash.create('warning', 'Please Add Address')
        return
      }
      if (f.pincode == null || f.pincode.toString().length != 6) {
        Flash.create('warning', 'Please Add Pincode')
        return
      }
      if (f.gstin == null || f.gstin.length == 0) {
        Flash.create('warning', 'Please Add GSTIN')
        return
      }
      if (f.cin == null || f.cin.length == 0) {
        Flash.create('warning', 'Please Add CIN')
        return
      }
      if (f.gstincert == emptyFile) {
        Flash.create('warning', 'Please Add GSTIN Certificate')
        return
      }
      if (f.personelid == emptyFile) {
        Flash.create('warning', 'Please Add Personel Id')
        return
      }
      if (f.owner == null || f.owner.length == 0) {
        Flash.create('warning', 'Please Add Owner')
        return
      }

      if (f.bankaccountNumber == null || f.bankaccountNumber.length == 0) {
        Flash.create('warning', 'Please Add Bank account number')
        return
      }
      if (f.ifsc == null || f.ifsc.length == 0) {
        Flash.create('warning', 'Please Add IFSC code')
        return
      }
      if (f.bankName == null || f.bankName.length == 0) {
        Flash.create('warning', 'Please Add IFSC code')
        return
      }
      if (f.bankType == null || f.bankType.length == 0) {
        Flash.create('warning', 'Please Add Bank Account Type')
        return
      }
      if (f.fbLink == null || f.fbLink.length == 0) {
        Flash.create('warning', 'Please Add your facebook account')
        return
      }
      if (f.twitterLink == null || f.twitterLink.length == 0) {
        Flash.create('warning', 'Please Add your Twitter account')
        return
      }
      if (f.linkedinLink == null || f.linkedinLink.length == 0) {
        Flash.create('warning', 'Please Add your linkedin account')
        return
      }
      if (f.playstoreLink == null || f.playstoreLink.length == 0) {
        Flash.create('warning', 'Please Add your playstore link')
        return
      }
      if (f.appstoreLink == null || f.appstoreLink.length == 0) {
        Flash.create('warning', 'Please Add your appstore link')
        return
      }
      if (f.pinterestLink == null || f.pinterestLink.length == 0) {
        Flash.create('warning', 'Please Add your pinterest link')
        return
      }
      if (f.searchfieldplaceholder == null || f.searchfieldplaceholder.length == 0) {
        Flash.create('warning', 'Please Add Search field placeholder')
        return
      }
      if (f.codLimit == null || f.codLimit.length == 0) {
        Flash.create('warning', 'Please Add COD limit')
        return
      }
      if (f.copyrightHolder == null || f.copyrightHolder.length == 0) {
        Flash.create('warning', 'Please Add copyright holder')
        return
      }
      if (f.copyrightHolder == null || f.copyrightHolder.length == 0) {
        Flash.create('warning', 'Please Add copyright holder')
        return
      }
      if (f.cartImage == emptyFile) {
        Flash.create('warning', 'Please Add cartimage')
        return
      }
      if (f.paymentImage == emptyFile) {
        Flash.create('warning', 'Please Add Payment Image')
        return
      }
      if (f.searchBackgroundImg == emptyFile) {
        Flash.create('warning', 'Please Add Search background image')
        return
      }
      if (f.blogBackgroundImg == emptyFile) {
        Flash.create('warning', 'Please Add Blog Background image')
        return
      }
    }

    var fd = new FormData();
    fd.append('company', f.company);
    fd.append('name', f.name);
    fd.append('mobile', f.mobile);
    fd.append('email', f.email);
    fd.append('address', f.address);
    fd.append('pincode', f.pincode);
    fd.append('gstin', f.gstin);
    fd.append('cin', f.cin);
    fd.append('state', f.state);
    fd.append('city', f.city);
    fd.append('country', f.country);
    fd.append('pos', f.pos);
    fd.append('cod', f.cod);
    fd.append('rating', f.rating);
    fd.append('filter', f.filter);
    fd.append('categoryBrowser', f.categoryBrowser);
    fd.append('payPal', f.payPal);
    fd.append('paytm', f.paytm);
    fd.append('payU', f.payU);
    fd.append('ccAvenue', f.ccAvenue);
    fd.append('googlePay', f.googlePay);

    if (f.moderatorslist.length > 0) {
      $scope.usergroup = []
      for (var i = 0; i < f.moderatorslist.length; i++) {
        $scope.usergroup.push(f.moderatorslist[i].pk)
        console.log($scope.usergroup, "$scope.usergroup");
      }
      fd.append('moderators', $scope.usergroup);
    }
    if (f.copyrightHolder != null && f.copyrightHolder.length > 0) {
      fd.append('copyrightHolder', f.copyrightHolder);
    }
    if (f.fbLink != null && f.fbLink.length > 0) {
      fd.append('fbLink', f.fbLink);
    }
    if (f.twitterLink != null && f.twitterLink.length > 0) {
      fd.append('twitterLink', f.twitterLink);
    }
    if (f.linkedinLink != null && f.linkedinLink.length > 0) {
      fd.append('linkedinLink', f.linkedinLink);
    }
    if (f.playstoreLink != null && f.playstoreLink.length > 0) {
      fd.append('playstoreLink', f.playstoreLink);
    }
    if (f.appstoreLink != null && f.appstoreLink.length > 0) {
      fd.append('appstoreLink', f.appstoreLink);
    }
    if (f.pinterestLink != null && f.pinterestLink.length > 0) {
      fd.append('pinterestLink', f.pinterestLink);
    }
    if (f.searchfieldplaceholder != null && f.searchfieldplaceholder.length > 0) {
      fd.append('searchfieldplaceholder', f.searchfieldplaceholder);
    }
    if (f.themeColor != null && f.themeColor.length > 0) {
      fd.append('themeColor', f.themeColor);
    }
    if (f.codLimit != null) {
      fd.append('codLimit', f.codLimit);
    }
    if (f.bankaccountNumber != null && f.bankaccountNumber.length > 0) {
      fd.append('bankaccountNumber', f.bankaccountNumber);
    }
    if (f.ifsc != null && f.ifsc.length > 0) {
      fd.append('ifsc', f.ifsc);
    }
    if (f.bankName != null && f.bankName.length > 0) {
      fd.append('bankName', f.bankName);
    }
    if (f.bankType != null && f.bankType.length > 0) {
      fd.append('bankType', f.bankType);
    }
    if (typeof f.gstincert != 'string' && f.gstincert != null && f.gstincert != emptyFile) {
      fd.append('gstincert', f.gstincert);
    }
    if (typeof f.personelid != 'string' && f.personelid != null && f.personelid != emptyFile) {
      fd.append('personelid', f.personelid);
    }
    if (typeof f.logo != 'string' && f.logo != null && f.logo != emptyFile) {
      fd.append('logo', f.logo);
    }
    if (typeof f.logoinverted != 'string' && f.logoinverted != null && f.logoinverted != emptyFile) {
      fd.append('logoinverted', f.logoinverted);
    }
    if (typeof f.cartImage != 'string' && f.cartImage != null && f.cartImage != emptyFile) {
      fd.append('cartImage', f.cartImage);
    }
    if (typeof f.paymentImage != 'string' && f.paymentImage != null && f.paymentImage != emptyFile) {
      fd.append('paymentImage', f.paymentImage);
    }
    if (typeof f.paymentPotraitImage != 'string' && f.paymentPotraitImage != null && f.paymentPotraitImage != emptyFile) {
      fd.append('paymentPotraitImage', f.paymentPotraitImage);
    }
    if (typeof f.searchBackgroundImg != 'string' && f.searchBackgroundImg != null && f.searchBackgroundImg != emptyFile) {
      fd.append('searchBackgroundImg', f.searchBackgroundImg);
    }
    if (typeof f.blogBackgroundImg != 'string' && f.blogBackgroundImg != null && f.blogBackgroundImg != emptyFile) {
      fd.append('blogBackgroundImg', f.blogBackgroundImg);
    }
    if (f.owner != null) {
      fd.append('owner', f.owner.pk);
    }

    var url = '/api/POS/store/';
    if ($scope.mode == 'new') {
      var method = 'POST';
    } else {
      var method = 'PATCH';
      url += f.pk + '/'
    }


    $http({
      method: method,
      url: url,
      data: fd,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      Flash.create('success', 'Saved')
      if ($scope.mode == 'new') {
        $scope.resetForm()
      }
    }, function(err) {
      Flash.create('danger', 'Some Internal Error')
    })
  }

})

app.controller("sudo.managestores.store.form.explore", function($scope, $http, Flash, $uibModal, $rootScope, $state) {

  $scope.totalData = $scope.tab.data
})
