export interface Resource {
  id: string;
  matomoId: number;
  title: string;
  image: any;
  category: string;
  content: string;
  externalResources?: Array<string>;
}

export const CATEGORIES = {
  DES_PETITS_PAS_POUR_SON_QUILIBRE_MENTAL: "Des petits pas pour son équilibre mental",
  LA_SANT_MENTALE_C_EST_QUOI: "La santé mentale c'est quoi ?",
  MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES: "Mieux comprendre les troubles psychiques",
  REP_RER_LES_SIGNES_DE_MAL_TRE: "Repérer les signes de mal-être",
};

export const RESOURCES_DATA: Resource[] = [
  {
    id: "247b537b-878d-4490-9d67-852e5fe89ed1",
    matomoId: 1,
    title: "Pas de santé sans santé mentale",
    image: require("../../../../assets/imgs/resources/Article1.png"),
    category: CATEGORIES.LA_SANT_MENTALE_C_EST_QUOI,
    content: `Prendre soin de sa santé, c’est aussi prendre soin de sa santé mentale.

Selon l’Organisation mondiale de la santé (OMS), la santé mentale est un « *état de bien-être qui permet à chacun de réaliser son potentiel, de faire face aux difficultés normales de la vie, de travailler avec succès et de manière productive, et d’être en mesure d’apporter une contribution à la communauté* ». Cependant, cette définition peut donner l’impression que le bien-être mental dépend uniquement de la réussite au travail. Or, on peut tout à fait se sentir bien, épanoui·e et utile, même sans avoir d’emploi.

La santé mentale fait partie intégrante de notre santé globale. **Il n’y a pas de santé sans santé mentale.** Longtemps taboue et mise de côté, elle reste pourtant aussi importante que la santé physique. Toutes deux sont étroitement liées : ce que l’on vit dans notre tête peut impacter notre corps, et inversement.

Oui, notre corps peut envoyer des signaux d'alerte. **Mais notre cerveau aussi.**`,
    externalResources: ["550e8400-e29b-41d4-a716-446655440001", "550e8400-e29b-41d4-a716-446655440002"],
  },
  {
    id: "ecfa5013-589a-484c-8c1e-a4f1ce24a6ce",
    matomoId: 2,
    title: "Mais au fait, avoir une bonne santé mentale : qu’est-ce que ça veut dire ?",
    image: require("../../../../assets/imgs/resources/Article2.png"),
    category: CATEGORIES.LA_SANT_MENTALE_C_EST_QUOI,
    content: `Nous avons toutes et tous besoin de prendre soin de notre santé mentale. **Même quand tout va bien.**\n\
\n\
Tout au long de notre vie, notre état mental varie du bien-être au mal-être, et vice-versa. Le monde ne se divise pas en deux catégories distinctes : les personnes en bonne santé mentale d’un côté versus celles avec un trouble de l’autre.\n\
\n\
**Quand on parle de santé mentale, on ne parle pas que de la maladie.** Même si je n’ai pas de trouble : est-ce que j’arrive tout de même à trouver du sens à ma vie ? Quel est le regard que je porte sur moi-même ? Est-ce que je me sens entouré·e ou profondément seul·e ?\n\
\n\
**On peut par ailleurs tout à fait vivre avec un trouble psychique et se sentir bien, utile et épanoui·e. À l’inverse, on peut se sentir mal, vide et isolé·e sans avoir de trouble diagnostiqué.**\n\
\n\
Une bonne santé mentale peut ainsi coexister avec un trouble psychique et l’absence de trouble ne garantit pas le bien-être mental !\n\
\n\
**Chaque personne tente donc, à l’aide de ses ressources, de trouver son propre équilibre.**\n\
\n\
Un équilibre qui lui fait du bien.`,
    externalResources: ["550e8400-e29b-41d4-a716-446655440001", "550e8400-e29b-41d4-a716-446655440003"],
  },
  {
    id: "e090c6c7-4618-4d37-98e7-c84e10c763de",
    matomoId: 3,
    title: "Pourquoi et comment observer sa propre santé mentale ?",
    image: require("../../../../assets/imgs/resources/Article3.png"),
    category: CATEGORIES.LA_SANT_MENTALE_C_EST_QUOI,
    content: `On parle souvent de santé mentale quand elle va mal, mais trop rarement de ce qu’on peut faire au quotidien pour la préserver. L’un des premiers réflexes utiles, c’est d’apprendre à s’observer **avec attention et bienveillance.**\n\
\n\
Cela ne veut pas dire **tout analyser, ni devenir obsédé·e** par son humeur ou ses pensées. Il s’agit plutôt de développer une forme **d’écoute intérieure**, pour mieux comprendre ce qui nous affecte et repérer les petits signaux qui montrent qu’on ne se sent peut-être pas bien… mais aussi identifier ce qui nous fait du bien.\n\
\n\
C’est justement ce que propose notre application ***Jardin Mental*** : un espace pour faire le point et suivre son état mental au fil du temps, même quand tout va bien.\n\
\n\
Quelques repères pour s’auto-observer :\n\
\n\
- **Les émotions** : suis-je souvent triste, irritable, anxieux·se ? Ou au contraire content·e, joyeux·se ?\n\
- **Le sommeil** : est-ce que je dors bien ? Est-ce que je me réveille reposé·e ? Ai-je recours à des médications sans ordonnance afin d'améliorer la qualité de mon sommeil ?\n\
- **L’énergie et la motivation** : est-ce que je me sens épuisé·e sans raison ? Est-ce que je trouve du plaisir dans mes activités quotidiennes, de loisirs ou de détente ?\n\
- **Le rapport aux autres** : ai-je tendance à m’isoler ? Quel est mon rapport aux autres (famille, amis, collègues…) ?\n\
- **Les pensées récurrentes** : est-ce qu'il m'arrive d'avoir des pensées négatives (sur moi-même, les autres, l'avenir) sans raison ? Des ruminations anxieuses ? Des inquiétudes? À quel point ces dernières freinent l'atteinte de mes objectifs ?\n\
- **Les consommations :** ai-je tendance à augmenter ou à perdre le contrôle de mes consommations de substances ? Est-ce que j'ai régulièrement tendance à m'automédiquer pour me sentir mieux ?\n\
\n\
En apprendre un peu plus sur le sujet, c’est déjà prendre soin de soi :)`,
    externalResources: ["550e8400-e29b-41d4-a716-446655440004"],
  },
  {
    id: "045e479c-11f3-435e-bffb-4364481ce5bd",
    matomoId: 4,
    title: "La santé mentale, ce n'est pas qu’une affaire personnelle",
    image: require("../../../../assets/imgs/resources/Article4.png"),
    category: CATEGORIES.LA_SANT_MENTALE_C_EST_QUOI,
    content: `Devons-nous porter, seul·es, toute la responsabilité de notre santé mentale ?\n\
\n\
**La réponse est non, évidemment.**\n\
\n\
Bien sûr, certains éléments relèvent de nous : notre histoire personnelle, notre personnalité et nos expériences **façonnent en partie notre équilibre psychique.**\n\
\n\
Mais réduire la santé mentale à l’individu seul·e, c’est négliger toute une dimension collective. D'autres influences dépassent largement l’échelle de la personne. **Le contexte social, politique, environnemental et économique joue un rôle déterminant dans notre bien-être psychologique.** L’environnement dans lequel nous vivons - que ce soit notre logement,  nos liens sociaux, notre accès à des ressources ou à des soins - peut tout autant protéger que fragiliser notre santé.\n\
\n\
Une chose est sûre : tous ces éléments internes et externes s'influencent les uns les autres.\n\
\n\
**La santé mentale, ce n’est pas que dans la tête. Elle concerne la société tout entière.**`,
    externalResources: ["550e8400-e29b-41d4-a716-446655440005", "550e8400-e29b-41d4-a716-446655440006", "550e8400-e29b-41d4-a716-446655440007"],
  },
  {
    id: "6cc770d0-5f72-4a2c-8bae-8de53a372b1c",
    matomoId: 5,
    title: "Prendre soin de sa santé mentale, oui… mais comment ?",
    image: require("../../../../assets/imgs/resources/Article5.png"),
    category: CATEGORIES.LA_SANT_MENTALE_C_EST_QUOI,
    content: `**La santé mentale, comme la santé physique, se cultive au quotidien.** Même lorsque tout va bien, adopter de bonnes habitudes de vie aide à préserver son équilibre. Être au contact de la nature, bien dormir, manger varié, bouger, aider les autres, éviter les conduites addictives, parler quand ça ne va pas… Chaque petit geste compte : même les actions qui paraissent anodines peuvent avoir un vrai impact positif sur notre santé. Ne les sous-estimez pas :)\n\
\n\
Et quand ça ne va pas ? **Ces habitudes peuvent soutenir, oui, mais elles ne suffisent pas toujours**. En cas de mal-être ou de troubles psychiques, il est essentiel de consulter un professionnel pour un accompagnement adapté *(voir nos rubriques aide et agir)*. Voici dix conseils de *Santé Publique France* pour prendre soin de sa santé mentale, sans pression, juste à son rythme.`,
    externalResources: ["550e8400-e29b-41d4-a716-446655440008", "550e8400-e29b-41d4-a716-446655440009", "550e8400-e29b-41d4-a716-446655440018"],
  },
  {
    id: "fb2975bb-596c-441f-b3bd-34bf50dfc303",
    matomoId: 6,
    title: "Santé mentale vs clichés : ces idées reçues à retirer de sa tête",
    image: require("../../../../assets/imgs/resources/Article_6_(1).png"),
    category: CATEGORIES.LA_SANT_MENTALE_C_EST_QUOI,
    content: `« Les personnes avec des troubles mentaux sont dangereuses », « la santé mentale, c’est juste une question de volonté», « aller voir un psy, c’est signe de faiblesse »… **Ces idées reçues sont encore trop répandues.**\n\
\n\
En France, la santé mentale reste un sujet tabou pour **7 personnes sur 10** *(Odoxa, Festival Pop&Psy, 2023)*.\n\
\n\
Ces préjugés continuent d’alimenter la stigmatisation et peuvent entraîner rejet, isolement ou discrimination pour celles et ceux qui en souffrent. Voici quelques ressources pour vous aider à **déconstruire vos clichés** et porter un regard plus bienveillant, sur les autres mais aussi sur vous-même !`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440010",
      "550e8400-e29b-41d4-a716-446655440012",
      "550e8400-e29b-41d4-a716-446655440013",
      "550e8400-e29b-41d4-a716-446655440014",
    ],
  },
  {
    id: "19df5d36-e82d-457b-8354-c3f31f85875e",
    matomoId: 7,
    title: "“Je ne me sens pas bien” : ces signes qui méritent mon attention",
    image: require("../../../../assets/imgs/resources/Group_52.png"),
    category: CATEGORIES.REP_RER_LES_SIGNES_DE_MAL_TRE,
    content: `Reconnaître que l’on ne se sent pas bien **est déjà une étape importante**. Il n’est pas toujours évident de prendre du recul sur sa santé mentale ou d’en repérer des changements.\n\
\n\
Certains signes peuvent tout de même nous alerter.\n\
\n\
Nous connaissons toutes et tous des périodes de stress, d’anxiété et de mal-être. Souvent, ces émotions s’atténuent avec le temps, grâce au soutien de nos proches ou à l’évolution de certaines situations. Mais parfois, **elles s’installent plus durablement** et deviennent plus difficiles à gérer. Qu’elle soit passagère ou plus persistante, toute forme de souffrance mérite d’être prise au sérieux.\n\
\n\
Perte de l’appétit ou au contraire consommation excessive de nourriture, difficultés à exécuter des tâches quotidiennes, mauvaise estime de soi, irritabilité…**Plus tôt on repère ces signes, plus il est facile de trouver des solutions adaptées** *(voir nos rubriques agir et chercher de l’aide)*.\n\
\n\
Et même si on pense parfois qu’il s’agit de la seule solution : ignorer ou minimiser ce que l’on ressent ne permet pas forcément d’aller mieux. Identifier un mal-être, c’est\n\
\n\
**se donner la chance (et le temps !)** d’agir avant qu’il ne s’aggrave. Voici des ressources pour vous aider à être plus attentif·ve à certains signaux :`,
    externalResources: ["550e8400-e29b-41d4-a716-446655440004", "550e8400-e29b-41d4-a716-446655440015", "550e8400-e29b-41d4-a716-446655440016"],
  },
  {
    id: "29ebc47a-27ee-4d6e-b0fa-9d20c5c59c77",
    matomoId: 8,
    title: "Se sentir mal, ça arrive à tout le monde : à quel moment s’inquiéter ?",
    image: null,
    category: CATEGORIES.REP_RER_LES_SIGNES_DE_MAL_TRE,
    content: `**Tout le monde traverse des périodes de tristesse sans que cela soit forcément inquiétant.**\n\
\n\
Ces émotions peuvent être liées à des événements du quotidien : une dispute, une rupture, des difficultés professionnelles ou scolaires…Il n’est donc pas toujours nécessaire **d’associer ces états** à **des troubles psychiques**. Les variations d’humeur, par exemple, sont fréquentes et font partie de la vie. Avoir des hauts et des bas au cours d'une journée **ne relève pas**, en soi, d’un trouble comme la bipolarité.\n\
\n\
Parfois, le mal-être s'atténue progressivement avec le temps, le soutien de l’entourage ou des changements de situation. Dans d’autres cas, il persiste. Et quand il devient pesant à vivre et que nos ressources ou celles de notre entourage ne suffisent plus ou pas, **c’est le signal qu’il faut chercher du soutien** *(voir nos rubriques « Agir » et « Chercher de l’aide »).*\n\
\n\
Finalement, ce qui distingue vraiment une émotion passagère d’un mal-être qui mérite une attention particulière, c’est surtout la durée, l’intensité, et l’impact sur la vie quotidienne.`,
    externalResources: ["550e8400-e29b-41d4-a716-446655440018", "550e8400-e29b-41d4-a716-446655440019"],
  },
  {
    id: "ac50b156-3215-435a-b622-285533b3f9a3",
    matomoId: 9,
    title: "Baisse de moral, mal-être ou trouble : où se situer ?",
    image: null,
    category: CATEGORIES.MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES,
    content: `C’est un fait : notre santé mentale évolue constamment et peut passer par différents états. Mais elle repose avant tout sur plusieurs dimensions qui peuvent toutes et tous nous concerner :\n\
\n\
- **Des variations émotionnelles et physiologiques** (stress, fatigue, tristesse…) qui sont fréquentes et passagères pour tout le monde.\n\
- **Une détresse psychologique réactionnelle liée à des événements de vie difficiles** (deuil, rupture, surcharge...). Petit point de vigilance à garder en tête : dans certaines circonstances (**isolement, une absence de soutien, des conditions de vie précaires**…), cette détresse peut faire basculer la personne dans un trouble psychique surtout si elle n’est **pas considérée** et qu’elle devient **trop envahissante** au quotidien.\n\
- **Une souffrance psychologique liée directement à un trouble psychique**, comme un trouble anxieux sévère, un trouble obsessionnel compulsif ou encore une schizophrénie.\n\
\n\
On parle de **trouble psychique** lorsque l'état de bien-être est perturbé. Le trouble affecte significativement le **comportement, les pensées, les émotions, le fonctionnement général et** les **relations sociales** d’une personne. Ce sont tous les pans de la vie quotidienne qui sont impactés de manière intense.\n\
\n\
Sans minimiser et hiérarchiser les souffrances de chacun·e, il est important de distinguer un mal-être ponctuel d’un trouble psychique pour mieux appréhender sa santé mentale.`,
    externalResources: ["550e8400-e29b-41d4-a716-446655440019", "550e8400-e29b-41d4-a716-446655440020"],
  },
  {
    id: "e829c45f-542d-49d3-98c7-c005930d3af9",
    matomoId: 10,
    title: "Mettre un mot sur ce que je vis : pourquoi (et quand) c’est utile ?",
    image: null,
    category: CATEGORIES.MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES,
    content: `Réussir à mettre un mot sur ce que l’on vit peut être **un vrai soulagement** : cela aide à mieux comprendre ce qui se passe en soi, **à ne pas se sentir seul·e, nourrir un sentiment d’appartenance à une communauté** (c’est précieux !) et à accéder à des soins adaptés. Cependant un diagnostic posé par un médecin n’est pas une **étiquette**. Il ne résume pas qui vous êtes (et heureusement !).\n\
\n\
Aujourd’hui, **de nombreuses personnes** cherchent à poser elles-mêmes un diagnostic sur ce qu’elles traversent. C’est une démarche compréhensible, souvent motivée par le besoin de sens ou de reconnaissance. En parler avec des proches de confiance peut déjà faire beaucoup de bien, et constitue **un véritable soutien**.\n\
\n\
**Mais il est important de rester vigilant·e** : tenter de tout comprendre seul·e, sans accompagnement, peut parfois conduire à des erreurs d’interprétation surtout face à **la désinformation** qui circule en ligne sur ces sujets. On peut alors se retrouver **enfermé·e** dans une case qui ne reflète pas vraiment ce que l’on vit **ou passer à côté** d’une aide plus adaptée.\n\
\n\
**Se définir** précisément peut aider (et ce n’est pas nécessaire pour tout le monde !) mais il reste essentiel de ne pas **se réduire à un mot ou à un trouble**.\n\
\n\
Qu’il s’agisse d’un échange avec un·e professionnel·le, d’un dialogue avec un proche ou d’une recherche personnelle, l’important est de ne pas rester seul·e. S’entourer, parler, partager ce que l’on vit peut faire une vraie différence\n\
\n\
**avant, pendant, et après un diagnostic.**`,
    externalResources: ["550e8400-e29b-41d4-a716-446655440021", "550e8400-e29b-41d4-a716-446655440022"],
  },
  {
    id: "978d0d1d-e4e3-4ddd-b15a-0a128fbfde24",
    matomoId: 11,
    title: "Dépression, anxiété, bipolarité : faire le point sur les différents troubles",
    image: null,
    category: CATEGORIES.MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES,
    content: `On vous l’accorde : **pas toujours simple** de s’y retrouver entre les différents troubles.\n\
\n\
Entre leurs définitions parfois similaires et leurs comorbidités - c’est-à-dire la possibilité d’avoir plusieurs troubles en même temps chez une même personne - il est facile de se sentir un peu perdu·e. Ajoutez à cela un mélange de confusion et d’idées reçues, et v**ous obtenez un terreau idéal pour la désinformation !**\n\
\n\
Pourtant, ces troubles sont bien plus fréquents qu’on ne le pense : selon l’Organisation Mondiale de la Santé (OMS), **une personne sur quatre sera touchée par un trouble psychique à un moment de sa vie.** Les plus répandus ? Les troubles dépressifs, les troubles anxieux, les troubles bipolaires, les troubles schizophréniques, ou encore les troubles addictifs.\n\
\n\
**Quelle est la définition de chacun de ces troubles et où chercher l’information ?**\n\
\n\
Pour mieux comprendre ce que ces troubles impliquent au quotidien, *Jardin Mental* vous propose une sélection de ressources fiables pensées comme des **outils de compréhension**. Elles permettent de mieux se repérer et de mettre des mots sur ce qu’on ressent.\n\
\n\
**Mais attention à un écueil fréquent** : la découverte des descriptions de troubles et de leurs symptômes peut facilement donner l’impression **de se reconnaître** dans chacun d’eux, au risque de **s’identifier un peu trop vite.** Ces ressources ne remplacent évidemment pas l’échange avec un·e professionnel·le de santé. **Chaque situation est unique, et le vécu des troubles dépasse souvent les catégories toutes faites.**\n\
\n\
Rien n’est figé, rien n’est définitif : la santé mentale est mouvante et peut changer avec le temps et les soins appropriés.`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440024",
      "550e8400-e29b-41d4-a716-446655440025",
      "550e8400-e29b-41d4-a716-446655440026",
      "550e8400-e29b-41d4-a716-446655440027",
      "550e8400-e29b-41d4-a716-446655440028",
      "550e8400-e29b-41d4-a716-446655440029",
    ],
  },
  {
    id: "773847cf-3509-42b2-ac1e-dbd5e3785ff2",
    matomoId: 12,
    title: "Santé mentale à tous les âges : des troubles fréquents à chaque étape de vie",
    image: null,
    category: CATEGORIES.MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES,
    content: `**À tout âge de la vie**, il est possible de traverser des périodes de fragilité. Que l’on soit enfant, adolescent·e, adulte ou senior, nos besoins évoluent, tout comme les formes que peuvent prendre les **troubles psychiques**.\n\
\n\
Certaines difficultés sont plus fréquentes selon les étapes de vie :\n\
\n\
- **Enfants :** Les enfants peuvent ressentir de l’anxiété, avoir des troubles du sommeil ou du comportement. Ces signes méritent une attention particulière, car ils peuvent affecter leur bien-être global et leur développement.\n\
- **Adolescent·es :** L’adolescence est une période de grands bouleversements. L’anxiété, la dépression, les troubles alimentaires ou les comportements d'automutilation peuvent apparaître. Les difficultés peuvent être profondes, même si elles sont peu exprimées.\n\
- **Jeunes adultes :** Entre études, débuts professionnels et construction de soi, les jeunes adultes peuvent faire face à du stress, des troubles de l’humeur, ou des conduites addictives. C’est souvent un moment de bascule important.\n\
- **Adultes :** La santé mentale peut être mise à mal par un quotidien exigeant : isolement, culte de la performance, rythme de vie soutenu. Le burn-out, le stress chronique ou la dépression sont des réalités fréquentes.\n\
- **Seniors :** Avec l’avancée en âge, la solitude, des symptômes dépressifs ou des troubles cognitifs peuvent apparaître. Ces difficultés sont parfois invisibles, mais ont un impact réel sur la qualité de vie.`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440031",
      "550e8400-e29b-41d4-a716-446655440032",
      "550e8400-e29b-41d4-a716-446655440035",
      "550e8400-e29b-41d4-a716-446655440036",
      "550e8400-e29b-41d4-a716-446655440037",
      "550e8400-e29b-41d4-a716-446655440038",
      "550e8400-e29b-41d4-a716-446655440039",
      "550e8400-e29b-41d4-a716-446655440048",
      "550e8400-e29b-41d4-a716-446655440049",
      "550e8400-e29b-41d4-a716-446655440047",
    ],
  },
  {
    id: "539b5df6-e21e-4f99-a865-d77e111dc6a1",
    matomoId: 13,
    title: "Troubles dépressifs : on fait le point",
    image: null,
    category: CATEGORIES.MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES,
    content: `**La dépression, ce n’est pas juste « être triste »**. C’est une véritable souffrance psychique qui s’installe et qui touche toutes les strates de la vie quotidienne  : l’énergie, le sommeil, l’envie, l’appétit, l’estime de soi. Des pensées envahissantes et des idées suicidaires peuvent encombrer l’esprit. La personne concernée peut se sentir vide, incapable, isolée, **même sans raison apparente.**\n\
\n\
La dépression peut survenir progressivement ou de façon brutale, et durer plusieurs semaines ou plusieurs mois. **Elle n’est pas toujours liée à un événement précis et peut toucher n’importe qui, même sans antécédent**. Avoir un épisode dépressif ne signifie pas que la personne est ou restera déprimée à vie.\n\
\n\
Et bien sûr, petit rappel essentiel : il ne s’agit en rien d'un signe de faiblesse !\n\
\n\
*La Maison Perchée, Psycom et PSSM* proposent des guides complets pour mieux comprendre le trouble et trouver des solutions adaptées.\n\
\n\
*(voir aussi nos rubriques agir et chercher de l’aide)*`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440040",
      "550e8400-e29b-41d4-a716-446655440055",
      "550e8400-e29b-41d4-a716-446655440054",
      "550e8400-e29b-41d4-a716-446655440053",
      "550e8400-e29b-41d4-a716-446655440052",
      "550e8400-e29b-41d4-a716-446655440067",
      "550e8400-e29b-41d4-a716-446655440066",
      "550e8400-e29b-41d4-a716-446655440065",
      "550e8400-e29b-41d4-a716-446655440063",
      "550e8400-e29b-41d4-a716-446655440064",
      "550e8400-e29b-41d4-a716-446655440041",
      "550e8400-e29b-41d4-a716-446655440072",
    ],
  },
  {
    id: "38948091-ab45-42d8-8ffb-ab9bacfe8d91",
    matomoId: 14,
    title: "Troubles anxieux et TOC : on fait le point",
    image: null,
    category: CATEGORIES.MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES,
    content: `L’anxiété devient un trouble quand elle prend **trop de place** dans la vie quotidienne.\n\
\n\
Elle peut se manifester sous différentes formes :\n\
\n\
- L’**anxiété généralisée** : inquiétudes permanentes et incontrôlables, souvent sans raison précise.\n\
- Les **attaques de panique** : épisodes soudains de peur intense (crises d’angoisses) accompagnés de symptômes physiques (palpitations, sueurs, sensation d’étouffer).\n\
- Les **phobies** : peurs irrationnelles liées à une situation ou un objet.\n\
- Le **trouble obsessionnel-compulsif (TOC)** : présence d’obsessions (pensées intrusives, angoissantes) et de compulsions (gestes ou rituels répétitifs pour tenter de les apaiser).\n\
- **L’anxiété sociale** : peur du jugement négatif de l’autre et anxiété de performance\n\
\n\
Il est tout à fait possible d’apprendre à mieux vivre avec l’anxiété. Avec les bons outils et un accompagnement adapté, elle peut devenir plus gérable au quotidien et prendre moins de place.\n\
\n\
*La Maison Perchée, Psycom et PSSM* proposent des guides complets pour mieux comprendre le trouble et trouver des solutions adaptées.\n\
\n\
*(voir aussi nos rubriques agir et chercher de l’aide)*`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440071",
      "550e8400-e29b-41d4-a716-446655440070",
      "550e8400-e29b-41d4-a716-446655440074",
      "550e8400-e29b-41d4-a716-446655440077",
      "550e8400-e29b-41d4-a716-446655440076",
      "550e8400-e29b-41d4-a716-446655440075",
      "550e8400-e29b-41d4-a716-446655440073",
      "550e8400-e29b-41d4-a716-446655440157",
      "550e8400-e29b-41d4-a716-446655440158",
      "550e8400-e29b-41d4-a716-446655440159",
      "550e8400-e29b-41d4-a716-446655440069",
    ],
  },
  {
    id: "01976039-c56a-4918-b3aa-236bb1847421",
    matomoId: 15,
    title: "Troubles addictifs : on fait le point",
    image: null,
    category: CATEGORIES.MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES,
    content: `L’addiction, ce n’est pas juste **un manque de contrôle**  : c’est un trouble aux causes multiples.\n\
\n\
Les troubles addictifs incluent les consommations problématiques de substances (alcool, cannabis, tabac, médicaments, cocaïne, kétamine, protoxyde d'azote, etc.) mais aussi de certaines pratiques comme le jeu ou les achats compulsifs. L’addiction repose sur un **besoin irrépressible de consommer** malgré les conséquences négatives.\n\
\n\
**On parle de dépendance** lorsque la personne perd le contrôle sur sa consommation ou son comportement, malgré les conséquences négatives que cela peut entraîner.  Cela s’explique notamment par **des modifications** dans le cerveau. La personne concernée à des difficultés pour réguler sa consommation ou son comportement. Ce qui peut commencer comme une recherche de plaisir ou une tentative d’échapper à un mal-être intérieur se transforme alors **en comportement compulsif**, difficile, à maîtriser.\n\
\n\
L’addiction est donc **une véritable affection médicale** et non un simple manque de volonté.\n\
\n\
*PSSM et Psycom* proposent des guides complets pour mieux comprendre le trouble et trouver des solutions adaptées.\n\
\n\
*(voir aussi nos rubriques agir et chercher de l’aide)*`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440040",
      "550e8400-e29b-41d4-a716-446655440055",
      "550e8400-e29b-41d4-a716-446655440054",
      "550e8400-e29b-41d4-a716-446655440053",
      "550e8400-e29b-41d4-a716-446655440052",
      "550e8400-e29b-41d4-a716-446655440067",
      "550e8400-e29b-41d4-a716-446655440066",
      "550e8400-e29b-41d4-a716-446655440065",
      "550e8400-e29b-41d4-a716-446655440063",
      "550e8400-e29b-41d4-a716-446655440064",
      "550e8400-e29b-41d4-a716-446655440041",
      "550e8400-e29b-41d4-a716-446655440072",
    ],
  },
  {
    id: "1882aee0-9ff3-4c92-aa4a-bc43475bc3c9",
    matomoId: 16,
    title: "Troubles des conduites alimentaires : on fait le point",
    image: null,
    category: CATEGORIES.MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES,
    content: `Quand l’alimentation devient source d’angoisse ou de contrôle, c’est peut-être le signe que le rapport à la nourriture est compliqué.\n\
\n\
Anorexie, boulimie, hyperphagie… Les troubles des conduites alimentaires sont souvent liés à l’image de soi, au besoin de maîtriser et de canaliser des émotions qu’on ne sait plus gérer autrement. **Contrairement aux idées reçues**, **un TCA ne se voit pas forcément.**\n\
\n\
Ils en existent plusieurs formes :\n\
\n\
- **L’anorexie mentale** : une restriction alimentaire volontaire, une peur intense de grossir, malgré un poids très bas.\n\
- **La boulimie** : des crises où on mange en très grande quantité, suivies de comportements pour compenser (vomissements, jeûnes, excès de sport).\n\
- **L’hyperphagie** : des crises alimentaires sans compensation, souvent associées à un mal-être.\n\
\n\
Ces troubles peuvent avoir de graves conséquences physiques (carences, troubles digestifs, fatigue) et psychiques (isolement, dépression, faible estime de soi). Il existe des accompagnements adaptés pour aider à sortir d’un trouble alimentaire : avec le bon soutien, une amélioration est possible, petit à petit.\n\
\n\
*PSSM et Psycom* proposent des guides complets pour mieux comprendre le trouble et trouver des solutions adaptées.\n\
\n\
*(voir aussi nos rubriques agir et chercher de l’aide)*`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440114",
      "550e8400-e29b-41d4-a716-446655440113",
      "550e8400-e29b-41d4-a716-446655440112",
      "550e8400-e29b-41d4-a716-446655440115",
      "550e8400-e29b-41d4-a716-446655440116",
      "550e8400-e29b-41d4-a716-446655440062",
      "550e8400-e29b-41d4-a716-446655440117",
    ],
  },
  {
    id: "da30d699-ca75-4f9f-ba0a-049b09272f99",
    matomoId: 17,
    title: "Troubles bipolaires : on fait le point",
    image: null,
    category: CATEGORIES.MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES,
    content: `Vivre avec des troubles bipolaires, c’est avoir **des variations extrêmes de l’humeur, de l’énergie et du comportement.**\n\
\n\
La personne concernée alterne entre des **phases dépressives** (fatigue, perte d’intérêt) et des **phases maniaques ou hypomaniaques** (euphorie inhabituelle, agitation, comportements impulsifs).\n\
\n\
Ces variations d’humeur ne sont pas toujours visibles de l’extérieur, mais elles peuvent, de façon considérable, **désorganiser** la vie personnelle, sociale, ou professionnelle. Il s’agit d’un trouble souvent long à diagnostiquer mais il existe, aujourd’hui, des repères pour mieux l’identifier.\n\
\n\
Avec un accompagnement adapté et un suivi médical régulier, il est tout à fait possible de vivre une vie normale, active et épanouie, même en étant atteint·e de bipolarité. La prise en charge permet de réduire les symptômes et d’améliorer considérablement la qualité de vie.\n\
\n\
*(voir aussi nos rubriques agir et chercher de l’aide)*\n\
\n\
*La Maison Perchée et Psycom*\n\
\n\
proposent des guides complets pour mieux comprendre le trouble et trouver des solutions adaptées.`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440106",
      "550e8400-e29b-41d4-a716-446655440107",
      "550e8400-e29b-41d4-a716-446655440060",
      "550e8400-e29b-41d4-a716-446655440108",
      "550e8400-e29b-41d4-a716-446655440045",
      "550e8400-e29b-41d4-a716-446655440109",
      "550e8400-e29b-41d4-a716-446655440110",
      "550e8400-e29b-41d4-a716-446655440111",
    ],
  },
  {
    id: "7a925764-20e7-4bf6-af95-e606b5f8a10a",
    matomoId: 18,
    title: "Troubles de stress post-traumatique : on fait le point",
    image: null,
    category: CATEGORIES.MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES,
    content: `Après un événement violent ou menaçant - une agression, un accident, une catastrophe, une guerre, ou même des violences répétées - certaines personnes développent un **état de stress post-traumatique**. Les symptômes peuvent apparaître rapidement ou des semaines plus tard, et se manifestent par :\n\
\n\
- des **flashbacks** (revivre la scène sans le vouloir),\n\
- des **cauchemars récurrents**,\n\
- une **hyper vigilance** constante,\n\
- une **anxiété intense**,\n\
- des **évitements** (de lieux, de personnes, de situations liées au trauma).\n\
\n\
Le corps et l’esprit restent comme bloqués dans un état d’alerte, même longtemps après que le danger soit passé. Ce trouble concerne aussi bien les personnes directement exposées au traumatisme que les témoins.\n\
\n\
Il est possible d’aller mieux. Des accompagnements spécifiques existent pour aider à sortir de cet état. Avec le temps, le soutien et les bons outils, il est possible d’apaiser les symptômes et de retrouver un sentiment de sécurité.\n\
\n\
*Pyscom et PSSM* proposent des guides complets pour mieux comprendre le trouble et trouver des solutions adaptées.\n\
\n\
*(voir aussi nos rubriques agir et chercher de l’aide)*`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440105",
      "550e8400-e29b-41d4-a716-446655440104",
      "550e8400-e29b-41d4-a716-446655440103",
      "550e8400-e29b-41d4-a716-446655440102",
      "550e8400-e29b-41d4-a716-446655440101",
      "550e8400-e29b-41d4-a716-446655440100",
      "550e8400-e29b-41d4-a716-446655440097",
      "550e8400-e29b-41d4-a716-446655440098",
      "550e8400-e29b-41d4-a716-446655440099",
    ],
  },
  {
    id: "7bb8b47f-0758-4463-a313-7441b922f461",
    matomoId: 19,
    title: "Les troubles schizophréniques : on fait le point",
    image: null,
    category: CATEGORIES.MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES,
    content: `La schizophrénie est un trouble qui **modifie la perception** de la réalité.\n\
\n\
Elle peut se manifester par des **hallucinations** (voir, entendre ou ressentir des choses qui n’existent pas), **des idées délirantes** (avec des croyances erronées, souvent paranoïaques ou mystiques), **une désorganisation de la pensée** (discours confus, incohérent) et **un repli social**.\n\
\n\
Contrairement à certains clichés, **les troubles schizophréniques ne signifient pas avoir une double personnalité, ni être une personne dangereuse.** Elle expose surtout les personnes concernées à des risques pour elles-mêmes. Ce sont des troubles complexes, qui se manifestent différemment selon les personnes concernées.\n\
\n\
Avec un accompagnement adapté et un suivi médical régulier, il est tout à fait possible de vivre une vie normale, active et épanouie.\n\
\n\
*La Maison Perchée, Psycom et PSSM* proposent des guides complets pour mieux comprendre le trouble et trouver des solutions adaptées.`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440091",
      "550e8400-e29b-41d4-a716-446655440092",
      "550e8400-e29b-41d4-a716-446655440093",
      "550e8400-e29b-41d4-a716-446655440094",
      "550e8400-e29b-41d4-a716-446655440059",
      "550e8400-e29b-41d4-a716-446655440095",
      "550e8400-e29b-41d4-a716-446655440096",
    ],
  },
  {
    id: "98febe81-309d-40ba-b234-f5b9bc995fd1",
    matomoId: 20,
    title: "Troubles de la personnalité borderline : on fait le point",
    image: null,
    category: CATEGORIES.MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES,
    content: `Vivre avec un trouble de la personnalité borderline, **c’est ressentir les choses très fort, tout le temps.**\n\
\n\
Ce trouble se manifeste par une **instabilité émotionnelle**, une image de soi fluctuante, des relations intenses et conflictuelles, une **peur de l’abandon**, de l’**impulsivité** (achats, sexualité, alimentation…) et parfois des comportements d’automutilation.\n\
\n\
Les émotions sont vécues **de manière très intense**, souvent difficile à réguler.\n\
\n\
Il existe des thérapies et des accompagnements spécifiques qui aident à mieux comprendre ses émotions et à retrouver un équilibre au quotidien.\n\
\n\
*La Maison Perchée et Psycom* proposent des guides complets pour mieux comprendre le trouble et trouver des solutions adaptées.`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440085",
      "550e8400-e29b-41d4-a716-446655440086",
      "550e8400-e29b-41d4-a716-446655440087",
      "550e8400-e29b-41d4-a716-446655440088",
      "550e8400-e29b-41d4-a716-446655440089",
      "550e8400-e29b-41d4-a716-446655440090",
    ],
  },
  {
    id: "ecab9657-b7e8-46d2-baf6-89437332e4d9",
    matomoId: 21,
    title: "Automutilation : on fait le point",
    image: null,
    category: CATEGORIES.MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES,
    content: `Quand la douleur **devient difficile à gérer,** certaines personnes s’infligent des blessures physiques, sans chercher à mettre fin à leurs jours.\n\
\n\
Ce geste, souvent difficile à comprendre de l’extérieur, permet aux personnes qui en ont recours de soulager une douleur émotionnelle, de se "punir", ou de reprendre le contrôle. **Il s’agit souvent d’une façon d’exprimer un mal-être profond quand les mots ne suffisent plus.**\n\
\n\
Pour autant, il est tout de même possible de s’en sortir : des accompagnements existent pour **comprendre** ce qui se joue derrière ces gestes et trouver d’autres moyens **d’apaiser sa souffrance.**\n\
\n\
*PSSM propose un guide* complet pour mieux comprendre l’automutilation  et trouver des solutions adaptées.`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440081",
      "550e8400-e29b-41d4-a716-446655440082",
      "550e8400-e29b-41d4-a716-446655440083",
      "550e8400-e29b-41d4-a716-446655440084",
    ],
  },
  {
    id: "9baa4577-5dfc-4d33-aa00-f267806f553d",
    matomoId: 22,
    title: "Témoignages : Écouter pour comprendre, récits de personnes vivant avec un trouble",
    image: null,
    category: CATEGORIES.MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES,
    content: `La santé mentale, ce n’est pas seulement des définitions médicales ou des explications théoriques : **ce sont (surtout !) des vies, des histoires, des parcours**. Chez *Jardin Mental*, nous pensons qu’entendre la voix des personnes concernées par un trouble est essentiel pour mieux apprendre de l’autre.\n\
\n\
Nous vous proposons ici une sélection de ressources qui permettent d’écouter des récits à la première personne et de comprendre, de l’intérieur, ce que signifie vivre avec un trouble.\n\
\n\
PS : Ces témoignages sont très riches, mais peuvent parfois être intenses et difficiles à écouter. Si vous êtes directement concerné·e, prenez le temps de choisir le bon moment pour les découvrir, à votre rythme.\n\
\n\
Votre bien-être passe avant tout :)`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440030",
      "550e8400-e29b-41d4-a716-446655440033",
      "550e8400-e29b-41d4-a716-446655440034",
      "550e8400-e29b-41d4-a716-446655440042",
      "550e8400-e29b-41d4-a716-446655440043",
      "550e8400-e29b-41d4-a716-446655440044",
      "550e8400-e29b-41d4-a716-446655440045",
      "550e8400-e29b-41d4-a716-446655440046",
      "550e8400-e29b-41d4-a716-446655440050",
      "550e8400-e29b-41d4-a716-446655440051",
      "550e8400-e29b-41d4-a716-446655440053",
      "550e8400-e29b-41d4-a716-446655440056",
      "550e8400-e29b-41d4-a716-446655440057",
      "550e8400-e29b-41d4-a716-446655440059",
      "550e8400-e29b-41d4-a716-446655440060",
      "550e8400-e29b-41d4-a716-446655440061",
      "550e8400-e29b-41d4-a716-446655440062",
    ],
  },
  {
    id: "674603a6-05b6-46f9-8c54-0416a3adbe50",
    matomoId: 22,
    title: "Bien dormir, bien dans son corps (et sa tête!)",
    image: null,
    category: CATEGORIES.DES_PETITS_PAS_POUR_SON_QUILIBRE_MENTAL,
    content: `**Quand le sommeil se dégrade, les répercussions sur l’équilibre psychique peuvent se faire sentir rapidement** : irritabilité, baisse de motivation, troubles de la concentration ou montée de l’anxiété. Ce lien fonctionne aussi dans l’autre sens. Un stress persistant, un trouble de l’humeur ou anxieux, ou un épisode dépressif peuvent perturber l’endormissement, fragmenter les nuits ou provoquer **des réveils précoces ou répétés**. Ce cercle complexe, où troubles du sommeil et mal-être ou troubles psychiques s’entretiennent, peut s’aggraver si les difficultés persistent.\n\
\n\
**La bonne nouvelle, c’est qu’il est possible de le rompre avec un accompagnement adapté.**\n\
\n\
Le sommeil joue un rôle fondamental pour le corps et l’esprit. **Il réduit la fatigue et le stress, améliore la mémoire, la concentration, l’humeur et la régulation de l’appétit.** Il contribue aussi à prévenir de nombreuses maladies comme l’obésité, le diabète de type 2, l’hypertension ou les maladies cardiovasculaires, en intervenant sur des fonctions vitales telles que la production hormonale, la circulation sanguine, la respiration ou le système immunitaire.\n\
\n\
**Bien sûr, les difficultés de sommeil peuvent aussi être liées à des facteurs externes.** Des conditions environnementales difficiles - bruit, températures extrêmes, promiscuité, précarité, insécurité - peuvent perturber le repos.\n\
\n\
Il est important de prendre en compte ces déterminants pour mieux comprendre son sommeil.`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440133",
      "550e8400-e29b-41d4-a716-446655440134",
      "550e8400-e29b-41d4-a716-446655440135",
      "550e8400-e29b-41d4-a716-446655440136",
      "550e8400-e29b-41d4-a716-446655440137",
      "550e8400-e29b-41d4-a716-446655440138",
      "550e8400-e29b-41d4-a716-446655440139",
      "550e8400-e29b-41d4-a716-446655440140",
    ],
  },
  {
    id: "0dffe681-74a2-46ed-8a3d-44506d36173d",
    matomoId: 23,
    title: "La nuit porte (vraiment) conseil",
    image: null,
    category: CATEGORIES.DES_PETITS_PAS_POUR_SON_QUILIBRE_MENTAL,
    content: `Le sommeil n’est pas une simple pause : **c’est un moment essentiel où le corps et le cerveau se restaurent.**\n\
\n\
Chaque nuit, notre cerveau traverse plusieurs cycles d’environ quatre-vingt dix minutes, alternant phases de sommeil léger, profond, et paradoxal.\n\
\n\
Le sommeil profond est une véritable source de régénération : **il joue un rôle majeur dans la récupération physique, renforce notre système immunitaire et permet au corps d’éliminer les toxines accumulées**.\n\
\n\
Le sommeil paradoxal, quant à lui, est la phase où les rêves sont les plus nombreux. **C’est aussi à ce moment-là que le cerveau traite et apaise nos émotions, consolide nos souvenirs et contribue à  notre équilibre émotionnel.**\n\
\n\
**Mais le sommeil, ce n’est pas sur commande.**\n\
\n\
Il survient lorsque le corps **en a réellement besoin**, guidé par une horloge biologique sensible à la lumière du jour et au rythme de nos journées. Lorsque la nuit tombe, la mélatonine, cette hormone du sommeil, signale **progressivement** au corps qu’il est temps de se préparer au repos.\n\
\n\
**Prendre soin de son sommeil, quand cela est possible, est important pour permettre au corps et à l’esprit de se réguler et de se répare**\n\
\n\
r. Toutefois, chacun·e fait au mieux selon sa situation, qui peut parfois rendre difficile la mise en place de conditions favorables à l’endormissement. Bruit, environnement, contraintes de logement ou horaires atypiques sont autant de réalités qui peuvent\n\
\n\
**influencer la qualité du sommeil.**`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440141",
      "550e8400-e29b-41d4-a716-446655440142",
      "550e8400-e29b-41d4-a716-446655440143",
      "550e8400-e29b-41d4-a716-446655440144",
    ],
  },
  {
    id: "421212e0-2812-4a72-a073-cba746444c36",
    matomoId: 24,
    title: "Troubles du sommeil : de quoi parle-t-on vraiment ?",
    image: null,
    category: CATEGORIES.DES_PETITS_PAS_POUR_SON_QUILIBRE_MENTAL,
    content: `**Il est normal de traverser, à certains moments de la vie, des périodes de sommeil difficile**.\n\
\n\
Contraintes de logements, stress, changements de rythme, événements de vie… Ces situations peuvent entraîner des nuits agitées ou des difficultés d’endormissement.\n\
\n\
Parmi les troubles reconnus, **l’insomnie est le plus courant**. Beaucoup de personnes pensent être insomniaques, cependant, des troubles occasionnels **ne suffisent pas à poser un véritable diagnostic**. Pour qu’il soit établi, les perturbations du sommeil doivent survenir au minimum **trois fois par semaine, pendant plus de trois mois**, et impacter significativement le quotidien (fatigue, baisse de concentration, irritabilité, etc.).\n\
\n\
D’autres troubles existent et nécessitent souvent une évaluation médicale :\n\
\n\
- **Le syndrome des jambes sans repos** se caractérise par une sensation désagréable dans les jambes, accompagnée d’une envie irrésistible de les bouger.\n\
- **L’apnée du sommeil** provoque des arrêts temporaires de la respiration pendant le sommeil, entraînant une mauvaise oxygénation et un sommeil fragmenté.\n\
- **L’hypersomnie** se traduit par une somnolence excessive pendant la journée, même après une nuit complète de sommeil.\n\
- **Les parasomnies** regroupent des comportements inhabituels pendant le sommeil, comme le somnambulisme, les terreurs nocturnes ou le bruxisme (grincement des dents).\n\
\n\
**Ressentir ponctuellement une mauvaise qualité de sommeil ne signifie pas automatiquement que l’on souffre d’un trouble durable**\n\
\n\
. Cependant, si ces difficultés deviennent récurrentes ou impactent significativement le quotidien, il est recommandé d’en parler à un professionnel de santé. Les thérapies comportementales et cognitives peuvent constituer une ressource pour traiter le trouble de l’insomnie.`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440142",
      "550e8400-e29b-41d4-a716-446655440143",
      "550e8400-e29b-41d4-a716-446655440144",
      "550e8400-e29b-41d4-a716-446655440145",
      "550e8400-e29b-41d4-a716-446655440146",
    ],
  },
  {
    id: "908d5222-39dd-46c6-9ddb-3c9b8c0386e9",
    matomoId: 25,
    title: "Nous ne sommes pas tous·tes égaux face au sommeil",
    image: null,
    category: CATEGORIES.DES_PETITS_PAS_POUR_SON_QUILIBRE_MENTAL,
    content: `Le sommeil suit toujours trois grandes phases - sommeil léger, profond et paradoxal - **qui sont universelles, quel que soit l’âge**. Cependant, l’enchaînement et la durée de ces phases varient d’une personne à l’autre, en fonction des besoins individuels. C’est pourquoi il est essentiel de ne pas se comparer ni de chercher un sommeil « idéal » au détail près. **Plus que la durée exacte, l’écoute de son corps et la prise en compte de ses signaux restent primordiales.**\n\
\n\
Les besoins en sommeil évoluent au fil des âges :\n\
\n\
- **De la naissance à trois mois**, les nouveau-né·e·s dorment entre quatorze et dix-sept heures par jour.\n\
- **Entre 4 et 11 mois**, le temps de sommeil est de douze à seize heures.\n\
- **De 1 à 2 ans**, les enfants ont besoin de onze à quatorze heures de sommeil.\n\
- **Chez les enfants de 3 à 5 ans**, on recommande entre dix et douze heures par nuit. Pour les 6 à 13 ans, il s’agit plutôt de neuf à onze heures, et les adolescent·e·s de 14 à 17 ans ont besoin de huit à dix heures de sommeil.\n\
- **Chez les adultes**, la majorité des personnes ont besoin de sept à huit heures par nuit.\n\
- **Chez les personnes âgées**, le sommeil tend à devenir plus léger et plus fragmenté, sans que cela soit nécessairement un signe de trouble.\n\
\n\
Apprendre à reconnaître et respecter ses propres besoins en sommeil est un levier important pour préserver son équilibre mental au quotidien.`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440143",
      "550e8400-e29b-41d4-a716-446655440144",
      "550e8400-e29b-41d4-a716-446655440145",
      "550e8400-e29b-41d4-a716-446655440147",
      "550e8400-e29b-41d4-a716-446655440148",
    ],
  },
  {
    id: "b55b6bb5-4169-4e39-a4da-c8327e7b304c",
    matomoId: 26,
    title: "Bien dormir, oui mais comment ?",
    image: null,
    category: CATEGORIES.DES_PETITS_PAS_POUR_SON_QUILIBRE_MENTAL,
    content: `**Le sommeil est un besoin fondamental, mais il n’est pas toujours simple à retrouver.**\n\
\n\
Pourtant, avant d’envisager un traitement médicamenteux, des solutions naturelles, efficaces et sans risque existent. **Se lever à heure fixe, même après une mauvaise nuit, s’exposer à la lumière naturelle dès le matin, éviter les excitants en fin de journée ou instaurer une routine calme au moment du coucher** sont autant de repères précieux. En cas d’insomnie, il est préférable de quitter le lit un moment plutôt que d’y rester en ruminant. Réserver cet espace exclusivement au sommeil et à l’intimité aide le cerveau à associer lit et endormissement. Certaines approches comme les thérapies comportementales et cognitives (TCC) peuvent aussi accompagner durablement les personnes concernées par des troubles du sommeil.\n\
\n\
**Pour autant, chaque parcours est unique** : les personnes en horaires décalés, les travailleur·ses de nuit, les parents de jeunes enfants ou les personnes traversant une période de stress **ne peuvent pas toujours appliquer** les recommandations « idéales ». Pour ces situations, il est important de planifier le sommeil autant que possible, en respectant des plages régulières même si elles sont décalées. Instaurer une routine avant le coucher, même en journée, peut aider à préparer le corps au repos. Les siestes courtes, de 15 à 20 minutes, peuvent aussi être bénéfiques pour récupérer sans perturber le sommeil principal.\n\
\n\
**Enfin, attention à la tentation de tout mesurer.**\n\
\n\
Les montres connectées et applications de suivi du sommeil peuvent parfois générer une inquiétude inutile. Un sommeil réparateur n’a pas besoin d’être parfait : il doit simplement permettre de récupérer.`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440149",
      "550e8400-e29b-41d4-a716-446655440150",
      "550e8400-e29b-41d4-a716-446655440151",
      "550e8400-e29b-41d4-a716-446655440152",
      "550e8400-e29b-41d4-a716-446655440153",
      "550e8400-e29b-41d4-a716-446655440154",
      "550e8400-e29b-41d4-a716-446655440155",
    ],
  },
  {
    id: "31f13b38-51f2-4209-a764-807ae60ab670",
    matomoId: 27,
    title: "« Prendre soin de soi » : quand l’injonction au bien-être devient source de stress",
    image: null,
    category: CATEGORIES.DES_PETITS_PAS_POUR_SON_QUILIBRE_MENTAL,
    content: `C’est un fait.

Les messages qui encouragent à prendre soin de soi, à cultiver la confiance en soi, à s’estimer ou encore à performer sont devenus omniprésents dans l’espace public et sur les réseaux sociaux. Ils visent à promouvoir le bien-être, mais finissent parfois par créer l’effet inverse : **une pression constante à réussir, à aller bien, à tout gérer parfaitement - dans tous les aspects de sa vie**.

Il ne s’agit plus seulement de se sentir mieux, mais de devenir plus efficace, plus serein·e, plus productif·ive, plus aligné·e… en permanence. **Cette accumulation d’injonctions peut entraîner un sentiment d’insuffisance, voire de culpabilité, lorsqu’on n’y parvient pas.**

Et plutôt que de chercher à se conformer à des normes ou des idéaux extérieurs, l’enjeu est de trouver ses propres repères, personnels et adaptés à sa réalité, pour avancer à son rythme et selon ses besoins.

L’une des limites de ces discours, même bienveillants, réside dans leur tendance à **réduire la santé mentale à une responsabilité individuelle**. Or, le mal-être ne se résout pas toujours par des routines ou des méthodes personnelles. Il s’enracine parfois dans des réalités sociales plus larges : précarité, isolement, surcharge mentale, discrimination, difficultés d’accès aux soins… Autant de facteurs qui échappent au seul contrôle des individus.

Face à cette complexité, il est essentiel de **trouver un juste équilibre, même pour une application comme la nôtre**. Nous ne cherchons pas à dire à chacun·e comment aller mieux, mais à proposer des ressources que chacun·e peut s’approprier librement, selon son rythme et sa situation. **Entre conseils utiles et normes sociales implicites, il est facile de se sentir dépassé ou de douter de soi.**

C’est pourquoi **le développement de l’esprit critique est aussi un enjeu de santé mentale**. Il permet de prendre du recul face aux contenus qui circulent, de questionner les modèles qu’on nous propose, et de mieux identifier ce qui est réellement aidant pour soi.

Enfin, il ne faut pas oublier que

**le soutien individuel ne peut remplacer les réponses collectives**. 

Améliorer la santé mentale, c’est aussi agir sur les conditions de vie, de travail, d’étude, et garantir un accès équitable à l’accompagnement psychologique. Ces dimensions sont indissociables.`,
    externalResources: ["550e8400-e29b-41d4-a716-446655440164"],
  },
  {
    id: "538aef1d-00de-486b-b2fc-759e5961ddcf",
    matomoId: 28,
    title: "Se promener, courir, danser, bricoler… pour se sentir mieux",
    image: null,
    category: CATEGORIES.DES_PETITS_PAS_POUR_SON_QUILIBRE_MENTAL,
    content: `On entend souvent dire qu’il faut « faire du sport ». Cela peut paraître contraignant, voire décourageant. Pourtant, bouger, **même un peu chaque jour**, a un réel impact sur la santé mentale. Petit **rappel : l’activité physique ne se limite pas à la pratique sportive**. Marcher, jardiner, danser, bricoler, monter les escaliers, faire ses courses à pied… Tous ces gestes du quotidien comptent, et participent à une meilleure **santé, mentale comme physique**.

### **Mais alors, pourquoi bouger fait autant du bien au moral ?**

Parce que les bénéfices sont nombreux, à plusieurs niveaux :

- **Biologiques** : l’activité physique stimule la production de sérotonine et d’endorphines, des substances naturelles qui améliorent l’humeur et réduisent le stress.
- **Psychologiques** : bouger aide à reprendre confiance en soi et à faire une pause mentale, surtout en période de stress ou de baisse de moral.
- **Sociaux** : marcher avec des collègues, participer à une activité collective, ou simplement bouger à plusieurs, renforce les liens sociaux, essentiels à l’équilibre mental.

Et ce n’est pas tout : être actif·ive permet également de prévenir plusieurs maladies chroniques, comme les maladies cardiovasculaires, le diabète, certains cancers ou encore l’obésité.

### **Et si la motivation n’est pas au rendez-vous ?**

Il n’est pas nécessaire de tout changer du jour au lendemain. L’important est de commencer à son rythme, avec des activités simples et accessibles, qui procurent du plaisir et s’intègrent facilement au quotidien.`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440165",
      "550e8400-e29b-41d4-a716-446655440166",
      "550e8400-e29b-41d4-a716-446655440167",
      "550e8400-e29b-41d4-a716-446655440168",
      "550e8400-e29b-41d4-a716-446655440169",
      "550e8400-e29b-41d4-a716-446655440170",
      "550e8400-e29b-41d4-a716-446655440171",
    ],
  },
  {
    id: "66915b6d-b9ad-4a56-aa0b-26bd809cf8f7",
    matomoId: 29,
    title: "Ce que l’assiette apporte à la tête",
    image: null,
    category: CATEGORIES.DES_PETITS_PAS_POUR_SON_QUILIBRE_MENTAL,
    content: `**L’alimentation ne nourrit pas que le corps : elle a aussi un impact sur notre mental.** Ce que l’on met dans son assiette peut jouer sur l’humeur, le stress et l’énergie quotidienne.

Certaines études *(voir nos ressources ci-dessous)* suggèrent qu’une alimentation riche en produits ultra-transformés, en sucres, en graisses saturées ou en sel **favorise l’inflammation dans le corps**.  Lorsqu’elle devient prolongée, cette inflammation pourrait être liée à un risque accru de **troubles de l’humeur.**

À l’inverse, **une alimentation variée**, riche en fruits, légumes, céréales complètes, bonnes graisses végétales, et faible en produits ultra-transformés contribue à stabiliser l’humeur, préserver le bien-être mental et améliorer les capacités à faire face au stress.

Mais prendre soin de son alimentation ne veut pas dire **tomber dans le contrôle permanent**. Il n’y a pas de bonne ou de mauvaise façon de manger et aucun aliment ne doit être diabolisé. Manger une part de gâteau ou un plat réconfortant **ne veut pas dire "craquer" ou "tout gâcher"** - ces mots peuvent, à force, abîmer la relation qu’on entretient avec la nourriture.

Quand l’attention portée à l’alimentation devient envahissante, qu’elle génère du stress ou prend trop de place dans le quotidien, **cela peut être le signe d’un déséquilibre**. Dans certains cas, cette hypervigilance peut faire glisser vers un trouble de la conduite alimentaire *(voir notre partie sur les TCA)*. **Il est important d’en être conscient·e et d’en parler si le besoin se fait sentir *(voir notre partie agir et chercher de l’aide).***

Des repères simples existent pour que l’alimentation devienne un allié du mental : **manger à des heures régulières, varier les repas, privilégier des aliments peu transformés, accorder de l’importance au rythme des repas, respecter ses sensations.**

Adopter une alimentation à base de produits frais, bruts et équilibrés

**peut parfois représenter un coût pour le porte-monnaie.**

L’essentiel est de faire au mieux avec ses moyens, en gardant à l’esprit que chaque petit pas compte, sans pression ni culpabilité`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440172",
      "550e8400-e29b-41d4-a716-446655440173",
      "550e8400-e29b-41d4-a716-446655440174",
      "550e8400-e29b-41d4-a716-446655440175",
      "550e8400-e29b-41d4-a716-446655440176",
      "550e8400-e29b-41d4-a716-446655440177",
      "550e8400-e29b-41d4-a716-446655440178",
      "550e8400-e29b-41d4-a716-446655440179",
      "550e8400-e29b-41d4-a716-446655440180",
      "550e8400-e29b-41d4-a716-446655440181",
      "550e8400-e29b-41d4-a716-446655440182",
    ],
  },
  {
    id: "83050bed-2387-4551-9431-9745a8d825d1",
    matomoId: 30,
    title: "Parler, échanger, se relier : un vrai soutien contre l’isolement",
    image: null,
    category: CATEGORIES.DES_PETITS_PAS_POUR_SON_QUILIBRE_MENTAL,
    content: `**De plus en plus de personnes se sentent seules, et ce, même dans une société hyperconnectée.** Il est important de distinguer deux notions souvent confondues : l’isolement social et la solitude, qui ne sont pas une seule et même réalité.

L’isolement social désigne une situation objective dans laquelle une personne a peu ou pas de contacts avec son entourage - famille, ami·es, voisin·es, collègues - et n’occupe que peu ou pas de rôles sociaux. **Il se caractérise par une absence de relations stables, de soutien, ou de participation à la vie collective. Cet isolement peut fragiliser le bien-être mental et, lorsqu’il s’installe, avoir des conséquences importantes sur la santé globale.**

La solitude, quant à elle, est une expérience subjective. Il ne s’agit pas simplement d’être seul·e physiquement, mais de ressentir un manque ou une insatisfaction dans ses relations sociales. Elle peut être douloureuse lorsqu’elle est subie, persistante, ou non choisie. **Mais la solitude n’est pas toujours négative :** **lorsqu’elle est volontaire ou passagère, elle peut aussi être vécue comme un moment de pause, de recentrage sur soi, de repos face au rythme et aux sollicitations du quotidien.**

Cet isolement peut s’installer progressivement, durer dans le temps et passer inaperçu. **Il peut toucher tout le monde, à tous les âges, souvent sans signes visibles**. Et ses effets ne sont pas seulement psychologiques : **l’isolement social est aujourd’hui reconnu comme un facteur de risque important pour la santé mentale et physique**. Il augmente le risque de troubles dépressifs, d’anxiété, de stress chronique, de troubles du sommeil mais peut aussi avoir des effets sur la santé physique.

**Selon l’OMS, le manque de liens sociaux est un enjeu de santé publique mondial.**

Dans une époque qui valorise souvent la performance individuelle, il est utile de rappeler que **le collectif, la parole en groupe et les liens sociaux sont de vraies ressources**. Parler, échanger, demander de l’aide, partager un café ou une écoute peut avoir un effet **concret et protecteur** sur le bien-être psychique.

Quand on se sent isolé·e, il est possible d’en parler à un·e professionnel·le ou de se tourner vers une structure d’écoute. (*Voir notre rubrique Agir et chercher de l’aide.)*

**Pour rappel, en France, 1 personne sur 4 affirme se sentir seule (Fondation de France, 2025).**`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440183",
      "550e8400-e29b-41d4-a716-446655440184",
      "550e8400-e29b-41d4-a716-446655440185",
      "550e8400-e29b-41d4-a716-446655440186",
      "550e8400-e29b-41d4-a716-446655440187",
      "550e8400-e29b-41d4-a716-446655440188",
      "550e8400-e29b-41d4-a716-446655440189",
      "550e8400-e29b-41d4-a716-446655440190",
      "550e8400-e29b-41d4-a716-446655440191",
    ],
  },
  {
    id: "750245f1-a615-4759-bb2d-37882341cf27",
    matomoId: 31,
    title: "Être attentif à ses consommations pour",
    image: null,
    category: CATEGORIES.DES_PETITS_PAS_POUR_SON_QUILIBRE_MENTAL,
    content: `Certaines consommations - comme l’alcool, le tabac, les médicaments ou d’autres substances - peuvent évoluer au fil du temps, **particulièrement lors de périodes de fragilité ou de tension psychologique.** **Lorsqu’elles deviennent plus fréquentes, difficiles à contrôler, ou utilisées pour apaiser un mal-être, elles peuvent signaler une souffrance sous-jacente.** Ces usages ont des conséquences sur la santé mentale comme physique, et méritent une attention particulière lorsqu’ils s’installent ou changent de fonction.

Des études (voir nos ressources ci-dessous) montrent que **les personnes concernées par des troubles de santé mentale sont souvent plus exposées à des consommations à risque.** Cela ne signifie pas systématiquement une perte de contrôle, mais souligne un lien entre état psychique et recours plus fréquent à certaines substances.

**L’idée n’est pas d’être en vigilance permanente ni de scruter chacun de ses comportements, mais d’essayer de prendre un temps pour s’interroger sur ses habitudes et mieux comprendre ce que l’on traverse.**

Quelques questions peuvent aider :

- Quand et pourquoi je consomme ?
- Quelles conséquences sur mon humeur, mon moral et mon bien-être ?
- Est-ce que cette consommation devient automatique ou difficile à limiter ?
- Est-elle utilisée pour apaiser un inconfort ou une tension ?

Quand la consommation devient un réflexe, elle peut révéler un mal-être qui s’exprime autrement (voir notre rubrique sur les troubles addictifs). Sans s’alarmer, il peut être utile de s’interroger, d’en parler ou de se faire accompagner si besoin.`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440193",
      "550e8400-e29b-41d4-a716-446655440192",
      "550e8400-e29b-41d4-a716-446655440125",
      "550e8400-e29b-41d4-a716-446655440124",
      "550e8400-e29b-41d4-a716-446655440123",
      "550e8400-e29b-41d4-a716-446655440122",
      "550e8400-e29b-41d4-a716-446655440120",
      "550e8400-e29b-41d4-a716-446655440119",
      "550e8400-e29b-41d4-a716-446655440118",
    ],
  },
  {
    id: "3063a89f-b2c6-468e-b375-a359e1c6e685",
    matomoId: 32,
    title: "Déconnecter un peu, ça libère la tête",
    image: null,
    category: CATEGORIES.DES_PETITS_PAS_POUR_SON_QUILIBRE_MENTAL,
    content: `**L’addiction aux écrans n’est pas un diagnostic officiel et le débat reste encore ouvert aujourd’hui.** De nombreuses questions subsistent sur la limite entre un usage habituel et un usage excessif.

Les chercheurs et médecins tentent de déterminer à partir de quel nombre d’heures, quel degré de perte de contrôle, ou quelles conséquences concrètes un usage devient problématique. **Néanmoins, une utilisation excessive peut avoir des impacts réels sur la santé mentale, tels que troubles du sommeil, anxiété, voire dépression.** Certaines études *(voir nos sources)* montrent que ces comportements sont souvent associés à d’autres troubles psychiques, ce qui souligne l’importance de les prendre au sérieux.

**À ce jour, le seul trouble lié aux écrans reconnu par l’Organisation mondiale de la santé (OMS) est le trouble du jeu vidéo, inscrit dans la Classification internationale des maladies (CIM-11).** Ce trouble se caractérise par une difficulté à contrôler le temps consacré au jeu, une tendance à laisser cette activité prendre le pas sur d’autres aspects de la vie (relations, études, travail), et la poursuite du jeu malgré ses conséquences négatives sur le quotidien.

**Plus qu’un simple « fantasme », notre usage des écrans est devenu un véritable enjeu de santé publique.** Cela ne signifie pas que tous les écrans sont nuisibles, mais que le défi est d’en adopter une utilisation équilibrée. En prenant conscience de nos usages et en posant des limites, nous pouvons profiter du numérique sans se laisser dépasser.

Pour accompagner cette vigilance, il peut être utile de se poser quelques questions :

- Pourquoi est-ce que j’utilise les écrans ?
- Quelles répercussions mon usage a-t-il sur mon comportement, mon moral, mon sommeil et mon hygiène de vie ?

**Et cette vigilance prend tout son sens pour préserver sa santé mentale, surtout dans un monde toujours plus connecté.**`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440194",
      "550e8400-e29b-41d4-a716-446655440195",
      "550e8400-e29b-41d4-a716-446655440196",
      "550e8400-e29b-41d4-a716-446655440197",
      "550e8400-e29b-41d4-a716-446655440198",
      "550e8400-e29b-41d4-a716-446655440126",
    ],
  },
];
