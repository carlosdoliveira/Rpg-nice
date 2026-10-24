# A Lanterna de Vidro-Sal

Mini RPG de texto e decisão, em português, de 5 a 10 minutos.

## Premissa

Maré-Alta é uma vila de pescadores protegida pelo farol de Vidro-Sal. Há três noites o farol se apagou, o faroleiro Anselmo sumiu e a Névoa Cinza avança trazendo as vozes dos afogados. Você chega à vila e a prefeita, Dona Ivone, pede que reacenda a luz. Mas a verdade sobre o farol é outra. São 3 capítulos e 6 finais.

## Como jogar

Abra o arquivo `index.html` no navegador (duplo clique). Não precisa de servidor, build ou internet. Escolha um arquétipo, decida os caminhos clicando ou usando as teclas 1 a 9, e cuide do seu Fôlego: se ele chegar a zero, o mar te leva. O progresso é salvo automaticamente no navegador.

## Scripts (Node, sem dependências)

- `node tests/engine.test.js` roda os testes do motor.
- `node tools/check-story.js` valida o grafo da história (destinos, itens, alcance dos nós, arquétipos).

## Arquivos

- `js/story.js`: conteúdo da história (apenas dados).
- `js/engine.js`: motor e interface.
- `docs/PLANO.md`: plano e contrato do projeto.
