const localID = localStorage.getItem("movie-id")
const movieResult = document.getElementById("movie-result")

var pageLoaded = 1

const loadStorage = async (movieID)=>{
    try {
        const localResult = await fetch(`https://api.themoviedb.org/3/movie/${movieID}?api_key=97d882774d80c0b048b5ce2fdf5d292b&language=es-AR`)
        .then(response => response.json())
        console.log(localResult);
        const fragment = document.createDocumentFragment()

        const path = document.createElement("div")
        path.setAttribute("id", "path")
        
        const poster = document.createElement("img")
        poster.setAttribute("id", "poster")
        poster.setAttribute("src", `https://tmdb.org/t/p/w500/${localResult.poster_path}`)
        poster.setAttribute("alt", `${localResult.title}-path`)
        const spanAV = document.createElement("span")
        spanAV.setAttribute("id", "average-vote")
        const spanAVNum = document.createElement("p")
        spanAVNum.setAttribute("id", "span-av-num")
        spanAVNum.textContent = localResult.vote_average.toFixed(1)
        spanAVNum.title = `${localResult.vote_count} votos`
        spanAV.appendChild(spanAVNum) 
        const publicationDate = document.createElement("p")
        publicationDate.setAttribute("id", "publication-date")
        publicationDate.textContent = localResult.release_date
        const country = document.createElement("p")
        country.setAttribute("id", "country")
        country.textContent = `${localResult.runtime} Min.`
        
        path.appendChild(poster)
        path.appendChild(spanAV)
        path.appendChild(publicationDate)
        path.appendChild(country)
        
        const desc = document.createElement("div")
        desc.setAttribute("id", "desc")
        
        const movieTitle = document.createElement("h2")
        movieTitle.setAttribute("id", "movie-title")
        movieTitle.textContent = localResult.title
        const tagLine = document.createElement("h3")
        tagLine.setAttribute("id", "tagline")
        tagLine.textContent = localResult.tagline
        const movieDesc = document.createElement("p")
        movieDesc.setAttribute("id", "movie-desc")
        // pruebas______________________________________________-------------
        movieDesc.textContent = localResult.overview
        if (movieDesc.textContent == "") {
            movieDesc.textContent = "Sin descripción"
        }
        desc.appendChild(movieTitle)
        desc.appendChild(tagLine)
        desc.appendChild(movieDesc)
        
        fragment.appendChild(path)
        fragment.appendChild(desc)
        
        movieResult.appendChild(fragment)
        
        const movieTitleClass = document.querySelectorAll(".movie-title")
        movieTitleClass.forEach(title =>{
            title.textContent = localResult.title
        })



    } catch (error) {
        console.log(error);
    }
}

loadStorage(localID)

const sectionSimilars = document.getElementById("similares")
const divSimilarsCont = document.getElementById("similars")

const loadSim = async (movieID, pageNum)=>{
    try {
        const similars = await fetch(`https://api.themoviedb.org/3/movie/${movieID}/similar?api_key=97d882774d80c0b048b5ce2fdf5d292b&language=es-AR&page=${pageNum}`)
        .then(response => response.json())
        console.log(similars);
        similars.results.forEach(movie => {
            const fragment = new DocumentFragment()
            const movieCont = document.createElement("div")
            movieCont.classList.add("simCont")
            movieCont.addEventListener("mouseenter", ()=>{
                localStorage.setItem("movie-id", `${movie.id}`)
            })
            const imgSimilar = document.createElement("img")
            if (!movie.poster_path) {
                imgSimilar.src = "../not-found.png"
            } else {
                imgSimilar.src = `https://tmdb.org/t/p/w500/${movie.poster_path}`
            }
            imgSimilar.alt = movie.title
            imgSimilar.classList.add("simPath")
            imgSimilar.addEventListener("click", ()=>{
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

loadSim(localID, pageLoaded)