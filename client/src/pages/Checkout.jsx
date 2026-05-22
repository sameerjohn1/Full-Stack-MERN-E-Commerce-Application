import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import { FiCheck, FiCreditCard } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { createOrder } from '../api/orders'
import toast from 'react-hot-toast'

const STEPS = ['Address', 'Payment', 'Review']

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [address, setAddress] = useState({ fullName: '', phone: '', street: '', city: '', state: '', zip: '', country: 'Pakistan' })
  const [payment, setPayment] = useState({ method: 'cod' })

  const shipping = totalPrice >= 50 ? 0 : 9.99
  const tax = totalPrice * 0.08
  const total = totalPrice + shipping + tax

  const orderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      clearCart()
      toast.success('Order placed successfully!')
      navigate(`/orders/${data.order._id}`)
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Order failed'),
  })

  const handleOrder = () => {
    orderMutation.mutate({
      items: items.map(i => ({ product: i._id, quantity: i.quantity, price: i.price })),
      shippingAddress: address,
      paymentMethod: payment.method,
      subtotal: totalPrice,
      shippingCost: shipping,
      tax,
      totalAmount: total,
    })
  }

  const inputProps = (field, state, setState, type = 'text') => ({
    type,
    value: state[field],
    onChange: e => setState(s => ({ ...s, [field]: e.target.value })),
    className: 'input-field',
  })

  return (
    <div className="page-container max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
              {i < step ? <FiCheck className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-sm ${i === step ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 rounded ${i < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        {step === 0 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input placeholder="John Doe" {...inputProps('fullName', address, setAddress)} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input placeholder="+92 300 0000000" {...inputProps('phone', address, setAddress)} /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label><input placeholder="123 Main Street" {...inputProps('street', address, setAddress)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">City</label><input placeholder="Karachi" {...inputProps('city', address, setAddress)} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label><input placeholder="Sindh" {...inputProps('state', address, setAddress)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label><input placeholder="74200" {...inputProps('zip', address, setAddress)} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Country</label><input {...inputProps('country', address, setAddress)} /></div>
            </div>
            <button
              onClick={() => setStep(1)}
              disabled={!address.fullName || !address.street || !address.city}
              className="btn-primary w-full mt-2"
            >
              Continue to Payment
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Method</h2>
            {[
              { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive your order' },
              { id: 'card', label: 'Credit/Debit Card', icon: '💳', desc: 'Pay securely with your card' },
              { id: 'bank', label: 'Bank Transfer', icon: '🏦', desc: 'Transfer directly to our bank' },
            ].map(m => (
              <label key={m.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${payment.method === m.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="payment" value={m.id} checked={payment.method === m.id} onChange={() => setPayment({ method: m.id })} className="hidden" />
                <span className="text-2xl">{m.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{m.label}</p>
                  <p className="text-xs text-gray-500">{m.desc}</p>
                </div>
                {payment.method === m.id && <div className="ml-auto w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center"><FiCheck className="w-3 h-3 text-white" /></div>}
              </label>
            ))}
            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep(0)} className="btn-secondary flex-1">Back</button>
              <button onClick={() => setStep(2)} className="btn-primary flex-1">Review Order</button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Review Your Order</h2>
            <div className="space-y-3 mb-6">
              {items.map(i => (
                <div key={i._id} className="flex items-center gap-3 text-sm">
                  <img src={i.images?.[0] || 'https://placehold.co/40x40'} alt={i.name} className="w-10 h-10 object-cover rounded-lg" />
                  <span className="flex-1 text-gray-700">{i.name} × {i.quantity}</span>
                  <span className="font-semibold">${(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm mb-6">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Tax</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
              <button onClick={handleOrder} disabled={orderMutation.isLoading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {orderMutation.isLoading ? 'Placing...' : (<><FiCreditCard /> Place Order</>)}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
