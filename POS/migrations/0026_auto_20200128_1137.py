# -*- coding: utf-8 -*-
# Generated by Django 1.11.25 on 2020-01-28 11:37
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('POS', '0025_auto_20200128_1119'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='orderQtyMap',
        ),
        migrations.AddField(
            model_name='order',
            name='store',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='storeorders', to='POS.Store'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='orderqtymap',
            name='store',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='storeordersqty', to='POS.Store'),
            preserve_default=False,
        ),
    ]