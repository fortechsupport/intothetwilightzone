// Where to listen to a radio series (Radio plan, approved 2026-11-23). Data: data/fan/listen.yaml, licensed
// releases only, each with the page it was read from. Shown on the series page and every episode page.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'yaml';

export interface ListenOffer { service: string; how: 'buy' | 'free' | 'stream' | 'extra'; scope?: 'all' | 'some'; what: string; source: string; url?: string; read: string }
export interface Listen { offers: ListenOffer[] }

let cache: Record<string, Listen> | undefined;
const all = () => (cache ??= parse(readFileSync(resolve(process.cwd(), 'data/fan/listen.yaml'), 'utf8')) as Record<string, Listen>);

export const RADIO_DRAMAS = 'The Twilight Zone Radio Dramas';

/** Where to listen for a radio series, by its series_title. */
export function listenFor(seriesTitle?: string): Listen | undefined {
  if (seriesTitle === RADIO_DRAMAS) return all()['twilight-zone-radio-dramas'];
  return undefined;
}

export const HOW_LABEL: Record<ListenOffer['how'], string> = { buy: 'Buy', free: 'Free with a library card', stream: 'Stream', extra: 'As an extra' };

export const SHORT: Record<ListenOffer['how'], string> = { buy: 'to buy', free: 'free from libraries', stream: 'streaming', extra: 'as extras' };
