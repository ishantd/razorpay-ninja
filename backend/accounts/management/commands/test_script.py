from django.core.management.base import BaseCommand

from salary.models import Payout


class Command(BaseCommand):
    help = 'IFSC Codes for database'
    
    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        pass