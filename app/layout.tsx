import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { LanguageProvider } from "@/context/LanguageContext";
import AnalyticsTracker from "@/components/ui/AnalyticsTracker";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  // ── metadataBase : résout TOUS les chemins relatifs (OG, twitter, icons)
  // Couvre à la fois winagrotech.com ET www.winagrotech.com
  metadataBase: new URL("https://winagrotech.com"),

  title: "Win Agro Agri Tech Solutions — Élevage au Bénin | Formation, Installation, Vente",
  description: "Win Agro Agri Tech Solutions t'accompagne dans ton projet d'élevage au Bénin. Formation pratique, installation de ferme, vente de volailles et provendes. Victoire AHOGNON, experte terrain.",
  alternates: {
    canonical: "https://winagrotech.com",
  },
  openGraph: {
    title: "Win Agro Agri Tech Solutions — Formation & Élevage au Bénin",
    description: "Formations pratiques, installation de ferme et vente d'animaux sélectionnés. Victoire AHOGNON t'accompagne jusqu'aux résultats.",
    url: "https://winagrotech.com",
    siteName: "Win Agro Agri Tech",
    locale: "fr_BJ",
    type: "website",
    images: [
      {
        // Logo Win Agro — affiché lors du partage du lien
        url: "/logo-win-agro.png",
        width: 1200,
        height: 630,
        alt: "Win Agro Agri Tech Solutions — Formation & Élevage au Bénin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Win Agro Agri Tech — Formation & Élevage au Bénin",
    description: "Formations pratiques, installation de ferme et vente d'animaux sélectionnés au Bénin.",
    images: ["/logo-win-agro.png"],
  },
  icons: {
    icon: "/logo-win-agro.png",
    shortcut: "/logo-win-agro.png",
    apple: "/logo-win-agro.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${dmSans.variable} ${playfair.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": ["LocalBusiness", "AgricultureBusiness"],
                  "@id": "https://winagrotech.com/#business",
                  "name": "Win Agro Agri Tech Solutions",
                  "description": "Formation agricole, élevage, vente de volailles, provendes et installation de fermes au Bénin. Méthodes 100% naturelles.",
                  "url": "https://winagrotech.com",
                  "telephone": "+2290161336548",
                  "email": "contact@winagrotech.com",
                  "foundingDate": "2020",
                  "founder": {
                    "@type": "Person",
                    "name": "Victoire AHOGNON"
                  },
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Porto-Novo",
                    "addressCountry": "BJ",
                    "addressRegion": "Ouémé"
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": "9.3376",
                    "longitude": "2.6270"
                  },
                  "areaServed": [
                    "Bénin", "Cotonou", "Parakou", "Abomey-Calavi", "Porto-Novo"
                  ],
                  "openingHoursSpecification": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
                    "opens": "08:00",
                    "closes": "18:00"
                  },
                  "sameAs": [
                    "https://wa.me/2290161336548",
                    "https://www.facebook.com/winagro"
                  ],
                  "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Services Win Agro",
                    "itemListElement": [
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Formation élevage volaille",
                          "description": "Formation pratique en présentiel et en ligne pour l'élevage de poulets, pintades, dindes et cailles au Bénin."
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Installation de ferme avicole",
                          "description": "Accompagnement complet pour l'installation et le démarrage de votre ferme au Bénin."
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Vente de poussins d'un jour",
                          "description": "Vente de poussins coquellets, goliaths et pondeuses sélectionnés pour le contexte béninois."
                        }
                      }
                    ]
                  },
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.9",
                    "reviewCount": "47",
                    "bestRating": "5"
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://winagrotech.com/#website",
                  "url": "https://winagrotech.com",
                  "name": "Win Agro Agri Tech Solutions",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://winagrotech.com/?s={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "Comment démarrer un élevage de poulets au Bénin ?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Pour démarrer un élevage de poulets au Bénin, il faut : 1) Définir votre capacité (500 à 1000 sujets pour débuter), 2) Construire ou adapter un poulailler (2m² pour 10 poulets), 3) Choisir des poussins d'un jour de qualité, 4) Mettre en place un programme alimentaire adapté, 5) Suivre un calendrier de vaccination. Win Agro vous accompagne à chaque étape."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Quel est le prix des poussins d'un jour au Bénin ?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Le prix des poussins d'un jour au Bénin varie selon la race et les fournisseurs. Win Agro propose des poussins sélectionnés (coquellets, goliaths, pondeuses) à des prix compétitifs. Contactez-nous sur +229 0161336548 pour connaître les tarifs en cours."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Combien coûte une formation en élevage au Bénin ?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Win Agro propose des formations pratiques en élevage de volaille, lapins et porc au Bénin, disponibles en présentiel à Parakou et en ligne. Contactez-nous pour connaître les tarifs et les prochaines dates de session."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Quelle est la rentabilité d'un élevage de 1000 poulets au Bénin ?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Un élevage de 1000 poulets de chair au Bénin peut générer une marge nette de 500 000 à 800 000 FCFA par cycle de 45 jours selon les cours du marché et la maîtrise des coûts alimentaires. Win Agro vous aide à optimiser votre rentabilité dès le premier cycle."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Où acheter des provendes de qualité au Bénin ?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Win Agro Agri Tech Solutions propose des provendes de qualité en gros et en détail à Parakou et Cotonou. Disponibles en démarrage, croissance et finition. Livraison possible. Contactez-nous au +229 0161336548."
                      }
                    }
                  ]
                },
                {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "name": "Accueil",
                      "item": "https://winagrotech.com"
                    },
                    {
                      "@type": "ListItem",
                      "position": 2,
                      "name": "Formation",
                      "item": "https://winagrotech.com/formation/"
                    },
                    {
                      "@type": "ListItem",
                      "position": 3,
                      "name": "Élevage de Volaille",
                      "item": "https://winagrotech.com/formation/elevage-volaille/"
                    }
                  ]
                }
              ]
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAFAF3] text-[#4A4A4A] font-sans selection:bg-[#E6F4EC] selection:text-[#076B37]">
        <LanguageProvider>
          <AnalyticsTracker />
          {children}
        </LanguageProvider>


        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VV16Q0T0LY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VV16Q0T0LY');
          `}
        </Script>
      </body>
    </html>
  );
}
