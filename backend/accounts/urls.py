from django.urls import path

from accounts import views

app_name = 'accounts'

urlpatterns = [
    path('auth/google/',  views.GoogleLogin.as_view(), name='google_login'),
    path('send-phone-otp/', views.SendPhoneOTP.as_view(), name='send-phone-otp'),
    path('verify-phone-otp/', views.VerifyPhoneOTP.as_view(), name='verify-phone-otp'),
    path('bank-account/', views.UpdateAndVerifyBankAccount.as_view(), name='bank-account-verify'),
    path('profiles/', views.EmployeeCRUD.as_view(), name='profiles'),
    path('shop/', views.ShopCRU.as_view(), name='shop'),
    path('join-shop/', views.JoinShop.as_view(), name='join-shop'),
    path('/customer/', views.CustomerCRUD.as_view(), name='customer'),
]