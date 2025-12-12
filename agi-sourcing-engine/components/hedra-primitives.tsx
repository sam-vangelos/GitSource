"use client"

import React from "react"
import { cn } from "@/lib/utils"

// Design System Tokens
export const tokens = {
  colors: {
    founder: {
      primary: "#E17B7B",
      primaryDark: "#D16B6B",
      primaryLight: "#E88B8B",
      coral: "#E17B7B",
      coralDark: "#D16B6B",
      coralLight: "#E88B8B",
      accent: "#8B5A3C",
      grayInternal: "#525252",
      grayInternalHover: "#565656",
      textPrimary: "#ffffff",
      textSecondary: "rgba(255, 255, 255, 0.85)",
      textTertiary: "rgba(255, 255, 255, 0.65)",
      textMuted: "rgba(255, 255, 255, 0.50)",
    },
    semantic: {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
  },
  typography: {
    hero: "text-7xl md:text-8xl lg:text-9xl font-thin leading-[1.1] tracking-tight",
    h1: "text-4xl font-light tracking-wide",
    h2: "text-2xl font-semibold",
    h3: "text-xl font-semibold",
    h4: "text-lg font-medium",
    body: "text-sm",
    caption: "text-xs",
    label: "text-sm font-medium",
  },
}

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "success" | "warning" | "error" | "neutral"
  size?: "navigation" | "hero" | "primary" | "secondary" | "tertiary" | "minimal"
  view?: "founder" | "internal"
  loading?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}

