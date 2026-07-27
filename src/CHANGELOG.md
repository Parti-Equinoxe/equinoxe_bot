# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [1.2.0](https://github.com/Parti-Equinoxe/equinoxe_bot/compare/v1.1.0...v1.2.0) (2026-07-27)


### Features

* Ajoue d'une gestionaire de config et récriture de l'event handler tagPingCom.js pour supporter la config. ([0219c46](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/0219c46911b3499bab218d68fb578be4e0bd129b))
* Ajout de plus de config, messages prefab et permissions ([34d2e5c](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/34d2e5c90017543ab8a5a6c99ae5acc136b3c009))
* ajout fct ajouter role ([849e406](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/849e4063eb511971f0b03e2e1e935943d46a42fc))
* clean up ([e9b22b7](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/e9b22b741438ed499b5646fdbbfabdc44f3c48b0))
* **disable:** ajout d'une fonctionalité pour désactiver une commande ([b4aa039](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/b4aa0391a6321965cd2069b8bc14c737b525eb90))
* **disable:** désactivation des commandes intulisable ou buggé ([ad08792](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/ad0879250d612d3645e5d7ee196a04a8917ed520))
* maj des roles ([1c256d4](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/1c256d46f870a087a4c14c3f65fdca82dbf28994))
* maj des salons ([e367d6e](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/e367d6e24746252efc05da606391c9c4d507cc9e))


### Bug Fixes

