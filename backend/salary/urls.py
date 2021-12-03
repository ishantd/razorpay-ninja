from django.urls import path

from salary import views

app_name = 'salary'

urlpatterns = [
    path('payout/', views.PayoutCRU, name='payout'),
]