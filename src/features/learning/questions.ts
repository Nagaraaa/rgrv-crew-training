export type Question = { id: string; question: string; correct: string; correctDisplay?: string; wrong: string[]; explanation: string; image?: string }

export const officialQuestions: Question[] = [
  {
    "id": "official-1",
    "question": "Un client se dirige vers vous pour vous demander que signifie « Best Burger », que lui expliquez-vous ?",
    "correct": "Il s’agit d’offrir aux client les produits ayant la meilleure qualité possible : plus frais, plus chauds et plus juteux.",
    "wrong": [
      "Servir des produits plus frais et plus chauds, en donnant la priorité à la rapidité du service.",
      "Garantir des produits plus chauds et plus généreux, avec une présentation constante à chaque commande.",
      "Améliorer la fraîcheur et la présentation du burger, surtout sur les produits les plus demandés."
    ],
    "explanation": "Il s’agit d’offrir aux client les produits ayant la meilleure qualité possible : plus frais, plus chauds et plus juteux."
  },
  {
    "id": "official-2",
    "question": "Un client se dirige vers vous en vous expliquant qu’il est allergique au gluten. Il vous demande si les frites en contiennent. Quelle est votre réaction ?",
    "correct": "Je lui donne la farde verte qui se trouve en-dessous de la caisse afin qu’il consulte la liste des allergènes et par lui-même s’il va commander des frites ou non. En aucun cas je ne réponds par de moi-même, quand bien même je connaîtrais la réponse. J’appelle un manager si nécessaire.",
    "wrong": [
      "Je consulte la farde verte avec le client et je lui indique moi-même si les frites lui conviennent.",
      "Je remets la documentation au client, puis je lui conseille personnellement l’option la moins risquée.",
      "J’appelle directement un manager pour qu’il réponde à la place du client, sans remettre la documentation."
    ],
    "explanation": "Je lui donne la farde verte qui se trouve en-dessous de la caisse afin qu’il consulte la liste des allergènes et par lui-même s’il va commander des frites ou non. En aucun cas je ne réponds par de moi-même, quand bien même je connaîtrais la réponse. J’appelle un manager si nécessaire."
  },
  {
    "id": "official-3",
    "question": "Quel est l’endroit de rassemblement en cas d’incendie ?",
    "correct": "Sur notre petit parking, juste à côté des bornes de chargement pour voitures électriques où se trouve le panneau vert suivant :",
    "correctDisplay": "Sur le petit parking, juste à côté des bornes de chargement pour voitures électriques, près du panneau vert affiché ci-dessus.",
    "image": "/point-de-rassemblement.png",
    "wrong": [
      "Sur le petit parking, près de l’entrée principale, là où les équipes peuvent voir les sorties du restaurant.",
      "Sur le parking situé à côté des bornes de recharge, mais devant le premier panneau vert visible.",
      "Sur le parking le plus éloigné du bâtiment, près du point de livraison et des véhicules du personnel."
    ],
    "explanation": "Sur notre petit parking, juste à côté des bornes de chargement pour voitures électriques où se trouve le panneau vert suivant :"
  },
  {
    "id": "official-4",
    "question": "Que faites-vous en cas d’alerte à la bombe ?",
    "correct": "Je m’éloigne à au moins 100 mètres du bâtiment où la bombe est supposément située.",
    "wrong": [
      "Je m’éloigne à environ 50 mètres du bâtiment et j’attends les instructions du manager.",
      "Je rejoins le point de rassemblement habituel dès que je suis sorti du bâtiment.",
      "Je quitte le bâtiment puis je reste à bonne distance, tant que les secours ne demandent pas une évacuation plus large."
    ],
    "explanation": "Je m’éloigne à au moins 100 mètres du bâtiment où la bombe est supposément située."
  },
  {
    "id": "official-5",
    "question": "Que faites-vous en cas d’incendie ?",
    "correct": "J’évacue les lieux par la porte de secours la plus proche de l’endroit où je me trouve (porte dans le couloir derrière ou porte d’entrée UBER).",
    "wrong": [
      "J’emprunte la sortie de secours habituelle du restaurant, même si elle est plus loin de mon poste.",
      "Je suis le crew le plus proche vers la porte qu’il a choisie, afin de ne pas évacuer seul.",
      "Je rejoins la porte d’entrée UBER dès que possible, car elle sert de sortie d’évacuation connue."
    ],
    "explanation": "J’évacue les lieux par la porte de secours la plus proche de l’endroit où je me trouve (porte dans le couloir derrière ou porte d’entrée UBER)."
  },
  {
    "id": "official-6",
    "question": "Quels sont les différents numéros d’urgence ?",
    "correct": "En cas d’incendie, accident, vie en danger ou besoin d’ambulance : 112. En cas de nécessité d’une intervention policière : 101.",
    "wrong": [
      "101 pour un incendie, une ambulance ou une vie en danger ; 112 pour une intervention policière.",
      "112 pour toute urgence, y compris lorsqu’une intervention de police est nécessaire dans le restaurant.",
      "101 pour la police et 112 uniquement lorsqu’une ambulance est nécessaire, pas pour un incendie."
    ],
    "explanation": "En cas d’incendie, accident, vie en danger ou besoin d’ambulance : 112. En cas de nécessité d’une intervention policière : 101."
  },
  {
    "id": "official-7",
    "question": "Que faîtes-vous si une personne vomie, saigne, urine ou défèque dans le lobby ?",
    "correct": "Je préviens le Manager et/ou responsable de zone. Je ferme la zone accidentée dans le lobby. Je prends le kit « Non-Food Spill » qui se trouve dans le bureau (kit de nettoyage des déchets non-alimentaires). Je nettoie la zone conformément aux instructions se trouvant sur le kit (en utilisant évidemment l’équipement du kit).",
    "wrong": [
      "Je préviens le manager, prends le kit Non-Food Spill, puis je ferme la zone juste avant de commencer à nettoyer.",
      "Je ferme la zone et prends le kit prévu, puis je préviens le manager une fois le nettoyage lancé.",
      "Je préviens le responsable de zone, installe le périmètre de sécurité et utilise le matériel de nettoyage habituel."
    ],
    "explanation": "Je préviens le Manager et/ou responsable de zone. Je ferme la zone accidentée dans le lobby. Je prends le kit « Non-Food Spill » qui se trouve dans le bureau (kit de nettoyage des déchets non-alimentaires). Je nettoie la zone conformément aux instructions se trouvant sur le kit (en utilisant évidemment l’équipement du kit)."
  },
  {
    "id": "official-8",
    "question": "Un client agressif se dirige vers vous fou de rage, quelle est votre réaction ?",
    "correct": "Je préviens le Manager. J’écoute attentivement le client sans l’interrompre. Je ne fais pas de geste brusque, ne le touche pas et n’essaie pas de le diriger vers l’extérieur du restaurant.",
    "wrong": [
      "Je préviens le manager, écoute le client, puis lui demande calmement de poursuivre l’échange à l’extérieur.",
      "Je garde une attitude calme, appelle le manager et me place entre le client et les autres personnes présentes.",
      "J’écoute le client sans l’interrompre, puis je l’oriente vers la sortie dès qu’il a fini d’expliquer son problème."
    ],
    "explanation": "Je préviens le Manager. J’écoute attentivement le client sans l’interrompre. Je ne fais pas de geste brusque, ne le touche pas et n’essaie pas de le diriger vers l’extérieur du restaurant."
  },
  {
    "id": "official-9",
    "question": "Une friteuse prend feu, que faites-vous ?",
    "correct": "Je fais usage de la couverture anti incendie qui se trouve juste au-dessus de la friteuse FCN, à hauteur des cuves nuggets (derrière l’écran).",
    "wrong": [
      "J’utilise la couverture anti-incendie située près de la friteuse FCN, après avoir éloigné les produits autour des cuves.",
      "Je prends la couverture anti-incendie de la zone friteuse et je la place à proximité avant de prévenir le manager.",
      "J’utilise l’équipement anti-incendie le plus proche de la friteuse, situé près de la zone de préparation des burgers."
    ],
    "explanation": "Je fais usage de la couverture anti incendie qui se trouve juste au-dessus de la friteuse FCN, à hauteur des cuves nuggets (derrière l’écran)."
  },
  {
    "id": "official-10",
    "question": "Une enquête interne de bien-être a-t-elle eu lieu dans votre restaurant ?",
    "correct": "Oui, les résultats ainsi que les mesures entreprises par l’équipe de gestion se trouvent affichées dans le crew-room.",
    "wrong": [
      "Oui, les résultats et les mesures prises sont consultables auprès du manager de service sur demande.",
      "Oui, les résultats sont affichés dans le lobby afin que tous les clients et équipes puissent les consulter.",
      "Oui, les mesures sont communiquées dans le crew-room, mais les résultats détaillés restent au siège."
    ],
    "explanation": "Oui, les résultats ainsi que les mesures entreprises par l’équipe de gestion se trouvent affichées dans le crew-room."
  },
  {
    "id": "official-11",
    "question": "Quel est votre personne de contact en cas d’harcèlement ou de problème relatif au bien-être ?",
    "correct": "Valérie Van Muylder, la conseillère en prévention et directrice RH du groupe. Ses coordonnées se trouvent dans le crew-room.",
    "wrong": [
      "Valérie Van Muylder, le manager de service responsable des questions de bien-être dans le restaurant.",
      "Le manager de service, qui transmet si nécessaire les demandes à la conseillère en prévention du groupe.",
      "Valérie Van Muylder, dont les coordonnées doivent être demandées directement à l’équipe de gestion."
    ],
    "explanation": "Valérie Van Muylder, la conseillère en prévention et directrice RH du groupe. Ses coordonnées se trouvent dans le crew-room."
  },
  {
    "id": "official-12",
    "question": "Comment introduisez-vous une plainte au sujet du bien-être au travail (harcèlement, discrimination, …) ?",
    "correct": "Il s’agit de la politique Whistleblower : je peux introduire une plainte anonyme en scannant le QR Code qui se trouve dans le crew-room.",
    "wrong": [
      "En scannant le QR code Whistleblower affiché près des informations du manager dans le crew-room.",
      "En utilisant le QR code du crew-room pour transmettre une plainte au manager de façon confidentielle.",
      "En envoyant une plainte signée via le formulaire Whistleblower, puis en prévenant le manager."
    ],
    "explanation": "Il s’agit de la politique Whistleblower : je peux introduire une plainte anonyme en scannant le QR Code qui se trouve dans le crew-room."
  },
  {
    "id": "official-13",
    "question": "Des médias se présentent au restaurant afin de vous poser quelques questions, que faites-vous ?",
    "correct": "Je ne réponds à aucune question et j’avertis immédiatement le Manager.",
    "wrong": [
      "Je n’aborde aucun sujet interne, mais je réponds aux questions générales sur le restaurant avant de prévenir le manager.",
      "Je demande aux médias de patienter à l’extérieur et je les oriente vers le manager dès qu’il est disponible.",
      "Je préviens immédiatement le manager et je reste avec les médias pour éviter qu’ils interrogent d’autres crews."
    ],
    "explanation": "Je ne réponds à aucune question et j’avertis immédiatement le Manager."
  },
  {
    "id": "official-14",
    "question": "Comment nettoyez-vous une surface sur le terrain ?",
    "correct": "Je prends une lavette ou un papier à usage unique et je vaporise le produit dessus. Je frotte ensuite la surface avec. En aucun cas je ne vaporise le produit directement sur la surface.",
    "wrong": [
      "Je vaporise le produit sur une lavette, puis j’humidifie légèrement la surface avant de la frotter.",
      "Je dépose le produit sur un papier à usage unique et je le passe directement sur la surface à nettoyer.",
      "Je vaporise le produit sur une lavette propre, puis je termine en pulvérisant la surface pour la désinfecter."
    ],
    "explanation": "Je prends une lavette ou un papier à usage unique et je vaporise le produit dessus. Je frotte ensuite la surface avec. En aucun cas je ne vaporise le produit directement sur la surface."
  },
  {
    "id": "official-15",
    "question": "Un jeune homme se présente en caisse pour commander un Large Menu Big Mac avec mayonnaise comme sauce et une bière en boisson, quel doit être votre réflexe ?",
    "correct": "Si la personne me paraît jeune, j’appelle immédiatement un manager pour qu’il vérifie son âge. En effet, nous ne pouvons pas vendre de bières à des personnes âgées de moins de 16 ans.",
    "wrong": [
      "Je demande une pièce d’identité au client, puis je décide moi-même si l’âge indiqué permet de servir la bière.",
      "J’appelle le manager uniquement si le client ne peut pas confirmer son âge ou ne présente pas de document.",
      "Je demande au client de montrer son identité, puis je demande au manager de valider la commande déjà enregistrée."
    ],
    "explanation": "Si la personne me paraît jeune, j’appelle immédiatement un manager pour qu’il vérifie son âge. En effet, nous ne pouvons pas vendre de bières à des personnes âgées de moins de 16 ans."
  },
  {
    "id": "official-16",
    "question": "Une personne se présente en comptoir en expliquant qu’il/elle doit accéder au terrain, que faites-vous ?",
    "correct": "Je vérifie l’identité de la personne et j’averti le Manager qui, lui, prendra la décision d’accepter ou de refuser l’accès au terrain à la personne en question.",
    "wrong": [
      "Je vérifie l’identité de la personne, puis je l’accompagne sur le terrain si son motif d’accès semble cohérent.",
      "Je préviens le manager de l’arrivée de la personne, puis je la laisse entrer en attendant sa réponse.",
      "Je vérifie son identité et je demande au responsable de zone de l’autoriser à accéder au terrain."
    ],
    "explanation": "Je vérifie l’identité de la personne et j’averti le Manager qui, lui, prendra la décision d’accepter ou de refuser l’accès au terrain à la personne en question."
  },
  {
    "id": "official-17",
    "question": "Chose à savoir concernant l’application",
    "correct": "1€ d’achat vaut 5 points sur l’application McDo. Aider le client en cas de souci technique sur l’application (aller dans la partie support et contacts sur l’app McDo).",
    "wrong": [
      "1 € d’achat vaut 5 points ; en cas de souci, le client doit contacter directement le restaurant depuis l’application.",
      "1 € d’achat vaut 5 points ; le crew guide le client vers les offres et récompenses de l’application en cas de problème.",
      "1 € d’achat vaut 10 points ; pour un problème technique, le client est orienté vers la rubrique support de l’application."
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
      "Répondre selon tes connaissances si tu es certain de la composition habituelle du produit.",
      "Dire au client que les frites ne sont pas adaptées afin d’éviter toute prise de risque.",
      "Demander confirmation à un autre crew puis donner ensemble une réponse au client."
    ],
    "explanation": "Même si tu crois connaître la réponse, la procédure demande de laisser le client consulter la documentation prévue et de solliciter un manager si nécessaire."
  },
  {
    "id": "training-2",
    "question": "Pourquoi ne faut-il pas répondre soi-même à une question sur un allergène ?",
    "correct": "Parce que le client doit consulter l’information allergènes prévue et décider lui-même à partir de celle-ci.",
    "wrong": [
      "Parce que seuls les managers sont autorisés à consulter les informations de composition des produits.",
      "Parce que les crews ne doivent jamais échanger avec un client au sujet de sa commande.",
      "Parce qu’il est interdit de vendre un produit dès qu’un allergène est évoqué par le client."
    ],
    "explanation": "Le réflexe attendu est de fournir la documentation prévue plutôt que d’improviser une réponse."
  },
  {
    "id": "training-3",
    "question": "Tu vois une personne vomir dans le lobby. Quelle action passe avant le nettoyage ?",
    "correct": "Prévenir le manager ou responsable de zone et fermer la zone concernée.",
    "wrong": [
      "Prendre immédiatement le matériel de nettoyage courant pour enlever ce qui est visible.",
      "Attendre que la zone se vide pour ne pas interrompre inutilement l’activité du lobby.",
      "Demander au client ou à son accompagnant de nettoyer la zone avant de reprendre le service."
    ],
    "explanation": "On sécurise d’abord la situation, puis on utilise le kit Non-Food Spill selon ses instructions."
  },
  {
    "id": "training-4",
    "question": "Quel matériel spécifique est prévu pour les déchets corporels dans le lobby ?",
    "correct": "Le kit « Non-Food Spill ».",
    "wrong": [
      "Le chariot et le matériel classique de nettoyage du lobby, utilisés pour les incidents quotidiens.",
      "La couverture anti-incendie située près de la zone friteuse, utilisée comme protection de la zone.",
      "Une lavette cuisine standard complétée par le produit de nettoyage habituel."
    ],
    "explanation": "La fiche prévoit un kit dédié aux déchets non-alimentaires."
  },
  {
    "id": "training-5",
    "question": "Un client agressif crie très fort. Laquelle de ces actions est à éviter ?",
    "correct": "Le toucher ou tenter de le diriger physiquement vers la sortie.",
    "wrong": [
      "Prévenir le manager pour qu’il puisse prendre le relais dans le calme.",
      "L’écouter attentivement sans l’interrompre afin de comprendre ce qui le met en colère.",
      "Garder une posture calme et éviter les gestes brusques qui peuvent être mal interprétés."
    ],
    "explanation": "Le contact physique et les gestes brusques peuvent aggraver la situation."
  },
  {
    "id": "training-6",
    "question": "Face à un client agressif, quelle attitude est conforme à la procédure ?",
    "correct": "Écouter attentivement sans interrompre et prévenir le manager.",
    "wrong": [
      "Répondre avec la même fermeté afin de montrer que le comportement du client n’est pas acceptable.",
      "Laisser le client seul et attendre qu’il se calme sans intervenir ni prévenir personne.",
      "Filmer la scène pour pouvoir expliquer ensuite au manager ce qu’il s’est passé."
    ],
    "explanation": "La procédure insiste sur l’écoute, le calme et l’intervention du manager."
  },
  {
    "id": "training-7",
    "question": "Une caméra de télévision arrive au comptoir. Tu es interrogé sur le restaurant. Tu…",
    "correct": "Ne réponds à aucune question et avertis immédiatement le manager.",
    "wrong": [
      "Réponds uniquement aux questions simples sur le menu ou les horaires d’ouverture.",
      "Demandes au journaliste ce qu’il souhaite savoir avant de décider si tu peux répondre.",
      "Réponds tant que la question ne porte pas sur une information jugée confidentielle."
    ],
    "explanation": "La consigne est simple : aucune réponse aux médias, manager immédiatement."
  },
  {
    "id": "training-8",
    "question": "Quel geste de nettoyage est incorrect ?",
    "correct": "Vaporiser le produit directement sur la surface.",
    "wrong": [
      "Vaporiser le produit sur une lavette ou un papier à usage unique avant de nettoyer.",
      "Préparer le produit sur le support prévu, puis l’utiliser pour frotter la surface.",
      "Frotter la surface avec le support préparé en suivant la méthode de nettoyage habituelle."
    ],
    "explanation": "Le produit doit être appliqué sur la lavette ou le papier, pas directement sur la surface."
  },
  {
    "id": "training-9",
    "question": "Tu dois nettoyer une surface. Quelle séquence est correcte ?",
    "correct": "Produit sur lavette/papier, puis frottage de la surface.",
    "wrong": [
      "Appliquer le produit directement sur la surface, puis passer une lavette sèche pour retirer les traces.",
      "Humidifier d’abord la surface avec de l’eau, puis ajouter le produit avant d’essuyer.",
      "Vaporiser le produit dans la zone de travail, puis essuyer la surface avec une lavette."
    ],
    "explanation": "C’est le détail à retenir du questionnaire sur le nettoyage."
  },
  {
    "id": "training-10",
    "question": "Un client qui paraît mineur commande une bière. Qui doit vérifier la situation ?",
    "correct": "Un manager.",
    "wrong": [
      "Le crew en caisse, après avoir demandé directement au client quel âge il a.",
      "Un client majeur présent dans la file, s’il peut confirmer que la personne a l’âge requis.",
      "Le responsable livraison, lorsqu’il est disponible dans le restaurant au moment de la commande."
    ],
    "explanation": "Le questionnaire demande d’appeler immédiatement un manager pour vérifier l’âge."
  },
  {
    "id": "training-11",
    "question": "Quel âge minimum est rappelé par le questionnaire pour la vente de bière ?",
    "correct": "16 ans.",
    "wrong": [
      "14 ans, à condition que la commande soit réglée directement par le client.",
      "18 ans, comme pour les autres boissons alcoolisées vendues au restaurant.",
      "21 ans, sauf si la personne est accompagnée par un adulte majeur."
    ],
    "explanation": "La fiche rappelle l’interdiction de vente de bière aux moins de 16 ans."
  },
  {
    "id": "training-12",
    "question": "Une personne inconnue dit devoir entrer sur le terrain. Quel est ton rôle ?",
    "correct": "Vérifier son identité et prévenir le manager, qui décide de l’accès.",
    "wrong": [
      "La laisser passer si elle explique être attendue et qu’elle semble connaître le fonctionnement du restaurant.",
      "Refuser automatiquement l’accès à toute personne externe, même lorsqu’elle affirme avoir rendez-vous.",
      "L’accompagner toi-même vers la zone demandée sans solliciter d’autre validation."
    ],
    "explanation": "Le crew vérifie l’identité, mais la décision appartient au manager."
  },
  {
    "id": "training-13",
    "question": "Qui décide finalement si une personne externe peut accéder au terrain ?",
    "correct": "Le manager.",
    "wrong": [
      "Le crew qui accueille la personne, après avoir contrôlé son identité au comptoir.",
      "La personne elle-même, si elle présente un badge ou explique la raison de sa visite.",
      "Le premier collègue disponible, qui peut la diriger vers la zone à laquelle elle souhaite accéder."
    ],
    "explanation": "La décision d’accepter ou refuser l’accès revient au manager."
  },
  {
    "id": "training-14",
    "question": "Quel numéro correspond à une intervention policière en Belgique selon la fiche ?",
    "correct": "101.",
    "wrong": [
      "112, puisqu’il s’agit du numéro d’urgence général à utiliser pour toute intervention urgente.",
      "100, comme numéro à appeler lorsqu’une aide extérieure est nécessaire dans le restaurant.",
      "911, comme numéro international pouvant être utilisé lorsqu’une personne est en danger."
    ],
    "explanation": "101 = police. 112 = incendie, accident, ambulance ou vie en danger."
  },
  {
    "id": "training-15",
    "question": "Quel numéro appeler pour une ambulance ou une vie en danger ?",
    "correct": "112.",
    "wrong": [
      "101, car une ambulance doit être demandée par l’intermédiaire des services de police.",
      "100 uniquement, comme numéro à composer pour les incidents urgents sur le terrain.",
      "999, qui est utilisé comme numéro d’urgence commun dans plusieurs pays européens."
    ],
    "explanation": "Le 112 couvre notamment ambulance, incendie, accident et vie en danger."
  },
  {
    "id": "training-16",
    "question": "Une alerte à la bombe est signalée. Quelle distance minimale est indiquée dans la fiche ?",
    "correct": "Au moins 100 mètres du bâtiment.",
    "wrong": [
      "10 mètres du bâtiment, à condition de rester de l’autre côté du parking.",
      "25 mètres du bâtiment, afin de conserver un point de regroupement facile à atteindre.",
      "50 mètres du bâtiment, sauf si un manager demande de s’éloigner davantage."
    ],
    "explanation": "La fiche indique de s’éloigner à au moins 100 mètres."
  },
  {
    "id": "training-17",
    "question": "En cas d’incendie, quelle logique d’évacuation retenir ?",
    "correct": "Utiliser la sortie de secours la plus proche de l’endroit où l’on se trouve.",
    "wrong": [
      "Revenir systématiquement par la porte d’entrée principale, car c’est le chemin connu de tous.",
      "Attendre les autres crews afin d’évacuer ensemble vers la sortie indiquée par le manager.",
      "Terminer les commandes déjà commencées afin de ne pas laisser un poste de travail sans surveillance."
    ],
    "explanation": "La sortie utilisée dépend de l’endroit où tu te trouves au moment de l’évacuation."
  },
  {
    "id": "training-18",
    "question": "Le point de rassemblement indiqué dans la fiche se trouve…",
    "correct": "Sur le petit parking, près des bornes de recharge et du panneau vert.",
    "wrong": [
      "Dans le crew-room, qui peut servir de point d’attente protégé pour l’ensemble de l’équipe.",
      "Devant la cuisine, pour permettre aux personnes évacuées de rester proches des sorties internes.",
      "Sur le parking le plus éloigné, sans repère précis, afin de rester le plus loin possible du restaurant."
    ],
    "explanation": "C’est un élément local du questionnaire à mémoriser tel quel."
  },
  {
    "id": "training-19",
    "question": "Une friteuse prend feu. Quel équipement est explicitement cité dans la fiche ?",
    "correct": "La couverture anti-incendie.",
    "wrong": [
      "La couverture anti-incendie placée dans la zone de nettoyage, utilisée pour isoler immédiatement les flammes.",
      "L’équipement anti-incendie le plus proche de la friteuse, même s’il est situé près d’un autre poste de cuisson.",
      "La couverture anti-incendie de la zone friteuse, après avoir demandé au manager de confirmer son utilisation."
    ],
    "explanation": "La fiche précise l’usage de la couverture anti-incendie située près de la zone friteuse FCN."
  },
  {
    "id": "training-20",
    "question": "Best Burger vise avant tout…",
    "correct": "Des produits plus frais, plus chauds et plus juteux.",
    "wrong": [
      "Des produits plus frais et plus chauds, avec une attention particulière portée à la présentation de la commande.",
      "Des produits plus chauds, plus généreux et servis selon le niveau de qualité attendu par le client.",
      "Des produits plus frais, plus chauds et mieux présentés pour renforcer la qualité perçue du burger."
    ],
    "explanation": "Ce sont les trois mots-clés à retenir : frais, chauds, juteux."
  },
  {
    "id": "training-21",
    "question": "Quel trio résume le mieux « Best Burger » ?",
    "correct": "Frais, chauds, juteux.",
    "wrong": [
      "Frais, chauds, généreux.",
      "Frais, juteux, bien présentés.",
      "Chauds, juteux, préparés rapidement."
    ],
    "explanation": "Le questionnaire associe Best Burger à la meilleure qualité possible."
  },
  {
    "id": "training-22",
    "question": "Où les résultats de l’enquête interne de bien-être sont-ils annoncés comme disponibles ?",
    "correct": "Dans le crew-room.",
    "wrong": [
      "Dans le crew-room, mais uniquement dans le classeur remis aux managers de service.",
      "Sur le tableau d’informations du lobby, à côté des communications générales du restaurant.",
      "Dans le crew-room, avec les mesures prises, sans affichage des résultats de l’enquête elle-même."
    ],
    "explanation": "La fiche indique que résultats et mesures sont affichés dans le crew-room."
  },
  {
    "id": "training-23",
    "question": "La politique permettant une plainte anonyme au sujet du bien-être est appelée…",
    "correct": "Whistleblower.",
    "wrong": [
      "Whistleblower, le dispositif qui permet d’adresser une plainte directement au manager de service.",
      "Whistleblower, la politique qui permet de signaler une situation en donnant son identité au groupe.",
      "Open Door, le dispositif interne de signalement anonyme concernant le bien-être au travail."
    ],
    "explanation": "La fiche cite la politique Whistleblower et un QR code dans le crew-room."
  },
  {
    "id": "training-24",
    "question": "Comment peut-on introduire anonymement une plainte bien-être selon la fiche ?",
    "correct": "En scannant le QR code Whistleblower dans le crew-room.",
    "wrong": [
      "En scannant le QR code Whistleblower du crew-room, puis en indiquant son identité dans le formulaire.",
      "En utilisant le QR code du crew-room afin de transmettre la situation directement au manager.",
      "En remplissant le formulaire Whistleblower avec l’aide d’un responsable de zone."
    ],
    "explanation": "Le QR code du crew-room est le canal cité dans le questionnaire."
  },
  {
    "id": "training-25",
    "question": "Qui est cité comme personne de contact bien-être / harcèlement dans la fiche ?",
    "correct": "Valérie Van Muylder.",
    "wrong": [
      "Valérie Van Muylder, la manager de service qui centralise les demandes du restaurant.",
      "Le manager de service, qui est la personne de contact officielle en cas de problème de bien-être.",
      "Valérie Van Muylder, dont le rôle est de transmettre la demande au support client de l’application."
    ],
    "explanation": "La fiche cite Valérie Van Muylder, conseillère en prévention et directrice RH du groupe."
  },
  {
    "id": "training-26",
    "question": "Où trouver les coordonnées de la personne de contact bien-être ?",
    "correct": "Dans le crew-room.",
    "wrong": [
      "Dans le crew-room, dans le document Whistleblower affiché près du QR code de signalement.",
      "Sur le tableau du crew-room, avec les coordonnées des managers et responsables de zone.",
      "Auprès du manager de service, qui communique les coordonnées lorsque la situation le nécessite."
    ],
    "explanation": "Les coordonnées sont indiquées comme affichées dans le crew-room."
  },
  {
    "id": "training-27",
    "question": "Selon la fiche, 1 € d’achat rapporte…",
    "correct": "5 points.",
    "wrong": [
      "5 points, uniquement lorsque l’achat est effectué depuis l’application McDo.",
      "5 points, avec un bonus supplémentaire lorsque le client utilise une offre disponible dans l’application.",
      "10 points, sauf lorsque le client a activé son compte fidélité avant le paiement."
    ],
    "explanation": "La fiche indique 1 € = 5 points sur l’application McDo."
  },
  {
    "id": "training-28",
    "question": "Un client a un problème technique avec l’application. Où l’orienter ?",
    "correct": "Vers la partie support et contacts de l’application McDo.",
    "wrong": [
      "Vers la rubrique support et contacts de l’application, en sélectionnant directement le restaurant concerné.",
      "Vers la rubrique offres et récompenses de l’application, qui permet de résoudre les difficultés de compte.",
      "Vers la rubrique support de l’application, puis vers le manager de service si le problème persiste."
    ],
    "explanation": "Le questionnaire demande d’aider le client à trouver support et contacts dans l’application."
  },
  {
    "id": "training-29",
    "question": "Quel couple de réflexes est correct ?",
    "correct": "Médias → manager ; allergènes → documentation prévue.",
    "wrong": [
      "Médias → prévenir le manager puis répondre aux informations générales ; allergènes → remettre la documentation et conseiller un choix.",
      "Médias → demander de patienter pour le manager ; allergènes → faire valider l’information par un autre crew.",
      "Médias → orienter vers le manager ; allergènes → appeler le manager sans remettre la documentation prévue."
    ],
    "explanation": "Deux situations où l’improvisation est précisément à éviter."
  },
  {
    "id": "training-30",
    "question": "Quel couple de numéros est correctement associé ?",
    "correct": "112 : ambulance/incendie ; 101 : police.",
    "wrong": [
      "112 : ambulance uniquement ; 101 : police et incendie.",
      "101 : police ; 112 : urgence médicale, mais pas pour un incendie.",
      "112 : incendie et police ; 101 : intervention médicale urgente."
    ],
    "explanation": "112 pour urgence vitale/incendie/ambulance, 101 pour police."
  },
  {
    "id": "training-31",
    "question": "Lors d’un incident avec fluide corporel, pourquoi fermer la zone ?",
    "correct": "Pour sécuriser l’espace avant le nettoyage avec le kit prévu.",
    "wrong": [
      "Pour permettre au manager de préparer le matériel du kit avant que le nettoyage ne commence.",
      "Pour isoler l’espace pendant que le crew cherche le matériel de nettoyage approprié.",
      "Pour sécuriser les clients jusqu’à ce que le responsable de zone autorise le nettoyage."
    ],
    "explanation": "La logique est : prévenir, isoler, utiliser le kit dédié."
  },
  {
    "id": "training-32",
    "question": "Si tu connais par cœur une information allergène, peux-tu la donner directement au client ?",
    "correct": "Non, la procédure demande quand même de lui remettre la documentation prévue.",
    "wrong": [
      "Oui, si tu remets aussi la documentation allergènes au client avant de confirmer l’information.",
      "Oui, si le manager a déjà confirmé la même information auparavant pour ce produit.",
      "Oui, si tu lis directement la réponse dans la farde verte avec le client."
    ],
    "explanation": "Connaître la réponse ne change pas le réflexe demandé par la fiche."
  },
  {
    "id": "training-33",
    "question": "Quel comportement est commun aux situations « client agressif » et « médias » ?",
    "correct": "Prévenir rapidement le manager.",
    "wrong": [
      "Prévenir le manager une fois que le client agressif ou les médias ont terminé leur demande.",
      "Demander à la personne de patienter à l’extérieur, puis appeler le manager si elle insiste.",
      "Écouter la demande, répondre uniquement aux informations générales, puis transmettre la situation au manager."
    ],
    "explanation": "Le manager est le point de relais dans ces deux situations sensibles."
  },
  {
    "id": "training-34",
    "question": "Pour retenir la procédure de nettoyage, quelle phrase-mémo est correcte ?",
    "correct": "Produit sur le support, jamais directement sur la surface.",
    "wrong": [
      "Produit sur le support, puis une légère vaporisation directement sur la surface avant le frottage.",
      "Produit sur la lavette, puis application du produit restant directement sur les traces résistantes.",
      "Produit sur le papier à usage unique, puis rinçage de la surface avant de la frotter."
    ],
    "explanation": "C’est une reformulation mnémotechnique de la réponse officielle."
  },
  {
    "id": "training-35",
    "question": "Quel ordre correspond le mieux à un incident de vomissement dans le lobby ?",
    "correct": "Prévenir → fermer la zone → prendre le kit → nettoyer selon les instructions.",
    "wrong": [
      "Prévenir → prendre le kit → fermer la zone → nettoyer selon les instructions.",
      "Fermer la zone → prendre le kit → prévenir le manager → nettoyer selon les instructions.",
      "Prévenir → fermer la zone → nettoyer avec le kit → relire les instructions avant de rouvrir."
    ],
    "explanation": "La séquence reprend les étapes données dans le questionnaire."
  },
  {
    "id": "training-36",
    "question": "Quel ordre correspond le mieux à une demande d’accès au terrain ?",
    "correct": "Vérifier l’identité → prévenir le manager → décision du manager.",
    "wrong": [
      "Vérifier l’identité → autoriser l’accès → prévenir le manager que la personne est sur le terrain.",
      "Prévenir le manager → vérifier l’identité → laisser le manager accompagner la personne sur le terrain.",
      "Vérifier l’identité → demander au responsable de zone de décider si l’accès est autorisé."
    ],
    "explanation": "Le crew collecte l’information, le manager tranche."
  }
]

export const finalOfficialIds = [2,5,7,13,14]
