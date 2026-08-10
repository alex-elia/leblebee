import type { Locale } from "./locales";

export type Messages = {
  nav: {
    signIn: string;
    register: string;
    signOut: string;
    home: string;
    properties: string;
    suppliers: string;
    tasks: string;
    myTasks: string;
    overview: string;
    designSystem: string;
    users: string;
    activity: string;
    intros: string;
  };
  roles: {
    admin: string;
    client: string;
    supplier: string;
  };
  common: {
    email: string;
    emailPlaceholder: string;
    sending: string;
    due: string;
    noDueDate: string;
    noAccessNotes: string;
    linked: string;
    contactOnly: string;
    invalidEmail: string;
  };
  auth: {
    signInTitle: string;
    signInSubtitle: string;
    signInError: string;
    otpHint: string;
    otpSendButton: string;
    otpSent: string;
    otpSentLocal: string;
    otpSentTo: string;
    otpCodeLabel: string;
    otpCodePlaceholder: string;
    otpCodeHint: string;
    otpCodeRequired: string;
    otpVerifyButton: string;
    otpResend: string;
    otpChangeEmail: string;
    resetSessionLink: string;
    sessionResetDone: string;
    registerOtpHint: string;
    registerOtpSendButton: string;
    registerOtpVerifyButton: string;
    registerOtpSent: string;
    registerOtpSentLocal: string;
    magicLinkHint: string;
    magicLinkButton: string;
    magicLinkSent: string;
    magicLinkSentLocal: string;
    noAccount: string;
    newHere: string;
    createAccountLink: string;
    registerTitle: string;
    registerSubtitle: string;
    displayName: string;
    displayNamePlaceholder: string;
    registerMagicHint: string;
    personaLegend: string;
    clientTitle: string;
    clientDesc: string;
    supplierTitle: string;
    supplierDesc: string;
    createAccountButton: string;
    registerMagicSent: string;
    registerMagicSentLocal: string;
    adminEmailReserved: string;
    choosePersona: string;
    alreadyHaveAccount: string;
  };
  admin: {
    title: string;
    subtitle: string;
    statClients: string;
    statSuppliers: string;
    statProperties: string;
    openDesignSystem: string;
    browseProperties: string;
    users: {
      title: string;
      subtitle: string;
      empty: string;
      colName: string;
      colEmail: string;
      colRole: string;
      colLanguage: string;
      colJoined: string;
      unnamed: string;
      noEmail: string;
    };
    activity: {
      title: string;
      subtitle: string;
      empty: string;
      unknownTask: string;
    };
    intros: {
      title: string;
      subtitle: string;
      clientLabel: string;
      supplierLabel: string;
      selectClient: string;
      selectSupplier: string;
      noteLabel: string;
      noteHint: string;
      notePlaceholder: string;
      previewLabel: string;
      copy: string;
      copied: string;
      emailBoth: string;
      emailSubject: string;
      needBothRoles: string;
      unnamedClient: string;
      unnamedSupplier: string;
    };
  };
  client: {
    home: {
      titleHello: string;
      subtitle: string;
      statProperties: string;
      statSuppliers: string;
      statOpenTasks: string;
      newTask: string;
      addSupplier: string;
      newProperty: string;
      emptyTitle: string;
      emptyDesc: string;
    };
    properties: {
      title: string;
      subtitle: string;
      newProperty: string;
      emptyTitle: string;
      emptyDesc: string;
    };
    suppliers: {
      title: string;
      subtitle: string;
      addSupplier: string;
      emptyTitle: string;
      emptyDesc: string;
    };
    tasks: {
      title: string;
      subtitle: string;
      newTask: string;
      emptyTitle: string;
      emptyDesc: string;
    };
  };
  supplier: {
    home: {
      title: string;
      subtitle: string;
      emptyTitle: string;
      emptyDesc: string;
    };
  };
  assistant: {
    panelTitle: string;
    panelSubtitle: string;
    whatsapp: string;
    startFree: string;
    startHint: string;
    ai: string;
    back: string;
    close: string;
    phoneDisplay: string;
    contactHint: string;
    placeholder: string;
    send: string;
    thinking: string;
    error: string;
    offline: string;
    greeting: string;
    limitsNotice: string;
    rateLimited: string;
    turnLimit: string;
    agentReports: string;
  };
  landing: {
    headline: string;
    support: string;
    ctaStart: string;
    ctaSignIn: string;
    storyTitle: string;
    storyBody: string;
    bringTitle: string;
    bringItems: { title: string; body: string }[];
    offerTitle: string;
    offerOwners: string;
    offerSuppliers: string;
    footerNote: string;
    footerBy: string;
    footerStudioName: string;
    footerStudio: string;
    footerGithub: string;
  };
};

