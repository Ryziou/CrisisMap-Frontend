import { useState } from "react";
import { formatDates } from "../../lib/dateFormatter";
import { Button } from "@headlessui/react";
import { NavLink } from "react-router";

export default function PaginatedComments({ comments, perPage = 5 }) {
    const [page, setPage] = useState(0)
    const start = page * perPage
    const end = start + perPage
    const paged = comments.slice(start, end)
    const totalPages = Math.ceil(comments.length / perPage)

    return (
        <div className="comments-container">
            <ul className="comment-box">
                {paged.map(comment => (
                    <li key={comment.id} className="comment-details">
                        <p className="comment-text">{comment.content}</p>
                        <div className="comment-info">
                            <small>
                                {formatDates(comment.created_at, comment.event)} - <NavLink to={`/map?event=${comment.event}`}>{comment.event}</NavLink>
                            </small>
                        </div>
                    </li>
                ))}
            </ul>
            {totalPages > 1 && (
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
            )}
        </div>
    )
}