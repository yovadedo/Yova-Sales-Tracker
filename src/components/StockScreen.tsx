import { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, DollarSign } from 'lucide-react';
import { getArticles, updateArticle, addPriceHistory } from '@/utils/storage';
import { Article } from '@/types/article';
import './StockScreen.css';

export default function StockScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [salePrice, setSalePrice] = useState('');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    const data = await getArticles();
    setArticles(data.filter(article => !article.sold));
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSellArticle = (article: Article) => {
    setSelectedArticle(article);
    setSalePrice(article.salePrice.toString());
    setShowSoldModal(true);
  };

  const confirmSale = async () => {
    if (!selectedArticle || !salePrice) return;

    const finalSalePrice = parseFloat(salePrice);
    if (isNaN(finalSalePrice) || finalSalePrice <= 0) {
      alert('Veuillez entrer un prix de vente valide');
      return;
    }

    const updatedArticle = {
      ...selectedArticle,
      sold: true,
      salePrice: finalSalePrice,
      soldDate: new Date().toISOString(),
    };

    await updateArticle(updatedArticle);
    await addPriceHistory(selectedArticle.id, finalSalePrice, 'sale');
    
    setShowSoldModal(false);
    setSelectedArticle(null);
    setSalePrice('');
    loadArticles();
    
    alert('Article marqué comme vendu !');
  };

  return (
    <div className="stock-screen">
      <div className="header">
        <h1 className="header-title">Mon Stock</h1>
        <p className="header-subtitle">{articles.length} articles</p>
      </div>

      <div className="search-container">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Rechercher un article..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="filter-button">
          <Filter size={20} />
        </button>
      </div>

      <div className="articles-list">
        {filteredArticles.map((article) => (
          <div key={article.id} className="article-card">
            <div className="article-header">
              <div className="article-info">
                <h3 className="article-title">{article.title}</h3>
                <p className="article-brand">{article.brand} • Taille {article.size}</p>
              </div>
              <button className="more-button">
                <MoreVertical size={20} />
              </button>
            </div>
            
            <p className="article-description">{article.description}</p>
            
            <div className="article-footer">
              <div className="price-info">
                {article.purchasePrice && (
                  <p className="purchase-price">
                    Achat: {article.purchasePrice}€
                  </p>
                )}
                <p className="sale-price">Vente: {article.salePrice}€</p>
              </div>
              
              <button
                className="sell-button"
                onClick={() => handleSellArticle(article)}
              >
                <DollarSign size={16} />
                <span>Vendu</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showSoldModal && (
        <div className="modal-overlay" onClick={() => setShowSoldModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Marquer comme vendu</h2>
            <p className="modal-subtitle">{selectedArticle?.title}</p>
            
            <div className="input-container">
              <label className="input-label">Prix de vente final</label>
              <div className="price-input-container">
                <input
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="0.00"
                  className="price-input"
                />
                <span className="currency-label">€</span>
              </div>
            </div>
            
            <div className="modal-buttons">
              <button
                className="cancel-button"
                onClick={() => setShowSoldModal(false)}
              >
                Annuler
              </button>
              <button
                className="confirm-button"
                onClick={confirmSale}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}