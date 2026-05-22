import { Link } from 'react-router-dom'
import { FiGithub, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-white">ShopNow</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Your modern e-commerce destination. Quality products, fast delivery, and exceptional service.
            </p>
            <div className="flex gap-3 mt-5">
              {[FiGithub, FiTwitter, FiInstagram, FiMail].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[['/', 'Home'], ['/products', 'Products'], ['/categories', 'Categories'], ['/cart', 'Cart']].map(([to, label]) => (
                <li key={to}><Link to={to} className="text-sm hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Account</h4>
            <ul className="space-y-2.5">
              {[['/login', 'Login'], ['/register', 'Register'], ['/orders', 'My Orders'], ['/profile', 'Profile']].map(([to, label]) => (
                <li key={to}><Link to={to} className="text-sm hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} ShopNow. All rights reserved.</p>
          <p className="text-sm text-gray-500">Built with MERN Stack</p>
        </div>
      </div>
    </footer>
  )
}
