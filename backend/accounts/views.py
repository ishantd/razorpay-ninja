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

from accounts.models import Address, Shop,Profile

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
    