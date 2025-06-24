import { Language } from '../hooks/useTranslation';

// Translation keys organized by feature/component
export interface Translations {
  // Common
  common: {
    save: string;
    cancel: string;
    close: string;
    loading: string;
    error: string;
    success: string;
    confirm: string;
    back: string;
    next: string;
    home: string;
    menu: string;
    cart: string;
    total: string;
    price: string;
    quantity: string;
    order: string;
    restaurant: string;
    table: string;
    time: string;
    minutes: string;
    euro: string;
    tryAgain: string;
    refresh: string;
  };

  // Navigation
  nav: {
    scanQR: string;
    viewMenu: string;
    myOrders: string;
    profile: string;
    settings: string;
    logout: string;
    language: string;
  };

  // QR Landing
  qrLanding: {
    validating: string;
    success: string;
    invalidCode: string;
    restaurantInfo: string;
    tableInfo: string;
    walkInCustomer: string;
    callWaiter: string;
    addToHomeScreen: string;
    viewMenuAndOrder: string;
    openingHours: string;
    everyDay: string;
    tips: {
      title: string;
      addToHome: string;
      useWifi: string;
      contactStaff: string;
    };
    walkInTips: {
      title: string;
      payAtCounter: string;
      chooseTable: string;
      contactStaff: string;
    };
  };

  // Menu
  menu: {
    searchPlaceholder: string;
    filters: string;
    clearAll: string;
    categories: {
      all: string;
    };
    dietary: {
      title: string;
      all: string;
      vegetarian: string;
      vegan: string;
    };
    availability: {
      title: string;
      all: string;
      available: string;
      unavailable: string;
    };
    priceRange: {
      title: string;
      all: string;
      low: string;
      medium: string;
      high: string;
    };
    sorting: {
      title: string;
      recommended: string;
      priceLow: string;
      priceHigh: string;
      popular: string;
    };
    addToCart: string;
    notAvailable: string;
    estimatedTime: string;
    emptyMenu: {
      title: string;
      description: string;
      contactStaff: string;
    };
    noResults: {
      title: string;
      description: string;
      clearFilters: string;
    };
  };

  // Cart
  cart: {
    title: string;
    empty: {
      title: string;
      description: string;
      exploreMenu: string;
    };
    orderSummary: string;
    items: string;
    estimatedTime: string;
    specialInstructions: string;
    instructionsPlaceholder: string;
    paymentMethod: string;
    submitOrder: string;
    submitting: string;
    orderSuccess: string;
    createAccount: {
      title: string;
      description: string;
      create: string;
    };
    welcomeBack: string;
    firstOrder: string;
    previousOrders: string;
  };

  // Payment
  payment: {
    cash: string;
    card: string;
    digital: string;
    cashDescription: string;
    cardDescription: string;
    digitalDescription: string;
    minimumOrder: string;
    processingFee: string;
    onlyMethod: string;
  };

  // Order Tracking
  orderTracking: {
    title: string;
    orderNotFound: string;
    status: {
      new: string;
      accepted: string;
      preparing: string;
      ready: string;
      served: string;
      cancelled: string;
    };
    progress: {
      title: string;
      newOrder: string;
      accepted: string;
      preparing: string;
      ready: string;
      descriptions: {
        new: string;
        accepted: string;
        preparing: string;
        ready: string;
      };
    };
    orderItems: string;
    callWaiter: string;
    orderAgain: string;
    ready: {
      title: string;
      description: string;
    };
    rating: {
      title: string;
      thanks: string;
    };
  };

  // Waiter Call
  waiterCall: {
    call: string;
    called: string;
    alreadyCalled: string;
    success: string;
    waitingForWaiter: string;
    estimatedArrival: string;
    reset: string;
    resetSuccess: string;
  };

  // Auth
  auth: {
    login: string;
    signup: string;
    email: string;
    password: string;
    name: string;
    phone: string;
    welcomeBack: string;
    createAccount: string;
    guestCheckout: string;
    continueAsGuest: string;
    haveAccount: string;
    benefits: {
      title: string;
      orderHistory: string;
      favorites: string;
      exclusiveOffers: string;
      personalizedProfile: string;
    };
    errors: {
      invalidEmail: string;
      shortPassword: string;
      loginFailed: string;
    };
  };

  // Restaurant Dashboard
  dashboard: {
    title: string;
    orders: string;
    settings: string;
    stats: {
      ordersToday: string;
      revenueToday: string;
      pending: string;
      averageTime: string;
    };
    filters: {
      all: string;
      new: string;
      accepted: string;
      preparing: string;
      ready: string;
    };
    actions: {
      accept: string;
      reject: string;
      startCooking: string;
      markReady: string;
      served: string;
    };
    paymentSettings: {
      title: string;
      description: string;
      methods: string;
      defaultMethod: string;
      cardSettings: string;
      minimumOrder: string;
      processingFee: string;
      warning: string;
      saveChanges: string;
    };
  };

  // Errors
  errors: {
    networkError: {
      title: string;
      description: string;
      offline: string;
      serverIssue: string;
      troubleshooting: string;
      steps: {
        checkConnection: string;
        refresh: string;
        contactSupport: string;
      };
    };
    restaurantClosed: {
      title: string;
      description: string;
      openingHours: string;
      contact: string;
    };
    invalidQR: {
      title: string;
      description: string;
    };
  };

