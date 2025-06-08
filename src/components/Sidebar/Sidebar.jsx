import { Tab, TabGroup, TabList, TabPanel, TabPanels, Button, Textarea } from '@headlessui/react'
import { ChatBubbleLeftEllipsisIcon, InformationCircleIcon, XMarkIcon, PencilIcon, TrashIcon, GlobeAmericasIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './Sidebar.css'
import { useContext, useEffect, useState } from 'react'
import { getComments, createComment, updateComment, deleteComment } from '../../services/comments'
import { UserContext } from '../../contexts/UserContext'


export default function Sidebar({ disaster, onClose }) {

    const { user } = useContext(UserContext)
    const [formData, setFormData] = useState({
        content: ''
    })
    const [comments, setComments] = useState([])
    const [editComment, setEditComment] = useState(null)
    const [newFormData, setNewFormData] = useState({
        content: formData.content
    })


    async function fetchComments() {

        try {
            const { data } = await getComments(disaster.id)
            setComments(data)
        } catch (error) {
            console.log(error);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()

        if (editComment) {
            return handleUpdate(editComment.id)
        }

        try {
            const { data } = await createComment({
                content: formData.content,
                event: disaster.id
            })

            setFormData({ content: '' })
            setComments(c => [data, ...c])
        } catch (error) {
            console.log(error);
        }
    }

    async function handleEditBtn(commentId) {
        setEditComment(commentId)
        setNewFormData({ content: commentId.content })
    }

    async function handleDeleteBtn(commentId) {
        try {
            await deleteComment(commentId)
            setComments(c => c.filter(c => c.id !== commentId))
        } catch (error) {
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
            console.log(error);
        }
    }

    async function handleChange({ target: { value } }) {
        if (editComment) {
            setNewFormData({ ...newFormData, content: value })
        } else {
            setFormData({ ...formData, content: value })
        }
    }

    async function handleCancel() {
        setEditComment(null)
        setNewFormData({ content: '' })
    }

    useEffect(() => {
        if (disaster.id) {
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
        <div className="sidebar-tab">
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
                        <a href={disaster.url} className="disaster-link">
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
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {disaster.description}
                            </ReactMarkdown>
                        </div>
                    </TabPanel>

                    <TabPanel className='sidetab-panel'>
                        {user
                            ?
                            <form onSubmit={handleSubmit} className='comment-form'>
                                <Textarea className='comment-create'
                                    placeholder='Write a comment...'
                                    rows='3'
                                    cols='37'
                                    value={formData.content}
                                    onChange={handleChange}
                                >
                                </Textarea>
                                <Button className='comment-submit' type='submit'>Post Comment</Button>
                            </form>
                            :
                            <form>
                                <Textarea className='comment-create'
                                    placeholder='Login to leave a comment'
                                    rows='3'
                                    cols='40'
                                    value={formData.content}
                                    onChange={handleChange}
                                    disabled
                                >
                                </Textarea>
                            </form>

                        }

                        {comments.length > 0
                            ? comments.map(comment => (
                                <div key={comment.id} className='comment-container'>
                                    {user && editComment && editComment.id === comment.id
                                        ? (
                                            <form onSubmit={handleSubmit}>
                                                <Textarea className='comment-edit'
                                                    placeholder='Write a comment...'
                                                    rows='10'
                                                    cols='35'
                                                    value={newFormData.content}
                                                    onChange={handleChange}
                                                >
                                                </Textarea>
                                                <Button className='comment-submit' type='submit'>Update Comment</Button>
                                                <Button className='comment-cancel' type='button' onClick={handleCancel}>Cancel</Button>
                                            </form>
                                        ) : (
                                            <>
                                                <div className="comment-info">
                                                    <h3 className='comment-author'>
                                                        <a href="">{comment.author_username}</a>
                                                    </h3>
                                                    <p className='comment-text'>{comment.content}</p>
                                                    {user && comment.author && comment.author === user.id && (
                                                        <div className="comment-controls">
                                                            <TrashIcon className='icon-small' onClick={() => handleDeleteBtn(comment.id)} />
                                                            <PencilIcon className='icon-small' onClick={() => handleEditBtn(comment)} />
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )


                                    }
                                </div>
                            ))
                            : <p className='comment-empty'>No comments yet.</p>
                        }
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>

    )
}