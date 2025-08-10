import { Article, PriceHistory } from '@/types/article';

const ARTICLES_KEY = 'sales_tracker_articles';

export const getArticles = async (): Promise<Article[]> => {
  try {
    const data = localStorage.getItem(ARTICLES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading articles:', error);
    return [];
  }
};

export const getSoldArticles = async (): Promise<Article[]> => {
  const articles = await getArticles();
  return articles.filter(article => article.sold);
};

export const addArticle = async (article: Omit<Article, 'id'>): Promise<void> => {
  try {
    const articles = await getArticles();
    const newArticle: Article = {
      ...article,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    articles.push(newArticle);
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
  } catch (error) {
    console.error('Error adding article:', error);
    throw error;
  }
};

export const updateArticle = async (updatedArticle: Article): Promise<void> => {
  try {
    const articles = await getArticles();
    const index = articles.findIndex(article => article.id === updatedArticle.id);
    if (index !== -1) {
      articles[index] = updatedArticle;
      localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
    }
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
};

export const deleteArticle = async (articleId: string): Promise<void> => {
  try {
    const articles = await getArticles();
    const filteredArticles = articles.filter(article => article.id !== articleId);
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(filteredArticles));
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
};

export const addPriceHistory = async (
  articleId: string, 
  price: number, 
  type: PriceHistory['type']
): Promise<void> => {
  try {
    const articles = await getArticles();
    const articleIndex = articles.findIndex(article => article.id === articleId);
    
    if (articleIndex !== -1) {
      const newPriceEntry: PriceHistory = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        price,
        date: new Date().toISOString(),
        type,
      };
      
      articles[articleIndex].priceHistory.push(newPriceEntry);
      localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
    }
  } catch (error) {
    console.error('Error adding price history:', error);
    throw error;
  }
};

export const updateArticlePrice = async (
  articleId: string, 
  newPrice: number
): Promise<void> => {
  try {
    const articles = await getArticles();
    const articleIndex = articles.findIndex(article => article.id === articleId);
    
    if (articleIndex !== -1) {
      articles[articleIndex].salePrice = newPrice;
      await addPriceHistory(articleId, newPrice, 'update');
      localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
    }
  } catch (error) {
    console.error('Error updating article price:', error);
    throw error;
  }
};