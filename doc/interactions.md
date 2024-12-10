# Les Interactions
Les interactions sont les actions que les utilisateurs peuvent effectuer sur le bot, tels que des commandes, des modals, des boutons, etc.

Chaque type d'interaction suit à peut près la même logique, et a ainsi un sous dossier à son nom.

---
### [Boutons](../src/interactions/buttons)
Ce sont les interactions qui viennent de clique sur un bouton.
Les boutons ont des catégories (des sous-dossiers), et il faut bien remplir le `customID` avec un id unique (aux boutons).
Pour appeler un bouton qui est enregistré dans une catégorie, il faut utiliser `<nom catégorie>:<customID>`.
Le dossier [contribuer](../src/interactions/buttons/contribuer) contient des boutons auto généré en fonction des rôles enregistrés dans le fichier de [rôles](../src/data/utils/roles.json).
Ceci est configurable dans [config.json](../src/interactions/buttons/contribuer/config.json).

---
### [Commandes](../src/interactions/commands/)
Ce sont les interactions qui viennent directement des utilisateurs, qu'ils lancent à l'aide de `/<nom de la commande>`.
Les sous-dossiers (*du dossier commandes*) représentent les catégories de commandes.
Il faut noter que les catégories suivantes applique des permissions à l'exécution des commandes :
- [admin](../src/interactions/commands/admin) : il faut avoir le rôle administrateur ou le rôle bureau sur le discord
- [moderation](../src/interactions/commands/moderation) et [gestion](../src/interactions/commands/gestion) : il faut avoir le rôle administrateur, bureau ou modérateur sur le discord.

Il est possible de créer des subcommandes (sous la forme `/<nom de la commande> <sous-commande>`), pour ceci il faut :
1) Créer un sous-dossier portant le nom de la commande
2) Créer un fichier portant le même nom, avec les champs suivant (et pas de `runInteration`) : `commandeGroupe: true` et `category: "<nom de la catégorie"`
3) Rajouter les fichiers de commandes comme d'habitude, avec le champ `subCommande: true` en plus.

---
### [Modals](../src/interactions/modals)
Ce sont les interactions qui viennent de la validation d'un formulaire proposé par le bot (souvent ouvert par un bouton).
Il n'y a pas de catégories, et il faut bien remplir le `customID` avec un id unique (aux modals).
