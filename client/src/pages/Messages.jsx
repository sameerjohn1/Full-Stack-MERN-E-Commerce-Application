import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSend, FiMessageCircle } from 'react-icons/fi'
import { getConversations, getMessages, sendMessage, markAsRead } from '../api/messages'
import { getAdminUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/common/Spinner'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { useThrottle } from '../hooks/useThrottle'

export default function Messages() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [selectedUser, setSelectedUser] = useState(null)
  const [text, setText] = useState('')
  const messagesEndRef = useRef(null)
  const isAdmin = user?.role === 'admin'

  const { data: adminData } = useQuery({
    queryKey: ['admin-user'],
    queryFn: getAdminUser,
    enabled: !isAdmin,
  })

  useEffect(() => {
    if (!isAdmin && adminData?.admin && !selectedUser) {
      setSelectedUser(adminData.admin)
    }
  }, [adminData, isAdmin, selectedUser])

  const { data: convoData, isLoading: loadingConvos } = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
    refetchInterval: 10000,
  })

  const { data: msgData, isLoading: loadingMsgs } = useQuery({
    queryKey: ['messages', selectedUser?._id],
    queryFn: () => getMessages(selectedUser._id),
    enabled: !!selectedUser,
    refetchInterval: 5000,
  })

  useEffect(() => {
    if (selectedUser && isAdmin) {
      markAsRead(selectedUser._id).catch(() => {})
    }
  }, [selectedUser, msgData, isAdmin])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgData])

  const sendMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      setText('')
      qc.invalidateQueries(['messages', selectedUser?._id])
      qc.invalidateQueries(['conversations'])
    },
    onError: () => toast.error('Failed to send message'),
  })

  const handleSend = useThrottle(() => {
    if (!text.trim() || !selectedUser) return
    sendMutation.mutate({ receiverId: selectedUser._id, content: text.trim() })
  }, 500)

  const conversations = convoData?.conversations || []
  const messages = msgData?.messages || []

  if (isAdmin) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ height: '75vh' }}>
        <div className="flex h-full">
          <div className="w-72 border-r border-gray-100 flex flex-col flex-shrink-0">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-sm text-gray-700">Conversations</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loadingConvos ? (
                <div className="flex justify-center py-8"><Spinner /></div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-sm text-gray-400 text-center">No conversations yet</div>
              ) : (
                conversations.map(convo => {
                  const other = convo.participants?.find(p => p?._id !== user?._id)
                  return (
                    <button
                      key={convo._id}
                      onClick={() => setSelectedUser(other)}
                      className={`w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors ${selectedUser?._id === other?._id ? 'bg-primary-50' : ''}`}
                    >
                      <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-700 font-semibold text-xs">{other?.name?.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{other?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{convo.lastMessage?.content}</p>
                      </div>
                      {convo.unreadCount > 0 && (
                        <span className="w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">{convo.unreadCount}</span>
                      )}
                    </button>
                  )
                })
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            {!selectedUser ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <FiMessageCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Select a conversation</p>
                </div>
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-semibold text-xs">{selectedUser.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{selectedUser.name}</p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {loadingMsgs ? (
                    <div className="flex justify-center py-8"><Spinner /></div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8 text-sm text-gray-400">No messages yet. Start replying!</div>
                  ) : (
                    <AnimatePresence initial={false}>
                      {messages.map(msg => {
                        const mine = msg.sender?._id === user?._id || msg.sender === user?._id
                        return (
                          <motion.div
                            key={msg._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-xs rounded-2xl px-4 py-2.5 text-sm ${mine ? 'bg-primary-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-900 rounded-bl-sm'}`}>
                              <p>{msg.content}</p>
                              <p className={`text-xs mt-1 ${mine ? 'text-primary-200' : 'text-gray-400'}`}>
                                {format(new Date(msg.createdAt), 'h:mm a')}
                              </p>
                            </div>
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <input
                      value={text}
                      onChange={e => setText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                      placeholder="Type a message..."
                      className="flex-1 input-field"
                    />
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={handleSend}
                      disabled={!text.trim() || sendMutation.isLoading}
                      className="w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-xl flex items-center justify-center disabled:opacity-60 transition-colors"
                    >
                      <FiSend className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!adminData?.admin) {
    return (
      <div className="page-container max-w-2xl mx-auto text-center py-20">
        <Spinner size="lg" />
        <p className="text-gray-500 mt-4">Connecting to support...</p>
      </div>
    )
  }

  return (
    <div className="page-container max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ height: '70vh' }}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-700 font-semibold text-xs">S</span>
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900">Support Team</p>
              <p className="text-xs text-green-500">Online</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loadingMsgs ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : messages.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <FiMessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Send a message to our support team</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map(msg => {
                  const mine = msg.sender?._id === user?._id || msg.sender === user?._id
                  return (
                    <motion.div
                      key={msg._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs rounded-2xl px-4 py-2.5 text-sm ${mine ? 'bg-primary-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-900 rounded-bl-sm'}`}>
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${mine ? 'text-primary-200' : 'text-gray-400'}`}>
                          {format(new Date(msg.createdAt), 'h:mm a')}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Type your message..."
                className="flex-1 input-field"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                disabled={!text.trim() || sendMutation.isLoading}
                className="w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-xl flex items-center justify-center disabled:opacity-60 transition-colors"
              >
                <FiSend className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
