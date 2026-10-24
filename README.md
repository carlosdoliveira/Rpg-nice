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

## Jogar no celular (GitHub Pages)

O jogo é publicado automaticamente pelo workflow `.github/workflows/pages.yml` a cada
push (ele roda os testes antes de publicar). Endereço:
**https://carlosdoliveira.github.io/Rpg-nice/**

Configuração única no GitHub: *Settings → Pages → Build and deployment → Source:*
**GitHub Actions**. Depois rode o workflow em *Actions → Publicar no GitHub Pages → Run workflow*
(ou faça um novo push).

Tudo funciona por toque: escolhas, itens (toque no item para ver a descrição) e o botão
**Menu** para voltar à tela inicial — o progresso fica salvo no aparelho. O nome é
opcional, então nem é preciso abrir o teclado virtual. No navegador do celular, use
"Adicionar à tela inicial" para abrir o jogo em tela cheia, como um app.
