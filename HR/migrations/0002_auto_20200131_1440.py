# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2020-01-31 14:40
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('HR', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='companyName',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='gstin',
            field=models.CharField(blank=True, max_length=25, null=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='mobile',
            field=models.CharField(blank=True, max_length=14, null=True),
        ),
    ]
