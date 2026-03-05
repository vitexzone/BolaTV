const API_KEY = "8223a39e6bf37a7895d9e819386d342e";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const detalhesContainer = document.getElementById("detalhesContainer");
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const type = params.get("type");

const botaoTema = document.getElementById("botaoTema");
if (botaoTema) {
    botaoTema.addEventListener("click", () => {
        document.body.classList.toggle("tema-claro");
    });
}

async function carregarDetalhes() {
    if (!id || !type) {
        detalhesContainer.innerHTML = "<p>Conteúdo inválido.<p>";
        return;
    }
    try {
        const response = await fetch(
            `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=pt-BR&append_to_response=videos`
        );
        if (!response.ok) {
            throw new Error("Erro na API");
        }
        const data = await response.json();
        renderizarDetalhes(data);
    } catch (error) {
        detalhesContainer.innerHTML = "<p>Erro ao carregar detalhes.</p>";
        console.error(error);
    }
}

function renderizarDetalhes(item) {
    const imagem = item.poster_path ? IMAGE_URL + item.poster_path : "";
    const titulo = item.title || item.name;
    const dataLancamento = item.release_date || item.first_air_date;

    const video = item.videos.results.find(v => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"));
    const trailerEmbed = video 
        ? `<div class="video-container">
             <iframe src="https://www.youtube.com/embed/${video.key}" frameborder="0"</iframe>
           </div>` 
        : "<br><p>Trailer não disponível.</p>";

    document.title = titulo;

    detalhesContainer.innerHTML = `
        <div class="detalhes-layout">
            <div class="detalhes-imagem">
                <img src="${imagem}" alt="${titulo}">
            </div>

            <div class="detalhes-info">
                <h2>${titulo}</h2> <br>
                <p><strong>Ano:</strong> ${dataLancamento ? dataLancamento.split('-')[0] : "Não disponível"}</p> <br>
                <p><strong>Avaliação:</strong> ⭐ ${item.vote_average.toFixed(1)}</p> <br>
                <p><strong>Sinopse:</strong> ${item.tagline ? `<em>"${item.tagline}"</em><br>` : ""}${item.overview}</p> <br>
                
                <h3>Trailer Oficial</h3>
                ${trailerEmbed}
            </div>
        </div>
    `; 
}

document.addEventListener("DOMContentLoaded", carregarDetalhes);