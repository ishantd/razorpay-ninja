from django.http import JsonResponse
from django.contrib.auth.models import User
from django.conf import settings
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from django.forms import model_to_dict

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView

import random
from datetime import datetime, timedelta
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from accounts.models import Address, Shop, Profile, PhoneOTP, Bank, UserBankAccount
from accounts.utils import valid_phone, otp_generator
from accounts.communication import send_otp_to_phone

from salary.models import PayoutTransaction, Payout


class PayoutCRU(APIView):
    
    def get(self, request, *args, **kwargs):
        user_id = request.query_params.get('user_id', False)
        user = request.user if not user_id else User.objects.get(id=user_id)
        
        profile = Profile.objects.get(user=user)
        
        payout = Payout.objects.get(employee_id=profile)
        payout_txns = PayoutTransaction.objects.filter(payout=payout).values()
        
        return JsonResponse({"status": "success", "payout": model_to_dict(payout), "payout_txns": list(payout_txns)}, status=200)
    
    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id', False)
        
        if not user_id:
            return JsonResponse({"status": "error", "message": "User ID is required"}, status=400)
        
        amount = request.data.get('amount', False)
        date = request.data.get('date', False)
        
        if amount and date:
            payout, payout_created = Payout.objects.get_or_create(employee_id__user_id__id=user_id)
            payout.amount = int(amount) * 100
            payout.date = int(date)
            payout.save()
            
        return JsonResponse({"status": "success", "payout": model_to_dict(payout)}, status=200)
        
            