'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { X, Calendar, Clock, MapPin, Check, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'
import { useStore, SalonBooking } from '@/lib/store'

export function SalonBookingModal() {
  const router = useRouter()
  const { isSalonModalOpen, setIsSalonModalOpen, bookSalonAppointment, user } = useStore()

  // Dynamic default date: 2 days ahead
  const getDefaultDate = () => {
    const d = new Date()
    d.setDate(d.getDate() + 2)
    return d.toISOString().split('T')[0]
  }

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState(getDefaultDate())
  const [time, setTime] = useState('11:00 AM')
  const [category, setCategory] = useState('Bespoke Tailoring')
  const [notes, setNotes] = useState('')
  const [submittedBooking, setSubmittedBooking] = useState<SalonBooking | null>(null)

  // Populate from authenticated user when opened
  useEffect(() => {
    if (isSalonModalOpen) {
      if (user) {
        setName(`${user.firstName} ${user.lastName}`.trim())
        setEmail(user.email || '')
        if (user.phone) setPhone(user.phone)
      }
      setSubmittedBooking(null)
    }
  }, [isSalonModalOpen, user])

  // Body scroll locking
  useEffect(() => {
    if (isSalonModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isSalonModalOpen])

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSalonModalOpen) {
        setIsSalonModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSalonModalOpen, setIsSalonModalOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !phone) return

    const bookingPayload: SalonBooking = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      date,
      time,
      category,
      notes: notes.trim()
    }

    bookSalonAppointment(bookingPayload)
    setSubmittedBooking({
      ...bookingPayload,
      referenceCode: `AUR-SLN-${Math.floor(1000 + Math.random() * 9000)}`
    })
  }

  const handleClose = () => {
    setIsSalonModalOpen(false)
    setSubmittedBooking(null)
  }

  const handleViewAccount = () => {
    handleClose()
    router.push('/account')
  }

  return (
    <AnimatePresence>
      {isSalonModalOpen && (
        <div
          className="fixed inset-0 z-[60] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="salon-modal-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
          />

          <div className="min-h-full px-4 flex items-center justify-center py-8 sm:py-12">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 12 }}
              transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
              className="relative z-10 w-full max-w-xl bg-[#201f1c] border border-[#3b3832] text-[#f4efe9] rounded-2xl shadow-2xl max-h-[90dvh] overflow-y-auto overscroll-contain modal-content"
              data-native-scroll="true"
            >
              {/* Header Visual */}
              <div className="relative h-40 sm:h-44 w-full bg-[#181716] overflow-hidden">
                <Image
                  src="/images/real-salon.jpg"
                  alt="Aurora Salon Chennai"
                  fill
                  priority
                  className="object-cover filter brightness-[0.7]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#201f1c] via-[#201f1c]/40 to-transparent" />

                <button
                  type="button"
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 bg-[#181716]/80 text-[#f4efe9] hover:text-[#c9b293] rounded-full transition-colors cursor-pointer border border-[#3b3832]"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c9b293] block">
                      Private Flagship Appointment
                    </span>
                    <h2 id="salon-modal-title" className="text-xl sm:text-2xl font-serif text-[#f4efe9]">
                      Chennai Salon Fitting
                    </h2>
                  </div>
                  <span className="font-serif italic text-sm text-[#dfcaa8] hidden sm:block select-none">
                    Tailored for you
                  </span>
                </div>
              </div>

              {submittedBooking ? (
                /* Success / Confirmation State */
                <div className="p-6 sm:p-8 space-y-5">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-[#c9b293]/15 text-[#c9b293] flex items-center justify-center mx-auto border border-[#c9b293]/30">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block font-semibold">
                      Confirmed Atelier Reservation
                    </span>
                    <h3 className="text-xl font-serif text-[#f4efe9]">
                      We Look Forward to Welcoming You
                    </h3>
                    <p className="font-serif italic text-base sm:text-lg text-[#dfcaa8] block select-none">
                      &ldquo;Honored to dress you in unhurried elegance.&rdquo;
                    </p>
                    <p className="text-xs font-sans text-[#a7a297] max-w-sm mx-auto leading-relaxed">
                      Your fitting session with our head draper has been reserved at our Khader Nawaz Khan Road salon.
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className="p-4 bg-[#181716] border border-[#35332e] rounded-xl space-y-2.5 text-xs font-mono">
                    <div className="flex justify-between items-center pb-2 border-b border-[#2a2926]">
                      <span className="text-[#8a857d]">Reservation Code</span>
                      <span className="text-[#c9b293] font-semibold">{submittedBooking.referenceCode}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8a857d]">Patron Name</span>
                      <span className="text-white">{submittedBooking.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8a857d]">Date & Time</span>
                      <span className="text-white">{submittedBooking.date} at {submittedBooking.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8a857d]">Fitting Focus</span>
                      <span className="text-[#c9b293]">{submittedBooking.category}</span>
                    </div>
                    <div className="pt-2 border-t border-[#2a2926] flex items-start gap-2 text-[11px] text-[#8a857d]">
                      <MapPin className="w-3.5 h-3.5 text-[#c9b293] shrink-0 mt-0.5" />
                      <span>14/2 Khader Nawaz Khan Road, Nungambakkam, Chennai 600006</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 py-2.5 px-4 bg-[#c9b293] hover:bg-[#dfcaa8] text-[#181716] font-mono text-xs uppercase tracking-wider font-semibold rounded-xl transition-colors cursor-pointer text-center"
                    >
                      Done / Close
                    </button>
                    <button
                      type="button"
                      onClick={handleViewAccount}
                      className="py-2.5 px-4 bg-[#262421] hover:bg-[#302e2a] border border-[#3b3832] text-[#f4efe9] hover:text-[#c9b293] font-mono text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>View in Account</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Booking Form */
                <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4 text-xs font-mono">
                  <div className="flex items-center gap-2 text-[#a7a297] pb-2 border-b border-[#2e2c28]">
                    <MapPin className="w-3.5 h-3.5 text-[#c9b293]" />
                    <span>Khader Nawaz Khan Rd, Nungambakkam, Chennai</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[#a7a297] block mb-1">
                        Full Name <span className="text-[#c9b293]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Ananya Roy"
                        className="w-full p-2.5 bg-[#181716] border border-[#35332e] text-white rounded-lg focus:outline-none focus:border-[#c9b293]"
                      />
                    </div>
                    <div>
                      <label className="text-[#a7a297] block mb-1">
                        Email Address <span className="text-[#c9b293]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="ananya@example.com"
                        className="w-full p-2.5 bg-[#181716] border border-[#35332e] text-white rounded-lg focus:outline-none focus:border-[#c9b293]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[#a7a297] block mb-1">
                        Phone <span className="text-[#c9b293]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 98400 12345"
                        className="w-full p-2.5 bg-[#181716] border border-[#35332e] text-white rounded-lg focus:outline-none focus:border-[#c9b293]"
                      />
                    </div>
                    <div>
                      <label className="text-[#a7a297] block mb-1">Date</label>
                      <input
                        type="date"
                        required
                        min={getTodayDate()}
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="w-full p-2.5 bg-[#181716] border border-[#35332e] text-white rounded-lg focus:outline-none focus:border-[#c9b293]"
                      />
                    </div>
                    <div>
                      <label className="text-[#a7a297] block mb-1">Time Slot</label>
                      <select
                        value={time}
                        onChange={e => setTime(e.target.value)}
                        className="w-full p-2.5 bg-[#181716] border border-[#35332e] text-white rounded-lg focus:outline-none focus:border-[#c9b293]"
                      >
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="04:30 PM">04:30 PM</option>
                        <option value="06:00 PM">06:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[#a7a297] block mb-1.5">Fitting Focus</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Bespoke Tailoring', 'Silk Dresses', 'Complete Wardrobe'].map(item => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setCategory(item)}
                          className={`py-2 px-2 text-center text-[11px] rounded-lg border transition-all cursor-pointer ${
                            category === item
                              ? 'border-[#c9b293] bg-[#c9b293] text-[#181716] font-semibold'
                              : 'border-[#35332e] bg-[#181716] text-[#a7a297] hover:text-white'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[#a7a297] block mb-1">
                      Styling Notes / Tailoring Requests <span className="text-[#736f67]">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="e.g. Inseam adjustment, pairing with Belgian linen blazer"
                      className="w-full p-2.5 bg-[#181716] border border-[#35332e] text-white rounded-lg focus:outline-none focus:border-[#c9b293]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 sm:py-3 bg-[#c9b293] hover:bg-[#dfcaa8] text-[#181716] font-sans text-xs uppercase tracking-[0.08em] font-medium rounded-full transition-all mt-3 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-[0_4px_16px_rgba(201,178,147,0.25)] active:scale-[0.98]"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Confirm Private Reservation</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
