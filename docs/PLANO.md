# PLANO — "A Lanterna de Vidro-Sal" (mini RPG de texto e decisão)

Documento mestre do agente principal. Os agentes desenvolvedores (Dev A, Dev B) e o
agente validador usam **apenas** este documento como fonte da verdade. Em caso de
dúvida que bloqueie a tarefa, **não invente**: pare e devolva a pergunta ao agente
principal começando com `PERGUNTA:`.

---

## 1. Visão geral

- Jogo de navegador, 100% estático: `index.html` + CSS + JS puro (sem build, sem
  dependências externas, sem CDN). Abre direto com duplo clique no `index.html`.
- Idioma: português do Brasil.
- Duração: 5–10 minutos por partida, 3 capítulos, 6 finais.
- Mecânica: escolhas com requisitos (itens/flags), testes de atributo
  (`1d6 + atributo >= dificuldade`), recurso de vida chamado **Fôlego** (0–5).

## 2. Plot

### Premissa
Maré-Alta é uma vila de pescadores protegida pelo farol de Vidro-Sal, numa ilhota
a poucas centenas de metros da praia. Há três noites o farol se apagou e o
faroleiro, o velho **Anselmo**, sumiu. Desde então a **Névoa Cinza** avança sobre a
vila trazendo as vozes dos afogados. O protagonista (nome escolhido pelo jogador)
chega à vila e a prefeita **Dona Ivone** pede ajuda para reacender a luz.

### A verdade (revelada aos poucos)
- A luz do farol não protege a vila: ela **aprisiona** os afogados na névoa, a
  serviço da **Senhora da Maré**, entidade que se alimenta das memórias deles.
- A filha de Anselmo, **Lia**, afogou-se anos atrás e está entre eles. Anselmo
  apagou o farol de propósito para libertá-la, mas a Senhora o capturou no topo da
  torre e quer que alguém reacenda a luz antiga (ou assuma o posto de faroleiro).
- Existe uma terceira via: uma **luz nova**, feita de sal e memória (a Concha de
  Lia), que guia os afogados ao fundo em paz e ainda afasta a névoa da vila.

### Personagens
| Nome | Papel |
|---|---|
| Dona Ivone | Prefeita, pragmática, quer a luz de volta a qualquer custo |
| Tião | Pescador bêbado da taverna "O Arpão", sabe de boatos |
| Benta | Velha pescadora cega, única que ainda rema até a ilha |
| Anselmo | Faroleiro, pai de Lia, culpado e exausto |
| Lia | Menina afogada; aparece na névoa pedindo sua concha |
| Senhora da Maré | Entidade antagonista, voz doce, cabelo de algas |

### Tom
Folk-horror litorâneo brasileiro, melancólico mas com esperança. Sem gore.
Frases curtas, sensoriais (sal, vento, madeira molhada, sinos de boia).

## 3. Regras do jogo

### Atributos e arquétipos
Três atributos: `vigor`, `astucia`, `empatia` (soma sempre 6). Fôlego inicial = 5,
máximo = 5.

| id | Nome | vigor | astucia | empatia | Descrição curta |
|---|---|---|---|---|---|
| `pescadora` | Pescadora | 3 | 1 | 2 | Braços fortes, conhece o mar |
| `cartografo` | Cartógrafo | 1 | 3 | 2 | Olhos atentos, mente rápida |
| `benzedeira` | Benzedeira | 1 | 2 | 3 | Ouve o que os outros calam |

### Testes
`total = stats[stat] + d6`. Sucesso se `total >= dc`. Dificuldades usadas:
5 (fácil), 6 (média), 7 (difícil). O resultado é exibido ao jogador, ex.:
`Teste de Vigor: 3 + 4 = 7 vs 7 — Sucesso!`.

### Fôlego
Efeitos podem alterar Fôlego (`folego: -1`). Limitado a 0..5. Ao chegar a **0**,
o motor desvia imediatamente para o nó `fim_afogado` (ignorando o destino).

### Itens (id → nome exibido)
| id | Nome | Descrição |
|---|---|---|
| `concha_lia` | Concha de Lia | Concha rosada com um nome riscado à faca |
| `diario` | Diário de Anselmo | Páginas úmidas, letra trêmula |
| `sal_grosso` | Sal Grosso | Um punhado embrulhado em pano, presente de Benta |
| `remos` | Remos | Remos do barco ganho na taverna |

### Flags usadas
`rumor_lia`, `tem_barco`, `leu_diario`, `ouviu_verdade`, `feriu_afogados`,
`senhora_fraca`.