const en: Messages = {
  nav: {
    signIn: "Sign in",
    register: "Register",
    signOut: "Sign out",
    home: "Home",
    properties: "Properties",
    suppliers: "Suppliers",
    tasks: "Tasks",
    myTasks: "My tasks",
    overview: "Overview",
    designSystem: "Design system",
    users: "Users",
    activity: "Activity",
    intros: "Intros",
  },
  roles: {
    admin: "Admin",
    client: "Client",
    supplier: "Supplier",
  },
  common: {
    email: "Email",
    emailPlaceholder: "you@example.com",
    sending: "Sending…",
    due: "Due {date}",
    noDueDate: "No due date",
    noAccessNotes: "No access notes",
    linked: "Linked",
    contactOnly: "Contact only",
    invalidEmail: "Enter a valid email address.",
  },
  auth: {
    signInTitle: "Sign in",
    signInSubtitle:
      "Existing accounts only. Enter the 6-digit code from your email (recommended).",
    signInError: "Sign-in failed. Request a new code or clear your session",
    otpHint: "We email a 6-digit code. Enter it on the next step (no link click needed).",
    otpSendButton: "Email me a sign-in code",
    otpSent:
      "Check your email for a 6-digit code. You can also use the link in the email.",
    otpSentLocal:
      "Check Mailpit for your code (http://127.0.0.1:54324).",
    otpSentTo: "Code sent to",
    otpCodeLabel: "Sign-in code",
    otpCodePlaceholder: "123456",
    otpCodeHint: "From your email. Expires in a few minutes.",
    otpCodeRequired: "Enter the code from your email.",
    otpVerifyButton: "Verify and sign in",
    otpResend: "Send a new code",
    otpChangeEmail: "Use a different email",
    resetSessionLink: "Stuck signing in? Clear session",
    sessionResetDone: "Session cleared. Request a new sign-in code below.",
    registerOtpHint:
      "We email a 6-digit code to finish creating your account.",
    registerOtpSendButton: "Email me a registration code",
    registerOtpVerifyButton: "Verify and finish registration",
    registerOtpSent:
      "Check your email for a 6-digit code to finish registration.",
    registerOtpSentLocal:
      "Check Mailpit for your code (http://127.0.0.1:54324).",
    magicLinkHint: "We'll email a one-time magic link. No password.",
    magicLinkButton: "Email me a magic link",
    magicLinkSent: "Check your email for the magic link.",
    magicLinkSentLocal:
      "Check Mailpit for the magic link (http://127.0.0.1:54324).",
    noAccount: "No account for this email. Create one first.",
    newHere: "New here?",
    createAccountLink: "Create an account",
    registerTitle: "Create account",
    registerSubtitle:
      "Choose Client or Supplier once. Admin access is separate and cannot be self-registered.",
    displayName: "Display name",
    displayNamePlaceholder: "Maria",
    registerMagicHint: "We'll email a magic link to finish creating your account.",
    personaLegend: "I am a…",
    clientTitle: "Client",
    clientDesc:
      "Property owner — manage properties and send tasks to suppliers.",
    supplierTitle: "Supplier",
    supplierDesc:
      "Local provider — receive tasks, leave handoff notes and photos.",
    createAccountButton: "Create account",
    registerMagicSent: "Account link sent. Check your email to finish registration.",
    registerMagicSentLocal:
      "Account link sent. Open Mailpit (http://127.0.0.1:54324) to finish registration.",
    adminEmailReserved: "This email is reserved for admin. Use Sign in instead.",
    choosePersona: "Choose whether you are a Client (property owner) or a Supplier.",
    alreadyHaveAccount: "Already have an account?",
  },
  admin: {
    title: "Admin",
    subtitle: "Platform overview. Design system is available only here.",
    statClients: "Clients",
    statSuppliers: "Suppliers",
    statProperties: "Properties",
    openDesignSystem: "Open design system →",
    browseProperties: "Browse properties →",
    users: {
      title: "Users",
      subtitle: "All registered accounts across the platform.",
      empty: "No users yet.",
      colName: "Name",
      colEmail: "Email",
      colRole: "Role",
      colLanguage: "Language",
      colJoined: "Joined",
      unnamed: "Unnamed",
      noEmail: "No email",
    },
    activity: {
      title: "Activity",
      subtitle: "Recent task events across all clients.",
      empty: "No activity yet.",
      unknownTask: "Unknown task",
    },
    intros: {
      title: "Intros",
      subtitle:
        "Draft a short introduction email between a client and supplier. Copy or send manually — nothing is saved.",
      clientLabel: "Client",
      supplierLabel: "Supplier",
      selectClient: "Select a client…",
      selectSupplier: "Select a supplier…",
      noteLabel: "Context note (optional)",
      noteHint: "Property, timing, or anything they should know upfront.",
      notePlaceholder: "e.g. Studio in Plaka, turnover every Tuesday…",
      previewLabel: "Preview",
      copy: "Copy message",
      copied: "Copied",
      emailBoth: "Email both",
      emailSubject: "Leblebee introduction",
      needBothRoles: "Need at least one client and one supplier registered.",
      unnamedClient: "Client",
      unnamedSupplier: "Supplier",
    },
  },
  client: {
    home: {
      titleHello: "Hello",
      subtitle:
        "Manage properties and suppliers. Send clear bilingual tasks — AI helps with language and clarity.",
      statProperties: "Properties",
      statSuppliers: "Suppliers",
      statOpenTasks: "Open tasks",
      newTask: "New task",
      addSupplier: "Add supplier",
      newProperty: "New property",
      emptyTitle: "Add your first property",
      emptyDesc: "Then add a supplier and send your first bilingual task.",
    },
    properties: {
      title: "Properties",
      subtitle: "Apartments you operate remotely — with notes suppliers need.",
      newProperty: "New property",
      emptyTitle: "No properties yet",
      emptyDesc: "Add the first apartment so you can create tasks against it.",
    },
    suppliers: {
      title: "Suppliers",
      subtitle: "Local people you trust — we translate when you message them.",
      addSupplier: "Add supplier",
      emptyTitle: "No suppliers yet",
      emptyDesc:
        "Add your cleaner or handyman so you can send clear bilingual tasks.",
    },
    tasks: {
      title: "Tasks",
      subtitle: "Clear bilingual instructions — less back-and-forth.",
      newTask: "New task",
      emptyTitle: "No tasks yet",
      emptyDesc: "Create a task for a supplier. AI helps clarify and translate.",
    },
  },
  supplier: {
    home: {
      title: "My tasks",
      subtitle:
        "Instructions appear in your language. Reply anytime — we translate for the owner.",
      emptyTitle: "No assigned tasks yet",
      emptyDesc: "When an owner sends you work, it shows up here.",
    },
  },
  assistant: {
    panelTitle: "Questions?",
    panelSubtitle: "Ask about Leblebee, get started, or reach Alex.",
    whatsapp: "Email Alex",
    startFree: "Start free",
    startHint: "Register as owner or supplier. Magic link, no password.",
    ai: "Ask Leblebee",
    back: "Back",
    close: "Close",
    phoneDisplay: "Free · EN / FR / EL",
    contactHint: "Email alex.gon@eliago.com for help beyond the assistant.",
    placeholder: "Ask about owners, suppliers, tasks…",
    send: "Send",
    thinking: "Thinking…",
    error: "Something went wrong. Try again or email Alex.",
    offline: "Assistant is offline right now. Use Register or email Alex.",
    greeting:
      "Hi! I can explain how Leblebee helps owners and suppliers coordinate bilingual tasks. What would you like to know?",
    limitsNotice: "Up to {max} messages per visit.",
    rateLimited: "Too many messages. Please wait a bit or email Alex.",
    turnLimit: "Message limit reached for this visit ({max}). Email Alex if you need more help.",
    agentReports: "Agent reports →",
  },
  landing: {
    headline: "Easier rental management. Better stays. More return.",
    support:
      "For apartment and house owners, and for local suppliers who juggle several owners. Simpler turnovers and repairs across languages, better stays, more return for the rental.",
    ctaStart: "Start free",
    ctaSignIn: "Sign in",
    storyTitle: "Why I built Leblebee",
    storyBody:
      "I host short-term rentals from afar. The hard part was never finding someone local. It was the daily friction: keys, linens, a broken shutter, “is it done?”, scattered across languages and chat threads. That friction costs time, quality, and reviews, for owners and for the suppliers who manage many of us at once. Leblebee makes the ops lighter both ways: owners brief clearly, suppliers know what’s expected without chasing messages, so the stay is better, and the rental earns more of what it should.",
    bringTitle: "What we bring",
    bringItems: [
      {
        title: "Simple task flow",
        body: "Create, brief, assign, follow up, without drowning in messages. Less admin for owners; less chaos for suppliers who run several properties.",
      },
      {
        title: "Bilingual briefs",
        body: "Owners write once in their language. Suppliers see a clear version in theirs, editable before it goes out.",
      },
      {
        title: "Property memory",
        body: "Access codes, materials, standard checklists, attached to each place so every turnover starts with context, not guesswork.",
      },
      {
        title: "Handoff that protects the stay",
        body: "A quick photo and note when work is done. Shared context, not surveillance, so small misses don’t become bad reviews.",
      },
    ],
    offerTitle: "A free product for both sides",
    offerOwners:
      "Apartment and house owners: manage properties and suppliers in one place, send clear work, and protect guest experience. Free to use, no credit card.",
    offerSuppliers:
      "Local suppliers who manage owners: get instructions in your language per property, confirm, do the work, and hand off cleanly, without juggling endless chat threads. Free to use.",
    footerNote: "Easier for owners and suppliers. Better stays. No surveillance theater.",
    footerBy: "By",
    footerStudioName: "Elia Studio",
    footerStudio: "elia-studio.eu",
    footerGithub: "GitHub",
  },
};

