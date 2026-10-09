import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

interface Props {
  eyebrow: string;
  title: string;
  id?: string;
  center?: boolean;
  children?: ReactNode;
}

export function SectionHead({ eyebrow, title, id, center, children }: Props) {
  return (
    <Reveal className={`section__head${center ? ' section__head--center' : ''}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 id={id}>{title}</h2>
      {children}
    </Reveal>
  );
}
