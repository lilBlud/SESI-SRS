import React, { useMemo } from 'react';
import {
  createTikTokStyleCaptions,
  type Caption,
  type TikTokPage,
} from '@remotion/captions';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { FONT_SANS } from '../theme';

interface SubtitlesProps {
  readonly captions: readonly Caption[];
  readonly combineMs?: number;
}

const SubtitleShadowBand: React.FC<{
  readonly children?: React.ReactNode;
}> = ({ children }) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 175,
      background:
        'linear-gradient(180deg, rgba(6, 16, 34, 0) 0%, rgba(6, 16, 34, 0.42) 48%, rgba(6, 16, 34, 0.74) 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingBottom: 42,
      pointerEvents: 'none',
    }}
  >
    {children}
  </div>
);

const SubtitleLine: React.FC<{
  readonly page: TikTokPage;
  readonly currentTimeMs: number;
}> = ({ page, currentTimeMs }) => {
  return (
    <SubtitleShadowBand>
      <div
        style={{
          fontFamily: FONT_SANS,
          fontSize: 33,
          fontWeight: 600,
          lineHeight: 1.32,
          letterSpacing: '-0.012em',
          textAlign: 'center',
          maxWidth: 1180,
          padding: '0 48px',
          textShadow: '0 2px 12px rgba(4, 10, 22, 0.85)',
          whiteSpace: 'pre-wrap',
        }}
      >
        {page.tokens.map((token, idx) => {
          const isActive =
            currentTimeMs >= token.fromMs && currentTimeMs < token.toMs;
          return (
            <span
              key={`${token.fromMs}-${idx}`}
              style={{
                color: isActive ? '#6EE79D' : 'rgba(248, 250, 252, 0.94)',
              }}
            >
              {token.text}
            </span>
          );
        })}
      </div>
    </SubtitleShadowBand>
  );
};

export const Subtitles: React.FC<SubtitlesProps> = ({
  captions,
  combineMs = 1900,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { pages } = useMemo(() => {
    return createTikTokStyleCaptions({
      captions: [...captions],
      combineTokensWithinMilliseconds: combineMs,
    });
  }, [captions, combineMs]);

  const currentTimeMs = (frame / fps) * 1000;

  const activePage = pages.find((page, idx) => {
    const nextPage = pages[idx + 1];
    const pageEndMs = nextPage
      ? Math.min(page.startMs + combineMs + 700, nextPage.startMs)
      : page.startMs + combineMs + 1400;
    return currentTimeMs >= page.startMs && currentTimeMs < pageEndMs;
  });

  if (!activePage) {
    return null;
  }

  return <SubtitleLine page={activePage} currentTimeMs={currentTimeMs} />;
};
