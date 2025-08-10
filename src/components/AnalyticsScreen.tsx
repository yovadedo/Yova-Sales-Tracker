import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react';
import { getSoldArticles } from '@/utils/storage';
import { Article } from '@/types/article';
import './AnalyticsScreen.css';

interface Analytics {
  totalRevenue: number;
  totalProfit: number;
  totalSold: number;
  averageProfit: number;
  weeklyRevenue: number;
  previousWeekRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
}

export default function AnalyticsScreen() {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalRevenue: 0,
    totalProfit: 0,
    totalSold: 0,
    averageProfit: 0,
    weeklyRevenue: 0,
    previousWeekRevenue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
  });
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    calculateAnalytics();
  }, []);

  const calculateAnalytics = async () => {
    const soldArticles = await getSoldArticles();
    
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfPreviousWeek = new Date(startOfWeek);
    startOfPreviousWeek.setDate(startOfPreviousWeek.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

    let totalRevenue = 0;
    let totalPurchaseCost = 0;
    let weeklyRevenue = 0;
    let previousWeekRevenue = 0;
    let monthlyRevenue = 0;
    let yearlyRevenue = 0;

    soldArticles.forEach((article: Article) => {
      const soldDate = new Date(article.soldDate!);
      const revenue = article.salePrice;
      const cost = article.purchasePrice || 0;

      totalRevenue += revenue;
      totalPurchaseCost += cost;

      if (soldDate >= startOfWeek) {
        weeklyRevenue += revenue;
      }

      if (soldDate >= startOfPreviousWeek && soldDate < startOfWeek) {
        previousWeekRevenue += revenue;
      }

      if (soldDate >= startOfMonth) {
        monthlyRevenue += revenue;
      }

      if (soldDate >= startOfYear) {
        yearlyRevenue += revenue;
      }
    });

    const totalProfit = totalRevenue - totalPurchaseCost;
    const averageProfit = soldArticles.length > 0 ? totalProfit / soldArticles.length : 0;

    setAnalytics({
      totalRevenue,
      totalProfit,
      totalSold: soldArticles.length,
      averageProfit,
      weeklyRevenue,
      previousWeekRevenue,
      monthlyRevenue,
      yearlyRevenue,
    });
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)}€`;
  };

  const getRevenueByPeriod = () => {
    switch (selectedPeriod) {
      case 'week':
        return analytics.weeklyRevenue;
      case 'month':
        return analytics.monthlyRevenue;
      case 'year':
        return analytics.yearlyRevenue;
      default:
        return analytics.weeklyRevenue;
    }
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'week':
        return 'Cette semaine';
      case 'month':
        return 'Ce mois';
      case 'year':
        return '12 derniers mois';
      default:
        return 'Cette semaine';
    }
  };

  const weeklyGrowth = analytics.previousWeekRevenue > 0 
    ? ((analytics.weeklyRevenue - analytics.previousWeekRevenue) / analytics.previousWeekRevenue) * 100
    : 0;

  return (
    <div className="analytics-screen">
      <div className="header">
        <h1 className="header-title">Synthèse</h1>
        <p className="header-subtitle">Analyse de votre activité</p>
      </div>

      <div className="content">
        <div className="overview-section">
          <div className="card-row">
            <div className="overview-card revenue-card">
              <div className="card-icon">
                <DollarSign size={24} />
              </div>
              <div className="card-value">{formatCurrency(analytics.totalRevenue)}</div>
              <div className="card-label">Chiffre d'affaires total</div>
            </div>

            <div className="overview-card profit-card">
              <div className="card-icon">
                <TrendingUp size={24} />
              </div>
              <div className="card-value">{formatCurrency(analytics.totalProfit)}</div>
              <div className="card-label">Bénéfices totaux</div>
            </div>
          </div>

          <div className="card-row">
            <div className="overview-card sold-card">
              <div className="card-icon">
                <Package size={24} />
              </div>
              <div className="card-value">{analytics.totalSold}</div>
              <div className="card-label">Articles vendus</div>
            </div>

            <div className="overview-card average-card">
              <div className="card-icon">
                <TrendingUp size={24} />
              </div>
              <div className="card-value">{formatCurrency(analytics.averageProfit)}</div>
              <div className="card-label">Bénéfice moyen</div>
            </div>
          </div>
        </div>

        <div className="period-section">
          <h2 className="section-title">Revenus par période</h2>
          <div className="period-selector">
            {(['week', 'month', 'year'] as const).map((period) => (
              <button
                key={period}
                className={`period-button ${selectedPeriod === period ? 'active' : ''}`}
                onClick={() => setSelectedPeriod(period)}
              >
                {period === 'week' ? 'Semaine' : period === 'month' ? 'Mois' : 'Année'}
              </button>
            ))}
          </div>
        </div>

        <div className="revenue-section">
          <div className="revenue-card">
            <div className="revenue-header">
              <div>
                <div className="revenue-label">{getPeriodLabel()}</div>
                <div className="revenue-value">{formatCurrency(getRevenueByPeriod())}</div>
              </div>
              <div className="growth-indicator">
                {weeklyGrowth >= 0 ? (
                  <TrendingUp size={20} />
                ) : (
                  <TrendingDown size={20} />
                )}
                <span className={`growth-text ${weeklyGrowth >= 0 ? 'positive' : 'negative'}`}>
                  {Math.abs(weeklyGrowth).toFixed(1)}%
                </span>
              </div>
            </div>
            
            {selectedPeriod === 'week' && (
              <div className="comparison-text">
                Semaine précédente: {formatCurrency(analytics.previousWeekRevenue)}
              </div>
            )}
          </div>
        </div>

        <div className="quick-stats-section">
          <h2 className="section-title">Aperçu rapide</h2>
          
          <div className="stat-row">
            <span className="stat-label">Semaine en cours</span>
            <span className="stat-value">{formatCurrency(analytics.weeklyRevenue)}</span>
          </div>
          
          <div className="stat-row">
            <span className="stat-label">Semaine précédente</span>
            <span className="stat-value">{formatCurrency(analytics.previousWeekRevenue)}</span>
          </div>
          
          <div className="stat-row">
            <span className="stat-label">Mois en cours</span>
            <span className="stat-value">{formatCurrency(analytics.monthlyRevenue)}</span>
          </div>
          
          <div className="stat-row">
            <span className="stat-label">12 derniers mois</span>
            <span className="stat-value">{formatCurrency(analytics.yearlyRevenue)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}