import AsyncStorage from '@react-native-async-storage/async-storage';
import { Article, PriceHistory } from '@/types/article';

const ARTICLES_KEY = '@vinted_manager_articles';

export const getArticles = async (): Promise<Article[]> => {
  try {
    const data = await AsyncStorage.getItem(ARTICLES_KEY);
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
    await AsyncStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
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
      await AsyncStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
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
    await AsyncStorage.setItem(ARTICLES_KEY, JSON.stringify(filteredArticles));
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
      await AsyncStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
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
      await AsyncStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
    }
  } catch (error) {
    console.error('Error updating article price:', error);
    throw error;
  }
};