import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const formaEl = document.querySelector('.search-form')
const galleryEl= document.querySelector('.gallery')
let page =1

formaEl.addEventListener('submit', onSubmit)
window.addEventListener('scroll', onScroll)


function onSubmit(e){
    e.preventDefault();
    galleryEl.innerHTML ='';
    page=1;

    onFetch().then(images =>{
      onCheck(images)
      onRender(images)
    })
    // e.currentTarget.reset();
}



function onScroll(e){
  const documentRec = document.querySelector(".gallery").getBoundingClientRect();

    console.log(page)
    
  if(documentRec.bottom < document.documentElement.clientHeight + 200){
    page += 1
    console.log(page)
    onFetch().then(onRender)
  }
  console.log(documentRec.bottom, document.documentElement.clientHeight)
  if(documentRec.bottom < document.documentElement.clientHeight){
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }
}



function onFetch(){
  const BASE_URL = 'https://pixabay.com/api/'
  const options = new URLSearchParams ({
      key: '33483798-cfc94c7459e9d93c6a5457b44',
      q: formaEl.elements.searchQuery.value,
      orientation: 'horizontal',
      safesearch : true,
      per_page: 40,
  })

  return fetch(`${BASE_URL}?${options}&page=${page}`).then(response => response.json())
}


function onRender(images){
  let render =''

images.hits.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
    render+=`<a href='${largeImageURL}'><div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
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
})
galleryEl.insertAdjacentHTML('beforeend', render)
new SimpleLightbox('.gallery a').refresh();
}



function onCheck(images){
  if(images.totalHits === 0){
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    galleryEl.innerHTML = '';
    return
  }else{
    Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
  }
}

