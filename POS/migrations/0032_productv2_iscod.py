# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2020-01-30 13:06
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('POS', '0031_order_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='productv2',
            name='iscod',
            field=models.BooleanField(default=False),
        ),
    ]
