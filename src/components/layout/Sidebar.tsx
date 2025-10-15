import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Calculator,
  History,
  Wrench,
  CreditCard,
  Users,
  User,
  LogOut,
  FolderKanban,
  FlaskConical
} from 'lucide-react';
import { ROUTES } from '../../utils/constants';
import { useAuth } from '../../features/auth/context/AuthContext';
import { useUsage } from '../../features/subscriptions/hooks/useSubscriptions';
import type { MenuSection, NavItem } from './navigation.types';
import { ThemeToggle } from '../ui/ThemeToggle';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const iconClasses = "w-5 h-5 flex-shrink-0";

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { data: usage } = useUsage();
  const isAdmin = user?.role === 'ADMIN';

  const isActive = (href: string, children?: NavItem[]) => {
    if (location.pathname === href) return true;
    if (children) {
      return children.some(child => location.pathname.startsWith(child.href));
    }
    return location.pathname.startsWith(href);
  };

  const menuSections: MenuSection[] = useMemo(() => {
    const sections: MenuSection[] = [
      {
        id: 'main',
        label: 'Principal',
        items: [
          {
            label: 'Dashboard',
            icon: <Home className={iconClasses} />,
            href: ROUTES.DASHBOARD,
            active: isActive(ROUTES.DASHBOARD),
          },
          {
            label: 'Calculadora',
            icon: <Calculator className={iconClasses} />,
            href: ROUTES.CALCULADORA,
            active: isActive(ROUTES.CALCULADORA),
          },
          {
            label: 'Histórico',
            icon: <History className={iconClasses} />,
            href: ROUTES.HISTORICO,
            active: isActive(ROUTES.HISTORICO),
          },
          {
            label: 'Ferramentas',
            icon: <Wrench className={iconClasses} />,
            href: ROUTES.FERRAMENTAS,
            active: isActive(ROUTES.FERRAMENTAS),
          },
          {
            label: 'Cadastros',
            icon: <FolderKanban className={iconClasses} />,
            href: ROUTES.CADASTROS,
            active: isActive(ROUTES.CADASTROS),
          },
          {
            label: 'Base Simulação',
            icon: <FlaskConical className={iconClasses} />,
            href: ROUTES.BASE_SIMULACAO,
            active: isActive(ROUTES.BASE_SIMULACAO),
          },
        ],
      },
    ];

    // Admin section
    if (isAdmin) {
      sections.push({
        id: 'admin',
        label: 'Administração',
        items: [
          {
            label: 'Assinaturas',
            icon: <CreditCard className={iconClasses} />,
            href: ROUTES.SUBSCRIPTIONS,
            active: isActive(ROUTES.SUBSCRIPTIONS),
          },
          {
            label: 'Usuários',
            icon: <Users className={iconClasses} />,
            href: ROUTES.USERS,
            active: isActive(ROUTES.USERS),
          },
        ],
      });
    }

    return sections;
  }, [location.pathname, isAdmin]);

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                CalcTrib
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {menuSections.map((section) => (
              <div key={section.id}>
                <div className="flex items-center justify-between px-2 mb-3">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {section.label}
                  </h3>
                  {section.id === 'main' && <ThemeToggle size="sm" />}
                </div>

                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        onClick={onClose}
                        className={`
                          flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                          ${item.active
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }
                        `}
                      >
                        {item.icon}
                        <span className="ml-3 flex-1">{item.label}</span>
                        {item.badge && (
                          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-blue-500 text-white">
                            {item.badge.text}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            {/* User Info */}
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.name || 'Usuário'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {usage?.plano || 'BASIC'}
                </p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-2 text-xs font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </button>

            {/* Plan Info */}
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Uso: {usage?.calculosRealizados || 0} / {usage?.limiteCalculos === -1 ? '∞' : usage?.limiteCalculos || '--'} cálculos
              </p>
              {usage && usage.limiteCalculos !== -1 && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      usage.percentualUso >= 90 ? 'bg-red-500' : usage.percentualUso >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(usage.percentualUso, 100)}%` }}
                  ></div>
                </div>
              )}
            </div>

            {/* Version */}
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                CalcTrib v1.0.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
