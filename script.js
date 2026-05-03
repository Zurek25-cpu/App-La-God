// Banco de dados inicial dos personagens
const jogadores = {
    "Tanque": { hp: 900, img: "Dados tanque.jpg", cor: "#2ecc71" },
    "Soldado": { hp: 900, img: "Dados soldado.jpg", cor: "#e67e22" },
    "Mago": { hp: 900, img: "Dados mago.jpg", cor: "#9b59b6" },
    "Assassino": { hp: 900, img: "Dados assassino.jpg", cor: "#34495e" }
};

let personagemSelecionado = "";

function abrirFicha(classe) {
    personagemSelecionado = classe;
    const player = jogadores[classe];
    
    // Altera o fundo da ficha para a imagem do personagem que você já tem na pasta
    document.getElementById('game-screen').style.backgroundImage = `url('${player.img}')`;
    document.getElementById('char-name').innerText = classe;
    
    atualizarBarraVida(player.hp);
    renderizarChecklistCompleto();
    trocarTela('menu-screen', 'game-screen');
}

function renderizarChecklistCompleto() {
    const area = document.getElementById('checklist-area');
    area.innerHTML = `
        <h3>Armadura de Deus (10 pts)</h3>
        <label><input type="checkbox" class="task" value="2"> Capacete da Salvação</label><br>
        <label><input type="checkbox" class="task" value="2"> Couraça da Justiça</label><br>
        <label><input type="checkbox" class="task" value="1"> Cinto da Verdade</label><br>
        
        <h3>Poder de Ego (Corpo e Alma)</h3>
        <label><input type="checkbox" class="task" value="5"> Sono (6h+) e Comida Saudável</label><br>
        <label><input type="checkbox" class="task" value="5"> Controle Emocional</label><br>

        <h3>Habilidades</h3>
        <label><input type="checkbox" id="usou-skill"> Praticou Habilidade do Dia?</label>
    `;
}

function salvarDia() {
    const player = jogadores[personagemSelecionado];
    let pontosGanhos = 0;
    const checkboxes = document.querySelectorAll('.task:checked');
    const usouSkill = document.getElementById('usou-skill').checked;

    // REGRA 1: Se não fez nenhuma atividade, perde 50 HP
    if (checkboxes.length === 0 && !usouSkill) {
        player.hp -= 50;
    } else {
        // Soma os pontos das atividades marcadas
        checkboxes.forEach(cb => pontosGanhos += parseInt(cb.value));
        
        // REGRA 2: Se não praticou habilidade, perde 10 pontos do total do dia
        if (!usouSkill) {
            pontosGanhos -= 10;
        } else {
            pontosGanhos += 10; // Bônus por praticar
        }
        
        player.hp += pontosGanhos;
    }

    // Limitar HP máximo e mínimo
    if (player.hp < 0) player.hp = 0;
    
    atualizarBarraVida(player.hp);
    alert(`Dia Finalizado! HP Atual: ${player.hp}`);
}

function atualizarBarraVida(hp) {
    const barra = document.getElementById('hp-bar');
    const texto = document.getElementById('hp-text');
    // Cálculo da porcentagem baseado em 900 pontos
    let porcentagem = (hp / 900) * 100;
    barra.style.width = Math.min(porcentagem, 100) + "%";
    texto.innerText = `${hp} / 900 HP`;
}

setTimeout(() => {
    trocarTela('splash-screen', 'vinheta');
    const vid = document.getElementById('video-vinheta');
    vid.play();
    
    vid.onended = function() {
        trocarTela('vinheta', 'login-screen');
    };
}, 3000);

// Estado global do jogo
let estadoGlobal = JSON.parse(localStorage.getItem('LA_God_Estado')) || {
    diaAtual: 1,
    concluido: false
};

function salvarDia() {
    const player = jogadores[personagemSelecionado];
    let pontosGanhos = 0;
    const checkboxes = document.querySelectorAll('.task:checked');
    const usouSkill = document.getElementById('usou-skill').checked;

    // Lógica de cálculo (conforme módulo anterior)
    if (checkboxes.length === 0 && !usouSkill) {
        player.hp -= 50;
    } else {
        checkboxes.forEach(cb => pontosGanhos += parseInt(cb.value));
        player.hp += (usouSkill ? (pontosGanhos + 10) : (pontosGanhos - 10));
    }

    // Avançar o dia
    avancarCalendario();
    salvarDadosNoCelular();
}

function avancarCalendario() {
    if (estadoGlobal.diaAtual < 30) {
        estadoGlobal.diaAtual++;
        alert(`Fim do dia! Iniciando Dia ${estadoGlobal.diaAtual} de 30.`);
    } else {
        estadoGlobal.concluido = true;
        exibirResultadoFinal();
    }
}

function exibirResultadoFinal() {
    const player = jogadores[personagemSelecionado];
    let galardao = "";
    let recompensaImg = "";

    if (player.hp <= 0) {
        galardao = "O CAMPEÃO MORREU";
        recompensaImg = "morte.jpg"; // Você pode criar essa imagem depois
    } else if (player.hp <= 900) {
        galardao = "OBRAS QUEIMADAS NO FOGO (Madeira, Feno e Palha)";
    } else if (player.hp <= 1800) {
        galardao = "RECOMPENSA: PRATA E OURO";
    } else {
        galardao = "RECOMPENSA: PEDRAS PRECIOSAS";
    }

    // Criando a tela de conclusão por cima da ficha
    const area = document.getElementById('game-screen');
    area.innerHTML = `
        <div class="final-result fade-in">
            <h1>30 DIAS CONCLUÍDOS</h1>
            <h2>${personagemSelecionado}</h2>
            <div class="result-box">
                <p>Resultado Final:</p>
                <h3>${galardao}</h3>
                <p>Pontuação Total: ${player.hp} HP</p>
            </div>
            <button onclick="reiniciarJornada()">Iniciar Nova Jornada</button>
        </div>
    `;
}

function salvarDadosNoCelular() {
    localStorage.setItem('LA_God_Estado', JSON.stringify(estadoGlobal));
    localStorage.setItem('LA_God_Jogadores', JSON.stringify(jogadores));
}

function reiniciarJornada() {
    if(confirm("Tem certeza que deseja resetar os 30 dias?")) {
        localStorage.clear();
        location.reload();
    }
}

function mostrarCartaSkill(tipoSkill) {
    // tipoSkill pode ser 'ATQ 1', 'DEF', 'SUP 1', etc.
    const modal = document.createElement('div');
    modal.className = 'modal-skill';
    
    // Caminho baseado na sua pasta "Cartão de Skills"
    // Certifique-se de que os nomes dos arquivos dentro da pasta batam com a lógica
    modal.innerHTML = `
        <div class="modal-content">
            <img src="Cartão de Skills/${personagemSelecionado}_${tipoSkill}.jpg" style="width: 100%;">
            <button onclick="this.parentElement.parentElement.remove()">Fechar</button>
        </div>
    `;
    document.body.appendChild(modal);
}