## 4. Grafo da história (contrato de conteúdo)

Notação: `→ destino`; `[check stat dc: sucesso / falha]`; `req:` requisitos;
`fx:` efeitos da escolha; `onEnter:` efeitos ao entrar no nó.
Todo nó não-final tem **pelo menos uma escolha sem `requires`** (anti-softlock).

### Capítulo 1 — A Vila
| id | Resumo do texto | Escolhas |
|---|---|---|
| `inicio` | Chegada noturna; névoa; Dona Ivone explica o farol apagado e o sumiço de Anselmo. | "Ir à taverna O Arpão" → `taverna`; "Visitar a casa de Anselmo" → `casa_anselmo`; "Ir direto à praia" → `praia` |
| `taverna` | Taverna abafada, pescadores assustados; Tião resmunga num canto; um pescador gaba seu barco. | "Ouvir as histórias de Tião" → `taverna_rumor`; "Desafiar o dono do barco na queda de braço" [check vigor 6: `taverna_barco` / `taverna_briga`]; "Sair para a praia" → `praia` |
| `taverna_rumor` | onEnter: flag `rumor_lia`. Tião conta que Anselmo remava à noite até a névoa falando com "Lia". | "Visitar a casa de Anselmo" → `casa_anselmo`; "Ir à praia" → `praia` |
| `taverna_barco` | onEnter: flag `tem_barco`, item `remos`. Vitória; o pescador entrega o barco a contragosto. | "Seguir para a praia" → `praia` |
| `taverna_briga` | onEnter: folego -1. Derrota humilhante, cotovelo ralado, risadas. | "Sair para a praia, de cabeça baixa" → `praia` |
| `casa_anselmo` | Casa vazia e úmida; baú com diário trancado; janela para um jardim de pedras. | "Forçar a fechadura do baú" [check astucia 6: `casa_diario` / `casa_ferido`]; "Procurar no jardim" → `casa_jardim` (req: notItem `concha_lia`); "Ir à praia" → `praia` |
| `casa_diario` | onEnter: flag `leu_diario`, item `diario`. Diário: Lia afogou-se; "a luz as prende"; "preciso apagá-la". | "Procurar no jardim" → `casa_jardim` (req: notItem `concha_lia`); "Ir à praia" → `praia` |
| `casa_ferido` | onEnter: folego -1. Corta a mão num caco de vidro escondido; o baú segue fechado. | "Procurar no jardim" → `casa_jardim` (req: notItem `concha_lia`); "Ir à praia" → `praia` |
| `casa_jardim` | onEnter: item `concha_lia`. Pequeno túmulo de pedras com o nome LIA; uma concha rosada sobre ele. | "Ir à taverna" → `taverna`; "Ir à praia" → `praia` |
| `praia` | Praia tomada pela névoa; a luz morta do farol ao longe; sinos de boia. | "Remar no seu barco" → `nevoa_mar` (req: flag `tem_barco`); "Pedir a travessia à velha Benta" → `praia_benta`; "Nadar pelas pedras até a ilha" [check vigor 7: `nevoa_mar` / `praia_afogando`]; "Desistir e fugir da vila" → `fim_fuga` |
| `praia_afogando` | onEnter: folego -2. Onda o arrasta; ele cospe água, mas chega à névoa agarrado a um destroço. | "Seguir em frente" → `nevoa_mar` |
| `praia_benta` | Benta, cega, pergunta por que você quer ir; ela só leva quem respeita o mar. | "Falar com sinceridade sobre os afogados" [check empatia 5: `praia_benta_aceita` / `praia_recusa`]; "Voltar à beira da praia" → `praia` |
| `praia_benta_aceita` | onEnter: item `sal_grosso`. Benta aceita, entrega sal grosso "pros que não descansam" e rema. | "Entrar no barco de Benta" → `nevoa_mar` |
| `praia_recusa` | Benta vira as costas. Resta o mar. | "Nadar pelas pedras" [check vigor 7: `nevoa_mar` / `praia_afogando`]; "Fugir da vila" → `fim_fuga` |

