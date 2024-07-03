const isMobile = window.matchMedia("only screen and (max-width: 768px)").matches;
const apoiadorSelect = document.getElementById('apoiador');
const partidosSelect = document.getElementById('partidos');
const estadosSelect = document.getElementById('estados');
const parlamentaresList = document.getElementById('parlamentares-list');
const modal = document.getElementById('myModal');
const modalBody = document.getElementById('modal-body');
const spanClose = document.getElementsByClassName('close')[0];

async function fetchData() {
    try {
        const response = await fetch('lista.json');
        const data = await response.json();
        populateSelectOptions(data);
        displayData(data);
        
        apoiadorSelect.addEventListener('change', () => filterAndDisplayData(data));
        partidosSelect.addEventListener('change', () => filterAndDisplayData(data));
        estadosSelect.addEventListener('change', () => filterAndDisplayData(data));
    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
    }
}

function populateSelectOptions(data) {
    const apoiadorOptions = [...new Set(data.map(item => item.assinou))];
    const partidoOptions = [...new Set(data.map(item => item.partido))];
    const estadoOptions = [...new Set(data.map(item => item.estado))];

    apoiadorOptions.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        apoiadorSelect.appendChild(opt);
    });

    partidoOptions.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        partidosSelect.appendChild(opt);
    });

    estadoOptions.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        estadosSelect.appendChild(opt);
    });
}

function filterAndDisplayData(data) {
    const selectedApoiador = apoiadorSelect.value;
    const selectedPartido = partidosSelect.value;
    const selectedEstado = estadosSelect.value;

    const filteredData = data.filter(item => {
        return (selectedApoiador === "" || item.assinou === selectedApoiador) &&
               (selectedPartido === "" || item.partido === selectedPartido) &&
               (selectedEstado === "" || item.estado === selectedEstado);
    });

    displayData(filteredData);
}

function displayData(filteredData) {
    parlamentaresList.innerHTML = '';

    if (filteredData.length === 0) {
        const noResultDiv = document.createElement('div');
        noResultDiv.className = 'nenhum-encontrado';
        noResultDiv.textContent = 'Nenhum parlamentar encontrado';
        parlamentaresList.appendChild(noResultDiv);
    } else {
        // Ordenar os dados pelo nome do parlamentar
        filteredData.sort((a, b) => a.parlamentar.localeCompare(b.parlamentar));
        
        filteredData.forEach(item => {
            const div = document.createElement('div');
            div.className = 'parlamentar';
            div.innerHTML = `<div><p class="${item.assinou === 'Sim' ? 'assinou' : 'nao-assinou'}">${item.assinou}</p></div>
                             <p>${item.parlamentar}</p>
                             <p class="desktop">${item.email}</p>
                             <p class="desktop">${item.telefone}</p>
                             <p>${item.partido}</p>
                             <p class="desktop">${item.estado}</p>`;
            // Adicionar evento apenas se for dispositivo móvel
            if (isMobile) {
                div.addEventListener('click', () => showModal(item));
            }
            parlamentaresList.appendChild(div);
        });
    }
}

function showModal(item) {
    modalBody.innerHTML = `<div><strong>Assinou:</strong> <p>${item.assinou}</p></div>
                           <div><strong>Parlamentar:</strong> <p>${item.parlamentar}</p></div>
                           <div><strong>Partido:</strong> <p>${item.partido}</p></div>
                           <div><strong>Estado:</strong> <p>${item.estado}</p></div>`;
    modal.style.display = "flex";
}

// Fechar o modal quando o usuário clica no "X" ou fora dele
spanClose.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Initialize the data fetch and populate the selects
fetchData();
