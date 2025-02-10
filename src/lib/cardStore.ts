import { writable } from 'svelte/store';
import type { CardData } from './types';
import { useConvexClient, useQuery } from 'convex-svelte';
import type { ConvexClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';

const STORAGE_KEY = 'cards';

function loadCards(): CardData[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Error loading cards:', e);
    return [];
  }
}

function createCardStore() {
  const { subscribe, update, set } = writable<CardData[]>(loadCards());
	// const query = useMutation(api.cards.upsertCardById, {});

  return {
    subscribe,
    updateCard: (cardId: string, changes: Partial<CardData>, client?: ConvexClient) => {
      update(cards => {
        // const client = useConvexClient();
        const newCards = cards.map(card => 
          card.id === cardId ? { ...card, ...changes } : card
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newCards));
        // Call convex to update in the db as well
        if (client) {
          client.mutation(api.tasks.testUpdate, {}).then(() => {
            console.log('finished client mutation await');
          })
          console.log('called client mutation without awaiting')
        }

        return newCards;
      });
    },
    addCard: (card: CardData) => {
      update(cards => {
        const newCards = [...cards, card];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newCards));
        return newCards;
      });
    },
    removeCard: (cardId: string) => {
      update(cards => {
        const newCards = cards.filter(card => card.id !== cardId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newCards));
        return newCards;
      });
    },
    reset: (initialCard: CardData) => {
      set([initialCard]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([initialCard]));
    },
    getCards: () => loadCards()
  };
}

// Create and export the store instance
export const cardStore = createCardStore();