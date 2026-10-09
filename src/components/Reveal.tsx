import type { ElementType, ReactNode } from 'react';
import { useInView } from '../lib/useInView';

interface Props {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/** Fades content up once it scrolls into view. Static when reduced motion is on (see global.css). */
export function Reveal({ as: Tag = 'div', className = '', children }: Props) {
  const [ref, inView] = useInView<HTMLElement>();
  return (
    <Tag ref={ref} className={`reveal${inView ? ' is-visible' : ''}${className ? ' ' + className : ''}`}>
      {children}
    </Tag>
  );
}
