myEDT
=========

my EDT est une appliquation web riche (rich web app) a destination des etudiants utilisant les services de celcat.

Ses principeaux atouts sont :

  - Fonctionne sur une grande variétée de plateforme (Mac / PC / iOS / Android ...)
  - S'addapte au preferences de son utilisateur (cacher/renommer une matiere)
  - Peut etre utilisé sans une connection à internet

Installation
============
1. télécharger la derniere version de myAgenda par l'une des methodes suivantes :
	* via ```git fetch https://github.com/jarpike/EDT.git```
	* via https://github.com/jarpike/EDT/archive/master.zip
2. déployez le projet sur un server HTTP (apache,nginx) ou en local (file://)
3. accédez a l'element index.html pour lancer myAgenda

Dépendances
============
Pour fonctionner, myAgenda depend de plusieurs serveurs :
* CDN de bootstrap/Jquery
* serveur Celcat (qui n'autorise pas les cross requests)
* proxy (google appengine) qui va transmettre la requette a celat et la renvoyer en autorisant le cross requests

cette derniere dépendance pourrait étre évitée si le serveur celcat autorisait le [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)


    