const fr: Messages = {
  nav: {
    signIn: "Connexion",
    register: "Créer un compte",
    signOut: "Déconnexion",
    home: "Accueil",
    properties: "Logements",
    suppliers: "Prestataires",
    tasks: "Tâches",
    myTasks: "Mes tâches",
    overview: "Vue d’ensemble",
    designSystem: "Design system",
    users: "Utilisateurs",
    activity: "Activité",
    intros: "Mises en relation",
  },
  roles: {
    admin: "Admin",
    client: "Client",
    supplier: "Prestataire",
  },
  common: {
    email: "E-mail",
    emailPlaceholder: "vous@exemple.com",
    sending: "Envoi…",
    due: "Échéance {date}",
    noDueDate: "Pas de date limite",
    noAccessNotes: "Pas de notes d’accès",
    linked: "Lié",
    contactOnly: "Contact seulement",
    invalidEmail: "Entrez une adresse e-mail valide.",
  },
  auth: {
    signInTitle: "Connexion",
    signInSubtitle:
      "Comptes existants uniquement. Les nouveaux clients et prestataires doivent d’abord s’inscrire.",
    signInError: "Échec de connexion. Demandez un nouveau code ou réinitialisez la session",
    otpHint:
      "Nous envoyons un code à 6 chiffres. Saisissez-le à l’étape suivante (sans cliquer sur un lien).",
    otpSendButton: "Envoyer un code de connexion",
    otpSent:
      "Consultez votre e-mail pour un code à 6 chiffres. Vous pouvez aussi utiliser le lien dans l’e-mail.",
    otpSentLocal:
      "Consultez Mailpit pour votre code (http://127.0.0.1:54324).",
    otpSentTo: "Code envoyé à",
    otpCodeLabel: "Code de connexion",
    otpCodePlaceholder: "123456",
    otpCodeHint: "Indiqué dans votre e-mail. Expire dans quelques minutes.",
    otpCodeRequired: "Entrez le code reçu par e-mail.",
    otpVerifyButton: "Vérifier et se connecter",
    otpResend: "Envoyer un nouveau code",
    otpChangeEmail: "Utiliser une autre adresse",
    resetSessionLink: "Blocage ? Réinitialiser la session",
    sessionResetDone: "Session réinitialisée. Demandez un nouveau code ci-dessous.",
    registerOtpHint:
      "Nous envoyons un code à 6 chiffres pour finaliser la création du compte.",
    registerOtpSendButton: "Envoyer un code d’inscription",
    registerOtpVerifyButton: "Vérifier et terminer l’inscription",
    registerOtpSent:
      "Consultez votre e-mail pour un code à 6 chiffres afin de finaliser l’inscription.",
    registerOtpSentLocal:
      "Consultez Mailpit pour votre code (http://127.0.0.1:54324).",
    magicLinkHint: "Nous enverrons un lien magique unique. Pas de mot de passe.",
    magicLinkButton: "Envoyer un lien magique",
    magicLinkSent: "Consultez votre e-mail pour le lien magique.",
    magicLinkSentLocal:
      "Consultez Mailpit pour le lien magique (http://127.0.0.1:54324).",
    noAccount: "Aucun compte pour cet e-mail. Créez-en un d’abord.",
    newHere: "Nouveau ici ?",
    createAccountLink: "Créer un compte",
    registerTitle: "Créer un compte",
    registerSubtitle:
      "Choisissez Client ou Prestataire une fois. L’accès admin est séparé et ne peut pas s’auto-inscrire.",
    displayName: "Nom affiché",
    displayNamePlaceholder: "Maria",
    registerMagicHint:
      "Nous enverrons un lien magique pour finaliser la création du compte.",
    personaLegend: "Je suis…",
    clientTitle: "Client",
    clientDesc:
      "Propriétaire — gérez vos logements et envoyez des tâches aux prestataires.",
    supplierTitle: "Prestataire",
    supplierDesc:
      "Prestataire local — recevez des tâches, laissez notes et photos de passation.",
    createAccountButton: "Créer un compte",
    registerMagicSent:
      "Lien envoyé. Consultez votre e-mail pour finaliser l’inscription.",
    registerMagicSentLocal:
      "Lien envoyé. Ouvrez Mailpit (http://127.0.0.1:54324) pour finaliser l’inscription.",
    adminEmailReserved:
      "Cet e-mail est réservé à l’admin. Utilisez Connexion à la place.",
    choosePersona:
      "Choisissez si vous êtes Client (propriétaire) ou Prestataire.",
    alreadyHaveAccount: "Vous avez déjà un compte ?",
  },
  admin: {
    title: "Admin",
    subtitle: "Vue plateforme. Le design system n’est disponible qu’ici.",
    statClients: "Clients",
    statSuppliers: "Prestataires",
    statProperties: "Logements",
    openDesignSystem: "Ouvrir le design system →",
    browseProperties: "Parcourir les logements →",
    users: {
      title: "Utilisateurs",
      subtitle: "Tous les comptes enregistrés sur la plateforme.",
      empty: "Aucun utilisateur pour l’instant.",
      colName: "Nom",
      colEmail: "E-mail",
      colRole: "Rôle",
      colLanguage: "Langue",
      colJoined: "Inscription",
      unnamed: "Sans nom",
      noEmail: "Pas d’e-mail",
    },
    activity: {
      title: "Activité",
      subtitle: "Événements récents sur toutes les tâches clients.",
      empty: "Aucune activité pour l’instant.",
      unknownTask: "Tâche inconnue",
    },
    intros: {
      title: "Mises en relation",
      subtitle:
        "Rédigez un court e-mail d’introduction entre un client et un prestataire. Copiez ou envoyez manuellement — rien n’est enregistré.",
      clientLabel: "Client",
      supplierLabel: "Prestataire",
      selectClient: "Choisir un client…",
      selectSupplier: "Choisir un prestataire…",
      noteLabel: "Note de contexte (optionnel)",
      noteHint: "Logement, timing, ou ce qu’ils doivent savoir d’emblée.",
      notePlaceholder: "ex. Studio à Plaka, turnover chaque mardi…",
      previewLabel: "Aperçu",
      copy: "Copier le message",
      copied: "Copié",
      emailBoth: "E-mail aux deux",
      emailSubject: "Introduction Leblebee",
      needBothRoles:
        "Il faut au moins un client et un prestataire inscrits.",
      unnamedClient: "Client",
      unnamedSupplier: "Prestataire",
    },
  },
  client: {
    home: {
      titleHello: "Bonjour",
      subtitle:
        "Gérez logements et prestataires. Envoyez des tâches bilingues claires — l’IA aide sur la langue et la clarté.",
      statProperties: "Logements",
      statSuppliers: "Prestataires",
      statOpenTasks: "Tâches ouvertes",
      newTask: "Nouvelle tâche",
      addSupplier: "Ajouter un prestataire",
      newProperty: "Nouveau logement",
      emptyTitle: "Ajoutez votre premier logement",
      emptyDesc:
        "Puis ajoutez un prestataire et envoyez votre première tâche bilingue.",
    },
    properties: {
      title: "Logements",
      subtitle:
        "Appartements gérés à distance — avec les notes dont les prestataires ont besoin.",
      newProperty: "Nouveau logement",
      emptyTitle: "Aucun logement pour l’instant",
      emptyDesc:
        "Ajoutez le premier appartement pour pouvoir créer des tâches.",
    },
    suppliers: {
      title: "Prestataires",
      subtitle:
        "Personnes de confiance sur place — nous traduisons quand vous leur écrivez.",
      addSupplier: "Ajouter un prestataire",
      emptyTitle: "Aucun prestataire pour l’instant",
      emptyDesc:
        "Ajoutez votre femme de ménage ou bricoleur pour envoyer des tâches bilingues claires.",
    },
    tasks: {
      title: "Tâches",
      subtitle: "Consignes bilingues claires — moins d’allers-retours.",
      newTask: "Nouvelle tâche",
      emptyTitle: "Aucune tâche pour l’instant",
      emptyDesc:
        "Créez une tâche pour un prestataire. L’IA aide à clarifier et traduire.",
    },
  },
  supplier: {
    home: {
      title: "Mes tâches",
      subtitle:
        "Les consignes apparaissent dans votre langue. Répondez quand vous voulez — nous traduisons pour le propriétaire.",
      emptyTitle: "Aucune tâche assignée",
      emptyDesc:
        "Quand un propriétaire vous envoie du travail, cela apparaît ici.",
    },
  },
  assistant: {
    panelTitle: "Des questions ?",
    panelSubtitle: "Demandez sur Leblebee, démarrez, ou contactez Alex.",
    whatsapp: "E-mail Alex",
    startFree: "Commencer gratuitement",
    startHint: "Inscription propriétaire ou prestataire. Lien magique, sans mot de passe.",
    ai: "Demander à Leblebee",
    back: "Retour",
    close: "Fermer",
    phoneDisplay: "Gratuit · EN / FR / EL",
    contactHint: "Écrivez à alex.gon@eliago.com au-delà de l’assistant.",
    placeholder: "Propriétaires, prestataires, tâches…",
    send: "Envoyer",
    thinking: "Réflexion…",
    error: "Un problème est survenu. Réessayez ou écrivez à Alex.",
    offline: "Assistant hors ligne. Utilisez Inscription ou e-mail Alex.",
    greeting:
      "Bonjour ! Je peux expliquer comment Leblebee aide propriétaires et prestataires à coordonner des tâches bilingues. Que voulez-vous savoir ?",
    limitsNotice: "Jusqu’à {max} messages par visite.",
    rateLimited: "Trop de messages. Patientez ou écrivez à Alex.",
    turnLimit:
      "Limite de messages atteinte ({max}). Écrivez à Alex pour plus d’aide.",
    agentReports: "Rapports agent →",
  },
  landing: {
    headline: "Gestion locative plus simple. Meilleurs séjours. Plus de rendement.",
    support:
      "Pour les propriétaires d’appartements et de maisons, et pour les prestataires locaux qui gèrent plusieurs propriétaires. Turnovers et réparations plus simples, dans chaque langue, meilleurs séjours, plus de rendement pour la location.",
    ctaStart: "Commencer gratuitement",
    ctaSignIn: "Connexion",
    storyTitle: "Pourquoi j’ai créé Leblebee",
    storyBody:
      "Je gère des locations courte durée à distance. Le vrai frein n’était pas de trouver quelqu’un sur place. C’était la friction du quotidien : clés, linge, volet cassé, « c’est fait ? », éparpillés entre langues et chats. Cette friction coûte du temps, de la qualité et des avis, aux propriétaires et aux prestataires qui gèrent plusieurs d’entre nous à la fois. Leblebee allège l’ops dans les deux sens : briefs clairs côté propriétaire, attentes nettes côté prestataire sans courir après les messages, pour un meilleur séjour, et une location qui rapporte davantage de ce qu’elle devrait.",
    bringTitle: "Ce que nous apportons",
    bringItems: [
      {
        title: "Un flux de tâches simple",
        body: "Créer, briefer, assigner, suivre, sans se noyer dans les messages. Moins d’admin pour les propriétaires ; moins de chaos pour les prestataires qui tournent sur plusieurs logements.",
      },
      {
        title: "Briefs bilingues",
        body: "Le propriétaire écrit une fois dans sa langue. Le prestataire voit une version claire dans la sienne, modifiable avant envoi.",
      },
      {
        title: "Mémoire du logement",
        body: "Codes, matériel, checklists, attachés à chaque appartement ou maison pour que chaque turnover parte avec le contexte, pas dans le flou.",
      },
      {
        title: "Une passation qui protège le séjour",
        body: "Une photo et une note quand c’est fait. Du contexte partagé, pas de surveillance, pour qu’un oubli ne devienne pas un mauvais avis.",
      },
    ],
    offerTitle: "Un produit gratuit pour les deux côtés",
    offerOwners:
      "Propriétaires d’appartements et de maisons : gérez logements et prestataires au même endroit, envoyez du travail clair, protégez l’expérience voyageur. Gratuit, sans carte bancaire.",
    offerSuppliers:
      "Prestataires locaux qui gèrent des propriétaires : consignes dans votre langue par logement, confirmation, travail, passation propre, sans jongler avec des fils de chat sans fin. Gratuit.",
    footerNote: "Plus simple pour propriétaires et prestataires. Meilleurs séjours. Pas de théâtre de surveillance.",
    footerBy: "Par",
    footerStudioName: "Elia Studio",
    footerStudio: "elia-studio.eu",
    footerGithub: "GitHub",
  },
};

