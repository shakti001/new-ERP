# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2020-01-24 10:06
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('POS', '0008_productvariantv2_enabled'),
    ]

    operations = [
        migrations.AddField(
            model_name='productvariantv2',
            name='value2',
            field=models.CharField(max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='productvariantv2',
            name='value',
            field=models.CharField(max_length=20, null=True),
        ),
    ]