* **calendar config:** - .list (ancien config) ([c0dd6e6](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/c0dd6e6ffb908ea9183519681de6f5dc85e36e34))
* **calendar config:** format config (ct pas mappable) ([32b24ac](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/32b24ac0a84b264539af3105426873f572e8132a))
* **doc:** syntaxe ([3c1014b](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/3c1014bb2ee4c2e32667bb0e349539b3619b4685))
* erreure de logique ([4cc472b](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/4cc472b01f2083b3a6135c0d4b3bad54b4927d20))
* faute de frappe ([3928e9a](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/3928e9a66a5442f9002f2c9ec891b0984642556b))
* fix de la config salon -> salons , mielleurs gestions de ConfigHandler des erreur de config et déplacement du code dans API. Fix tagPingCom, fix le path vert config dans index.js. ([db22561](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/db2256164ce4ea8acb2ccdb7f61e8313ee1c6be4))
* fix et test les fonctionalitée du commit [#34](https://github.com/Parti-Equinoxe/equinoxe_bot/issues/34)d2e5c90017543ab8a5a6c99ae5acc136b3c009 ([7f7c239](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/7f7c23983c3f066676338c27d48836775a4fc104)), closes [#34d2e5c90017543ab8a5a6c99ae5acc136b3c009](https://github.com/Parti-Equinoxe/equinoxe_bot/issues/34d2e5c90017543ab8a5a6c99ae5acc136b3c009)
* fix une erreur de renomage, fix d'un alias dans la config ([63ed554](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/63ed55427a681a9c21345ff959e5d90c220dfe5f))
* GatewayIntentBits en double ([2063fab](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/2063fab6a075155920bb4a11a2df41dede6cea5c))
* liste lien ([16934e3](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/16934e31cebffe40cc59a4d12033014b84f23e3c))
* mauvais nom fct ([8cfb023](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/8cfb023d38c66d1e10934cc68d3bbb4e2f65ab0a))
* merge commit erreur de syntaxe userARole -> userAnyRoles ([0772fbb](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/0772fbb8d87cad13343f36f04cc550397cf50ef7))
* sup log ([98eb9cc](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/98eb9ccb4f5ed4512823ee2c22af1fc13e9411ca))
* typedeff ([f751020](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/f751020dab1ff1dabe4f7551e3a8659acda081fe))
* userARole => userAnyRoles ([8e4ddf4](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/8e4ddf4a37b3165814a412f3357972f994c71128))
* xml config retirée un commentaire qui ne devrait pas être là ([163383c](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/163383cebe3feb74b6ddfe74c0bfb0d52030ef17))

## 1.0.1 (2026-01-27)


### Features

* ajout appel removeRoleMember ([71dfff2](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/71dfff26f7788e3a620e28d70f035221cb55ba7b))
* ajout cmd pour mettre a jour les perm du role symp (sur les perm de [@everyone](https://github.com/everyone)) ([d77a648](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/d77a648a40a5f609f18962ee8ec46b769dead7ee))
* ajout cmd status (bot et api) ([449e320](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/449e3203a4ad4d63f9576b8bc01b701e390174c0))
* ajout couleur bleu ([fb165f6](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/fb165f6282e08481eadf97e13a7ac46434bbadc0))
* ajout fct majPermSymp ([cddd73b](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/cddd73b02bb39b7f3fc624814fe360dd78799090))
* ajout pre_load_msg pour le CE ([e6611d8](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/e6611d8c8bd115ad5adbf5054654685453d74cff))
* ajout role invite ([bf6be39](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/bf6be39f7db79dd744cb8192eda8c6e7769007dd))
* ajout suppression des roles si symptathisant ([6c9d999](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/6c9d999390144c09a00a91e707d1208fa19341e3))
* ajout try catch pour les tâches au démarage ([48d5945](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/48d5945ce8c5c964e6a1784d00506956e0bf067a))
* ajout versioning ([852c266](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/852c26626744221737acf52fe6fbb05f733fd06f))
* **autorole:** ajout envoi de msg quand role ajouter (config_role_react) ([1fc468f](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/1fc468fd68361f0a7dee6302d4e6c69a00b02071))
* changement role adh ([7aa8cd9](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/7aa8cd9f7bf8afa9dae13444b0d796b1d90325c3))
* changment description + role ([bbd96df](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/bbd96df41a63ab5bb407860968e502f36cc2456e))
* commentaire fct ([e787d4b](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/e787d4bbacb9d38ddab704d529538608504e84c2))
* **depalcer arriver:** deplacer vers le pre_load_msg accueil ([ac32700](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/ac32700d06d61fdb4edc4b294aefd8993183e428))
* maj texte (fix lien réu acceuil, ajout pas de petite annonce, ajout partie comment lier mon comte) ([7180d17](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/7180d17fbcdba7d6f0ad73caefaf019e1584cb8b))
* misa jour de structure du pôle programme (rôles) ([b958c6b](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/b958c6ba28e3e2eb2d8e72072a18b88d4a867a7f))
* modification compteur (adh -> conecté) et ajout requet api nb adh ([b4489b7](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/b4489b721e130a84bdef9b667546a67c61017b55))
* **permission invite:** ajout code pour copier les perm de adh vers invite ([18273ea](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/18273ea3a5afbf714af6bb5b23737c09714d4691))
* **permission invite:** ajout commande pour copier perm de adh vers invite ([c3cbabf](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/c3cbabfd7e363732ba4d344190a6417ed6ce4b47))
* renomer le nom du salon en adhérent ([cc70a12](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/cc70a12e2dfff6f75dc3431608d5020ce2689fc3))


### Bug Fixes

* ajout info resp ([b5679fd](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/b5679fd20f65a7aee130947be02ef1b50a7bf544))
* ajout return ([ff18123](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/ff18123ccbc19d8145617043382041f2dafeea52))
* blacklist le role invite ([0279359](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/027935987ac2308c486c22ec20aedd8971ed7dfb))
* correction orthographe + wikinoxe ([07fea21](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/07fea2116858d9a60fee7f12604782f1f40e5319))
* **depalcer arriver:** deplacer arriver vers accueil ([ec31cec](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/ec31cec50f0e7eaae711c10793573042f02573c3))
* désactivation des ping dans creation contenu (car inutile) ([bceaafe](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/bceaafe1cd0afd87747b32c0135e46699ae85923))
* désactiver car pas fonctiel coté API ([4f11c2d](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/4f11c2dec4244ca4ec27baacf93969d11d600840))
* donne le role sympathisant en arrivant sur le serv ([fa5b234](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/fa5b23469c88395ac7347b72f5506c375b28bf5b))
* écriture inclusive ([89507a3](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/89507a3cb29c5de802a568a0e0406943fcaff735))
* espace manquant ([67c243a](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/67c243aafb1b59e4d5b7ce9bc7455bf139d0b3ad))
* espace manquant ([75b4910](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/75b4910bbabb0ae571e16571b2ebdfc256db9d69))
* il manquait un point ([c68acbd](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/c68acbdd0a363c3e95365a60497f29c6d316b77f))
* maj api health call + deferReply ([ae6d9e7](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/ae6d9e756021b4ff676df50c25d3bf40d9a3eda2))
* maj version ([097803d](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/097803d08608682c848136dcf45277afcd12dfbd))
* mauvais lien ([1c2a121](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/1c2a12155843e98bbaee911067d34696f24af8fc))
* mise en marche ([3799d1e](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/3799d1e3ed08b8dfbc618b78d9ae7162e9b8129f))
* nouveau id ([ed24d18](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/ed24d18bfc82b1b1f933ba6add81e6f05b077281))
* orhographe ([4ec9178](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/4ec9178763d965727ba5ee08e3e2a0155ff5a7ee))
* orthographe ([4c6d766](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/4c6d766fce45c948aba74f595558a84ee7e8800d))
* orthographe ([b012593](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/b01259348c12c68d58805924a25b72db59164dbe))
* oubli d'un await ([f6c96ed](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/f6c96ed66ae24b8695c358bd7d9424765666ee1d))
* phrase ([7cb1bc1](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/7cb1bc1b71da26e0eed971011823b1da10374773))
* role reseaux_partenariats avait pas sont buttons ([8754409](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/8754409b0f115de55951fe65d0eee373324f6717))
* salon pas bon id ([cdf8101](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/cdf810113d4a617b5bf551ff24dbe1e5a90d96ce))
* sup role qui existait plus ([96d32ab](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/96d32abb96634aa0692801bccd6e3e7e68df6426))
* tag qui marchait pas en mp ([a17371e](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/a17371e9bfb49d04d5e2f6e29621e2fc65c51388))
* **VJM:** ajout deferReply & fix json type & nom button ([5c6ec6e](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/5c6ec6eab39db7ee691fa1d339729e70b7b8c448))
* **VJM:** fix pas possible de reéditer après erreure ([a45d478](https://github.com/Parti-Equinoxe/equinoxe_bot/commit/a45d478edb694b587190d7cef81460bc33fc43b1))
