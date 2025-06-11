import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../contexts/UserContext"
import { getOwnProfile, updateProfile } from "../../services/users"
import { Button, Field, Label, Input } from "@headlessui/react"
import './UserProfileEdit.css'
import { Navigate, useNavigate } from "react-router"


export default function UserProfileEdit() {
    const { user } = useContext(UserContext)
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password_confirmation: ''
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchProfile() {
            try {
                const { data } = await getOwnProfile()
                setFormData({ ...data, password: '', password_confirmation: ''})
            } catch (error) {
                setError(error.response.data)
            }
        }
        fetchProfile()
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        setIsLoading(true)
        const payload = { ...formData}
        if (!payload.password) {
            delete payload.password
            delete payload.password_confirmation
        }
        try {
            await updateProfile(payload)
            navigate('/profile')
        } catch (error) {
            setError(error.response.data)
        } finally {
            setIsLoading(false)
        }
    }

    function handleChange(e) {
        setFormData({ ...formData, [e.target.id]: e.target.value})
    }

    if (!user) return <Navigate to='/authenticate?tab=register' replace/>

    return (
        <div className="profile-container-edit">
            <h2 className="profile-title">Edit Your Profile</h2>
            <form className="profile-edit" onSubmit={handleSubmit}>
                <Field name='email'>
                    <Label className='profile-label' htmlFor='email'>Email</Label>
                    <Input
                        className='profile-input'
                        id='email' type='email'
                        onChange={handleChange} value={formData.email}
                        required placeholder='Email'
                    >
                    </Input>
                    {error.email && <p className='error-message'>{error.email}</p>}
                </Field>

                <Field name='username'>
                    <Label className='profile-label' htmlFor='username'>Username</Label>
                    <Input
                        className='profile-input'
                        id='username' type='username'
                        onChange={handleChange} value={formData.username}
                        required placeholder='Username'
                    >
                    </Input>
                    {error.username && <p className='error-message'>{error.username}</p>}
                </Field>

                <Field name='password'>
                    <Label className='profile-label' htmlFor='password'>Password</Label>
                    <Input
                        className='profile-input'
                        id='password' type='password'
                        onChange={handleChange} value={formData.password}
                        placeholder='Password'
                    >
                    </Input>
                    {error.password && <p className='error-message'>{error.password}</p>}
                </Field>
                <Field name='password_confirmation'>
                    <Label className='profile-label' htmlFor='password_confirmation'>Confirm Password</Label>
                    <Input
                        className='profile-input'
                        id='password_confirmation' type='password'
                        onChange={handleChange} value={formData.password_confirmation}
                        placeholder='Confirm Password'
                    >
                    </Input>
                    {error.password_confirmation && <p className='error-message'>{error.password_confirmation}</p>}
                </Field>
                    {error.detail && <p className='error-message'>{error.detail}</p>}
                    {error.non_field_errors && <p className='error-message'>{error.non_field_errors}</p>}
                <div className="profile-edit-btn">
                    <Button className='profile-btn' type='submit'>{isLoading ? 'Updating...' : 'Update'}</Button>
                </div>

            </form>
        </div>
    )
}