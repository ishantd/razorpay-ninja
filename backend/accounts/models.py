from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import User

class State(models.Model):
    unique_id = models.IntegerField(default=0)
    name = models.CharField(max_length=255, null=True, blank=True)

class District(models.Model):
    unique_id = models.IntegerField(default=0)
    name = models.CharField(max_length=255, null=True, blank=True)
    state = models.ForeignKey(State, on_delete=models.CASCADE, null=True, blank=True)
    active = models.BooleanField(default=False)

class Address(models.Model):
    line_1 = models.TextField(null=True, blank=True)
    line_2 = models.TextField(null=True, blank=True)
    locality = models.CharField(max_length=255, null=True, blank=True)
    pincode = models.CharField(max_length=6, null=True, blank=True)
    district = models.ForeignKey(District, on_delete=models.CASCADE, null=True, blank=True)
    state = models.ForeignKey(State, on_delete=models.CASCADE, null=True, blank=True)
    country = models.CharField(max_length=255, null=True, blank=True)

def bank_logo_path(instance, filename):
    return f'banks/{instance.name}/logo_{filename}'

class BankLogo(models.Model):
    name = models.CharField(max_length=150, null=True, blank=True)
    logo = models.FileField(upload_to = bank_logo_path, null=True)

class Bank(models.Model):
    bank = models.CharField(max_length=150, null=True, blank=True)
    ifsc = models.CharField(max_length=20, null=True, blank=True)
    branch = models.CharField(max_length=150, null=True, blank=True)
    centre = models.CharField(max_length=150, null=True, blank=True)
    district = models.CharField(max_length=150, null=True, blank=True)
    state = models.CharField(max_length=150, null=True, blank=True)
    city = models.CharField(max_length=150, null=True, blank=True)
    address = models.CharField(max_length=500, null=True, blank=True)
    contact = models.CharField(max_length=150, null=True, blank=True)
    imps = models.BooleanField(default=True)
    rtgs = models.BooleanField(default=True)
    neft = models.BooleanField(default=True)
    micr = models.CharField(max_length=150, null=True, blank=True)
    swift = models.CharField(max_length=150, null=True, blank=True)
    upi = models.BooleanField(default=True)
    popular = models.BooleanField(default=False)
    logo_image = models.ForeignKey(BankLogo, null=True, on_delete=models.DO_NOTHING, blank=True)
    

class UserBankAccount(models.Model):
    user_id = models.ForeignKey(User, null=True, on_delete=models.CASCADE, related_name='bank_accounts')
    bank = models.ForeignKey(Bank, null=True, blank=True, on_delete=models.CASCADE)
    name_at_bank = models.CharField(max_length=150, null=True, blank=True)
    account_number = models.CharField(max_length=150, null=True, blank=True)
    verified = models.BooleanField(default=False)
    verified_timestamp = models.DateTimeField(null=True, blank=True)

class PanCard(models.Model):
    pan_number = models.CharField(max_length=10, null=True, blank=True)
    name_on_pan = models.CharField(max_length=150, null=True, blank=True)
    status = models.CharField(max_length=150, null=True, blank=True)
    category = models.CharField(max_length=150, null=True, blank=True)
    verified = models.BooleanField(default=False)
    verified_by_user = models.BooleanField(default=False)
    timestamp = models.DateTimeField(null=True, blank=True)
    
class UserDevice(models.Model):
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE, related_name='device')
    device_id = models.CharField(max_length=500, null=True, blank=True)
    arn = models.CharField(max_length=500, null=True, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    
class Profile(models.Model):
    GENDER_CHOICES = (
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Others', 'Others'),
    )
    PROGRESS_CHOICES = (
        (1, 'OTP-Pending'),
        (2, 'OTP-Verified'),
        (3, 'Profile-Pending'),
        (4, 'Profile-Verified'),
        (5, 'PAN-Pending'),
        (6, 'PAN-Verified'),
        (7, 'BA-Pending'),
        (8, 'BA-Verified'),
        (9, 'Permissions-Pending'),
        (10, 'Permissions-Verified'),
        (11, 'InitialMessages-Pending'),
        (12, 'InitialMessages-Verified'),        
    )
    user_id            = models.OneToOneField(User, null=True, on_delete=models.CASCADE, related_name='profile')
    phone       = models.CharField(max_length=10, null=True, blank=True)
    dob = models.DateField(null=True, blank=True)
    gender          = models.CharField(max_length=7, choices=GENDER_CHOICES, null=True, blank=True)
    address = models.ForeignKey(Address, on_delete=models.CASCADE, null=True, blank=True)
    profile_picture = models.FileField(upload_to ='profile_pictures/', null=True, blank=True)
    initial_messages_captured = models.BooleanField(default=False, null=False)
    social_login = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False, null=False)
    profile_progress = models.IntegerField(choices=PROGRESS_CHOICES, default=1, null=True)
    profile_complete= models.BooleanField(default=False, null=False)
    
    def __str__(self):
        return self.user_id.username

def create_user_profile(sender, instance, created, **kwargs):
    if created:
        profile = Profile.objects.create(user_id=instance)
        print("created_profile", profile)
post_save.connect(create_user_profile, sender=User)


class EmailOTP(models.Model):
    email   = models.CharField(max_length=100, unique=False, blank=True, null=True)
    otp         = models.CharField(max_length = 9, blank = True, null= True)
    validated   = models.BooleanField(default = False, help_text = 'If otp verification got successful')
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.otp) + ' is sent to ' + str(self.email)

class PhoneOTP(models.Model):
    phone   = models.CharField(max_length=100, unique=False, blank=True, null=True)
    otp         = models.CharField(max_length = 9, blank = True, null= True)
    validated   = models.BooleanField(default = False, help_text = 'If otp verification got successful')
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.otp) + ' is sent to ' + str(self.phone)
