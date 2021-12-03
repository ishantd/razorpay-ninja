from django.db import models

from accounts.models import Profile
class Payout(models.Model):
    employee_id = models.OneToOneField(Profile, null=True, on_delete=models.CASCADE, related_name='emp_payout')
    amount = models.IntegerField(default=0)
    date_of_every_month = models.IntegerField(default=1)
class PayoutTransaction(models.Model):
    """
    PayoutTransaction model
    """
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    payout = models.ForeignKey(Payout, on_delete=models.CASCADE)
    amount = models.FloatField()
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)