import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import { FiUser, FiMail, FiPhone, FiLock, FiSave } from 'react-icons/fi'
import { updateProfile, changePassword } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' })
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [tab, setTab] = useState('profile')

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => { updateUser(data.user); toast.success('Profile updated!') },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
  })
  const passMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => { toast.success('Password changed!'); setPassForm({ currentPassword: '', newPassword: '', confirm: '' }) },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to change password'),
  })

  const handlePassChange = (e) => {
    e.preventDefault()
    if (passForm.newPassword !== passForm.confirm) return toast.error('Passwords do not match')
    passMutation.mutate({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword })
  }

  return (
    <div className="page-container max-w-2xl mx-auto">
      <div className="flex items-center gap-5 mb-8 bg-white rounded-2xl border border-gray-100 p-6">
        <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
          <span className="text-primary-700 font-bold text-2xl">{user?.name?.charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <span className={`badge mt-1 ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{user?.role}</span>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
        {['profile', 'security'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{t}</button>
        ))}
      </div>

      {tab === 'profile' ? (
        <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={(e) => { e.preventDefault(); profileMutation.mutate(profileForm) }} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 mb-2">Personal Information</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} className="input-field pl-10" placeholder="Your name" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="email" value={profileForm.email} onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))} className="input-field pl-10" placeholder="your@email.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} className="input-field pl-10" placeholder="+92 300 0000000" />
            </div>
          </div>
          <button type="submit" disabled={profileMutation.isLoading} className="btn-primary flex items-center gap-2">
            <FiSave className="w-4 h-4" /> {profileMutation.isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </motion.form>
      ) : (
        <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handlePassChange} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 mb-2">Change Password</h2>
          {[['currentPassword', 'Current Password'], ['newPassword', 'New Password'], ['confirm', 'Confirm New Password']].map(([field, label]) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="password" value={passForm[field]} onChange={e => setPassForm(f => ({ ...f, [field]: e.target.value }))} className="input-field pl-10" placeholder="••••••••" required />
              </div>
            </div>
          ))}
          <button type="submit" disabled={passMutation.isLoading} className="btn-primary flex items-center gap-2">
            <FiLock className="w-4 h-4" /> {passMutation.isLoading ? 'Changing...' : 'Change Password'}
          </button>
        </motion.form>
      )}
    </div>
  )
}
