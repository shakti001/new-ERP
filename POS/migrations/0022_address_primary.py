# -*- coding: utf-8 -*-
# Generated by Django 1.11.25 on 2020-01-28 08:50
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('POS', '0021_auto_20200128_0724'),
    ]

    operations = [
        migrations.AddField(
            model_name='address',
            name='primary',
            field=models.BooleanField(default=False),
        ),
    ]
