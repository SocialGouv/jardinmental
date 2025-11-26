export const CATEGORIES = {
  DES_PETITS_PAS_POUR_SON_EQUILIBRE_MENTAL: "Des petits pas pour son équilibre mental",
  LA_SANTE_MENTALE_C_EST_QUOI: "La santé mentale, c'est quoi ?",
  MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES: "Mieux comprendre les troubles psychiques",
  REPERER_LES_SIGNES_DE_MAL_ETRE: "Repérer les signes de mal-être",
  AGIR_ET_CHERCHER_DE_L_AIDE_SANS_HONTE: "Agir et chercher de l’aide, sans honte",
} as const;

export type Category = (typeof CATEGORIES)[keyof typeof CATEGORIES];

export const SUB_CATEGORIES = {
  ZOOM_SOMMEIL: "Zoom sur le sommeil",
  ZOOM_TROUBLES: "Zoom sur les différents troubles",
  ZOOM_STRESS_AND_ANXIETY: "Zoom sur le stress et l’anxiété",
} as const;

export type SubCategory = (typeof SUB_CATEGORIES)[keyof typeof SUB_CATEGORIES];

export interface Resource {
  id: string;
  matomoId: number;
  title: string;
  image: any;
  category: Category;
  content: string;
  externalResources?: Array<string>;
  subCategory?: SubCategory;
}

