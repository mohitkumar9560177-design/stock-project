from flask import Flask, jsonify, send_from_directory
import os
import yfinance as yf
import pandas as pd

app = Flask(__name__, static_folder='static', static_url_path='')

@app.route('/api/stock/<ticker>')
def get_stock(ticker):
    try:
        # असली स्टॉक डेटा फेच करें (पिछले 1 महीने का)
        stock = yf.Ticker(ticker)
        hist = stock.history(period="1mo")
        
        if hist.empty:
            return jsonify({"error": "Stock not found"}), 404

        # ग्राफ के लिए डेटा तैयार करें (Date और Price)
        chart_data = []
        for date, row in hist.iterrows():
            chart_data.append({
                "date": date.strftime("%b %d"),
                "price": round(row['Close'], 2)
            })

        # वर्तमान भाव और बदलाव
        current_price = round(hist['Close'].iloc[-1], 2)
        prev_price = round(hist['Close'].iloc[-2], 2)
        change_percent = round(((current_price - prev_price) / prev_price) * 100, 2)

        # सिंपल Analysis (Moving Average के आधार पर)
        ma50 = hist['Close'].rolling(window=20).mean().iloc[-1] # 20 दिन का एवरेज
        trend = "Bullish 🚀" if current_price > ma50 else "Bearish 📉"
        
        explanation = f"{ticker} अभी {trend.split()[0]} है क्योंकि इसका भाव अपने पिछले 20 दिनों के औसत (₹{round(ma50, 2)}) से {'ऊपर' if current_price > ma50 else 'नीचे'} है।"

        return jsonify({
            "symbol": ticker.upper(),
            "price": current_price,
            "change": change_percent,
            "trend": trend,
            "explanation": explanation,
            "chartData": chart_data
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)