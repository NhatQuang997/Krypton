from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    avatar = models.ImageField(upload_to='uploads/%Y/%m', blank=True, null=True)
    information = models.TextField(blank=True, null=True)
    favorite_coins = models.ManyToManyField("FavoriteCoin", related_name='favorite_coins', blank=True, null=True)
    language = models.CharField(max_length=50, default="VNI", null=False, blank=False)
    dark_mode = models.BooleanField(default=False, null=False, blank=False)
    deposit_address = models.TextField(null=True, blank=True)
    email_when_follows = models.BooleanField(default=True, null=False, blank=False)
    email_when_hit_sl_tp = models.BooleanField(default=True, null=False, blank=False)
    facebook = models.TextField(blank=True, null=True)
    twitter = models.TextField(blank=True, null=True)

class FavoriteCoin(models.Model):
    name = models.CharField(max_length=50, null=False, blank=False)
    url = models.TextField(null=False, blank=False)
    logo = models.TextField(blank=True, null=True)
    symbol = models.CharField(unique=True, max_length=50, null=False, blank=False)

class Account(models.Model):
    user = models.ForeignKey("User", related_name='accounts', on_delete=models.CASCADE)
    name = models.TextField(null=False, blank=False)
    exchange = models.CharField(max_length=50, null=False, blank=False)
    apiKey = models.TextField(null=False, blank=False)
    secretKey = models.TextField(null=False, blank=False)
    password = models.TextField(null=True, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)

class Order(models.Model):
    SPOT, FUTURES, MARGIN = range(3)
    ACTIONS = [
        (SPOT, 'spot'),
        (FUTURES, 'futures'),
        (MARGIN, 'margin')
    ]
    BUY, SELL = [0,1]
    SIDE = [
        (BUY, 'buy'),
        (SELL, 'sell')
    ]
    user = models.ForeignKey("User", related_name='orders', on_delete=models.SET_NULL, null=True)
    type = models.PositiveIntegerField(choices=ACTIONS, default=SPOT)
    side = models.PositiveIntegerField(choices=SIDE, default=BUY)
    copy_user_id = models.IntegerField(null=True, blank=True)
    order_id = models.CharField(max_length=50, null=False, blank=False)
    coin = models.CharField(max_length=10, null=False, blank=False)
    entry_price = models.FloatField(null=False, blank=False)
    tp = models.FloatField(null=True, blank=True)
    sl = models.FloatField(null=True, blank=True)
    leverage = models.IntegerField(null=True, blank=True)
    take_profit = models.FloatField(null=True, blank=True)
    pnl = models.FloatField(null=True, blank=True)
    donante = models.FloatField(null=True, blank=True)
    copy_fee = models.FloatField(null=True, blank=True)
    fee = models.FloatField(null=True, blank=True)
    max_amount = models.FloatField(default=10)
    max_copier = models.IntegerField(default=10)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

class TestAccount(models.Model):
    type = models.TextField(null=False, blank=False)
    apiKey = models.TextField(null=False, blank=False)
    secretKey = models.TextField(null=False, blank=False)
