import React from 'react';
import { BookmarkIcon, FlameIcon, FormulaIcon } from '../../components/Icons';
import { BRAND, type GlossaryCardData } from '../../data/sesiData';
import { FONT_MONO, FONT_SANS } from '../../motion/fonts';

type Flashcard3DProps = {
  readonly card: GlossaryCardData;
  readonly rotateY: number;
  readonly translateX: number;
  readonly isBookmarked: boolean;
  readonly bookmarkScale: number;
  readonly indexLabel: string;
};

export const Flashcard3D: React.FC<Flashcard3DProps> = ({
  card,
  rotateY,
  translateX,
  isBookmarked,
  bookmarkScale,
  indexLabel,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transformStyle: 'preserve-3d',
        transform: `translateX(${translateX}px) rotateY(${rotateY}deg)`,
      }}
    >
      {/* Front Face */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          borderRadius: 36,
          backgroundColor: card.cardBg,
          border: `1.5px solid ${BRAND.slate300}`,
          boxShadow: '0 28px 70px rgba(15, 23, 42, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 56,
        }}
      >
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 15,
            fontWeight: 800,
            color: card.catColor,
            backgroundColor: card.catBg,
            border: `1px solid ${card.catBorder}`,
            padding: '8px 20px',
            borderRadius: 999,
            marginBottom: 26,
          }}
        >
          {card.cat}
        </div>
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 96,
            fontWeight: 800,
            color: card.catColor,
            letterSpacing: '-0.03em',
          }}
        >
          {card.term}
        </div>
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 28,
            fontWeight: 700,
            color: BRAND.slate700,
            marginTop: 14,
            textAlign: 'center',
          }}
        >
          {card.full}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 28,
            fontFamily: FONT_MONO,
            fontSize: 15,
            color: BRAND.inkSubtle,
          }}
        >
          {indexLabel}
        </div>
      </div>

      {/* Back Face */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: 36,
          backgroundColor: card.cardBg,
          border: `1.5px solid ${BRAND.slate300}`,
          boxShadow: '0 28px 70px rgba(15, 23, 42, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '44px 56px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -80,
            left: -80,
            width: 320,
            height: 320,
            borderRadius: 999,
            background: `radial-gradient(circle, ${card.pillColor}28, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            right: -80,
            width: 340,
            height: 340,
            borderRadius: 999,
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.22), transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ fontFamily: FONT_SANS, fontSize: 17, fontWeight: 800, color: card.catColor }}>
          {card.term}: {card.full}
        </div>

        <div style={{ textAlign: 'center', maxWidth: 780, zIndex: 2 }}>
          <p
            style={{
              fontFamily: FONT_SANS,
              fontSize: 28,
              fontWeight: 600,
              color: BRAND.ink,
              lineHeight: 1.45,
              margin: 0,
            }}
          >
            {card.desc}
          </p>
          {card.formula && (
            <div
              style={{
                marginTop: 26,
                paddingTop: 20,
                borderTop: '1px solid rgba(148, 163, 184, 0.35)',
                fontFamily: FONT_MONO,
                fontSize: 20,
                fontWeight: 700,
                color: card.catColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
            >
              <FormulaIcon size={20} color={card.catColor} />
              <span>{card.formula}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, zIndex: 2 }}>
          <div
            style={{
              padding: '9px 20px',
              borderRadius: 999,
              backgroundColor: BRAND.emeraldSoft,
              border: '1px solid #a7f3d0',
              fontFamily: FONT_SANS,
              fontSize: 15,
              fontWeight: 800,
              color: '#065f46',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <FlameIcon size={16} color="#d97706" />
            <span>✓ Read · Counts toward your daily streak!</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 24px',
              borderRadius: 14,
              backgroundColor: isBookmarked ? BRAND.emerald : BRAND.white,
              border: isBookmarked ? `1px solid ${BRAND.emerald}` : `1px solid ${BRAND.slate300}`,
              color: isBookmarked ? BRAND.white : BRAND.slate800,
              fontFamily: FONT_SANS,
              fontSize: 17,
              fontWeight: 800,
              transform: `scale(${bookmarkScale})`,
              boxShadow: isBookmarked
                ? '0 8px 24px rgba(5, 150, 105, 0.35)'
                : '0 2px 8px rgba(15, 23, 42, 0.06)',
            }}
          >
            <BookmarkIcon size={20} color="currentColor" filled={isBookmarked} />
            <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
