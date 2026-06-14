import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import InteractiveCat from '../cat/InteractiveCat'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

interface UserData {
  name: string;
}

interface LoginPageProps {
  onLogin: (user: UserData) => void
}

function LoginPage({ onLogin }: LoginPageProps) {
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  const handleSwitchToRegister = useCallback(() => {
    setIsRegistering(true)
  }, [])

  const handleSwitchToLogin = useCallback(() => {
    setIsRegistering(false)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-amber-50/60 via-white to-rose-50/40 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative bg-white/60 backdrop-blur-xl border border-white/70 rounded-[2.5rem] shadow-2xl shadow-black/10 p-8 sm:p-10 w-full max-w-md z-10"
      >
        {/* Cat Character */}
        <InteractiveCat isPasswordFocused={isPasswordFocused} />

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-text-dark mb-2">
            {isRegistering ? 'إنشاء حساب' : 'تسجيل الدخول'}
          </h1>
          <p className="text-text-light text-sm">
            {isRegistering ? 'انضمي إلينا واستمتعي بتجربة تسوق فريدة' : 'أهلاً بعودتك إلى بيوتي زون'}
          </p>
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          {isRegistering ? (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <RegisterForm 
                onRegister={onLogin}
                onSwitchToLogin={handleSwitchToLogin}
              />
            </motion.div>
          ) : (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LoginForm 
                onLogin={onLogin}
                onSwitchToRegister={handleSwitchToRegister}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-text-light/50 text-xs">Beauty Zone 2025</p>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage
