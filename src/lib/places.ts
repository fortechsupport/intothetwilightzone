export const PLACE_KINDS: [string, string, string][] = [
  ['backlot-set', 'Studio backlots and sets', 'Where the show was made, on the MGM lots and stages.'],
  ['filming-location', 'Filming locations', 'Real places that appear on screen.'],
  ['serling-place', "Rod Serling's places", 'Homes, schools and towns that shaped Serling and the show.'],
  ['attraction', 'Attractions', 'Rides and experiences based on the show.'],
  ['museum-exhibit', 'Museums and exhibits', 'Where Twilight Zone history is on display.'],
  ['memorial', 'Memorials', 'Graves, plaques and places named in Serling\'s honor.'],
  ['archive', 'Archives', 'Collections that hold scripts, papers and records.'],
  ['', 'Other places', ''],
];
export const PLACE_LABEL = Object.fromEntries(PLACE_KINDS.map(([k, l]) => [k, l]));
export function placeLine(d: { city?: string; region?: string; country?: string }) {
  return [d.city, d.region, d.country].filter(Boolean).join(', ');
}
