# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2020-01-24 09:40
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('POS', '0007_auto_20200123_2000'),
    ]

    operations = [
        migrations.AddField(
            model_name='productvariantv2',
            name='enabled',
            field=models.BooleanField(default=True),
        ),
    ]
