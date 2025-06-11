import { useContext, useState } from 'react'
import { registerUser, loginUser } from '../../services/auth'
import { useSearchParams, useNavigate, Navigate } from 'react-router'
import { Button, TabGroup, TabList, TabPanel, TabPanels, Field, Label, Input, Tab } from '@headlessui/react'
import './Authenticate.css'
import { getUserFromToken, setToken } from '../../lib/auth'
import { UserContext } from '../../contexts/UserContext'

export default function UserRegister() {
    const [searchParams, setSearchParams] = useSearchParams()
    const tabParam = searchParams.get('tab')
    const { user, setUser } = useContext(UserContext)
    const selectedAuthTab = tabParam === 'register' ? 0 : 1
    const [registerData, setRegisterData] = useState({
        email: '',
        username: '',
        password: '',
        password_confirmation: ''
    })
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    })

    const [error, setError] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setIsLoading(true)
        try {
            if (selectedAuthTab === 0) {
                await registerUser(registerData)
                setSearchParams({ tab: 'login'})
                setRegisterData({
                    email: '',
                    username: '',
                    password: '',
                    password_confirmation: ''
                })
                setError({})
                return
            } else {
                const { data } = await loginUser({
                    username: loginData.username,
                    password: loginData.password
                })
                setToken(data.access)
                setUser(getUserFromToken())
                navigate('/')
            }
        } catch (error) {
            setError(error.response?.data);
        } finally {
            setIsLoading(false)
        }
    }

    async function handleRegisterChange(e) {
        setRegisterData({ ...registerData, [e.target.id]: e.target.value })
    }

    async function handleLoginChange(e) {
        setLoginData({ ...loginData, [e.target.id]: e.target.value })
    }

    if (user) {
        return <Navigate to='/' />
    }

    return (
        <section className="auth-container">
            <TabGroup 
            selectedIndex={selectedAuthTab} 
            onChange={(index) => { 
                const tabChange = index === 0 ? 'register' : 'login'; 
                setSearchParams({ tab: tabChange})
                setError({})
                }}>
                <TabList className='auth-options'>
                    <Tab className={({ selected }) =>
                        selected ? 'auth auth-selected' : 'auth'
                    }>
                        Register
                    </Tab>
                    <Tab className={({ selected }) =>
                        selected ? 'auth auth-selected' : 'auth'
                    }>
                        Login
                    </Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <form className='auth-form' onSubmit={handleSubmit}>
                            <Field name='email'>
                                <Label className='auth-label' htmlFor='email'>Email</Label>
                                <Input
                                    className='auth-input'
                                    id='email' type='email'
                                    onChange={handleRegisterChange} value={registerData.email}
                                    required placeholder='Email'
                                >
                                </Input>
                                {error.email && <p className='error-message'>{error.email}</p>}
                            </Field>
                            <Field name='username'>
                                <Label className='auth-label' htmlFor='username'>Username</Label>
                                <Input
                                    className='auth-input'
                                    id='username' type='username'
                                    onChange={handleRegisterChange} value={registerData.username}
                                    required placeholder='Username'
                                >
                                </Input>
                                {error.username && <p className='error-message'>{error.username}</p>}
                            </Field>
                            <Field name='password'>
                                <Label className='auth-label' htmlFor='password'>Password</Label>
                                <Input
                                    className='auth-input'
                                    id='password' type='password'
                                    onChange={handleRegisterChange} value={registerData.password}
                                    required placeholder='Password'
                                >
                                </Input>
                                {error.password && <p className='error-message'>{error.password}</p>}
                            </Field>
                            <Field name='password_confirmation'>
                                <Label className='auth-label' htmlFor='password_confirmation'>Confirm Password</Label>
                                <Input
                                    className='auth-input'
                                    id='password_confirmation' type='password'
                                    onChange={handleRegisterChange} value={registerData.password_confirmation}
                                    required placeholder='Confirm Password'
                                >
                                </Input>
                                {error.password_confirmation && <p className='error-message'>{error.password_confirmation}</p>}
                                {error.detail && <p className='error-message'>{error.detail}</p>}
                                {error.non_field_errors && <p className='error-message'>{error.non_field_errors}</p>}
                            </Field>
                            <Button className='auth-btn' type='submit'>{isLoading ? 'Registering...' : 'Register'}</Button>
                        </form>
                    </TabPanel>

                    <TabPanel>
                        <form className='auth-form' onSubmit={handleSubmit}>
                            <Field name='username'>
                                <Label className='auth-label' htmlFor='username'>Username</Label>
                                <Input
                                    className='auth-input'
                                    id='username' type='username'
                                    onChange={handleLoginChange} value={loginData.username}
                                    required placeholder='Username'
                                >
                                </Input>
                                {error.username && <p className='error-message'>{error.username}</p>}
                            </Field>
                            <Field name='password'>
                                <Label className='auth-label' htmlFor='password'>Password</Label>
                                <Input
                                    className='auth-input'
                                    id='password' type='password'
                                    onChange={handleLoginChange} value={loginData.password}
                                    required placeholder='Password'
                                >
                                </Input>
                                {error.password && <p className='error-message'>{error.password}</p>}
                                {error.detail && <p className='error-message'>{error.detail}</p>}
                            </Field>
                            <Button className='auth-btn' type='submit'>{isLoading ? 'Logging In...' : 'Log In'}</Button>
                        </form>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </section>
    )
}