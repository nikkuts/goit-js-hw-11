import { Notify } from "../node_modules/notiflix/build/notiflix-notify-aio";
import axios from "axios";

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '34609745-6210b6673efcd8b597eeb5954';
const ref = {
    form: document.querySelector('.search-form'),
    input: document.querySelector('input#searchQuery'),
    btn: document.querySelector('button'),
    gallery: document.querySelector('.gallery'),
};

ref.form.addEventListener('submit', onChooseFoto);

async function onChooseFoto (event) {
    event.preventDefault();

    const searchQuery = event.currentTarget.elements.searchQuery.value.trim(); console.log(searchQuery);
    if (!searchQuery) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        return;
    }
    return await axios.get(`${BASE_URL}/?key=${KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true`);
}