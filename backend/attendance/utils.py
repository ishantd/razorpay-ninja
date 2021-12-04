from django.conf import settings
from haversine import haversine, Unit

class ProcessAttendance:
    
    def __init__(self, attendance):
        self.attendance = attendance
        self.client = boto3.client(
            'rekognition',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_DEFAULT_REGION_NAME
        )

    def verify_face(self):
        """
        Verifies the face of the employee
        """
        response = self.client.compare_faces(
        SourceImage={
            
            'S3Object': {
                'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
                'Name': self.attendance.attendance_time_in_selfie.path,
                
            }
        },
            TargetImage={
              
                'S3Object': {
                    'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
                    'Name': self.attendance.user.profile.profile_picture.path,
                    
                }
            },
            SimilarityThreshold=90.00,
        )
        return response['FaceMatches'][0]['Similarity'] >= 98.00
    
    def verify_location(self):
        """
        Verifies the location of the employee
        """
        in_location = self.attendance.attendance_time_in_location
        out_location = self.attendance.attendance_time_out_location
        distance = int(haversine((in_location.latitude, in_location.longitude), (out_location.latitude, out_location.longitude), unit=Unit.METERS))
        return distance <= settings.MAX_DISTANCE

def compare_faces_for_checkin(target, source):
    response = client.compare_faces(
    SourceImage={
        'Bytes': b'bytes',
        'S3Object': {
            'Bucket': 'string',
            'Name': 'string',
            'Version': 'string'
        }
    },
        TargetImage={
            'Bytes': b'bytes',
            'S3Object': {
                'Bucket': 'string',
                'Name': 'string',
                'Version': 'string'
            }
        },
        SimilarityThreshold=...,
        QualityFilter='NONE'|'AUTO'|'LOW'|'MEDIUM'|'HIGH'
    )
    return True
