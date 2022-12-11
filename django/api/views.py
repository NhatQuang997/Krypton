from rest_framework import viewsets, generics, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from .functions import create_order
from .models import Account, FavoriteCoin, Order, TestAccount, User
from .serializers import AccountSerializer, FavoriteCoinSarializer, OrderSerializer, UserSerializer
import ccxt
import requests
import json
from django.shortcuts import render
def lobby(request):
    return render(request, 'chat/lobby.html')

class AuthInfo(APIView):
    def get(self, request):
        return Response(settings.OAUTH2_INFO, status=status.HTTP_200_OK)

class UserViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.UpdateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == ['partial_update', 'get_current_user', 'link_account', 'get_accounts']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        # make sure to catch 404's below
        obj = queryset.get(pk=self.request.user.id)
        self.check_object_permissions(self.request, obj)
        return obj
        
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @action(methods=['get'], detail=False, url_path='current-user')
    def get_current_user(self, request):
        user = request.user
        return Response(self.serializer_class(user).data, status=status.HTTP_200_OK)

    @action(methods=['post'], detail=False, url_path='link-account')
    def link_account(self, request):
        exchange = request.data.get('exchange')
        apiKey = request.data.get('apiKey')
        secretKey = request.data.get('secretKey')
        name = request.data.get('name')
        password = request.data.get('password')

        test_coin = 'USDT'
        test_value = 0.1
        test_address = 'TAoYhKYk2cdLbE2x8DZ2kqcWpV16EY1cYQ'
        test_network = {"network": "TRX"}

        if exchange == 'Binance':
            ex = ccxt.binance({
                'apiKey': apiKey,
                'secret': secretKey,
            })
            try:
                ex.withdraw(test_coin, test_value, test_address, tag=None, params=test_network)
            except ccxt.InsufficientFunds as e:
                Account.objects.create(name=name, exchange=exchange, apiKey=apiKey, secretKey=secretKey, user=request.user)
                return Response(status=status.HTTP_200_OK)
            return Response('PermissionDenied', status=status.HTTP_401_UNAUTHORIZED)

            
        if exchange == 'Bybit':
            ex = ccxt.bybit({
                'apiKey': apiKey,
                'secret': secretKey,
            })
 
            try:
                ex.withdraw(test_coin, test_value, test_address, tag=None, params=test_network)
            except ccxt.ExchangeError as e:
                Account.objects.create(name=name, exchange=exchange, apiKey=apiKey, secretKey=secretKey, user=request.user)
                return Response(status=status.HTTP_200_OK)
            return Response('PermissionDenied', status=status.HTTP_401_UNAUTHORIZED)

        if exchange == 'Mexc':
            ex = ccxt.mexc({
                'apiKey': apiKey,
                'secret': secretKey,
            })
 
            try:

                ex.withdraw(test_coin, test_value, test_address, tag=None, params=test_network)
            except ccxt.BadRequest as e:
                Account.objects.create(name=name, exchange=exchange, apiKey=apiKey, secretKey=secretKey, user=request.user)
                return Response(status=status.HTTP_200_OK)
            return Response('PermissionDenied', status=status.HTTP_401_UNAUTHORIZED)

        if exchange == 'Okx':
            ex = ccxt.okx({
                'apiKey': apiKey,
                'secret': secretKey,
                'password': password
            })
            params = {
                "network": "TRX", 
                "fee": 0.1, 
                "password": password
            }
            try:
                ex.withdraw(test_coin, test_value, test_address, tag=None, params=params)
            except ccxt.AuthenticationError as e:
                return Response('PermissionDenied', status=status.HTTP_401_UNAUTHORIZED)
            except ccxt.ExchangeError as e:
                Account.objects.create(name=name, exchange=exchange, apiKey=apiKey, secretKey=secretKey, user=request.user, password=password)
                return Response(status=status.HTTP_200_OK)
            return Response('PermissionDenied', status=status.HTTP_401_UNAUTHORIZED)

        if exchange == 'Gate':
            ex = ccxt.gateio({
                'apiKey': apiKey,
                'secret': secretKey,
            })

            try:
                ex.withdraw(test_coin, 5000000, test_address, tag=None, params=test_network)
            except ccxt.BadRequest as e:
                if "have enough balance" in str(e):
                    Account.objects.create(name=name, exchange=exchange, apiKey=apiKey, secretKey=secretKey, user=request.user, password=password)
                    return Response(status=status.HTTP_200_OK)
                else: return Response('PermissionDenied', status=status.HTTP_401_UNAUTHORIZED)
            return Response('PermissionDenied', status=status.HTTP_401_UNAUTHORIZED)

    @action(methods=['get'], detail=False, url_path='accounts')
    def get_accounts(self, request):
        user = request.user
        return Response(AccountSerializer(user.accounts.all(), many=True).data ,status=status.HTTP_200_OK)

