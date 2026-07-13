import { Link } from 'react-router-dom'

const currentYear = new Date().getFullYear()

function Footer() {
  return (
    <footer className='border-t border-border mt-20'>
      <div className='max-w-6xl mx-auto px-5 py-5'>
        <div className='flex flex-col gap-2 items-center justify-center text-center'>
          <p className='font-bold text-primary text-sm tracking-wide'>
            World Cooking
          </p>
          <p className='text-xs text-text-muted mt-2'>
            © {currentYear} World Cooking. All culinary adventures reserved.
          </p>
          <p className='text-text/80 text-xs'>
            Developed by {''}
            <a
              href='https://purpleantlers.dev'
              target='_blank'
              rel='noopener noreferrer'
              className='text-purpleantlers font-semibold hover:opacity-90 transition-all duration-300'
            >
              Purple Antlers
              <span className='sr-only'>Opens in a new tab</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
