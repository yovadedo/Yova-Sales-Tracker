import { useState } from 'react'
import { Package, TrendingUp, Plus } from 'lucide-react'
import StockScreen from './components/StockScreen'
import AddScreen from './components/AddScreen'
import AnalyticsScreen from './components/AnalyticsScreen'
import './App.css'

type Tab = 'stock' | 'add' | 'analytics'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('stock')

  const renderContent = () => {
    switch (activeTab) {
      case 'stock':
        return <StockScreen />
      case 'add':
        return <AddScreen onClose={() => setActiveTab('stock')} />
      case 'analytics':
        return <AnalyticsScreen />
      default:
        return <StockScreen />
    }
  }

  return (
    <div className="app">
      <main className="main-content">
        {renderContent()}
      </main>
      
      <nav className="tab-bar">
        <button
          className={`tab-button ${activeTab === 'stock' ? 'active' : ''}`}
          onClick={() => setActiveTab('stock')}
        >
          <Package size={24} />
          <span>Stock</span>
        </button>
        
        <button
          className={`tab-button add-button ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          <div className="add-icon">
            <Plus size={24} />
          </div>
          <span>Ajouter</span>
        </button>
        
        <button
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <TrendingUp size={24} />
          <span>Synthèse</span>
        </button>
      </nav>
    </div>
  )
}

export default App