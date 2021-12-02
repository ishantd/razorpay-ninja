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


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client


class ShopCRU(APIView):
    
    def post(self, request, *args, **kwargs):
        
        name = request.POST.get('name', False)
        address = request.POST.get('address', False)
        
        if not name and address:
            return JsonResponse({"status": "not ok"}, status=400)
        
        address_object = Address.objects.create(**address)
        
        shop, shop_created = Shop.objects.get_or_create(owner=request.user, name=name, address=address_object)
        
        return JsonResponse({"status": "ok", "shop_data": model_to_dict(shop)}, status=200)
    
    def get(self, request, *args, **kwargs):
        
        try:
            shop = Shop.objects.get(owner=request.user)
        except:
            return JsonResponse({"status": "shop not found"}, status=400)
        

        return JsonResponse({"status": "ok", "data": model_to_dict(shop)}, status=200)

class EmployeeCRUD(APIView):
    def post(self, request, *args, **kwargs):
                        
        dob = request.POST.get('dob', False)
        gender = request.POST.get('gender', False)
        address = request.POST.get('address', False)
        role = request.POST.get('role', False)
        profile = Profile.objects.get(user_id = request.user)
        if (dob):
            profile.dob = dob
        if(role):
            profile.role = role
        if(gender):
            profile.gender = gender
        if(address):
            address_object = Address.objects.create(**address)
            profile.address = address_object
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
        employee_id = request.query_params.get('employee_id', False)
        if(employee_id==False):
            return JsonResponse({"status": "Employee id is required"}, status=400)
        profile = Profile.objects.get(employee_id=employee_id)
        profile.delete()
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
            print(bank_obj)
            if bank_obj.exists() and len(bank_obj) == 1:
                bank_obj = Bank.objects.get(ifsc=ifsc)
                user_bank_account, user_bank_account_created = UserBankAccount.objects.get_or_create(
                    user_id=request.user, account_number=account_number, bank=bank_obj)
                if not bank_obj.imps:
                    return JsonResponse({"status": "bank does not support imps"}, status=422)

                user_bank_account.verified = True
                user_bank_account.verified_timestamp = datetime.now()
                user_bank_account.save()
                profile = Profile.objects.get(user_id=request.user)
                profile.save()
                return JsonResponse({"status": "success", "bank_details": model_to_dict(bank_obj)}, status=200)
        return JsonResponse({"status": "bad input"}, status=400)
    
    def get(self, request, *args, **kwargs):
        bank_account = UserBankAccount.objects.filter(user_id=request.user)
        if bank_account and len(bank_account) == 1:
            return JsonResponse({"status": "success", "bank_details": model_to_dict(bank_account[0])}, status=200)
        return JsonResponse({"status": "bad input"}, status=400)