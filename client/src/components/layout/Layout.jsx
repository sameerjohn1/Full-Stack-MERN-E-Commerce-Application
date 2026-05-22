import { motion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import ErrorBoundary from '../common/ErrorBoundary'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
}

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ErrorBoundary>
        <motion.main
          className="flex-1"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {children}
        </motion.main>
      </ErrorBoundary>
      <Footer />
    </div>
  )
}
