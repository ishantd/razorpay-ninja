from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from location_field.models.plain import PlainLocationField
from attendance.utils import ProcessAttendance

def attendance_selfie_path(instance):

    return f'atd_{instance.date}/{instance.user.username}'

class Attendance(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    attendance_time_in = models.DateTimeField(default=timezone.now)
    attendance_time_out = models.DateTimeField(null=True, blank=True)
    attendance_time_in_location = PlainLocationField(zoom=14)
    attendance_time_out_location = PlainLocationField(zoom=14)
    attendance_time_in_selfie = models.ImageField(upload_to='attendance/in/%d-%m-%Y/')
    attendance_time_out_selfie = models.ImageField(upload_to='attendance/out/%d-%m-%Y/')
    attendance_processed = models.BooleanField(default=False)
    verified_face = models.BooleanField(default=False)
    verified_location = models.BooleanField(default=False)
    
def verify_attendance(sender, instance, created, **kwargs):
    if not instance.attendance_processed:
        p = ProcessAttendance(instance)
        instance.verified_face = p.verify_face()
        instance.verified_location = p.verify_location()
        instance.attendance_processed = True
        instance.save()