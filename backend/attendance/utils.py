from haversine import haversine, Unit
from django.conf import settings
class ProcessAttendance:
    
    def __init__(self, attendance):
        self.attendance = attendance
    
    def verify_face(self):
        """
        Verifies the face of the employee
        """
        return True
    
    def verify_location(self):
        """
        Verifies the location of the employee
        """
        return True
    
    
def compare_two_geocodes(original, new):
    # gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)
    # original_geocode_result = gmaps.geocode(original)
    # new_geocode_result = gmaps.geocode(new)
    original_location = original_geocode_result[0]["geometry"]["location"]
    new_location = new_geocode_result[0]["geometry"]["location"]
    distance = int(haversine(original_location, new_location))
    return distance


import boto3
from django.conf import settings

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