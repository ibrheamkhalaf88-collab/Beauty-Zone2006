import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

interface User {
  name: string;
}

interface LoginFormProps {
  onLogin: (user: User) => void
  onSwitchToRegister: () => void
}

function LoginForm({ onLogin, onSwitchToRegister }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin({ name: 'سارة أحمد' })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light hover:text-primary transition-colors"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <button
        type="submit"
        className="w-full py-3.5 px-6 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200"
      >
        تسجيل الدخول
      </button>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-text-mid hover:text-primary transition-colors text-sm"
        >
          ما عندك حساب؟ <span className="font-bold underline">سجّلي الآن</span>
        </button>
      </div>
    </form>
  )
}

export default LoginForm
