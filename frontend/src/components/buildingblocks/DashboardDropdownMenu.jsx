import { Fragment } from 'react'
import { Menu, Transition, MenuButton, MenuItems, MenuItem } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useNavigate, Link } from 'react-router-dom'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function DashboardDropdownMenu({User}) {

  const navigate = useNavigate();

  function handleSignOut (e) {
    e.preventDefault();
    localStorage.removeItem('token');
    navigate('/signup');
  }



  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="flex justify-center border-black rounded-full bg-slate-400 p-2 h-12 w-12 hover:bg-gray-200">
            <div className='flex flex-col justify-center h-full text-xl font-semibold'>
                {User.firstName[0].toUpperCase()} 
            </div>
        </MenuButton>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <MenuItem>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Account settings
                </a>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <Link
                  to="/transactions"
                  state={User}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                 Transactinos
                </Link>
              )}
            </MenuItem>
            <form method="POST" onSubmit={handleSignOut}>
              <MenuItem>
                {({ active }) => (
                  <button
                    type="submit"
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block w-full px-4 py-2 text-left text-sm'
                    )}
                  >
                    Sign out
                  </button>
                )}
              </MenuItem>
            </form>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  )
}