export const RESOURCES_DATA: Resource[] = [
  {
    id: "247b537b-878d-4490-9d67-852e5fe89ed1",
    matomoId: 1,
    title: "Pas de santé sans santé mentale",
    image: require("../../../../assets/imgs/resources/Article1.png"),
    category: CATEGORIES.LA_SANTE_MENTALE_C_EST_QUOI,
    content: `Prendre soin de sa santé, c’est aussi prendre soin de sa santé mentale.

Selon l’Organisation mondiale de la santé (OMS), la santé mentale est un « *état de bien-être qui permet à chacun de réaliser son potentiel, de faire face aux difficultés normales de la vie, de travailler avec succès et de manière productive, et d’être en mesure d’apporter une contribution à la communauté* ». Cependant, cette définition peut donner l’impression que le bien-être mental dépend uniquement de la réussite au travail. Or, on peut tout à fait se sentir bien, épanoui·e et utile, même sans avoir d’emploi.

La santé mentale fait partie intégrante de notre santé globale. **Il n’y a pas de santé sans santé mentale.** Longtemps taboue et mise de côté, elle reste pourtant aussi importante que la santé physique. Toutes deux sont étroitement liées : ce que l’on vit dans notre tête peut impacter notre corps, et inversement.

Oui, notre corps peut envoyer des signaux d'alerte. **Mais notre cerveau aussi.**`,
    externalResources: ["550e8400-e29b-41d4-a716-446655440001", "550e8400-e29b-41d4-a716-446655440002"],
  },
  {
    id: "ecfa5013-589a-484c-8c1e-a4f1ce24a6ce",
    matomoId: 2,
    title: "Mais au fait, avoir une bonne santé mentale : qu’est-ce que ça veut dire ?",
    image: require("../../../../assets/imgs/resources/Article2.png"),
    category: CATEGORIES.LA_SANTE_MENTALE_C_EST_QUOI,
    content: `Nous avons toutes et tous besoin de prendre soin de notre santé mentale. **Même quand tout va bien.**\n\
\n\
Tout au long de notre vie, notre état mental varie du bien-être au mal-être, et vice-versa. Le monde ne se divise pas en deux catégories distinctes : les personnes en bonne santé mentale d’un côté versus celles avec un trouble de l’autre.\n\
\n\
**Quand on parle de santé mentale, on ne parle pas que de la maladie.** Même si je n’ai pas de trouble : est-ce que j’arrive tout de même à trouver du sens à ma vie ? Quel est le regard que je porte sur moi-même ? Est-ce que je me sens entouré·e ou profondément seul·e ?\n\
\n\
**On peut par ailleurs tout à fait vivre avec un trouble psychique et se sentir bien, utile et épanoui·e. À l’inverse, on peut se sentir mal, vide et isolé·e sans avoir de trouble diagnostiqué.**\n\
\n\
Une bonne santé mentale peut ainsi coexister avec un trouble psychique et l’absence de trouble ne garantit pas le bien-être mental !\n\
\n\
**Chaque personne tente donc, à l’aide de ses ressources, de trouver son propre équilibre.**\n\
\n\
Un équilibre qui lui fait du bien.`,
    externalResources: ["550e8400-e29b-41d4-a716-446655440001", "550e8400-e29b-41d4-a716-446655440003"],
  },
  {
    id: "e090c6c7-4618-4d37-98e7-c84e10c763de",
    matomoId: 3,
    title: "Pourquoi et comment observer sa propre santé mentale ?",
    image: require("../../../../assets/imgs/resources/Article3.png"),
    category: CATEGORIES.LA_SANTE_MENTALE_C_EST_QUOI,
    content: `On parle souvent de santé mentale quand elle va mal, mais trop rarement de ce qu’on peut faire au quotidien pour la préserver. L’un des premiers réflexes utiles, c’est d’apprendre à s’observer **avec attention et bienveillance.**\n\
\n\
Cela ne veut pas dire **tout analyser, ni devenir obsédé·e** par son humeur ou ses pensées. Il s’agit plutôt de développer une forme **d’écoute intérieure**, pour mieux comprendre ce qui nous affecte et repérer les petits signaux qui montrent qu’on ne se sent peut-être pas bien… mais aussi identifier ce qui nous fait du bien.\n\
\n\
C’est justement ce que propose notre application ***Jardin Mental*** : un espace pour faire le point et suivre son état mental au fil du temps, même quand tout va bien.\n\
\n\
Quelques repères pour s’auto-observer :\n\
\n\
- **Les émotions** : suis-je souvent triste, irritable, anxieux·se ? Ou au contraire content·e, joyeux·se ?\n\
- **Le sommeil** : est-ce que je dors bien ? Est-ce que je me réveille reposé·e ? Ai-je recours à des médications sans ordonnance afin d'améliorer la qualité de mon sommeil ?\n\
- **L’énergie et la motivation** : est-ce que je me sens épuisé·e sans raison ? Est-ce que je trouve du plaisir dans mes activités quotidiennes, de loisirs ou de détente ?\n\
- **Le rapport aux autres** : ai-je tendance à m’isoler ? Quel est mon rapport aux autres (famille, amis, collègues…) ?\n\
- **Les pensées récurrentes** : est-ce qu'il m'arrive d'avoir des pensées négatives (sur moi-même, les autres, l'avenir) sans raison ? Des ruminations anxieuses ? Des inquiétudes ? À quel point ces dernières freinent l'atteinte de mes objectifs ?\n\
- **Les consommations :** ai-je tendance à augmenter ou à perdre le contrôle de mes consommations de substances ? Est-ce que j'ai régulièrement tendance à m'automédiquer pour me sentir mieux ?\n\
\n\
En apprendre un peu plus sur le sujet, c’est déjà prendre soin de soi :)`,
    externalResources: ["550e8400-e29b-41d4-a716-446655440004"],
  },
  {
    id: "045e479c-11f3-435e-bffb-4364481ce5bd",
    matomoId: 4,
    title: "La santé mentale, ce n'est pas qu’une affaire personnelle",
    image: require("../../../../assets/imgs/resources/Article4.png"),
    category: CATEGORIES.LA_SANTE_MENTALE_C_EST_QUOI,
    content: `Devons-nous porter, seul·es, toute la responsabilité de notre santé mentale ?\n\
\n\
**La réponse est non, évidemment.**\n\
\n\
Bien sûr, certains éléments relèvent de nous : notre histoire personnelle, notre personnalité et nos expériences **façonnent en partie notre équilibre psychique.**\n\
\n\
Mais réduire la santé mentale à l’individu seul·e, c’est négliger toute une dimension collective. D'autres influences dépassent largement l’échelle de la personne. **Le contexte social, politique, environnemental et économique joue un rôle déterminant dans notre bien-être psychologique.** L’environnement dans lequel nous vivons - que ce soit notre logement,  nos liens sociaux, notre accès à des ressources ou à des soins - peut tout autant protéger que fragiliser notre santé.\n\
\n\
Une chose est sûre : tous ces éléments internes et externes s'influencent les uns les autres.\n\
\n\
**La santé mentale, ce n’est pas que dans la tête. Elle concerne la société tout entière.**`,
    externalResources: ["550e8400-e29b-41d4-a716-446655440005", "550e8400-e29b-41d4-a716-446655440006", "550e8400-e29b-41d4-a716-446655440007"],
  },
  {
    id: "fb2975bb-596c-441f-b3bd-34bf50dfc303",
    matomoId: 6,
    title: "Santé mentale vs clichés : ces idées reçues à retirer de sa tête",
    image: require("../../../../assets/imgs/resources/Article6.png"),
    category: CATEGORIES.LA_SANTE_MENTALE_C_EST_QUOI,
    content: `« Les personnes avec des troubles mentaux sont dangereuses », « la santé mentale, c’est juste une question de volonté», « aller voir un psy, c’est signe de faiblesse »… **Ces idées reçues sont encore trop répandues.**\n\
\n\
En France, la santé mentale reste un sujet tabou pour **7 personnes sur 10** *(Odoxa, Festival Pop&Psy, 2023)*.\n\
\n\
Ces préjugés continuent d’alimenter la stigmatisation et peuvent entraîner rejet, isolement ou discrimination pour celles et ceux qui en souffrent. Voici quelques ressources pour vous aider à **déconstruire vos clichés** et porter un regard plus bienveillant, sur les autres mais aussi sur vous-même !`,
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
    title: "“Je ne me sens pas bien” : ces signes qui méritent mon attention",
    image: require("../../../../assets/imgs/resources/Article7.png"),
    category: CATEGORIES.REPERER_LES_SIGNES_DE_MAL_ETRE,
    content: `Reconnaître que l’on ne se sent pas bien **est déjà une étape importante**. Il n’est pas toujours évident de prendre du recul sur sa santé mentale ou d’en repérer des changements.\n\
\n\
Certains signes peuvent tout de même nous alerter.\n\
\n\
Nous connaissons toutes et tous des périodes de stress, d’anxiété et de mal-être. Souvent, ces émotions s’atténuent avec le temps, grâce au soutien de nos proches ou à l’évolution de certaines situations. Mais parfois, **elles s’installent plus durablement** et deviennent plus difficiles à gérer. Qu’elle soit passagère ou plus persistante, toute forme de souffrance mérite d’être prise au sérieux.\n\
\n\
Perte de l’appétit ou au contraire consommation excessive de nourriture, difficultés à exécuter des tâches quotidiennes, mauvaise estime de soi, irritabilité…**Plus tôt on repère ces signes, plus il est facile de trouver des solutions adaptées** *(voir nos rubriques agir et chercher de l’aide)*.\n\
\n\
Et même si on pense parfois qu’il s’agit de la seule solution : ignorer ou minimiser ce que l’on ressent ne permet pas forcément d’aller mieux. Identifier un mal-être, c’est **se donner la chance (et le temps !)** d’agir avant qu’il ne s’aggrave. Voici des ressources pour vous aider à être plus attentif·ve à certains signaux :`,
    externalResources: ["550e8400-e29b-41d4-a716-446655440004", "550e8400-e29b-41d4-a716-446655440015", "550e8400-e29b-41d4-a716-446655440016"],
  },
  {
    id: "29ebc47a-27ee-4d6e-b0fa-9d20c5c59c77",
    matomoId: 8,
    title: "Se sentir mal, ça arrive à tout le monde : à quel moment s'inquiéter ?",
    image: require("../../../../assets/imgs/resources/Article8.png"),
    category: CATEGORIES.REPERER_LES_SIGNES_DE_MAL_ETRE,
    content: `**Tout le monde traverse des périodes de tristesse sans que cela soit forcément inquiétant.**\n\
\n\
Ces émotions peuvent être liées à des événements du quotidien : une dispute, une rupture, des difficultés professionnelles ou scolaires…Il n’est donc pas toujours nécessaire **d’associer ces états** à **des troubles psychiques**. Les variations d’humeur, par exemple, sont fréquentes et font partie de la vie. Avoir des hauts et des bas au cours d'une journée **ne relève pas**, en soi, d’un trouble comme la bipolarité.\n\
\n\
Parfois, le mal-être s'atténue progressivement avec le temps, le soutien de l’entourage ou des changements de situation. Dans d’autres cas, il persiste. Et quand il devient pesant à vivre et que nos ressources ou celles de notre entourage ne suffisent plus ou pas, **c’est le signal qu’il faut chercher du soutien** *(voir nos rubriques « Agir » et « Chercher de l’aide »).*\n\
\n\
Finalement, ce qui distingue vraiment une émotion passagère d’un mal-être qui mérite une attention particulière, c’est surtout la durée, l’intensité, et l’impact sur la vie quotidienne.`,
    externalResources: ["550e8400-e29b-41d4-a716-446655440017", "550e8400-e29b-41d4-a716-446655440018"],
  },
  {
    id: "ac50b156-3215-435a-b622-285533b3f9a3",
    matomoId: 9,
    title: "Baisse de moral, mal-être ou trouble : où se situer ?",
    image: require("../../../../assets/imgs/resources/Article9.png"),
    category: CATEGORIES.MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES,
    content: `C’est un fait : notre santé mentale évolue constamment et peut passer par différents états. Mais elle repose avant tout sur plusieurs dimensions qui peuvent toutes et tous nous concerner :\n\
\n\
- **Des variations émotionnelles et physiologiques** (stress, fatigue, tristesse…) qui sont fréquentes et passagères pour tout le monde.\n\
- **Une détresse psychologique réactionnelle liée à des événements de vie difficiles** (deuil, rupture, surcharge...). Petit point de vigilance à garder en tête : dans certaines circonstances (**isolement, une absence de soutien, des conditions de vie précaires**…), cette détresse peut faire basculer la personne dans un trouble psychique surtout si elle n’est **pas considérée** et qu’elle devient **trop envahissante** au quotidien.\n\
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
    title: "Mettre un mot sur ce que je vis : pourquoi (et quand) c'est utile ?",
    image: require("../../../../assets/imgs/resources/Article10.png"),
    category: CATEGORIES.MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES,
    content: `Réussir à mettre un mot sur ce que l’on vit peut être **un vrai soulagement** : cela aide à mieux comprendre ce qui se passe en soi, **à ne pas se sentir seul·e, nourrir un sentiment d’appartenance à une communauté** (c’est précieux !) et à accéder à des soins adaptés. Cependant un diagnostic posé par un médecin n’est pas une **étiquette**. Il ne résume pas qui vous êtes (et heureusement !).\n\
\n\
Aujourd’hui, **de nombreuses personnes** cherchent à poser elles-mêmes un diagnostic sur ce qu’elles traversent. C’est une démarche compréhensible, souvent motivée par le besoin de sens ou de reconnaissance. En parler avec des proches de confiance peut déjà faire beaucoup de bien, et constitue **un véritable soutien**.\n\
\n\
**Mais il est important de rester vigilant·e** : tenter de tout comprendre seul·e, sans accompagnement, peut parfois conduire à des erreurs d’interprétation surtout face à **la désinformation** qui circule en ligne sur ces sujets. On peut alors se retrouver **enfermé·e** dans une case qui ne reflète pas vraiment ce que l’on vit **ou passer à côté** d’une aide plus adaptée.\n\
\n\
**Se définir** précisément peut aider (et ce n’est pas nécessaire pour tout le monde !) mais il reste essentiel de ne pas **se réduire à un mot ou à un trouble**.\n\
\n\
Qu’il s’agisse d’un échange avec un·e professionnel·le, d’un dialogue avec un proche ou d’une recherche personnelle, l’important est de ne pas rester seul·e. S’entourer, parler, partager ce que l’on vit peut faire une vraie différence **avant, pendant, et après un diagnostic.**`,
    externalResources: ["550e8400-e29b-41d4-a716-446655440021", "550e8400-e29b-41d4-a716-446655440022"],
  },
  {
    id: "978d0d1d-e4e3-4ddd-b15a-0a128fbfde24",
    matomoId: 11,
    title: "Dépression, anxiété, bipolarité : faire le point sur les différents troubles",
    image: require("../../../../assets/imgs/resources/Article11.png"),
    category: CATEGORIES.MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES,
    content: `On vous l’accorde : **pas toujours simple** de s’y retrouver entre les différents troubles.\n\
\n\
Entre leurs définitions parfois similaires et leurs comorbidités - c’est-à-dire la possibilité d’avoir plusieurs troubles en même temps chez une même personne - il est facile de se sentir un peu perdu·e. Ajoutez à cela un mélange de confusion et d’idées reçues, et v**ous obtenez un terreau idéal pour la désinformation !**\n\
\n\
Pourtant, ces troubles sont bien plus fréquents qu’on ne le pense : selon l’Organisation Mondiale de la Santé (OMS), **une personne sur quatre sera touchée par un trouble psychique à un moment de sa vie.** Les plus répandus ? Les troubles dépressifs, les troubles anxieux, les troubles bipolaires, les troubles schizophréniques, ou encore les troubles addictifs.\n\
\n\
**Quelle est la définition de chacun de ces troubles et où chercher l’information ?**\n\
\n\
Pour mieux comprendre ce que ces troubles impliquent au quotidien, *Jardin Mental* vous propose une sélection de ressources fiables pensées comme des **outils de compréhension**. Elles permettent de mieux se repérer et de mettre des mots sur ce qu’on ressent.\n\
\n\
**Mais attention à un écueil fréquent** : la découverte des descriptions de troubles et de leurs symptômes peut facilement donner l’impression **de se reconnaître** dans chacun d’eux, au risque de **s’identifier un peu trop vite.** Ces ressources ne remplacent évidemment pas l’échange avec un·e professionnel·le de santé. **Chaque situation est unique, et le vécu des troubles dépasse souvent les catégories toutes faites.**\n\
\n\
Rien n’est figé, rien n’est définitif : la santé mentale est mouvante et peut changer avec le temps et les soins appropriés.`,
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
    title: "Santé mentale à tous les âges : des troubles fréquents à chaque étape de vie",
    image: require("../../../../assets/imgs/resources/Article12.png"),
    category: CATEGORIES.MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES,
    content: `**À tout âge de la vie**, il est possible de traverser des périodes de fragilité. Que l’on soit enfant, adolescent·e, adulte ou senior, nos besoins évoluent, tout comme les formes que peuvent prendre les **troubles psychiques**.\n\
\n\
Certaines difficultés sont plus fréquentes selon les étapes de vie :\n\
\n\
- **Enfants :** Les enfants peuvent ressentir de l’anxiété, avoir des troubles du sommeil ou du comportement. Ces signes méritent une attention particulière, car ils peuvent affecter leur bien-être global et leur développement.\n\
- **Adolescent·es :** L’adolescence est une période de grands bouleversements. L’anxiété, la dépression, les troubles alimentaires ou les comportements d'automutilation peuvent apparaître. Les difficultés peuvent être profondes, même si elles sont peu exprimées.\n\
- **Jeunes adultes :** Entre études, débuts professionnels et construction de soi, les jeunes adultes peuvent faire face à du stress, des troubles de l’humeur, ou des conduites addictives. C’est souvent un moment de bascule important.\n\
- **Adultes :** La santé mentale peut être mise à mal par un quotidien exigeant : isolement, culte de la performance, rythme de vie soutenu. Le burn-out, le stress chronique ou la dépression sont des réalités fréquentes.\n\
- **Seniors :** Avec l’avancée en âge, la solitude, des symptômes dépressifs ou des troubles cognitifs peuvent apparaître. Ces difficultés sont parfois invisibles, mais ont un impact réel sur la qualité de vie.`,
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
    subCategory: SUB_CATEGORIES.ZOOM_TROUBLES,
    title: "Troubles dépressifs : on fait le point",
    image: require("../../../../assets/imgs/resources/Article13.png"),
    category: CATEGORIES.MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES,
    content: `**La dépression, ce n’est pas juste « être triste »**. C’est une véritable souffrance psychique qui s’installe et qui touche toutes les strates de la vie quotidienne  : l’énergie, le sommeil, l’envie, l’appétit, l’estime de soi. Des pensées envahissantes et des idées suicidaires peuvent encombrer l’esprit. La personne concernée peut se sentir vide, incapable, isolée, **même sans raison apparente.**\n\
\n\
La dépression peut survenir progressivement ou de façon brutale, et durer plusieurs semaines ou plusieurs mois. **Elle n’est pas toujours liée à un événement précis et peut toucher n’importe qui, même sans antécédent**. Avoir un épisode dépressif ne signifie pas que la personne est ou restera déprimée à vie.\n\
\n\
Et bien sûr, petit rappel essentiel : il ne s’agit en rien d'un signe de faiblesse !\n\
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
    subCategory: SUB_CATEGORIES.ZOOM_TROUBLES,
    title: "Troubles anxieux et TOC : on fait le point",
    image: require("../../../../assets/imgs/resources/Article14.png"),
    category: CATEGORIES.MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES,
    content: `L’anxiété devient un trouble quand elle prend **trop de place** dans la vie quotidienne.\n\
\n\
Elle peut se manifester sous différentes formes :\n\
\n\
- L’**anxiété généralisée** : inquiétudes permanentes et incontrôlables, souvent sans raison précise.\n\
- Les **attaques de panique** : épisodes soudains de peur intense (crises d’angoisses) accompagnés de symptômes physiques (palpitations, sueurs, sensation d’étouffer).\n\
- Les **phobies** : peurs irrationnelles liées à une situation ou un objet.\n\
- Le **trouble obsessionnel-compulsif (TOC)** : présence d’obsessions (pensées intrusives, angoissantes) et de compulsions (gestes ou rituels répétitifs pour tenter de les apaiser).\n\
- **L’anxiété sociale** : peur du jugement négatif de l’autre et anxiété de performance\n\
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
    subCategory: SUB_CATEGORIES.ZOOM_TROUBLES,
    title: "Troubles addictifs : on fait le point",
    image: require("../../../../assets/imgs/resources/Article15.png"),
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
      "550e8400-e29b-41d4-a716-446655440118",
      "550e8400-e29b-41d4-a716-446655440119",
      "550e8400-e29b-41d4-a716-446655440120",
      "550e8400-e29b-41d4-a716-446655440121",
      "550e8400-e29b-41d4-a716-446655440122",
      "550e8400-e29b-41d4-a716-446655440123",
      "550e8400-e29b-41d4-a716-446655440124",
      "550e8400-e29b-41d4-a716-446655440125",
      "550e8400-e29b-41d4-a716-446655440126",
      "550e8400-e29b-41d4-a716-446655440127",
      "550e8400-e29b-41d4-a716-446655440128",
      "550e8400-e29b-41d4-a716-446655440129",
      "550e8400-e29b-41d4-a716-446655440130",
      "550e8400-e29b-41d4-a716-446655440132",
      "550e8400-e29b-41d4-a716-446655440133",
      "550e8400-e29b-41d4-a716-446655440061",
    ],
  },
  {
    id: "1882aee0-9ff3-4c92-aa4a-bc43475bc3c9",
    matomoId: 16,
    subCategory: SUB_CATEGORIES.ZOOM_TROUBLES,
    title: "Troubles des conduites alimentaires : on fait le point",
    image: require("../../../../assets/imgs/resources/Article16.png"),
    category: CATEGORIES.MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES,
    content: `Quand l’alimentation devient source d’angoisse ou de contrôle, c’est peut-être le signe que le rapport à la nourriture est compliqué.\n\
\n\
Anorexie, boulimie, hyperphagie… Les troubles des conduites alimentaires sont souvent liés à l’image de soi, au besoin de maîtriser et de canaliser des émotions qu’on ne sait plus gérer autrement. **Contrairement aux idées reçues**, **un TCA ne se voit pas forcément.**\n\
\n\
Ils en existent plusieurs formes :\n\
\n\
- **L’anorexie mentale** : une restriction alimentaire volontaire, une peur intense de grossir, malgré un poids très bas.\n\
- **La boulimie** : des crises où on mange en très grande quantité, suivies de comportements pour compenser (vomissements, jeûnes, excès de sport).\n\
- **L’hyperphagie** : des crises alimentaires sans compensation, souvent associées à un mal-être.\n\
\n\
Ces troubles peuvent avoir de graves conséquences physiques (carences, troubles digestifs, fatigue) et psychiques (isolement, dépression, faible estime de soi). Il existe des accompagnements adaptés pour aider à sortir d’un trouble alimentaire : avec le bon soutien, une amélioration est possible, petit à petit.\n\
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
    subCategory: SUB_CATEGORIES.ZOOM_TROUBLES,
    title: "Troubles bipolaires : on fait le point",
    image: require("../../../../assets/imgs/resources/Article17.png"),
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
*La Maison Perchée et Psycom* proposent des guides complets pour mieux comprendre le trouble et trouver des solutions adaptées.`,
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
    subCategory: SUB_CATEGORIES.ZOOM_TROUBLES,
    title: "Troubles de stress post-traumatique : on fait le point",
    image: require("../../../../assets/imgs/resources/Article18.png"),
    category: CATEGORIES.MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES,
    content: `Après un événement violent ou menaçant - une agression, un accident, une catastrophe, une guerre, ou même des violences répétées - certaines personnes développent un **état de stress post-traumatique**. Les symptômes peuvent apparaître rapidement ou des semaines plus tard, et se manifestent par :\n\
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
    subCategory: SUB_CATEGORIES.ZOOM_TROUBLES,
    title: "Les troubles schizophréniques : on fait le point",
    image: require("../../../../assets/imgs/resources/Article19.png"),
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
    subCategory: SUB_CATEGORIES.ZOOM_TROUBLES,
    title: "Troubles de la personnalité borderline : on fait le point",
    image: require("../../../../assets/imgs/resources/Article20.png"),
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
    subCategory: SUB_CATEGORIES.ZOOM_TROUBLES,
    title: "Automutilation : on fait le point",
    image: require("../../../../assets/imgs/resources/Article21.png"),
    category: CATEGORIES.MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES,
    content: `Quand la douleur **devient difficile à gérer,** certaines personnes s’infligent des blessures physiques, sans chercher à mettre fin à leurs jours.\n\
\n\
Ce geste, souvent difficile à comprendre de l’extérieur, permet aux personnes qui en ont recours de soulager une douleur émotionnelle, de se "punir", ou de reprendre le contrôle. **Il s’agit souvent d’une façon d’exprimer un mal-être profond quand les mots ne suffisent plus.**\n\
\n\
Pour autant, il est tout de même possible de s’en sortir : des accompagnements existent pour **comprendre** ce qui se joue derrière ces gestes et trouver d’autres moyens **d’apaiser sa souffrance.**\n\
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
    title: "Témoignages : Écouter pour comprendre, récits de personnes vivant avec un trouble",
    image: require("../../../../assets/imgs/resources/Article22.png"),
    category: CATEGORIES.MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES,
    content: `La santé mentale, ce n’est pas seulement des définitions médicales ou des explications théoriques : **ce sont (surtout !) des vies, des histoires, des parcours**. Chez *Jardin Mental*, nous pensons qu’entendre la voix des personnes concernées par un trouble est essentiel pour mieux apprendre de l’autre.\n\
\n\
Nous vous proposons ici une sélection de ressources qui permettent d’écouter des récits à la première personne et de comprendre, de l’intérieur, ce que signifie vivre avec un trouble.\n\
\n\
PS : Ces témoignages sont très riches, mais peuvent parfois être intenses et difficiles à écouter. Si vous êtes directement concerné·e, prenez le temps de choisir le bon moment pour les découvrir, à votre rythme.\n\
\n\
Votre bien-être passe avant tout :)`,
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
    matomoId: 23,
    subCategory: SUB_CATEGORIES.ZOOM_SOMMEIL,
    title: "Bien dormir, bien dans son corps (et sa tête !)",
    image: require("../../../../assets/imgs/resources/Article23.png"),
    category: CATEGORIES.DES_PETITS_PAS_POUR_SON_EQUILIBRE_MENTAL,
    content: `**Quand le sommeil se dégrade, les répercussions sur l’équilibre psychique peuvent se faire sentir rapidement** : irritabilité, baisse de motivation, troubles de la concentration ou montée de l’anxiété. Ce lien fonctionne aussi dans l’autre sens. Un stress persistant, un trouble de l’humeur ou anxieux, ou un épisode dépressif peuvent perturber l’endormissement, fragmenter les nuits ou provoquer **des réveils précoces ou répétés**. Ce cercle complexe, où troubles du sommeil et mal-être ou troubles psychiques s’entretiennent, peut s’aggraver si les difficultés persistent.\n\
\n\
**La bonne nouvelle, c’est qu’il est possible de le rompre avec un accompagnement adapté.**\n\
\n\
Le sommeil joue un rôle fondamental pour le corps et l’esprit. **Il réduit la fatigue et le stress, améliore la mémoire, la concentration, l’humeur et la régulation de l’appétit.** Il contribue aussi à prévenir de nombreuses maladies comme l’obésité, le diabète de type 2, l’hypertension ou les maladies cardiovasculaires, en intervenant sur des fonctions vitales telles que la production hormonale, la circulation sanguine, la respiration ou le système immunitaire.\n\
\n\
**Bien sûr, les difficultés de sommeil peuvent aussi être liées à des facteurs externes.** Des conditions environnementales difficiles - bruit, températures extrêmes, promiscuité, précarité, insécurité - peuvent perturber le repos.\n\
\n\
Il est important de prendre en compte ces déterminants pour mieux comprendre son sommeil.`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440134",
      "550e8400-e29b-41d4-a716-446655440135",
      "550e8400-e29b-41d4-a716-446655440136",
      "550e8400-e29b-41d4-a716-446655440137",
      "550e8400-e29b-41d4-a716-446655440138",
      "550e8400-e29b-41d4-a716-446655440139",
      "550e8400-e29b-41d4-a716-446655440140",
      "550e8400-e29b-41d4-a716-446655440141",
    ],
  },
  {
    id: "0dffe681-74a2-46ed-8a3d-44506d36173d",
    matomoId: 24,
    subCategory: SUB_CATEGORIES.ZOOM_SOMMEIL,
    title: "La nuit porte (vraiment) conseil",
    image: require("../../../../assets/imgs/resources/Article24.png"),
    category: CATEGORIES.DES_PETITS_PAS_POUR_SON_EQUILIBRE_MENTAL,
    content: `Le sommeil n’est pas une simple pause : **c’est un moment essentiel où le corps et le cerveau se restaurent.**\n\
\n\
Chaque nuit, notre cerveau traverse plusieurs cycles d’environ quatre-vingt dix minutes, alternant phases de sommeil léger, profond, et paradoxal.\n\
\n\
Le sommeil profond est une véritable source de régénération : **il joue un rôle majeur dans la récupération physique, renforce notre système immunitaire et permet au corps d’éliminer les toxines accumulées**.\n\
\n\
Le sommeil paradoxal, quant à lui, est la phase où les rêves sont les plus nombreux. **C’est aussi à ce moment-là que le cerveau traite et apaise nos émotions, consolide nos souvenirs et contribue à  notre équilibre émotionnel.**\n\
\n\
**Mais le sommeil, ce n’est pas sur commande.**\n\
\n\
Il survient lorsque le corps **en a réellement besoin**, guidé par une horloge biologique sensible à la lumière du jour et au rythme de nos journées. Lorsque la nuit tombe, la mélatonine, cette hormone du sommeil, signale **progressivement** au corps qu’il est temps de se préparer au repos.\n\
\n\
**Prendre soin de son sommeil, quand cela est possible, est important pour permettre au corps et à l’esprit de se réguler et de se réparer**. Toutefois, chacun·e fait au mieux selon sa situation, qui peut parfois rendre difficile la mise en place de conditions favorables à l’endormissement. Bruit, environnement, contraintes de logement ou horaires atypiques sont autant de réalités qui peuvent **influencer la qualité du sommeil.**`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440142",
      "550e8400-e29b-41d4-a716-446655440143",
      "550e8400-e29b-41d4-a716-446655440144",
      "550e8400-e29b-41d4-a716-446655440145",
    ],
  },
  {
    id: "421212e0-2812-4a72-a073-cba746444c36",
    matomoId: 25,
    subCategory: SUB_CATEGORIES.ZOOM_SOMMEIL,
    title: "Troubles du sommeil : de quoi parle-t-on vraiment ?",
    image: require("../../../../assets/imgs/resources/Article25.png"),
    category: CATEGORIES.DES_PETITS_PAS_POUR_SON_EQUILIBRE_MENTAL,
    content: `**Il est normal de traverser, à certains moments de la vie, des périodes de sommeil difficile**.\n\
\n\
Contraintes de logements, stress, changements de rythme, événements de vie… Ces situations peuvent entraîner des nuits agitées ou des difficultés d’endormissement.\n\
\n\
Parmi les troubles reconnus, **l’insomnie est le plus courant**. Beaucoup de personnes pensent être insomniaques, cependant, des troubles occasionnels **ne suffisent pas à poser un véritable diagnostic**. Pour qu’il soit établi, les perturbations du sommeil doivent survenir au minimum **trois fois par semaine, pendant plus de trois mois**, et impacter significativement le quotidien (fatigue, baisse de concentration, irritabilité, etc.).\n\
\n\
D’autres troubles existent et nécessitent souvent une évaluation médicale :\n\
\n\
- **Le syndrome des jambes sans repos** se caractérise par une sensation désagréable dans les jambes, accompagnée d’une envie irrésistible de les bouger.\n\
- **L’apnée du sommeil** provoque des arrêts temporaires de la respiration pendant le sommeil, entraînant une mauvaise oxygénation et un sommeil fragmenté.\n\
- **L’hypersomnie** se traduit par une somnolence excessive pendant la journée, même après une nuit complète de sommeil.\n\
- **Les parasomnies** regroupent des comportements inhabituels pendant le sommeil, comme le somnambulisme, les terreurs nocturnes ou le bruxisme (grincement des dents).\n\
\n\
**Ressentir ponctuellement une mauvaise qualité de sommeil ne signifie pas automatiquement que l’on souffre d’un trouble durable**. Cependant, si ces difficultés deviennent récurrentes ou impactent significativement le quotidien, il est recommandé d’en parler à un professionnel de santé. Les thérapies comportementales et cognitives peuvent constituer une ressource pour traiter le trouble de l’insomnie.`,
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
    matomoId: 26,
    subCategory: SUB_CATEGORIES.ZOOM_SOMMEIL,
    title: "Nous ne sommes pas tous·tes égaux face au sommeil",
    image: require("../../../../assets/imgs/resources/Article26.png"),
    category: CATEGORIES.DES_PETITS_PAS_POUR_SON_EQUILIBRE_MENTAL,
    content: `Le sommeil suit toujours trois grandes phases - sommeil léger, profond et paradoxal - **qui sont universelles, quel que soit l’âge**. Cependant, l’enchaînement et la durée de ces phases varient d’une personne à l’autre, en fonction des besoins individuels. C’est pourquoi il est essentiel de ne pas se comparer ni de chercher un sommeil « idéal » au détail près. **Plus que la durée exacte, l’écoute de son corps et la prise en compte de ses signaux restent primordiales.**\n\
\n\
Les besoins en sommeil évoluent au fil des âges :\n\
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
    matomoId: 27,
    subCategory: SUB_CATEGORIES.ZOOM_SOMMEIL,
    title: "Bien dormir, oui mais comment ?",
    image: require("../../../../assets/imgs/resources/Article27.png"),
    category: CATEGORIES.DES_PETITS_PAS_POUR_SON_EQUILIBRE_MENTAL,
    content: `**Le sommeil est un besoin fondamental, mais il n’est pas toujours simple à retrouver.**\n\
\n\
Pourtant, avant d’envisager un traitement médicamenteux, des solutions naturelles, efficaces et sans risque existent. **Se lever à heure fixe, même après une mauvaise nuit, s’exposer à la lumière naturelle dès le matin, éviter les excitants en fin de journée ou instaurer une routine calme au moment du coucher** sont autant de repères précieux. En cas d’insomnie, il est préférable de quitter le lit un moment plutôt que d’y rester en ruminant. Réserver cet espace exclusivement au sommeil et à l’intimité aide le cerveau à associer lit et endormissement. Certaines approches comme les thérapies comportementales et cognitives (TCC) peuvent aussi accompagner durablement les personnes concernées par des troubles du sommeil.\n\
\n\
**Pour autant, chaque parcours est unique** : les personnes en horaires décalés, les travailleur·ses de nuit, les parents de jeunes enfants ou les personnes traversant une période de stress **ne peuvent pas toujours appliquer** les recommandations « idéales ». Pour ces situations, il est important de planifier le sommeil autant que possible, en respectant des plages régulières même si elles sont décalées. Instaurer une routine avant le coucher, même en journée, peut aider à préparer le corps au repos. Les siestes courtes, de 15 à 20 minutes, peuvent aussi être bénéfiques pour récupérer sans perturber le sommeil principal.\n\
\n\
**Enfin, attention à la tentation de tout mesurer.**\n\
\n\
Les montres connectées et applications de suivi du sommeil peuvent parfois générer une inquiétude inutile. Un sommeil réparateur n’a pas besoin d’être parfait : il doit simplement permettre de récupérer.`,
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
    matomoId: 28,
    title: "« Prendre soin de soi » : quand l'injonction au bien-être devient source de stress",
    image: require("../../../../assets/imgs/resources/Article28.png"),
    category: CATEGORIES.DES_PETITS_PAS_POUR_SON_EQUILIBRE_MENTAL,
    content: `C’est un fait.

Les messages qui encouragent à prendre soin de soi, à cultiver la confiance en soi, à s’estimer ou encore à performer sont devenus omniprésents dans l’espace public et sur les réseaux sociaux. Ils visent à promouvoir le bien-être, mais finissent parfois par créer l’effet inverse : **une pression constante à réussir, à aller bien, à tout gérer parfaitement - dans tous les aspects de sa vie**.

Il ne s’agit plus seulement de se sentir mieux, mais de devenir plus efficace, plus serein·e, plus productif·ive, plus aligné·e… en permanence. **Cette accumulation d’injonctions peut entraîner un sentiment d’insuffisance, voire de culpabilité, lorsqu’on n’y parvient pas.**

Et plutôt que de chercher à se conformer à des normes ou des idéaux extérieurs, l’enjeu est de trouver ses propres repères, personnels et adaptés à sa réalité, pour avancer à son rythme et selon ses besoins.

L’une des limites de ces discours, même bienveillants, réside dans leur tendance à **réduire la santé mentale à une responsabilité individuelle**. Or, le mal-être ne se résout pas toujours par des routines ou des méthodes personnelles. Il s’enracine parfois dans des réalités sociales plus larges : précarité, isolement, surcharge mentale, discrimination, difficultés d’accès aux soins… Autant de facteurs qui échappent au seul contrôle des individus.

Face à cette complexité, il est essentiel de **trouver un juste équilibre, même pour une application comme la nôtre**. Nous ne cherchons pas à dire à chacun·e comment aller mieux, mais à proposer des ressources que chacun·e peut s’approprier librement, selon son rythme et sa situation. **Entre conseils utiles et normes sociales implicites, il est facile de se sentir dépassé ou de douter de soi.**

C’est pourquoi **le développement de l’esprit critique est aussi un enjeu de santé mentale**. Il permet de prendre du recul face aux contenus qui circulent, de questionner les modèles qu’on nous propose, et de mieux identifier ce qui est réellement aidant pour soi.

Enfin, il ne faut pas oublier que **le soutien individuel ne peut remplacer les réponses collectives**. 

Améliorer la santé mentale, c’est aussi agir sur les conditions de vie, de travail, d’étude, et garantir un accès équitable à l’accompagnement psychologique. Ces dimensions sont indissociables.`,
    externalResources: ["550e8400-e29b-41d4-a716-446655440164"],
  },
  {
    id: "538aef1d-00de-486b-b2fc-759e5961ddcf",
    matomoId: 29,
    title: "Se promener, courir, danser, bricoler… pour se sentir mieux",
    image: require("../../../../assets/imgs/resources/Article29.png"),
    category: CATEGORIES.DES_PETITS_PAS_POUR_SON_EQUILIBRE_MENTAL,
    content: `On entend souvent dire qu’il faut « faire du sport ». Cela peut paraître contraignant, voire décourageant. Pourtant, bouger, **même un peu chaque jour**, a un réel impact sur la santé mentale. Petit **rappel : l’activité physique ne se limite pas à la pratique sportive**. Marcher, jardiner, danser, bricoler, monter les escaliers, faire ses courses à pied… Tous ces gestes du quotidien comptent, et participent à une meilleure **santé, mentale comme physique**.

### **Mais alors, pourquoi bouger fait autant du bien au moral ?**

Parce que les bénéfices sont nombreux, à plusieurs niveaux :

- **Biologiques** : l’activité physique stimule la production de sérotonine et d’endorphines, des substances naturelles qui améliorent l’humeur et réduisent le stress.
- **Psychologiques** : bouger aide à reprendre confiance en soi et à faire une pause mentale, surtout en période de stress ou de baisse de moral.
- **Sociaux** : marcher avec des collègues, participer à une activité collective, ou simplement bouger à plusieurs, renforce les liens sociaux, essentiels à l’équilibre mental.

Et ce n’est pas tout : être actif·ive permet également de prévenir plusieurs maladies chroniques, comme les maladies cardiovasculaires, le diabète, certains cancers ou encore l’obésité.

### **Et si la motivation n’est pas au rendez-vous ?**

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
    matomoId: 30,
    title: "Ce que l'assiette apporte à la tête",
    image: require("../../../../assets/imgs/resources/Article30.png"),
    category: CATEGORIES.DES_PETITS_PAS_POUR_SON_EQUILIBRE_MENTAL,
    content: `**L’alimentation ne nourrit pas que le corps : elle a aussi un impact sur notre mental.** Ce que l’on met dans son assiette peut jouer sur l’humeur, le stress et l’énergie quotidienne.

Certaines études *(voir nos ressources ci-dessous)* suggèrent qu’une alimentation riche en produits ultra-transformés, en sucres, en graisses saturées ou en sel **favorise l’inflammation dans le corps**.  Lorsqu’elle devient prolongée, cette inflammation pourrait être liée à un risque accru de **troubles de l’humeur.**

À l’inverse, **une alimentation variée**, riche en fruits, légumes, céréales complètes, bonnes graisses végétales, et faible en produits ultra-transformés contribue à stabiliser l’humeur, préserver le bien-être mental et améliorer les capacités à faire face au stress.

Mais prendre soin de son alimentation ne veut pas dire **tomber dans le contrôle permanent**. Il n’y a pas de bonne ou de mauvaise façon de manger et aucun aliment ne doit être diabolisé. Manger une part de gâteau ou un plat réconfortant **ne veut pas dire "craquer" ou "tout gâcher"** - ces mots peuvent, à force, abîmer la relation qu’on entretient avec la nourriture.

Quand l’attention portée à l’alimentation devient envahissante, qu’elle génère du stress ou prend trop de place dans le quotidien, **cela peut être le signe d’un déséquilibre**. Dans certains cas, cette hypervigilance peut faire glisser vers un trouble de la conduite alimentaire *(voir notre partie sur les TCA)*. **Il est important d’en être conscient·e et d’en parler si le besoin se fait sentir *(voir notre partie agir et chercher de l’aide).***

Des repères simples existent pour que l’alimentation devienne un allié du mental : **manger à des heures régulières, varier les repas, privilégier des aliments peu transformés, accorder de l’importance au rythme des repas, respecter ses sensations.**

Adopter une alimentation à base de produits frais, bruts et équilibrés **peut parfois représenter un coût pour le porte-monnaie.**

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
    matomoId: 31,
    title: "Parler, échanger, se relier : un vrai soutien contre l'isolement",
    image: require("../../../../assets/imgs/resources/Article31.png"),
    category: CATEGORIES.DES_PETITS_PAS_POUR_SON_EQUILIBRE_MENTAL,
    content: `**De plus en plus de personnes se sentent seules, et ce, même dans une société hyperconnectée.** Il est important de distinguer deux notions souvent confondues : l’isolement social et la solitude, qui ne sont pas une seule et même réalité.

L’isolement social désigne une situation objective dans laquelle une personne a peu ou pas de contacts avec son entourage - famille, ami·es, voisin·es, collègues - et n’occupe que peu ou pas de rôles sociaux. **Il se caractérise par une absence de relations stables, de soutien, ou de participation à la vie collective. Cet isolement peut fragiliser le bien-être mental et, lorsqu’il s’installe, avoir des conséquences importantes sur la santé globale.**

La solitude, quant à elle, est une expérience subjective. Il ne s’agit pas simplement d’être seul·e physiquement, mais de ressentir un manque ou une insatisfaction dans ses relations sociales. Elle peut être douloureuse lorsqu’elle est subie, persistante, ou non choisie. **Mais la solitude n’est pas toujours négative :** **lorsqu’elle est volontaire ou passagère, elle peut aussi être vécue comme un moment de pause, de recentrage sur soi, de repos face au rythme et aux sollicitations du quotidien.**

Cet isolement peut s’installer progressivement, durer dans le temps et passer inaperçu. **Il peut toucher tout le monde, à tous les âges, souvent sans signes visibles**. Et ses effets ne sont pas seulement psychologiques : **l’isolement social est aujourd’hui reconnu comme un facteur de risque important pour la santé mentale et physique**. Il augmente le risque de troubles dépressifs, d’anxiété, de stress chronique, de troubles du sommeil mais peut aussi avoir des effets sur la santé physique.

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
    matomoId: 32,
    title: "Être attentif à ses consommations pour protéger sa santé mentale",
    image: require("../../../../assets/imgs/resources/Article32.png"),
    category: CATEGORIES.DES_PETITS_PAS_POUR_SON_EQUILIBRE_MENTAL,
    content: `Certaines consommations - comme l’alcool, le tabac, les médicaments ou d’autres substances - peuvent évoluer au fil du temps, **particulièrement lors de périodes de fragilité ou de tension psychologique.** **Lorsqu’elles deviennent plus fréquentes, difficiles à contrôler, ou utilisées pour apaiser un mal-être, elles peuvent signaler une souffrance sous-jacente.** Ces usages ont des conséquences sur la santé mentale comme physique, et méritent une attention particulière lorsqu’ils s’installent ou changent de fonction.

Des études (voir nos ressources ci-dessous) montrent que **les personnes concernées par des troubles de santé mentale sont souvent plus exposées à des consommations à risque.** Cela ne signifie pas systématiquement une perte de contrôle, mais souligne un lien entre état psychique et recours plus fréquent à certaines substances.

**L’idée n’est pas d’être en vigilance permanente ni de scruter chacun de ses comportements, mais d’essayer de prendre un temps pour s’interroger sur ses habitudes et mieux comprendre ce que l’on traverse.**

Quelques questions peuvent aider :

- Quand et pourquoi je consomme ?
- Quelles conséquences sur mon humeur, mon moral et mon bien-être ?
- Est-ce que cette consommation devient automatique ou difficile à limiter ?
- Est-elle utilisée pour apaiser un inconfort ou une tension ?

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
    matomoId: 33,
    title: "Déconnecter un peu, ça libère la tête",
    image: require("../../../../assets/imgs/resources/Article33.png"),
    category: CATEGORIES.DES_PETITS_PAS_POUR_SON_EQUILIBRE_MENTAL,
    content: `**L’addiction aux écrans n’est pas un diagnostic officiel et le débat reste encore ouvert aujourd’hui.** De nombreuses questions subsistent sur la limite entre un usage habituel et un usage excessif.

Les chercheurs et médecins tentent de déterminer à partir de quel nombre d’heures, quel degré de perte de contrôle, ou quelles conséquences concrètes un usage devient problématique. **Néanmoins, une utilisation excessive peut avoir des impacts réels sur la santé mentale, tels que troubles du sommeil, anxiété, voire dépression.** Certaines études *(voir nos sources)* montrent que ces comportements sont souvent associés à d’autres troubles psychiques, ce qui souligne l’importance de les prendre au sérieux.

**À ce jour, le seul trouble lié aux écrans reconnu par l’Organisation mondiale de la santé (OMS) est le trouble du jeu vidéo, inscrit dans la Classification internationale des maladies (CIM-11).** Ce trouble se caractérise par une difficulté à contrôler le temps consacré au jeu, une tendance à laisser cette activité prendre le pas sur d’autres aspects de la vie (relations, études, travail), et la poursuite du jeu malgré ses conséquences négatives sur le quotidien.

**Plus qu’un simple « fantasme », notre usage des écrans est devenu un véritable enjeu de santé publique.** Cela ne signifie pas que tous les écrans sont nuisibles, mais que le défi est d’en adopter une utilisation équilibrée. En prenant conscience de nos usages et en posant des limites, nous pouvons profiter du numérique sans se laisser dépasser.

Pour accompagner cette vigilance, il peut être utile de se poser quelques questions :

- Pourquoi est-ce que j’utilise les écrans ?
- Quelles répercussions mon usage a-t-il sur mon comportement, mon moral, mon sommeil et mon hygiène de vie ?

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
  {
    id: "a1b2c3d4-e5f6-4789-a012-3456789abcd1",
    matomoId: 34,
    title: "Stress vs. anxiété : éviter la confusion",
    image: require("../../../../assets/imgs/resources/Article34.png"),
    category: CATEGORIES.REPERER_LES_SIGNES_DE_MAL_ETRE,
    subCategory: SUB_CATEGORIES.ZOOM_STRESS_AND_ANXIETY,
    content: `**Dans le langage courant, les mots *stress* et *anxiété* sont souvent confondus.** Pourtant, ils ne désignent pas la même chose, même si leurs effets peuvent parfois se ressembler.

Le stress est une réaction normale face à une situation qui demande une réponse rapide : un imprévu, une surcharge de travail, une pression extérieure. Il s'agit d'un réflexe d'adaptation qui mobilise le corps et l'esprit pour faire face à ce qui se passe. Une fois la situation terminée, la tension retombe. **Lorsqu'il est ponctuel et bien géré, le stress peut même être bénéfique** : il aide à se concentrer, à agir, à faire face. Dans ce cadre-là, il fait simplement partie de la vie.

**L'anxiété, de son côté, est une émotion liée à une menace perçue.** Elle peut surgir face à une situation à venir, au regard des autres, ou à des pensées qui tournent en boucle. Contrairement à une idée répandue, elle n'est pas toujours floue ou irrationnelle : elle peut avoir une cause bien identifiée. Comme toute émotion, elle a une fonction utile : nous alerter, nous pousser à nous adapter. **Elle n'est donc pas un trouble en soi.**

Elle peut toutefois devenir problématique lorsqu'elle devient trop fréquente, trop intense, ou qu'elle envahit le quotidien. **On parle alors de troubles anxieux (voir notre ressource sur les troubles anxieux)**. Il peut prendre différentes formes (anxiété généralisée, phobies, anxiété sociale, crises de panique...), marquées par une peur qui prend toute la place et perturbe la vie quotidienne, même en dehors des situations redoutées.

**Mais le stress chronique et l'anxiété ne sont pas la même chose.** Le stress chronique s'installe lorsque l'on vit sous pression de façon prolongée, sans possibilité de récupération. Le corps et l'esprit restent tendus en permanence, ce qui peut entraîner de la fatigue, des troubles du sommeil, de l'irritabilité, voire un épuisement. Ce n'est plus une réaction passagère, mais un état durable qui finit par user.

**La différence entre les deux tient surtout à leur origine** : l'anxiété part d'une menace perçue - qu'elle soit liée à l'avenir, à une situation présente ou à un souvenir encore pesant. Le stress chronique, lui, est lié à des conditions concrètes qui durent : surcharge, manque de répit, pressions multiples. **Les deux peuvent coexister et s'amplifier mutuellement, mais ils ne se vivent pas de la même façon, et ne demandent pas les mêmes réponses.**

Mieux comprendre ces différences permet de mettre des mots sur ce que l'on traverse, et de chercher le bon soutien, au bon moment.`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440201",
      "550e8400-e29b-41d4-a716-446655440202",
      "550e8400-e29b-41d4-a716-446655440203",
      "550e8400-e29b-41d4-a716-446655440204",
    ],
  },
  {
    id: "b2c3d4e5-f6a7-4890-b123-456789abcdef",
    matomoId: 35,
    title: "Stress, anxiété : ce que le corps essaie de dire",
    image: require("../../../../assets/imgs/resources/Article35.png"),
    category: CATEGORIES.REPERER_LES_SIGNES_DE_MAL_ETRE,
    subCategory: SUB_CATEGORIES.ZOOM_STRESS_AND_ANXIETY,
    content: `**Le stress et l'anxiété ne sont pas seulement des états mentaux. Ce sont aussi des expériences physiques**. Bien souvent, le corps s'exprime avant même que l'on ait conscience de ce qui se joue.

Lorsqu'une personne est confrontée à une situation perçue comme menaçante - qu'elle soit réelle ou non - le cerveau active un mode "alerte" : le rythme cardiaque s'accélère, la respiration devient plus rapide ou se bloque, les muscles se tendent, les sens s'aiguisent et l'individu est en hypervigilance. Des tensions abdominales ou des douleurs diffuses peuvent apparaître. Ce mécanisme de survie est naturel et utile à court terme. Mais s'il se déclenche trop souvent ou s'installe dans la durée, il finit par épuiser l'organisme.

**À force, cet état d'alerte permanent perturbe l'équilibre général. Le stress devient chronique, et le corps agit comme s'il était en danger constant.**

Chez certaines personnes, cette tension monte brusquement et donne lieu à ce qu'on appelle une **crise d'angoisse, ou crise de panique.** Sans signe avant-coureur clair, le corps s'emballe : cœur qui bat très vite, sueurs, vertiges, sensation d'étouffement, peur de perdre le contrôle. **Ces crises provoquent des réactions physiques intenses** : tremblements, nausées, oppression thoracique, engourdissements mais aussi des sensations de déréalisation - comme si le monde devenait irréel - ou de dépersonnalisation, donnant l'impression d'être détaché de soi-même.

Lorsqu'elles deviennent fréquentes, la peur qu'elles reviennent peut s'installer. **Certaines personnes commencent alors à éviter des lieux ou des situations, par crainte de déclencher une nouvelle crise.** Ce cercle peut conduire à un trouble panique, qui impacte profondément la vie quotidienne.

Aussi impressionnantes soient-elles, ces crises sont bien identifiées par les professionnel·les de santé, et des prises en charge efficaces existent. **Elles ne sont pas dangereuses sur le plan vital, mais elles indiquent que le corps a atteint un seuil critique.**

Tous ces signaux sont des messages.

**Le corps n'exagère pas - il alerte**. Apprendre à les reconnaître, c'est déjà une première étape pour mieux comprendre ce que l'on traverse et savoir quand demander de l'aide.`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440205",
      "550e8400-e29b-41d4-a716-446655440206",
      "550e8400-e29b-41d4-a716-446655440207",
      "550e8400-e29b-41d4-a716-446655440208",
      "550e8400-e29b-41d4-a716-446655440209",
      "550e8400-e29b-41d4-a716-446655440210",
    ],
  },
  {
    id: "c3d4e5f6-a789-4901-c234-56789abcdef0",
    matomoId: 36,
    title: "Stress, anxiété… Et si ce n'était pas (que) ça ?",
    image: require("../../../../assets/imgs/resources/Article36.png"),
    category: CATEGORIES.REPERER_LES_SIGNES_DE_MAL_ETRE,
    subCategory: SUB_CATEGORIES.ZOOM_STRESS_AND_ANXIETY,
    content: `**Prendre conscience de son stress ou de son anxiété est souvent un premier pas vers une compréhension plus large de ce que l'on traverse.** Ces sensations - palpitations, tensions, pensées envahissantes - ne sont pas toujours les seules causes du mal‑être. Il arrive qu'elles en soient l'expression visible, tandis que **d'autres formes de souffrance restent en arrière-plan.**

Les troubles anxieux sont rarement isolés. Ils coexistent fréquemment avec d'autres troubles psychiques, comme la dépression ou les troubles obsessionnels compulsifs (TOC). Dans de nombreux cas, **l'anxiété précède l'apparition de symptômes dépressifs.** Les deux peuvent interagir et se renforcer mutuellement, ce qui complique leur identification et leur prise en charge.

Comprendre ce qui se joue en profondeur n'est pas toujours évident. D'une part, parce que le stress et l'anxiété sont souvent considérés comme des réactions "normales" dans une vie active, surtout dans un monde où les contraintes du quotidien, les exigences constantes et l'actualité rendent **le stress presque banal, voire inévitable.** D'autre part, les signes d'un trouble associé peuvent apparaître progressivement, s'installer lentement, ou r**ester discrets derrière une anxiété persistante.** Cela peut se traduire par une fatigue inhabituelle, des difficultés à s'endormir, des réveils nocturnes ou des signes de dépression : une perte d'énergie, un repli sur soi, ou encore des comportements répétitifs visant à apaiser l'angoisse. **Ces manifestations, bien que peu alarmantes prises isolément, méritent néanmoins une attention particulière lorsqu'elles s'accumulent ou s'installent dans le temps.**

Cela ne veut pas dire qu'il faut chercher un diagnostic à tout prix, mais plutôt qu'on peut apprendre à **repérer quand le malaise s'enracine plus profondément.** Consulter un professionnel de santé peut alors permettre d'y voir plus clair, de mieux comprendre l'ensemble des symptômes, et de trouver un accompagnement adapté.`,
    externalResources: ["550e8400-e29b-41d4-a716-446655440211", "550e8400-e29b-41d4-a716-446655440212"],
  },
  {
    id: "d4e5f6a7-8901-4a12-d345-6789abcdef01",
    matomoId: 37,
    title: "Crises d'angoisse, panique et stress intense : comment mieux les gérer au quotidien",
    image: require("../../../../assets/imgs/resources/Article37.png"),
    category: CATEGORIES.REPERER_LES_SIGNES_DE_MAL_ETRE,
    subCategory: SUB_CATEGORIES.ZOOM_STRESS_AND_ANXIETY,
    content: `Le stress, l'anxiété ou les crises d'angoisse peuvent parfois prendre une place envahissante dans le quotidien. **Pour mieux les comprendre et les apaiser, il existe des outils simples, efficaces et reconnus.** Avec un peu de pratique, il est possible d'aider le corps à sortir de cet état d'alerte : en apprenant, par exemple, à mieux respirer, à relâcher les tensions et à retrouver un certain calme intérieur.

**Des exercices réguliers, combinés à un accompagnement adapté, peuvent réellement contribuer à améliorer le bien-être.**

Il est aussi essentiel de rappeler que certains événements restent, parfois, hors de notre contrôle - un deuil, des difficultés financières, ou encore des discriminations, par exemple. **Ces outils peuvent apporter un soutien, mais ne suffisent pas toujours à tout surmonter.** N'hésitez pas à demander de l'aide lorsque les difficultés deviennent trop lourdes à porter seul.e

*(voir notre rubrique agir et chercher de l'aide).*`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440018",
      "550e8400-e29b-41d4-a716-446655440262",
      "550e8400-e29b-41d4-a716-446655440263",
      "550e8400-e29b-41d4-a716-446655440264",
    ],
  },
  {
    id: "e5f6a789-0123-4b23-e456-789abcdef012",
    matomoId: 45,
    title: "Santé mentale des enfants et adolescents : comprendre, repérer, accompagner",
    image: require("../../../../assets/imgs/resources/Article45.png"),
    category: CATEGORIES.REPERER_LES_SIGNES_DE_MAL_ETRE,
    content: `L'enfance et l'adolescence sont des périodes d'apprentissage, de découverte et d'exploration de soi et du monde qui les entoure. Elles offrent de nombreuses opportunités de développement, de curiosité et d'épanouissement.

Pour autant, certains enfants et adolescents peuvent traverser des périodes de vulnérabilité psychique. **Plus d'un enfant sur dix souffre d'un trouble mental *(Santé Publique France, 2024)*, et un adolescent sur sept présente un risque sérieux de dépression** *(EnCLASS, 2022)*.

Les troubles psychiques chez les jeunes résultent souvent de plusieurs causes. Ils peuvent être liés à **des facteurs internes**, comme la génétique, les hormones ou le développement cérébral, et à **des facteurs externes**, comme l'environnement familial, scolaire, économique ou social, ou encore des événements d'actualité pouvant générer inquiétude et stress. Ces troubles apparaissent fréquemment pendant l'adolescence, une période de grands changements physiques, cognitifs et émotionnels.

Chez les enfants, ces troubles peuvent se manifester par de l'anxiété, des troubles du sommeil, des difficultés de comportement ou des troubles de l'apprentissage. Ces derniers ne sont pas toujours le signe d'un mal-être, mais peuvent parfois en être la cause.

Chez les adolescents, l'anxiété, la dépression, les troubles alimentaires ou l'automutilation peuvent apparaître. Même si un jeune n'exprime pas ses émotions, cela ne veut pas dire qu'il ne rencontre pas de difficultés. **Les adultes doivent rester attentifs et consulter dès les premiers signes d'inquiétude plutôt que d'attendre que la situation s'aggrave.**

Heureusement, des dispositifs spécialisés existent pour accompagner les enfants, les adolescents et leur entourage :

- Le **médecin de famille** (ou le pédiatre) est souvent le premier interlocuteur.
- Les **services de protection maternelle et infantile (PMI)** proposent un suivi précoce pour les femmes enceintes, les nourrissons et les jeunes enfants (0-6 ans), ainsi que des conseils aux familles sur la santé, le développement et la prévention.
- Les **centres médico-psychologiques (CMP)** accueillent **tous les âges**, enfants, adolescents et adultes, et offrent un soutien psychologique et psychiatrique adapté.
- Pour les adolescents, les **Points accueil-écoute Jeunes (PAEJ)**, les **Maisons des adolescents (MDA)** et les **consultations jeunes consommateurs (CJC)** pour les conduites addictives proposent un accompagnement ciblé.
- Des dispositifs d'écoute téléphonique et en ligne, comme **Fil Santé Jeunes (0800 235 236)**, complètent ces dispositifs d'aide.

Il est crucial que les adultes qui vivent, travaillent ou accompagnent des enfants et adolescents soient attentifs et responsables. Leur vigilance, leur écoute et leur engagement sont indispensables pour détecter les signes de souffrance, même lorsque ceux-ci ne sont pas exprimés, et pour garantir un soutien approprié. La santé mentale des jeunes est un enjeu collectif qui appelle à une mobilisation partagée.`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440275",
      "550e8400-e29b-41d4-a716-446655440276",
      "550e8400-e29b-41d4-a716-446655440277",
      "550e8400-e29b-41d4-a716-446655440278",
      "550e8400-e29b-41d4-a716-446655440279",
      "550e8400-e29b-41d4-a716-446655440032",
      "550e8400-e29b-41d4-a716-446655440037",
      "550e8400-e29b-41d4-a716-446655440031",
      "550e8400-e29b-41d4-a716-446655440036",
      "550e8400-e29b-41d4-a716-446655440042",
      "550e8400-e29b-41d4-a716-446655440187",
      "550e8400-e29b-41d4-a716-446655440280",
      "550e8400-e29b-41d4-a716-446655440281",
      "550e8400-e29b-41d4-a716-446655440282",
    ],
  },
  {
    id: "f6a78901-2345-4c34-f567-89abcdef0123",
    matomoId: 46,
    title: "Santé mentale des parents : comprendre, repérer, accompagner",
    image: require("../../../../assets/imgs/resources/Article46.png"),
    category: CATEGORIES.REPERER_LES_SIGNES_DE_MAL_ETRE,
    content: `**La parentalité est une période de grands changements**, souvent source de joie et d'épanouissement, elle peut aussi bousculer l'équilibre émotionnel. Il est fréquent de traverser des moments de fatigue, de doute, de solitude ou d'inquiétude face à ces transformations. Cependant, lorsque ces émotions deviennent trop envahissantes ou durent dans le temps, il peut être utile d'en parler et de chercher du soutien.

Juste après l'accouchement, de nombreuses femmes connaissent un épisode de « baby blues » : une phase transitoire marquée par une sensibilité accrue, de l'irritabilité ou des pleurs. Ce phénomène, lié aux bouleversements hormonaux et à la fatigue, disparaît généralement en quelques jours. Mais lorsque ces symptômes persistent ou s'aggravent, **ils peuvent être le signe d'une dépression post-partum.** D'après l'enquête nationale périnatale menée en 2021, **16,7 % des femmes** **en présentent les signes deux mois après l'accouchement.**

**Les pères peuvent eux aussi être concernés par une dépression périnatale, souvent méconnue. Elle toucherait environ un homme sur dix**, avec une fréquence plus élevée lorsque leur partenaire traverse elle-même une dépression. Ces troubles restent encore peu identifiés, bien qu'ils puissent avoir un impact important sur l'équilibre familial.

Certains signes peuvent alerter : fatigue persistante, perte d'intérêt, troubles du sommeil, irritabilité, sentiment d'échec ou retrait vis-à-vis de l'enfant. Ces manifestations s'inscrivent parfois dans un **épuisement parental**, ou « burn-out parental », lié à une surcharge prolongée, sans espace de repos ni de soutien.

Face à ces situations, **différentes formes d'aide existent**. Des professionnel·les de santé peuvent être sollicités : médecins, sages-femmes, psychologues, psychiatres. Les services de Protection Maternelle et Infantile (PMI), présents dans chaque département, proposent un accompagnement médico-social gratuit pour les jeunes enfants et leurs parents. D'autres dispositifs existent également : lignes d'écoute, centres de consultation en périnatalité, associations de soutien à la parentalité. **Ces ressources permettent de rompre l'isolement, de mieux comprendre ce qui se joue et de retrouver un équilibre.**

Il est essentiel de rappeler qu'il n'existe **pas de modèle parental idéal**. La parentalité implique des ajustements, des doutes, parfois des moments de fragilité. Ce n'est pas la perfection qui protège l'enfant, mais la capacité à reconnaître ses limites, à demander de l'aide lorsque c'est nécessaire et à bénéficier d'un accompagnement adapté.`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440268",
      "550e8400-e29b-41d4-a716-446655440269",
      "550e8400-e29b-41d4-a716-446655440270",
      "550e8400-e29b-41d4-a716-446655440035",
      "550e8400-e29b-41d4-a716-446655440148",
      "550e8400-e29b-41d4-a716-446655440271",
      "550e8400-e29b-41d4-a716-446655440272",
      "550e8400-e29b-41d4-a716-446655440273",
      "550e8400-e29b-41d4-a716-446655440274",
    ],
  },
  {
    id: "a789012b-3456-4d45-a678-9abcdef01234",
    matomoId: 47,
    title: "Savoir repérer le mal-être au travail, un premier pas essentiel",
    image: require("../../../../assets/imgs/resources/Article47.png"),
    category: CATEGORIES.REPERER_LES_SIGNES_DE_MAL_ETRE,
    content: `Le travail peut occuper une place importante dans nos vies. Il organise souvent nos journées, crée des liens avec les autres, et peut contribuer à un sentiment d'utilité ou d'accomplissement. Lorsqu'il se déroule dans de bonnes conditions, il favorise l'estime de soi et soutient l'équilibre psychique.

Cependant, le travail peut aussi générer des tensions, de la détresse, voire des situations dangereuses. Une surcharge chronique, une pression constante, des horaires instables, une précarité, ainsi que l'absence de reconnaissance et de dialogue peuvent fragiliser notre santé mentale. Par ailleurs, des situations telles que le harcèlement moral ou sexuel, les discriminations, le racisme ou les mises à l'écart aggravent ce mal-être. Ces réalités, loin d'être rares, peuvent provoquer troubles du sommeil, anxiété, épuisement, dévalorisation, et parfois conduire à un burn-out ou à un isolement profond.

Il est important de ne pas  minimiser ces signes ni de les attribuer à une faiblesse individuelle. Ce sont les organisations de travail qui doivent garantir un environnement de travail respectueux, sécurisé et soutenant. En France, la loi impose aux employeurs de protéger la santé physique et mentale de leurs salarié·es, notamment en identifiant et en prévenant les risques psychosociaux.

La santé mentale au travail est une question collective : la souffrance d'une personne affecte souvent l'ensemble du groupe, tandis qu'un climat respectueux, inclusif et bienveillant favorise la confiance, la coopération et le respect des différences.

Il est essentiel de rester attentif à l'impact du travail sur notre santé mentale, de savoir reconnaître les signaux d'alerte, et de ne pas considérer les difficultés comme une fatalité ou une simple caractéristique du travail. Identifier ce qui soutient ou nuit à notre bien-être professionnel est une étape clé. Il est légitime de chercher du soutien : en parler à un·e collègue, un·e responsable, solliciter la médecine du travail ou consulter un·e professionnel·le de santé.

Le travail ne doit jamais être une source de souffrance. Protéger la santé mentale est un droit fondamental qui repose principalement sur la responsabilité des employeurs et des organisations, mais qui gagne à être soutenu par la vigilance et la solidarité de tous.`,
    externalResources: ["550e8400-e29b-41d4-a716-446655440265", "550e8400-e29b-41d4-a716-446655440266", "550e8400-e29b-41d4-a716-446655440267"],
  },
  {
    id: "b1c2d3e4-f5a6-4b78-c901-234567890abc",
    matomoId: 38,
    title: "Demander de l'aide, ce n'est pas être faible",
    image: require("../../../../assets/imgs/resources/Article38.png"),
    category: CATEGORIES.AGIR_ET_CHERCHER_DE_L_AIDE_SANS_HONTE,
    content: `Tout le monde peut traverser des périodes difficiles. Se sentir dépassé·e, épuisé·e, irritable. Ne plus avoir envie de faire ce qu'on aime. Mal dormir. S'isoler. Avoir du mal à se concentrer. **Ces signes ne sont pas forcément le signe d'un trouble, mais ils méritent qu'on y prête attention** (voir notre rubrique reconnaître un mal-être).

La première étape pour aller mieux, c'est souvent de reconnaître qu'on ne va pas bien. Prendre conscience qu'on a besoin d'aide, ce n'est pas un échec, ni un aveu de faiblesse. **C'est une manière de prendre soin de soi, au bon moment, avant que les choses ne s'aggravent.**

Demander de l'aide ne signifie pas forcément consulter un·e professionnel·le immédiatement. **Cela peut simplement commencer par une conversation avec une personne de confiance et disponible : un·e ami·e, un·e membre de la famille, un·e collègue, un·e voisin·e.** Dire que ça ne va pas permet déjà de relâcher un peu la pression. Ces premiers échanges peuvent aussi aider à mieux comprendre ce que l'on traverse, ou à envisager des solutions qui n'avaient pas encore été identifiées jusque-là.

**Comment s'y prendre ?**

Il n'est pas nécessaire de trouver les bons mots ni de tout expliquer dans les moindres détails. Quelques phrases suffisent, comme  :

- « En ce moment, je ne vais pas très bien. »
- « J'ai l'impression que je perds pied. »
- « J'aurais besoin de parler à quelqu'un. »

Ce premier échange permet de sortir de l'isolement, de se sentir un peu soutenu·e, et de poser les bases d'une aide plus adaptée, si besoin. **Si la situation le demande, il est possible de s'adresser à un·e professionnel·le.** Le médecin traitant peut faire le point, orienter vers un suivi ou simplement écouter. Il s'agit souvent de la première porte d'entrée. Des ressources existent à tous les niveaux : psychologues, centres médico-psychologiques (CMP), associations, lignes d'écoute.

**Il n'y a pas de seuil critique à atteindre pour demander de l'aide. Ce besoin est légitime, dès qu'il se fait sentir.**`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440004",
      "550e8400-e29b-41d4-a716-446655440039",
      "550e8400-e29b-41d4-a716-446655440036",
      "550e8400-e29b-41d4-a716-446655440213",
      "550e8400-e29b-41d4-a716-446655440214",
      "550e8400-e29b-41d4-a716-446655440215",
      "550e8400-e29b-41d4-a716-446655440216",
      "550e8400-e29b-41d4-a716-446655440217",
      "550e8400-e29b-41d4-a716-446655440283",
    ],
  },
  {
    id: "c2d3e4f5-a6b7-4c89-d012-3456789abcde",
    matomoId: 39,
    title: "Psychologue, psychiatre, CMP, ligne d'écoute… à qui s'adresser ?",
    image: require("../../../../assets/imgs/resources/Article39.png"),
    category: CATEGORIES.AGIR_ET_CHERCHER_DE_L_AIDE_SANS_HONTE,
    content: `Lorsque les difficultés durent et impactent la vie quotidienne, ou que les ressources personnelles (comme parler à ses proches, pratiquer ses activités préférées ou prendre du temps pour soi) ne suffisent plus, il est important de chercher un soutien extérieur. Face à la diversité des options, il n'est pas toujours simple de savoir vers qui se tourner.

- **Le médecin traitant est souvent le premier contact.** Il ou elle connaît votre parcours de santé, peut évaluer votre situation et vous orienter selon vos besoins. Si vous ressentez un mal-être général ou cherchez un avis pour savoir quelle aide envisager, c'est lui qu'il faut voir en priorité.
- **Le psychiatre est un médecin spécialiste de la santé mentale.** Si vous avez besoin d'un diagnostic précis, d'un traitement médical, ou d'un suivi spécialisé, il ou elle est le professionnel adapté. Il peut aussi proposer une thérapie. Ses consultations sont généralement remboursées par l'Assurance Maladie, mais le reste à charge peut varier en fonction de son secteur de convention et du respect du parcours de soins coordonné.
- **Le psychologue propose un accompagnement par la parole, un soutien ou une thérapie**. Si vous souhaitez parler de vos difficultés sans traitement médical, c'est vers lui que vous pouvez vous tourner. Les consultations sont généralement à votre charge, sauf dans certains dispositifs spécifiques comme *Mon Soutien Psy* ou selon votre mutuelle.
- **Les centres médico-psychologiques (CMP) sont des structures publiques de proximité qui offrent un accompagnement global, souvent gratuit et sans avance de frais.** Si vous préférez un suivi pluridisciplinaire ou un soutien accessible près de chez vous, ils sont une bonne option.
- **Le dispositif *Mon Soutien Psy* permet de bénéficier jusqu'à 12 séances d'accompagnement psychologique avec un psychologue partenaire.** Chaque séance coûte 50 euros, remboursée à 60 % par l'Assurance Maladie, le reste pouvant être pris en charge par votre complémentaire santé. Ce dispositif s'adresse à toute personne dès l'âge de 3 ans, en cas d'anxiété, de déprime ou de mal-être. Il est possible de prendre rendez-vous directement, en toute autonomie, via le site [https://monsoutienpsy.ameli.fr/](https://monsoutienpsy.ameli.fr/) ou de passer par votre médecin si vous préférez être accompagné·e dans la démarche.
- **Des lignes d'écoute gratuites, anonymes et accessibles à distance sont aussi disponibles.** Elles peuvent être une première étape pour parler librement, poser vos questions ou simplement ne pas rester seul·e face à une difficulté.
- **Enfin, certains choisissent les groupes de parole, associations ou communautés en ligne pour partager leurs expériences avec d'autres personnes concernées.** Ces espaces ne remplacent pas un suivi médical, mais offrent un soutien précieux par le partage et la compréhension mutuelle.

Chaque ressource a son rôle, selon votre situation et vos besoins. Certaines proposent un soutien ponctuel, d'autres un accompagnement sur le long terme. Certaines relèvent du soin, d'autres du lien social. Il n'existe pas de parcours unique ni de solution universelle : l'essentiel est de pouvoir identifier, à votre rythme, ce qui vous convient le mieux.

Dès que vous ressentez un mal-être, même léger, consultez sans hésiter : cela évite que les difficultés ne s'intensifient avec le temps.`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440218",
      "550e8400-e29b-41d4-a716-446655440219",
      "550e8400-e29b-41d4-a716-446655440220",
      "550e8400-e29b-41d4-a716-446655440221",
      "550e8400-e29b-41d4-a716-446655440222",
      "550e8400-e29b-41d4-a716-446655440223",
      "550e8400-e29b-41d4-a716-446655440224",
      "550e8400-e29b-41d4-a716-446655440283",
    ],
  },
  {
    id: "d3e4f5a6-b7c8-4d90-e123-456789abcdef",
    matomoId: 40,
    title: "Idées et crises suicidaires : comment agir, qui contacter ?",
    image: require("../../../../assets/imgs/resources/Article40.png"),
    category: CATEGORIES.AGIR_ET_CHERCHER_DE_L_AIDE_SANS_HONTE,
    content: `Les idées suicidaires font partie des manifestations possibles d'une détresse psychique. Elles ne traduisent pas nécessairement une volonté de mourir, mais plutôt le besoin d'échapper à une souffrance devenue insupportable. Ces pensées peuvent survenir lors de périodes de grande fatigue émotionnelle, de perte d'espoir ou de difficultés personnelles importantes. Elles indiquent qu'un soutien est nécessaire pour faire face à cette douleur et retrouver des repères.

Il est essentiel d'en parler. Aborder le sujet du suicide ne fait pas naître d'idées suicidaires chez quelqu'un qui n'en a pas. Au contraire, cela permet souvent d'ouvrir un espace d'écoute, de compréhension et de réduire le sentiment d'isolement.

La crise suicidaire est un état de souffrance psychique intense dans lequel les pensées de mort deviennent envahissantes et la personne peut envisager concrètement de mettre fin à ses jours. Elle se sent piégée, sans issue, et la mort peut sembler être la seule solution à une douleur perçue comme insupportable. Bien que cet état soit temporaire et réversible, il nécessite une aide immédiate.

**Certains comportements peuvent indiquer qu'une personne est en danger immédiat :**

- Elle parle de sa décision de mourir ou évoque la mort de façon insistante.
- Elle met de l'ordre dans ses affaires, fait ses adieux ou paraît étrangement calme.
- Elle se procure des moyens pour se suicider (médicaments, arme, corde, etc.).
- Elle exprime le sentiment d'avoir tout essayé, sans issue possible.
- Elle s'isole de manière inhabituelle ou manifeste une agitation soudaine.
- Elle semble paralysée par la dépression, le désespoir ou une douleur psychique intense.

**Que faire si vous avez des idées suicidaires ?**

Si vous traversez une période difficile avec des pensées suicidaires, ne restez pas seul·e. Parler à un proche de confiance ou à un professionnel de santé peut permettre de prendre du recul et de trouver des solutions adaptées. Vous pouvez également contacter une ligne d'écoute spécialisée, gratuite et anonyme, comme le 3114 (numéro national de prévention du suicide, accessible 24h/24 et 7j/7). En cas d'urgence, contactez les services d'urgence (15 ou 112) ou rendez-vous à l'hôpital.

**Que faire si quelqu'un dans votre entourage pense au suicide ?**

Si un proche montre des signes inquiétants, il est normal de se sentir perdu·e, inquiet·ète ou dépassé·e. Ces réactions sont naturelles : il n'est pas toujours facile de savoir comment réagir face à la souffrance d'un·e proche. N'hésitez pas à demander de l'aide à un professionnel (médecin, psychologue, ligne d'écoute, etc.) ou à contacter les urgences si la situation vous paraît grave.

**En attendant :**

- Prenez les signes au sérieux, même s'ils vous semblent discrets.
- Évitez les jugements, les reproches ou les moqueries.
- Ne promettez pas de garder le silence : en parler à un professionnel peut sauver une vie.
- Ne minimisez pas sa souffrance et ne la comparez pas à d'autres expériences.
- Soyez à l'écoute, posez des questions ouvertes pour mieux comprendre ce que la personne vit.
- Montrez de l'empathie, soutenez-la sans jugement et restez présent·e.
## Si vous ou un proche avez besoin d'aide, voici des ressources d’écoute disponibles à tout moment :

[**3114**](https://3114.fr/)

Numéro national de prévention du suicide.

Permanence d’écoute téléphonique 24h/24 et 7j/7.

[**Suicide Écoute**](https://www.suicide-ecoute.fr/)

Écoute anonyme des personnes confrontées au suicide. 

01 45 39 40 00 – 24h/24 et 7j/7

[**SOS Suicide Phénix**](https://sos-suicide-phenix.org/)

Accueil et écoute anonyme de toute personne confrontée à la problématique du suicide.01 40 44 46 45 – tous les jours de 13h à 23h

Messagerie disponible sur leur site

[**Phare Enfants-Parents**](https://www.phare.org/)

Espace d’accueil et d’écoute contre le mal-être et la prévention du suicide des jeunes, s’adressant aux parents et aux jeunes.01 43 46 00 62 – du lundi au vendredi de 10h à 17h

Messagerie sur le site de l’association

[**Dites Je suis Là**](https://www.ditesjesuisla.fr/)

Plateforme nationale de prévention du suicide destinée au grand public.

[**Fil Santé Jeunes**](https://www.filsantejeunes.com/)

Service d’écoute pour les 12-25 ans sur les thèmes de la santé, de la sexualité, du mal-être, etc. 0 800 235 236 (9h à 23h) – Tchat individuel de 9h à 22h

[**Nightline**](https://www.nightline.fr/)

Service d’écoute nocturne par et pour les étudiant·es

Numéros locaux selon les villes (disponibles sur le site)

Tchat anonyme tous les soirs de 21h à 2h30.

[**SOS Amitié**](https://www.sosamitie.org/)

Service d’écoute bienveillant, gratuit, anonyme et confidentiel destiné à ceux qui traversent une période difficile.

Écoute téléphonique 24h/24 et 7j/7 – 09 72 39 40 50

Tchat de 13h à 3h du matin – Messagerie disponible sur leur site`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440225",
      "550e8400-e29b-41d4-a716-446655440226",
      "550e8400-e29b-41d4-a716-446655440227",
      "550e8400-e29b-41d4-a716-446655440228",
      "550e8400-e29b-41d4-a716-446655440229",
      "550e8400-e29b-41d4-a716-446655440230",
      "550e8400-e29b-41d4-a716-446655440231",
      "550e8400-e29b-41d4-a716-446655440232",
      "550e8400-e29b-41d4-a716-446655440233",
      "550e8400-e29b-41d4-a716-446655440234",
      "550e8400-e29b-41d4-a716-446655440235",
    ],
  },
  {
    id: "e4f5a6b7-c8d9-4e01-f234-56789abcdef0",
    matomoId: 41,
    title: "Je m'inquiète pour un proche : que faire sans paniquer ?",
    image: require("../../../../assets/imgs/resources/Article41.png"),
    category: CATEGORIES.AGIR_ET_CHERCHER_DE_L_AIDE_SANS_HONTE,
    content: `**Face à un proche qui semble aller mal, il est normal de se sentir démuni.** On peut avoir peur de dire quelque chose de maladroit, de mal faire, ou simplement ne pas savoir comment s'y prendre. Pourtant, la simple présence d'un·e proche, même imparfaite, peut déjà faire une réelle différence.

**Il n'est pas nécessaire de trouver les mots justes.** Un simple « Je me fais du souci pour toi » ou « J'ai l'impression que tu ne vas pas très bien, tu veux en parler ? » peut suffire à ouvrir un échange. Et si les mots manquent, il est tout à fait possible de le dire. Par exemple : « Je ne sais pas trop comment t'aider, mais je suis là si tu as besoin de compagnie, d'aide ou si tu veux parler. » **Reconnaître son propre désarroi est souvent plus juste que de chercher une réponse toute faite. Cela peut même soulager l'autre, qui se sent alors accueilli·e sans pression.**

**L'objectif n'est pas forcément de faire parler à tout prix, mais d'offrir un espace de soutien, aussi simple soit-il.** Il peut s'agir de discuter, mais aussi de proposer une aide concrète : faire les courses, marcher ensemble, accompagner à un rendez-vous, aller chercher les enfants à l'école, ou simplement passer du temps à deux. Ces gestes, parfois modestes, montrent que l'on est présent·e, que l'autre compte, et que son mal-être est pris au sérieux.

**Lorsque la personne est disposée ou d'accord**, il peut être utile d'envisager ensemble des ressources : un médecin, un professionnel de santé mentale, ou une ligne d'écoute. Le 3114, numéro national gratuit et accessible 24h/24 et 7j/7, permet d'échanger avec des professionnels formés à ces situations, en toute confidentialité.

Si la personne ne souhaite pas appeler elle-même, il est tout à fait possible, en tant que proche ou professionnel de l'entourage, de **contacter le 3114** pour obtenir des conseils personnalisés, en fonction de ce que vous observez et de ce que vous ressentez.

Si l'inquiétude grandit ou si un danger immédiat est pressenti, **il est important de ne pas rester seul** face à la situation. Contacter les urgences (15 ou 112) ou consulter un professionnel de santé permet de mobiliser rapidement l'aide nécessaire.

Enfin, accompagner quelqu'un en souffrance peut être éprouvant.

**Prendre soin de soi, parler de ses propres émotions, demander un soutien psychologique ou simplement se faire accompagner est une démarche légitime et souvent nécessaire pour continuer à aider sans s'épuiser.**`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440236",
      "550e8400-e29b-41d4-a716-446655440237",
      "550e8400-e29b-41d4-a716-446655440238",
      "550e8400-e29b-41d4-a716-446655440239",
      "550e8400-e29b-41d4-a716-446655440240",
      "550e8400-e29b-41d4-a716-446655440241",
      "550e8400-e29b-41d4-a716-446655440242",
      "550e8400-e29b-41d4-a716-446655440283",
    ],
  },
  {
    id: "f5a6b7c8-d9e0-4f12-a345-6789abcdef01",
    matomoId: 42,
    title: "Accompagner un proche qui vit avec un trouble : quelques repères pour ne pas se perdre",
    image: require("../../../../assets/imgs/resources/Article42.png"),
    category: CATEGORIES.AGIR_ET_CHERCHER_DE_L_AIDE_SANS_HONTE,
    content: `**Lorsqu'un membre de la famille, un partenaire, un enfant ou un ami vit avec un trouble psychique, cela a souvent des répercussions sur tout l'entourage.** Même sans partager le même logement, la maladie peut modifier le quotidien : inquiétudes, réorganisations, responsabilités nouvelles. **La volonté d'être présent et de soutenir se confronte parfois à un sentiment d'impuissance.**

Dans ces situations, il n'est pas rare de se sentir écartelé entre plusieurs rôles : aidant, parent, conjoint, ami… Parfois, tout se mêle, sans savoir quelle place tenir. **Au-delà du lien personnel, la place de proche aidant reste encore peu visible et reconnue socialement.** Ce rôle mobilise pourtant beaucoup d'énergie -  physique, psychique, émotionnelle - et peut devenir difficile à assumer sur la durée. **Beaucoup se sentent seuls face à cette responsabilité, isolés dans leur expérience.**

**Être aidant, ce n'est pas être soignant, ni devoir tout assumer.** Souvent, cela signifie soutenir dans les petits gestes du quotidien, être une présence, offrir un repère. Mais ce rôle n'efface ni les doutes, ni la fatigue, ni la peur de mal faire. Reconnaître que cette charge existe, qu'elle peut durer, n'est pas un aveu de faiblesse -  c'est un premier pas pour se préserver.

**Dans ce contexte, demander du soutien est non seulement légitime, mais essentiel.** Mieux comprendre le trouble dont souffre son proche, rencontrer d'autres aidants, participer à des groupes de parole, se tourner vers des associations ou des ressources spécialisées : autant de moyens de prendre du recul, de se sentir moins seul, et d'agir avec plus de repères.

L'objectif n'est pas de tout résoudre ni de trouver des solutions parfaites. Être aux côtés d'un proche fragilisé demande parfois de l'endurance.

**Pour ne pas s'épuiser, il est essentiel de préserver sa propre santé mentale : écouter ses besoins, poser des limites claires, et accepter que l'on ne peut pas tout porter seul. Aider ne veut pas dire s'effacer.**`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440237",
      "550e8400-e29b-41d4-a716-446655440243",
      "550e8400-e29b-41d4-a716-446655440244",
      "550e8400-e29b-41d4-a716-446655440245",
      "550e8400-e29b-41d4-a716-446655440246",
      "550e8400-e29b-41d4-a716-446655440247",
      "550e8400-e29b-41d4-a716-446655440248",
      "550e8400-e29b-41d4-a716-446655440249",
      "550e8400-e29b-41d4-a716-446655440250",
      "550e8400-e29b-41d4-a716-446655440251",
      "550e8400-e29b-41d4-a716-446655440283",
    ],
  },
  {
    id: "a6b7c8d9-e0f1-4a23-b456-789abcdef012",
    matomoId: 43,
    title: "Se soutenir entre personnes concernées par un trouble : découvrir la pair-aidance",
    image: require("../../../../assets/imgs/resources/Article43.png"),
    category: CATEGORIES.AGIR_ET_CHERCHER_DE_L_AIDE_SANS_HONTE,
    content: `**Qui mieux que les personnes ayant elles-mêmes traversé un trouble peuvent comprendre ce que vivent celles et ceux qui en souffrent au quotidien** ? La pair-aidance repose sur ce principe : des individus partageant une expérience commune offrent leur savoir, leur écoute et leur soutien à d'autres confrontés à des difficultés similaires.

**Pouvoir s'identifier, se reconnaître dans les récits d'autrui est un élément essentiel.** Cela permet de sentir que l'on n'est pas seul, que d'autres ont traversé des épreuves comparables. Cette identification facilite souvent l'acceptation des conseils et des orientations proposées, car ils viennent d'une personne qui comprend intimement ce parcours.

Le rôle concret d'un pair-aidant peut varier : **animer des groupes de parole, accompagner dans les démarches, répondre à des questions pratiques ou simplement offrir un soutien moral.** Ce lien fondé sur la reconnaissance mutuelle permet de se sentir accepté tel que l'on est, avec ses difficultés, et aide à reprendre confiance en ses capacités à avancer.

**Aujourd'hui, la pair-aidance est une profession reconnue.** En France, des formations spécialisées valorisent cette expertise fondée sur l'expérience, tout en développant des compétences professionnelles. **L'Organisation mondiale de la Santé (OMS) souligne l'importance de ce rôle complémentaire aux soins traditionnels, qui apporte un accompagnement humain, bienveillant et inclusif.**

Pour beaucoup, ce soutien devient un élément essentiel du parcours de rétablissement, offrant une écoute adaptée et un accompagnement concret dans la vie de tous les jours.`,
    externalResources: ["550e8400-e29b-41d4-a716-446655440254", "550e8400-e29b-41d4-a716-446655440255", "550e8400-e29b-41d4-a716-446655440256"],
  },
  {
    id: "b7c8d9e0-f1a2-4b34-c567-89abcdef0123",
    matomoId: 44,
    title: "Et après ? Comprendre le rétablissement",
    image: require("../../../../assets/imgs/resources/Article44.png"),
    category: CATEGORIES.AGIR_ET_CHERCHER_DE_L_AIDE_SANS_HONTE,
    content: `**Que signifie réellement "se rétablir" quand on vit avec un trouble psychique ?** Est-ce retrouver une forme d'équilibre au quotidien ? Apprendre à vivre avec certaines difficultés sans qu'elles prennent toute la place ? Ou simplement pouvoir se projeter à nouveau, malgré des vulnérabilités persistantes ?

Le rétablissement ne signifie pas nécessairement la disparition totale des symptômes ni une guérison au sens médical. **Il s'agit plutôt de retrouver une forme de stabilité et de sens, même en présence de ces difficultés.** C'est un cheminement personnel, intime, qui appartient à chaque personne concernée. Chacun·e en donne sa propre définition : retrouver confiance, renouer avec ses envies, reprendre des liens sociaux, avoir un projet… **ou simplement sentir qu'on existe pleinement à nouveau.**

Ce processus est souvent non linéaire, ponctué d'avancées, de pauses, de reculs. Il peut durer, évoluer, ou prendre différentes formes selon les périodes de vie. **Et surtout, il ne repose pas uniquement sur les efforts individuels.** De nombreux facteurs extérieurs influencent ce parcours : conditions de vie, accès aux soins, qualité du soutien, ressources disponibles… La précarité, l'isolement, les discriminations ou les violences peuvent rendre ce chemin plus complexe, même quand tout est mis en œuvre pour aller mieux.

**C'est pourquoi le rétablissement est aussi un enjeu collectif.** Il suppose que l'entourage, les professionnel·les et la société créent des conditions favorables : des soins accessibles, un logement digne, un emploi adapté, une reconnaissance du vécu. Créer ces conditions, c'est permettre à chacun·e de trouver sa place - ce qui reste un défi, dans une société où les vécus psychiques sont encore largement incompris ou invisibilisés.

**Enfin, il est essentiel de rappeler que vivre avec un trouble psychique ne définit pas une personne. Se rétablir, c'est aussi pouvoir exister pleinement, dans toute sa singularité.**`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440257",
      "550e8400-e29b-41d4-a716-446655440258",
      "550e8400-e29b-41d4-a716-446655440259",
      "550e8400-e29b-41d4-a716-446655440260",
      "550e8400-e29b-41d4-a716-446655440261",
    ],
  },
  {
    id: "6f5c8b7e-3d23-4c0f-8c9e-aef902c6f4b1",
    matomoId: 48,
    title: "Médicaments et santé mentale : ce qu’il faut savoir",
    image: require("../../../../assets/imgs/resources/Article47.png"),
    category: CATEGORIES.MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES,
    content: `**Prendre soin de sa santé mentale peut passer par différents chemins.** **Les médicaments font partie des options possibles, mais leur prescription n’est jamais automatique.**  
Dans les troubles anxieux ou dépressifs légers à modérés, par exemple, le soutien psychothérapeutique ou d’autres formes d’accompagnement sont souvent privilégiés en premier recours.

Les médicaments psychotropes ont pour objectif de **soulager une souffrance intense, de réduire certains symptômes ou de permettre de retrouver une stabilité suffisante pour avancer dans d’autres formes de soin.**  
Ils agissent sur le cerveau en modifiant certains mécanismes biologiques impliqués dans la régulation des émotions, des pensées et des comportements.

Il existe différentes catégories de médicaments psychotropes, selon les besoins et la situation de chaque personne :

- **les antidépresseurs**, utilisés pour traiter les troubles dépressifs et anxieux,
- **les neuroleptiques (ou antipsychotiques)**, destinés à réduire certains troubles de la pensée ou de la perception,
- **les anxiolytiques (ou tranquillisants)**, qui diminuent l’anxiété ou la tension nerveuse,
- **les hypnotiques (ou somnifères)**, prescrits pour faciliter le sommeil,
- **les stabilisateurs de l’humeur** (aussi appelés régulateurs de l’humeur, thymorégulateurs ou normothymiques), qui aident à prévenir les variations émotionnelles importantes.

**Comme tout traitement, ces médicaments peuvent apporter des bénéfices, mais aussi entraîner des effets indésirables, parfois difficiles à vivre.**  
Lorsqu’ils sont arrêtés, des réactions physiques ou émotionnelles peuvent également survenir. C’est pourquoi leur usage demande un accompagnement attentif et une réévaluation régulière.

**Dans certains cas, avoir recours à un traitement médicamenteux est une démarche nécessaire pour atténuer une souffrance trop importante.**  
Ce type de traitement ne remet pas en cause les autres formes de soin : il peut au contraire les rendre plus accessibles ou plus efficaces, en apportant un apaisement temporaire.

**La durée d’un traitement médicamenteux varie selon les situations.**  
Il peut être utile à un moment de la vie, puis être allégé ou arrêté progressivement, en fonction des besoins et de l’évolution de la personne.  
Il s’agit d’un outil parmi d’autres, intégré à un accompagnement global qui associe souvent psychothérapie, soutien social ou entraide.

**Il est essentiel de discuter avec son ou sa professionnel·le de santé de l’ensemble des options possibles.**  
En tant que patient·e, vous avez le droit de savoir pourquoi un médicament vous est proposé, comment il agit et quels effets il peut entraîner.  
Ce dialogue est primordial : il offre l’occasion de poser vos questions, d’exprimer vos doutes ou vos ressentis, et de construire, avec votre soignant·e, le parcours de soin le plus adapté à votre situation.

Cet échange est d’autant plus important que les informations sur les médicaments psychotropes sont souvent difficiles à trouver ou à comprendre.

**Il est donc tout à fait légitime de vouloir s’informer avant de prendre une décision.**`,
    externalResources: ["550e8400-e29b-41d4-a716-446655440284", "550e8400-e29b-41d4-a716-446655440285"],
  },
  {
    id: "6f5c8b7e-3d23-4c0f-8c9e-aef902c6f4b2",
    matomoId: 49,
    title: "Parler à une IA pour sa santé mentale : comprendre les enjeux",
    image: require("../../../../assets/imgs/resources/Article47.png"),
    category: CATEGORIES.AGIR_ET_CHERCHER_DE_L_AIDE_SANS_HONTE,
    content: `**De plus en plus d’applications et de plateformes proposent de parler à une intelligence artificielle (IA) pour évoquer ses émotions ou ses difficultés.**  
Ce phénomène, en forte croissance, attire notamment les personnes qui se sentent isolées ou qui recherchent une écoute immédiate, souvent gratuite.  
Ce succès est particulièrement marqué **chez les plus jeunes**, pour qui ces outils numériques sont familiers et facilement accessibles.

**Cependant, ces échanges ne sont pas sans risques. Dans certains cas, ils peuvent même s’avérer dangereux : l’IA peut renforcer un mal-être, valider des idées fausses ou répondre de manière inadaptée à une situation de détresse. Il est donc important de faire preuve d’une grande vigilance face à ces outils.**

Ce type d’échange peut apporter un soulagement ponctuel, alléger une charge émotionnelle ou donner l’impression d’être compris·e.  
**Mais ces effets restent toutefois très limités dans le temps et ne produisent pas de bénéfices durables.**  
L’intelligence artificielle ne ressent rien, ne comprend pas les émotions humaines et ne dispose d’aucun recul clinique.  
Elle est entraînée à générer des réponses à partir de données apprises, parfois biaisées, et tend à adopter un biais de confirmation : elle cherche à aller dans le sens de la personne, à valider ses propos et à prolonger la conversation plutôt qu’à apporter une aide nuancée.

**Concernant les données, il est important de savoir que les informations partagées sont stockées par les sociétés qui développent ces outils.**  
Les conversations peuvent être utilisées pour entraîner les IA, et les conditions d’utilisation sont souvent peu connues du grand public.  
**Ces données ne sont pas anonymisées**, et les utilisateurs ne sont pas systématiquement informés ou sollicités pour donner leur accord à leur réutilisation.  
Il est donc difficile de savoir comment elles seront exploitées ou conservées dans le futur.  
**Le cadre de gestion de ces informations personnelles reste encore mal défini, ce qui soulève de réelles questions de confidentialité.**

Il est compréhensible que ces outils rencontrent un certain succès, car ils offrent une écoute immédiate, à toute heure et sans coût.  
**Pourtant, même s’ils peuvent répondre à un besoin ponctuel, ils ne remplacent pas une véritable relation d’aide humaine.**  
Le lien avec un·e professionnel·le de santé ou avec d’autres personnes reste au cœur du soin psychique.  
Le contact humain permet d’exprimer ses émotions, d’être compris·e et de trouver, avec l’aide de l’autre, des pistes concrètes et individualisées pour surmonter ses difficultés.

**Enfin, il est important de rappeler que les intelligences artificielles ne réalisent aucun diagnostic médical fiable.**  
Leurs réponses peuvent parfois donner l’illusion d’une évaluation clinique, mais elles reposent sur des modèles automatiques sans fondement médical.  
Ces “diagnostics” sont donc dépourvus de valeur thérapeutique et peuvent induire en erreur, en générant des inquiétudes souvent injustifiées.

**Chercher à parler à une IA pour se sentir moins seul·e peut, sans qu’on s’en rende compte, retarder le moment où l’on en parle réellement à quelqu’un.**  
S’appuyer sur son entourage — un·e proche, un·e voisin·e, un·e collègue — peut parfois constituer une première étape rassurante, avant de se tourner vers un·e professionnel·le si nécessaire.

Et si cette aide ne suffit pas, de nombreuses solutions existent :

- Les **lignes d’écoute et associations**, qui offrent une écoute gratuite, anonyme et bienveillante.
- Les **psychologues**, qui ne sont pas remboursés en général, mais pour lesquels le dispositif *Mon Soutien Psy* permet jusqu’à 12 séances d’accompagnement psychologique avec un psychologue partenaire.  
  Chaque séance coûte 50 euros, remboursée à 60 % par l’Assurance Maladie, le reste pouvant être pris en charge par votre complémentaire santé.  
  Certains psychologues proposent aussi des tarifs préférentiels selon la situation.
- Les **centres médico-psychologiques (CMP)**, maisons des adolescents et PMI, qui offrent un accompagnement gratuit.
- Les **médecins généralistes et psychiatres**, dont les consultations sont généralement remboursées par l’Assurance Maladie.  
  Le reste à charge peut varier selon le secteur de convention et le respect du parcours de soins coordonné.

***(voir notre rubrique agir et chercher de l’aide)***`,
    externalResources: [
      "550e8400-e29b-41d4-a716-446655440283",
      "550e8400-e29b-41d4-a716-446655440218",
      "550e8400-e29b-41d4-a716-446655440220",
      "550e8400-e29b-41d4-a716-446655440222",
      "550e8400-e29b-41d4-a716-446655440223",
    ],
  },
];
