# Generated by Django 3.2.9 on 2021-12-02 20:32

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_shop'),
    ]

    operations = [
        migrations.AddField(
            model_name='shop',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='shop',
            name='employees',
            field=models.ManyToManyField(blank=True, related_name='employees', to='accounts.Profile'),
        ),
        migrations.AddField(
            model_name='shop',
            name='unique_code',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='shop',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
