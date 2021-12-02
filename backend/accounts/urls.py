from django.urls import path

from accounts import views

app_name = 'accounts'

urlpatterns = [
    path('auth/google/',  views.GoogleLogin.as_view(), name='google_login'),
    # path('check-account-exists/', views.CheckExistingAccount.as_view(), name='check-existing-account'),
    # path('send-email-otp/', views.SendEmailOTP.as_view(), name='send-email-otp'),
    # path('verify-email-otp/', views.VerifyEmailOTP.as_view(), name='verify-email-otp'),
    path('send-phone-otp/', views.SendPhoneOTP.as_view(), name='send-phone-otp'),
    path('verify-phone-otp/', views.VerifyPhoneOTP.as_view(), name='verify-phone-otp'),
    # path('onboarding/profile/', views.OnboardingProfileData.as_view(), name='onboarding-profile-data'),
    # path('banks/', views.GetBanks.as_view(), name='get-banks'),
    # path('bank-branches-by-id/', views.GetBankBranchesByID.as_view(), name='bank-branches'),
    # path('get-states-from-bank/', views.GetStatesFromBank.as_view(), name='get-states-from-bank'),
    # path('get-districts-from-state/', views.GetDistrictsFromStates.as_view(), name='get-districts-from-state'),
    # path('get-branches-from-district/', views.GetBranchesFromDistrict.as_view(), name='get-branches-from-district'),
    # path('update-personal-details/', views.UpdatePersonalDetails.as_view(), name='update-personal-details'),
    # path('pan-card/check/', views.CheckPANCard.as_view(), name='pan-card-check'),
    # path('pan-card/verify/', views.UserVerifyPANCard.as_view(), name='pan-card-verify'),
    path('bank-account/', views.UpdateAndVerifyBankAccount.as_view(), name='bank-account-verify'),
    # path('profile-progress/', views.OnboardingProgress.as_view(), name='profile-progress'),
    # path('api/notification/register/', views.NotificationEndpoint.as_view(), name='notification-register'),
    # path('test-data/', views.DevTestData.as_view(), name='DevTestdata')
    path('profiles/', views.EmployeeCRUD.as_view(), name='profiles'),
]