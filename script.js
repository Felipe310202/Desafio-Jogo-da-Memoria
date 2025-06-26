// Seleciona os elementos do DOM que vamos usar
const gameBoard = document.querySelector('.memory-game');
const tentativasElement = document.querySelector('#tentativas');

// Array de emojis para as cartas (8 pares para uma grade 4x4)
const cardsArray = [
    '🦸', '🦸', '🦹', '🦹', '🤖', '🤖', '👽', '👽',
    '🧙', '🧙', '🧛', '🧛', '🧟', '🧟', '👻', '👻'
];

// Variáveis para controlar o estado do jogo
let hasFlippedCard = false;
let lockBoard = false; // Bloqueia o tabuleiro para evitar cliques rápidos
let firstCard, secondCard;
let tentativas = 0;
let paresEncontrados = 0;

// Função para embaralhar as cartas
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

// Função para criar o tabuleiro do jogo
function createBoard() {
    shuffle(cardsArray); // Embaralha o array de cartas

    cardsArray.forEach(cardValue => {
        // Cria os elementos HTML para cada carta
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.value = cardValue; // Adiciona um atributo para verificação

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.textContent = '?';

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.textContent = cardValue;

        card.appendChild(cardBack);
        card.appendChild(cardFront);

        // Adiciona o evento de clique para virar a carta
        card.addEventListener('click', flipCard);

        gameBoard.appendChild(card);
    });
}

// Função executada ao clicar em uma carta
function flipCard() {
    if (lockBoard) return; // Se o tabuleiro estiver bloqueado, não faz nada
    if (this === firstCard) return; // Impede o duplo clique na mesma carta

    this.classList.add('flip');

    if (!hasFlippedCard) {
        // Primeiro clique
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Segundo clique
    secondCard = this;
    checkForMatch();
}

// Função para verificar se as duas cartas viradas são iguais
function checkForMatch() {
    incrementarTentativas();
    
    // Compara o valor das cartas pelo atributo 'data-value'
    let isMatch = firstCard.dataset.value === secondCard.dataset.value;

    if (isMatch) {
        paresEncontrados++;
        disableCards();
        verificarFimDeJogo();
    } else {
        unflipCards();
    }
}

// Função para desabilitar as cartas quando um par é encontrado
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

// Função para desvirar as cartas se não forem um par
function unflipCards() {
    lockBoard = true; // Bloqueia o tabuleiro

    // Aguarda 1 segundo antes de desvirar as cartas
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

// Reseta as variáveis de estado do tabuleiro
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Incrementa o contador de tentativas e atualiza na tela
function incrementarTentativas() {
    tentativas++;
    tentativasElement.textContent = tentativas;
}

// Verifica se todos os pares foram encontrados
function verificarFimDeJogo() {
    const totalDePares = cardsArray.length / 2;
    if (paresEncontrados === totalDePares) {
        // Adiciona um pequeno delay para a última carta virar antes do alerta
        setTimeout(() => {
            alert(`Parabéns! Você completou o jogo em ${tentativas} tentativas!`);
        }, 500);
    }
}

// Inicia o jogo
createBoard();