const el: Messages = {
  nav: {
    signIn: "Σύνδεση",
    register: "Εγγραφή",
    signOut: "Αποσύνδεση",
    home: "Αρχική",
    properties: "Καταλύματα",
    suppliers: "Συνεργάτες",
    tasks: "Εργασίες",
    myTasks: "Οι εργασίες μου",
    overview: "Επισκόπηση",
    designSystem: "Design system",
    users: "Χρήστες",
    activity: "Δραστηριότητα",
    intros: "Συστάσεις",
  },
  roles: {
    admin: "Διαχειριστής",
    client: "Ιδιοκτήτης",
    supplier: "Συνεργάτης",
  },
  common: {
    email: "E-mail",
    emailPlaceholder: "you@example.com",
    sending: "Αποστολή…",
    due: "Προθεσμία {date}",
    noDueDate: "Χωρίς προθεσμία",
    noAccessNotes: "Χωρίς σημειώσεις πρόσβασης",
    linked: "Συνδεδεμένος",
    contactOnly: "Μόνο επαφή",
    invalidEmail: "Εισάγετε έγκυρη διεύθυνση e-mail.",
  },
  auth: {
    signInTitle: "Σύνδεση",
    signInSubtitle:
      "Μόνο υπάρχοντες λογαριασμοί. Νέοι ιδιοκτήτες και συνεργάτες πρέπει πρώτα να εγγραφούν.",
    signInError: "Η σύνδεση απέτυχε. Ζητήστε νέο κωδικό ή καθαρίστε τη συνεδρία",
    otpHint:
      "Στέλνουμε 6ψήφιο κωδικό. Εισάγετέ τον στο επόμενο βήμα (χωρίς link).",
    otpSendButton: "Στείλτε κωδικό σύνδεσης",
    otpSent:
      "Ελέγξτε το e-mail για 6ψήφιο κωδικό. Μπορείτε επίσης να χρησιμοποιήσετε το link στο e-mail.",
    otpSentLocal:
      "Ελέγξτε το Mailpit για τον κωδικό (http://127.0.0.1:54324).",
    otpSentTo: "Κωδικός στάλθηκε στο",
    otpCodeLabel: "Κωδικός σύνδεσης",
    otpCodePlaceholder: "123456",
    otpCodeHint: "Από το e-mail σας. Λήγει σε λίγα λεπτά.",
    otpCodeRequired: "Εισάγετε τον κωδικό από το e-mail.",
    otpVerifyButton: "Επαλήθευση και σύνδεση",
    otpResend: "Νέος κωδικός",
    otpChangeEmail: "Άλλο e-mail",
    resetSessionLink: "Κολλήσατε; Καθαρισμός συνεδρίας",
    sessionResetDone: "Η συνεδρία καθαρίστηκε. Ζητήστε νέο κωδικό παρακάτω.",
    registerOtpHint:
      "Στέλνουμε 6ψήφιο κωδικό για να ολοκληρώσετε τη δημιουργία λογαριασμού.",
    registerOtpSendButton: "Στείλτε κωδικό εγγραφής",
    registerOtpVerifyButton: "Επαλήθευση και ολοκλήρωση εγγραφής",
    registerOtpSent:
      "Ελέγξτε το e-mail για 6ψήφιο κωδικό ολοκλήρωσης εγγραφής.",
    registerOtpSentLocal:
      "Ελέγξτε το Mailpit για τον κωδικό (http://127.0.0.1:54324).",
    magicLinkHint: "Θα στείλουμε one-time magic link. Χωρίς κωδικό.",
    magicLinkButton: "Στείλτε magic link",
    magicLinkSent: "Ελέγξτε το e-mail σας για το magic link.",
    magicLinkSentLocal:
      "Ελέγξτε το Mailpit για το magic link (http://127.0.0.1:54324).",
    noAccount: "Δεν υπάρχει λογαριασμός για αυτό το e-mail. Δημιουργήστε πρώτα.",
    newHere: "Νέος εδώ;",
    createAccountLink: "Δημιουργία λογαριασμού",
    registerTitle: "Δημιουργία λογαριασμού",
    registerSubtitle:
      "Επιλέξτε Ιδιοκτήτης ή Συνεργάτη μία φορά. Η πρόσβαση admin είναι ξεχωριστή.",
    displayName: "Εμφανιζόμενο όνομα",
    displayNamePlaceholder: "Maria",
    registerMagicHint:
      "Θα στείλουμε magic link για να ολοκληρώσετε τη δημιουργία λογαριασμού.",
    personaLegend: "Είμαι…",
    clientTitle: "Ιδιοκτήτης",
    clientDesc:
      "Ιδιοκτήτης — διαχειριστείτε καταλύματα και στείλτε εργασίες σε συνεργάτες.",
    supplierTitle: "Συνεργάτης",
    supplierDesc:
      "Τοπικός συνεργάτης — λάβετε εργασίες, αφήστε σημειώσεις και φωτογραφίες.",
    createAccountButton: "Δημιουργία λογαριασμού",
    registerMagicSent:
      "Στάλθηκε link. Ελέγξτε το e-mail για να ολοκληρώσετε την εγγραφή.",
    registerMagicSentLocal:
      "Στάλθηκε link. Ανοίξτε το Mailpit (http://127.0.0.1:54324) για την εγγραφή.",
    adminEmailReserved:
      "Αυτό το e-mail είναι για admin. Χρησιμοποιήστε Σύνδεση.",
    choosePersona:
      "Επιλέξτε αν είστε Ιδιοκτήτης ή Συνεργάτης.",
    alreadyHaveAccount: "Έχετε ήδη λογαριασμό;",
  },
  admin: {
    title: "Διαχείριση",
    subtitle: "Επισκόπηση πλατφόρμας. Το design system είναι μόνο εδώ.",
    statClients: "Ιδιοκτήτες",
    statSuppliers: "Συνεργάτες",
    statProperties: "Καταλύματα",
    openDesignSystem: "Άνοιγμα design system →",
    browseProperties: "Περιήγηση καταλυμάτων →",
    users: {
      title: "Χρήστες",
      subtitle: "Όλοι οι εγγεγραμμένοι λογαριασμοί στην πλατφόρμα.",
      empty: "Δεν υπάρχουν χρήστες ακόμα.",
      colName: "Όνομα",
      colEmail: "E-mail",
      colRole: "Ρόλος",
      colLanguage: "Γλώσσα",
      colJoined: "Εγγραφή",
      unnamed: "Χωρίς όνομα",
      noEmail: "Χωρίς e-mail",
    },
    activity: {
      title: "Δραστηριότητα",
      subtitle: "Πρόσφατα events εργασιών από όλους τους ιδιοκτήτες.",
      empty: "Δεν υπάρχει δραστηριότητα ακόμα.",
      unknownTask: "Άγνωστη εργασία",
    },
    intros: {
      title: "Συστάσεις",
      subtitle:
        "Σύνταξη σύντομου e-mail γνωριμίας μεταξύ ιδιοκτήτη και συνεργάτη. Αντιγραφή ή αποστολή χειροκίνητα — δεν αποθηκεύεται τίποτα.",
      clientLabel: "Ιδιοκτήτης",
      supplierLabel: "Συνεργάτης",
      selectClient: "Επιλέξτε ιδιοκτήτη…",
      selectSupplier: "Επιλέξτε συνεργάτη…",
      noteLabel: "Σημείωση πλαισίου (προαιρετικό)",
      noteHint: "Κατάλυμα, χρονοδιάγραμμα, ή ό,τι πρέπει να ξέρουν.",
      notePlaceholder: "π.χ. Studio στο Plaka, turnover κάθε Τρίτη…",
      previewLabel: "Προεπισκόπηση",
      copy: "Αντιγραφή μηνύματος",
      copied: "Αντιγράφηκε",
      emailBoth: "E-mail και στους δύο",
      emailSubject: "Σύσταση Leblebee",
      needBothRoles:
        "Χρειάζεται τουλάχιστον ένας ιδιοκτήτης και ένας συνεργάτης.",
      unnamedClient: "Ιδιοκτήτης",
      unnamedSupplier: "Συνεργάτης",
    },
  },
  client: {
    home: {
      titleHello: "Γεια σας",
      subtitle:
        "Διαχειριστείτε καταλύματα και συνεργάτες. Στείλτε καθαρές δίγλωσσες εργασίες — η AI βοηθά στη γλώσσα και τη σαφήνεια.",
      statProperties: "Καταλύματα",
      statSuppliers: "Συνεργάτες",
      statOpenTasks: "Ανοιχτές εργασίες",
      newTask: "Νέα εργασία",
      addSupplier: "Προσθήκη συνεργάτη",
      newProperty: "Νέο κατάλυμα",
      emptyTitle: "Προσθέστε το πρώτο κατάλυμα",
      emptyDesc:
        "Μετά προσθέστε συνεργάτη και στείλτε την πρώτη δίγλωσση εργασία.",
    },
    properties: {
      title: "Καταλύματα",
      subtitle:
        "Διαμερίσματα που διαχειρίζεστε από μακριά — με σημειώσεις που χρειάζονται οι συνεργάτες.",
      newProperty: "Νέο κατάλυμα",
      emptyTitle: "Δεν υπάρχουν καταλύματα ακόμα",
      emptyDesc:
        "Προσθέστε το πρώτο διαμέρισμα για να δημιουργήσετε εργασίες.",
    },
    suppliers: {
      title: "Συνεργάτες",
      subtitle:
        "Αξιόπιστοι τοπικοί — μεταφράζουμε όταν τους γράφετε.",
      addSupplier: "Προσθήκη συνεργάτη",
      emptyTitle: "Δεν υπάρχουν συνεργάτες ακόμα",
      emptyDesc:
        "Προσθέστε καθαρίστρια ή τεχνίτη για καθαρές δίγλωσσες εργασίες.",
    },
    tasks: {
      title: "Εργασίες",
      subtitle: "Καθαρές δίγλωσσες οδηγίες — λιγότερα μηνύματα.",
      newTask: "Νέα εργασία",
      emptyTitle: "Δεν υπάρχουν εργασίες ακόμα",
      emptyDesc:
        "Δημιουργήστε εργασία για συνεργάτη. Η AI βοηθά στη σαφήνεια και μετάφραση.",
    },
  },
  supplier: {
    home: {
      title: "Οι εργασίες μου",
      subtitle:
        "Οι οδηγίες εμφανίζονται στη γλώσσα σας. Απαντήστε όποτε θέλετε — μεταφράζουμε για τον ιδιοκτήτη.",
      emptyTitle: "Δεν υπάρχουν ανατεθειμένες εργασίες",
      emptyDesc:
        "Όταν ένας ιδιοκτήτης σας στείλει δουλειά, εμφανίζεται εδώ.",
    },
  },
  assistant: {
    panelTitle: "Ερωτήσεις;",
    panelSubtitle: "Ρωτήστε για το Leblebee, ξεκινήστε, ή επικοινωνήστε με τον Alex.",
    whatsapp: "E-mail στον Alex",
    startFree: "Ξεκινήστε δωρεάν",
    startHint: "Εγγραφή ως ιδιοκτήτης ή συνεργάτης. Magic link, χωρίς κωδικό.",
    ai: "Ρωτήστε το Leblebee",
    back: "Πίσω",
    close: "Κλείσιμο",
    phoneDisplay: "Δωρεάν · EN / FR / EL",
    contactHint: "Γράψτε στο alex.gon@eliago.com πέρα από τον βοηθό.",
    placeholder: "Ιδιοκτήτες, συνεργάτες, εργασίες…",
    send: "Αποστολή",
    thinking: "Σκέψη…",
    error: "Κάτι πήγε στραβά. Δοκιμάστε ξανά ή γράψτε στον Alex.",
    offline: "Ο βοηθός είναι εκτός. Χρησιμοποιήστε Εγγραφή ή e-mail Alex.",
    greeting:
      "Γεια! Μπορώ να εξηγήσω πώς το Leblebee βοηθά ιδιοκτήτες και συνεργάτες με δίγλωσσες εργασίες. Τι θέλετε να μάθετε;",
    limitsNotice: "Έως {max} μηνύματα ανά επίσκεψη.",
    rateLimited: "Πολλά μηνύματα. Περιμένετε ή γράψτε στον Alex.",
    turnLimit:
      "Φτάσατε το όριο μηνυμάτων ({max}). Γράψτε στον Alex για περισσότερη βοήθεια.",
    agentReports: "Αναφορές agent →",
  },
  landing: {
    headline: "Πιο εύκολη διαχείριση. Καλύτερες διαμονές. Περισσότερη απόδοση.",
    support:
      "Για ιδιοκτήτες διαμερισμάτων και σπιτιών, και για τοπικούς συνεργάτες που διαχειρίζονται πολλούς ιδιοκτήτες. Πιο απλά turnovers και επισκευές σε κάθε γλώσσα, καλύτερες διαμονές, περισσότερη απόδοση για το κατάλυμα.",
    ctaStart: "Ξεκινήστε δωρεάν",
    ctaSignIn: "Σύνδεση",
    storyTitle: "Γιατί έφτιαξα το Leblebee",
    storyBody:
      "Διαχειρίζομαι βραχυχρόνιες μισθώσεις από μακριά. Το δύσκολο δεν ήταν να βρω κάποιον τοπικά. Ήταν η καθημερινή τριβή: κλειδιά, λινά, σπαστό παντζούρι, «έγινε;», σκορπισμένα σε γλώσσες και chats. Αυτή η τριβή κοστίζει χρόνο, ποιότητα και κριτικές, στους ιδιοκτήτες και στους συνεργάτες που διαχειρίζονται πολλούς από εμάς μαζί. Το Leblebee ελαφρύνει την ops και από τις δύο πλευρές: καθαρά briefs από τον ιδιοκτήτη, ξεκάθαρες προσδοκίες για τον συνεργάτη χωρίς κυνήγι μηνυμάτων, για καλύτερη διαμονή, και ένα κατάλυμα που κερδίζει περισσότερα από όσα του αναλογούν.",
    bringTitle: "Τι προσφέρουμε",
    bringItems: [
      {
        title: "Απλή ροή εργασιών",
        body: "Δημιουργία, briefing, ανάθεση, follow-up, χωρίς να πνίγεστε στα μηνύματα. Λιγότερο admin για ιδιοκτήτες· λιγότερο χάος για συνεργάτες που τρέχουν πολλά καταλύματα.",
      },
      {
        title: "Δίγλωσσα briefs",
        body: "Ο ιδιοκτήτης γράφει μία φορά στη γλώσσα του. Ο συνεργάτης βλέπει καθαρή έκδοση στη δική του, επεξεργάσιμη πριν σταλεί.",
      },
      {
        title: "Μνήμη καταλύματος",
        body: "Κωδικοί, υλικά, βασικές λίστες, δεμένα σε κάθε διαμέρισμα ή σπίτι ώστε κάθε turnover να ξεκινά με πλαίσιο, όχι με εικασίες.",
      },
      {
        title: "Παράδοση που προστατεύει τη διαμονή",
        body: "Μια φωτογραφία και μια σημείωση όταν τελειώνει η δουλειά. Κοινό πλαίσιο, όχι επιτήρηση, για να μη γίνουν μικρά κενά κακές κριτικές.",
      },
    ],
    offerTitle: "Δωρεάν προϊόν και για τις δύο πλευρές",
    offerOwners:
      "Ιδιοκτήτες διαμερισμάτων και σπιτιών: διαχειριστείτε καταλύματα και συνεργάτες σε ένα μέρος, στείλτε καθαρή δουλειά, προστατέψτε την εμπειρία επισκέπτη. Δωρεάν, χωρίς κάρτα.",
    offerSuppliers:
      "Τοπικοί συνεργάτες που διαχειρίζονται ιδιοκτήτες: οδηγίες στη γλώσσα σας ανά κατάλυμα, επιβεβαίωση, δουλειά, καθαρή παράδοση, χωρίς ατελείωτα chat threads. Δωρεάν.",
    footerNote: "Πιο εύκολο για ιδιοκτήτες και συνεργάτες. Καλύτερες διαμονές. Όχι θέατρο επιτήρησης.",
    footerBy: "Από",
    footerStudioName: "Elia Studio",
    footerStudio: "elia-studio.eu",
    footerGithub: "GitHub",
  },
};

const catalog: Record<Locale, Messages> = { en, fr, el };

export function getMessages(locale: Locale): Messages {
  return catalog[locale];
}

export function formatDueLabel(
  dueAt: string | null,
  locale: Locale,
  t: Messages,
): string {
  if (!dueAt) return t.common.noDueDate;
  const date = new Date(dueAt).toLocaleString(locale);
  return t.common.due.replace("{date}", date);
}
