from django.contrib import admin
from accounts.models import Bank, Profile, Shop, UserBankAccount, Address

admin.site.register(Profile)
admin.site.register(Shop)
admin.site.register(Bank)
admin.site.register(UserBankAccount)
admin.site.register(Address)