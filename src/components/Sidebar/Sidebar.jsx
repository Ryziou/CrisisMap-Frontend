import { Tab, TabGroup, TabList, TabPanel, TabPanels, Button } from '@headlessui/react'
import { ChatBubbleLeftEllipsisIcon, InformationCircleIcon, XMarkIcon, PencilIcon, TrashIcon, GlobeAmericasIcon } from "@heroicons/react/24/outline"
import './Sidebar.css'


export default function Sidebar({ disaster, onClose }) {
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
                <XMarkIcon className="icon"/>
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
                        <ChatBubbleLeftEllipsisIcon className="icon-small"/>
                        Comments
                    </span>
                </Tab>
            </TabList>

            <TabPanels>
                <TabPanel className='sidetab-panel'>
                    <a href={disaster.url} className="disaster-link">
                        <GlobeAmericasIcon className="icon-small"/>
                        View on ReliefWeb
                    </a>
                    <p className='disaster-type'><strong>Disaster Title:</strong> {splitName[0] || 'Unknown Disaster'}</p>
                    <p className='disaster-type'><strong>Status:</strong> <span className={`status-${capitalizedStatus}`}>{capitalizedStatus}</span></p>
                    <p className='disaster-type'><strong>Disaster Type:</strong> {splitName[1] || 'Unknown condition'}</p>
                    <p className='disaster-type'><strong>Event Date:</strong> {dateEvent}</p>
                    <p className='disaster-type'><strong>Report Published:</strong> {dateCreated}</p>
                    <p className='disaster-type'><strong>Last Updated:</strong> {dateUpdated}</p>
                    <p className='disaster-type'><strong>Primary Country:</strong> {country}</p>
                    <p className='disaster-type'><strong>Affected Countries:</strong> {affected}</p>
                    <p>{disaster.description}</p>
                </TabPanel>
            </TabPanels>
        </TabGroup>
    </div>

  )  
}