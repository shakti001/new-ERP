# -*- coding: utf-8 -*-
# Generated by Django 1.11.25 on 2020-01-27 10:32
from __future__ import unicode_literals

import POS.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('POS', '0016_auto_20200126_1859'),
    ]

    operations = [
        migrations.AddField(
            model_name='cart',
            name='customizedDetails',
            field=models.CharField(max_length=2000, null=True),
        ),
        migrations.AddField(
            model_name='cart',
            name='customizedFile',
            field=models.FileField(null=True, upload_to=POS.models.getgstincert),
        ),
    ]