### Capítulo 2 — A Névoa
| id | Resumo do texto | Escolhas |
|---|---|---|
| `nevoa_mar` | Dentro da névoa; mãos frias na água; uma menina de vestido encharcado pergunta: "Você trouxe minha concha?" | "Entregar a concha à menina" → `nevoa_lia` (req: item `concha_lia`); "Jogar sal grosso na névoa" → `nevoa_sal` (req: item `sal_grosso`); "Ignorar as vozes e seguir" [check vigor 6: `ilha_chegada` / `nevoa_puxado`] |
| `nevoa_lia` | onEnter: flag `ouviu_verdade`. Lia segura a concha (que volta às mãos do jogador, item continua) e conta a verdade: a luz prende, o pai quis libertá-los, existe uma "luz nova" de sal e memória. | "Prometer ajudar e seguir até a ilha" → `ilha_chegada` |
| `nevoa_sal` | onEnter: flag `feriu_afogados`, removeItem `sal_grosso`. O sal queima a névoa; gritos; o caminho abre, mas algo ali agora te odeia. | "Seguir até a ilha" → `ilha_chegada` |
| `nevoa_puxado` | onEnter: folego -2. Mãos te puxam para baixo; você luta e emerge na ilha, tossindo. | "Arrastar-se até a ilha" → `ilha_chegada` |

### Capítulo 3 — O Farol
| id | Resumo do texto | Escolhas |
|---|---|---|
| `ilha_chegada` | Ilha de pedra; porta do farol; a Senhora da Maré bloqueia a passagem, sorrindo. | "Negociar com a Senhora" → `senhora_pacto`; "Enfrentá-la e abrir caminho" [check vigor 7: `torre_topo` / `senhora_ferido`]; "Esgueirar-se pelas rochas" [check astucia 6: `torre_topo` / `senhora_ferido`] |
| `senhora_ferido` | onEnter: folego -2. Algas cortantes te açoitam; ela ri e deixa você subir: "Suba. Quero ver o que fará." | "Subir a escada" → `torre_topo` |
| `senhora_pacto` | Ela oferece: acenda a luz antiga e fique como faroleiro, e a vila será poupada. | "Aceitar o pacto" → `fim_faroleiro`; "Dizer em voz alta o que ela realmente é" → `senhora_desmascarada` (req: flag `ouviu_verdade` **ou** `leu_diario` — ver nota) ; "Recusar e subir" → `torre_topo` |
| `senhora_desmascarada` | onEnter: flag `senhora_fraca`. Nomeada, ela perde a forma e vira espuma; o caminho se abre. | "Subir a escada" → `torre_topo` |
| `torre_topo` | Anselmo acorrentado por algas ao lado da lanterna fria; ele implora perdão. | "Reacender a lanterna antiga" → `fim_luz`; "Acender com Anselmo uma luz nova, de sal e memória" → `fim_libertacao` (req: flag `ouviu_verdade` e item `concha_lia`); "Tomar o lugar de Anselmo como faroleiro" → `fim_faroleiro`; "Quebrar a lanterna" → `fim_nevoa` |

**Nota sobre "ou":** o schema só suporta "e" (todas as condições). Para o
requisito "ouviu_verdade OU leu_diario", use **duas escolhas** com o mesmo texto e
destino: uma com `requires: { flags: ["ouviu_verdade"] }` e outra com
`requires: { flags: ["leu_diario"], notFlags: ["ouviu_verdade"] }`, ambas com
`hidden: true` (assim nunca aparecem duplicadas nem trancadas).

### Finais (nós com `ending`, sem `choices`)
| id | type | title | Resumo |
|---|---|---|---|
| `fim_libertacao` | `boa` | A Maré Libertada | Luz nova, azul e quente; os afogados descem em paz; Lia acena; a névoa se desfaz. Final verdadeiro. |
| `fim_luz` | `neutra` | A Luz de Sempre | A vila é salva; mas no brilho você ouve, para sempre, os gritos presos na névoa. |
| `fim_faroleiro` | `neutra` | O Novo Faroleiro | Você fica na torre, preso à Senhora; Anselmo volta para casa; a vila te esquece aos poucos. |
| `fim_nevoa` | `ruim` | A Névoa Vence | Sem luz alguma, a Senhora engole Maré-Alta. |
| `fim_fuga` | `ruim` | Quem Foge da Maré | Você foge; anos depois ainda sonha com sinos de boia. |
| `fim_afogado` | `ruim` | Engolido pelo Mar | Fôlego zerado: o mar te leva. (Acionado pelo motor.) |

Caminho do final verdadeiro (deve ser alcançável): `inicio → casa_anselmo →
casa_jardim → praia → praia_benta → praia_benta_aceita → nevoa_mar → nevoa_lia →
ilha_chegada → senhora_pacto → senhora_desmascarada → torre_topo → fim_libertacao`.

## 5. Arquitetura e arquivos

