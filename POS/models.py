
# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from ERP.models import service
# Create your models here.
from time import time

def getPOSProductUploadPath(instance,filename):
    return "POS/displayPictures/%s_%s_%s"% (str(time()).replace('.','_'),instance.user.username,filename)


def getContractDoc(instance,filename):
    return "POS/contactDoc/%s_%s"% (str(time()).replace('.','_'),filename)

def getProductVarientUploadPath(instance,filename):
    return "POS/productVarient/%s_%s"% (str(time()).replace('.','_'),filename)

def getgstincert(instance,filename):
    return "POS/store/%s_%s"% (str(time()).replace('.','_'),filename)

def getProductPictureUploadPathV2(instance,filename):
    return "POS/productV2/%s_%s"% (str(time()).replace('.','_'),filename)

def getGiftImage(instance,filename):
    return "POS/gift/%s_%s"% (str(time()).replace('.','_'),filename)

class GenericPincode(models.Model):
    state = models.CharField(max_length = 35, null = True)
    city =  models.CharField(max_length = 35, null = True)
    country =  models.CharField(max_length = 35, null = True, default="India")
    pincode = models.CharField( max_length = 7, null = True)
    pin_status = models.CharField( max_length = 2, default = "1")



PRODUCT_META_TYPE_CHOICES = (
    ('HSN' , 'HSN'),
    ('SAC' , 'SAC')
)

class ProductMeta(models.Model):
    description = models.CharField(max_length = 500 , null = False)
    typ = models.CharField(max_length = 5 , default = 'HSN' , choices = PRODUCT_META_TYPE_CHOICES)
    code = models.PositiveIntegerField(null=False)
    taxRate = models.PositiveIntegerField(null = False)



BANKTYPE_CHOICES = (
    ('saving' , 'saving'),
    ('current' , 'current'),
)

