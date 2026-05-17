"use client";

import { useState } from 'react';
import { FaLinkedinIn, FaTwitter, FaBehance, FaInstagram } from 'react-icons/fa';
import { cn } from '@/lib/utils';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    behance?: string;
  };
}

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Victoire AHOGNON',
    role: 'FONDATRICE & DIRECTRICE',
    image: '/victoire_terrain.jpg',
    social: { linkedin: 'https://www.linkedin.com/in/victoire-ahognon-1b1b1b1b' },
  },
];

interface TeamShowcaseProps {
  members?: TeamMember[];
}

export default function TeamShowcase({ members = DEFAULT_MEMBERS }: TeamShowcaseProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Spotlight layout if there is only 1 member (Victoire alone)
  if (members.length === 1) {
    const member = members[0];
    const isActive = hoveredId === member.id;
    
    return (
      <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-6 sm:gap-8 select-none w-full max-w-xl mx-auto py-4 font-sans">
        {/* Photo Container */}
        <div
          className={cn(
            "relative w-[220px] h-[260px] sm:w-[240px] sm:h-[300px] overflow-hidden rounded-2xl cursor-pointer flex-shrink-0 border-2 border-primary-green/20 shadow-lg transition-all duration-500",
            isActive ? "ring-4 ring-primary-green scale-[1.02]" : ""
          )}
          onMouseEnter={() => setHoveredId(member.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover transition-all duration-750 rounded-2xl"
            style={{
              filter: isActive ? "grayscale(0) brightness(1.05)" : "grayscale(1) brightness(0.85)"
            }}
          />
          {/* Subtle overlay accent */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Details */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left justify-center flex-1 w-full py-2">
          <div className="inline-block px-3 py-1 rounded-full bg-primary-pale text-primary-green text-[10px] font-sans font-black uppercase tracking-wider mb-3">
            FONDATRICE DE WIN AGRO
          </div>
          
          <h4 className="text-2xl font-extrabold text-primary-deep tracking-tight font-serif mb-1">
            {member.name}
          </h4>
          
          <p className="text-xs font-black uppercase tracking-[0.15em] text-primary-green mb-4">
            {member.role}
          </p>

          <p className="text-gray-600 text-sm font-sans leading-relaxed mb-5 max-w-sm">
            Ingénieure agronome passionnée et spécialiste de l'aviculture biologique au Bénin. Elle accompagne au quotidien les éleveurs vers l'excellence technique et financière, s'assurant que chaque projet devienne une source de revenus stable et florissante.
          </p>

          {member.social?.linkedin && (
            <a
              href={member.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-green hover:bg-primary-deep text-white text-xs font-sans font-bold transition-all duration-300 shadow-md hover:-translate-y-0.5 active:translate-y-0"
            >
              <FaLinkedinIn size={12} className="shrink-0" /> Rejoindre sur LinkedIn
            </a>
          )}
        </div>
      </div>
    );
  }

  // Otherwise, render multi-column layout for multiple team members
  const col1 = members.filter((_, i) => i % 3 === 0);
  const col2 = members.filter((_, i) => i % 3 === 1);
  const col3 = members.filter((_, i) => i % 3 === 2);

  return (
    <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8 select-none w-full max-w-full mx-auto py-4 font-sans">
      {/* ── Left: photo grid ── */}
      <div className="flex gap-2 sm:gap-3 flex-shrink-0 overflow-x-auto pb-1 md:pb-0 mx-auto md:mx-0">
        {/* Column 1 */}
        <div className="flex flex-col gap-2 sm:gap-3">
          {col1.map((member) => (
            <PhotoCard
              key={member.id}
              member={member}
              className="w-[90px] h-[100px] sm:w-[110px] sm:h-[120px] md:w-[125px] md:h-[135px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-2 sm:gap-3 mt-[38px] sm:mt-[48px] md:mt-[56px]">
          {col2.map((member) => (
            <PhotoCard
              key={member.id}
              member={member}
              className="w-[100px] h-[110px] sm:w-[122px] sm:h-[132px] md:w-[138px] md:h-[148px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-2 sm:gap-3 mt-[18px] sm:mt-[22px] md:mt-[26px]">
          {col3.map((member) => (
            <PhotoCard
              key={member.id}
              member={member}
              className="w-[95px] h-[105px] sm:w-[115px] sm:h-[125px] md:w-[130px] md:h-[140px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>
      </div>

      {/* ── Right: member name list ── */}
      <div className="flex flex-col sm:grid sm:grid-cols-2 md:flex md:flex-col gap-3 md:gap-4 pt-4 md:pt-2 flex-1 w-full">
        {members.map((member) => (
          <MemberRow
            key={member.id}
            member={member}
            hoveredId={hoveredId}
            onHover={setHoveredId}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Photo card 
───────────────────────────────────────── */

function PhotoCard({
  member,
  className,
  hoveredId,
  onHover,
}: {
  member: TeamMember;
  className: string;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const isActive = hoveredId === member.id;
  const isDimmed = hoveredId !== null && !isActive;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl cursor-pointer flex-shrink-0 transition-opacity duration-300 border border-primary-green/10 shadow-sm',
        className,
        isDimmed ? 'opacity-40' : 'opacity-100',
        isActive ? 'ring-2 ring-primary-green scale-105 transition-transform duration-300' : ''
      )}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
    >
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover transition-[filter] duration-500 rounded-xl"
        style={{
          filter: isActive ? 'grayscale(0) brightness(1)' : 'grayscale(1) brightness(0.77)',
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   Member name section
───────────────────────────────────────── */

function MemberRow({
  member,
  hoveredId,
  onHover,
}: {
  member: TeamMember;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const isActive = hoveredId === member.id;
  const isDimmed = hoveredId !== null && !isActive;
  const hasSocial = member.social?.twitter ?? member.social?.linkedin ?? member.social?.instagram ?? member.social?.behance;

  return (
    <div
      className={cn(
        'cursor-pointer transition-opacity duration-300 p-2 rounded-xl hover:bg-primary-pale/40',
        isDimmed ? 'opacity-50' : 'opacity-100',
        isActive ? 'bg-primary-pale/60' : '',
      )}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Name + social */}
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'w-3 h-2 rounded-[5px] flex-shrink-0 transition-all duration-300',
            isActive ? 'bg-primary-green w-4' : 'bg-primary-green/20',
          )}
        />
        <span
          className={cn(
            'text-sm md:text-base font-bold leading-none tracking-tight transition-colors duration-300',
            isActive ? 'text-primary-deep' : 'text-primary-deep/80',
          )}
        >
          {member.name}
        </span>

        {/* Social icons */}
        {hasSocial && (
          <div
            className={cn(
              'flex items-center gap-1.5 ml-auto transition-all duration-200',
              isActive
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-2 pointer-events-none',
            )}
          >
            {member.social?.twitter && member.social.twitter !== '#' && (
              <a
                href={member.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded text-primary-green hover:text-primary-deep hover:bg-primary-green/10 transition-all duration-150 hover:scale-110"
                title="X / Twitter"
              >
                <FaTwitter size={10} />
              </a>
            )}
            {member.social?.linkedin && member.social.linkedin !== '#' && (
              <a
                href={member.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded text-primary-green hover:text-primary-deep hover:bg-primary-green/10 transition-all duration-150 hover:scale-110"
                title="LinkedIn"
              >
                <FaLinkedinIn size={10} />
              </a>
            )}
            {member.social?.instagram && member.social.instagram !== '#' && (
              <a
                href={member.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded text-primary-green hover:text-primary-deep hover:bg-primary-green/10 transition-all duration-150 hover:scale-110"
                title="Instagram"
              >
                <FaInstagram size={10} />
              </a>
            )}
            {member.social?.behance && member.social.behance !== '#' && (
              <a
                href={member.social.behance}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded text-primary-green hover:text-primary-deep hover:bg-primary-green/10 transition-all duration-150 hover:scale-110"
                title="Behance"
              >
                <FaBehance size={10} />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Role */}
      <p className="mt-1 pl-[20px] text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] text-primary-green">
        {member.role}
      </p>
    </div>
  );
}
