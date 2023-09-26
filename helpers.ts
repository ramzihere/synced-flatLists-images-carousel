import { API_KEY } from '@env';
import { API_URL } from './constants';

const fetchImagesFromPexels = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: API_KEY,
      },
    });

    const { photos } = await response.json();
    return photos;
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
};

export { fetchImagesFromPexels };
