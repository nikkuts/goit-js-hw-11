import { Notify } from "../node_modules/notiflix/build/notiflix-notify-aio";
import axios from "axios";

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '34609745-6210b6673efcd8b597eeb5954';
const ref = {
    form: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
};

ref.form.addEventListener('submit', onChooseFoto);

async function fetchFoto (q) {
    return await axios.get(`${BASE_URL}/?key=${KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true`);
};

async function onChooseFoto (event) {
    event.preventDefault();
    ref.gallery.innerHTML = '';

    const searchQuery = event.currentTarget.elements.searchQuery.value.trim(); 
    console.log(searchQuery);
    if (!searchQuery) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        return;
    }
    try {
        const {data} = await fetchFoto (searchQuery); console.log(data);
        if (data.hits.length === 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        return;   
        }
        renderMarcup (data.hits);
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
        <a href='${largeImageURL}'>
            <div class="photo-card">
                <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
        </a>
        `;
        return ref.gallery.insertAdjacentHTML('beforeend', marcup);
    });
};