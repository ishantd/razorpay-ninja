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

from accounts.models import Address, Shop

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