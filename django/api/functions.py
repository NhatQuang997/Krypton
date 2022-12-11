def get_current_price(symbol, exchange):
    try:
        return exchange.fetch_ohlcv(
                symbol, timeframe='3m', since=None, limit=1)[0][4]
    except Exception as e:
            print(e)

def create_order(symbol, usd, exchange, side):
    direction = 'buy' if side == 0 else 'sell'
    current_price = get_current_price(symbol, exchange)
    amount = float(usd)/float(current_price)
    try:
        order = exchange.create_order(symbol=symbol, type="MARKET", side=direction, amount=amount, price=None) # main order
        return order
    except Exception as e:
        print(e)
