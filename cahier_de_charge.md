Université Hassan II de Casablanca
Faculté des Sciences Ben M'Sick (FSBM)
Licence en Développement Informatique — 3ème Année

# **CAHIER DES CHARGES**


Projet de Fin d'Études — Année Universitaire 2025–2026

## **Application Web de Gestion de Stock**
#### **pour un Magasin de Jouets**














### **Table des Matières**

1.  Contexte et présentation du projet

2.  Problématique
3.  Objectifs du projet

4.  Périmètre du projet

5.  Acteurs du système

6.  Besoins fonctionnels
7.  Besoins non fonctionnels

8.  Architecture technique et technologies

9.  Modèle de données

10.  Planning prévisionnel
11.  Livrables attendus

12.  Conclusion


### **1. Contexte et Présentation du Projet**

##### **1.1 Contexte général**

Ce document constitue le cahier des charges de l'application web de gestion de stock réalisée
dans le cadre du Projet de Fin d'Études (PFE) de la Licence en Développement Informatique,
3ème année, à la Faculté des Sciences Ben M'Sick (FSBM), Université Hassan II de
Casablanca.
Ce projet est réalisé en partenariat avec M. Saleh Hammouna, auto-entrepreneur dans le
domaine du développement de solutions informatiques, qui souhaite commercialiser une
application de gestion de stock auprès de ses clients. Le premier client ciblé est le propriétaire
d'un magasin de jouets situé au Maroc.

##### **1.2 Présentation de l'entreprise d'accueil**








##### **1.3 Présentation du client bénéficiaire**

L'application sera destinée à un magasin spécialisé dans la vente de jouets pour enfants, de
jouets éducatifs et de tout article en lien avec l'univers de l'enfance. Ce magasin opère
actuellement avec un système de gestion entièrement manuel (papier et cahiers), ce qui
engendre de nombreux problèmes opérationnels.


### **2. Problématique**

Le magasin de jouets concerné ne dispose d'aucun système informatisé pour la gestion de son
stock. Toutes les opérations sont effectuées manuellement sur des cahiers et des feuilles
papier, ce qui engendre plusieurs difficultés majeures :


   - Erreurs et pertes de stock : les quantités enregistrées manuellement sont souvent
incorrectes ou incomplètes.

   - Absence de suivi en temps réel : il est impossible de connaître instantanément les
niveaux de stock disponibles.

   - Risque de rupture de stock : sans système d'alerte, les articles peuvent manquer sans
que le gérant en soit informé à temps.

   - Manque de traçabilité : les entrées et sorties de marchandises ne sont pas
documentées de façon fiable.

   - Perte de temps : la recherche d'informations sur un produit ou l'établissement d'un
bilan de stock nécessite un effort manuel important.

   - Difficultés de gestion des fournisseurs : le suivi des approvisionnements est difficile
sans outil dédié.


Face à ces défis, il est nécessaire de développer une application web qui centralise, automatise
et sécurise la gestion du stock du magasin.


### **3. Objectifs du Projet**

##### **3.1 Objectif général**

Concevoir et développer une application web de gestion de stock complète, destinée au
magasin de jouets, permettant d'automatiser le suivi des produits, des mouvements de stock,
des fournisseurs et des utilisateurs, tout en offrant une interface claire et intuitive.

##### **3.2 Objectifs spécifiques**


   - Permettre la gestion complète des produits (ajout, modification, suppression,
consultation).

   - Organiser les produits par catégories pour faciliter la navigation et la recherche.

   - Suivre en temps réel les entrées et sorties de stock.

   - Déclencher des alertes automatiques lorsque le stock d'un produit atteint un seuil
minimum.

   - Gérer les fournisseurs associés aux produits approvisionnés.

   - Offrir un tableau de bord synthétique avec des indicateurs clés pour le gérant.

   - Gérer les utilisateurs de l'application avec des rôles et permissions distincts.


### **4. Périmètre du Projet**

