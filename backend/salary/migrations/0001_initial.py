# Generated by Django 3.2.9 on 2021-12-03 18:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('accounts', '0008_auto_20211203_0402'),
    ]

    operations = [
        migrations.CreateModel(
            name='Payout',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField(default=0)),
                ('date_of_every_month', models.IntegerField(default=1)),
                ('employee_id', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='emp_payout', to='accounts.profile')),
            ],
        ),
        migrations.CreateModel(
            name='PayoutTransaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.FloatField()),
                ('status', models.CharField(default='pending', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('payout', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='salary.payout')),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.profile')),
            ],
        ),
    ]
