import type { Quote, QuoteStatus } from '../types';
import { createStore } from './store';

export const quotesStore = createStore<Quote>('quotes');

export type QuoteInput = Pick<Quote, 'name' | 'email' | 'subject' | 'description' | 'budget'>;

export function createQuote(input: QuoteInput) {
  return quotesStore.create({ ...input, status: 'new', createdAt: Date.now() });
}

export async function listQuotes() {
  const quotes = await quotesStore.list();
  return quotes.sort((a, b) => b.createdAt - a.createdAt);
}

export function setQuoteStatus(id: string, status: QuoteStatus) {
  return quotesStore.update(id, { status });
}
