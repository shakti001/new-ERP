# -*- coding: utf-8 -*-
# Generated by Django 1.11.25 on 2020-01-31 12:43
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('POS', '0037_auto_20200131_1203'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='coupon',
            field=models.PositiveIntegerField(null=True),
        ),
    ]