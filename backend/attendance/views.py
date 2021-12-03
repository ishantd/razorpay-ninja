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

class CheckAttendance(APIView):
    
    def get(self, request, *args, **kwargs):
        todays_attendance = Attendance.objects.filter(user=request.user, date=datetime.today().date())
        if (todays_attendance.exists() and len(todays_attendance)==1) and todays_attendance[0].attendance_time_out:
            return JsonResponse({"today": True, "in": True, "out": True}, status=200)
        elif (todays_attendance.exists() and len(todays_attendance)==1) and not (todays_attendance[0].attendance_time_out):
            return JsonResponse({"today": False, "in": True, "out": False}, status=200)
        elif not todays_attendance.exists():
            return JsonResponse({"today": False, "in": False, "out": False}, status=200)
        return JsonResponse({'status': 'error'}, status=400)

class Attendance(APIView):
    def post(self, request, *args, **kwargs):
        attendance_type = request.data.get('type', False)
        location = request.data.get('location', False)
        user = request.user
        if not location and attendance_type:
            return JsonResponse({"status": "error", "message": "Location and atd type is required"}, status=400)
        
        todays_attendance = Attendance.objects.filter(user=user, date=datetime.today().date())
        if (todays_attendance.exists() and len(todays_attendance)==1) and todays_attendance[0].attendance_time_out:
            return JsonResponse({"status": "error", "message": "You have already marked your attendance today"}, status=400)
        # this below is time out attendance logic 
        elif (todays_attendance.exists() and len(todays_attendance)==1) and not (todays_attendance[0].attendance_time_out):
            location = f'{location["latitude"]}, {location["longitude"]}'
            b64_image_string = request.data.get("live_image", False)
            if not b64_image_string:
                return JsonResponse({"status": "error", "message": "Image is required"}, status=400)
            img = decodeUserImage(b64_image_string)
            if img:
                img_io = io.BytesIO()
                img.save(img_io, format='PNG')
                atd = todays_attendance[0]
                atd.attendance_time_out_selfie = InMemoryUploadedFile(img_io, field_name=None, content_type='image/png', name=f'{user.username}.png', size=img_io.tell, charset=None)
                atd.attendance_time_out_location = location
                atd.attendance_time_out = timezone.now()
                atd.save()
                return JsonResponse({"status": "success", "message": "Attendance out marked successfully"}, status=200)
            return JsonResponse({"status": "img not present"}, status=400)
        elif not todays_attendance.exists():
            location = f'{location["latitude"]}, {location["longitude"]}'
            b64_image_string = request.data.get("live_image", False)
            if not b64_image_string:
                return JsonResponse({"status": "error", "message": "Image is required"}, status=400)
            img = decodeUserImage(b64_image_string)
            if img:
                img_io = io.BytesIO()
                img.save(img_io, format='PNG')
                atd = Attendance.objects.create(user=user, date=datetime.today().date(), attendance_time_in_location=location)
                return JsonResponse({"status": "success", "message": "Attendance in marked successfully"}, status=200)
            return JsonResponse({"status": "img not present"}, status=400)
        else:
            return JsonResponse({"status": "fail"}, status=400)