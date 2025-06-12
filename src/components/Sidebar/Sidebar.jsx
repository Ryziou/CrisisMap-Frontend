import { Tab, TabGroup, TabList, TabPanel, TabPanels, Button, Textarea } from '@headlessui/react'
import { ChatBubbleLeftEllipsisIcon, InformationCircleIcon, XMarkIcon, PencilIcon, TrashIcon, GlobeAmericasIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './Sidebar.css'
import { useContext, useEffect, useState, useRef } from 'react'
import { getComments, createComment, updateComment, deleteComment } from '../../services/comments'
import { UserContext } from '../../contexts/UserContext'
import { NavLink } from 'react-router'
import { formatDates } from '../../lib/dateFormatter'


export default function Sidebar({ disaster, onClose }) {

    const { user } = useContext(UserContext)
    const [formData, setFormData] = useState({
        content: ''
    })
    const [comments, setComments] = useState([])
    const [editComment, setEditComment] = useState(null)
    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [createError, setCreateError] = useState({})
    const [editError, setEditError] = useState({})
    const [newFormData, setNewFormData] = useState({
        content: formData.content
    })
    const perPage = 5
    const [page, setPage] = useState(0)
    const start = page * perPage
    const end = start + perPage
    const paginatedComments = comments.slice(start, end)
    const totalPages = Math.ceil(comments.length / perPage)
    const sidebarRef = useRef()

    async function handleSubmit(e) {
        e.preventDefault()

        if (editComment) {
            return handleUpdate(editComment)
        }
        try {
            if (!formData.content.trim()) {
                throw new Error('This field may not be blank')
            }

            const { data } = await createComment({
                content: formData.content,
                event: disaster.id
            })

            setFormData({ content: '' })
            setComments(c => [data, ...c])
            setPage(0)
            setCreateError({})
        } catch (error) {
            if (error.message === 'This field may not be blank') {
                setCreateError({ content: error.message })
            } else {
                setCreateError(error.response.data || { content: 'Something went wrong.' })
            }
        }
    }

    async function handleEditBtn(comment) {
        setEditComment(comment.id)
        setNewFormData({ content: comment.content })
        setEditError({})
        setCreateError({})
    }

    async function handleDeleteBtn(commentId) {
        try {
            await deleteComment(commentId)
            setComments(c => c.filter(c => c.id !== commentId))
            setEditError({})
            setCreateError({})
        } catch (error) {
            setError('Failed to delete comment');
            console.log(error);
        }
    }

    async function handleUpdate(commentId) {
        try {
            const { data } = await updateComment(commentId, {
                content: newFormData.content,
                event: disaster.id
            })
            setComments(commentslist => commentslist.map(comment => comment.id === commentId ? data : comment))
            setFormData({ content: '' })
            setEditComment(null)
        } catch (error) {
            if (error.message === 'This field may not be blank') {
                setEditError(error.message)
            } else {
                setEditError(error.response.data || { content: 'Something went wrong.' })
            }
        }
    }

    async function handleChangeCreate({ target: { value } }) {
        setFormData({ content: value })
        setCreateError({})

    }

    async function handleChangeEdit({ target: { value } }) {
        setNewFormData({ content: value })
        setEditError({})
    }

    async function handleCancel() {
        setEditComment(null)
        setEditError({})
        setNewFormData({ content: '' })
    }

    useEffect(() => {
        async function fetchComments() {
            setIsLoading(true)
            try {
                const { data } = await getComments(disaster.id)
                setComments(data)
            } catch (error) {
                setError('Failed to load comments');
                console.log(error);
            } finally {
                setIsLoading(false)
            }
        }
        if (disaster.id) {
            setPage(0)
            if (sidebarRef.current) {
                sidebarRef.current.scrollTop = 0
            }
            fetchComments()
        }
    }, [disaster])

    if (!disaster) return null
    const splitName = disaster.name.split(/[:-]/) || []
    const dateCreated = disaster.date.created.split('T')[0] || 'N/A'
    const dateEvent = disaster.date.event.split('T')[0] || 'N/A'
    const dateUpdated = disaster.date.changed.split('T')[0] || 'N/A'
    const country = disaster.primary_country.name || 'N/A'
    const affected = disaster.country.map(c => c.name).join(', ')
    const capitalizedStatus = disaster.status.charAt(0).toUpperCase() + disaster.status.slice(1)

    return (
        <div className="sidebar-tab" ref={sidebarRef}>
            <div className="sidebar-header">
                <h2 className="sidebar-title">
                    {splitName[0]} - {disaster.primary_type.name}
                </h2>
                <Button className='sidebar-closebtn' onClick={onClose}>
                    <XMarkIcon className="icon" />
                </Button>
            </div>

            <TabGroup>
                <TabList className='sidetab-list'>
                    <Tab className={({ selected }) => selected ? 'sidetab-btn sidetab-selected' : 'sidetab-btn'}>
                        <span className="sidetab-label">
                            <InformationCircleIcon className="icon-small" />
                            Details
                        </span>
                    </Tab>
                    <Tab className={({ selected }) => selected ? 'sidetab-btn sidetab-selected' : 'sidetab-btn'}>
                        <span className="sidetab-label">
                            <ChatBubbleLeftEllipsisIcon className="icon-small" />
                            Comments
                        </span>
                    </Tab>
                </TabList>

                <TabPanels>
                    <TabPanel className='sidetab-panel'>
                        <a href={disaster.url} className="disaster-link" target='_blank' rel='noopener noreferrer'>
                            <GlobeAmericasIcon className="icon-small" />
                            View report on ReliefWeb
                        </a>
                        <p className='disaster-type'><strong>Location:</strong> {splitName[0] || 'Unknown Disaster'}</p>
                        <p className='disaster-type'><strong>Status:</strong> <span className={`status-${capitalizedStatus}`}>{capitalizedStatus}</span></p>
                        <p className='disaster-type'><strong>Type:</strong> {splitName[1] || 'Unknown condition'}</p>
                        <p className='disaster-type'><strong>Date Started:</strong> {dateEvent}</p>
                        <p className='disaster-type'><strong>Report Published:</strong> {dateCreated}</p>
                        <p className='disaster-type'><strong>Last Updated:</strong> {dateUpdated}</p>
                        <p className='disaster-type'><strong>Primary Country:</strong> {country}</p>
                        <p className='disaster-type'><strong>Affected Countries:</strong> {affected}</p>
                        <div className='disaster-description'>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}
                                components={{
                                    a: ({ ...props }) => (
                                        <a {...props} target='_blank' rel='noopener noreferrer' className='markdown-link' />)
                                }}>
                                {disaster.description}
                            </ReactMarkdown>
                        </div>
                    </TabPanel>

                    <TabPanel className='sidetab-panel'>
                        {createError.content && !editComment && <p className="comment-error">{createError.content}</p>}
                        {error && <p className="comment-error">{error}</p>}

                        {user && !editComment
                            ?
                            <form onSubmit={handleSubmit} className='comment-form'>
                                <Textarea className='comment-create'
                                    placeholder='Write a comment...'
                                    rows='3'
                                    cols='37'
                                    value={formData.content}
                                    onChange={handleChangeCreate}
                                >
                                </Textarea>
                                <Button className='comment-submit' type='submit'>Post Comment</Button>
                            </form>
                            : null
                        }
                        {isLoading ? (
                            <p className='loading-message'>Loading comments...</p>
                        ) : (
                            paginatedComments.length > 0
                                ? (<>
                                    {paginatedComments.map(comment => (
                                        <div key={comment.id} className='comment-container'>
                                            {user && editComment === comment.id
                                                ? (
                                                    <form onSubmit={handleSubmit}>
                                                        {editError.content && <p className="comment-error">{editError.content}</p>}
                                                        <Textarea className='comment-edit'
                                                            placeholder='Write a comment...'
                                                            rows='10'
                                                            cols='35'
                                                            value={newFormData.content}
                                                            onChange={handleChangeEdit}
                                                        >
                                                        </Textarea>
                                                        <Button className='comment-submit' type='submit'>Update Comment</Button>
                                                        <Button className='comment-cancel' type='button' onClick={handleCancel}>Cancel</Button>
                                                    </form>
                                                ) : (
                                                    <>
                                                        <div className="comment-information">
                                                            <h3 className='comment-author'>
                                                                <NavLink to={`/profile/${comment.author}`}>{comment.author_username}</NavLink>
                                                            </h3>
                                                            <p className='comment-text'>{comment.content}</p>
                                                            {user && comment.author && comment.author === user.id && (
                                                                <div className="comment-controls">
                                                                    <TrashIcon className='icon-small controls' onClick={() => handleDeleteBtn(comment.id)} />
                                                                    <PencilIcon className='icon-small controls' onClick={() => handleEditBtn(comment)} />
                                                                </div>
                                                            )}
                                                            <div className="comment-information">
                                                                <small>
                                                                    {formatDates(comment.created_at, comment.event)} - <NavLink to={`/map?event=${comment.event}`}>{comment.event}</NavLink>
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                        </div>
                                    ))}
                                    <div className="pagination-controls">
                                        <Button
                                            type="button"
                                            onClick={() => setPage(p => Math.max(0, p - 1))}
                                            disabled={page === 0}
                                        >
                                            Previous
                                        </Button>
                                        <span>{page + 1} of {totalPages}</span>
                                        <Button
                                            type="button"
                                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                            disabled={page === totalPages - 1}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </>
                                ) : (
                                    <p className='comment-empty'>No comments yet.</p>
                                )
                        )}

                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>

    )
}