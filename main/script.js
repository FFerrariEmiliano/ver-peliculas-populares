let pagina = 1

const searcher = document.getElementById("movie-search")
const coincidenciasRes = document.getElementById("coincidencias")
const container = document.getElementById("contenedor")

searcher.addEventListener('click', ()=>{
        if (searcher.value.length > 0) {
            LoadSearch(searcher.value)
            container.classList.add("blur")
            }
        });
        
document.addEventListener("click", (e)=>{
    if (e.target.id != "movie-search") {
        coincidenciasRes.classList.add("dissappear")
        container.classList.remove("blur")
    } else {
        coincidenciasRes.classList.remove("dissappear")
        container.classList.add("blur")
    }
})

const LoadSearch = async (query)=>{
    const coincidences = await fetch(`https://api.themoviedb.org/3/search/multi?query=${query}&api_key=97d882774d80c0b048b5ce2fdf5d292b&language=es-AR&page=1`)
    .then(response => response.json())
    const data = coincidences.results
    if (data.length > 0) {
        coincidenciasRes.innerHTML = ""
        let fragment = document.createDocumentFragment()
        const ulOfResult = document.createElement("ul")
        ulOfResult.setAttribute("id", "ul-of-results")
        const arrowUl = document.createElement("span")
        ulOfResult.appendChild(arrowUl)
        arrowUl.classList.add("clip-arrow")
        for (let i = 0; i < 5; i++) {
            if (data[i].title || data[i].name) {
                const listItem = document.createElement("li")
                listItem.classList.add("li-coinc")
                listItem.textContent = `${data[i].title || data[i].name}`
                listItem.addEventListener("click", (e)=>{
                    e.stopPropagation()
                    localStorage.setItem("movie-id", `${data[i].id}`)
                    window.open("../selected/selected.html", "_self")
                })
                listItem.addEventListener("mouseenter", ()=>{
                    localStorage.setItem("movie-id", `${data[i].id}`)
                    console.log(data[i].id);
                })
                ulOfResult.appendChild(listItem)
            }
            
                fragment.appendChild(ulOfResult)
                coincidenciasRes.appendChild(fragment)
            }
    }

}


searcher.addEventListener("input", ()=>{
    if (searcher.value != "") {
        LoadSearch(searcher.value)
    } else {
        coincidenciasRes.innerHTML = ""
    }
})

const loadMovies = async (paginaNum)=>{
    try {
        const respuesta = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=97d882774d80c0b048b5ce2fdf5d292b&language=es-AR&page=${paginaNum}`)

        if (respuesta.status === 200 ) {
            const datos = await respuesta.json()
            let fragment = new DocumentFragment();
            datos.results.forEach(element => {
                let peliculaDiv = document.createElement('div');
                peliculaDiv.classList.add('peliculas');

                let img = document.createElement('img');
                img.src = `https://tmdb.org/t/p/w500/${element.poster_path}`;
                img.classList.add('poster');
                peliculaDiv.appendChild(img);

                let h1 = document.createElement('h1');
                h1.textContent = element.title;
                peliculaDiv.appendChild(h1);

                let overviewDiv = document.createElement('div');
                overviewDiv.classList.add('overview');
                overviewDiv.onclick = ()=>{
                    localStorage.setItem("movie-id", `${element.id}`)
                    window.open("../selected/selected.html", "_self")
                }
                
                overviewDiv.addEventListener("mouseenter", ()=>{
                    localStorage.setItem("movie-id", `${element.id}`)
                })

                let button = document.createElement('a');
                button.id = element.id;
                button.setAttribute("href", "../selected/selected.html")
                button.textContent = 'Más info.';
                overviewDiv.appendChild(button);
                
                peliculaDiv.appendChild(overviewDiv);
                fragment.appendChild(peliculaDiv);
            });
            container.appendChild(fragment);
        } else if (respuesta.status === 401){
            console.log("Wrong key");
        } else if (respuesta.status === 404){
            console.log("The movie doesn't exist");
        }
    } catch (error) {
        console.log(error);
    }
}

// Función de callback
let callback = (entries, observer) => {
    entries.forEach(entry => {
      // Cada 'entry' describe un cambio en la intersección para
      // un elemento observado
      // Aquí puedes realizar acciones en respuesta a estos cambios
      if (entry.isIntersecting) {
        pagina++
        loadMovies(pagina)
      }
    });
  };
  
  // Opciones del observer
  let options = {
    root: null, // El elemento que es usado como viewport (null = viewport del navegador)
    rootMargin: '0px', // Margen alrededor del 'root'
    threshold: 0 // Umbral a partir del cual se considera que el elemento está en la vista
  };
  
  // Creación del observer
  let observer = new IntersectionObserver(callback, options);

  const loadCont = document.getElementById("load-cont")
  observer.observe(loadCont);
  

loadMovies(pagina)


