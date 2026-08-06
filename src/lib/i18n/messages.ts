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
  };
  roles: {
    admin: string;
    client: string;
    supplier: string;
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
  },
  roles: {
    admin: "Admin",
    client: "Client",
    supplier: "Supplier",
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
  },
  roles: {
    admin: "Admin",
    client: "Client",
    supplier: "Prestataire",
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
  },
  roles: {
    admin: "Διαχειριστής",
    client: "Ιδιοκτήτης",
    supplier: "Συνεργάτης",
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
