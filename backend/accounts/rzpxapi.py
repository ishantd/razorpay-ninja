from django.conf import settings

# from accounts.models import User, Profile

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
            "type": self.user_profile.role,
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
    
    
    def init_user_for_payouts(self):
        data = {}
        user_contact = self.create_contact()
        if user_contact.status_code == 200:
            data["contact_id"] = user_contact.json()["id"]
            user_fund = self.create_fund_account(data["contact_id"])
            
            if user_fund.status_code == 200:
                data["fund_account_id"] = user_fund.json()["id"]
                
                return data
        return None