from django.db import models
from django.contrib.auth.models import User
from ERP.models import service
from time import time
# from ecommerce.models import listing

# Create your models here.
def getThemeImageUploadPath(instance , filename ):
    return 'PIM/images/theme/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user.username, filename)

PRESENCE_CHOICES = (
    ('NA' , 'NA'),
    ('Available' , 'Available'),
    ('Busy' , 'Busy'),
    ('Away' , 'Away'),
    ('On Leave' ,'On Leave'),
    ('In A Meeting' ,'In a meeting'),
)
class settings(models.Model):
    presence = models.CharField(max_length = 15 , choices = PRESENCE_CHOICES , null = False , default = 'NA')
    user = models.OneToOneField(User)

class theme(models.Model):
    main = models.CharField(max_length=10 , null = True)
    highlight = models.CharField(max_length=10 , null = True)
    background = models.CharField(max_length=10 , null = True)
    backgroundImg = models.ImageField(upload_to = getThemeImageUploadPath , null = True)
    parent = models.OneToOneField(settings , related_name = 'theme')

User.settings = property(lambda u : settings.objects.get_or_create(user = u)[0])
settings.theme = property(lambda s : theme.objects.get_or_create(parent = s)[0])

DOMAIN_CHOICES = (
    ('System' , 'System'),
    ('Administration' , 'Administration'),
    ('Application' , 'Application')
)

class notification(models.Model):
    message = models.TextField(max_length = 300 , null=True)
    link = models.URLField(max_length = 100 , null = True)
    shortInfo = models.CharField(max_length = 250 , null = True)
    read = models.BooleanField(default = False)
    user = models.ForeignKey(User)
    domain = models.CharField(null = False , default = 'SYS' , choices = DOMAIN_CHOICES , max_length = 3)
    originator = models.CharField(null = True , max_length = 20)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    onHold = models.BooleanField(default = False)

def getChatMessageAttachment(instance , filename ):
    return 'chat/%s_%s' % (str(time()).replace('.', '_'), filename)

class chatMessage(models.Model):
    message = models.CharField(max_length = 200 , null=True)
    attachment = models.FileField(upload_to = getChatMessageAttachment ,  null = True)
    originator = models.ForeignKey(User , related_name = "sentIMs" , null = True)
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User)
    read = models.BooleanField(default = False)

def getCalendarAttachment(instance , filename ):
    return 'calendar/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user.username, instance.originator.username, filename)

def getOGImageAttachment(instance , filename ):
    return 'blogs/%s_%s' % (str(time()).replace('.', '_'), filename)

def getClientRelationshipContactDP(instance , filename ):
    return 'PIM/dp/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user.username, filename)

class Contact(models.Model):
    user = models.ForeignKey(User , related_name = 'contactsuser' , null = False) # the user created it
    name = models.CharField(max_length = 100 , null = False)
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateTimeField(auto_now=True)
    company = models.ForeignKey(service , null = True , related_name='contactsPIM')
    email = models.EmailField(null = True)
    emailSecondary = models.EmailField(null = True)
    mobile = models.CharField(max_length = 12 , null = True)
    mobileSecondary = models.CharField(max_length = 12 , null = True)
    designation = models.CharField(max_length = 30 , null = True)
    notes = models.TextField(max_length=300 , null=True)
    linkedin = models.CharField(max_length = 100 , null = True)
    facebook = models.CharField(max_length = 100 , null = True)
    dp = models.FileField(null = True , upload_to = getClientRelationshipContactDP)
    male = models.BooleanField(default = True)

