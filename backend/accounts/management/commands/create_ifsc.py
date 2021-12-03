from django.core.management.base import BaseCommand
from accounts.models import Bank

from pathlib import Path
from tqdm import tqdm
import os
import math
import pandas as pd


BASE_DIR = Path(__file__).resolve().parent.parent.parent
BASE_DIR_PARENT = Path(__file__).resolve().parent.parent.parent.parent

print("Importing csv file into python...")
data = pd.read_csv(os.path.join(BASE_DIR_PARENT, 'init_data/IFSC.csv'))
print("Converting CSV file to python readable...")
data = data.to_dict(orient='records')

class Command(BaseCommand):
    help = 'IFSC Codes for database'
    
    def add_arguments(self, parser):
        parser.add_argument('first_time', type=int)

    def handle(self, *args, **options):
        print("Starting saving process...")
        first_time = options['first_time']
        if first_time == 1:
            print("Starting bulk create...")
            objs = []
            for d in tqdm(data):
                if not isinstance(d["swift"], str):
                    if (math.isnan(d["swift"])):
                        d["swift"] = None
                if not isinstance(d["micr"], str):
                    if not (math.isnan(d["micr"])):
                        d["micr"] = str(int(d["micr"]))
                objs.append(Bank(**d))
            banks = Bank.objects.bulk_create(objs=objs)
        else:
            print("Starting slow and careful create...")
            for d in tqdm(data):
                if not isinstance(d["swift"], str):
                    if (math.isnan(d["swift"])):
                        d["swift"] = None
                if not isinstance(d["micr"], str):
                    if not (math.isnan(d["micr"])):
                        d["micr"] = str(int(d["micr"]))
                ifsc = Bank.objects.filter(ifsc=d["ifsc"])
                if ifsc.exists():
                    if len(ifsc) > 1:
                        print("The filter returned more than 1 IFSC, please check!")
                    elif len(ifsc) == 1:
                        ifsc.update(**d)
                else:
                    ifsc = Bank.objects.create(**d)
            