```
index.html          (Dev A)  carrega css/style.css, js/story.js, js/engine.js, nessa ordem
css/style.css       (Dev A)
js/engine.js        (Dev A)  lógica pura + UI
js/story.js         (Dev B)  só dados (o conteúdo)
tests/engine.test.js(Dev A)  `node tests/engine.test.js` — sem dependências
tools/check-story.js(Dev B)  `node tools/check-story.js` — valida o grafo
README.md           (Dev B)  como jogar / rodar
```

Ambos os JS usam o padrão compatível navegador + Node:
```js
(function (root) {
  const X = { /* ... */ };
  root.NOME = X;
  if (typeof module !== "undefined" && module.exports) module.exports = X;
})(typeof window !== "undefined" ? window : globalThis);
```
`story.js` expõe `STORY`; `engine.js` expõe `RPG`.

### 5.1 Schema de `STORY` (contrato entre Dev A e Dev B)
```js
STORY = {
  meta: { title: "A Lanterna de Vidro-Sal", startNode: "inicio", deathNode: "fim_afogado", maxFolego: 5 },
  archetypes: [ { id, name, desc, stats: { vigor, astucia, empatia } } ],  // seção 3
  items: { concha_lia: { name, desc }, ... },                               // seção 3
  chapters: { 1: "A Vila", 2: "A Névoa", 3: "O Farol" },
  nodes: {
    "<id>": {
      chapter: 1,                       // 1..3 (finais: capítulo do contexto, use 3 exceto fim_fuga=1)
      text: "Parágrafos separados por \n\n. Pode usar {nome}.",
      onEnter: Effects,                 // opcional
      choices: [Choice],                // ausente em finais
      ending: { type: "boa"|"neutra"|"ruim", title: "..." } // só em finais
    }
  }
}
Choice = {
  text: "Rótulo",
  goto: "<id>",                         // OU check (exatamente um dos dois)
  check: { stat: "vigor"|"astucia"|"empatia", dc: 5..7, success: "<id>", failure: "<id>" },
  requires: Requires,                   // opcional
  hidden: true,                         // opcional: se requisito falhar, esconder em vez de trancar
  lockedHint: "texto curto",            // opcional: dica mostrada quando trancada
  effects: Effects                      // opcional, aplicado antes de navegar
}
Requires = { items?: [ids], notItems?: [ids], flags?: [ids], notFlags?: [ids] }  // todas devem valer
Effects  = { addItems?: [ids], removeItems?: [ids], setFlags?: [ids], folego?: number }
```

### 5.2 API pura do motor (`RPG`, testável no Node, sem DOM)
| Função | Comportamento |
|---|---|
| `createState(story, archetypeId, name)` | `{ name, archetype, stats:{...cópia}, folego: meta.maxFolego, items:[], flags:[], node: meta.startNode, lastRoll: null }`. Nome vazio → "Viajante". |
| `meetsRequires(state, req)` | `true` se `req` ausente ou todas as condições valem. |
| `applyEffects(state, fx, story)` | Itens e flags sem duplicar; `folego` limitado a `0..maxFolego`. Muta e retorna `state`. |
| `rollCheck(state, check, rng)` | `rng` opcional (default `Math.random`), `roll = 1 + floor(rng()*6)`. Retorna `{ stat, roll, bonus, total, dc, success, next }`. |
| `enterNode(state, story, id)` | Seta `state.node = id`, aplica `onEnter`; se `folego <= 0` e nó não é final, seta `state.node = meta.deathNode`. Retorna `state`. |
| `choose(state, story, index, rng)` | Pega a escolha `index` das **escolhas visíveis** (ver `visibleChoices`), lança erro se trancada; aplica `effects`; se `folego <= 0` vai para `deathNode`; senão resolve `goto`/`check`, guarda `lastRoll` (ou `null`) e chama `enterNode`. Retorna `state`. |
| `visibleChoices(state, story)` | Lista `{ choice, locked: bool }` excluindo as `hidden` cujo requisito falha. |
| `formatText(text, state)` | Substitui `{nome}` pelo nome. |

### 5.3 UI (Dev A)
Telas (uma `<main id="app">` re-renderizada):
1. **Título**: nome do jogo, botões "Novo jogo" e "Continuar" (só se houver save).
2. **Criação**: campo de nome + 3 cartões de arquétipo (nome, descrição, atributos);
   botão "Começar" habilitado após escolher arquétipo.