class calendar(models.Model):
    TYPE_CHOICE = (
        ('Meeting' , 'Meeting'),
        ('Reminder' , 'Reminder'),
        ('ToDo' , 'ToDo'),
        ('EVENT' , 'EVENT'),
        ('Deadline' , 'Deadline'),
        ('Other' , 'Other'),
    )

    LEVEL_CHOICE = (
        ('Normal' , 'Normal'),
        ('Critical' , 'Critical'),
        ('Optional' , 'Optional'),
        ('Mandatory' , 'Mandatory'),
    )

    VISIBILITY_CHOICES = (
        ('personal' , 'personal'), # if only I can see
        ('public' , 'public'), # everyone can see
        ('management' , 'management'), # only access level higher to me can see
        ('friends' , 'friends'), # only fiends in the public can see
    )

    visibility = models.CharField(choices = VISIBILITY_CHOICES , default = 'personal' , max_length = 20)
    eventType = models.CharField(choices = TYPE_CHOICE , default = 'Other' , max_length = 11)
    originator = models.CharField(null = True , max_length = 20)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User)
    text = models.CharField(max_length = 200 , null = True)
    notification = models.ForeignKey(notification , null = True)
    when = models.DateTimeField(null = True)
    duration = models.IntegerField(null = True)
    read = models.BooleanField(default = False)
    deleted = models.BooleanField(default = False)
    completed = models.BooleanField(default = False)
    canceled = models.BooleanField(default = False)
    level = models.CharField(choices = LEVEL_CHOICE , default = 'Normal' , max_length = 10)
    venue = models.CharField(max_length = 50 , null = True)
    attachment = models.FileField(upload_to = getCalendarAttachment , null = True)
    myNotes = models.CharField(max_length = 100 , blank = True)
    followers = models.ManyToManyField(User , related_name = 'calendarItemsFollowing' , blank = True)
    # clients = models.ManyToManyField(Contact , related_name='calendarEntries', blank = True)
    data = models.CharField(max_length = 200 , null = True)

class blogCategory(models.Model):
    title = models.CharField(max_length = 50 , null = False , unique=True)

class blogPost(models.Model):
    FORMAT_CHOICES = (
        ('md' , 'md'), # mark down
        ('html' , 'html'),
    )

    STATE_CHOICES = (
        ('saved' , 'saved'),
        ('archived' , 'archived'),
        ('published' , 'published'),
        ('hidden' , 'hidden'),
    )

    CONTENT_TYPE_CHOICE = (
        ('article' , 'article'),
        ('tutorial' , 'tutorial'),
        ('whitepaper' , 'whitepaper'),
        ('product' , 'product'),
    )
    public = models.BooleanField(default = False)
    title = models.CharField(max_length = 500 , null=True)
    state = models.CharField(max_length = 20 , choices = STATE_CHOICES , default = 'saved')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    header = models.TextField(max_length = 10000 , null = True)
    users = models.ManyToManyField(User , related_name='articles' , blank = False)
    sourceFormat = models.CharField(choices = FORMAT_CHOICES , default = 'md' , max_length = 10)
    source = models.TextField(max_length = 200000 , null = True)
    tags = models.ManyToManyField(blogCategory , related_name = 'articles' , blank = True)
    contentType = models.CharField(max_length = 15 , choices = CONTENT_TYPE_CHOICE , default = 'article')

    # url
    #
    # og image
    # title
    # description
    # tags
    # section
    # author

    shortUrl = models.CharField(max_length =100 , null = True,unique=True)
    ogimageUrl = models.CharField(max_length =1000 , null = True)
    ogimage = models.ImageField( upload_to= getOGImageAttachment , null = True)
    description = models.CharField(max_length =1000 , null = True)
    tagsCSV = models.CharField(max_length =1000 , null = True) # comma seperated value
    section = models.CharField(max_length =100 , null = True)
    author = models.CharField(max_length =100 , null = True)
    # suggestedProducts = models.ManyToManyField(listing , related_name='blogSuggetProducts' , blank = True)

class blogLike(models.Model):
    parent = models.ForeignKey(blogPost , related_name = 'likes')
    user = models.ForeignKey(User , related_name = 'blogLikes')
    created = models.DateTimeField(auto_now_add=True)

class blogComment(models.Model):
    user = models.ForeignKey(User , related_name = 'blogComments')
    created = models.DateTimeField(auto_now_add = True)
    text = models.CharField(max_length = 300 , null = False)
    parent = models.ForeignKey(blogPost , related_name= 'comments')

class blogCommentLike(models.Model):
    user = models.ForeignKey(User , related_name = 'blogCommentlikes')
    created = models.DateTimeField(auto_now_add = True)
    parent = models.ForeignKey(blogComment , related_name= 'likes')

class notebook(models.Model):
    user = models.ForeignKey(User , related_name = 'notebooks')
    created = models.DateTimeField(auto_now_add = True)
    title =  models.CharField(max_length = 500 , null=True)

class page(models.Model):
    user = models.ForeignKey(User , related_name = 'notebookPages')
    created = models.DateTimeField(auto_now_add = True)
    source = models.TextField(max_length = 1000000 , null = True)
    parent = models.ForeignKey(notebook , related_name= 'pages')
    title = models.CharField(max_length = 500 , null=True)
