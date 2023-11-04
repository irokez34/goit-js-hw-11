import axios from 'axios';
import Notiflix from 'notiflix';
export {searchService};

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '40461470-66901caa62e5925b557392cc4';

async function searchService(currentPage, searchQuery) {
    const parameters = new URLSearchParams({
      key: API_KEY,
      image_type: `photo`,  
      orientation: `horizontal`,
      safesearch: `true`,
      per_page: '20',
      q: searchQuery,
      page: currentPage,
    });
    try
    {
      const resp = await axios.get(`${BASE_URL}?${parameters}`)
      if (!resp.status === 200) {
        throw new Error();
      }
      return resp.data;
    }
    catch(err) {
  Notiflix.Notify.info(`Error:${resp.status}.`,
  {
  width: '500px',
  position: 'center-top',
  distance: '10px',
  opacity: 1,
  timeout: 2000,
  cssAnimation: true,
  cssAnimationDuration: 900,
  info: {
    background: 'black',
    notiflixIconColor: 'red',
  },
});
}  
}



