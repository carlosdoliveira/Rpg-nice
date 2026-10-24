(function (root) {
  const P = "\n\n";
  const STORY = {
    meta: { title: "A Lanterna de Vidro-Sal", startNode: "inicio", deathNode: "fim_afogado", maxFolego: 5 },
    archetypes: [
      { id: "pescadora", name: "Pescadora", desc: "Braços fortes, conhece o mar", stats: { vigor: 3, astucia: 1, empatia: 2 } },
      { id: "cartografo", name: "Cartógrafo", desc: "Olhos atentos, mente rápida", stats: { vigor: 1, astucia: 3, empatia: 2 } },
      { id: "benzedeira", name: "Benzedeira", desc: "Ouve o que os outros calam", stats: { vigor: 1, astucia: 2, empatia: 3 } }
    ],
    items: {
      concha_lia: { name: "Concha de Lia", desc: "Concha rosada com um nome riscado à faca" },
      diario: { name: "Diário de Anselmo", desc: "Páginas úmidas, letra trêmula" },
      sal_grosso: { name: "Sal Grosso", desc: "Um punhado embrulhado em pano, presente de Benta" },
      remos: { name: "Remos", desc: "Remos do barco ganho na taverna" }
    },
    chapters: { 1: "A Vila", 2: "A Névoa", 3: "O Farol" },
    nodes: {
      inicio: {
        chapter: 1,
        text: "A noite cai sobre Maré-Alta com cheiro de sal e madeira molhada. Uma névoa cinza rasteja pelas vielas, e ao longe, numa ilhota escura, o farol de Vidro-Sal não dá luz alguma." + P +
          "Dona Ivone, a prefeita, espera por você no cais, de braços cruzados. \"Bem-vindo, {nome}. Há três noites a lanterna se apagou, e Anselmo, o faroleiro, sumiu. A névoa traz vozes de gente que já morreu. Reacenda aquela luz, custe o que custar.\"" + P +
          "Os sinos de boia badalam na escuridão. Você precisa começar por algum lugar.",
        choices: [
          { text: "Ir à taverna O Arpão", goto: "taverna" },
          { text: "Visitar a casa de Anselmo", goto: "casa_anselmo" },
          { text: "Ir direto à praia", goto: "praia" }
        ]
      },
      taverna: {
        chapter: 1,
        text: "O Arpão está abafado, fedendo a cachaça e a rede molhada. Os pescadores falam baixo, e ninguém olha para a janela, onde a névoa encosta o rosto no vidro." + P +
          "Num canto, Tião resmunga sozinho sobre o copo vazio. Perto do balcão, um pescador de ombros largos gaba o barco novo a quem quiser ouvir, e lança a você um sorriso de desafio.",
        choices: [
          { text: "Ouvir as histórias de Tião", goto: "taverna_rumor" },
          { text: "Desafiar o dono do barco na queda de braço", check: { stat: "vigor", dc: 6, success: "taverna_barco", failure: "taverna_briga" } },
          { text: "Sair para a praia", goto: "praia" }
        ]
      },
      taverna_rumor: {
        chapter: 1,
        text: "Você paga uma dose e Tião, agradecido, desembucha. Fala com a língua enrolada, mas os olhos estão assustados e sóbrios." + P +
          "\"Anselmo remava à noite até dentro da névoa, sabe? Eu vi. Ficava lá falando com alguém. 'Lia', ele dizia. 'Lia, espera o pai.' A filha dele se afogou faz anos, moça. Dizem que ela anda por aí, perdida naquele cinzento.\"" + P +
          "Ele cala, e o silêncio pesa. Lá fora, um sino de boia soa duas vezes.",
        onEnter: { setFlags: ["rumor_lia"] },
        choices: [
          { text: "Visitar a casa de Anselmo", goto: "casa_anselmo" },
          { text: "Ir à praia", goto: "praia" }
        ]
      },
      taverna_barco: {
        chapter: 1,
        text: "Os músculos queimam, a mesa range, e então o braço do pescador tomba sobre a madeira. A taverna inteira prende a respiração por um instante, depois explode em palmas e assobios." + P +
          "O homem cospe de lado, resmunga um palavrão e joga os remos sobre o balcão. \"Leva logo. O barco está na praia, amarrado numa estaca. Não diga que não avisei sobre a névoa.\"" + P +
          "Você sai com os remos no ombro e o orgulho no peito.",
        onEnter: { setFlags: ["tem_barco"], addItems: ["remos"] },
        choices: [{ text: "Seguir para a praia", goto: "praia" }]
      },
      taverna_briga: {
        chapter: 1,
        text: "Você aperta a mão calejada e empurra com tudo, mas o braço do outro parece de pedra. Num instante sua mão bate na mesa, e o cotovelo raspa a madeira áspera até arder." + P +
          "As risadas enchem o salão. Alguém grita que \"forasteiro só serve pra beber\". O pescador nem se dá ao trabalho de se gabar; só vira as costas e pede outra rodada." + P +
          "Você sente o rosto queimar, e o cotovelo também.",
        onEnter: { folego: -1 },
        choices: [{ text: "Sair para a praia, de cabeça baixa", goto: "praia" }]
      },
      casa_anselmo: {
        chapter: 1,
        text: "A porta cede com um gemido. Dentro, a casa de Anselmo está vazia e úmida, com cheiro de maresia e de lamparina velha. Há uma cadeira virada, uma xícara com borra seca e redes penduradas como teias." + P +
          "No canto, um baú de ferro com um diário preso por uma fechadura enferrujada. Pela janela dos fundos você enxerga um jardim de pedras cobertas de musgo, estranhamente arrumadas.",
        choices: [
          { text: "Forçar a fechadura do baú", check: { stat: "astucia", dc: 6, success: "casa_diario", failure: "casa_ferido" } },
          { text: "Procurar no jardim", goto: "casa_jardim", requires: { notItems: ["concha_lia"] }, lockedHint: "Você já esteve no jardim." },
          { text: "Ir à praia", goto: "praia" }
        ]
      },
      casa_diario: {
        chapter: 1,
        text: "A fechadura estala com um clique satisfatório. Dentro do baú, um diário de capa mole, com páginas inchadas de umidade e letra trêmula." + P +
          "\"Lia se afogou numa noite de tormenta. Desde então a luz não me deixa dormir. Ela não protege ninguém. A luz as prende, as retém na névoa como peixes numa rede. Preciso apagá-la antes que seja tarde.\"" + P +
          "Você guarda o diário sob o casaco. Entende que o farol apagado talvez não tenha sido um acidente.",
        onEnter: { setFlags: ["leu_diario"], addItems: ["diario"] },
        choices: [
          { text: "Procurar no jardim", goto: "casa_jardim", requires: { notItems: ["concha_lia"] }, lockedHint: "Você já esteve no jardim." },
          { text: "Ir à praia", goto: "praia" }
        ]
      },
      casa_ferido: {
        chapter: 1,
        text: "A ferramenta escorrega e sua mão entra fundo num vão atrás do baú. Um caco de vidro, escondido ali de propósito ou por azar, abre um corte comprido na palma." + P +
          "Você aperta o pano contra a ferida e respira fundo. O sangue pinga no assoalho úmido e some entre as frestas. A fechadura continua intacta, e o baú segue fechado, guardando o que quer que seja." + P +
          "Talvez haja outra pista por perto. A janela dos fundos mostra o jardim.",
        onEnter: { folego: -1 },
        choices: [
          { text: "Procurar no jardim", goto: "casa_jardim", requires: { notItems: ["concha_lia"] }, lockedHint: "Você já esteve no jardim." },
          { text: "Ir à praia", goto: "praia" }
        ]
      },
      casa_jardim: {
        chapter: 1,
        text: "O jardim é um quadrado de pedras redondas, polidas pelo mar e dispostas com cuidado. No centro, um pequeno túmulo, e nele, riscado a faca numa tábua, um nome: LIA." + P +
          "Sobre as pedras repousa uma concha rosada, ainda úmida, como se alguém tivesse acabado de pousá-la. Há um nome riscado na borda, quase apagado pelo tempo." + P +
          "Você sente que a concha pertence a alguém que a espera. Guarda-a com cuidado, em silêncio, como quem pede licença.",
        onEnter: { addItems: ["concha_lia"] },
        choices: [
          { text: "Ir à taverna", goto: "taverna" },
          { text: "Ir à praia", goto: "praia" }
        ]
      },
      praia: {
        chapter: 1,
        text: "A praia está tomada pela névoa. Você caminha sobre areia fria, e a água lambe seus pés quase sem ruído. Ao longe, apenas uma sombra: a torre do farol, morta, sem um fio de luz." + P +
          "Os sinos de boia ecoam do nada. Entre eles, às vezes, parece haver vozes de gente que sussurra seu nome. A ilhota fica a poucas centenas de metros, mas a travessia vai custar alguma coisa.",
        choices: [
          { text: "Remar no seu barco", goto: "nevoa_mar", requires: { flags: ["tem_barco"] }, lockedHint: "Você não tem um barco." },
          { text: "Pedir a travessia à velha Benta", goto: "praia_benta" },
          { text: "Nadar pelas pedras até a ilha", check: { stat: "vigor", dc: 7, success: "nevoa_mar", failure: "praia_afogando" } },
          { text: "Desistir e fugir da vila", goto: "fim_fuga" }
        ]
      },
      praia_afogando: {
        chapter: 1,
        text: "Uma onda grande vem do escuro e arranca seus pés das pedras. A água salgada invade nariz e boca, e você roda sem saber onde fica o alto." + P +
          "Seus dedos se fecham num destroço de madeira. Você se agarra, tosse, cospe, respira. A correnteza o arrasta para dentro da névoa, tremendo, com o peito ardendo." + P +
          "Não foi bonito, mas ainda segue vivo, e a ilha deve estar logo adiante.",
        onEnter: { folego: -2 },
        choices: [{ text: "Seguir em frente", goto: "nevoa_mar" }]
      },
      praia_benta: {
        chapter: 1,
        text: "Benta está sentada ao lado de um barco velho, os olhos brancos voltados para o mar que ela não vê. Seus dedos trabalham numa rede, sem pressa." + P +
          "\"Ouço você chegando, forasteiro. Passo firme, mas coração aflito.\" Ela inclina a cabeça. \"Só eu ainda remo até a ilha. Mas não levo quem quer atravessar sem respeito. Diga: por que quer ir lá?\"" + P +
          "O mar sussurra atrás de você, esperando a resposta.",
        choices: [
          { text: "Falar com sinceridade sobre os afogados", check: { stat: "empatia", dc: 5, success: "praia_benta_aceita", failure: "praia_recusa" } },
          { text: "Voltar à beira da praia", goto: "praia" }
        ]
      },
      praia_benta_aceita: {
        chapter: 1,
        text: "Você fala sem enfeites: das vozes, do medo, da vontade de ajudar quem ficou preso. Benta escuta com o rosto sereno e, quando você termina, assente devagar." + P +
          "\"Esse é o jeito.\" Ela tira do bolso um embrulho de pano e coloca nas suas mãos. \"Sal grosso. Pros que não descansam. Jogue com respeito, ou não jogue.\"" + P +
          "A velha se levanta, empurra o barco para a água e pega os remos. O mar parece se abrir um pouco para ela.",
        onEnter: { addItems: ["sal_grosso"] },
        choices: [{ text: "Entrar no barco de Benta", goto: "nevoa_mar" }]
      },
      praia_recusa: {
        chapter: 1,
        text: "As palavras saem tortas, ou talvez o mar as desfaça antes de chegarem. Benta fica em silêncio por um longo momento, e então vira o rosto." + P +
          "\"Não é isso que eu queria ouvir.\" Ela volta à sua rede, como se você tivesse virado vento. Nenhuma outra palavra, nenhum gesto. Só os dedos trabalhando, e o mar ao fundo." + P +
          "Resta a você o que sobrou: as pedras escorregadias e a água escura, ou a estrada de volta para longe daqui.",
        choices: [
          { text: "Nadar pelas pedras", check: { stat: "vigor", dc: 7, success: "nevoa_mar", failure: "praia_afogando" } },
          { text: "Fugir da vila", goto: "fim_fuga" }
        ]
      },
      nevoa_mar: {
        chapter: 2,
        text: "A névoa fecha atrás de você como uma porta. Não há mais praia nem farol, só cinza, frio e o som de água que respira. Mãos pálidas roçam a superfície, afastando-se quando você olha." + P +
          "Então ela aparece: uma menina de vestido encharcado, cabelo colado ao rosto, os pés sem tocar a água. Sua voz é quase um sopro. \"Você trouxe minha concha?\"" + P +
          "Outras vozes sussurram atrás dela, famintas e tristes. O caminho segue em frente, mas não será simples.",
        choices: [
          { text: "Entregar a concha à menina", goto: "nevoa_lia", requires: { items: ["concha_lia"] }, lockedHint: "Você não tem a concha que ela procura." },
          { text: "Jogar sal grosso na névoa", goto: "nevoa_sal", requires: { items: ["sal_grosso"] }, lockedHint: "Você não tem sal grosso." },
          { text: "Ignorar as vozes e seguir", check: { stat: "vigor", dc: 6, success: "ilha_chegada", failure: "nevoa_puxado" } }
        ]
      },
      nevoa_lia: {
        chapter: 2,
        text: "Você estende a concha rosada. Lia a toma com as duas mãos pequenas e frias, e por um instante o rosto dela é só de criança. Ela a aperta contra o peito e, em seguida, devolve-a a você: \"Fique com ela. Vai precisar.\"" + P +
          "Então fala, baixo, e a verdade vem em pedaços. A luz do farol não protege a vila: prende os afogados na névoa para a Senhora da Maré se alimentar das lembranças deles. Seu pai apagou a lanterna para libertá-los. E existe outra saída, uma \"luz nova\", feita de sal e memória.",
        onEnter: { setFlags: ["ouviu_verdade"] },
        choices: [{ text: "Prometer ajudar e seguir até a ilha", goto: "ilha_chegada" }]
      },
      nevoa_sal: {
        chapter: 2,
        text: "Você abre o pano e lança o sal contra o cinza. Os grãos brilham no ar como faíscas, e a névoa chia, queima, recua em grandes rasgos. Gritos agudos cortam a escuridão." + P +
          "O caminho se abre, limpo e silencioso. A menina desaparece sem uma palavra, mas você sente que o ar ficou mais pesado. Algo ali, nos que sobraram, agora te odeia, e a lembrança deste gesto vai segui-lo." + P +
          "Não há tempo para lamentar. A ilha está logo adiante.",
        onEnter: { setFlags: ["feriu_afogados"], removeItems: ["sal_grosso"] },
        choices: [{ text: "Seguir até a ilha", goto: "ilha_chegada" }]
      },
      nevoa_puxado: {
        chapter: 2,
        text: "Você tenta ignorar as vozes, mas elas não aceitam ser ignoradas. Mãos geladas agarram seus tornozelos, seus pulsos, a barra do casaco, e puxam para baixo com uma força que não é só de braços." + P +
          "Você luta, chuta, engole água, quase perde a noção de cima e baixo. Quando a mão que o segura finalmente se solta, você emerge ofegante, jogado numa praia de pedra, tossindo sal." + P +
          "A ilha. Você chegou, mas deixou algo de si na água.",
        onEnter: { folego: -2 },
        choices: [{ text: "Arrastar-se até a ilha", goto: "ilha_chegada" }]
      },
      ilha_chegada: {
        chapter: 3,
        text: "A ilha é um dorso de pedra preta, escorregadia, onde o vento sopra de todos os lados. À sua frente ergue-se o farol de Vidro-Sal, alto e mudo, com a porta entreaberta como uma boca." + P +
          "Diante dela, alguém espera. Uma mulher alta, de cabelo feito de algas, vestido que pinga sem parar. Sua voz é doce como mel. \"Que bom que veio, {nome}. Estava com saudade de gente viva.\"" + P +
          "A Senhora da Maré sorri, e bloqueia a passagem sem se mover.",
        choices: [
          { text: "Negociar com a Senhora", goto: "senhora_pacto" },
          { text: "Enfrentá-la e abrir caminho", check: { stat: "vigor", dc: 7, success: "torre_topo", failure: "senhora_ferido" } },
          { text: "Esgueirar-se pelas rochas", check: { stat: "astucia", dc: 6, success: "torre_topo", failure: "senhora_ferido" } }
        ]
      },
      senhora_ferido: {
        chapter: 3,
        text: "Você avança, ou tenta contornar, mas ela já estava lá. Algas finas como arame estalam no ar e açoitam seus braços, suas costas, seu rosto. O corte arde como sal em ferida aberta." + P +
          "Você cai de joelhos sobre a rocha molhada. A Senhora o observa com curiosidade e, por fim, ri baixinho, afastando-se da porta. \"Suba. Quero ver o que fará.\"" + P +
          "A escada do farol espera, escura, em espiral. Você sangra, mas está vivo.",
        onEnter: { folego: -2 },
        choices: [{ text: "Subir a escada", goto: "torre_topo" }]
      },
      senhora_pacto: {
        chapter: 3,
        text: "\"Negociar?\", ela repete, deliciada. Caminha em volta de você, e as algas do seu cabelo se arrastam pelo chão como cobras. \"Gosto de gente sensata. Eis minha oferta: acenda a luz antiga e fique como faroleiro. Em troca, a vila será poupada. Para sempre.\"" + P +
          "A voz dela é quente, quase persuasiva. Mas o que está por trás dessa doçura? Você percebe que cada palavra dela é uma isca, e o anzol está bem escondido.",
        choices: [
          { text: "Aceitar o pacto", goto: "fim_faroleiro" },
          { text: "Dizer em voz alta o que ela realmente é", goto: "senhora_desmascarada", requires: { flags: ["ouviu_verdade"] }, hidden: true },
          { text: "Dizer em voz alta o que ela realmente é", goto: "senhora_desmascarada", requires: { flags: ["leu_diario"], notFlags: ["ouviu_verdade"] }, hidden: true },
          { text: "Recusar e subir", goto: "torre_topo" }
        ]
      },
      senhora_desmascarada: {
        chapter: 3,
        text: "Você respira fundo e diz o que sabe: que a luz não protege, que ela prende, que ela se alimenta das lembranças dos afogados, que a doçura dela é isca. Cada frase é um golpe, e cada golpe a faz encolher." + P +
          "O sorriso se desfaz. O cabelo de algas desmancha, o vestido vira espuma, e a forma dela se dissolve num chiado de ondas. Só resta uma sombra fraca, sibilando, sem força para impedir ninguém." + P +
          "O caminho se abre diante da porta do farol.",
        onEnter: { setFlags: ["senhora_fraca"] },
        choices: [{ text: "Subir a escada", goto: "torre_topo" }]
      },
      torre_topo: {
        chapter: 3,
        text: "No alto da torre o vento uiva por entre os vidros rachados. A grande lanterna de Vidro-Sal está fria, opaca, como um olho cego. Junto dela, Anselmo, o faroleiro, acorrentado por algas grossas que o prendem ao chão." + P +
          "Ele ergue o rosto, velho, exausto, os olhos vermelhos de tanto chorar. \"Perdão\", implora. \"Eu só queria libertá-la. Só isso.\"" + P +
          "A decisão é sua. A lanterna espera, e com ela o destino de Maré-Alta, dos afogados e de você mesmo.",
        choices: [
          { text: "Reacender a lanterna antiga", goto: "fim_luz" },
          { text: "Acender com Anselmo uma luz nova, de sal e memória", goto: "fim_libertacao", requires: { flags: ["ouviu_verdade"], items: ["concha_lia"] }, lockedHint: "Você ainda não sabe como fazer uma luz nova." },
          { text: "Tomar o lugar de Anselmo como faroleiro", goto: "fim_faroleiro" },
          { text: "Quebrar a lanterna", goto: "fim_nevoa" }
        ]
      },
      fim_libertacao: {
        chapter: 3,
        text: "Você põe a concha de Lia no centro da lanterna e Anselmo, livre das algas, derrama sal sobre ela, contando em voz baixa o nome de cada afogado de que se lembra. Uma luz azul e quente brota do vidro, devagar, e se espalha pela névoa como a manhã." + P +
          "Os afogados descem ao fundo em paz, um a um, sem medo. Lia acena da água, sorrindo, de mãos dadas com o pai que enfim a vê. A névoa se desfaz, e Maré-Alta amanhece limpa pela primeira vez em anos." + P +
          "Você desce a escada com o coração leve. O mar, enfim, descansa.",
        ending: { type: "boa", title: "A Maré Libertada" }
      },
      fim_luz: {
        chapter: 3,
        text: "Você gira a manivela e a velha lanterna acende com um estalo, derramando seu clarão branco sobre as ondas. A névoa recua da vila, como sempre recuou. Maré-Alta está salva, e Dona Ivone vai chorar de alívio." + P +
          "Mas no brilho da luz, você ouve. Debaixo do vento, debaixo das ondas, baixinho, os gritos dos que ficaram presos na névoa, sem poder descer, sem poder descansar." + P +
          "Você recebe agradecimentos, comida quente e uma cama limpa. Dorme mal. Até o fim dos seus dias, dorme mal.",
        ending: { type: "neutra", title: "A Luz de Sempre" }
      },
      fim_faroleiro: {
        chapter: 3,
        text: "A Senhora da Maré sorri, as algas soltam Anselmo e se enroscam em você. A velha lanterna se acende, e a névoa recua da vila, obediente. Anselmo desce a escada devagar, chorando, e volta para casa." + P +
          "Você fica na torre. Os dias viram semanas, as semanas viram estações. No começo ainda vem gente à ilha, depois cada vez menos. Os moradores esquecem seu nome, o rosto, a voz." + P +
          "Resta a luz, o vento, e a doce voz que sussurra no seu ouvido todas as noites. Você acende a lanterna, e a lanterna acende você.",
        ending: { type: "neutra", title: "O Novo Faroleiro" }
      },
      fim_nevoa: {
        chapter: 3,
        text: "Você ergue o ferro da escada e golpeia o vidro. A lanterna estoura em mil cacos que tilintam como risos pelo chão de pedra. Por um instante, nada. Depois, um suspiro longo e satisfeito." + P +
          "A Senhora da Maré se ergue atrás de você, imensa, sorrindo. Sem a luz para limitá-la, ela não precisa mais de pactos. A névoa transborda da torre, desce pela ilha, atravessa a água." + P +
          "Em pouco tempo, os sinos de boia calam e as casas de Maré-Alta desaparecem no cinza. Ninguém jamais reacende luz alguma.",
        ending: { type: "ruim", title: "A Névoa Vence" }
      },
      fim_fuga: {
        chapter: 1,
        text: "Você dá as costas ao mar e caminha pela estrada de terra sem olhar para trás. A névoa fica para trás, e logo a voz de Dona Ivone, e os sinos, e o cheiro de sal." + P +
          "Na cidade grande você arruma trabalho, uma casa, amigos. Todos dizem que você tem sorte. Mas à noite, quando o silêncio cai, você ainda ouve, bem fraquinho, o badalar das boias." + P +
          "Anos depois, ainda sonha com sinos de boia e com uma menina molhada que pergunta, sem raiva, por que você foi embora.",
        ending: { type: "ruim", title: "Quem Foge da Maré" }
      },
      fim_afogado: {
        chapter: 3,
        text: "Suas forças acabam. O frio sobe pelos braços, pelo peito, e você já não sabe onde termina o corpo e começa a água. Tenta respirar e só encontra sal." + P +
          "O mar te acolhe sem pressa, quase com ternura. Mãos pálidas o seguram, e as vozes dos afogados, tantas, cantam uma canção sem fim. Você afunda devagar, olhando a superfície se afastar, cinza e distante." + P +
          "A luz do farol nunca se acende. E, no fundo, você finalmente descansa, como todos os outros.",
        ending: { type: "ruim", title: "Engolido pelo Mar" }
      }
    }
  };
  root.STORY = STORY;
  if (typeof module !== "undefined" && module.exports) module.exports = STORY;
})(typeof window !== "undefined" ? window : globalThis);
