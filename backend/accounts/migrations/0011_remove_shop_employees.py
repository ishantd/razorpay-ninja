# Generated by Django 3.2.9 on 2021-12-03 19:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0010_alter_shop_unique_code'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='shop',
            name='employees',
        ),
    ]