3. **Jogo**: cabeçalho com "Capítulo N — Título"; barra com nome, atributos,
   Fôlego como ●●●○○ e inventário (nomes dos itens, `title` = desc); caixa do último
   teste (se houver); texto (parágrafos `<p>`); botões das escolhas. Escolha com
   `check` mostra sufixo ` [Vigor, dif. 7]`. Trancada: botão `disabled`, prefixo 🔒
   e `lockedHint` (ou "Requisito não cumprido").
4. **Final**: título do final, selo colorido por tipo (boa=verde-água,
   neutra=âmbar, ruim=vermelho), texto, botão "Jogar novamente".

- Save automático em `localStorage["rpgnice.save.v1"]` após cada nó; apagado ao
  chegar a um final. Todo acesso ao localStorage em `try/catch`.
- Nomes de atributos exibidos: Vigor, Astúcia, Empatia.
- Escape de HTML ao inserir texto/nome (usar `textContent`).
- Visual: tema escuro marítimo (fundo azul-petróleo escuro, texto creme, destaque
  âmbar de farol), fonte serifada do sistema para o texto, largura máx. ~680px,
  responsivo (funciona a 360px), botões grandes, foco visível, navegação por teclado
  (teclas 1–9 escolhem a opção correspondente).

## 6. Tarefas

### Dev A — Motor, UI e testes  (modelo: Sonnet)
Arquivos: `index.html`, `css/style.css`, `js/engine.js`, `tests/engine.test.js`.
- Implementar tudo da seção 5.2 e 5.3 exatamente com esses nomes.
- **Não** escrever o conteúdo da história. Para os testes, usar uma mini-história
  falsa dentro do próprio arquivo de teste (3–5 nós) cobrindo: requires/hidden,
  check com rng fixo (sucesso e falha), folego zerando → deathNode, itens sem
  duplicar, `{nome}`.
- Testes com `assert` do Node; saída `OK` e exit 0 se tudo passar.
- Pronto quando: `node tests/engine.test.js` passa.

### Dev B — Conteúdo e validação do grafo  (modelo: Sonnet)
Arquivos: `js/story.js`, `tools/check-story.js`, `README.md`.
- Escrever `STORY` seguindo o schema 5.1 e **exatamente** os ids, escolhas,
  requisitos, checks e efeitos da seção 4 (e itens/arquétipos da seção 3).
- Texto: 60–130 palavras por nó (finais 90–160), 2ª pessoa ("você"), tom da seção 2.
- `tools/check-story.js` (Node, sem deps) verifica: todo destino existe; cada choice
  tem exatamente um entre `goto`/`check`; todo nó não-final tem choices e ≥1 sem
  `requires`; finais não têm choices; todo item referenciado existe em `items`;
  todos os nós alcançáveis a partir de `startNode` (ignorando requisitos;
  `deathNode` conta como alcançável); arquétipos somam 6. Saída `OK` / lista de erros
  e exit 1.
- README curto: premissa, como jogar (abrir `index.html`), como rodar os dois scripts.
- Pronto quando: `node tools/check-story.js` passa.

### Validador  (modelo: Haiku)
- Rodar `node tests/engine.test.js` e `node tools/check-story.js`.
- Conferir contra este plano: arquivos da seção 5 existem; nomes da API 5.2;
  todos os ids de nós da seção 4 existem em `story.js` com as escolhas/destinos/
  checks/requisitos indicados; 6 finais com os `type`/`title` da tabela; itens e
  arquétipos da seção 3; caminho do final verdadeiro percorrível; chave do save;
  nenhuma dependência externa (sem `http` em `<script>`/`<link>`).
- Rodar uma partida automatizada no Node: carregar `story.js` + `engine.js`,
  seguir o caminho do final verdadeiro com `rng` que sempre dá sucesso e confirmar
  `state.node === "fim_libertacao"`.
- Entregar relatório: lista de conformidades e divergências (arquivo:linha). Não
  corrigir código.

## 7. Protocolo multiagente
1. Agente principal (Opus) escreve este plano e coordena.
2. Dev A e Dev B trabalham em paralelo, cada um só nos seus arquivos.
3. Dúvidas bloqueantes → devolver `PERGUNTA:` ao agente principal, que responde
   e retoma o agente. Nunca alterar arquivos do outro dev.
4. Validador roda após ambos; divergências voltam ao dev responsável.
5. Agente principal faz o commit final.

Orçamento: planejamento ≤150k tokens; desenvolvimento (Dev A + Dev B) ≤50k tokens
no total — seja direto, sem explorações desnecessárias.