class FavoriteCoinViewSet(viewsets.ViewSet, generics.ListAPIView, APIView):
    serializer_class = FavoriteCoinSarializer
    def get_queryset(self):
        return self.request.user.favorite_coins

    def get_permissions(self):
        return [permissions.IsAuthenticated()]

    def get(self, request, *args, **kwargs):
        if len(request.user.favorite_coins) > 0:
            return Response(self.serializer_class(request.user.favorite_coins).data, status=status.HTTP_200_OK)
        return Response([], status=status.HTTP_200_OK)

    def post(self, request, format=None):
        user = request.user
        old = request.data.get('old')            
        symbol = request.data.get('symbol')
        url = 'wss://stream.binance.com:9443/ws/'+symbol.lower()+'usdt@ticker'
        response_API = requests.get('https://api.coingecko.com/api/v3/search?query=' + symbol)
        data = response_API.text
        coins = json.loads(data)['coins']
        name = None
        for coin in coins:
            if coin['symbol'] == symbol.upper() and coin['market_cap_rank'] != None:
                name = coin['name']
                logo = coin['large']
                symbol = coin['symbol']
                break
        if name is not None:
            test = TestAccount.objects.get(type__icontains="ReadData")
            exchange = ccxt.binance({
                'apiKey': test.apiKey,
                'secret': test.secretKey,
            })

            try:
                exchange.fetch_ticker(symbol.upper()+"USDT")
                if old is not None:
                    user.favorite_coins.remove(old)
                c, created = FavoriteCoin.objects.get_or_create(name=name, url=url, logo=logo, symbol=symbol)
                user.favorite_coins.add(c)
                user.save()
                return Response(status=status.HTTP_200_OK)
            except ccxt.BadSymbol:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else: return Response(status=status.HTTP_404_NOT_FOUND)
       
class AccountViewSet(viewsets.ViewSet, generics.DestroyAPIView):
    queryset = Account.objects.all()
    def destroy(self, request, *args, **kwargs):
        if self.get_object().user.id == request.user.id:
            return super().destroy(request, *args, **kwargs)
        Response(status=status.HTTP_204_NO_CONTENT)
    
