# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2020-01-26 18:59
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('POS', '0015_cart_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productvariantv2',
            name='parent',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='varients', to='POS.ProductV2'),
        ),
    ]
