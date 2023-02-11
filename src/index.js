import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';

const formaEl = document.querySelector('.search-form');
const galleryEl= document.querySelector('.gallery');

const slider = new SimpleLightbox('.gallery a');

let page = 1;
let limit =0;

formaEl.addEventListener('submit', onSubmit);

async function onSubmit(e){
  e.preventDefault();

  galleryEl.innerHTML ='';
  page=1;
  

  const res = await onFetch();
  limit=res.data.totalHits

  onCheck(res.data);
  onRender(res.data);

  // варіант then()
  // onFetch().then(images =>{
  //   onCheck(images)
  //   onRender(images)
  // })
  imageObserver.observe(galleryEl.lastElementChild)
}


const imageObserver = new IntersectionObserver(async ([entry], obsorver)=>{

  if(limit <= galleryEl.children.length){
    galleryEl.insertAdjacentHTML('beforeend',`<p class='end_galerry'>We're sorry, but you've reached the end of search results.</p>`)
    // Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    obsorver.unobserve(entry.target)
    return
  }
  
  if(entry.isIntersecting){
    page+=1
    let resp = await onFetch()
    obsorver.unobserve(entry.target)
    onRender(resp.data)
    imageObserver.observe(galleryEl.lastElementChild)
  }
},
{rootMargin: '150px',}
)

async function onFetch(){
  const BASE_URL = 'https://pixabay.com/api/';
  const options = new URLSearchParams ({
      key: '33483798-cfc94c7459e9d93c6a5457b44',
      q: formaEl.elements.searchQuery.value,
      orientation: 'horizontal',
      safesearch : true,
      per_page: 40,
  });

    try {
      const response = await axios.get(`${BASE_URL}?${options}&page=${page}`);
      return response;
    }catch (error){
      Notiflix.Notify.failure('Помилка виклика');
    }
      
  // варіант then()
  // return fetch(`${BASE_URL}?${options}&page=${page}`).then(response => response.json())
};
function onRender(images){
  let render ='';

images.hits.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
    render+=`<a href='${largeImageURL}'class='link-slider'>
    <div class="photo-card">
    <div class='thumb_image'><img src="${webformatURL}" alt="${tags}" loading="lazy"/></div>
    
    <div class="info">
      <p class="info-item">
        <b>Likes</b><span>${likes}</span>
      </p>
      <p class="info-item">
        <b>Views</b><span>${views}</span>
      </p>
      <p class="info-item">
        <b>Comments</b><span>${comments}</span>
      </p>
      <p class="info-item">
        <b>Downloads</b><span>${downloads}</span>
      </p>
    </div>
  </div>
  </a>`
});
galleryEl.insertAdjacentHTML('beforeend', render);
slider.refresh();
};
function onCheck(res){
  if(res.totalHits === 0){
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    galleryEl.innerHTML = '';
  }else{
    Notiflix.Notify.success(`Hooray! We found ${res.totalHits} images.`);
  };
};