  // User Selection (Demo)
  userSelection: {
    title: string;
    subtitle: string;
    demoUsers: string;
    userFlows: string;
    errorTesting: string;
    currentUser: string;
    notLoggedIn: string;
    guestMode: string;
    logout: string;
    authenticated: string;
    scenarios: {
      customerQR: string;
      walkIn: string;
      browseDirect: string;
      returning: string;
      staff: string;
      admin: string;
      kitchen: string;
    };
    badges: {
      mostCommon: string;
      walkIn: string;
      directAccess: string;
      hasHistory: string;
      staff: string;
      admin: string;
      kitchen: string;
      newCustomer: string;
      regular: string;
      vip: string;
    };
  };
}

// Albanian translations (default)
const sq: Translations = {
  common: {
    save: 'Ruaj',
    cancel: 'Anulo',
    close: 'Mbyll',
    loading: 'Duke ngarkuar...',
    error: 'Gabim',
    success: 'Sukses',
    confirm: 'Konfirmo',
    back: 'Mbrapa',
    next: 'Tjetër',
    home: 'Shtëpia',
    menu: 'Menuja',
    cart: 'Porosia',
    total: 'Total',
    price: 'Çmimi',
    quantity: 'Sasia',
    order: 'Porosi',
    restaurant: 'Restorant',
    table: 'Tavolinë',
    time: 'Koha',
    minutes: 'min',
    euro: '€',
    tryAgain: 'Provo Përsëri',
    refresh: 'Rifresko'
  },
  nav: {
    scanQR: 'Skano QR',
    viewMenu: 'Shiko Menunë',
    myOrders: 'Porositë e Mia',
    profile: 'Profili',
    settings: 'Cilësimet',
    logout: 'Dil',
    language: 'Gjuha'
  },
  qrLanding: {
    validating: 'Duke kontrolluar QR kodin...',
    success: 'QR kodi u validua me sukses në Urdhëro!',
    invalidCode: 'QR kod i pavlefshëm',
    restaurantInfo: 'Informacion restoranti',
    tableInfo: 'Informacion tavoline',
    walkInCustomer: 'Klient Walk-in',
    callWaiter: 'Thirr Kamarierin',
    addToHomeScreen: 'Shto Urdhëro në Ekranin Kryesor',
    viewMenuAndOrder: 'Shiko Menunë dhe Urdhëro',
    openingHours: 'Orari i Punës',
    everyDay: 'Çdo ditë të javës',
    tips: {
      title: 'Këshillë për Experience më të Mirë me Urdhëro:',
      addToHome: 'Shtoni Urdhëro në ekranin kryesor për qasje të shpejtë',
      useWifi: 'Përdorni Wi-Fi falas të restorantit për përvojë më të shpejtë',
      contactStaff: 'Thirreni kamarierin nëse keni pyetje specifike'
    },
    walkInTips: {
      title: 'Udhëzime për Walk-in në Urdhëro:',
      payAtCounter: 'Paguani direkt në kasa ose pritni kamarierin në tavolinë',
      chooseTable: 'Mund të zgjidhni tavolinë të lirë ose të prisni për vendosje',
      contactStaff: 'Thirreni personalin nëse keni nevojë për ndihmë'
    }
  },
  menu: {
    searchPlaceholder: 'Kërko në menu...',
    filters: 'Filtrat',
    clearAll: 'Pastro të gjitha',
    categories: {
      all: 'Të gjitha'
    },
    dietary: {
      title: 'Preferencat ushqimore',
      all: 'Të gjitha',
      vegetarian: 'Vegetariane',
      vegan: 'Vegan'
    },
    availability: {
      title: 'Disponueshmëria',
      all: 'Të gjitha',
      available: 'Të gatshme',
      unavailable: 'Jo të gatshme'
    },
    priceRange: {
      title: 'Çmimi',
      all: 'Të gjitha',
      low: '< 5€',
      medium: '5-12€',
      high: '> 12€'
    },
    sorting: {
      title: 'Renditja',
      recommended: 'E rekomanduar',
      priceLow: 'Çmimi: Nga më i ulëti',
      priceHigh: 'Çmimi: Nga më i larti',
      popular: 'Më të popullarit'
    },
    addToCart: 'Shto',
    notAvailable: 'Jo i gatshëm',
    estimatedTime: 'Koha e vlerësuar',
    emptyMenu: {
      title: 'Menuja është bosh',
      description: 'Ky restorant nuk ka shtuar ende artikuj në menu.',
      contactStaff: 'Kontakto Personalin'
    },
    noResults: {
      title: 'Asnjë rezultat',
      description: 'Nuk u gjetën artikuj për filtrat e zgjedhur.',
      clearFilters: 'Pastro filtrat'
    }
  },
  cart: {
    title: 'Porosia',
    empty: {
      title: 'Porosia është bosh',
      description: 'Kur të shtosh artikuj nga menuja, ato do të shfaqen këtu.',
      exploreMenu: 'Eksploro Menunë'
    },
    orderSummary: 'Përmbledhje porosie',
    items: 'artikuj',
    estimatedTime: 'Koha e vlerësuar',
    specialInstructions: 'Instruksione Speciale',
    instructionsPlaceholder: 'Shto komente për porosinë (opsionale)...',
    paymentMethod: 'Metoda e Pagesës',
    submitOrder: 'Urdhëro Tani',
    submitting: 'Duke urdhëruar...',
    orderSuccess: 'Porosia u urdhërua me sukses!',
    createAccount: {
      title: 'Krijo llogari Urdhëro për përfitime',
      description: 'Histori porosish, artikuj të preferuar dhe më shumë',
      create: 'Krijo'
    },
    welcomeBack: 'Mirë se erdhe në Urdhëro',
    firstOrder: 'Porosia e parë në Urdhëro',
    previousOrders: 'porosi të mëparshme'
  },
  payment: {
    cash: 'Kesh',
    card: 'Kartë',
    digital: 'Digjitale',
    cashDescription: 'Pagesa me para fizike',
    cardDescription: 'Kartë debiti/kredit',
    digitalDescription: 'Apple Pay, Google Pay',
    minimumOrder: 'Porosi minimale për kartë',
    processingFee: 'Taksa procesimi kartë',
    onlyMethod: 'E vetmja metodë e disponueshme'
  },
  orderTracking: {
    title: 'Ndjekja e Porosisë Urdhëro',
    orderNotFound: 'Porosia nuk u gjet',
    status: {
      new: 'E re',
      accepted: 'Pranuar',
      preparing: 'Duke u përgatitur',
      ready: 'Gati',
      served: 'Shërbyer',
      cancelled: 'Anulluar'
    },
    progress: {
      title: 'Progresi i Porosisë',
      newOrder: 'Porosi e re',
      accepted: 'Pranuar',
      preparing: 'Duke u përgatitur',
      ready: 'Gati',
      descriptions: {
        new: 'Porosia u urdhërua me sukses përmes Urdhëro',
        accepted: 'Restoranti pranoi porosinë tuaj',
        preparing: 'Kuzhina po përgatit porosinë tuaj',
        ready: 'Porosia është gati për shërbim'
      }
    },
    orderItems: 'Artikujt e Urdhëruar',
    callWaiter: 'Thirr Kamarierin',
    orderAgain: 'Urdhëro Sërish',
    ready: {
      title: 'Porosia është gati! 🍽️',
      description: 'Mund ta merrni nga tavolina juaj'
    },
    rating: {
      title: 'Si ishte eksperienca juaj me Urdhëro?',
      thanks: 'Faleminderit për feedback-un tuaj!'
    }
  },
  waiterCall: {
    call: 'Thirr Kamarierin',
    called: 'Kamarierin është thirrur',
    alreadyCalled: 'Kamarierin është thirrur tashmë për këtë tavolinë',
    success: 'Kamarierin është thirrur me sukses përmes Urdhëro!',
    waitingForWaiter: 'Duke pritur kamarierin...',
    estimatedArrival: 'Koha e vlerësuar e arritjes',
    reset: 'Rivendos',
    resetSuccess: 'Thirrja u rivendos'
  },
  auth: {
    login: 'Hyr në Urdhëro',
    signup: 'Regjistrohuni në Urdhëro',
    email: 'Email',
    password: 'Fjalëkalimi',
    name: 'Emri i plotë',
    phone: 'Telefon',
    welcomeBack: 'Mirë se erdhe përsëri në Urdhëro!',
    createAccount: 'Krijo Llogari Urdhëro',
    guestCheckout: 'Vazhdo si Vizitor',
    continueAsGuest: 'Vazhdo si vizitor',
    haveAccount: 'Kam një llogari Urdhëro',
    benefits: {
      title: 'Krijo Llogari Urdhëro për Përfitime Ekstra',
      orderHistory: 'Histori porosish',
      favorites: 'Artikuj të preferuar',
      exclusiveOffers: 'Ofertat ekskluzive',
      personalizedProfile: 'Profil i personalizuar'
    },
    errors: {
      invalidEmail: 'Format i email-it nuk është i vlefshëm',
      shortPassword: 'Fjalëkalimi duhet të ketë të paktën 6 karaktere',
      loginFailed: 'Email ose fjalëkalim i pasaktë'
    }
  },
  dashboard: {
    title: 'Dashboard Urdhëro për Restorante',
    orders: 'Porositë',
    settings: 'Cilësimet',
    stats: {
      ordersToday: 'Porosi sot',
      revenueToday: 'Shitje sot',
      pending: 'Në pritje',
      averageTime: 'Koha mesatare'
    },
    filters: {
      all: 'Të gjitha',
      new: 'Të reja',
      accepted: 'Pranuar',
      preparing: 'Në përgatitje',
      ready: 'Gati'
    },
    actions: {
      accept: 'Prano',
      reject: 'Refuzo',
      startCooking: 'Fillo Përgatitjen',
      markReady: 'Shëno Gati',
      served: 'Shërbyer'
    },
    paymentSettings: {
      title: 'Cilësimet e Pagesës Urdhëro',
      description: 'Menaxhoni metodat e pagesës që pranohen në restorantin tuaj përmes Urdhëro',
      methods: 'Metodat e Pagesës',
      defaultMethod: 'Metoda e Parazgjedhur',
      cardSettings: 'Cilësimet e Kartës',
      minimumOrder: 'Porosia Minimale për Kartë',
      processingFee: 'Taksa e Procesimit (%)',
      warning: 'Keni vetëm një metodë pagese aktive. Rekomandojmë të aktivizoni të paktën dy metoda.',
      saveChanges: 'Ruaj Ndryshimet'
    }
  },
  errors: {
    networkError: {
      title: 'Asnjë Lidhje Interneti',
      description: 'Duket se nuk keni lidhje me internetin.',
      offline: 'Jo të lidhur',
      serverIssue: 'Problem me Serverit e Urdhëro',
      troubleshooting: 'Hapa për të zgjidhur problemin:',
      steps: {
        checkConnection: 'Kontrolloni lidhjen tuaj me internetin',
        refresh: 'Provoni të rifreskoni faqen',
        contactSupport: 'Nëse problemi vazhdon, kontaktoni mbështetjen e Urdhëro'
      }
    },
    restaurantClosed: {
      title: 'Restoranti është mbyllur',
      description: 'Na vjen keq, por restoranti aktualisht është mbyllur.',
      openingHours: 'Orari i Punës',
      contact: 'Kontakto Restorantin'
    },
    invalidQR: {
      title: 'QR Kod i Pavlefshëm',
      description: 'QR kodi që skanuat nuk është i vlefshëm ose ka skaduar.'
    }
  },
  userSelection: {
    title: 'Urdhëro Demo',
    subtitle: 'Zgjidhni llojin e përdoruesit për të përjetuar platformën e plotë të urdhërimit në restorante.',
    demoUsers: 'Hyrje e Shpejtë si Përdorues Demo',
    userFlows: 'Zgjidhni Rrjedhen e Përdoruesit',
    errorTesting: 'Testimi i Gabimeve dhe Rasteve Kufitare',
    currentUser: 'Aktualisht i lidhur si',
    notLoggedIn: 'Nuk jeni të lidhur',
    guestMode: 'Modaliteti Vizitor',
    logout: 'Dil',
    authenticated: 'I autentifikuar',
    scenarios: {
      customerQR: 'Klient me Kod QR',
      walkIn: 'Klient Walk-in',
      browseDirect: 'Shfleto Menunë Direkt',
      returning: 'Klient që Kthehet',
      staff: 'Staff Restoranti',
      admin: 'Menaxher Restoranti',
      kitchen: 'Ekrani i Kuzhinës'
    },
    badges: {
      mostCommon: 'Më i Zakonshëm',
      walkIn: 'Walk-in',
      directAccess: 'Qasje Direkte',
      hasHistory: 'Ka Histori',
      staff: 'Staff',
      admin: 'Admin',
      kitchen: 'Kuzhina',
      newCustomer: 'Klient i Ri',
      regular: 'I Rregullt',
      vip: 'VIP'
    }
  }
};

