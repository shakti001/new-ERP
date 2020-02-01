# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2020-01-21 15:39
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='EnquiryAndContacts',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(max_length=100)),
                ('mobile', models.CharField(max_length=20)),
                ('email', models.CharField(max_length=100)),
                ('notes', models.CharField(max_length=100, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Registration',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('token', models.CharField(max_length=50)),
                ('emailOTP', models.CharField(max_length=6, null=True)),
                ('mobileOTP', models.CharField(max_length=6, null=True)),
                ('email', models.CharField(max_length=60, null=True)),
                ('mobile', models.CharField(max_length=15, null=True)),
            ],
        ),
    ]
