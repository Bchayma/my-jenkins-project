import Image from 'next/image';
import Link from 'next/link';
import { UserCircle } from 'lucide-react'; // Assure-toi que Lucide est installé

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Image src="/logofst.png" alt="Smart Campus Logo" width={110} height={40} className="rounded-xl" />
        {/* <span className="text-xl font-semibold text-blue-600">Smart Campus</span> */}
      </div>

      {/* Navigation Links + Profile */}
      <div className="flex items-center space-x-4">
      <Link
          href="/"
          className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-200 transition font-medium shadow-sm"
        >
          Home
        </Link>
        <Link
          href="/chatbot"
          className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-200 transition font-medium shadow-sm"
        >
          Chat Bot
        </Link>
        <Link
          href="/lostfound"
          className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-200 transition font-medium shadow-sm"
        >
          Lost & Found
        </Link>
       

        {/* Profile Icon */}
        <Link href="/profile" className="text-blue-600 hover:text-blue-800 transition">
          <UserCircle size={32} />
        </Link>
      </div>
    </nav>
  );
}
