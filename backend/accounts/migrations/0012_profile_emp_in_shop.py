# Generated by Django 3.2.9 on 2021-12-03 19:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0011_remove_shop_employees'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='emp_in_shop',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='accounts.shop'),
        ),
    ]
