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
from attendance.models import Attendance
from attendance.utils import ProcessAttendance

import json
import base64
import io
from PIL import Image
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.utils import timezone

from salary.models import Payout

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

class AttendanceCRUD(APIView):
    
    def get(self, request, *args, **kwargs):
        employee_id = request.query_params.get('employee_id', False)
        user = request.user
        profile = Profile.objects.filter(user_id=user)
        profile = profile[0] if profile.exists() else None
        if not profile:
            return JsonResponse({'status': 'error'}, status=400)
        shop = profile.emp_in_shop
        if not employee_id and profile.role == 'emp':
            return JsonResponse({"status": "error", "message": "Employee id is required"}, status=400)
        start_of_month = datetime.today().date().replace(day=1)
        data = {"status": "success", "attendances": []}
        if employee_id:
            attendances = Attendance.objects.filter(user__id=employee_id, date__gte=start_of_month)
            for attendance in attendances:
                atd = {
                    attendance.date.strftime("%Y-%m-%d"): {
                        'selectedColor': '#2CDD93'
                        if (attendance.verified_face and attendance.verified_location)
                        else '#FF9700',
                        'selected': True,
                    }
                }

                data["attendances"].append(atd)
        if not employee_id:
            profiles = Profile.objects.filter(role='emp', shop=shop)
            data["employee_data"] = []
            for emp in profiles:
                payout, payout_created = Payout.objects.get_or_create(profile=emp)
                data["employee_data"].append({
                    "name": f'{emp.user_id.first_name} {emp.user_id.last_name}',
                    "user_id": emp.user_id.id,
                    "emp_id": emp.id,
                    "profile_photo": emp.profile_photo.url if emp.profile_photo else None,
                    "payout": model_to_dict(payout) if not payout_created else None})
        return JsonResponse(data, status=200)
        
    
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
                atd.attendance_time_out_selfie = InMemoryUploadedFile(img_io, field_name=None, content_type='image/png', name=f'{user.id}.png', size=img_io.tell, charset=None)
                atd.attendance_time_out_location = location
                atd.attendance_time_out = timezone.now()
                atd.save()
                p = ProcessAttendance(atd)
                atd.verified_face = p.verify_face()
                atd.verified_location = p.verify_location()
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