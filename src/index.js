import Notiflix from 'notiflix';
import {searchService} from "./js/service.js";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let currentPage = 1;
let quantityImg = 0;
const galleryMarkup = new SimpleLightbox('.gallery a');   
const refs = {
                form: document.querySelector('.search-form'),
             gallery: document.querySelector('.gallery'),
             btnLoadMore: document.querySelector('.load-more')
}
const {form,gallery,btnLoadMore} = refs;



btnLoadMore.classList.add('is-hidden');
btnLoadMore.addEventListener('click',handlerClick);
gallery.addEventListener('click',markupCard);
form.addEventListener('submit',handlerSubmit)

async function handlerSubmit(evt) {
    evt.preventDefault();
    gallery.innerHTML = '';
    const {searchQuery} = evt.currentTarget.elements;
    localStorage.setItem('input-value', searchQuery.value);
    if (!searchQuery.value) {
        return  Notiflix.Notify.info('Enter your search details.');
    }
    try {
        const data = await searchService(currentPage,searchQuery.value);
        quantityImg += data.hits.length;    
        gallery.insertAdjacentHTML('beforeend',createMarkup(data.hits));
if (data.totalHits !== 0) {
    Notiflix.Notify.info(`"We found ${data.totalHits} images."`);
}
if (data.totalHits > quantityImg) {
   btnLoadMore.classList.remove('is-hidden');
  }
  if (gallery) {
    const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
  }
 
    }
    catch(err) {
        Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.',
        {
        width: '500px',
        position: 'center-top',
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
     
      finally    {
        galleryMarkup.refresh();
     }

}
async function markupCard(evt) {
    evt.preventDefault();
    gallery.next();
  }
  

function createMarkup(arr) {
    return arr.map( ({webformatURL,largeImageURL,tags,likes,views,comments,downloads,}) => {
          return `<div class ="photo-card"> 
         <a class="gallery-link" href="${largeImageURL}"> 
         <img src="${webformatURL}" alt="${tags}" loading="lazy"  max-width=600px/>
         <div class="info">
         <p class="info-likes">
           <b>Likes: ${likes} </b>
         </p>
         <p class="info-views">
           <b>Views: ${views} </b>
         </p>
         <p class="info-comments">
           <b>Comments: ${comments}</b>
         </p>
         <p class="info-downloads">
           <b>Downloads: ${downloads} </b>
         </p>
       </div>
         </a>
      </div>`;
        }
      )
      .join('');
  }

  async function handlerClick(evt)
  {
    try {
        const value = localStorage.getItem('input-value');
        console.log(value);
        currentPage += 1;
        const data = await searchService (currentPage,value);
        quantityImg += data.hits.length;
        const cardsCreate = createMarkup(data.hits);
        gallery.insertAdjacentHTML('beforeend',cardsCreate);
        if (data.hits.length < 40) {
            btnLoadMore.classList.add('is-hidden');
            Notiflix.Notify.info("Sorry, but you've reached the end of search results.");
        }
    }
    catch (err) {
        Notiflix.Notify.info(err.message)
    }
    finally {
        galleryMarkup.refresh();
    }
  }