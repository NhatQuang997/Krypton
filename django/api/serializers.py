from rest_framework.serializers import ModelSerializer
from .models import Account, FavoriteCoin, Order, User

class FavoriteCoinSarializer(ModelSerializer):
    class Meta:
        model = FavoriteCoin
        fields = '__all__'

class UserSerializer(ModelSerializer):
    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user
        
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'password', 'avatar', 'information', 'language', 'dark_mode', 'deposit_address', 'email_when_follows', 'email_when_hit_sl_tp', 'facebook', 'twitter', 'date_joined']
        extra_kwargs = {
            'password': {'write_only': 'true'},
        }

class AccountSerializer(ModelSerializer):
    class Meta: 
        model = Account
        fields = '__all__'
        extra_kwargs = {
            'secretKey': {'write_only': 'true'},
            'password': {'write_only': 'true'}
        }

class OrderSerializer(ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'