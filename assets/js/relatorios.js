document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Buscar o arquivo CSV
    fetch('dados_relatorios.csv')
        .then(response => response.text())
        .then(csvText => {
            const dados = parseCSV(csvText);
            renderizarRelatorios(dados);
        })
        .catch(error => console.error("Erro ao carregar o CSV:", error));

    // 2. Transforma texto CSV em Array de Objetos JSON
    function parseCSV(str) {
        const linhas = str.split('\n').filter(linha => linha.trim() !== '');
        const cabecalhos = linhas[0].split(',').map(c => c.trim());
        
        return linhas.slice(1).map(linha => {
            // Se houver vírgulas no meio das frases do CSV, ajustamos a separação
            const valores = linha.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); 
            let obj = {};
            cabecalhos.forEach((cabecalho, index) => {
                obj[cabecalho] = valores[index] ? valores[index].replace(/"/g, '').trim() : '';
            });
            return obj;
        });
    }

    // 3. Distribui os dados para os lugares corretos no HTML
    function renderizarRelatorios(dados) {
        const kpiContainer = document.getElementById('kpi-container');
        const verticalContainer = document.getElementById('grafico-vertical-container');
        const horizontalContainer = document.getElementById('grafico-horizontal-container');
        const recContainer = document.getElementById('recomendacoes-container');

        // Limpa os blocos
        kpiContainer.innerHTML = '';
        horizontalContainer.innerHTML = '';
        recContainer.innerHTML = '';
        
        // No gráfico vertical, precisamos manter as linhas de grade de fundo
        verticalContainer.innerHTML = `
            <div class="grid-line" style="bottom: 0%;"></div>
            <div class="grid-line" style="bottom: 25%;"></div>
            <div class="grid-line" style="bottom: 50%;"></div>
            <div class="grid-line" style="bottom: 75%;"></div>
            <div class="grid-line" style="bottom: 100%;"></div>
        `;

        // Passa por cada linha do CSV injetando o HTML correspondente
        dados.forEach(item => {
            
            if (item.tipo === 'kpi') {
                kpiContainer.innerHTML += `
                    <div class="kpi-card">
                        <span class="kpi-title">${item.titulo}</span>
                        <div class="kpi-value-row">
                            <span class="kpi-value">${item.valor1}</span>
                            <span class="kpi-badge ${item.classe1}">${item.valor2}</span>
                        </div>
                        <span class="kpi-subtext">${item.classe2}</span>
                    </div>
                `;
            } 
            else if (item.tipo === 'grafico_vertical') {
                verticalContainer.innerHTML += `
                    <div class="bar-group">
                        <div class="bar-tooltip">${item.valor1}</div>
                        <div class="bar ${item.classe1}" style="height: ${item.tamanho}%;"></div>
                        <span class="x-label">${item.titulo}</span>
                    </div>
                `;
            }
            else if (item.tipo === 'grafico_horizontal') {
                horizontalContainer.innerHTML += `
                    <div class="horiz-item">
                        <div class="horiz-info">
                            <span class="horiz-name">${item.titulo}</span>
                            <div class="horiz-stats">
                                <span class="horiz-kg">${item.valor1}</span>
                                <span class="horiz-pct ${item.classe2}">${item.valor2}</span>
                            </div>
                        </div>
                        <div class="horiz-bar-bg"><div class="horiz-bar ${item.classe1}" style="width: ${item.tamanho}%;"></div></div>
                    </div>
                `;
            }
            else if (item.tipo === 'recomendacao') {
                recContainer.innerHTML += `
                    <div class="rec-item">
                        <span class="tag ${item.classe1}">${item.titulo}</span>
                        <p>${item.valor1}</p>
                    </div>
                `;
            }
        });
    }
});