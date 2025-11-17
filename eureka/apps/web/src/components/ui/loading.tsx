import React from 'react'
import { Loader2 } from 'lucide-react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  fullScreen?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
}

export function Loading({ size = 'md', text, fullScreen = false, className = '' }: LoadingProps) {
  const content = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
        {content}
      </div>
    )
  }

  return content
}

export function LoadingSpinner({ className = '' }: { className?: string }) {
  return <Loader2 className={`animate-spin ${className}`} />
}

export function PageLoading({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading size="lg" text={text} />
    </div>
  )
}

export function InlineLoading({ text }: { text?: string }) {
  return <Loading size="sm" text={text} className="py-4" />
}

// Button loading state
export function ButtonLoading() {
  return <Loader2 className="h-4 w-4 animate-spin" />
}
