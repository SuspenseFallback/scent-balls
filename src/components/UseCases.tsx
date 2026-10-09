import { copy } from '../content/copy';
import { PhotoSlot } from './PhotoSlot';
import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';

export function UseCases() {
  const u = copy.useCases;
  return (
    <section className="section" aria-labelledby="uses-title">
      <div className="container">
        <SectionHead id="uses-title" eyebrow={u.eyebrow} title={u.title} />
        <ul className="uses" role="list">
          {u.items.map((item) => (
            <Reveal as="li" key={item.id} className="use">
              <PhotoSlot ratio="4x3" photo={item.photo} label={`photo: ${item.slot}`} alt={`Scent ball: ${item.slot}`} />
              <div>
                <h3>{item.label}</h3>
                <p>{item.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
