import type { WeatherIconName } from '../content/types';

/** Line icons for the "sticky truth" cards. Decorative: the card title says what each one is. */
export function WeatherIcon({ name }: { name: WeatherIconName }) {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true" focusable="false" className={`weather-icon weather-icon--${name}`}>
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {name === 'temperature' && (
          <>
            {/* thermometer, nearly full */}
            <path d="M20 29.5V9a4 4 0 0 1 8 0v20.5a8 8 0 1 1-8 0Z" />
            <path className="weather-icon__level" d="M24 14v20" />
            <circle className="weather-icon__bulb" cx="24" cy="36" r="3.5" fill="currentColor" stroke="none" />
            <path d="M33 11h4M33 17h4M33 23h4" />
          </>
        )}
        {name === 'sun' && (
          <>
            <circle cx="24" cy="24" r="8" />
            <g className="weather-icon__rays">
              <path d="M24 4v5M24 39v5M4 24h5M39 24h5M9.9 9.9l3.5 3.5M34.6 34.6l3.5 3.5M9.9 38.1l3.5-3.5M34.6 13.4l3.5-3.5" />
            </g>
          </>
        )}
        {name === 'humidity' && (
          <>
            {/* droplet with a percent sign */}
            <path d="M24 5c6 8 13 15.5 13 23.5a13 13 0 0 1-26 0C11 20.5 18 13 24 5Z" />
            <path d="M19.5 34.5l9-11" />
            <circle cx="19.5" cy="25" r="2" />
            <circle cx="28.5" cy="33" r="2" />
          </>
        )}
      </g>
    </svg>
  );
}
