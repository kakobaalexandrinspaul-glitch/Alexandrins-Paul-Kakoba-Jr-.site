// On attend que toute la page HTML soit chargée avant de lancer notre code.
// "DOMContentLoaded" = "la page est prête". Sans ça, le JS pourrait chercher des éléments qui n'existent pas encore.
document.addEventListener("DOMContentLoaded", () => {

  // On demande au navigateur : "L'utilisateur a-t-il demandé moins d'animations ?"
  // Le résultat est true (oui) ou false (non). Certaines personnes sont gênées par les animations.
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // On récupère TOUS les éléments de la page qu'on veut faire apparaître doucement
  // (l'en-tête, les sections, les cartes de projets, le CV, les contacts, le formulaire et le pied de page).
  const revealElements = document.querySelectorAll(
    "header, main section, .projet-card, .cv, .contacts, .contact-form, footer"
  );

  // On passe sur chaque élément un par un. "element" = l'élément actuel, "index" = son numéro (0, 1, 2...).
  revealElements.forEach((element, index) => {
    // On rend l'élément invisible au départ (opacité 0 = transparent).
    element.style.opacity = "0";
    // On le décale de 28 pixels vers le bas, pour qu'il "monte" ensuite en apparaissant.
    element.style.transform = "translateY(28px)";
    // On règle la vitesse de l'animation : 0,6 seconde. Si l'utilisateur veut moins d'animations, on met "none" (aucune).
    element.style.transition = prefersReducedMotion ? "none" : "opacity 0.6s ease, transform 0.6s ease";

    // On demande au navigateur d'attendre le prochain dessin de l'écran avant de continuer.
    requestAnimationFrame(() => {
      // On attend un peu : 0 ms pour le 1er élément, 80 ms pour le 2e, 160 ms pour le 3e...
      // Comme ça les éléments apparaissent l'un après l'autre, en cascade.
      setTimeout(() => {
        // On rend l'élément totalement visible.
        element.style.opacity = "1";
        // On le remet à sa vraie place (plus de décalage).
        element.style.transform = "translateY(0)";
      }, index * 80);
    });
  });

  // Fonction qui met en gras le lien du menu correspondant à la page où on se trouve.
  const setActiveNavLink = () => {
    // On lit l'adresse de la page, on la coupe aux "/" et on garde le dernier morceau (ex : "index.html").
    // S'il est vide, on utilise "index.html" par défaut.
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    // On récupère tous les liens du menu.
    const navLinks = document.querySelectorAll("nav a, .nav-list a");

    // On regarde chaque lien du menu l'un après l'autre.
    navLinks.forEach((link) => {
      // On lit l'adresse vers laquelle le lien pointe (son attribut href).
      const href = link.getAttribute("href");
      // Le lien est "actif" si son adresse est celle de la page actuelle,
      // ou si on est sur la page d'accueil vide et que le lien mène vers index.html.
      const isActive = href === currentPath || (currentPath === "" && href === "index.html");

      // Si le lien est actif...
      if (isActive) {
        // ...on dit aux lecteurs d'écran (pour les personnes aveugles) que c'est la page actuelle...
        link.setAttribute("aria-current", "page");
        // ...et on met le texte du lien en gras.
        link.style.fontWeight = "700";
      }
    });
  };

  // Fonction qui fait marcher le menu hamburger (le bouton ☰) sur téléphone.
  const setupMobileMenu = () => {
    // On cherche la case à cocher qui sert de bouton hamburger.
    const hamburger = document.querySelector("#hamburger");
    // On cherche la liste des liens du menu.
    const navList = document.querySelector(".nav-list");

    // Si l'un des deux n'existe pas sur la page, on s'arrête ici (return = on sort de la fonction).
    if (!hamburger || !navList) return;

    // Quand on coche ou décoche le hamburger ("change")...
    hamburger.addEventListener("change", () => {
      // ...si c'est coché, on affiche le menu ("flex"), sinon on le cache ("none").
      navList.style.display = hamburger.checked ? "flex" : "none";
    });

    // Si l'écran est petit (768 pixels ou moins, comme un téléphone)...
    if (window.innerWidth <= 768) {
      // ...on cache le menu au départ.
      navList.style.display = "none";
    }
  };

  // Fonction qui ajoute des petits effets quand la souris passe sur certains éléments.
  const setupHoverEffects = () => {
    // On récupère toutes les cartes de projets.
    const projectCards = document.querySelectorAll(".projet-card");
    // Pour chaque carte...
    projectCards.forEach((card) => {
      // ...quand la souris ENTRE sur la carte...
      card.addEventListener("mouseenter", () => {
        // ...la carte monte de 8 pixels.
        card.style.transform = "translateY(-8px)";
      });

      // ...quand la souris SORT de la carte...
      card.addEventListener("mouseleave", () => {
        // ...la carte redescend à sa place.
        card.style.transform = "translateY(0)";
      });
    });

    // On récupère les images des cartes de projets et les images des éléments ".photo".
    const galleryImages = document.querySelectorAll(".projet-card img, .photo img");
    // Pour chaque image...
    galleryImages.forEach((image) => {
      // ...quand la souris entre sur l'image...
      image.addEventListener("mouseenter", () => {
        // ...l'image grossit un peu (1,04 = 4 % plus grande).
        image.style.transform = "scale(1.04)";
      });

      // ...quand la souris sort de l'image...
      image.addEventListener("mouseleave", () => {
        // ...l'image reprend sa taille normale.
        image.style.transform = "scale(1)";
      });
    });

    // On récupère les liens des réseaux sociaux.
    const socialLinks = document.querySelectorAll(".social-links a");
    // Pour chaque lien...
    socialLinks.forEach((link) => {
      // ...quand la souris entre sur le lien...
      link.addEventListener("mouseenter", () => {
        // ...le lien monte de 2 pixels et grossit de 10 %.
        link.style.transform = "translateY(-2px) scale(1.1)";
      });

      // ...quand la souris sort du lien...
      link.addEventListener("mouseleave", () => {
        // ...le lien revient à sa place et à sa taille normale.
        link.style.transform = "translateY(0) scale(1)";
      });
    });
  };

  // Fonction qui vérifie le formulaire de contact avant "l'envoi".
  const setupContactForm = () => {
    // On cherche le formulaire qui est dans la zone ".contact-form".
    const form = document.querySelector(".contact-form form");
    // S'il n'existe pas sur cette page, on s'arrête.
    if (!form) return;

    // On récupère les trois champs : le nom, l'email et le message.
    const nameInput = form.querySelector("#name");
    const emailInput = form.querySelector("#email");
    const messageInput = form.querySelector("#message");

    // Quand on clique sur le bouton "envoyer" ("submit")...
    form.addEventListener("submit", (event) => {
      // ...on empêche le navigateur de recharger la page (son comportement normal).
      event.preventDefault();

      // On lit ce que la personne a écrit dans chaque champ.
      // "?." = "si le champ existe", "trim()" = enlève les espaces au début et à la fin,
      // "|| ''" = si on n'a rien, on utilise un texte vide.
      const name = nameInput?.value.trim() || "";
      const email = emailInput?.value.trim() || "";
      const message = messageInput?.value.trim() || "";

      // Si l'un des trois champs est vide...
      if (!name || !email || !message) {
        // ...on affiche une fenêtre d'alerte...
        alert("Veuillez remplir tous les champs du formulaire.");
        // ...et on arrête tout (rien n'est envoyé).
        return;
      }

      // Une "regex" est un modèle pour vérifier la forme d'un texte.
      // Ici : du texte, puis @, puis du texte, puis un point, puis du texte (comme nom@site.com).
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // Si l'email ne correspond PAS à ce modèle (le "!" veut dire "non")...
      if (!emailRegex.test(email)) {
        // ...on prévient la personne...
        alert("Veuillez entrer une adresse e-mail valide.");
        // ...et on arrête.
        return;
      }

      // Si le message fait moins de 10 caractères (lettres, chiffres, espaces...)...
      if (message.length < 10) {
        // ...on dit qu'il est trop court...
        alert("Votre message doit contenir au moins 10 caractères.");
        // ...et on arrête.
        return;
      }

      // Si tout est bon, on affiche un message de remerciement.
      alert("Votre message a bien été envoyé. Merci pour votre message !");
      // On vide le formulaire pour pouvoir le remplir à nouveau.
      form.reset();
    });
  };

  // Fonction qui met automatiquement l'année actuelle dans le pied de page.
  const updateFooterYear = () => {
    // On cherche le paragraphe <p> dans le bas du pied de page.
    const footerYearTarget = document.querySelector(".footer-bottom p");
    // S'il n'existe pas, on s'arrête.
    if (!footerYearTarget) return;

    // On demande à l'ordinateur quelle est l'année d'aujourd'hui (ex : 2026).
    const currentYear = new Date().getFullYear();
    // On remplace le texte du paragraphe par une phrase qui contient cette année.
    footerYearTarget.textContent = `© ${currentYear} Alexandrins Paul Kakoba Jr. Tous droits réservés.`;
  };

  // Fonction qui ajoute une ombre sous l'en-tête quand on descend dans la page.
  const addScrollHeaderEffect = () => {
    // On cherche l'en-tête de la page.
    const header = document.querySelector("header");
    // S'il n'existe pas, on s'arrête.
    if (!header) return;

    // Petite fonction appelée à chaque fois qu'on fait défiler la page.
    const onScroll = () => {
      // Si on a descendu la page de plus de 20 pixels...
      if (window.scrollY > 20) {
        // ...on met une ombre douce sous l'en-tête.
        header.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.08)";
      } else {
        // ...sinon (on est tout en haut) on enlève l'ombre.
        header.style.boxShadow = "none";
      }
    };

    // On dit au navigateur : "À chaque défilement, exécute onScroll."
    // "passive: true" = "je ne bloquerai pas le défilement", ce qui le rend plus fluide.
    window.addEventListener("scroll", onScroll, { passive: true });
    // On l'exécute une première fois tout de suite, pour avoir le bon état dès l'ouverture.
    onScroll();
  };

  // Jusqu'ici, on a seulement FABRIQUÉ les fonctions. Maintenant on les LANCE, une par une.
  setActiveNavLink();      // met en gras le lien de la page actuelle
  setupMobileMenu();       // prépare le menu hamburger
  setupHoverEffects();     // active les effets au survol de la souris
  setupContactForm();      // active la vérification du formulaire
  updateFooterYear();      // met la bonne année en bas de page
  addScrollHeaderEffect(); // active l'ombre de l'en-tête au défilement
});