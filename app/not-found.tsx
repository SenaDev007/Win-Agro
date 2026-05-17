import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF3] text-primary-deep p-4 text-center">
      <h2 className="text-4xl sm:text-5xl font-serif font-black mb-6">404 - Page non trouvée</h2>
      <p className="text-gray-text font-sans mb-8 max-w-md">
        Il semble que cette page n'existe pas ou a été déplacée. Ne reste pas bloqué, retourne à l'accueil pour découvrir nos formations et nos produits.
      </p>
      <Link href="/" className="px-8 py-4 bg-primary-green text-white rounded-full font-bold shadow-md hover:bg-primary-deep transition">
        Retour à l'accueil →
      </Link>
    </div>
  );
}
