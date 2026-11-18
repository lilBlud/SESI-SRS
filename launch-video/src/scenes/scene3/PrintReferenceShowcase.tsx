import React from 'react';
import { Interactive } from 'remotion';
import { PrinterIcon } from '../../components/Icons';
import { BRAND, RESET2030_METRICS, type GlossaryCardData } from '../../data/sesiData';
import { FONT_MONO, FONT_SANS } from '../../motion/fonts';

type PrintReferenceShowcaseProps = {
  readonly cards: readonly GlossaryCardData[];
  readonly hubOpacity: number;
  readonly hubScale: number;
  readonly savePdfPress: number;
  readonly printReadyPress: number;
  readonly pdfClicked: boolean;
  readonly pdfExported: boolean;
  readonly sheetReveal: number;
  readonly sheetY: number;
  readonly exportBadgeOp: number;
  readonly exportBadgeScale: number;
  readonly paperSheen: number;
};

/**
 * Saved Bookmarks toolbar + Printable A4 SESI Reference Guide preview (mirrors pdfExport.js).
 */
export const PrintReferenceShowcase: React.FC<PrintReferenceShowcaseProps> = ({
  cards,
  hubOpacity,
  hubScale,
  savePdfPress,
  printReadyPress,
  pdfClicked,
  pdfExported,
  sheetReveal,
  sheetY,
  exportBadgeOp,
  exportBadgeScale,
  paperSheen,
}) => (
  <Interactive.Div
    name="Print Reference Guide"
    style={{
      position: 'absolute',
      inset: 0,
      opacity: hubOpacity,
      transform: `scale(${hubScale})`,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    }}
  >
    {/* Saved Bookmarks Toolbar */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '15px 26px',
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        border: `1.5px solid ${BRAND.slate300}`,
        boxShadow: '0 14px 36px rgba(15, 23, 42, 0.08)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: FONT_SANS, fontSize: 21, fontWeight: 800, color: BRAND.ink }}>
              My Profile · Saved Bookmarks
            </span>
            <span
              style={{
                padding: '3px 10px',
                borderRadius: 999,
                backgroundColor: BRAND.slate100,
                border: `1px solid ${BRAND.slate200}`,
                fontFamily: FONT_SANS,
                fontSize: 12,
                fontWeight: 700,
                color: BRAND.slate700,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {cards.length}
            </span>
          </div>
          <div style={{ fontFamily: FONT_SANS, fontSize: 14, fontWeight: 600, color: BRAND.inkMuted, marginTop: 2 }}>
            {cards.map((c) => c.term).join(', ')} &amp; ReSET2030 summary ready to export
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {pdfExported && (
          <div
            style={{
              padding: '8px 14px',
              borderRadius: 999,
              backgroundColor: '#ecfdf5',
              border: '1px solid #6ee7b7',
              fontFamily: FONT_SANS,
              fontSize: 13,
              fontWeight: 700,
              color: '#065f46',
              opacity: exportBadgeOp,
              transform: `scale(${exportBadgeScale})`,
            }}
          >
            ✓ SESI-Reference-Guide.pdf
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 24px',
            borderRadius: 14,
            background: pdfClicked
              ? 'linear-gradient(90deg, #047857, #0f766e)'
              : `linear-gradient(90deg, ${BRAND.emerald}, ${BRAND.teal})`,
            color: BRAND.white,
            fontFamily: FONT_SANS,
            fontSize: 17,
            fontWeight: 800,
            transform: `scale(${savePdfPress})`,
            boxShadow: '0 10px 26px rgba(5, 150, 105, 0.3)',
          }}
        >
          <PrinterIcon size={19} color={BRAND.white} />
          <span>{pdfExported ? 'PDF Exported' : pdfClicked ? 'Guide Compiled' : 'Save as PDF'}</span>
        </div>
      </div>
    </div>

    {/* Printable A4 Document Sheet */}
    <div
      style={{
        flex: 1,
        position: 'relative',
        borderRadius: 24,
        backgroundColor: BRAND.white,
        border: pdfExported ? `2px solid ${BRAND.emerald}` : `1.5px solid ${BRAND.slate300}`,
        boxShadow: pdfExported
          ? '0 28px 72px rgba(5, 150, 105, 0.16), 0 8px 24px rgba(15, 23, 42, 0.08)'
          : '0 26px 64px rgba(15, 23, 42, 0.12)',
        padding: '22px 30px',
        opacity: pdfClicked ? sheetReveal : 0.45,
        transform: `translateY(${pdfClicked ? sheetY : 16}px) scale(${pdfClicked ? 1 : 0.985})`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}
    >
      {pdfExported && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(115deg, transparent ${paperSheen - 14}%, rgba(16, 185, 129, 0.09) ${paperSheen}%, transparent ${paperSheen + 14}%)`,
            pointerEvents: 'none',
            zIndex: 5,
          }}
        />
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          borderBottom: `2.5px solid ${BRAND.emerald}`,
          paddingBottom: 12,
        }}
      >
        <div>
          <div style={{ fontFamily: FONT_SANS, fontSize: 27, fontWeight: 800, color: BRAND.ink, letterSpacing: '-0.02em' }}>
            SESI Reference Guide
          </div>
          <div style={{ fontFamily: FONT_SANS, fontSize: 12.5, fontWeight: 700, color: BRAND.emerald, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 2 }}>
            Compiled Bookmarks • A4 Printable Edition
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 16px',
            borderRadius: 11,
            backgroundColor: pdfExported ? BRAND.emerald : '#ecfdf5',
            border: pdfExported ? `1px solid ${BRAND.emerald}` : '1px solid #a7f3d0',
            fontFamily: FONT_MONO,
            fontSize: 13,
            fontWeight: 700,
            color: pdfExported ? BRAND.white : '#065f46',
            transform: `scale(${printReadyPress})`,
            boxShadow: pdfExported ? '0 8px 20px rgba(5, 150, 105, 0.28)' : 'none',
          }}
        >
          <PrinterIcon size={15} color={pdfExported ? BRAND.white : '#065f46'} />
          <span>{pdfExported ? '✓ Print / Save PDF' : 'Print / Save PDF'}</span>
        </div>
      </div>

      {/* 2-Column .dict-grid Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14, flex: 1 }}>
        {cards.map((item) => (
          <div
            key={item.id}
            style={{
              border: `1px solid ${BRAND.slate200}`,
              borderRadius: 16,
              padding: '15px 18px',
              backgroundColor: BRAND.ground,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '3px 9px',
                  borderRadius: 6,
                  backgroundColor: item.catBg,
                  color: item.catColor,
                  fontFamily: FONT_SANS,
                  fontSize: 10.5,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: 6,
                }}
              >
                {item.cat}
              </span>
              <div style={{ fontFamily: FONT_SANS, fontSize: 21, fontWeight: 800, color: BRAND.ink }}>
                {item.term}
              </div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 12.5, fontWeight: 600, color: BRAND.inkMuted, marginTop: 1 }}>
                {item.full}
              </div>
              <p style={{ fontFamily: FONT_SANS, fontSize: 13, color: BRAND.slate700, lineHeight: 1.42, margin: '8px 0 0' }}>
                {item.desc}
              </p>
            </div>

            {item.formula && (
              <div
                style={{
                  marginTop: 10,
                  padding: '8px 11px',
                  borderRadius: 8,
                  backgroundColor: BRAND.white,
                  border: `1px solid ${BRAND.slate200}`,
                  borderLeft: `4px solid ${item.pillColor}`,
                  fontFamily: FONT_MONO,
                  fontSize: 12,
                  fontWeight: 700,
                  color: BRAND.slate800,
                }}
              >
                {item.formula}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Printable ReSET2030 & Grid Benchmarks Strip */}
      <div
        style={{
          marginTop: 14,
          padding: '10px 16px',
          borderRadius: 12,
          backgroundColor: '#f0fdfa',
          border: '1px solid #ccfbf1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              padding: '3px 9px',
              borderRadius: 6,
              backgroundColor: '#0284c7',
              color: BRAND.white,
              fontFamily: FONT_SANS,
              fontSize: 10.5,
              fontWeight: 800,
              textTransform: 'uppercase',
            }}
          >
            ReSET2030 Summary
          </span>
          <span style={{ fontFamily: FONT_SANS, fontSize: 13.5, fontWeight: 700, color: BRAND.ink }}>
            Dependable Capacity: {RESET2030_METRICS.dependableCapacityMW.toLocaleString()} MW · Reserve Margin:{' '}
            {RESET2030_METRICS.reserveStartPct}% → {RESET2030_METRICS.reserveTargetPct}%
          </span>
        </div>
        <span style={{ fontFamily: FONT_MONO, fontSize: 12, fontWeight: 700, color: '#0f766e' }}>
          Page 1 of 1 · Print Layout
        </span>
      </div>
    </div>
  </Interactive.Div>
);
