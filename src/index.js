import'./css/styles.css';
import { Notify } from "../node_modules/notiflix/build/notiflix-notify-aio";
import axios from "axios";

const ref = {
    form: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    btnLoadMore: document.querySelector('.load-more'),
};
let searchQuery = '';
let numberPage = 1;
const perPage = 40;

ref.form.addEventListener('submit', onSearch);
ref.btnLoadMore.addEventListener('click', onLoadMore);

async function fetchFoto (query, number) {
    const BASE_URL = 'https://pixabay.com/api/';
    const params = new URLSearchParams({
        key: '34609745-6210b6673efcd8b597eeb5954',
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: perPage,
        page: number,
    });
    return await axios.get(`${BASE_URL}/?${params}`);
};

async function onSearch (event) {
    event.preventDefault();
    ref.gallery.innerHTML = '';
    searchQuery = event.currentTarget.elements.searchQuery.value.trim(); 
    
    if (!searchQuery) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        return;
    }
    try {
        const {data} = await fetchFoto (searchQuery, 1); console.log(data);
        if (data.hits.length === 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        return;   
        }
        renderMarcup (data.hits);
        ref.btnLoadMore.style.display = 'block';
    } 
    catch (error) {
        Notiflix.Notify.failure("ERROR Sorry, there are no images matching your search query. Please try again.");
        console.log(error.message);        
    }
};

function renderMarcup (images) {
    images.map(({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads
    }) => {
        const marcup =
        `
        <div class="photo-card">
            <a href='${largeImageURL}'>
                <img src="${webformatURL}" alt="${tags}" loading="lazy" width = 100% />
            </a>
            <div class="info">
                <p class="info-item">
                    <b>Likes</b>
                    <span>${likes}</span>
                </p>
                <p class="info-item">
                    <b>Views</b>
                    <span>${views}</span>
                </p>
                <p class="info-item">
                    <b>Comments</b>
                    <span>${comments}</span>
                </p>
                <p class="info-item">
                    <b>Downloads</b>
                    <span>${downloads}</span>
                </p>                    
            </div>
        </div>
        `;
        return ref.gallery.insertAdjacentHTML('beforeend', marcup);
    });
};

// async function onLoadMore (event) {
//     numberPage += 1; 

//     try {
//         const {data} = await fetchFoto (searchQuery, numberPage); console.log(data);
//         // if (data.hits.length === 0) {
//         //     Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
//         //     return;   
//         // }
//         if (numberPage * perPage <= data.totalHits || data.hits.length !== 0) {
//             renderMarcup (data.hits);
//             ref.btnLoadMore.style.display = 'block'; return;   
//         }
//             ref.btnLoadMore.style.display = 'none';
//             Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
//     } 
//     catch (error) {
//         Notiflix.Notify.failure("ERROR Sorry, there are no images matching your search query. Please try again.");
//         console.log(error.message);        
//     }    
// };

async function onLoadMore (event) {
    numberPage += 1; 

    try {
        const {data} = await fetchFoto (searchQuery, numberPage); console.log(data);

        if (numberPage * perPage > data.totalHits) {
            ref.btnLoadMore.style.display = 'none';
            Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
            return;   
        }
            renderMarcup (data.hits);
            ref.btnLoadMore.style.display = 'block';   
    } 
    catch (error) {
        Notiflix.Notify.failure("ERROR Sorry, there are no images matching your search query. Please try again.");
        console.log(error.message);        
    }    
};