import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useInView } from '../lib/useInView';

interface Props {
  as?: ElementType;
  className?: string;
  /** Position in a group that appears together: each step adds a short delay. */
  index?: number;
  children: ReactNode;
}

/** Fades content up once it scrolls into view. Static when reduced motion is on (see global.css). */
export function Reveal({ as: Tag = 'div', className = '', index = 0, children }: Props) {
  const [ref, inView] = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref}
      className={`reveal${inView ? ' is-visible' : ''}${className ? ' ' + className : ''}`}
      style={index ? ({ '--i': index } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
