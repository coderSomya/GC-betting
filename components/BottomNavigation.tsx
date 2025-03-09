'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaInfoCircle, FaEnvelope } from 'react-icons/fa';

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { path: '/', label: 'Home', icon: <FaHome size={20} /> },
    { path: '/games', label: 'Games', icon: <FaInfoCircle size={20} /> },
  ];

  return (
    <nav className="z-50 fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center w-full h-full ${
                isActive 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <div>{item.icon}</div>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}