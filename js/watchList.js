import { getWatchListArr, addToLocalStorageWatchedArr, removeFromLocalStorageWatchListArr } from './main.js';

let watchListCount = document.querySelector(".watch-list-page > .series-count");
let watchListContent = document.querySelector(".watch-list-page > .content");
let watchListPageMessage = document.querySelector(".watch-list-page > .message");

function addSeriesToWatchListPage() {
    updateNumberOfSeries();
    
    watchListContent.innerHTML = "";

    if (addMessageIfThereAreNoSeries()) return;

    getWatchListArr().forEach((serie) => {
        let serieDiv = document.createElement("div");
        serieDiv.dataset.name = serie.Title;
        serieDiv.dataset.year = serie.Year;
        serieDiv.className = "poster";
        serieDiv.innerHTML = `
            <img src="${serie.Poster}" alt="serie">
            <div class="overlay">
                <div class="control">
                    <span class="watched">Watched</span>
                    <span class="remove">Remove</span>
                </div>
            </div>
        `;

        watchListContent.appendChild(serieDiv);
    })
}

addSeriesToWatchListPage();

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("watch-list-button")) {
        addSeriesToWatchListPage();
    }

    if (e.target.classList.contains("watched")) {
        let overlayEle = e.target.parentNode.parentNode;

        let obj = {
            Poster: overlayEle.previousElementSibling.src,
            Title: overlayEle.parentNode.getAttribute("data-name"),
            Year: overlayEle.parentNode.getAttribute("data-year")
        };

        addToLocalStorageWatchedArr(obj);

        overlayEle.parentNode.remove();
        removeFromLocalStorageWatchListArr(obj);
    }

    if (e.target.classList.contains("remove")) {
        let overlayEle = e.target.parentNode.parentNode;

        let obj = {
            Poster: overlayEle.previousElementSibling.src,
            Title: overlayEle.parentNode.getAttribute("data-name"),
            Year: overlayEle.parentNode.getAttribute("data-year")
        };

        overlayEle.parentNode.remove();
        removeFromLocalStorageWatchListArr(obj);
    }

    updateNumberOfSeries();
    addMessageIfThereAreNoSeries();
});

function updateNumberOfSeries() {
    watchListCount.textContent = `${getWatchListArr().length} Series`;
}

function addMessageIfThereAreNoSeries() {
    if (getWatchListArr().length === 0) {
        watchListPageMessage.classList.add("show");
        return true;
    }
    watchListPageMessage.classList.remove("show");
    return false
}
