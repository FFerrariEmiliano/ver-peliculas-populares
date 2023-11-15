const localID = localStorage.getItem("movie-id")
const movieResult = document.getElementById("movie-result")

const apiKey = "97d882774d80c0b048b5ce2fdf5d292b"

var pageLoaded = 1


const loadStorage = async ()=>{
    try {
        const localResult = await fetch(`https://api.themoviedb.org/3/movie/${localID}?api_key=${apiKey}&language=es-AR`)
        .then(response => response.json())
        const poster = document.getElementById("poster")
        poster.src = `https://tmdb.org/t/p/w500/${localResult.poster_path}`
        poster.alt = `${localResult.title}-path`
        const spanAVNum = document.getElementById("span-av-num")
        spanAVNum.textContent = localResult.vote_average.toFixed(1)
        spanAVNum.title = `${localResult.vote_count} votos`
        const publicationDate = document.getElementById("publication-date")
        publicationDate.textContent = localResult.release_date
        const country = document.getElementById("country")
        country.textContent = `${localResult.runtime} Min.`
        const movieTitle = document.getElementById("movie-title")
        movieTitle.textContent = localResult.title
        const tagLine = document.getElementById("tagline")
        tagLine.textContent = localResult.tagline
        const movieDesc = document.getElementById("movie-desc")
        movieDesc.textContent = localResult.overview
        if (movieDesc.textContent == "") {
            movieDesc.textContent = "Sin descripción"
        }
        const movieTitleClass = document.querySelectorAll(".movie-title")
        movieTitleClass.forEach(title =>{
            title.textContent = localResult.title
        })
    } catch (error) {
        console.log(error);
    }
}

loadStorage()

const loadTrailer = async ()=>{
    try{
        const objectResult = await fetch(`https://api.themoviedb.org/3/movie/${localID}/videos?api_key=${apiKey}&language=es-AR`)
        .then(response => response.json())
        const video = objectResult.results.find(trailer => (trailer.key && trailer.site === "YouTube" && trailer.type === "Trailer"));
        if (video) {
            if (video.site === "YouTube" && video.type === "Trailer") {
                const trailerLink = document.getElementById("trailer-link");
                trailerLink.href = `https://www.youtube.com/watch?v=${video.key}`;
                trailerLink.style.display = "flex"
            } 
        }
    } catch (error){
        console.log(error);
    }
}

loadTrailer()

const sectionSimilars = document.getElementById("similares")
const divSimilarsCont = document.getElementById("similars")

const loadSim = async ()=>{
    try {
        const similars = await fetch(`https://api.themoviedb.org/3/movie/${localID}/similar?api_key=97d882774d80c0b048b5ce2fdf5d292b&language=es-AR&page=${pageLoaded}`)
        .then(response => response.json())
        similars.results.forEach(movie => {
            const fragment = new DocumentFragment()
            const movieCont = document.createElement("div")
            movieCont.classList.add("simCont")
            const imgSimilar = document.createElement("img")
            if (!movie.poster_path) {
                imgSimilar.src = "../not-found.png"
            } else {
                imgSimilar.src = `https://tmdb.org/t/p/w500/${movie.poster_path}`
            }
            imgSimilar.alt = movie.title
            imgSimilar.classList.add("simPath")
            imgSimilar.addEventListener("click", ()=>{
                localStorage.setItem("movie-id", movie.id)
                console.log("hiciste click bro");
                window.open("../selected/selected.html", "_self")
            })
            
            movieCont.appendChild(imgSimilar)
            fragment.appendChild(movieCont)
            sectionSimilars.appendChild(fragment)
        })
        
    } catch (error) {
        console.log(error);
    }
}

loadSim()