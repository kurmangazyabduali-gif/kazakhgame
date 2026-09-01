'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useQolKuresStore } from '../store/useQolKuresStore'

export function AthletesRenderer() {
  const { physicsState, playerPressing, aiPressing, gameStatus } = useQolKuresStore()
  const { position, isFinished } = physicsState

  const isTense = (playerPressing || aiPressing) && gameStatus === 'PLAYING'
  
  // Screen Shake effect
  const vibX = isTense ? (Math.random() * 6 - 3) : 0
  const vibY = isTense ? (Math.random() * 6 - 3) : 0

  const zoom = isFinished ? 1.08 : (isTense ? 1.02 : 1.0)

  // 1000x600 Coordinate System (Widescreen 2D Game Style)
  const shoulderL = { x: 200, y: 260 }
  const elbowL = { x: 370, y: 460 }

  const shoulderR = { x: 800, y: 260 }
  const elbowR = { x: 630, y: 460 }

  // Hand position arcs
  const xHand = 500 + position * 180 + vibX
  const yHand = 260 + Math.abs(position) * 160 + vibY

  // Leaning based on winning/losing
  const playerLean = position * 35
  const aiLean = position * 35

  // Bicep contraction (Cartoon style dynamic shapes)
  const playerBicep = position > 0 ? position * 15 : 0
  const aiBicep = position < 0 ? Math.abs(position) * 15 : 0

  // Colors
  const outline = "#1a0f0a"
  const skinL = "#f4d0b0"
  const skinLShadow = "#d5a882"
  const skinR = "#df9e72"
  const skinRShadow = "#ab683f"

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-[#1c0f0a] rounded-xl shadow-2xl border-2 border-[#3d2417]">
      <motion.div
        animate={{ scale: zoom }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="w-full h-full max-w-[1200px] aspect-[5/3] relative"
      >
        <svg 
          viewBox="0 0 1000 600" 
          className="absolute inset-0 w-full h-full z-10 pointer-events-none select-none"
        >
          {/* === 1. YURT BACKGROUND === */}
          <g id="bg-yurt">
            <rect width="1000" height="600" fill="#2d1712" />
            
            {/* Kerege (Wooden lattice walls) */}
            <g stroke="#1a0d0a" strokeWidth="4" opacity="0.6">
              {Array.from({ length: 25 }).map((_, i) => (
                <React.Fragment key={`k-${i}`}>
                  <line x1={i * 60 - 200} y1="0" x2={i * 60 + 400} y2="600" />
                  <line x1={i * 60 + 400} y1="0" x2={i * 60 - 200} y2="600" />
                </React.Fragment>
              ))}
            </g>

            {/* Glowing Shanyrak (Roof) */}
            <circle cx="500" cy="-80" r="250" fill="#422017" stroke="#d4af37" strokeWidth="12" opacity="0.8" />
            <g stroke="#d4af37" strokeWidth="8" opacity="0.6">
              <line x1="300" y1="-80" x2="700" y2="-80" />
              <line x1="350" y1="-200" x2="650" y2="40" />
              <line x1="650" y1="-200" x2="350" y2="40" />
            </g>

            {/* Background Spotlights */}
            <ellipse cx="500" cy="300" rx="400" ry="250" fill="#ffb347" opacity="0.08" filter="blur(20px)" />
          </g>


          {/* === 2. PLAYER BATYR (LEFT) === */}
          <g id="player-batyr" transform={`translate(${playerLean}, 0)`}>
            {/* Chapan (Robe) */}
            <path d="M -50 600 L 150 250 L 300 250 L 380 600 Z" fill="#e8dfd3" stroke={outline} strokeWidth="6" strokeLinejoin="round" />
            {/* Gold ornaments on robe */}
            <path d="M 150 250 L 220 400 L 300 250" fill="#a42621" stroke={outline} strokeWidth="5" strokeLinejoin="round" />
            <path d="M 170 250 L 220 360 L 270 250" fill="#d4af37" stroke={outline} strokeWidth="4" strokeLinejoin="round" />
            
            {/* Neck */}
            <path d="M 180 250 L 190 200 L 230 200 L 240 250 Z" fill={skinLShadow} stroke={outline} strokeWidth="5" strokeLinejoin="round" />
            
            {/* Face */}
            <path d="M 170 180 Q 170 240 215 240 Q 250 240 250 180 L 250 140 L 170 140 Z" fill={skinL} stroke={outline} strokeWidth="6" strokeLinejoin="round" />
            
            {/* Ear */}
            <circle cx="170" cy="180" r="12" fill={skinL} stroke={outline} strokeWidth="4" />
            
            {/* Facial Features (Intense Anime Style) */}
            {/* Furrowed Eyebrow */}
            <path d="M 205 165 L 240 175" stroke={outline} strokeWidth="6" strokeLinecap="round" />
            {/* Eye */}
            <path d="M 215 180 Q 225 178 235 182" stroke={outline} strokeWidth="4" strokeLinecap="round" />
            {/* Gritting Teeth Mouth */}
            <rect x="215" y="210" width="20" height="8" rx="2" fill="#fff" stroke={outline} strokeWidth="3" />
            <line x1="225" y1="210" x2="225" y2="218" stroke={outline} strokeWidth="2" />

            {/* Traditional Helmet (Tulga) */}
            <path d="M 160 140 Q 210 20 260 140 Z" fill="#727c82" stroke={outline} strokeWidth="6" strokeLinejoin="round" />
            <path d="M 150 140 C 150 160, 270 160, 270 140 Z" fill="#d4af37" stroke={outline} strokeWidth="5" />
            <circle cx="210" cy="25" r="10" fill="#a42621" stroke={outline} strokeWidth="4" />
          </g>


          {/* === 3. AI BATYR (RIGHT) === */}
          <g id="ai-batyr" transform={`translate(${aiLean}, 0)`}>
            {/* Chapan (Armor) */}
            <path d="M 1050 600 L 850 250 L 700 250 L 620 600 Z" fill="#1b2a47" stroke={outline} strokeWidth="6" strokeLinejoin="round" />
            {/* Armor Plates */}
            <path d="M 850 250 L 780 400 L 700 250" fill="#471b1b" stroke={outline} strokeWidth="5" strokeLinejoin="round" />
            <path d="M 830 250 L 780 360 L 730 250" fill="#d4af37" stroke={outline} strokeWidth="4" strokeLinejoin="round" />
            
            {/* Neck */}
            <path d="M 820 250 L 810 200 L 770 200 L 760 250 Z" fill={skinRShadow} stroke={outline} strokeWidth="5" strokeLinejoin="round" />
            
            {/* Face */}
            <path d="M 830 180 Q 830 240 785 240 Q 750 240 750 180 L 750 140 L 830 140 Z" fill={skinR} stroke={outline} strokeWidth="6" strokeLinejoin="round" />
            
            {/* Ear */}
            <circle cx="830" cy="180" r="12" fill={skinR} stroke={outline} strokeWidth="4" />
            
            {/* Facial Features */}
            {/* Angry Eyebrow */}
            <path d="M 795 165 L 760 175" stroke={outline} strokeWidth="7" strokeLinecap="round" />
            {/* Eye */}
            <path d="M 785 180 Q 775 178 765 182" stroke={outline} strokeWidth="4" strokeLinecap="round" />
            {/* Mouth */}
            <rect x="765" y="210" width="20" height="8" rx="2" fill="#fff" stroke={outline} strokeWidth="3" />
            <line x1="775" y1="210" x2="775" y2="218" stroke={outline} strokeWidth="2" />
            {/* Mustache / Beard */}
            <path d="M 780 205 Q 750 220 755 240 Z" fill="#221109" stroke={outline} strokeWidth="3" />

            {/* Warrior Hat / Boryk */}
            <path d="M 740 140 C 740 70, 840 70, 840 140 Z" fill="#471b1b" stroke={outline} strokeWidth="6" strokeLinejoin="round" />
            {/* Fur brim */}
            <path d="M 730 140 C 730 170, 850 170, 850 140 Z" fill="#3a2720" stroke={outline} strokeWidth="5" />
          </g>


          {/* === 4. TABLE (2.5D Cartoon Style) === */}
          <g id="table">
            {/* Table Legs */}
            <rect x="280" y="490" width="40" height="150" fill="#26120b" stroke={outline} strokeWidth="5" />
            <rect x="680" y="490" width="40" height="150" fill="#26120b" stroke={outline} strokeWidth="5" />
            {/* Crossbeam */}
            <rect x="300" y="560" width="400" height="20" fill="#381b10" stroke={outline} strokeWidth="5" />

            {/* Table Top Base */}
            <polygon points="150,470 850,470 900,520 100,520" fill="#6d3a22" stroke={outline} strokeWidth="6" strokeLinejoin="round" />
            {/* Table Top Surface Highlight */}
            <polygon points="160,475 840,475 880,510 120,510" fill="#8f5032" />
            
            {/* Center Line */}
            <polygon points="495,475 505,475 508,515 492,515" fill="#e8dfd3" stroke={outline} strokeWidth="3" />

            {/* Elbow Pads */}
            {/* Left (Blue) */}
            <polygon points="330,460 410,460 420,480 320,480" fill="#2d6a85" stroke={outline} strokeWidth="5" strokeLinejoin="round" />
            <polygon points="330,460 410,460 415,465 335,465" fill="#499cbd" />
            
            {/* Right (Red) */}
            <polygon points="590,460 670,460 680,480 580,480" fill="#a42621" stroke={outline} strokeWidth="5" strokeLinejoin="round" />
            <polygon points="590,460 670,460 675,465 595,465" fill="#d64942" />

            {/* Touch Pads (Slam targets) */}
            <polygon points="200,480 260,480 270,495 190,495" fill="#a42621" stroke={outline} strokeWidth="4" />
            <polygon points="740,480 800,480 810,495 730,495" fill="#2d6a85" stroke={outline} strokeWidth="4" />

            {/* Metal Pegs (Handles) */}
            <rect x="190" y="380" width="16" height="80" rx="8" fill="#a2aaad" stroke={outline} strokeWidth="4" />
            <rect x="794" y="380" width="16" height="80" rx="8" fill="#a2aaad" stroke={outline} strokeWidth="4" />
          </g>


          {/* === 5. DYNAMIC ARMS (Thick Cartoon Outlines) === */}
          <g id="arms" transform={`translate(0, 0)`}>
            
            {/* --- PLAYER ARM --- */}
            {/* Thick Black Outline Stroke */}
            <path 
              d={`M ${shoulderL.x} ${shoulderL.y} L ${elbowL.x} ${elbowL.y} L ${xHand} ${yHand}`}
              fill="none" stroke={outline} strokeWidth="95" strokeLinecap="round" strokeLinejoin="round"
            />
            {/* Bicep Outline */}
            <path 
              d={`M ${shoulderL.x + 30} ${shoulderL.y + 40} Q ${shoulderL.x + 120 + playerBicep} ${shoulderL.y + 10 - playerBicep} ${elbowL.x - 30} ${elbowL.y - 40}`} 
              fill="none" stroke={outline} strokeWidth={60 + playerBicep} strokeLinecap="round"
            />
            
            {/* Skin Fill Stroke */}
            <path 
              d={`M ${shoulderL.x} ${shoulderL.y} L ${elbowL.x} ${elbowL.y} L ${xHand} ${yHand}`}
              fill="none" stroke={skinL} strokeWidth="83" strokeLinecap="round" strokeLinejoin="round"
            />
            {/* Bicep Skin Fill */}
            <path 
              d={`M ${shoulderL.x + 30} ${shoulderL.y + 40} Q ${shoulderL.x + 120 + playerBicep} ${shoulderL.y + 10 - playerBicep} ${elbowL.x - 30} ${elbowL.y - 40}`} 
              fill="none" stroke={skinL} strokeWidth={48 + playerBicep} strokeLinecap="round"
            />
            
            {/* Inner shadow/muscle details (Line art) */}
            <path 
              d={`M ${shoulderL.x + 20} ${shoulderL.y + 80} L ${elbowL.x - 20} ${elbowL.y - 10}`}
              fill="none" stroke={skinLShadow} strokeWidth="6" strokeLinecap="round"
            />
            {isTense && (
              <path 
                d={`M ${elbowL.x + 10} ${elbowL.y - 20} L ${xHand - 20} ${yHand + 10}`}
                fill="none" stroke="#d64942" strokeWidth="4" strokeDasharray="8 8" opacity="0.8"
              />
            )}


            {/* --- AI ARM --- */}
            {/* Thick Black Outline Stroke */}
            <path 
              d={`M ${shoulderR.x} ${shoulderR.y} L ${elbowR.x} ${elbowR.y} L ${xHand} ${yHand}`}
              fill="none" stroke={outline} strokeWidth="95" strokeLinecap="round" strokeLinejoin="round"
            />
            {/* Bicep Outline */}
            <path 
              d={`M ${shoulderR.x - 30} ${shoulderR.y + 40} Q ${shoulderR.x - 120 - aiBicep} ${shoulderR.y + 10 - aiBicep} ${elbowR.x + 30} ${elbowR.y - 40}`} 
              fill="none" stroke={outline} strokeWidth={60 + aiBicep} strokeLinecap="round"
            />
            
            {/* Skin Fill Stroke */}
            <path 
              d={`M ${shoulderR.x} ${shoulderR.y} L ${elbowR.x} ${elbowR.y} L ${xHand} ${yHand}`}
              fill="none" stroke={skinR} strokeWidth="83" strokeLinecap="round" strokeLinejoin="round"
            />
            {/* Bicep Skin Fill */}
            <path 
              d={`M ${shoulderR.x - 30} ${shoulderR.y + 40} Q ${shoulderR.x - 120 - aiBicep} ${shoulderR.y + 10 - aiBicep} ${elbowR.x + 30} ${elbowR.y - 40}`} 
              fill="none" stroke={skinR} strokeWidth={48 + aiBicep} strokeLinecap="round"
            />
            
            {/* Inner shadow/muscle details */}
            <path 
              d={`M ${shoulderR.x - 20} ${shoulderR.y + 80} L ${elbowR.x + 20} ${elbowR.y - 10}`}
              fill="none" stroke={skinRShadow} strokeWidth="6" strokeLinecap="round"
            />


            {/* --- LOCKED HANDS (Cartoon Fist) --- */}
            <g transform={`translate(${xHand}, ${yHand})`}>
              {/* Back Shadow */}
              <circle cx="0" cy="0" r="35" fill={outline} opacity="0.3" />
              
              {/* Player Thumb Base Outline */}
              <circle cx="-16" cy="-8" r="26" fill={outline} />
              
              {/* AI Fingers Wrapping (Outlines and Fills) */}
              <g stroke={outline} strokeWidth="5">
                <rect x="-30" y="-35" width="55" height="18" rx="9" fill={skinRShadow} transform="rotate(-15)" />
                <rect x="-33" y="-18" width="55" height="18" rx="9" fill={skinR} transform="rotate(-5)" />
                <rect x="-30" y="2" width="52" height="18" rx="9" fill={skinR} transform="rotate(5)" />
                <rect x="-24" y="20" width="48" height="16" rx="8" fill={skinR} transform="rotate(15)" />
              </g>

              {/* Player Thumb Base Fill */}
              <circle cx="-16" cy="-8" r="23" fill={skinLShadow} />

              {/* AI Thumb */}
              <ellipse cx="20" cy="15" rx="18" ry="25" fill={skinRShadow} stroke={outline} strokeWidth="5" transform="rotate(-30)" />

              {/* Player Thumb wrapping */}
              <path 
                d="M -15 -35 Q 15 -45 25 -20 Q 30 0 15 20" 
                fill="none" 
                stroke={outline} 
                strokeWidth="24" 
                strokeLinecap="round" 
              />
              <path 
                d="M -15 -35 Q 15 -45 25 -20 Q 30 0 15 20" 
                fill="none" 
                stroke={skinL} 
                strokeWidth="18" 
                strokeLinecap="round" 
              />
            </g>
          </g>
        </svg>
      </motion.div>
    </div>
  )
}
