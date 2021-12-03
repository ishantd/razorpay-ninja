from django.urls import path

from attendance import views

app_name = 'attendance'

urlpatterns = [
    path('', views.AttendanceCRUD.as_view(), name='mark'),
]