// English translations
const en: Translations = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    home: 'Home',
    menu: 'Menu',
    cart: 'Cart',
    total: 'Total',
    price: 'Price',
    quantity: 'Quantity',
    order: 'Order',
    restaurant: 'Restaurant',
    table: 'Table',
    time: 'Time',
    minutes: 'min',
    euro: '€',
    tryAgain: 'Try Again',
    refresh: 'Refresh'
  },
  nav: {
    scanQR: 'Scan QR',
    viewMenu: 'View Menu',
    myOrders: 'My Orders',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    language: 'Language'
  },
  qrLanding: {
    validating: 'Checking QR code...',
    success: 'QR code validated successfully on Urdhëro!',
    invalidCode: 'Invalid QR code',
    restaurantInfo: 'Restaurant information',
    tableInfo: 'Table information',
    walkInCustomer: 'Walk-in Customer',
    callWaiter: 'Call Waiter',
    addToHomeScreen: 'Add Urdhëro to Home Screen',
    viewMenuAndOrder: 'View Menu and Order with Urdhëro',
    openingHours: 'Opening Hours',
    everyDay: 'Every day',
    tips: {
      title: 'Tips for Better Experience with Urdhëro:',
      addToHome: 'Add Urdhëro to home screen for quick access',
      useWifi: 'Use restaurant\'s free Wi-Fi for faster experience',
      contactStaff: 'Call waiter if you have specific questions'
    },
    walkInTips: {
      title: 'Walk-in Instructions with Urdhëro:',
      payAtCounter: 'Pay directly at counter or wait for waiter at table',
      chooseTable: 'You can choose a free table or wait for seating',
      contactStaff: 'Call staff if you need assistance'
    }
  },
  menu: {
    searchPlaceholder: 'Search menu...',
    filters: 'Filters',
    clearAll: 'Clear all',
    categories: {
      all: 'All'
    },
    dietary: {
      title: 'Dietary preferences',
      all: 'All',
      vegetarian: 'Vegetarian',
      vegan: 'Vegan'
    },
    availability: {
      title: 'Availability',
      all: 'All',
      available: 'Available',
      unavailable: 'Unavailable'
    },
    priceRange: {
      title: 'Price',
      all: 'All',
      low: '< €5',
      medium: '€5-12',
      high: '> €12'
    },
    sorting: {
      title: 'Sort by',
      recommended: 'Recommended',
      priceLow: 'Price: Low to High',
      priceHigh: 'Price: High to Low',
      popular: 'Most Popular'
    },
    addToCart: 'Add',
    notAvailable: 'Not available',
    estimatedTime: 'Estimated time',
    emptyMenu: {
      title: 'Menu is empty',
      description: 'This restaurant hasn\'t added menu items yet.',
      contactStaff: 'Contact Staff'
    },
    noResults: {
      title: 'No results',
      description: 'No items found for selected filters.',
      clearFilters: 'Clear filters'
    }
  },
  cart: {
    title: 'Cart',
    empty: {
      title: 'Cart is empty',
      description: 'When you add items from menu, they will appear here.',
      exploreMenu: 'Explore Menu'
    },
    orderSummary: 'Order summary',
    items: 'items',
    estimatedTime: 'Estimated time',
    specialInstructions: 'Special Instructions',
    instructionsPlaceholder: 'Add comments for the order (optional)...',
    paymentMethod: 'Payment Method',
    submitOrder: 'Order Now with Urdhëro',
    submitting: 'Ordering...',
    orderSuccess: 'Order placed successfully with Urdhëro!',
    createAccount: {
      title: 'Create Urdhëro account for benefits',
      description: 'Order history, favorites and more',
      create: 'Create'
    },
    welcomeBack: 'Welcome back to Urdhëro',
    firstOrder: 'First order on Urdhëro',
    previousOrders: 'previous orders'
  },
  payment: {
    cash: 'Cash',
    card: 'Card',
    digital: 'Digital',
    cashDescription: 'Physical cash payment',
    cardDescription: 'Debit/Credit card',
    digitalDescription: 'Apple Pay, Google Pay',
    minimumOrder: 'Minimum order for card',
    processingFee: 'Card processing fee',
    onlyMethod: 'Only available method'
  },
  orderTracking: {
    title: 'Urdhëro Order Tracking',
    orderNotFound: 'Order not found',
    status: {
      new: 'New',
      accepted: 'Accepted',
      preparing: 'Preparing',
      ready: 'Ready',
      served: 'Served',
      cancelled: 'Cancelled'
    },
    progress: {
      title: 'Order Progress',
      newOrder: 'New order',
      accepted: 'Accepted',
      preparing: 'Preparing',
      ready: 'Ready',
      descriptions: {
        new: 'Order placed successfully via Urdhëro',
        accepted: 'Restaurant accepted your order',
        preparing: 'Kitchen is preparing your order',
        ready: 'Order is ready for service'
      }
    },
    orderItems: 'Ordered Items',
    callWaiter: 'Call Waiter',
    orderAgain: 'Order Again',
    ready: {
      title: 'Order is ready! 🍽️',
      description: 'You can pick it up from your table'
    },
    rating: {
      title: 'How was your Urdhëro experience?',
      thanks: 'Thank you for your feedback!'
    }
  },
  waiterCall: {
    call: 'Call Waiter',
    called: 'Waiter Called',
    alreadyCalled: 'Waiter has already been called for this table',
    success: 'Waiter called successfully via Urdhëro!',
    waitingForWaiter: 'Waiting for waiter...',
    estimatedArrival: 'Estimated arrival time',
    reset: 'Reset',
    resetSuccess: 'Call reset'
  },
  auth: {
    login: 'Login to Urdhëro',
    signup: 'Sign Up for Urdhëro',
    email: 'Email',
    password: 'Password',
    name: 'Full name',
    phone: 'Phone',
    welcomeBack: 'Welcome back to Urdhëro!',
    createAccount: 'Create Urdhëro Account',
    guestCheckout: 'Continue as Guest',
    continueAsGuest: 'Continue as guest',
    haveAccount: 'I have an Urdhëro account',
    benefits: {
      title: 'Create Urdhëro Account for Extra Benefits',
      orderHistory: 'Order history',
      favorites: 'Favorite items',
      exclusiveOffers: 'Exclusive offers',
      personalizedProfile: 'Personalized profile'
    },
    errors: {
      invalidEmail: 'Invalid email format',
      shortPassword: 'Password must be at least 6 characters',
      loginFailed: 'Invalid email or password'
    }
  },
  dashboard: {
    title: 'Urdhëro Restaurant Dashboard',
    orders: 'Orders',
    settings: 'Settings',
    stats: {
      ordersToday: 'Orders today',
      revenueToday: 'Revenue today',
      pending: 'Pending',
      averageTime: 'Average time'
    },
    filters: {
      all: 'All',
      new: 'New',
      accepted: 'Accepted',
      preparing: 'Preparing',
      ready: 'Ready'
    },
    actions: {
      accept: 'Accept',
      reject: 'Reject',
      startCooking: 'Start Cooking',
      markReady: 'Mark Ready',
      served: 'Served'
    },
    paymentSettings: {
      title: 'Urdhëro Payment Settings',
      description: 'Manage payment methods accepted at your restaurant via Urdhëro',
      methods: 'Payment Methods',
      defaultMethod: 'Default Method',
      cardSettings: 'Card Settings',
      minimumOrder: 'Minimum Order for Card',
      processingFee: 'Processing Fee (%)',
      warning: 'You have only one payment method active. We recommend enabling at least two methods.',
      saveChanges: 'Save Changes'
    }
  },
  errors: {
    networkError: {
      title: 'No Internet Connection',
      description: 'It looks like you don\'t have an internet connection.',
      offline: 'Offline',
      serverIssue: 'Urdhëro Server Issue',
      troubleshooting: 'Troubleshooting steps:',
      steps: {
        checkConnection: 'Check your internet connection',
        refresh: 'Try refreshing the page',
        contactSupport: 'If the problem persists, contact Urdhëro support'
      }
    },
    restaurantClosed: {
      title: 'Restaurant is closed',
      description: 'Sorry, but the restaurant is currently closed.',
      openingHours: 'Opening Hours',
      contact: 'Contact Restaurant'
    },
    invalidQR: {
      title: 'Invalid QR Code',
      description: 'The QR code you scanned is invalid or has expired.'
    }
  },
  userSelection: {
    title: 'Urdhëro Demo',
    subtitle: 'Choose your user type to experience the complete Urdhëro restaurant ordering platform.',
    demoUsers: 'Quick Login as Demo User',
    userFlows: 'Choose User Flow',
    errorTesting: 'Error & Edge Case Testing',
    currentUser: 'Currently logged in as',
    notLoggedIn: 'Not logged in',
    guestMode: 'Guest Mode',
    logout: 'Logout',
    authenticated: 'Authenticated',
    scenarios: {
      customerQR: 'Customer with QR Code',
      walkIn: 'Walk-in Customer',
      browseDirect: 'Browse Menu Directly',
      returning: 'Returning Customer',
      staff: 'Restaurant Staff',
      admin: 'Restaurant Manager',
      kitchen: 'Kitchen Display'
    },
    badges: {
      mostCommon: 'Most Common',
      walkIn: 'Walk-in',
      directAccess: 'Direct Access',
      hasHistory: 'Has History',
      staff: 'Staff',
      admin: 'Admin',
      kitchen: 'Kitchen',
      newCustomer: 'New Customer',
      regular: 'Regular',
      vip: 'VIP'
    }
  }
};