##### **4.1 Fonctionnalités incluses**


   - Gestion des produits (informations détaillées, image optionnelle)

   - Gestion des catégories de produits

   - Gestion des mouvements de stock (entrées et sorties)

   - Système d'alertes de stock faible

   - Gestion des fournisseurs (informations de base)

   - Tableau de bord avec statistiques et indicateurs

   - Gestion des utilisateurs et des rôles (Administrateur / Employé)

   - Authentification par nom d'utilisateur et mot de passe

##### **4.2 Fonctionnalités exclues du périmètre**


   - Gestion financière avancée (comptabilité, bilan financier)

   - Application mobile native

   - Intégration avec des systèmes externes (ERP, comptabilité)

   - Gestion des ventes et factures en version 1

   - Module e-commerce ou vente en ligne


### **5. Acteurs du Système**

L'application sera utilisée par deux types d'acteurs avec des niveaux d'accès différents :

##### **5.1 Administrateur (Gérant du magasin)**


L'administrateur dispose d'un accès complet à toutes les fonctionnalités de l'application. Il peut
:

   - Gérer l'ensemble des produits et des catégories.

   - Consulter et superviser tous les mouvements de stock.

   - Gérer les comptes utilisateurs (création, modification, suppression).

   - Accéder au tableau de bord complet avec toutes les statistiques.

   - Gérer les fournisseurs.

   - Configurer les seuils d'alerte de stock minimum.

##### **5.2 Employé**


L'employé dispose d'un accès limité aux opérations quotidiennes. Il peut :

   - Consulter la liste des produits et leur stock disponible.

   - Enregistrer des entrées de stock (réception de marchandise).

   - Enregistrer des sorties de stock (vente ou perte de produit).

   - Consulter son propre historique d'activité.


### **6. Besoins Fonctionnels**

##### **6.1 Module Authentification**

Le système doit gérer l'accès à l'application via un système de connexion.

   - Connexion via nom d'utilisateur et mot de passe.

   - Déconnexion.

   - Redirection selon le rôle après connexion.

##### **6.2 Module Gestion des Produits**


Ce module permet de gérer l'ensemble des articles disponibles dans le magasin.


**Informations d'un produit :**

   - Identifiant unique (généré automatiquement)

   - Nom du produit

   - Description

   - Prix d'achat

   - Prix de vente

   - Quantité en stock

   - Seuil de stock minimum (pour les alertes)

   - Catégorie associée

   - Fournisseur associé

   - Date d'ajout

   - Image du produit (optionnelle)


