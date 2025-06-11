import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../contexts/UserContext"
import { Navigate, NavLink, useNavigate, useParams } from "react-router"
import { deleteProfile, getOwnProfile, getPublicProfile, getUserComments } from '../../services/users'
import { Tab, TabGroup, TabList, TabPanel, TabPanels, Button } from "@headlessui/react"
import './UserProfile.css'
import PaginatedComments from "../PaginatedComments/PaginatedComments"
import UserDelete from "../UserDelete/UserDelete"
import { removeToken } from "../../lib/auth"


export default function UserProfile() {
    const { user, setUser } = useContext(UserContext)
    const { userId } = useParams()
    const [profile, setProfile] = useState(null)
    const [comments, setComments] = useState([])
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (!user && !userId) return
        async function fetchProfile() {
            setIsLoading(true)
            try {
                const checkId = !userId || userId === String(user?.id)
                const { data } = checkId ? await getOwnProfile() : await getPublicProfile(userId)
                setProfile(data)
                const res = await getUserComments(data.id)
                const sortRes = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                setComments(sortRes)
            } catch (error) {
                setError(error.response.data)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProfile()
    }, [userId, user])

    if (!user && !userId) {
        return <Navigate to='/authenticate?tab=register' replace/>
    }

    async function handleDelete() {
        try {
            await deleteProfile()
            removeToken()
            setUser(null)
            navigate('/')
        } catch (error) {
            setError(error.response.data)
        }
    }

    return (
        <>
            {error
                ? <p className="error-message">{error.detail}</p>
                : isLoading
                    ? <p className="loading-message">Loading...</p>
                    : profile && (
                        <div className="profile-container">
                            <div className="user-profile">
                                <h2 className="profile-title">{profile.username}'s Profile</h2>
                                <TabGroup>
                                    <TabList className='tab-list'>
                                        <Tab className={({ selected }) => selected ? 'tab tab-selected' : 'tab'}>
                                            Details
                                        </Tab>
                                        <Tab className={({ selected }) => selected ? 'tab tab-selected' : 'tab'}>
                                            Comments
                                        </Tab>
                                    </TabList>

                                    <TabPanels>
                                        <TabPanel>
                                            <div className="profile-details">
                                                <p><strong>Username: </strong>{profile.username}</p>
                                                <p><strong>Email: </strong> {profile.email}</p>
                                                {user && user.id === profile.id &&
                                                    <div className="profile-controls">
                                                        <Button as={NavLink} to='/profile/edit'>Edit Profile</Button>
                                                        <Button as={NavLink} onClick={() => setIsOpen(true)} >Delete Account</Button>
                                                        <UserDelete isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={handleDelete} />
                                                    </div>
                                                }
                                            </div>
                                        </TabPanel>

                                        <TabPanel>
                                            <PaginatedComments comments={comments} currentUserId={user ? user.id : null} />
                                        </TabPanel>
                                    </TabPanels>


                                </TabGroup>
                            </div>
                        </div>
                    )

            }
        </>
    )
}