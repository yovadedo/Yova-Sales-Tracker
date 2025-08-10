import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { addArticle } from '@/utils/storage';
import { Article } from '@/types/article';
import './AddScreen.css';

interface AddScreenProps {
  onClose: () => void;
}

export default function AddScreen({ onClose }: AddScreenProps) {
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [description, setDescription] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setTitle('');
    setBrand('');
    setSize('');
    setDescription('');
    setPurchasePrice('');
    setSalePrice('');
  };

  const handleSubmit = async () => {
    if (!title.trim() || !brand.trim() || !size.trim() || !salePrice.trim()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const salePriceNum = parseFloat(salePrice);
    if (isNaN(salePriceNum) || salePriceNum <= 0) {
      alert('Veuillez entrer un prix de vente valide');
      return;
    }

    const purchasePriceNum = purchasePrice ? parseFloat(purchasePrice) : undefined;
    if (purchasePrice && (isNaN(purchasePriceNum!) || purchasePriceNum! < 0)) {
      alert('Veuillez entrer un prix d\'achat valide');
      return;
    }

    setIsLoading(true);

    try {
      const newArticle: Omit<Article, 'id'> = {
        title: title.trim(),
        brand: brand.trim(),
        size: size.trim(),
        description: description.trim(),
        purchasePrice: purchasePriceNum,
        salePrice: salePriceNum,
        createdAt: new Date().toISOString(),
        sold: false,
        priceHistory: [
          {
            id: Date.now().toString(),
            price: salePriceNum,
            date: new Date().toISOString(),
            type: 'initial',
          },
        ],
      };

      await addArticle(newArticle);
      alert('Article ajouté avec succès !');
      resetForm();
      onClose();
    } catch (error) {
      alert('Impossible d\'ajouter l\'article');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = title && brand && size && salePrice;
  const profit = purchasePrice && salePrice ? parseFloat(salePrice) - parseFloat(purchasePrice) : null;

  return (
    <div className="add-screen">
      <div className="header">
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>
        <h1 className="header-title">Nouvel Article</h1>
        <button 
          className={`save-button ${!isFormValid ? 'disabled' : ''}`}
          onClick={handleSubmit}
          disabled={isLoading || !isFormValid}
        >
          <Check size={24} />
        </button>
      </div>

      <div className="content">
        <div className="section">
          <h2 className="section-title">Informations générales</h2>
          
          <div className="input-group">
            <label className="input-label">Titre *</label>
            <input
              type="text"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Robe d'été fleurie"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Marque *</label>
            <input
              type="text"
              className="input"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Ex: Zara"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Taille *</label>
            <input
              type="text"
              className="input"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="Ex: M, 38, L"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea
              className="input textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez l'article, son état, ses particularités..."
              rows={4}
            />
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Prix</h2>
          
          <div className="price-row">
            <div className="input-group price-input">
              <label className="input-label">Prix d'achat</label>
              <div className="price-input-container">
                <input
                  type="number"
                  className="input"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
                <span className="currency-label">€</span>
              </div>
            </div>

            <div className="input-group price-input">
              <label className="input-label">Prix de vente *</label>
              <div className="price-input-container">
                <input
                  type="number"
                  className="input"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
                <span className="currency-label">€</span>
              </div>
            </div>
          </div>

          {profit !== null && !isNaN(profit) && (
            <div className="profit-indicator">
              <span className="profit-label">Bénéfice potentiel:</span>
              <span className={`profit-value ${profit >= 0 ? 'positive' : 'negative'}`}>
                {profit.toFixed(2)}€
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="footer">
        <button className="cancel-button" onClick={onClose}>
          Annuler
        </button>
        <button
          className={`submit-button ${isLoading || !isFormValid ? 'disabled' : ''}`}
          onClick={handleSubmit}
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? 'Ajout en cours...' : 'Ajouter l\'article'}
        </button>
      </div>
    </div>
  );
}