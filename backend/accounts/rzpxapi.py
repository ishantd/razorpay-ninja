from django.conf import settings
from django.forms.models import model_to_dict

from accounts.models import User, Profile
from salary.models import Payout, PayoutTransaction

import json
import requests

class RazorpayX:
    
    def __init__(self, bank_account):
        self.user_bank_account = bank_account
        self.user = bank_account.user_id
        self.user_profile = Profile.objects.get(user_id=self.user)
        
        self.base_url = 'https://api.razorpay.com/v1'
        self.contact_url = self.base_url + '/contacts'
        self.fund_url = self.base_url + '/fund_accounts'
        self.payout_url = self.base_url + '/payouts'
        
        self.headers = {
            "Content-Type": "application/json"
        }
        
        self.auth = (settings.RAZORPAY_X_KEY, settings.RAZORPAY_X_SECRET)
    
    def create_contact(self):
        """
        Create a contact on RazorpayX for the user
        """
        data = {
            "name": f'{self.user.first_name} {self.user.last_name}',
            "email": self.user.email,
            "contact": self.user_profile.phone,
            "type": "employee",
            "reference_id": str(self.user.id)
        }
        return requests.post(
            self.contact_url,
            auth=self.auth,
            headers=self.headers,
            data=json.dumps(data),
        )
    
    def create_fund_account(self, contact_id):
        
        data = {
            "contact_id": contact_id,
            "account_type": "bank_account",
            "bank_account": {
                "name": f'{self.user.first_name} {self.user.last_name}',
                "ifsc": self.user_bank_account.bank.ifsc,
                "account_number": self.user_bank_account.account_number,
            }
        }
        
        return requests.post(
            self.fund_url,
            auth=self.auth,
            headers=self.headers,
            data=json.dumps(data),
        )
    
    
    def send_payout(self):
        payout = Payout.objects.filter(employee_id=self.user_profile)
        if payout.exists() and len(payout) == 1:
            payout = payout[0]
            if payout.amount != 0 and payout.date_of_every_month and self.user_profile.razorpay_fund_account_id:
                data = {
                    "account_number": settings.RAZORPAY_ACCOUNT_NUMBER,
                    "fund_account_id": self.user_profile.razorpay_fund_account_id,
                    "amount": payout.amount,
                    "currency": "INR",
                    "mode": "IMPS",
                    "purpose": "salary"
                }
                
                response = requests.post(self.payout_url, auth=self.auth, headers=self.headers, data=json.dumps(data))
                if response.status_code == 200:
                    payout_txn = PayoutTransaction.objects.create(
                        profile=self.user_profile,
                        payout=payout,
                        razorpay_payout_id=response.json()['id'],
                        amount=response.json()['amount'],
                        status="done"
                    )
                    return model_to_dict(payout_txn)
        return False
    
    def init_user_for_payouts(self):
        data = {}
        user_contact = self.create_contact()
        print(user_contact.json())
        print(user_contact.status_code)
        if user_contact.status_code == 200:
            data["contact_id"] = user_contact.json()["id"]
            print(data)
            user_fund = self.create_fund_account(data["contact_id"])
            print(user_fund.json())
            if user_fund.status_code == 200:
                data["fund_account_id"] = user_fund.json()["id"]
                print(data)
                return data
        return None