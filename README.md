myEDT
=========

my EDT est une appliquation web riche (rich web app) a destination des etudiants utilisant les services de celcat.

Ses principeaux atouts sont :

  - Fonctionne sur une grande variétée de plateforme (Mac / PC / iOS / Android ...)
  - S'addapte au preferences de son utilisateur (cacher/renommer une matiere)
  - Peut etre utilisé sans une connection à internet

Hacking
=======
L'aspect visuel et le comportement de myAgenda peut etre totalement re-programmer a la guise de son utilisateur.

Methodes JS
-----------
```js
onawake=function(old,now){
    //
	onhashchange({newURL:location.href});
}
```

Classes CSS
----

    