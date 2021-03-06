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
        employee_id = request.query_params.get('user_id', False)
        user = request.user
        profile = Profile.objects.filter(user_id=user)
        user_profile = profile[0] if profile.exists() else None
        if not user_profile:
            return JsonResponse({'status': 'error'}, status=400)
        shop = user_profile.emp_in_shop
        print(type(shop))
        if not employee_id and user_profile.role == 'emp':
            return JsonResponse({"status": "error", "message": "Employee id is required"}, status=400)
        start_of_month = datetime.today().date().replace(day=1)
        data = {"status": "success"}
        if employee_id:
            attendances = Attendance.objects.filter(user__id=employee_id, date__gte=start_of_month)
            atd = {}
            for attendance in attendances:
                if (attendance.verified_face and attendance.verified_location):
                    selectedColor = '#2CDD93'
                elif attendance.absent:
                    selectedColor = '#D44333'
                else:
                    selectedColor = '#FF9700'
                atd[attendance.date.strftime("%Y-%m-%d")] = {
                        'selectedColor': selectedColor,
                        'selected': True,
                    }
            data["attendances"] = atd
            empuser = User.objects.get(id=employee_id)
            empprofile = Profile.objects.get(user_id=empuser)
            payoutemp = Payout.objects.get(employee_id=empprofile)
            data["employee_data"] = {
                            "name": f'{empuser.first_name} {empuser.last_name}',
                            "user_id": empuser.id,
                            "role": empprofile.role,
                            "shop": model_to_dict(empprofile.emp_in_shop),
                            "emp_id": empprofile.id,
                            "profile_photo": empprofile.profile_picture.url if empprofile.profile_picture else None,
                            "payout": model_to_dict(payoutemp)}
        if not employee_id:
            empprofiles = Profile.objects.all()
            data["employee_data"] = []
            for emp in empprofiles:
                if emp.emp_in_shop:
                    if emp.role == 'emp' and emp.emp_in_shop.id == shop.id:
                        payout, payout_created = Payout.objects.get_or_create(employee_id=emp)
                        data["employee_data"].append({
                            "name": f'{emp.user_id.first_name} {emp.user_id.last_name}',
                            "user_id": emp.user_id.id,
                            "role": emp.role,
                            "shop": model_to_dict(emp.emp_in_shop),
                            "emp_id": emp.id,
                            "profile_photo": emp.profile_picture.url if emp.profile_picture else None,
                            "payout": model_to_dict(payout) if not payout_created else None})
        return JsonResponse(data, status=200)
        
    
    def post(self, request, *args, **kwargs):
        attendance_type = request.data.get('type', False)
        location = request.data.get('location', False)
        user = request.user
        
        if not (location and attendance_type):
            return JsonResponse({"status": "error", "message": "Location and atd type is required"}, status=400)
        
        todays_attendance = Attendance.objects.filter(user=user, date=datetime.today().date())
        if (todays_attendance.exists() and len(todays_attendance)==1) and todays_attendance[0].absent:
            return JsonResponse({"status": "error", "message": "You are already absent"}, status=400)
        elif (todays_attendance.exists() and len(todays_attendance)==1) and todays_attendance[0].attendance_time_out:
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
                img.save(img_io, format='jpeg')
                atd = todays_attendance[0]
                atd.attendance_time_out_selfie = InMemoryUploadedFile(img_io, field_name=None, content_type='image/jpg', name=f'{user.id}.jpg', size=img_io.tell, charset=None)
                atd.attendance_time_out_location = location
                atd.attendance_time_out = timezone.now()
                atd.save()
                p = ProcessAttendance(atd)
                atd.verified_face = p.verify_face()
                atd.verified_location = p.verify_location()
                atd.save()
                if(atd.verified_face and atd.verified_location):
                    return JsonResponse({"status": "success", "message": "Attendance out marked successfully"}, status=200)
                elif not(atd.verified_face):
                    return JsonResponse({"status": "error", "message": "Facial verification failed"}, status=200)
                elif not(atd.verified_location):
                    return JsonResponse({"status": "error", "message": "Location verification failed"}, status=200)
                else:
                    return JsonResponse({"status": "error", "message": "Location and Facial recognition failed"}, status=200)
            return JsonResponse({"status": "img not present"}, status=400)
        elif not todays_attendance.exists():
            location = f'{location["latitude"]}, {location["longitude"]}'
            b64_image_string = request.data.get("live_image", False)
            if not b64_image_string:
                return JsonResponse({"status": "error", "message": "Image is required"}, status=400)
            img = decodeUserImage(b64_image_string)
            if img:
                img_io = io.BytesIO()
                img.save(img_io, format='jpeg')
                atd = Attendance.objects.create(user=user, date=datetime.today().date(), attendance_time_in_location=location)
                return JsonResponse({"status": "success", "message": "Attendance in marked successfully"}, status=200)
            return JsonResponse({"status": "img not present"}, status=400)
        else:
            return JsonResponse({"status": "fail"}, status=400)

class MarkAbsent(APIView):
    
    def get(self, request, *args, **kwargs):
        user_id = request.query_params.get("user_id", False)
        
        atd = Attendance.objects.get_or_create(user__id=user_id, date=datetime.today().date())
        atd.absent = True
        
        atd.save()
        
        return JsonResponse({"status": "success", "message": "Marked Absent"}, status=200)

class AttendanceDetail(APIView):
    
    def get(self, request, *args, **kwargs):
        user_id = request.query_params.get("user_id", False)
        date = request.query_params.get("date", False)
        date_object = datetime.strptime(date, "%Y-%m-%d").date()
        if user_id:
            atd = Attendance.objects.filter(user__id=user_id, date=date_object)
            if atd.exists() and len(atd) == 1:
                a = atd[0]
                apr = ProcessAttendance(a)
                data = {
                    "status": "success",
                    "attendance_time_in_location": a.attendance_time_in_location,
                    "attendance_time_out_location": a.attendance_time_out_location,
                    "attendance_time_in_selfie": a.attendance_time_in_selfie.url if a.attendance_time_in_selfie else None,
                    "attendance_time_out_selfie": a.attendance_time_out_selfie.url if a.attendance_time_out_selfie else None,
                    "absent": a.absent,
                    "date": a.date.strftime("%Y-%m-%d"),
                    "verified_face": a.verified_face,
                    "verified_location": a.verified_location,
                    "attendance_processed": a.attendance_processed,
                    "distance": apr.get_distance(),
                }
                return JsonResponse({"status": "ok", "data": data}, status=200)
        return JsonResponse({"status": "error", "message": "User not found"}, status=400)
                