# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2020-01-21 15:39
from __future__ import unicode_literals

import HR.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='accountsKey',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('activation_key', models.CharField(blank=True, max_length=40)),
                ('key_expires', models.DateTimeField(default=django.utils.timezone.now)),
                ('keyType', models.CharField(choices=[(b'hashed', b'hashed'), (b'otp', b'otp')], default=b'hashed', max_length=6)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='accountKey', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Document',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('description', models.CharField(max_length=400)),
                ('issuedTo', models.CharField(max_length=400)),
                ('passKey', models.CharField(max_length=4)),
                ('email', models.CharField(max_length=35)),
                ('docID', models.CharField(blank=True, max_length=10)),
                ('app', models.CharField(blank=True, max_length=20)),
                ('issuedBy', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='certificatesIssued', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='profile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('displayPicture', models.ImageField(upload_to=HR.models.getDisplayPicturePath)),
                ('mobile', models.CharField(max_length=14, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
