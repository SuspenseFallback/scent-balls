import { site } from '../content/site';
import markUrl from '../assets/brand/logo-mark.svg';
import logoUrl from '../assets/brand/logo.svg';

// The ONLY place the logo files are referenced. Swap the SVGs in src/assets/brand.
export function Logo() {
  if (site.logoStyle === 'full-logo') {
    return (
      <span className="logo">
        <img src={logoUrl} alt={site.brandName} width={110} height={34} style={{ width: 'auto', height: 34 }} />
      </span>
    );
  }
  return (
    <span className="logo">
      <img src={markUrl} alt="" width={30} height={34} />
      <span>{site.brandName}</span>
    </span>
  );
}
