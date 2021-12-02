from django.core.mail import send_mail
from django.conf import settings

import boto3
import json

from accounts.utils import otp_generator, create_message_string_from_otp

def send_basic_email(from_address, to_address, subject, message):
    send_mail(
        subject,
        message,
        from_address,
        [to_address]
    )
    return True

def send_otp_email(email):
    otp = str(otp_generator())
    if settings.SEND_EMAIL:
        send_mail(
            'OTP Verification for account',
            f'OTP is : {otp}',
            'contact@skidfintech.com',
            [email]
        )
    return otp

def send_otp_to_phone(phone, otp):
    if settings.SEND_OTP:
        message = create_message_string_from_otp(otp)
        client = boto3.client(
            "sns",
            aws_access_key_id=settings.AWS_SNS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SNS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_DEFAULT_REGION_NAME
        )
        client.publish(
            PhoneNumber=f"+91{phone}",
            Message=message
        )
    return True

def create_sns_endpoint(user_data, device_id):
    client = boto3.client(
        'sns',
        aws_access_key_id=settings.AWS_SNS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SNS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_DEFAULT_REGION_NAME
    )

    arn = client.create_platform_endpoint(
        PlatformApplicationArn=settings.SNS_DEFAULT_PLATFORM_APPLICATION_ARN,
        Token=device_id
    )
    
    return arn

def trigger_single_notification(device_id, title, body):
    GCM_data = { 'notification' : { 'body' : body, 'title': title}}

    data = { "default" : "test",
            "GCM": json.dumps(GCM_data)
            }
    client = boto3.client(
        'sns',
        aws_access_key_id=settings.AWS_SNS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SNS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_DEFAULT_REGION_NAME
    )
    jsonData =  json.dumps(data)
    notify = client.publish(
        Message=jsonData,
        Subject=body,
        MessageStructure='json',
        TargetArn=device_id,

    )
    
    return notify