// Italian translations
const it: Translations = {
  common: {
    save: 'Salva',
    cancel: 'Annulla',
    close: 'Chiudi',
    loading: 'Caricamento...',
    error: 'Errore',
    success: 'Successo',
    confirm: 'Conferma',
    back: 'Indietro',
    next: 'Avanti',
    home: 'Home',
    menu: 'Menu',
    cart: 'Carrello',
    total: 'Totale',
    price: 'Prezzo',
    quantity: 'Quantità',
    order: 'Ordine',
    restaurant: 'Ristorante',
    table: 'Tavolo',
    time: 'Tempo',
    minutes: 'min',
    euro: '€',
    tryAgain: 'Riprova',
    refresh: 'Aggiorna'
  },
  nav: {
    scanQR: 'Scansiona QR',
    viewMenu: 'Vedi Menu',
    myOrders: 'I Miei Ordini',
    profile: 'Profilo',
    settings: 'Impostazioni',
    logout: 'Esci',
    language: 'Lingua'
  },
  qrLanding: {
    validating: 'Verifica codice QR...',
    success: 'Codice QR validato con successo su Urdhëro!',
    invalidCode: 'Codice QR non valido',
    restaurantInfo: 'Informazioni ristorante',
    tableInfo: 'Informazioni tavolo',
    walkInCustomer: 'Cliente Walk-in',
    callWaiter: 'Chiama Cameriere',
    addToHomeScreen: 'Aggiungi Urdhëro a Home',
    viewMenuAndOrder: 'Vedi Menu e Ordina con Urdhëro',
    openingHours: 'Orari di Apertura',
    everyDay: 'Tutti i giorni',
    tips: {
      title: 'Consigli per una Migliore Esperienza con Urdhëro:',
      addToHome: 'Aggiungi Urdhëro alla home per accesso rapido',
      useWifi: 'Usa il Wi-Fi gratuito del ristorante per un\'esperienza più veloce',
      contactStaff: 'Chiama il cameriere se hai domande specifiche'
    },
    walkInTips: {
      title: 'Istruzioni Walk-in con Urdhëro:',
      payAtCounter: 'Paga direttamente alla cassa o aspetta il cameriere al tavolo',
      chooseTable: 'Puoi scegliere un tavolo libero o aspettare di essere accompagnato',
      contactStaff: 'Chiama il personale se hai bisogno di assistenza'
    }
  },
  menu: {
    searchPlaceholder: 'Cerca nel menu...',
    filters: 'Filtri',
    clearAll: 'Cancella tutto',
    categories: {
      all: 'Tutti'
    },
    dietary: {
      title: 'Preferenze alimentari',
      all: 'Tutti',
      vegetarian: 'Vegetariano',
      vegan: 'Vegano'
    },
    availability: {
      title: 'Disponibilità',
      all: 'Tutti',
      available: 'Disponibile',
      unavailable: 'Non disponibile'
    },
    priceRange: {
      title: 'Prezzo',
      all: 'Tutti',
      low: '< €5',
      medium: '€5-12',
      high: '> €12'
    },
    sorting: {
      title: 'Ordina per',
      recommended: 'Raccomandato',
      priceLow: 'Prezzo: Dal più basso',
      priceHigh: 'Prezzo: Dal più alto',
      popular: 'Più Popolari'
    },
    addToCart: 'Aggiungi',
    notAvailable: 'Non disponibile',
    estimatedTime: 'Tempo stimato',
    emptyMenu: {
      title: 'Menu vuoto',
      description: 'Questo ristorante non ha ancora aggiunto piatti al menu.',
      contactStaff: 'Contatta Staff'
    },
    noResults: {
      title: 'Nessun risultato',
      description: 'Nessun piatto trovato per i filtri selezionati.',
      clearFilters: 'Cancella filtri'
    }
  },
  cart: {
    title: 'Carrello',
    empty: {
      title: 'Carrello vuoto',
      description: 'Quando aggiungi piatti dal menu, appariranno qui.',
      exploreMenu: 'Esplora Menu'
    },
    orderSummary: 'Riepilogo ordine',
    items: 'articoli',
    estimatedTime: 'Tempo stimato',
    specialInstructions: 'Istruzioni Speciali',
    instructionsPlaceholder: 'Aggiungi commenti per l\'ordine (opzionale)...',
    paymentMethod: 'Metodo di Pagamento',
    submitOrder: 'Ordina Ora con Urdhëro',
    submitting: 'Ordinando...',
    orderSuccess: 'Ordine effettuato con successo tramite Urdhëro!',
    createAccount: {
      title: 'Crea account Urdhëro per benefici',
      description: 'Cronologia ordini, preferiti e altro',
      create: 'Crea'
    },
    welcomeBack: 'Bentornato su Urdhëro',
    firstOrder: 'Primo ordine su Urdhëro',
    previousOrders: 'ordini precedenti'
  },
  payment: {
    cash: 'Contanti',
    card: 'Carta',
    digital: 'Digitale',
    cashDescription: 'Pagamento in contanti',
    cardDescription: 'Carta di debito/credito',
    digitalDescription: 'Apple Pay, Google Pay',
    minimumOrder: 'Ordine minimo per carta',
    processingFee: 'Commissione carta',
    onlyMethod: 'Unico metodo disponibile'
  },
  orderTracking: {
    title: 'Tracciamento Ordine Urdhëro',
    orderNotFound: 'Ordine non trovato',
    status: {
      new: 'Nuovo',
      accepted: 'Accettato',
      preparing: 'In preparazione',
      ready: 'Pronto',
      served: 'Servito',
      cancelled: 'Annullato'
    },
    progress: {
      title: 'Progresso Ordine',
      newOrder: 'Nuovo ordine',
      accepted: 'Accettato',
      preparing: 'In preparazione',
      ready: 'Pronto',
      descriptions: {
        new: 'Ordine effettuato con successo tramite Urdhëro',
        accepted: 'Il ristorante ha accettato il tuo ordine',
        preparing: 'La cucina sta preparando il tuo ordine',
        ready: 'L\'ordine è pronto per essere servito'
      }
    },
    orderItems: 'Articoli Ordinati',
    callWaiter: 'Chiama Cameriere',
    orderAgain: 'Ordina Ancora',
    ready: {
      title: 'L\'ordine è pronto! 🍽️',
      description: 'Puoi ritirarlo al tuo tavolo'
    },
    rating: {
      title: 'Com\'è stata la tua esperienza con Urdhëro?',
      thanks: 'Grazie per il tuo feedback!'
    }
  },
  waiterCall: {
    call: 'Chiama Cameriere',
    called: 'Cameriere Chiamato',
    alreadyCalled: 'Il cameriere è già stato chiamato per questo tavolo',
    success: 'Cameriere chiamato con successo tramite Urdhëro!',
    waitingForWaiter: 'In attesa del cameriere...',
    estimatedArrival: 'Tempo di arrivo stimato',
    reset: 'Reset',
    resetSuccess: 'Chiamata resettata'
  },
  auth: {
    login: 'Accedi a Urdhëro',
    signup: 'Registrati su Urdhëro',
    email: 'Email',
    password: 'Password',
    name: 'Nome completo',
    phone: 'Telefono',
    welcomeBack: 'Bentornato su Urdhëro!',
    createAccount: 'Crea Account Urdhëro',
    guestCheckout: 'Continua come Ospite',
    continueAsGuest: 'Continua come ospite',
    haveAccount: 'Ho un account Urdhëro',
    benefits: {
      title: 'Crea Account Urdhëro per Benefici Extra',
      orderHistory: 'Cronologia ordini',
      favorites: 'Piatti preferiti',
      exclusiveOffers: 'Offerte esclusive',
      personalizedProfile: 'Profilo personalizzato'
    },
    errors: {
      invalidEmail: 'Formato email non valido',
      shortPassword: 'La password deve avere almeno 6 caratteri',
      loginFailed: 'Email o password non validi'
    }
  },
  dashboard: {
    title: 'Dashboard Ristorante Urdhëro',
    orders: 'Ordini',
    settings: 'Impostazioni',
    stats: {
      ordersToday: 'Ordini oggi',
      revenueToday: 'Ricavi oggi',
      pending: 'In sospeso',
      averageTime: 'Tempo medio'
    },
    filters: {
      all: 'Tutti',
      new: 'Nuovi',
      accepted: 'Accettati',
      preparing: 'In preparazione',
      ready: 'Pronti'
    },
    actions: {
      accept: 'Accetta',
      reject: 'Rifiuta',
      startCooking: 'Inizia Cucina',
      markReady: 'Segna Pronto',
      served: 'Servito'
    },
    paymentSettings: {
      title: 'Impostazioni Pagamento Urdhëro',
      description: 'Gestisci i metodi di pagamento accettati nel tuo ristorante tramite Urdhëro',
      methods: 'Metodi di Pagamento',
      defaultMethod: 'Metodo Predefinito',
      cardSettings: 'Impostazioni Carta',
      minimumOrder: 'Ordine Minimo per Carta',
      processingFee: 'Commissione (%)',
      warning: 'Hai solo un metodo di pagamento attivo. Raccomandiamo di abilitare almeno due metodi.',
      saveChanges: 'Salva Modifiche'
    }
  },
  errors: {
    networkError: {
      title: 'Nessuna Connessione Internet',
      description: 'Sembra che tu non abbia una connessione internet.',
      offline: 'Offline',
      serverIssue: 'Problema Server Urdhëro',
      troubleshooting: 'Passi per risolvere il problema:',
      steps: {
        checkConnection: 'Controlla la tua connessione internet',
        refresh: 'Prova ad aggiornare la pagina',
        contactSupport: 'Se il problema persiste, contatta il supporto Urdhëro'
      }
    },
    restaurantClosed: {
      title: 'Ristorante chiuso',
      description: 'Spiacenti, ma il ristorante è attualmente chiuso.',
      openingHours: 'Orari di Apertura',
      contact: 'Contatta Ristorante'
    },
    invalidQR: {
      title: 'Codice QR Non Valido',
      description: 'Il codice QR che hai scansionato non è valido o è scaduto.'
    }
  },
  userSelection: {
    title: 'Urdhëro Demo',
    subtitle: 'Scegli il tuo tipo di utente per sperimentare la piattaforma completa Urdhëro di ordinazione ristorante.',
    demoUsers: 'Accesso Rapido come Utente Demo',
    userFlows: 'Scegli Flusso Utente',
    errorTesting: 'Test di Errori e Casi Limite',
    currentUser: 'Attualmente connesso come',
    notLoggedIn: 'Non connesso',
    guestMode: 'Modalità Ospite',
    logout: 'Esci',
    authenticated: 'Autenticato',
    scenarios: {
      customerQR: 'Cliente con Codice QR',
      walkIn: 'Cliente Walk-in',
      browseDirect: 'Sfoglia Menu Direttamente',
      returning: 'Cliente di Ritorno',
      staff: 'Staff Ristorante',
      admin: 'Manager Ristorante',
      kitchen: 'Display Cucina'
    },
    badges: {
      mostCommon: 'Più Comune',
      walkIn: 'Walk-in',
      directAccess: 'Accesso Diretto',
      hasHistory: 'Ha Cronologia',
      staff: 'Staff',
      admin: 'Admin',
      kitchen: 'Cucina',
      newCustomer: 'Nuovo Cliente',
      regular: 'Abituale',
      vip: 'VIP'
    }
  }
};

