# -*- coding: utf-8 -*-
# Generated by Django 1.11.25 on 2020-01-29 09:23
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('POS', '0030_merge_20200128_1417'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('newOrder', 'newOrder'), ('quote', 'quote'), ('workInProgress', 'workInProgress'), ('shipped', 'shipped')], default='newOrder', max_length=10),
        ),
    ]