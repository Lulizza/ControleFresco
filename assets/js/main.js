document.addEventListener("DOMContentLoaded", () => {
    let todosOsDados = [];

    // 1. Buscar o arquivo CSV
    fetch('dados.csv')
        .then(response => response.text())
        .then(csvText => {
            todosOsDados = parseCSV(csvText);
            
            // Inicia a tela renderizando a categoria padrão (Carnes)
            renderizarCards('Carnes');
            configurarBotoesCategoria();
        })
        .catch(error => console.error("Erro ao carregar o CSV:", error));

    // 2. Função para transformar texto CSV em Array de Objetos JSON
    function parseCSV(str) {
        // Divide por linhas, ignorando linhas vazias
        const linhas = str.split('\n').filter(linha => linha.trim() !== '');
        const cabecalhos = linhas[0].split(',').map(c => c.trim());
        
        return linhas.slice(1).map(linha => {
            const valores = linha.split(',');
            let obj = {};
            cabecalhos.forEach((cabecalho, index) => {
                obj[cabecalho] = valores[index] ? valores[index].trim() : '';
            });
            return obj;
        });
    }

    // 3. Função para gerar o HTML do Card
    function gerarHTMLCard(item) {
        return `
        <div class="card">
            <div class="card-image-container">
                <span class="badge ${item.badge_classe}">${item.badge_texto}</span>
                <img src="${item.imagem}" alt="${item.nome}" class="card-image">
            </div>
            <div class="card-content">
                <span class="category-label">${item.categoria.toUpperCase()}</span>
                <h3 class="product-name">${item.nome}</h3>
                <div class="stats-row">
                    <span class="stat-label">Estoque atual</span>
                    <span class="stat-value">${item.estoque_atual}</span>
                </div>
                <div class="stats-row ${item.classe_secundaria}">
                    <span class="stat-label ${item.classe_secundaria}">${item.texto_secundario}</span>
                    <span class="stat-value">${item.valor_secundario}</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar ${item.barra_classe}" style="width: ${item.barra_progresso}%"></div>
                </div>
            </div>
        </div>
        `;
    }

    // 4. Função para filtrar os dados e injetar no HTML
    function renderizarCards(categoriaSelecionada) {
        const gridDesperdicio = document.getElementById('grid-desperdicio');
        const gridReposicao = document.getElementById('grid-reposicao');

        // Limpa os grids atuais
        gridDesperdicio.innerHTML = '';
        gridReposicao.innerHTML = '';

        // Filtra os itens da categoria escolhida
        const itensDaCategoria = todosOsDados.filter(item => item.categoria === categoriaSelecionada);

        // Separa por seção e injeta o HTML
        itensDaCategoria.forEach(item => {
            const cardHTML = gerarHTMLCard(item);
            
            if (item.secao === 'desperdicio') {
                gridDesperdicio.innerHTML += cardHTML;
            } else if (item.secao === 'reposicao') {
                gridReposicao.innerHTML += cardHTML;
            }
        });

        // Mensagem de fallback caso a categoria esteja vazia
        if (gridDesperdicio.innerHTML === '') gridDesperdicio.innerHTML = '<p>Nenhum item crítico nesta categoria.</p>';
        if (gridReposicao.innerHTML === '') gridReposicao.innerHTML = '<p>Estoque regular nesta categoria.</p>';
    }

    // 5. Configurar cliques nos botões de categoria
    function configurarBotoesCategoria() {
        const botoes = document.querySelectorAll('.category-btn');

        botoes.forEach(botao => {
            botao.addEventListener('click', (e) => {
                // Remove a classe 'active-cat' (ou a classe que vc usa no ícone) de todos
                botoes.forEach(b => {
                    b.classList.remove('active');
                    b.querySelector('.category-icon').classList.remove('active-cat');
                });

                // Adiciona a classe ativa no botão clicado
                botao.classList.add('active');
                botao.querySelector('.category-icon').classList.add('active-cat');

                // Pega a categoria do atributo data-categoria e renderiza
                const categoria = botao.getAttribute('data-categoria');
                renderizarCards(categoria);
            });
        });
    }
});