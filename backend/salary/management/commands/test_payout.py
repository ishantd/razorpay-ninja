from django.core.management.base import BaseCommand
from accounts.models import Bank, Profile, UserBankAccount
from salary.models import Payout
from pathlib import Path
from tqdm import tqdm
import os
import math
import pandas as pd
from accounts.rzpxapi import RazorpayX


BASE_DIR = Path(__file__).resolve().parent.parent.parent
BASE_DIR_PARENT = Path(__file__).resolve().parent.parent.parent.parent



class Command(BaseCommand):
    help = 'Test Payout Script'
    

    def handle(self, *args, **options):
        payouts = Payout.objects.all()
        for p in payouts:
            profile = Profile.objects.get(user_id=p.employee_id.user_id)
            try:
                bank_account = UserBankAccount.objects.get(user_id=p.employee_id.user_id)
            except:
                continue
            if p.amount != 0 and p.date_of_every_month and profile.razorpay_fund_account_id:
                r = RazorpayX(bank_account)
                ptxn = r.send_payout()