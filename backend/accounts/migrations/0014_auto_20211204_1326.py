# Generated by Django 3.2.9 on 2021-12-04 07:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0013_auto_20211204_1134'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userbankaccount',
            name='razorpay_processed',
        ),
        migrations.AddField(
            model_name='pancard',
            name='razorpay_processed',
            field=models.BooleanField(default=False),
        ),
    ]