// German translations (abbreviated for brevity - you'd add all translations)
const de: Translations = {
  ...en, // Start with English as base and override specific translations
  common: {
    ...en.common,
    save: 'Speichern',
    cancel: 'Abbrechen',
    close: 'Schließen',
    loading: 'Laden...',
    error: 'Fehler',
    success: 'Erfolg',
    back: 'Zurück',
    menu: 'Speisekarte',
    cart: 'Warenkorb',
    total: 'Gesamt',
    restaurant: 'Restaurant',
    table: 'Tisch'
  },
  waiterCall: {
    call: 'Kellner rufen',
    called: 'Kellner gerufen',
    alreadyCalled: 'Kellner wurde bereits für diesen Tisch gerufen',
    success: 'Kellner erfolgreich über Urdhëro gerufen!',
    waitingForWaiter: 'Warte auf Kellner...',
    estimatedArrival: 'Geschätzte Ankunftszeit',
    reset: 'Zurücksetzen',
    resetSuccess: 'Anruf zurückgesetzt'
  },
  userSelection: {
    ...en.userSelection,
    title: 'Urdhëro Demo',
    subtitle: 'Wählen Sie Ihren Benutzertyp, um die komplette Urdhëro Restaurant-Bestellplattform zu erleben.'
  }
};