**Fonctionnalités :**

   - Ajouter un nouveau produit.

   - Modifier les informations d'un produit existant.

   - Supprimer un produit (par l'administrateur uniquement).

   - Consulter la liste complète des produits avec filtres et recherche.

   - Consulter la fiche détaillée d'un produit.

##### **6.3 Module Gestion des Catégories**


Ce module permet d'organiser les produits par familles ou types.

   - Créer une nouvelle catégorie (nom + description).

   - Modifier une catégorie existante.

   - Supprimer une catégorie (si elle ne contient aucun produit actif).

   - Consulter la liste de toutes les catégories.

##### **6.4 Module Gestion des Mouvements de Stock**


Ce module assure la traçabilité complète des entrées et sorties de marchandises.


**Types de mouvements :**


   - Entrée de stock : réception d'une livraison fournisseur, retour d'un article.

   - Sortie de stock : vente d'un article, perte ou article endommagé.


**Informations enregistrées :**

   - Type de mouvement (entrée / sortie)

   - Produit concerné

   - Quantité déplacée

   - Date et heure du mouvement

   - Motif ou commentaire

   - Utilisateur responsable de l'opération


**Fonctionnalités :**

   - Enregistrer une entrée ou sortie de stock.

   - Consulter l'historique complet des mouvements.

   - Filtrer les mouvements par date, produit, type ou utilisateur.

##### **6.5 Module Alertes de Stock Faible**


Ce module notifie automatiquement lorsqu'un produit atteint son seuil minimum.

   - Affichage d'une alerte visuelle sur le tableau de bord.

   - Liste des produits en alerte avec leurs quantités actuelles.

   - Indication du stock minimum configuré pour chaque produit.

##### **6.6 Module Gestion des Fournisseurs**


Ce module permet de référencer les fournisseurs des produits du magasin.


**Informations d'un fournisseur :**

   - Nom du fournisseur

   - Téléphone

   - Email

   - Adresse


**Fonctionnalités :**

   - Ajouter un nouveau fournisseur.

   - Modifier les informations d'un fournisseur.

   - Supprimer un fournisseur.

   - Consulter la liste des fournisseurs et les produits associés.

##### **6.7 Module Tableau de Bord (Dashboard)**


Le tableau de bord offre une vue synthétique et en temps réel de l'état du stock.

   - Nombre total de produits en stock.

   - Valeur totale du stock (basée sur les prix d'achat).

   - Nombre de produits en alerte (stock faible).

   - Nombre total de catégories.


   - Nombre total de fournisseurs.

   - Graphique des mouvements de stock récents (entrées vs sorties).

   - Liste des derniers mouvements enregistrés.

   - Top des produits les plus mouvementés.

##### **6.8 Module Gestion des Utilisateurs**


Ce module est réservé à l'administrateur pour gérer les accès à l'application.

   - Créer un nouveau compte utilisateur (employé).

   - Modifier les informations d'un utilisateur.

   - Activer ou désactiver un compte utilisateur.

   - Attribuer ou modifier le rôle d'un utilisateur.

   - Consulter la liste de tous les utilisateurs.


### **7. Architecture Technique et Technologies**

##### **7.1 Architecture générale**

L'application repose sur une architecture web classique en trois couches distinctes :

   - Frontend : interface utilisateur accessible depuis un navigateur web.

   - Backend : serveur applicatif gérant la logique métier et les API.

   - Base de données : stockage persistent de toutes les données de l'application.

##### **7.2 Technologies retenues** **7.3 Justification du choix React vs Angular**


React a été retenu pour les raisons suivantes :

   - Grande flexibilité et liberté dans la structuration du projet.

   - Écosystème très riche avec de nombreuses bibliothèques disponibles.

   - Très prisé sur le marché de l'emploi au Maroc et à l'international.

##### **7.4 Justification du choix Spring Boot vs Node.js**


Spring Boot a été retenu pour les raisons suivantes :

   - Typage fort en Java : réduit les erreurs et améliore la qualité du code.

   - Spring Security offre une gestion native et robuste de l'authentification.

   - Architecture claire (Controllers, Services, Repositories)


### **8. Modèle de Données (Simplifié)**

Le système repose sur les entités principales suivantes :

##### **Relations principales**


   - Un produit appartient à une catégorie .

   - Un produit est fourni par un fournisseur.

   - Un mouvement de stock est lié à un produit.

   - Un mouvement de stock est effectué par un utilisateur.


### **9. Planning Prévisionnel**


### **10. Conclusion**

Ce cahier des charges présente de manière claire et structurée le périmètre fonctionnel et
technique de l'application web de gestion de stock développée pour le compte d'un magasin de
jouets.


Cette solution répond directement aux besoins identifiés chez notre client : automatiser le suivi
des produits, réduire les erreurs liées à la gestion manuelle, et offrir une visibilité en temps réel
sur l'état du stock. L'ensemble des fonctionnalités définies dans ce document a été
soigneusement sélectionné pour répondre aux exigences opérationnelles du magasin.


Les technologies choisies — React.js pour le frontend, Spring Boot pour le backend et MySQL
pour la base de données — constituent une combinaison moderne, robuste et parfaitement
adaptée aux besoins de cette application.

L'application livrée constituera un outil concret, fiable et directement exploitable par le client dès
sa mise en production. Elle représente également une base solide, évolutive, sur laquelle des
fonctionnalités supplémentaires pourront être ajoutées selon les besoins futurs du client.


Casablanca, 2025 – 2026

**Meryem Mouktader**


