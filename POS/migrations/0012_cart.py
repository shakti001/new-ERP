# -*- coding: utf-8 -*-
# Generated by Django 1.11.25 on 2020-01-25 11:01
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('POS', '0011_auto_20200125_0458'),
    ]

    operations = [
        migrations.CreateModel(
            name='Cart',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('qty', models.PositiveIntegerField(default=0)),
                ('product', models.ManyToManyField(related_name='productCart', to='POS.ProductV2')),
                ('productVariant', models.ManyToManyField(related_name='productVariantCart', to='POS.ProductVariantV2')),
            ],
        ),
    ]
