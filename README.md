Ce projet est une application web développée avec Django, permettant la gestion et la manipulation de conteneurs Docker dans un environnement Ubuntu via une interface utilisateur conviviale. L'application utilise Docker pour déployer des conteneurs et permettre à l'utilisateur de démarrer, arrêter, et interagir avec ces conteneurs à travers une interface graphique. L'objectif principal est d'offrir une solution simple et efficace pour la gestion des conteneurs dans un environnement de développement ou de production.

Technologies utilisées :
Django : Framework Python pour la création de l'application web backend, qui gère les opérations sur les conteneurs Docker.
Docker : Conteneurisation des applications, permettant de gérer et déployer des services dans des environnements isolés.
Ubuntu : Système d'exploitation utilisé comme machine virtuelle pour héberger l'application et exécuter Docker.
JavaScript/jQuery : Pour la gestion des interactions frontend, permettant à l'utilisateur de contrôler les conteneurs via l'interface.
HTML/CSS : Pour la mise en page de l'interface utilisateur, assurant une présentation claire et responsive.
Fonctionnalités principales :
Démarrage/Arrêt de conteneurs : L'utilisateur peut démarrer ou arrêter des conteneurs Docker directement depuis l'interface.
Affichage des logs : L'application permet de récupérer et afficher les logs des conteneurs en temps réel.
Contrôle de l'état des conteneurs : Visualisation de l'état actuel des conteneurs, avec la possibilité de vérifier leur statut (en cours d'exécution, arrêté, etc.).
Statistiques en temps réel : Affichage des statistiques des conteneurs (CPU, mémoire, réseau, etc.) à l'aide de graphiques d'analyse.
Gestion des utilisateurs et de l'accès : Mise en place d'un système de connexion avec JWT pour sécuriser l'accès aux fonctionnalités de gestion des conteneurs.
