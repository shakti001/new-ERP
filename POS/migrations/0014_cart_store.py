# -*- coding: utf-8 -*-
# Generated by Django 1.11.25 on 2020-01-25 11:59
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('POS', '0013_auto_20200125_1127'),
    ]

    operations = [
        migrations.AddField(
            model_name='cart',
            name='store',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='cartstore', to='POS.Store'),
        ),
    ]
