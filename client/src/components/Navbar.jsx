import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Listings', href: '/listings' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Disclosure as="nav" className="bg-white shadow-sm relative z-50">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link
                  to="/"
                  className="flex-shrink-0 flex items-center"
                >
                  <span className="text-2xl font-bold text-primary-600">
                    RentalScout
                  </span>
                </Link>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                    >
                      {item.name}
                    </Link>
                  ))}
                  {user?.isAdmin && (
                    <Link
                      to="/admin"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-primary-600"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {user?.role === 'owner' && (
                    <Link
                      to="/listings/add"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-primary-600"
                    >
                      List Property
                    </Link>
                  )}
                </div>
              </div>

              {/* Right side navigation */}
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {user ? (
                  <Menu as="div" className="ml-3 relative z-50">
                    <Menu.Button className="relative bg-white flex items-center gap-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 px-3 py-2 hover:bg-gray-50">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-medium">
                          {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                        </span>
                      </div>
                      <span className="text-gray-900 font-medium">{user.name || user.email}</span>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                            >
                              Your Profile
                            </Link>
                          )}
                        </Menu.Item>
                        {user.role === 'owner' && (
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/listings/add"
                                className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                              >
                                List Property
                              </Link>
                            )}
                          </Menu.Item>
                        )}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`${active ? 'bg-gray-100' : ''} block w-full text-left px-4 py-2 text-sm text-gray-700`}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <div className="space-x-4">
                    <Link
                      to="/login"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 hover:text-primary-700"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  {item.name}
                </Link>
              ))}
              {user?.role === 'owner' && (
                <Link
                  to="/listings/add"
                  className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:text-primary-700 hover:bg-gray-50"
                >
                  List Property
                </Link>
              )}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              {user ? (
                <div className="space-y-1">
                  <div className="flex items-center px-4 py-2">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-medium">
                        {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="ml-3 text-base font-medium text-gray-700">{user.name || user.email}</span>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  >
                    Your Profile
                  </Link>
                  {user.role === 'owner' && (
                    <Link
                      to="/listings/add"
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                    >
                      List Property
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="space-y-1 px-4">
                  <Link
                    to="/login"
                    className="block text-center w-full px-4 py-2 border border-transparent text-base font-medium rounded-md text-primary-600 hover:text-primary-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block text-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}