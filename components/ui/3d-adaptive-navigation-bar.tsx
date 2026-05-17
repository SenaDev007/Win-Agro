"use client";

import React, { useState, useRef, useEffect } from 'react'
import { motion, useSpring, AnimatePresence } from 'framer-motion'

interface NavItem {
  label: string
  id: string
}

/**
 * 3D Adaptive Navigation Pill
 * Smart navigation with scroll detection and hover expansion
 */
export const PillBase: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero')
  const [expanded, setExpanded] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevSectionRef = useRef('hero')
  
  const navItems: NavItem[] = [
    { label: 'Accueil', id: 'hero' },
    { label: 'Services', id: 'services' },
    { label: 'Produits', id: 'produits' },
    { label: 'À propos', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ]

  // Spring animations for smooth motion
  const pillWidth = useSpring(140, { stiffness: 220, damping: 25, mass: 1 })
  const pillShift = useSpring(0, { stiffness: 220, damping: 25, mass: 1 })

  // Handle hover expansion
  useEffect(() => {
    if (hovering) {
      setExpanded(true)
      pillWidth.set(620) // Slightly wider to hold 5 items cleanly
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    } else {
      hoverTimeoutRef.current = setTimeout(() => {
        setExpanded(false)
        pillWidth.set(140)
      }, 600)
    }

    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [hovering, pillWidth])

  const handleMouseEnter = () => {
    setHovering(true)
  }

  const handleMouseLeave = () => {
    setHovering(false)
  }

  const handleSectionClick = (sectionId: string) => {
    // Trigger transition state
    setIsTransitioning(true)
    prevSectionRef.current = sectionId
    setActiveSection(sectionId)
    
    // Collapse the pill after selection
    setHovering(false)
    
    // Smooth scroll to the section
    const targetElement = document.querySelector(`#${sectionId}`);
    if (targetElement) {
      const offset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }

    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
    }, 400)
  }

  const activeItem = navItems.find(item => item.id === activeSection)

  return (
    <motion.nav
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-full"
      style={{
        width: pillWidth,
        height: '56px',
        background: `
          linear-gradient(135deg, 
            #076B37 0%, 
            #08773D 15%, 
            #098947 30%, 
            #08773D 45%, 
            #076B37 60%, 
            #065E30 75%, 
            #05522A 90%, 
            #076B37 100%
          )
        `,
        boxShadow: expanded
          ? `
            0 2px 4px rgba(0, 0, 0, 0.12),
            0 6px 12px rgba(7, 107, 55, 0.2),
            0 12px 24px rgba(7, 107, 55, 0.25),
            0 24px 48px rgba(0, 0, 0, 0.15),
            inset 0 2px 2px rgba(255, 255, 255, 0.2),
            inset 0 -3px 8px rgba(0, 0, 0, 0.25),
            inset 3px 3px 8px rgba(0, 0, 0, 0.2),
            inset -3px 3px 8px rgba(0, 0, 0, 0.18),
            inset 0 -1px 2px rgba(0, 0, 0, 0.15)
          `
          : isTransitioning
          ? `
            0 3px 6px rgba(0, 0, 0, 0.15),
            0 8px 16px rgba(7, 107, 55, 0.15),
            0 16px 32px rgba(7, 107, 55, 0.12),
            0 1px 2px rgba(0, 0, 0, 0.15),
            inset 0 2px 1px rgba(255, 255, 255, 0.25),
            inset 0 -2px 6px rgba(0, 0, 0, 0.2),
            inset 2px 2px 8px rgba(0, 0, 0, 0.15),
            inset -2px 2px 8px rgba(0, 0, 0, 0.12),
            inset 0 0 1px rgba(0, 0, 0, 0.25)
          `
          : `
            0 3px 6px rgba(0, 0, 0, 0.18),
            0 8px 16px rgba(7, 107, 55, 0.18),
            0 16px 32px rgba(7, 107, 55, 0.15),
            0 1px 2px rgba(0, 0, 0, 0.18),
            inset 0 2px 1px rgba(255, 255, 255, 0.25),
            inset 0 -2px 6px rgba(0, 0, 0, 0.22),
            inset 2px 2px 8px rgba(0, 0, 0, 0.18),
            inset -2px 2px 8px rgba(0, 0, 0, 0.15),
            inset 0 0 1px rgba(0, 0, 0, 0.25)
          `,
        x: pillShift,
        overflow: 'hidden',
        transition: 'box-shadow 0.3s ease-out',
      }}
    >
      {/* Primary top edge ridge - ultra bright gold/yellow for Win Agro theme */}
      <div 
        className="absolute inset-x-0 top-0 rounded-t-full pointer-events-none"
        style={{
          height: '2px',
          background: 'linear-gradient(90deg, rgba(253, 221, 0, 0) 0%, rgba(253, 221, 0, 0.95) 5%, rgba(253, 221, 0, 1) 15%, rgba(253, 221, 0, 1) 85%, rgba(253, 221, 0, 0.95) 95%, rgba(253, 221, 0, 0) 100%)',
          filter: 'blur(0.3px)',
        }}
      />
      
      {/* Top hemisphere light catch */}
      <div 
        className="absolute inset-x-0 top-0 rounded-full pointer-events-none"
        style={{
          height: '55%',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 30%, rgba(255, 255, 255, 0.05) 60%, rgba(255, 255, 255, 0) 100%)',
        }}
      />
      
      {/* Directional light - top left */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 20%, rgba(255, 255, 255, 0.03) 40%, rgba(255, 255, 255, 0) 65%)',
        }}
      />
      
      {/* Premium gloss reflection - main */}
      <div 
        className="absolute rounded-full pointer-events-none"
        style={{
          left: expanded ? '18%' : '15%',
          top: '16%',
          width: expanded ? '140px' : '60px',
          height: '14px',
          background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.18) 40%, rgba(255, 255, 255, 0.05) 70%, rgba(255, 255, 255, 0) 100%)',
          filter: 'blur(4px)',
          transform: 'rotate(-12deg)',
          transition: 'all 0.3s ease',
        }}
      />
      
      {/* Secondary gloss accent - only show when expanded */}
      {expanded && (
        <div 
          className="absolute rounded-full pointer-events-none"
          style={{
            right: '22%',
            top: '20%',
            width: '80px',
            height: '10px',
            background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.08) 60%, rgba(255, 255, 255, 0) 100%)',
            filter: 'blur(3px)',
            transform: 'rotate(8deg)',
          }}
        />
      )}
      
      {/* Left edge illumination - only show when expanded */}
      {expanded && (
        <div 
          className="absolute inset-y-0 left-0 rounded-l-full pointer-events-none"
          style={{
            width: '35%',
            background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 40%, rgba(255, 255, 255, 0.01) 70%, rgba(255, 255, 255, 0) 100%)',
          }}
        />
      )}
      
      {/* Right edge shadow - only show when expanded */}
      {expanded && (
        <div 
          className="absolute inset-y-0 right-0 rounded-r-full pointer-events-none"
          style={{
            width: '35%',
            background: 'linear-gradient(270deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.1) 40%, rgba(0, 0, 0, 0.05) 70%, rgba(0, 0, 0, 0) 100%)',
          }}
        />
      )}
      
      {/* Bottom curvature - deep shadow */}
      <div 
        className="absolute inset-x-0 bottom-0 rounded-b-full pointer-events-none"
        style={{
          height: '50%',
          background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.15) 25%, rgba(0, 0, 0, 0.05) 50%, rgba(0, 0, 0, 0) 100%)',
        }}
      />

      {/* Bottom edge contact shadow */}
      <div 
        className="absolute inset-x-0 bottom-0 rounded-b-full pointer-events-none"
        style={{
          height: '20%',
          background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 100%)',
          filter: 'blur(2px)',
        }}
      />

      {/* Inner diffuse glow */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 40px rgba(255, 255, 255, 0.15)',
          opacity: 0.7,
        }}
      />
      
      {/* Micro edge definition */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 0 0.5px rgba(0, 0, 0, 0.2)',
        }}
      />

      {/* Navigation items container */}
      <div 
        ref={containerRef}
        className="relative z-10 h-full flex items-center justify-center px-6"
        style={{
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro", Poppins, sans-serif',
        }}
      >
        {/* Collapsed state - show only active section with smooth text transitions */}
        {!expanded && (
          <div className="flex items-center relative">
            <AnimatePresence mode="wait">
              {activeItem && (
                <motion.span
                  key={activeItem.id}
                  initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                  transition={{
                    duration: 0.35,
                    ease: [0.4, 0.0, 0.2, 1]
                  }}
                  style={{
                    fontSize: '15.5px',
                    fontWeight: 680,
                    color: '#FDDD00', // Gold/Yellow active color for Win Agro
                    letterSpacing: '0.45px',
                    whiteSpace: 'nowrap',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", Poppins, sans-serif',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textShadow: `
                      0 1px 0 rgba(0, 0, 0, 0.5),
                      0 -1px 0 rgba(0, 0, 0, 0.3),
                      1px 1px 0 rgba(0, 0, 0, 0.2)
                    `,
                  }}
                >
                  {activeItem.label}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Expanded state - show all sections with stagger */}
        {expanded && (
          <div className="flex items-center justify-evenly w-full gap-2">
            {navItems.map((item, index) => {
              const isActive = item.id === activeSection
              
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ 
                    delay: index * 0.08,
                    duration: 0.25,
                    ease: 'easeOut'
                  }}
                  onClick={() => handleSectionClick(item.id)}
                  className="relative cursor-pointer transition-all duration-200"
                  style={{
                    fontSize: isActive ? '15px' : '14.5px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#FDDD00' : '#E6F4EC', // Yellow active / Light cream pale green inactive
                    textDecoration: 'none',
                    letterSpacing: '0.45px',
                    background: 'transparent',
                    border: 'none',
                    padding: '8px 12px',
                    outline: 'none',
                    whiteSpace: 'nowrap',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", Poppins, sans-serif',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    transform: isActive ? 'translateY(-1.5px)' : 'translateY(0)',
                    textShadow: isActive 
                      ? `
                        0 1px 0 rgba(0, 0, 0, 0.6),
                        0 -1px 0 rgba(0, 0, 0, 0.3),
                        1px 1px 0 rgba(0, 0, 0, 0.2)
                      `
                      : `
                        0 1px 0 rgba(0, 0, 0, 0.4),
                        0 -1px 0 rgba(0, 0, 0, 0.2)
                      `,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#ffffff'
                      e.currentTarget.style.transform = 'translateY(-0.5px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#E6F4EC'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }
                  }}
                >
                  {item.label}
                </motion.button>
              )
            })}
          </div>
        )}
      </div>
    </motion.nav>
  )
}
