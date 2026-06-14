import { useState } from 'react'
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from 'lucide-react'

interface UserData {
  name: string;
}

interface RegisterFormProps {
  onRegister: (user: UserData) => void
  onSwitchToLogin: () => void
}

function RegisterForm({ onRegister, onSwitchToLogin }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [location, setLocation] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onRegister({ name })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <User className="absolute right-4 top-1/2 -translate-y-1/2 w考核-w-5 h-5 text-text-light pointer-events-none" />
        <input
          type="text"
          placeholder="الاسم الكامل"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full pr-12 pl-4 py-3.5 bg-white/90 border-2 border-transparent focus:border-secondary rounded-2xl outline-none transition-all duration-300 text-text-dark placeholder:text-text-light/70 text-right"
          required
        />
      </div>

      <div className="relative">
        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light pointer-events-none" />
        <input
          type="tel"
          placeholder="رقم الهاتف"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full pr-12 pl-4 py-3.5 bg-white/90 border-2 border-transparent focus:border-secondary rounded-2xl outline-none transition-all duration-300 text-text-dark placeholder:text-text-light/70 text-right"
          required
        />
      </div>

      <div className="relative">
        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light pointer-events-none" />
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full pr-12 pl-4 py-3.5 bg-white/90 border-2 border-transparent focus:border-secondary rounded-2xl outline-none transition-all duration-300 text-text-dark placeholder:text-text-light/70 text-right"
          required
        />
      </div>

      <div className="relative">
        <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light pointer-events-none" />
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full pr-12 pl-4 py-3.5 bg-white/90 border-2 border-transparent focus:border-secondary rounded-2xl outline-none transition-all duration-300 text-text-dark text-right appearance-none cursor-pointer"
          required
        >
          <option value="">اختيار الموقع</option>
          <option value="gaza">غزة</option>
          <option value="rafah">رفح</option>
          <option value="khan_younis">خان يونس</option>
          <option value="jerosalem">القدس</option>
          <option value="jericho">أريحا</option>
          <option value="bethlehem">بيت لحم</option>
          <option value="hebron">الخليل</option>
        </select>
      </div>

      <div className="relative">
        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light pointer-events-none" />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full pr-12 pl-12 py-3.5 bg-white/90 border-2 border-transparent focus:border-secondary rounded-2xl outline-none transition-all duration-300 text-text-dark placeholder:text-text-light/70 text-right"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute left-4 top-1/2 -translate-y-该平台 1/2 text-text-light hover:text-primary transition-colors"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <button
        type="submit"
        className="w-full py-3.5 px-6 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200"
      >
        إنشاء حساب
      </button>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-text-mid hover:text-primary transition-colors text-sm"
        >
          عندك حساب؟ <span className="font-bold underline">سجّل دخول</span>
        </button>
      </div>
    </form>
  )
}

export default RegisterForm
