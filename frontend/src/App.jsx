import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function App() {
  const [ticker, setTicker] = useState('TSLA')
  const [stockData, setStockData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchStockData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/stock/${ticker}`)
      const data = await response.json()
      if(data.error) alert("Stock not found! Please check the ticker.");
      setStockData(data)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
    setLoading(false)
  }

  return (
    <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* हेडर */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#38bdf8', fontSize: '32px' }}>📈 Real-Time Stock Analyzer</h1>
          <p style={{ color: '#94a3b8' }}>Python Backend + React Frontend</p>
        </div>

        {/* सर्च बार */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <input 
            type="text" 
            value={ticker} 
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="Enter Ticker (e.g. TSLA, AAPL, INFY.NS)"
            style={{ flex: 1, padding: '15px', borderRadius: '10px', border: 'none', backgroundColor: '#1e293b', color: 'white', fontSize: '18px' }}
          />
          <button 
            onClick={fetchStockData}
            style={{ padding: '15px 30px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        {/* डेटा और ग्राफ */}
        {stockData && !stockData.error && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* टॉप कार्ड्स */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
              <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '10px', borderLeft: '4px solid #38bdf8' }}>
                <p style={{ color: '#94a3b8', margin: '0 0 10px 0' }}>Current Price</p>
                <h2 style={{ margin: 0, fontSize: '28px' }}>${stockData.price}</h2>
              </div>
              <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '10px', borderLeft: `4px solid ${stockData.change >= 0 ? '#4ade80' : '#f87171'}` }}>
                <p style={{ color: '#94a3b8', margin: '0 0 10px 0' }}>Today's Change</p>
                <h2 style={{ margin: 0, fontSize: '28px', color: stockData.change >= 0 ? '#4ade80' : '#f87171' }}>
                  {stockData.change > 0 ? '+' : ''}{stockData.change}%
                </h2>
              </div>
              <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '10px', borderLeft: '4px solid #a78bfa' }}>
                <p style={{ color: '#94a3b8', margin: '0 0 10px 0' }}>AI Trend</p>
                <h2 style={{ margin: 0, fontSize: '24px' }}>{stockData.trend}</h2>
              </div>
            </div>

            {/* ग्राफ सेक्शन */}
            <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '10px', height: '350px' }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#f8fafc' }}>{stockData.symbol} - 1 Month Chart</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stockData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis domain={['auto', 'auto']} stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#38bdf8' }}
                  />
                  <Line type="monotone" dataKey="price" stroke="#38bdf8" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* एक्सप्लेनेशन (Analysis) */}
            <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '10px', borderLeft: '4px solid #facc15' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#facc15' }}>🤖 AI Analysis & Explanation</h3>
              <p style={{ color: '#cbd5e1', lineHeight: '1.6', margin: 0, fontSize: '16px' }}>
                {stockData.explanation}
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default App