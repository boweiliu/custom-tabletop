import { writable } from 'svelte/store';
import type { CardData } from './types';
import { useConvexClient, useQuery } from 'convex-svelte';
import type { ConvexClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';


/**
 * TODO: change from writeable to $state using .svelte.ts
 */

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

let cardStoreInstance: ReturnType<typeof createCardStore> | null = null;

export function getCardStore(client?: ConvexClient) {
  if (!cardStoreInstance) {
    cardStoreInstance = createCardStore(client);
  }
  return cardStoreInstance;
}

function createCardStore(client?: ConvexClient) {
  const { subscribe, update, set } = writable<CardData[]>(loadCards());

  return {
    subscribe,
    updateCard: (cardId: string, changes: Partial<CardData>, _client?: ConvexClient) => {
      update(cards => {
        // const client = useConvexClient();
        console.log('updating card', cardId, changes)
        let updatedCard: CardData | undefined;
        const newCards = cards.map(card => {
          if (card.id === cardId) {
            console.log('old', card)
            updatedCard = { ...card, ...changes };
            console.log('new', updatedCard)
            return updatedCard;
          } else {
            return card;
          }
        });
        const fixedCard = { ...updatedCard!, position: undefined }!!;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newCards));
        // Call convex to update in the db as well
        if (client) {
          client.mutation(api.cards.upsertCardById, { card: fixedCard }).then(() => {
            // console.log('finished client mutation await');
          })
          // console.log('called client mutation without awaiting')
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