class Store(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    name = models.CharField(max_length = 100 , null = False)
    company = models.CharField(max_length = 100 , null = True)
    address = models.CharField(max_length = 500 , null = False)
    pincode = models.PositiveIntegerField(null= True )
    mobile = models.CharField(max_length = 12 , null = True)
    email = models.EmailField(null = True)
    gstin = models.CharField(max_length = 25 , null = True)
    cin = models.CharField(max_length = 25 , null = True)
    gstincert = models.FileField(null = True , upload_to = getgstincert)
    personelid = models.FileField(null = True , upload_to = getgstincert)
    owner = models.ForeignKey(User , null = True,related_name = 'userforeign')
    logo = models.FileField(null = True , upload_to = getgstincert)
    copyrightHolder = models.CharField(max_length=50,null = True)
    fbLink = models.CharField(max_length=50,null = True)
    twitterLink = models.CharField(max_length=50,null = True)
    linkedinLink = models.CharField(max_length=50,null = True)
    playstoreLink = models.CharField(max_length=50,null = True)
    appstoreLink = models.CharField(max_length=50,null = True)
    pinterestLink = models.CharField(max_length=50,null = True)
    city = models.CharField(max_length=50,null = True)
    state = models.CharField(max_length=50,null = True)
    country = models.CharField(max_length=50,null = True)
    categoryBrowser = models.BooleanField(default = True)
    searchfieldplaceholder = models.CharField(max_length=50,null = True)
    codLimit = models.PositiveIntegerField(default = 1)
    bankaccountNumber = models.PositiveIntegerField(null = True)
    ifsc = models.CharField(max_length=50,null = True)
    bankName = models.CharField(max_length=50,null = True)
    bankType = models.CharField(choices = BANKTYPE_CHOICES , max_length = 10 , null = True)
    themeColor = models.CharField(max_length = 20 , null = True)
    moderators = models.ManyToManyField(User,blank = True,related_name = 'usermany')
    pos = models.BooleanField(default = True)
    cod = models.BooleanField(default = True)
    rating = models.BooleanField(default = True)
    filter = models.BooleanField(default = True)
    payPal = models.BooleanField(default = True)
    paytm = models.BooleanField(default = True)
    payU = models.BooleanField(default = True)
    ccAvenue = models.BooleanField(default = True)
    googlePay = models.BooleanField(default = True)
    cartImage = models.FileField(null = True , upload_to = getgstincert)
    paymentImage = models.FileField(null = True , upload_to = getgstincert)
    paymentPotraitImage = models.FileField(null = True , upload_to = getgstincert)
    searchBackgroundImg = models.FileField(null = True , upload_to = getgstincert)
    blogBackgroundImg = models.FileField(null = True , upload_to = getgstincert)
    logoinverted = models.FileField(null = True , upload_to = getgstincert)



class MediaV2(models.Model):
    user = models.ForeignKey(User , related_name = 'productMediaUploads' , null = False)
    created = models.DateTimeField(auto_now_add = True)
    link = models.TextField(null = True , max_length = 300)
    attachment = models.FileField(upload_to = getProductPictureUploadPathV2 , null = True )
    mediaType = models.CharField( max_length = 30 , default = 'image')
    imageIndex = models.PositiveIntegerField(default=0)


class GenericProductV2(models.Model):
    name = models.CharField( null = False , max_length = 500)
    alias = models.CharField( null = False , max_length = 500)
    created = models.DateTimeField(auto_now_add = True)
    minCost = models.PositiveIntegerField(default=0)
    categoryIndex = models.PositiveIntegerField(default=0)
    visual = models.ImageField(upload_to=getProductPictureUploadPathV2 , null = True)
    bannerImage = models.ImageField(upload_to=getProductPictureUploadPathV2 , null = True)
    parent = models.ForeignKey('self' , related_name='children' , null= True)
    restricted = models.BooleanField(default = False)
    mobileBanner = models.ImageField(upload_to=getProductPictureUploadPathV2 , null = True)
    store =  models.ForeignKey(Store ,null = True , related_name ="storeVal")


class ProductV2(models.Model):
    creator = models.ForeignKey(User , related_name = 'productaddedUser' , null = False)
    category =  models.ForeignKey(GenericProductV2 ,null = True , related_name ="categgoryData")
    created = models.DateTimeField(auto_now_add = True)
    name = models.CharField(max_length = 500 , null = True)
    description = models.CharField(max_length = 1500 , null = True)
    detailedDescription = models.CharField(max_length = 2000 , null = True)
    productIndex = models.PositiveIntegerField(null = False,default=0)
    parentCode = models.CharField(max_length = 50 , null = True)
    store = models.ForeignKey(Store ,null = True , related_name ="storeValue")
    iscod = models.BooleanField(default=False)
    codAdvance = models.PositiveIntegerField(null = True,default=0)





class DiscountMatrixV2(models.Model):
    product = models.ForeignKey(ProductV2, related_name = 'discount_produuct' , null = False,on_delete=models.CASCADE)
    qty = models.PositiveIntegerField(default=0)
    discount = models.FloatField(default=0)

PRODUCTMETA_UNIT_TYPES = (
    ('Ton' , 'Ton'),
    ('Kilogram' , 'Kilogram'),
    ('Gram' , 'Gram'),
    ('Litre' , 'Litre'),
    ('Millilitre' , 'Millilitre'),
    ('Quantity' , 'Quantity'),
    ('Size' , 'Size'),
    ('Size and Color' , 'Size and Color'),
    ('Color' , 'Color'),
    ('Quantity and Color' , 'Quantity and Color'),
)

GST_TYPES = (
    ('gst_included' , 'gst_included'),
    ('gst_extra' , 'gst_extra'),
    ('gst_not_applicable' , 'gst_not_applicable'),
)

class ProductVariantV2(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    sku = models.CharField(max_length = 150 , null = True,blank=True)
    unitType = models.CharField(choices = PRODUCTMETA_UNIT_TYPES , max_length = 50 , null = True)
    value = models.CharField(max_length = 20 , null = True)
    value2 = models.CharField(max_length = 20 , null = True)
    price = models.FloatField(null= True,default =0.0)
    sellingPrice = models.FloatField(null= True,default =0.0)
    specialOffer = models.CharField(max_length = 50 , null = True)
    maxQtyOrder =  models.PositiveIntegerField(null = False,default=0)
    minQtyOrder =  models.PositiveIntegerField(null = False,default=0)
    reOrderThreshold = models.PositiveIntegerField(null = False,default=0)
    barcodeId = models.CharField(max_length = 150 , null = True)
    shippingCost = models.FloatField(null= True,default =0.0)
    stock =  models.PositiveIntegerField(null = True)
    displayName =  models.CharField(max_length = 500 , null = True)
    parent = models.ForeignKey(ProductV2, related_name = 'varients' , null = False)
    discount = models.FloatField(null= True,default =0.0)
    brand = models.CharField(max_length = 500 , null = True)
    productMeta =   models.ForeignKey(ProductMeta , related_name="ProductsMetaData" , null = True, blank = True)
    customizable =  models.BooleanField(default = False)
    deliveryTime =  models.PositiveIntegerField(null = False, default = 1)
    customisedDeliveryTime = models.PositiveIntegerField(null = True)
    images = models.ManyToManyField(MediaV2 , related_name='product_images' ,blank=True)
    gstType = models.CharField(choices = GST_TYPES , max_length = 50 , null = True)
    enabled = models.BooleanField(default = True)

    def __repr__(self):
        return "<PV : %s , %s>"%( self.pk , self.sellingPrice)

class Filter(models.Model):
    name = models.CharField( null = False , max_length = 100)
    products = models.ManyToManyField(ProductVariantV2 , related_name="filters" , blank = True)
    parent = models.ForeignKey(GenericProductV2 , null = False , related_name="filters")
    value = models.CharField( null = True , max_length = 100)


class Target(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateTimeField(auto_now=True)
    targetAmount = models.FloatField(null= False)
    achievedCoin = models.PositiveIntegerField(default = 0)
    status = models.BooleanField(default = False)
    product = models.ManyToManyField(ProductV2,related_name ='targerProducts',)
    validity = models.DateField(null=False)

class Wallet(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User , related_name = 'userWallet' , null = False)
    coin = models.PositiveIntegerField(default = 0)
    rate = models.FloatField(default = 0.0)

WALLET_TRANSITION_TYPE = (
    ('credit' , 'credit'),
    ('debit' , 'debit'),
)
class Gift(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length = 150 , null = True)
    image = models.ImageField(upload_to=getGiftImage , null = True)
    coins = models.PositiveIntegerField(default = 0)
    available = models.BooleanField(default = False)

class WalletTransition(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User , related_name = 'userWalletTransition' , null = False)
    value = models.FloatField(default = 0.0)
    type = models.CharField(choices = WALLET_TRANSITION_TYPE ,max_length = 50, default = 'credit')
    gift = models.ForeignKey(Gift , related_name = 'walletGift' , null = True)

PAGESCHOICES = (
('offers','offers'),
('footer','footer'),
('general','general'),
)

class PagesV2(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateTimeField(auto_now=True)
    title = models.CharField(max_length=100 ,null = False)
    pageurl = models.CharField(max_length=100 ,null = False)
    body = models.CharField(max_length=50000 ,null = False)
    topLevelMenu = models.BooleanField(default = False)
    bottomMenu = models.BooleanField(default = False)
    store = models.ForeignKey(Store ,null = True , related_name ="storepages")
    options = models.CharField(choices=PAGESCHOICES , max_length = 25,default = 'offers')

class offerBannerV2(models.Model):
    user = models.ForeignKey(User, null = False)
    created = models.DateTimeField(auto_now_add = True)
    level = models.PositiveIntegerField(null = False) # level indicates the position of display , 1 means the main banner , 2 for side and 3 for flash messages
    image = models.ImageField(null = False , upload_to = getProductPictureUploadPathV2)
    imagePortrait =  models.ImageField(null = True , upload_to = getProductPictureUploadPathV2)
    title = models.CharField(max_length = 120 , null = True)
    subtitle = models.CharField(max_length = 120 , null = True)
    page = models.ForeignKey(PagesV2,null = True ,related_name='offerBannerPage')
    store = models.ForeignKey(Store ,null = True , related_name ="storebanners")
    active = models.BooleanField(default = False)


class PromocodeV2(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=100 ,null = False)
    endDate = models.DateTimeField(null=False)
    discount = models.IntegerField(null=False)
    validTimes = models.IntegerField(null=False)
    store = models.ForeignKey(Store ,null = True , related_name ="storepromocodes")


class FaqCategoryV2(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    name = models.CharField(max_length=100 , null = False )
    store = models.ForeignKey(Store ,null = True , related_name ="storefaqcat")


class FrequentlyQuestionsV2(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    parent = models.ForeignKey('FaqCategoryV2', null = False , related_name = 'parentfaqdata')
    user =  models.ForeignKey(User, null = False , related_name = 'frequentlyQuestionsUser')
    ques = models.CharField(max_length=500 , null = False)
    ans = models.CharField(max_length=5000 , null = False)
    store = models.ForeignKey(Store ,null = True , related_name ="storefaq")


class GroupV2(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    name = models.CharField(max_length=100 , null = False )
    store = models.ForeignKey(Store ,null = True , related_name ="storegrp")
    products = models.ManyToManyField(ProductV2 , related_name="productgroup" , blank = True)


class VendorProfile(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateTimeField(auto_now=True)
    service = models.OneToOneField(service,related_name = 'services' , null = True )
    contactDoc = models.FileField(null = True , upload_to = getContractDoc)
    paymentTerm = models.PositiveIntegerField(default = 0)
    contactPersonName = models.CharField(max_length = 100 , null = False)
    contactPersonNumber = models.CharField(max_length = 100 , null = False)
    contactPersonEmail = models.CharField(max_length = 100 , null = True)

class VendorServices(models.Model):
    vendor = models.ForeignKey(VendorProfile,related_name = 'vendors' , null = True)
    product = models.ForeignKey(ProductV2 , related_name='vendorsProduct')
    rate = models.PositiveIntegerField(default = 0)
    fulfilmentTime = models.PositiveIntegerField(default = 0)
    logistics = models.PositiveIntegerField(default = 0)

class Cart(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    product =  models.ForeignKey(ProductV2,related_name ='productCart' , null = True)
    productVariant = models.ForeignKey(ProductVariantV2,related_name ='productVariantCart' , null = True)
    qty = models.PositiveIntegerField(default = 0)
    store = models.ForeignKey(Store ,null = True , related_name ="cartstore")
    user = models.ForeignKey(User , related_name = 'cartUser' , null = False)
    customDetails = models.CharField(max_length=2000 , null = True)
    customFile = models.FileField(null = True , upload_to = getgstincert)

class Address(models.Model):
    city = models.CharField(max_length=200 , null = True)
    country = models.CharField(max_length=200 , null = True)
    landMark = models.CharField(max_length=200 , null = True)
    pincode = models.PositiveIntegerField( null = True)
    state = models.CharField(max_length=200 , null = True)
    street = models.CharField(max_length=200 , null = True)
    title = models.CharField(max_length=200 , null = True)
    user = models.ForeignKey(User , related_name = 'usersaddress' , null = False)
    store = models.ForeignKey(Store ,null = True , related_name ="currentstore")
    primary  = models.BooleanField(default = False)
    sameAsShipping = models.BooleanField(default = False)
    mobileNo = models.CharField(max_length=15 ,null = True , blank = True)
    billingCountry =  models.CharField(max_length = 50 , null = True , blank = True)
    billingPincode =  models.PositiveIntegerField(null = True , blank = True)
    billingState =  models.CharField(max_length=50 , null = True , blank = True)
    billingCity = models.CharField(max_length=100 , null = True , blank = True)
    billingStreet = models.CharField(max_length=100 , null = True , blank = True)
    billingLandMark = models.CharField(max_length=100 , null = True , blank = True)




PAYMENTMODE_CHOICES = (
    ('COD' , 'COD'),
    ('card' , 'card'),
    ('cash' , 'cash'),
    ('discussion' , 'discussion'),
)

STATUS_CHOICES = (
('newOrder' , 'newOrder'),
('quote' , 'quote'),
('workInProgress' , 'workInProgress'),
('shipped' , 'shipped'),
)

class Order(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateTimeField(auto_now=True)
    orderBy =  models.ForeignKey(User, null = False , related_name = 'orders')
    totalAmount = models.FloatField( default = 0)
    paymentMode = models.CharField(choices = PAYMENTMODE_CHOICES , max_length = 10, default="COD")
    landMark = models.CharField(max_length=100 , null = True , blank = True)
    billingLandMark = models.CharField(max_length=100 , null = True , blank = True)
    street = models.CharField(max_length=300 , null = True , blank = True)
    billingStreet =  models.CharField(max_length=300 , null = True , blank = True)
    city = models.CharField(max_length=100 , null = True , blank = True)
    billingCity = models.CharField(max_length=100 , null = True , blank = True)
    state = models.CharField(max_length=50 , null = True , blank = True)
    billingState = models.CharField(max_length=50 , null = True , blank = True)
    pincode = models.PositiveIntegerField(null = True , blank = True)
    billingPincode =  models.PositiveIntegerField(null = True , blank = True)
    country = models.CharField(max_length = 50 , null = True , blank = True)
    billingCountry = models.CharField(max_length = 50 , null = True , blank = True)
    mobileNo = models.CharField(max_length=15 ,null = True , blank = True)
    shippingCharges =  models.FloatField( default = 0)
    store = models.ForeignKey(Store, null = False , related_name = 'storeorders')
    sameAsShipping = models.BooleanField(default = False)
    status = models.CharField(choices = STATUS_CHOICES , max_length = 10, default="newOrder")
    discount = models.FloatField( default = 0)
    shippingPrice =  models.FloatField( default = 0)
    total = models.FloatField( default = 0)
    couponDiscount = models.IntegerField(null=True)
    coupon = models.PositiveIntegerField(null=True)

class OrderQtyMap(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    product =  models.ForeignKey(ProductV2,related_name ='orderProduct' , null = True)
    productVariant = models.ForeignKey(ProductVariantV2,related_name ='orderVariant' , null = True)
    orderBy =  models.ForeignKey(User, null = True , related_name = 'orderedUser')
    store = models.ForeignKey(Store, null = False , related_name = 'storeordersqty')
    qty =  models.PositiveIntegerField(default = 1)
    productName = models.CharField(max_length = 1500 , null = True , blank = True)
    sellingPrice = models.FloatField(null= True,default = 0)
    shippingPrice =  models.FloatField( default = 0)
    order =  models.ForeignKey(Order, null = True , related_name = 'order')