export function Button({
  variant = "primary",
  size = "secondary",
  view = "founder",
  loading = false,
  icon,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    "relative inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden"

  const sizeClasses = {
    navigation: "px-8 py-4 text-base rounded-2xl min-h-[52px] font-bold",
    hero: "px-8 py-3.5 text-sm rounded-xl min-h-[48px] font-bold",
    primary: "px-6 text-sm rounded-xl h-[44px] font-semibold flex items-center justify-center",
    secondary: "px-5 py-2.5 text-sm rounded-xl min-h-[40px] font-medium",
    tertiary: "px-4 py-2 text-xs rounded-lg min-h-[36px] font-medium",
    minimal: "px-3 py-1.5 text-xs rounded-lg min-h-[32px] font-medium",
  }

  const variantClasses = {
    primary: `
      bg-gradient-to-b from-[#E17B7B] via-[#E17B7B] to-[#D16B6B]
      hover:from-[#E88B8B] hover:via-[#E17B7B] hover:to-[#D16B6B]
      text-white font-semibold
      shadow-[0_8px_25px_rgba(225,123,123,0.4),_0_4px_12px_rgba(225,123,123,0.3),_0_2px_6px_rgba(0,0,0,0.2)]
      hover:shadow-[0_12px_35px_rgba(225,123,123,0.5),_0_6px_18px_rgba(225,123,123,0.4),_0_3px_8px_rgba(0,0,0,0.3)]
      focus:ring-[#E17B7B]/50
      border border-[#E17B7B]/20
      before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:via-transparent before:to-transparent before:opacity-60 before:transition-opacity before:duration-300
      hover:before:opacity-80
      after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/10 after:via-transparent after:to-transparent after:opacity-40
    `,
    secondary: `
      bg-gradient-to-b from-[#525252] via-[#525252] to-[#565656]
      hover:from-[#565656] hover:via-[#525252] hover:to-[#565656]
      text-white font-semibold
      shadow-[0_8px_30px_rgba(0,0,0,0.4),_0_4px_15px_rgba(0,0,0,0.3),_0_15px_45px_rgba(0,0,0,0.2)]
      hover:shadow-[0_12px_40px_rgba(0,0,0,0.5),_0_6px_20px_rgba(0,0,0,0.4),_0_20px_60px_rgba(0,0,0,0.3)]
      focus:ring-white/40
      border border-white/10
    `,
    neutral: `
      bg-gradient-to-b from-white/12 via-white/8 to-white/12
      hover:from-white/18 hover:via-white/12 hover:to-white/18
      text-white/80 hover:text-white
      focus:ring-white/30
      border border-white/10
      font-medium
    `,
    ghost: `
      bg-gradient-to-b from-transparent via-white/5 to-transparent
      hover:from-white/8 hover:via-white/12 hover:to-white/8
      text-white/70 hover:text-white
      focus:ring-white/30
      font-medium
    `,
    success: `
      bg-gradient-to-b from-[#10b981] via-[#10b981] to-[#059669]
      hover:from-[#34d399] hover:via-[#10b981] hover:to-[#059669]
      text-white font-semibold
      shadow-[0_8px_25px_rgba(16,185,129,0.4),_0_4px_12px_rgba(16,185,129,0.3)]
      hover:shadow-[0_12px_35px_rgba(16,185,129,0.5),_0_6px_18px_rgba(16,185,129,0.4)]
      focus:ring-[#10b981]/50
      border border-[#10b981]/20
    `,
    warning: `
      bg-gradient-to-b from-[#f59e0b] via-[#f59e0b] to-[#d97706]
      hover:from-[#fbbf24] hover:via-[#f59e0b] hover:to-[#d97706]
      text-white font-semibold
      focus:ring-[#f59e0b]/50
      border border-[#f59e0b]/20
    `,
    error: `
      bg-gradient-to-b from-[#ef4444] via-[#ef4444] to-[#dc2626]
      hover:from-[#f87171] hover:via-[#ef4444] hover:to-[#dc2626]
      text-white font-semibold
      focus:ring-[#ef4444]/50
      border border-[#ef4444]/20
    `,
  }

  return (
    <button
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        loading && "cursor-wait opacity-75",
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      data-component="button"
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2 relative z-10" />}
      {icon && !loading && (
        <span className="mr-2 relative z-10" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="relative z-10">{children}</span>
    </button>
  )
}

// Card Component
interface CardProps {
  children: React.ReactNode
  variant?: "floating" | "internal" | "candidate" | "interactive" | "elevated" | "unified"
  view?: "founder" | "internal"
  className?: string
  onClick?: () => void
}

export function Card({ children, variant = "unified", view = "founder", className, onClick }: CardProps) {
  const baseClasses = "rounded-3xl transition-all duration-500 relative overflow-hidden"

  const variantClasses = {
    unified: `
      bg-gradient-to-br from-black/20 via-black/15 to-black/20
      backdrop-blur-xl
      shadow-[0_40px_120px_rgba(0,0,0,0.6),_0_20px_70px_rgba(0,0,0,0.4)]
      hover:shadow-[0_50px_150px_rgba(0,0,0,0.7),_0_28px_90px_rgba(0,0,0,0.5)]
      hover:bg-gradient-to-br hover:from-black/25 hover:via-black/20 hover:to-black/25
      hover:scale-[1.002]
      border border-white/10 hover:border-white/15
      before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/8 before:via-white/3 before:to-transparent before:opacity-60 before:pointer-events-none
      relative
    `,
    floating: `
      bg-gradient-to-br from-black/20 via-black/15 to-black/20
      backdrop-blur-xl
      shadow-[0_40px_120px_rgba(0,0,0,0.6),_0_20px_70px_rgba(0,0,0,0.4)]
      hover:shadow-[0_50px_150px_rgba(0,0,0,0.7),_0_28px_90px_rgba(0,0,0,0.5)]
      hover:bg-gradient-to-br hover:from-black/25 hover:via-black/20 hover:to-black/25
      hover:scale-[1.002]
      border border-white/10 hover:border-white/15
    `,
    internal: `
      bg-gradient-to-br from-zinc-800/60 via-zinc-700/50 to-zinc-800/60
      backdrop-blur-xl
      border border-white/10 hover:border-white/15
    `,
    candidate: `
      bg-gradient-to-br from-black/25 via-black/20 to-black/25
      backdrop-blur-xl
      border border-white/10 hover:border-white/15
      hover:bg-gradient-to-br hover:from-black/30 hover:via-black/25 hover:to-black/30
    `,
    interactive: `
      bg-gradient-to-br from-black/20 via-black/15 to-black/20
      hover:bg-gradient-to-br hover:from-black/25 hover:via-black/20 hover:to-black/25
      backdrop-blur-xl
      cursor-pointer hover:scale-[1.005]
      border border-white/10 hover:border-white/15
    `,
    elevated: `
      bg-gradient-to-br from-black/25 via-black/20 to-black/25
      backdrop-blur-xl
      border border-white/15 hover:border-white/20
    `,
  }

  const Component = onClick ? "button" : "div"

  return (
    <Component
      className={cn(
        baseClasses,
        variantClasses[variant],
        onClick && "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current/50",
        "relative z-20",
        className,
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      data-component="card"
      data-variant={variant}
      data-view={view}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-transparent via-white/1 to-white/2 pointer-events-none opacity-20 z-10" />
      <div className="relative z-30">{children}</div>
    </Component>
  )
}

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  view?: "founder" | "internal"
}

export function Input({
  label,
  error,
  icon,
  iconPosition = "left",
  view = "founder",
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

  const inputClasses =
    view === "founder"
      ? "w-full px-4 py-3 bg-gradient-to-br from-[#525252] via-[#565656] to-[#525252] rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E17B7B]/40 transition-all duration-300 hover:from-[#565656] hover:via-[#5a5a5a] hover:to-[#565656] h-[44px] font-medium border border-white/20"
      : "w-full px-4 py-3 bg-zinc-700 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 hover:bg-zinc-600/50 h-[44px] border border-zinc-600"

  return (
    <div className="w-full" data-component="input-wrapper">
      {label && (
        <label htmlFor={inputId} className="block text-white text-sm font-semibold mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === "left" && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70">{icon}</div>
        )}
        <input
          id={inputId}
          className={cn(
            inputClasses,
            icon && iconPosition === "left" && "pl-12",
            icon && iconPosition === "right" && "pr-12",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/50",
            className,
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId}-error` : undefined}
          data-component="input"
          data-view={view}
          {...props}
        />
        {icon && iconPosition === "right" && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70">{icon}</div>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

// Tag Component
interface TagProps {
  children: React.ReactNode
  variant?: "default" | "success" | "warning" | "error" | "info" | "primary" | "neutral" | "secondary"
  size?: "sm" | "md"
  className?: string
  onClick?: () => void
}

export function Tag({ children, variant = "default", size = "md", className, onClick }: TagProps) {
  const baseClasses =
    "inline-flex items-center font-medium rounded-full border transition-all duration-300 relative overflow-hidden"

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  }

  const variantClasses = {
    default:
      "bg-gradient-to-r from-orange-500/30 via-orange-400/25 to-orange-500/30 text-orange-300 hover:from-orange-500/40 hover:via-orange-400/35 hover:to-orange-500/40 border-orange-500/30",
    primary:
      "bg-gradient-to-r from-[#E17B7B]/30 via-[#EA7F7F]/25 to-[#E17B7B]/30 text-[#EA7F7F] hover:from-[#E17B7B]/40 hover:via-[#EA7F7F]/35 hover:to-[#E17B7B]/40 border-[#E17B7B]/30",
    secondary:
      "bg-gradient-to-r from-blue-500/30 via-blue-400/25 to-blue-500/30 text-blue-300 hover:from-blue-500/40 hover:via-blue-400/35 hover:to-blue-500/40 border-blue-500/30",
    neutral:
      "bg-gradient-to-br from-[#525252] via-[#565656] to-[#525252] text-white hover:from-[#565656] hover:via-[#5a5a5a] hover:to-[#565656] border-white/20",
    success:
      "bg-gradient-to-r from-green-500/30 via-green-400/25 to-green-500/30 text-green-300 hover:from-green-500/40 hover:via-green-400/35 hover:to-green-500/40 border-green-500/30",
    warning:
      "bg-gradient-to-r from-yellow-500/30 via-yellow-400/25 to-yellow-500/30 text-yellow-300 hover:from-yellow-500/40 hover:via-yellow-400/35 hover:to-yellow-500/40 border-yellow-500/30",
    error:
      "bg-gradient-to-r from-red-500/30 via-red-400/25 to-red-500/30 text-red-300 hover:from-red-500/40 hover:via-red-400/35 hover:to-red-500/40 border-red-500/30",
    info: "bg-gradient-to-r from-blue-500/30 via-blue-400/25 to-blue-500/30 text-blue-300 hover:from-blue-500/40 hover:via-blue-400/35 hover:to-blue-500/40 border-blue-500/30",
  }

  const Component = onClick ? "button" : "span"

  return (
    <Component
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        onClick &&
          "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current/50 cursor-pointer",
        className,
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      data-component="tag"
      data-variant={variant}
    >
      <span className="relative z-10">{children}</span>
      {onClick && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}
    </Component>
  )
}

// PageShell Component
interface PageShellProps {
  children: React.ReactNode
  view?: "founder" | "internal"
  title?: string | React.ReactNode
  subtitle?: string
  className?: string
}

export function PageShell({ children, view = "founder", title, subtitle, className }: PageShellProps) {
  if (view === "internal") {
    return (
      <div className={cn("min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800", className)}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {title && (
            <div className="mb-8">
              <h1 className="text-4xl font-light tracking-wide text-white mb-2">{title}</h1>
              {subtitle && <p className="text-slate-300">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </div>
    )
  }

  // FOUNDER VIEW: Enhanced Background System
  return (
    <div
      className={cn("relative", className)}
      style={{
        minHeight: "100vh",
        position: "relative",
        isolation: "isolate",
        zIndex: 1, // Lower z-index for background content
      }}
      data-background-container="true"
      data-view="founder"
    >
      {/* Background System */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -10,
          isolation: "isolate",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        data-background-layers="true"
      >
        {/* Layer 1: Base Brown */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 1,
            background: "#8B5A3C",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          data-layer="base"
        />

        {/* Layer 2: Primary Smokey Ombre */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 2,
            background: `
              radial-gradient(ellipse 800px 600px at 25% 80%, #3a3a3a 0%, #4a4a3a 20%, #6a6a6a 40%, transparent 70%),
              radial-gradient(ellipse 700px 550px at 75% 85%, #2a2a2a 0%, #4a4a4a 25%, #7a7a7a 50%, transparent 80%),
              radial-gradient(ellipse 600px 500px at 50% 90%, #1a1a1a 0%, #5a5a5a 30%, #8a8a8a 60%, transparent 90%)
            `,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          data-layer="primary-smoke"
        />

        {/* Layer 3: Secondary Smokey Ombre */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 3,
            background: `
              linear-gradient(to top, #2a2a2a 0%, #4a4a4a 15%, #5a5a5a 30%, #7a7a7a 45%, transparent 80%),
              radial-gradient(ellipse 900px 400px at 30% 95%, #1a1a1a 0%, #5a5a5a 40%, transparent 80%),
              radial-gradient(ellipse 1000px 450px at 70% 95%, #2a2a2a 0%, #6a6a6a 50%, transparent 85%)
            `,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          data-layer="secondary-smoke"
        />

        {/* Layer 4: Final Smokey Layer */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 4,
            background: `linear-gradient(to top, #1a1a1a 0%, #3a3a3a 10%, #5a5a5a 20%, #7a7a7a 35%, transparent 80%)`,
            opacity: 0.85,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          data-layer="final-smoke"
        />

        {/* Layer 5: Consistency Layer */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 5,
            background: `
              radial-gradient(ellipse 1200px 800px at 50% 100%, #2a2a2a 0%, #4a4a4a 20%, transparent 60%),
              linear-gradient(to top, rgba(26, 26, 26, 0.8) 0%, rgba(58, 58, 58, 0.4) 30%, transparent 70%)
            `,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          data-layer="consistency-smoke"
        />
      </div>

      {/* Content Container */}
      <div
        className="relative"
        style={{
          minHeight: "100vh",
          zIndex: 10,
          isolation: "isolate",
          background: "transparent",
        }}
        data-content-container="true"
      >
        {title && (
          <div
            className="text-center pt-24 pb-16 px-6 animate-emerge-from-smoke"
            style={{
              zIndex: 20, // Keep hero lower than modal
              position: "relative",
              isolation: "isolate",
              background: "transparent",
            }}
            data-title-container="true"
          >
            <div
              className="text-white bg-gradient-to-b from-white to-white/90 bg-clip-text text-transparent drop-shadow-2xl"
              style={{
                lineHeight: "1.1",
                letterSpacing: "-0.025em",
              }}
            >
              {React.isValidElement(title) ? title : <h1 className={tokens.typography.hero}>{title}</h1>}
            </div>
            {subtitle && (
              <p className="text-white/80 text-lg bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent mt-4">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Main Content */}
        <div
          style={{
            minHeight: "calc(100vh - 300px)",
            position: "relative",
            zIndex: 15, // Keep content lower than modal
            isolation: "isolate",
            background: "transparent",
          }}
          data-main-content="true"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

// Loading Components
export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return <div className={cn("animate-spin rounded-full border-b-2 border-current", sizeClasses[size])} />
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-white/10 rounded", className)} />
}
