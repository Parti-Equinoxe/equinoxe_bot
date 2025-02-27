# Contribution

La branche `Dev` contient la prochaine version.
Les nouvelles fonctionnalités sont en premier lieu poussées sur le `Dev` ou sous une branche dédiée (baser sur `Dev`). Cependant ce n'est pas obligatoire pour tout ce qui est «corvée». Les modifications dites de «corvée» sont soit poussées sur une branche dédiée ou sur le `main`. Les «fix» peuvent être sous `Dev` ou `Main` cela dépend si des tests supplémentaires sont nécessaires. Si une modification est poussée sur le `Main` un «rebase» de `Main` vers `Dev` doit être effectué pour résoudre les conflits et évitée de futur conflit.

## Conventionnal commit

Les commits sur ce paquet doivent utiliser la méthode de commit conventionnel pour que les releases génèrent un numéro de version automatiquement.
Les principes basique :

- Feat
  - Permet de spécifié une nouvelle fonctionnalité développé
  - Update du numéro de version de "1.0.0" > "1.1.0"
  - Exemple de commit :
    - Basique : "feat: ma nouvelle fonctionnalité"
    - Groupé : "feat(webhook) : mise en place des webhooks"
    - Groupé : "feat(webhook) : creation de tel webhook ..."

- Fix
  - Permet de spécifié un correctif
  - Update du numéro de version de "1.0.0" > "1.0.1"
  - Exemple de commit :
    - Basique : "fix: correction de tel problème"
    - Groupé : "fix(webhook) : correction du webhook A"
    - Groupé : "fix(webhook) : correction du webhook B"

- Chore
  - Permet de commit sur des fichiers de "corvée", comme le readme, changelog, package-lock
  - Pas d'update du numéro de version "1.0.0" > "1.0.0"
  - Exemple de commit :
    - Basique : "chore: modification du readme"
    - Groupé : "chore(readme) : maj du readme"

Voir la documentation sur les conventionnal commits complète ici : <https://www.conventionalcommits.org/en/v1.0.0/#summary>

PS : Si vous le souhaitez, on pourrait ajouter au package.json un "bloqueur" qui oblige les commit à utilisé cette convention
=> voir ici : <https://github.com/conventional-changelog/commitlint>
=> si vous êtes OK, c'est assez simple à mettre en place.
