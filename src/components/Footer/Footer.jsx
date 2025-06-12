import './Footer.css'

export default function Footer() {
    return (
        <footer className="footer">
            <p className='footer-info'>
                © {new Date().getFullYear()} CrisisMap | Designed & Developed by <a href="https://github.com/Ryziou" target='_blank' rel='noopener noreferrer'>Callum Liu</a> <a href="https://github.com/Ryziou/CrisisMap-Frontend" target='_blank' rel='noopener noreferrer'>
                <img src="https://res.cloudinary.com/dit5y4gaj/image/upload/v1747823098/github-mark-white_iymleu.png" alt="GitHub" width="30" height="30" />
            </a>
            </p>
        </footer>
    )
}