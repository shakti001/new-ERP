# -*- coding: utf-8 -*-
# Generated by Django 1.11.25 on 2020-01-28 07:24
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('POS', '0020_address'),
    ]

    operations = [
        migrations.AddField(
            model_name='address',
            name='store',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='currentstore', to='POS.Store'),
        ),
        migrations.AddField(
            model_name='address',
            name='user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='usersaddress', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
