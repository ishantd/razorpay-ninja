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

import json
import base64
import io
from PIL import Image
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.utils import timezone

def decodeUserImage(data):
    try:
        data = base64.b64decode(data.split(',')[1])
        buf = io.BytesIO(data)
        return Image.open(buf)
    except Exception as e:
        return None


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client


class ShopCRU(APIView):
    
    def post(self, request, *args, **kwargs):
        
        name = request.data.get('name', False)
        address = request.data.get('address', False)
        location = request.data.get('location', False)
        
        if not name and address:
            return JsonResponse({"status": "not ok"}, status=400)
        
        profile = Profile.objects.get(user_id=request.user)
        if profile.role != 'owner':
            return JsonResponse({"status": "not owner"}, status=400)
        shop, shop_created = Shop.objects.get_or_create(owner=profile, name=name)
        if address:
            address_object = Address.objects.create(**address)
            shop.address = address_object
        if location:
            shop.location = location
        profile.emp_in_shop = shop
        profile.save()
        shop.save()
        
        return JsonResponse({"status": "ok", "shop_data": model_to_dict(shop)}, status=200)
    
    def get(self, request, *args, **kwargs):
        
        try:
            shop = Shop.objects.get(owner=request.user)
        except:
            return JsonResponse({"status": "shop not found"}, status=400)
        

        return JsonResponse({"status": "ok", "data": model_to_dict(shop)}, status=200)

class JoinShop(APIView):
    
    def post(self, request, *args, **kwargs):
        
        user = request.user
        profile = Profile.objects.get(user_id = user)
        
        if profile.role != 'emp':
            return JsonResponse({"status": "not emp"}, status=400)
        
        shop_code = request.data.get('shop_code', False)
        if not shop_code:
            return JsonResponse({"status": "not ok"}, status=400)
        
        shop = Shop.objects.filter(unique_code=shop_code)
        
        if not(shop.exists() or len(shop) > 1):
            return JsonResponse({"status": "shop not found"}, status=400)
        
        profile.emp_in_shop = shop[0]
        profile.save()
        
        
        #send notification
        
        #verification process
        
        return JsonResponse({"status": "ok"}, status=200)

class EmployeeCRUD(APIView):
    def post(self, request, *args, **kwargs):
                        
        dob = request.data.get('dob', False)
        gender = request.data.get('gender', False)
        address = request.data.get('address', False)
        role = request.data.get('role', False)
        phone = request.data.get('phone', False)
        b64_image_string = request.data.get("profile_photo", False)
        profile = Profile.objects.get(user_id = request.user)
        if phone:
            profile.phone = phone
        if (dob):
            profile.dob = dob
        if(role):
            profile.role = role
        if(gender):
            profile.gender = gender
        if(address):
            address_object = Address.objects.create(**address)
            profile.address = address_object
        if b64_image_string:
            img = decodeUserImage(b64_image_string)
            if img:
                img_io = io.BytesIO()
                img.save(img_io, format='PNG')
                profile.profile_picture = InMemoryUploadedFile(img_io, field_name=None, content_type='image/png', name=f'{request.user.id}.png', size=img_io.tell, charset=None)
        profile.save()
        
        return JsonResponse({"status": "ok"}, status=200)
    
    def get(self, request, *args, **kwargs):
        profile = Profile.objects.get(user_id = request.user)
        prof_without_pic = model_to_dict(profile)
        prof_without_pic.pop('profile_pic')
        

        employee_id = request.query_params.get('employee_id', False)
        if(employee_id==False):
            shop = Shop.objects.get(owner=request.user)
            employees = shop.employees.all().values()
        else:
            employees = Profile.objects.filter(employee_id=employee_id).values()
        prof_without_pic['employees'] = list(employees)
            
        return JsonResponse({"status": "ok", "data":model_to_dict(prof_without_pic) }, status=200)

    def delete(self, request, *args, **kwargs):
        employee_id = request.query_params.get('user_id', False)
        if(employee_id==False):
            return JsonResponse({"status": "User id is required"}, status=400)
        profile = Profile.objects.get(user_id__id=employee_id)
        profile.shop = None
        profile.save()
        return JsonResponse({"status": "ok"}, status=200)
    

