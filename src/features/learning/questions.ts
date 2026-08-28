export type Question = { id: string; question: string; correct: string; wrong: string[]; explanation: string; image?: string }

export const officialQuestions: Question[] = [
  {
    "id": "official-1",
    "question": "Un client se dirige vers vous pour vous demander que signifie « Best Burger », que lui expliquez-vous ?",
    "correct": "Il s’agit d’offrir aux client les produits ayant la meilleure qualité possible : plus frais, plus chauds et plus juteux.",
    "wrong": [
      "Servir plus vite uniquement.",
      "Ajouter plus de sauce.",
      "Proposer uniquement les produits premium."
    ],
    "explanation": "Il s’agit d’offrir aux client les produits ayant la meilleure qualité possible : plus frais, plus chauds et plus juteux."
  },
  {
    "id": "official-2",
    "question": "Un client se dirige vers vous en vous expliquant qu’il est allergique au gluten. Il vous demande si les frites en contiennent. Quelle est votre réaction ?",
    "correct": "Je lui donne la farde verte qui se trouve en-dessous de la caisse afin qu’il consulte la liste des allergènes et par lui-même s’il va commander des frites ou non. En aucun cas je ne réponds par de moi-même, quand bien même je connaîtrais la réponse. J’appelle un manager si nécessaire.",
    "wrong": [
      "Je réponds de mémoire.",
      "Je garantis que les frites ne contiennent jamais de gluten.",
      "Je refuse toute commande."
    ],
    "explanation": "Je lui donne la farde verte qui se trouve en-dessous de la caisse afin qu’il consulte la liste des allergènes et par lui-même s’il va commander des frites ou non. En aucun cas je ne réponds par de moi-même, quand bien même je connaîtrais la réponse. J’appelle un manager si nécessaire."
  },
  {
    "id": "official-3",
    "question": "Quel est l’endroit de rassemblement en cas d’incendie ?",
    "correct": "Sur notre petit parking, juste à côté des bornes de chargement pour voitures électriques où se trouve le panneau vert suivant :",
    "image": "/point-de-rassemblement.png",
    "wrong": [
      "Devant l’entrée principale.",
      "Dans le crew-room.",
      "Sur le parking le plus éloigné."
    ],
    "explanation": "Sur notre petit parking, juste à côté des bornes de chargement pour voitures électriques où se trouve le panneau vert suivant :"
  },
  {
    "id": "official-4",
    "question": "Que faites-vous en cas d’alerte à la bombe ?",
    "correct": "Je m’éloigne à au moins 100 mètres du bâtiment où la bombe est supposément située.",
    "wrong": [
      "Je reste dans le bâtiment.",
      "Je sors juste devant la porte.",
      "Je récupère d’abord mes affaires."
    ],
    "explanation": "Je m’éloigne à au moins 100 mètres du bâtiment où la bombe est supposément située."
  },
  {
    "id": "official-5",
    "question": "Que faites-vous en cas d’incendie ?",
    "correct": "J’évacue les lieux par la porte de secours la plus proche de l’endroit où je me trouve (porte dans le couloir derrière ou porte d’entrée UBER).",
    "wrong": [
      "Je termine la commande.",
      "J’attends un autre crew.",
      "Je vais chercher mes affaires."
    ],
    "explanation": "J’évacue les lieux par la porte de secours la plus proche de l’endroit où je me trouve (porte dans le couloir derrière ou porte d’entrée UBER)."
  },
  {
    "id": "official-6",
    "question": "Quels sont les différents numéros d’urgence ?",
    "correct": "En cas d’incendie, accident, vie en danger ou besoin d’ambulance : 112. En cas de nécessité d’une intervention policière : 101.",
    "wrong": [
      "101 pour ambulance et 112 pour la police.",
      "100 pour toutes les urgences.",
      "911 pour toutes les urgences."
    ],
    "explanation": "En cas d’incendie, accident, vie en danger ou besoin d’ambulance : 112. En cas de nécessité d’une intervention policière : 101."
  },
  {
    "id": "official-7",
    "question": "Que faîtes-vous si une personne vomie, saigne, urine ou défèque dans le lobby ?",
    "correct": "Je préviens le Manager et/ou responsable de zone. Je ferme la zone accidentée dans le lobby. Je prends le kit « Non-Food Spill » qui se trouve dans le bureau (kit de nettoyage des déchets non-alimentaires). Je nettoie la zone conformément aux instructions se trouvant sur le kit (en utilisant évidemment l’équipement du kit).",
    "wrong": [
      "Je nettoie seul immédiatement.",
      "Je pose juste un panneau sol mouillé.",
      "J’attends la fermeture du restaurant."
    ],
    "explanation": "Je préviens le Manager et/ou responsable de zone. Je ferme la zone accidentée dans le lobby. Je prends le kit « Non-Food Spill » qui se trouve dans le bureau (kit de nettoyage des déchets non-alimentaires). Je nettoie la zone conformément aux instructions se trouvant sur le kit (en utilisant évidemment l’équipement du kit)."
  },
  {
    "id": "official-8",
    "question": "Un client agressif se dirige vers vous fou de rage, quelle est votre réaction ?",
    "correct": "Je préviens le Manager. J’écoute attentivement le client sans l’interrompre. Je ne fais pas de geste brusque, ne le touche pas et n’essaie pas de le diriger vers l’extérieur du restaurant.",
    "wrong": [
      "Je le touche pour le calmer.",
      "Je hausse le ton.",
      "Je le pousse vers la sortie."
    ],
    "explanation": "Je préviens le Manager. J’écoute attentivement le client sans l’interrompre. Je ne fais pas de geste brusque, ne le touche pas et n’essaie pas de le diriger vers l’extérieur du restaurant."
  },
  {
    "id": "official-9",
    "question": "Une friteuse prend feu, que faites-vous ?",
    "correct": "Je fais usage de la couverture anti incendie qui se trouve juste au-dessus de la friteuse FCN, à hauteur des cuves nuggets (derrière l’écran).",
    "wrong": [
      "Je verse de l’eau sur la friteuse.",
      "Je déplace la friteuse.",
      "Je continue le service en attendant."
    ],
    "explanation": "Je fais usage de la couverture anti incendie qui se trouve juste au-dessus de la friteuse FCN, à hauteur des cuves nuggets (derrière l’écran)."
  },
  {
    "id": "official-10",
    "question": "Une enquête interne de bien-être a-t-elle eu lieu dans votre restaurant ?",
    "correct": "Oui, les résultats ainsi que les mesures entreprises par l’équipe de gestion se trouvent affichées dans le crew-room.",
    "wrong": [
      "Non, aucune enquête.",
      "Oui, mais les résultats ne sont pas accessibles.",
      "Seulement au siège."
    ],
    "explanation": "Oui, les résultats ainsi que les mesures entreprises par l’équipe de gestion se trouvent affichées dans le crew-room."
  },
  {
    "id": "official-11",
    "question": "Quel est votre personne de contact en cas d’harcèlement ou de problème relatif au bien-être ?",
    "correct": "Valérie Van Muylder, la conseillère en prévention et directrice RH du groupe. Ses coordonnées se trouvent dans le crew-room.",
    "wrong": [
      "N’importe quel manager du restaurant uniquement.",
      "Le service client de l’application.",
      "Personne en particulier."
    ],
    "explanation": "Valérie Van Muylder, la conseillère en prévention et directrice RH du groupe. Ses coordonnées se trouvent dans le crew-room."
  },
  {
    "id": "official-12",
    "question": "Comment introduisez-vous une plainte au sujet du bien-être au travail (harcèlement, discrimination, …) ?",
    "correct": "Il s’agit de la politique Whistleblower : je peux introduire une plainte anonyme en scannant le QR Code qui se trouve dans le crew-room.",
    "wrong": [
      "Via un avis Google.",
      "Via l’application client.",
      "Uniquement en parlant à un collègue."
    ],
    "explanation": "Il s’agit de la politique Whistleblower : je peux introduire une plainte anonyme en scannant le QR Code qui se trouve dans le crew-room."
  },
  {
    "id": "official-13",
    "question": "Des médias se présentent au restaurant afin de vous poser quelques questions, que faites-vous ?",
    "correct": "Je ne réponds à aucune question et j’avertis immédiatement le Manager.",
    "wrong": [
      "Je réponds uniquement sur les menus.",
      "Je réponds si la personne montre une carte de presse.",
      "Je demande au journaliste d’attendre dehors sans prévenir."
    ],
    "explanation": "Je ne réponds à aucune question et j’avertis immédiatement le Manager."
  },
  {
    "id": "official-14",
    "question": "Comment nettoyez-vous une surface sur le terrain ?",
    "correct": "Je prends une lavette ou un papier à usage unique et je vaporise le produit dessus. Je frotte ensuite la surface avec. En aucun cas je ne vaporise le produit directement sur la surface.",
    "wrong": [
      "Je pulvérise directement la surface.",
      "Je mets le produit au sol.",
      "Je mélange le produit avec de l’eau sans consigne."
    ],
    "explanation": "Je prends une lavette ou un papier à usage unique et je vaporise le produit dessus. Je frotte ensuite la surface avec. En aucun cas je ne vaporise le produit directement sur la surface."
  },
  {
    "id": "official-15",
    "question": "Un jeune homme se présente en caisse pour commander un Large Menu Big Mac avec mayonnaise comme sauce et une bière en boisson, quel doit être votre réflexe ?",
    "correct": "Si la personne me paraît jeune, j’appelle immédiatement un manager pour qu’il vérifie son âge. En effet, nous ne pouvons pas vendre de bières à des personnes âgées de moins de 16 ans.",
    "wrong": [
      "Je sers la bière s’il paie.",
      "Je demande seulement son âge oralement.",
      "Je remplace la bière sans rien dire."
    ],
    "explanation": "Si la personne me paraît jeune, j’appelle immédiatement un manager pour qu’il vérifie son âge. En effet, nous ne pouvons pas vendre de bières à des personnes âgées de moins de 16 ans."
  },
  {
    "id": "official-16",
    "question": "Une personne se présente en comptoir en expliquant qu’il/elle doit accéder au terrain, que faites-vous ?",
    "correct": "Je vérifie l’identité de la personne et j’averti le Manager qui, lui, prendra la décision d’accepter ou de refuser l’accès au terrain à la personne en question.",
    "wrong": [
      "Je laisse entrer si la personne semble connaître le restaurant.",
      "Je refuse toujours l’accès.",
      "Je demande à un crew de l’accompagner sans prévenir."
    ],
    "explanation": "Je vérifie l’identité de la personne et j’averti le Manager qui, lui, prendra la décision d’accepter ou de refuser l’accès au terrain à la personne en question."
  },
  {
    "id": "official-17",
    "question": "Chose à savoir concernant l’application",
    "correct": "1€ d’achat vaut 5 points sur l’application McDo. Aider le client en cas de souci technique sur l’application (aller dans la partie support et contacts sur l’app McDo).",
    "wrong": [
      "1€ vaut 1 point et il n’y a pas de support.",
      "1€ vaut 10 points.",
      "Les soucis techniques sont gérés uniquement en restaurant."
    ],
    "explanation": "1€ d’achat vaut 5 points sur l’application McDo. Aider le client en cas de souci technique sur l’application (aller dans la partie support et contacts sur l’app McDo)."
  }
]

