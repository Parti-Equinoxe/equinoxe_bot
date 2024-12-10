# Le Handler
Le handler est le responsable de l'enregistrement et de la gestion des interactions (*commandes, events, selects, boutons et modals*).
Le code est placé dans [src/handlers](../src/handlers) ainsi que le fichier [src/index.js](../src/index.js), le fichier lancé à l'exécution.
---
### [Le chargement des interactions](../src/handlers/preload)
C'est le code responsable de l'enregistrement des commandes, selects, boutons, events et modal.
Chaque un des types d'interaction ont leur propre fichier.
Globalement le gros du code est là pour vérifier la structure enregistrée.
---
### [La validation des interactions](../src/handlers/interactionValidation)
C'est le code responsable de dispatcher les interactions vers leur code (les fonctions `runInteraction`).
Le code est ici pour valider les permissions des interactions ainsi que de capturer d'éventuelles erreurs.
Les selects et les boutons sont traités dans [components.js](../src/handlers/interactionValidation/component.js).