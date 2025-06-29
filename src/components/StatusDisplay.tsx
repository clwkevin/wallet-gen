import React, { useEffect, useRef } from 'react'

interface StatusDisplayProps {
  status: string
}

export function StatusDisplay({ status }: StatusDisplayProps) {
  const statusRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (statusRef.current) {
      statusRef.current.scrollTop = statusRef.current.scrollHeight
    }
  }, [status])

  return (
    <div 
      ref={statusRef}
      className="status-box mb-8"
    >
      {status || 'Ready to generate wallet...'}
    </div>
  )
}