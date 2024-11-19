let searchButton = document.querySelector(".search-button");
let searchArea = document.querySelector(".search-area");
let searchingInput = document.querySelector(".search-area > input");
let searchingResultsArea = document.querySelector(".search-area > .results");
let searchingResultsMassage = document.querySelector(".search-area > p");
let watchListSeriesAreaInMainPage = document.querySelector(".watch-list.series-area .series");
let watchedSeriesAreaInMainPage = document.querySelector(".watched.series-area .series");
let watchListAlertMessage = document.querySelector(".watch-list.series-area .message");
let watchedAlertMessage = document.querySelector(".watched.series-area .message");

if (!window.localStorage.getItem("watchList")) {
    window.localStorage.setItem("watchList", "[]");
}

if (!window.localStorage.getItem("watched")) {
    window.localStorage.setItem("watched", "[]");
}

searchButton.onclick = (e) => {
    e.preventDefault();
}

document.addEventListener('click', function (event) {
    if (!searchArea.contains(event.target)) {
        if (searchButton === event.target) {
            searchArea.classList.toggle("show");
        } else {
            searchArea.classList.remove("show");
        }

        setSearchAreaToDefault();
    }
});

searchingInput.oninput = function () {

    if (this.value.trim() !== "") {
        fetch(`https://www.omdbapi.com/?s=${this.value.trim()}&type=series&apikey=ac666d8f`).then((response) => {
            let result = response.json();
            return result;
        }).then((result) => {
            if (result.Response === "True") {
                searchingResultsArea.innerHTML = "";
                searchingResultsMassage.classList.remove("show");

                result.Search.forEach((serie) => {
                    if (serie.Poster != "N/A") {
                        addSerieToSearchResultsArea(serie.Poster, serie.Title, serie.Year);
                    }
                });
            } else {
                searchingResultsArea.innerHTML = "";
                searchingResultsMassage.textContent = result.Error;
                searchingResultsMassage.classList.add("show");
            }
        })
    } else {
        searchingResultsMassage.classList.remove("show");
        searchingResultsArea.innerHTML = "";
    }
}

function addSerieToSearchResultsArea(poster, title, year) {
    let serieDiv = createSerieDiv(poster, title, year);

    addEventToWatchListButton(serieDiv.children[2].children[0], poster, title, year);
    addEventToWatchedButton(serieDiv.children[2].children[1], poster, title, year);

    searchingResultsArea.appendChild(serieDiv);
}

function createSerieDiv(poster, title, year) {
    let serieDiv = document.createElement("div");
    serieDiv.className = "serie";

    serieDiv.innerHTML = `
        <img src="${poster}" alt="serie">
        <div class="info">
            <p class="title">${title}</p>
            <span class="release-year">${year}</span>
        </div>
        <div class="control">
            <span class="watch-list-button">Add To Watch List</span>
            <span class="watched-button">Add To Watched</span>
        </div>
    `;

    return serieDiv;
}

function addEventToWatchListButton(WatchListButton, poster, title, year) {
    WatchListButton.onclick = function () {
        let obj = {
            Title: title,
            Poster: poster,
            Year: year,
        }

        if (isSeriesExisted("watchList", obj.Title)) {
            window.alert("Series Is Already Existed In Watch List !");
        } else {
            addToLocalStorageWatchListArr(obj);
        }
    }
}

function addEventToWatchedButton(WatchedButton, poster, title, year) {
    WatchedButton.onclick = function () {
        let obj = {
            Title: title,
            Poster: poster,
            Year: year,
        }

        if (isSeriesExisted("watched", obj.Title)) {
            window.alert("Series Is Already Existed In Watched !");
        } else {
            addToLocalStorageWatchedArr(obj);
        }
    }
}

function addToLocalStorageWatchListArr(serieObj) {
    let arr = getWatchListArr();
    arr.push(serieObj);

    window.localStorage.setItem("watchList", JSON.stringify(arr));
}
    
export function removeFromLocalStorageWatchListArr(serieObj) {
    let arr = getWatchListArr();

    for (let i = 0; i < arr.length; i++) {
        if (arr[i].Title === serieObj.Title) {
            arr.splice(i, 1);
        }
    }

    window.localStorage.setItem("watchList", JSON.stringify(arr));
}

export function addToLocalStorageWatchedArr(serieObj) {
    let arr = getWatchedArr();
    arr.push(serieObj);

    window.localStorage.setItem("watched", JSON.stringify(arr));
}

export function removeFromLocalStorageWatchedArr(serieObj) {
    let arr = getWatchedArr();

    for (let i = 0; i < arr.length; i++) {
        if (arr[i].Title === serieObj.Title) {
            arr.splice(i, 1);
        }
    }

    window.localStorage.setItem("watched", JSON.stringify(arr));
}

export function getWatchListArr() {
    let arr = JSON.parse(window.localStorage.getItem("watchList"));
    return arr;
};

export function getWatchedArr() {
    let arr = JSON.parse(window.localStorage.getItem("watched"));
    return arr;
};

function isSeriesExisted(In, seriesTitle) {
    switch (In) {
        case "watchList":
            for (let i = 0; i < getWatchListArr().length; i++) {
                if (getWatchListArr()[i].Title === seriesTitle) return true;
            }
            return false;

        
        case "watched":
            for (let i = 0; i < getWatchedArr().length; i++) {
                if (getWatchedArr()[i].Title === seriesTitle) return true;
            }
            return false;
    }
}

function setSearchAreaToDefault() {
    searchingInput.value = "";
    searchingResultsArea.innerHTML = "";
};

function addLast5WatchListSeriesToMainPage() {
    if (watchListSeriesAreaInMainPage) {
        if (getWatchListArr().length === 0) {
            watchListAlertMessage.classList.add("show");
            return;
        }
        watchListAlertMessage.classList.remove("show");

        let lowerIndex = getWatchListArr().length > 5 ? getWatchListArr().length - 5 : 0;

        for (let i = getWatchListArr().length - 1; i >= lowerIndex; i--) {
            let serieDiv = document.createElement("div");
            serieDiv.className = "poster";
            serieDiv.innerHTML = `
                <img src="${getWatchListArr()[i].Poster}" alt="serie">
            `;

            watchListSeriesAreaInMainPage.appendChild(serieDiv);
        }
    }
}

addLast5WatchListSeriesToMainPage();

function addLast5WatchedSeriesToMainPage() {
    if (watchedSeriesAreaInMainPage) {
        if (getWatchedArr().length === 0) {
            watchedAlertMessage.classList.add("show");
            return;
        }
        watchedAlertMessage.classList.remove("show");

        let lowerIndex = getWatchedArr().length > 5 ? getWatchedArr().length - 5 : 0;

        for (let i = getWatchedArr().length - 1; i >= lowerIndex; i--) {
            let serieDiv = document.createElement("div");
            serieDiv.className = "poster";
            serieDiv.innerHTML = `
                <img src="${getWatchedArr()[i].Poster}" alt="serie">
            `;

            watchedSeriesAreaInMainPage.appendChild(serieDiv);
        }
    }
}

addLast5WatchedSeriesToMainPage();