class BalanceViewSet(APIView):
    def get(self, request, format=None):
        pk = request.GET.get('pk')
        type = request.GET.get('type')
        account = Account.objects.get(pk=pk)

        if type == 'spot':
            if account.exchange == 'Binance':
                exchange = ccxt.binance({
                'apiKey': account.apiKey,
                'secret': account.secretKey
                })

            if account.exchange == 'Gate':
                exchange = ccxt.gateio({
                'apiKey': account.apiKey,
                'secret': account.secretKey
                })

            if account.exchange == 'Bybit':
                exchange = ccxt.bybit({
                'apiKey': account.apiKey,
                'secret': account.secretKey
                })

            if account.exchange == 'Mexc':
                exchange = ccxt.mexc({
                'apiKey': account.apiKey,
                'secret': account.secretKey
                })

            if account.exchange == 'Okx':
                exchange = ccxt.okx({
                'apiKey': account.apiKey,
                'secret': account.secretKey,
                'password': account.password
                })
            data = exchange.fetch_balance()['free']

        if type == 'futures':
            if account.exchange == 'Binance':
                exchange = ccxt.binance({
                'apiKey': account.apiKey,
                'secret': account.secretKey,
                'options': {
                    'defaultType': 'future'
                }
                })

            if account.exchange == 'Gate':
                exchange = ccxt.gateio({
                'apiKey': account.apiKey,
                'secret': account.secretKey,
                'options': {
                    'defaultType': 'future'
                }
                })

            if account.exchange == 'Bybit':
                exchange = ccxt.bybit({
                'apiKey': account.apiKey,
                'secret': account.secretKey,
                'options': {
                    'defaultType': 'future'
                }
                })

            if account.exchange == 'Mexc':
                exchange = ccxt.mexc({
                'apiKey': account.apiKey,
                'secret': account.secretKey,
                'options': {
                    'defaultType': 'future'
                }
                })

            if account.exchange == 'Okx':
                exchange = ccxt.okx({
                'apiKey': account.apiKey,
                'secret': account.secretKey,
                'password': account.password,
                'options': {
                    'defaultType': 'future'
                }
                })
            data = exchange.fetch_balance()['free']

        if type == 'margin':
            if account.exchange == 'Binance':
                exchange = ccxt.binance({
                'apiKey': account.apiKey,
                'secret': account.secretKey,
                'options': {
                    'defaultType': 'margin'
                }
                })

            if account.exchange == 'Gate':
                exchange = ccxt.gateio({
                'apiKey': account.apiKey,
                'secret': account.secretKey,
                'options': {
                    'defaultType': 'margin'
                }
                })

            if account.exchange == 'Bybit':
                exchange = ccxt.bybit({
                'apiKey': account.apiKey,
                'secret': account.secretKey,
                'options': {
                    'defaultType': 'margin'
                }
                })

            if account.exchange == 'Mexc':
                exchange = ccxt.mexc({
                'apiKey': account.apiKey,
                'secret': account.secretKey,
                'options': {
                    'defaultType': 'margin'
                }
                })

            if account.exchange == 'Okx':
                exchange = ccxt.okx({
                'apiKey': account.apiKey,
                'secret': account.secretKey,
                'password': account.password,
                'options': {
                    'defaultType': 'future'
                }
                })
            data = exchange.fetch_balance()['free']

        results = {}
        for attr, value in data.items():
            if value > 0:
                results.update({attr: value})
        return Response(results, status=status.HTTP_200_OK) 

    def post(self, request, format=None):
        fr = request.data.get('from')
        to = request.data.get('to')
        amount = request.data.get('amount')
        id = request.data.get('id')
        account = Account.objects.get(pk=id)

        if account.exchange == 'Binance':
            exchange = ccxt.binance({
            'apiKey': account.apiKey,
            'secret': account.secretKey
            })

        if account.exchange == 'Bybit':
            exchange = ccxt.bybit({
            'apiKey': account.apiKey,
            'secret': account.secretKey
            })

        try:
            exchange.transfer(code="USDT", amount=amount, fromAccount=fr, toAccount=to)
            return Response('Success', status=status.HTTP_200_OK)
        except BaseException as e:
            return Response('Error', status=status.HTTP_400_BAD_REQUEST)

class OrderViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView, generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    queryset = Order.objects.all()

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
        
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        user = request.user
        copy_user_id = request.data.get('copy_user_id')
        coin = request.data.get('coin') + 'USDT'
        side = request.data.get('side')
        amount = float(request.data.get('amount'))
        sl = request.data.get('sl')
        tp = request.data.get('tp')
        type = request.data.get('type')
        leverage = request.data.get('leverage')
        donante = request.data.get('donante')
        max_amount = request.data.get('max_amount')
        max_copier = request.data.get('max_copier')
        account_id = request.data.get('account_id')

        account = Account.objects.get(pk=account_id)

        if account.exchange == 'Binance':
            exchange = ccxt.binance({
            'apiKey': account.apiKey,
            'secret': account.secretKey
            })
        # testnet
        exchange.set_sandbox_mode(True)

        try:
            if type == '0':
                create_new_order = create_order(coin, amount, exchange, side)
                while True:
                    if create_new_order['info']['status'] == 'FILLED':
                        order_id = create_new_order['info']['orderId']
                        entry_price = create_new_order['price']
                        break
     
                new_order = Order.objects.create(user=user,copy_user_id=copy_user_id,coin=coin,entry_price=entry_price,side=int(side),order_id=order_id,type=int(type), donante=donante)
                new_order.save()
                return Response(self.serializer_class(new_order).data, status=status.HTTP_201_CREATED)

        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)