class SendPhoneOTP(APIView):
    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT, 
        properties={
            'phone': openapi.Schema(type=openapi.TYPE_STRING, description='10 digit phone number'),
        },
        required=["phone"]
    ),
                         
    responses={
            "200": openapi.Response(
                description="Success",
                examples={
                    "application/json": {
                        "validated": True,
                    }
                }
            ),
            "400": openapi.Response(
                description="Invalid Input",
                examples={
                    "application/json": {
                        "status": "bad input",
                    }
                }
            ),
        }
    )
    def post(self, request, *args, **kwargs):
        phone = request.data.get('phone', False)
        if phone and valid_phone(phone):
            otp = str(otp_generator())
            if otp:
                phone_otp = PhoneOTP.objects.create(mobile_no=phone, otp=otp)
                if send_otp_to_phone(phone, otp):
                    if settings.DEBUG:
                        return JsonResponse({'status': 'Success', 'otp': otp, 'txn_id': phone_otp.txn_id}, status=200)
                    else:
                        return JsonResponse({'status': 'Success', 'txn_id': phone_otp.txn_id}, status=200)
        return JsonResponse({'status': 'Unsuccessful'}, status=400)

class VerifyPhoneOTP(APIView):
    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT, 
        properties={
            'txn_id': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
            'otp': openapi.Schema(type=openapi.TYPE_STRING, description='6digit otp string')
        },
        required=["phone", "otp"]
    ),
                         
    responses={
            "200": openapi.Response(
                description="Success",
                examples={
                    "application/json": {
                        "validated": True,
                    }
                }
            ),
            "400": openapi.Response(
                description="Invalid Input",
                examples={
                    "application/json": {
                        "status": "bad input",
                    }
                }
            ),
        }
    )    
    def post(self, request, *args, **kwargs):
        txn_id = request.data.get('txn_id', False)
        otp = request.data.get('otp', False)
        if txn_id and otp and len(otp) == 6:
            phone_otps = PhoneOTP.objects.filter(txn_id=txn_id).last()
            if phone_otps.otp != otp:
                return JsonResponse({'validated': False}, status=200)
            phone_otps.validated = True
            phone_otps.save()
            profile = Profile.objects.get(user_id=request.user)
            profile.phone = phone_otps.mobile_no
            profile.profile_progress = 3 #Shop-Pending
            profile.save()
            return JsonResponse({'verified': True}, status=200)
        return JsonResponse({'status': 'bad input'}, status=400)

class UpdateAndVerifyBankAccount(APIView):
    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT, 
        properties={
            'account_number': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
            'ifsc': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
        },
        required=["account_number", "ifsc"]
    ),         
    responses={
            "200": openapi.Response(
                description="Success",
                examples={
                    "application/json": {
                        "status": "sucesss",
                        "pan_data": {}
                    }
                }
            ),
            "400": openapi.Response(
                description="Invalid Input",
                examples={
                    "application/json": {
                        "status": "bad input",
                    }
                }
            ),
        }
    )
    
    def post(self, request, *args, **kwargs):
        
        account_number = request.data.get('account_number', False)
        ifsc = request.data.get('ifsc', False)
        profile = Profile.objects.get(user_id=request.user)
        if profile.role != 'emp':
            return JsonResponse({"status": "user is not employee"}, status=400)
        
        if account_number and ifsc:
            bank_obj = Bank.objects.filter(ifsc=ifsc)
            if bank_obj.exists() and len(bank_obj) == 1:
                bank_obj = Bank.objects.get(ifsc=ifsc)
                user_bank_account, user_bank_account_created = UserBankAccount.objects.get_or_create(
                    user_id=request.user, account_number=account_number, bank=bank_obj)
                if not bank_obj.imps:
                    return JsonResponse({"status": "bank does not support imps"}, status=422)

                user_bank_account.verified = True
                user_bank_account.verified_timestamp = datetime.now()
                user_bank_account.save()
                r = RazorpayX(user_bank_account)
                payout_data = r.init_user_for_payouts()
                if payout_data:
                    profile.razorpay_contact_id = payout_data['contact_id']
                    profile.razorpay_fund_account_id = payout_data['fund_account_id']
                profile.save()
                return JsonResponse({"status": "success", "bank_details": model_to_dict(bank_obj)}, status=200)
        
        # create razorpay accounts
        
        return JsonResponse({"status": "bad input"}, status=400)
    
    def get(self, request, *args, **kwargs):
        bank_account = UserBankAccount.objects.filter(user_id=request.user)
        if bank_account and len(bank_account) == 1:
            return JsonResponse({"status": "success", "bank_details": model_to_dict(bank_account[0])}, status=200)
        return JsonResponse({"status": "bad input"}, status=400)