export const trainingQuestions: Question[] = [
  {
    "id": "training-1",
    "question": "Un client te demande directement : « Les frites sont sans gluten, oui ou non ? ». Quel est le meilleur réflexe ?",
    "correct": "Lui remettre la documentation allergènes prévue et appeler un manager si nécessaire.",
    "wrong": [
      "Répondre oui si tu es sûr de toi.",
      "Répondre non pour éviter tout risque.",
      "Demander l’avis d’un autre crew et répondre ensemble."
    ],
    "explanation": "Même si tu crois connaître la réponse, la procédure demande de laisser le client consulter la documentation prévue et de solliciter un manager si nécessaire."
  },
  {
    "id": "training-2",
    "question": "Pourquoi ne faut-il pas répondre soi-même à une question sur un allergène ?",
    "correct": "Parce que le client doit consulter l’information allergènes prévue et décider lui-même à partir de celle-ci.",
    "wrong": [
      "Parce que seuls les managers connaissent les ingrédients.",
      "Parce que les crews n’ont pas le droit de parler aux clients.",
      "Parce qu’aucun produit ne peut être garanti."
    ],
    "explanation": "Le réflexe attendu est de fournir la documentation prévue plutôt que d’improviser une réponse."
  },
  {
    "id": "training-3",
    "question": "Tu vois une personne vomir dans le lobby. Quelle action passe avant le nettoyage ?",
    "correct": "Prévenir le manager ou responsable de zone et fermer la zone concernée.",
    "wrong": [
      "Prendre immédiatement une serpillière.",
      "Attendre que le lobby soit vide.",
      "Demander au client de nettoyer lui-même."
    ],
    "explanation": "On sécurise d’abord la situation, puis on utilise le kit Non-Food Spill selon ses instructions."
  },
  {
    "id": "training-4",
    "question": "Quel matériel spécifique est prévu pour les déchets corporels dans le lobby ?",
    "correct": "Le kit « Non-Food Spill ».",
    "wrong": [
      "Le matériel classique de lobby.",
      "La couverture anti-incendie.",
      "Une lavette cuisine standard."
    ],
    "explanation": "La fiche prévoit un kit dédié aux déchets non-alimentaires."
  },
  {
    "id": "training-5",
    "question": "Un client agressif crie très fort. Laquelle de ces actions est à éviter ?",
    "correct": "Le toucher ou tenter de le diriger physiquement vers la sortie.",
    "wrong": [
      "Prévenir le manager.",
      "L’écouter sans l’interrompre.",
      "Éviter les gestes brusques."
    ],
    "explanation": "Le contact physique et les gestes brusques peuvent aggraver la situation."
  },
  {
    "id": "training-6",
    "question": "Face à un client agressif, quelle attitude est conforme à la procédure ?",
    "correct": "Écouter attentivement sans interrompre et prévenir le manager.",
    "wrong": [
      "Répondre sur le même ton.",
      "Ignorer complètement le client.",
      "Filmer la scène avec son téléphone."
    ],
    "explanation": "La procédure insiste sur l’écoute, le calme et l’intervention du manager."
  },
  {
    "id": "training-7",
    "question": "Une caméra de télévision arrive au comptoir. Tu es interrogé sur le restaurant. Tu…",
    "correct": "Ne réponds à aucune question et avertis immédiatement le manager.",
    "wrong": [
      "Réponds uniquement aux questions faciles.",
      "Demandes d’abord l’autorisation du journaliste.",
      "Réponds si aucune information confidentielle n’est demandée."
    ],
    "explanation": "La consigne est simple : aucune réponse aux médias, manager immédiatement."
  },
  {
    "id": "training-8",
    "question": "Quel geste de nettoyage est incorrect ?",
    "correct": "Vaporiser le produit directement sur la surface.",
    "wrong": [
      "Vaporiser le produit sur une lavette.",
      "Vaporiser le produit sur un papier à usage unique.",
      "Frotter ensuite la surface avec le support préparé."
    ],
    "explanation": "Le produit doit être appliqué sur la lavette ou le papier, pas directement sur la surface."
  },
  {
    "id": "training-9",
    "question": "Tu dois nettoyer une surface. Quelle séquence est correcte ?",
    "correct": "Produit sur lavette/papier, puis frottage de la surface.",
    "wrong": [
      "Produit sur surface, puis lavette sèche.",
      "Eau sur surface, puis produit par-dessus.",
      "Produit dans l’air, puis essuyage."
    ],
    "explanation": "C’est le détail à retenir du questionnaire sur le nettoyage."
  },
  {
    "id": "training-10",
    "question": "Un client qui paraît mineur commande une bière. Qui doit vérifier la situation ?",
    "correct": "Un manager.",
    "wrong": [
      "Le crew en caisse seul.",
      "Un autre client majeur.",
      "Le responsable livraison."
    ],
    "explanation": "Le questionnaire demande d’appeler immédiatement un manager pour vérifier l’âge."
  },
  {
    "id": "training-11",
    "question": "Quel âge minimum est rappelé par le questionnaire pour la vente de bière ?",
    "correct": "16 ans.",
    "wrong": [
      "14 ans.",
      "18 ans.",
      "21 ans."
    ],
    "explanation": "La fiche rappelle l’interdiction de vente de bière aux moins de 16 ans."
  },
  {
    "id": "training-12",
    "question": "Une personne inconnue dit devoir entrer sur le terrain. Quel est ton rôle ?",
    "correct": "Vérifier son identité et prévenir le manager, qui décide de l’accès.",
    "wrong": [
      "La laisser passer si elle semble pressée.",
      "Refuser automatiquement toute personne externe.",
      "L’accompagner soi-même sans prévenir."
    ],
    "explanation": "Le crew vérifie l’identité, mais la décision appartient au manager."
  },
  {
    "id": "training-13",
    "question": "Qui décide finalement si une personne externe peut accéder au terrain ?",
    "correct": "Le manager.",
    "wrong": [
      "Le crew qui l’accueille.",
      "La personne elle-même si elle a un badge.",
      "Le premier collègue disponible."
    ],
    "explanation": "La décision d’accepter ou refuser l’accès revient au manager."
  },
  {
    "id": "training-14",
    "question": "Quel numéro correspond à une intervention policière en Belgique selon la fiche ?",
    "correct": "101.",
    "wrong": [
      "112.",
      "100.",
      "911."
    ],
    "explanation": "101 = police. 112 = incendie, accident, ambulance ou vie en danger."
  },
  {
    "id": "training-15",
    "question": "Quel numéro appeler pour une ambulance ou une vie en danger ?",
    "correct": "112.",
    "wrong": [
      "101.",
      "100 uniquement.",
      "999."
    ],
    "explanation": "Le 112 couvre notamment ambulance, incendie, accident et vie en danger."
  },
  {
    "id": "training-16",
    "question": "Une alerte à la bombe est signalée. Quelle distance minimale est indiquée dans la fiche ?",
    "correct": "Au moins 100 mètres du bâtiment.",
    "wrong": [
      "10 mètres.",
      "25 mètres.",
      "50 mètres."
    ],
    "explanation": "La fiche indique de s’éloigner à au moins 100 mètres."
  },
  {
    "id": "training-17",
    "question": "En cas d’incendie, quelle logique d’évacuation retenir ?",
    "correct": "Utiliser la sortie de secours la plus proche de l’endroit où l’on se trouve.",
    "wrong": [
      "Toujours revenir par la porte d’entrée principale.",
      "Attendre les autres crews avant de sortir.",
      "Finir les commandes avant d’évacuer."
    ],
    "explanation": "La sortie utilisée dépend de l’endroit où tu te trouves au moment de l’évacuation."
  },
  {
    "id": "training-18",
    "question": "Le point de rassemblement indiqué dans la fiche se trouve…",
    "correct": "Sur le petit parking, près des bornes de recharge et du panneau vert.",
    "wrong": [
      "Dans le crew-room.",
      "Devant la cuisine.",
      "Sur le parking le plus éloigné sans repère particulier."
    ],
    "explanation": "C’est un élément local du questionnaire à mémoriser tel quel."
  },
  {
    "id": "training-19",
    "question": "Une friteuse prend feu. Quel équipement est explicitement cité dans la fiche ?",
    "correct": "La couverture anti-incendie.",
    "wrong": [
      "Un seau d’eau.",
      "Un ventilateur.",
      "Une lavette humide."
    ],
    "explanation": "La fiche précise l’usage de la couverture anti-incendie située près de la zone friteuse FCN."
  },
  {
    "id": "training-20",
    "question": "Best Burger vise avant tout…",
    "correct": "Des produits plus frais, plus chauds et plus juteux.",
    "wrong": [
      "Des portions plus grandes.",
      "Une préparation uniquement plus rapide.",
      "Des burgers avec davantage de sauce."
    ],
    "explanation": "Ce sont les trois mots-clés à retenir : frais, chauds, juteux."
  },
  {
    "id": "training-21",
    "question": "Quel trio résume le mieux « Best Burger » ?",
    "correct": "Frais, chauds, juteux.",
    "wrong": [
      "Rapides, gros, salés.",
      "Épicés, généreux, croustillants.",
      "Froids, simples, économiques."
    ],
    "explanation": "Le questionnaire associe Best Burger à la meilleure qualité possible."
  },
  {
    "id": "training-22",
    "question": "Où les résultats de l’enquête interne de bien-être sont-ils annoncés comme disponibles ?",
    "correct": "Dans le crew-room.",
    "wrong": [
      "Sur l’application client.",
      "Sur les bornes de commande.",
      "Uniquement au siège du groupe."
    ],
    "explanation": "La fiche indique que résultats et mesures sont affichés dans le crew-room."
  },
  {
    "id": "training-23",
    "question": "La politique permettant une plainte anonyme au sujet du bien-être est appelée…",
    "correct": "Whistleblower.",
    "wrong": [
      "Crew Voice.",
      "Open Door.",
      "Best Burger."
    ],
    "explanation": "La fiche cite la politique Whistleblower et un QR code dans le crew-room."
  },
  {
    "id": "training-24",
    "question": "Comment peut-on introduire anonymement une plainte bien-être selon la fiche ?",
    "correct": "En scannant le QR code Whistleblower dans le crew-room.",
    "wrong": [
      "En laissant un avis client.",
      "En passant par la borne de commande.",
      "En envoyant un message depuis l’application McDo."
    ],
    "explanation": "Le QR code du crew-room est le canal cité dans le questionnaire."
  },
  {
    "id": "training-25",
    "question": "Qui est cité comme personne de contact bien-être / harcèlement dans la fiche ?",
    "correct": "Valérie Van Muylder.",
    "wrong": [
      "Le premier manager de service.",
      "Le service client national.",
      "Le responsable livraison."
    ],
    "explanation": "La fiche cite Valérie Van Muylder, conseillère en prévention et directrice RH du groupe."
  },
  {
    "id": "training-26",
    "question": "Où trouver les coordonnées de la personne de contact bien-être ?",
    "correct": "Dans le crew-room.",
    "wrong": [
      "Sur le ticket de caisse.",
      "Dans l’application client.",
      "Sur la borne drive."
    ],
    "explanation": "Les coordonnées sont indiquées comme affichées dans le crew-room."
  },
  {
    "id": "training-27",
    "question": "Selon la fiche, 1 € d’achat rapporte…",
    "correct": "5 points.",
    "wrong": [
      "1 point.",
      "2 points.",
      "10 points."
    ],
    "explanation": "La fiche indique 1 € = 5 points sur l’application McDo."
  },
  {
    "id": "training-28",
    "question": "Un client a un problème technique avec l’application. Où l’orienter ?",
    "correct": "Vers la partie support et contacts de l’application McDo.",
    "wrong": [
      "Vers les avis Google.",
      "Vers la police.",
      "Vers la borne de commande uniquement."
    ],
    "explanation": "Le questionnaire demande d’aider le client à trouver support et contacts dans l’application."
  },
  {
    "id": "training-29",
    "question": "Quel couple de réflexes est correct ?",
    "correct": "Médias → manager ; allergènes → documentation prévue.",
    "wrong": [
      "Médias → répondre ; allergènes → répondre de mémoire.",
      "Médias → filmer ; allergènes → refuser la vente.",
      "Médias → client service ; allergènes → autre crew."
    ],
    "explanation": "Deux situations où l’improvisation est précisément à éviter."
  },
  {
    "id": "training-30",
    "question": "Quel couple de numéros est correctement associé ?",
    "correct": "112 : ambulance/incendie ; 101 : police.",
    "wrong": [
      "101 : ambulance ; 112 : police.",
      "100 : police ; 101 : incendie.",
      "911 : toutes les urgences ; 112 : support."
    ],
    "explanation": "112 pour urgence vitale/incendie/ambulance, 101 pour police."
  },
  {
    "id": "training-31",
    "question": "Lors d’un incident avec fluide corporel, pourquoi fermer la zone ?",
    "correct": "Pour sécuriser l’espace avant le nettoyage avec le kit prévu.",
    "wrong": [
      "Pour éviter que le manager voie la situation.",
      "Pour pouvoir nettoyer avec du matériel alimentaire.",
      "Pour attendre que le déchet sèche."
    ],
    "explanation": "La logique est : prévenir, isoler, utiliser le kit dédié."
  },
  {
    "id": "training-32",
    "question": "Si tu connais par cœur une information allergène, peux-tu la donner directement au client ?",
    "correct": "Non, la procédure demande quand même de lui remettre la documentation prévue.",
    "wrong": [
      "Oui, si tu es certain à 100 %.",
      "Oui, uniquement pendant les heures creuses.",
      "Oui, si un autre crew confirme."
    ],
    "explanation": "Connaître la réponse ne change pas le réflexe demandé par la fiche."
  },
  {
    "id": "training-33",
    "question": "Quel comportement est commun aux situations « client agressif » et « médias » ?",
    "correct": "Prévenir rapidement le manager.",
    "wrong": [
      "Répondre soi-même pour gagner du temps.",
      "Faire sortir la personne physiquement.",
      "Ignorer complètement la situation."
    ],
    "explanation": "Le manager est le point de relais dans ces deux situations sensibles."
  },
  {
    "id": "training-34",
    "question": "Pour retenir la procédure de nettoyage, quelle phrase-mémo est correcte ?",
    "correct": "Produit sur le support, jamais directement sur la surface.",
    "wrong": [
      "Produit sur la surface, support ensuite.",
      "Toujours eau avant produit.",
      "Plus on vaporise, mieux c’est."
    ],
    "explanation": "C’est une reformulation mnémotechnique de la réponse officielle."
  },
  {
    "id": "training-35",
    "question": "Quel ordre correspond le mieux à un incident de vomissement dans le lobby ?",
    "correct": "Prévenir → fermer la zone → prendre le kit → nettoyer selon les instructions.",
    "wrong": [
      "Nettoyer → prévenir → rouvrir → chercher le kit.",
      "Prendre une lavette → nettoyer → prévenir.",
      "Fermer le restaurant → appeler la police → nettoyer."
    ],
    "explanation": "La séquence reprend les étapes données dans le questionnaire."
  },
  {
    "id": "training-36",
    "question": "Quel ordre correspond le mieux à une demande d’accès au terrain ?",
    "correct": "Vérifier l’identité → prévenir le manager → décision du manager.",
    "wrong": [
      "Laisser entrer → vérifier plus tard.",
      "Refuser → prévenir le manager ensuite.",
      "Demander à un autre crew → laisser entrer."
    ],
    "explanation": "Le crew collecte l’information, le manager tranche."
  }
]

export const finalOfficialIds = [2,5,7,13,14]
