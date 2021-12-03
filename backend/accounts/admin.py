from django.contrib import admin
from accounts.models import Profile, Shop, UserBankAccount, Address

admin.site.register(Profile)
admin.site.register(Shop)
admin.site.register(UserBankAccount)
admin.site.register(Address)