// French translations (abbreviated)
const fr: Translations = {
  ...en,
  common: {
    ...en.common,
    save: 'Enregistrer',
    cancel: 'Annuler',
    close: 'Fermer',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    back: 'Retour',
    menu: 'Menu',
    cart: 'Panier',
    total: 'Total',
    restaurant: 'Restaurant',
    table: 'Table'
  },
  waiterCall: {
    call: 'Appeler Serveur',
    called: 'Serveur Appelé',
    alreadyCalled: 'Le serveur a déjà été appelé pour cette table',
    success: 'Serveur appelé avec succès via Urdhëro!',
    waitingForWaiter: 'En attente du serveur...',
    estimatedArrival: 'Heure d\'arrivée estimée',
    reset: 'Réinitialiser',
    resetSuccess: 'Appel réinitialisé'
  },
  userSelection: {
    ...en.userSelection,
    title: 'Urdhëro Demo',
    subtitle: 'Choisissez votre type d\'utilisateur pour découvrir la plateforme complète de commande de restaurant Urdhëro.'
  }
};

// Spanish translations (abbreviated)
const es: Translations = {
  ...en,
  common: {
    ...en.common,
    save: 'Guardar',
    cancel: 'Cancelar',
    close: 'Cerrar',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    back: 'Atrás',
    menu: 'Menú',
    cart: 'Carrito',
    total: 'Total',
    restaurant: 'Restaurante',
    table: 'Mesa'
  },
  waiterCall: {
    call: 'Llamar Camarero',
    called: 'Camarero Llamado',
    alreadyCalled: 'El camarero ya ha sido llamado para esta mesa',
    success: '¡Camarero llamado con éxito a través de Urdhëro!',
    waitingForWaiter: 'Esperando al camarero...',
    estimatedArrival: 'Tiempo estimado de llegada',
    reset: 'Restablecer',
    resetSuccess: 'Llamada restablecida'
  },
  userSelection: {
    ...en.userSelection,
    title: 'Urdhëro Demo',
    subtitle: 'Elige tu tipo de usuario para experimentar la plataforma completa de pedidos de restaurante Urdhëro.'
  }
};

export const translations: Record<Language, Translations> = {
  sq, en, it, de, fr, es
};

export const getTranslation = (language: Language, key: string, params?: Record<string, any>): string => {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  if (typeof value !== 'string') {
    // Fallback to English if translation not found
    value = translations.en;
    for (const k of keys) {
      value = value?.[k];
    }
  }
  
  if (typeof value !== 'string') {
    return key; // Return key if no translation found
  }
  
  // Simple parameter replacement
  if (params) {
    Object.entries(params).forEach(([param, val]) => {
      value = value.replace(`{{${param}}}`, val);
    });
  }
  
  return value;
};