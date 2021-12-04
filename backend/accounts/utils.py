import re
import random
from datetime import datetime
import json
from django.conf import settings
import requests
from haversine import haversine, Unit
from django.conf import settings
import boto3
from django.conf import settings
 
email_regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
phone_regex = r'^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$'
pancard_regex = "[A-Z]{5}[0-9]{4}[A-Z]{1}"
megastring = "abcdefghijklmnopqrstuvwxyz01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ"


def random_string():
    return "".join(random.sample(megastring, 8))

def create_message_string_from_otp(otp):
    return f'OTP to update your mobile number on MCRO is : {otp}'


def isValidPanCardNo(panCardNo):
    p = re.compile(pancard_regex)
    if panCardNo is None:
        return False
    return bool((re.search(p, panCardNo) and
       len(panCardNo) == 10))

def valid_email(email):
    return bool((re.match(email_regex, email)))

def valid_phone(phone):
    return bool((re.match(phone_regex, phone)))

def bifurcate_name(name):
    name_list = name.split(' ')
    if len(name_list) > 1:
        first_name = name_list[0].strip().title()
        name_list.remove(first_name)
        last_name = ' '.join(name_list).strip().title()
    else:
        first_name = name.strip().title()
        last_name = None
    return first_name, last_name

def ddmmyy_to_dateobject(string):
    try:
        return datetime.strptime(string, "%d-%m-%Y")
    except:
        return False

def otp_generator():
    return random.randint(99999, 999999)

def compare_two_geocodes(original, new):
    #Original and new are of geocode type
    distance = int(haversine(original, new))
    return distance




client = boto3.client(
    'rekognition',
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_DEFAULT_REGION_NAME
)

def compare_faces_for_checkin(target, source):
    # response = client.compare_faces(
    # SourceImage={
    #     'Bytes': b'bytes',
    #     'S3Object': {
    #         'Bucket': 'string',
    #         'Name': 'string',
    #         'Version': 'string'
    #     }
    # },
    #     TargetImage={
    #         'Bytes': b'bytes',
    #         'S3Object': {
    #             'Bucket': 'string',
    #             'Name': 'string',
    #             'Version': 'string'
    #         }
    #     },
    #     SimilarityThreshold=...,
    #     QualityFilter='NONE'|'AUTO'|'LOW'|'MEDIUM'|'HIGH'
    # )
    return True 