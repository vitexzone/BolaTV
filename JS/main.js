const API_KEY = "8223a39e6bf37a7895d9e819386d342e";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const campoPesquisa = document.getElementById("campoPesquisa");
const botaoPesquisa = document.getElementById("botaoPesquisa");
const filmesGrid = document.getElementById("filmesGrid");

const inicio = document.getElementById("inicio");
const filmes = document.getElementById("filmes");
const series = document.getElementById("series");
const botaoTema = document.getElementById("botaoTema");
const params = new URLSearchParams(window.location.search);
const tipo = params.get("tipo");

botaoTema.addEventListener("click", () => {
    document.body.classList.toggle("tema-claro");
});

async function requisicaoURL(url) {
  try {
    filmesGrid.classList.add("fade-out"); 

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Erro na requisição");
    }

    const data = await response.json();
    
    setTimeout(() => {
        renderizarMidia(data.results);
        filmesGrid.classList.remove("fade-out");
        filmesGrid.classList.add("fade-in");
        
        setTimeout(() => {
            filmesGrid.classList.remove("fade-in");
        }, 300);
    }, 200);

  } catch (error) {
    console.error("Erro:", error);
    filmesGrid.innerHTML = "<p>Não foi possível buscar as informações.</p>";
  }
}

function renderizarMidia(filmes) {
  filmesGrid.innerHTML = "";

  if (!filmes || filmes.length === 0) {
    filmesGrid.innerHTML = "<p>Nenhum resultado encontrado.</p>";
    return;
  }

  filmes.forEach((filme) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const imagem = filme.poster_path ? IMAGE_URL + filme.poster_path : "";
    const titulo = filme.title || filme.name;
    const sinopse = filme.overview ? `<p>${filme.overview.substring(0, 50)}...</p>` : ""; 
    card.innerHTML = `
      <img src="${imagem}" alt="${titulo}">
      <h3>${titulo}</h3>
      ${sinopse}
    `;
    card.addEventListener("click", () => {
      window.location.href = `pages/detalhes.html?id=${filme.id}&type=${filme.media_type || 'movie'}`;
    });

    filmesGrid.appendChild(card);
  });
}

function pesquisaGeral() {
  const info = campoPesquisa.value.trim();
  if (info === "") {
    carregarTendenciasGeral();
    return;
  }
  const url = `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(info)}&language=pt-BR`;
  requisicaoURL(url);
  campoPesquisa.value = "";
}

function buscaFilme() {
  const url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=pt-BR`;
  requisicaoURL(url);
}

function buscaSerie() {
  const url = `${BASE_URL}/trending/tv/week?api_key=${API_KEY}&language=pt-BR`;
  requisicaoURL(url);
}

function carregarTendenciasGeral() {
  const url = `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=pt-BR`;
  requisicaoURL(url);
}

botaoPesquisa.addEventListener("click", pesquisaGeral);
campoPesquisa.addEventListener("keydown", function (event) {
  if (event.key === "Enter") pesquisaGeral();
});

document.addEventListener("DOMContentLoaded", carregarTendenciasGeral);
inicio.addEventListener("click", carregarTendenciasGeral);
filmes.addEventListener("click", buscaFilme);
series.addEventListener("click", buscaSerie);
carregarGeneros();
document.getElementById("filtroGenero").addEventListener("change",filtrarPorGenero);

window.addEventListener("load", function(){
    const loader = document.getElementById("loader");
    if (loader) {
        loader.style.transition = "opacity 0.5s ease";
        loader.style.opacity = "0";
        setTimeout(() => {
            loader.style.display = "none";
        }, 500);
    }
});

  async function carregarGeneros(tipo = "movie") {
    const response = await fetch(
      `${BASE_URL}/genre/${tipo}/list?api_key=${API_KEY}&language=pt-BR`
    );
    const data = await response.json();
    const select = document.getElementById("filtroGenero");
    select.innerHTML = `<option value="">Todos</option>`;
    data.genres.forEach(genero => {
      const option = document.createElement("option");
      option.value = genero.id;
      option.textContent = genero.name;
      select.appendChild(option);
    });
  }

  function filtrarPorGenero() {
    const generoId = document.getElementById("filtroGenero").value;
    if (!generoId) {
      carregarTendenciasGeral();
      return;
    }
    let endpoint = "movie";
    if (tipo === "serie") {
      endpoint = "tv";
    }
    const url = `${BASE_URL}/discover/${endpoint}?api_key=${API_KEY}&with_genres=${generoId}&language=pt-BR`;
    requisicaoURL(url);
  }