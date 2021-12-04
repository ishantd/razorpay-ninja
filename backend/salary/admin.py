from django.contrib import admin
from salary.models import Payout, PayoutTransaction

admin.site.register(Payout)
admin.site.register(PayoutTransaction)