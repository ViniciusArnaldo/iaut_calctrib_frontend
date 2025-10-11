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
  LogOut
} from 'lucide-react';
import { ROUTES } from '../../utils/constants';
import { useAuth } from '../../features/auth/context/AuthContext';
import { useUsage } from '../../features/subscriptions/hooks/useSubscriptions';
import type { MenuSection, NavItem } from './navigation.types';

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
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                CalcTrib
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {menuSections.map((section) => (
              <div key={section.id}>
                <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {section.label}
                </h3>

                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        onClick={onClose}
                        className={`
                          flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                          ${item.active
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
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
          <div className="border-t border-gray-200 p-4">
            {/* User Info */}
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'Usuário'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {usage?.plano || 'BASIC'}
                </p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-2 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </button>

            {/* Plan Info */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">
                Uso: {usage?.calculosRealizados || 0} / {usage?.limiteCalculos === -1 ? '∞' : usage?.limiteCalculos || '--'} cálculos
              </p>
              {usage && usage.limiteCalculos !== -1 && (
                <div className="w-full bg-gray-200 rounded-full h-1.5">
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
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                CalcTrib v1.0.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
