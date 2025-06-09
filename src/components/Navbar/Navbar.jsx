import { NavLink } from 'react-router'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import './Navbar.css'
import { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'
import { removeToken } from '../../lib/auth'

export default function Navbar() {
    const { user, setUser } = useContext(UserContext)

    const handleSignOut = () => {
        removeToken()
        setUser(null)
    }

    return (
        <nav className="navbar">
            <div className="nav-group">
                <Menu as='div' className='menu-wrapper'>
                    <MenuButton className='btn-menu'>
                        Menu <ChevronDownIcon className='icon' />
                    </MenuButton>
                    <MenuItems className='menu-items'>
                        <MenuItem>
                            <NavLink to='/'>Home</NavLink>
                        </MenuItem>
                        <MenuItem>
                            <NavLink to='/map'>Map</NavLink>
                        </MenuItem>
                    </MenuItems>
                </Menu>
            </div>
            <NavLink to='/' className='navbar-title'>
                <h1 className="navbar-title">CrisisMap</h1>
            </NavLink>

            <div className="nav-group">
                <Menu as='div' className='menu-wrapper'>
                    <MenuButton className='btn-menu'>
                        {user ? user.username : 'Account'} <ChevronDownIcon className="icon" />
                    </MenuButton>
                    <MenuItems className='menu-items right-align'>
                        {user
                            ? (
                                <>
                                    <MenuItem as={NavLink} to='/profile'>
                                        {user.username}
                                    </MenuItem>
                                    <MenuItem as={NavLink} to='/' onClick={handleSignOut}>
                                        Log Out
                                    </MenuItem>
                                </>
                            )
                            :
                            (
                                <>
                                    <MenuItem as={NavLink} to='/authenticate?tab=register'>
                                        Register
                                    </MenuItem>
                                    <MenuItem as={NavLink} to='/authenticate?tab=login'>
                                        Login
                                    </MenuItem>
                                </>
                            )
                        }

                    </MenuItems>
                </Menu>
            </div>
        </nav>
    )
}