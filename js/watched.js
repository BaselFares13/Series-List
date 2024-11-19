import { getWatchedArr, removeFromLocalStorageWatchedArr } from './main.js';

let watchedCount = document.querySelector(".watched-page > .series-count");
let watchedContent = document.querySelector(".watched-page > .content");
let watchedPageMessage = document.querySelector(".watched-page > .message");

function addSeriesToWatchedPage() {
    updateNumberOfSeries();

    watchedContent.innerHTML = "";

    if (addMessageIfThereAreNoSeries()) return;

    getWatchedArr().forEach((serie) => {
        let serieDiv = document.createElement("div");
        serieDiv.dataset.name = serie.Title;
        serieDiv.dataset.year = serie.Year;
        serieDiv.className = "poster";
        serieDiv.innerHTML = `
            <img src="${serie.Poster}" alt="serie">
            <div class="overlay">
                <span class="remove">Remove</span>
            </div>
        `;

        watchedContent.appendChild(serieDiv);
    })
}

addSeriesToWatchedPage();

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("watched-button")) {
        addSeriesToWatchedPage();
    }

    if (e.target.classList.contains("remove")) {
        let overlayEle = e.target.parentNode;

        let obj = {
            Poster: overlayEle.previousElementSibling.src,
            Title: overlayEle.parentNode.getAttribute("data-name"),
            Year: overlayEle.parentNode.getAttribute("data-year")
        };

        overlayEle.parentNode.remove();
        removeFromLocalStorageWatchedArr(obj);

    }

    updateNumberOfSeries();
    addMessageIfThereAreNoSeries();
});

function updateNumberOfSeries() {
    watchedCount.textContent = `${getWatchedArr().length} Series`;
}

function addMessageIfThereAreNoSeries() {
    if (getWatchedArr().length === 0) {
        watchedPageMessage.classList.add("show");
        return true;
    }
    watchedPageMessage.classList.remove("show");
    return false
}
