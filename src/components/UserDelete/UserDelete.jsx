import { Dialog, Transition, TransitionChild, Button, DialogPanel, DialogTitle } from "@headlessui/react"
import { Fragment } from "react"
import './UserDelete.css'

export default function UserDelete({ isOpen, onClose, onConfirm }) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className='dialog-container' onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="transition-backdrop-enter"
                    enterFrom="transition-backdrop-enterFrom"
                    enterTo="transition-backdrop-enterTo"
                    leave="transition-backdrop-leave"
                    leaveFrom="transition-backdrop-leaveFrom"
                    leaveTo="transition-backdrop-leaveTo"
                >
                    <div className="transition-backdrop" />
                </TransitionChild>

                <div className="dialog-box">
                    <TransitionChild
                        as={Fragment}
                        enter="transition-enter"
                        enterFrom="transition-enterFrom"
                        enterTo="transition-enterTo"
                        leave="transition-leave"
                        leaveFrom="transition-leaveFrom"
                        leaveTo="transition-leaveTo"
                    >

                        <DialogPanel className='dialog-panel'>
                            <DialogTitle className='dialog-title'>
                                Confirm Account Deletion
                            </DialogTitle>
                            <p className="dialog-message">
                                This action is permanent. Are you sure you want to?
                            </p>
                            <div className="dialog-controls">
                                <Button className='cancel-btn btn' onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button className='delete-btn btn' onClick={onConfirm}>
                                    Delete
                                </Button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    )
}