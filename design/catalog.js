import {cards, GROUPS} from '../src/cards.js';
import {loadDeckArtwork, renderCard} from '../src/card-renderer.js';

const LOCAL_DECK_ART = document.querySelector('.reference-chip img').src;

const state = {
  group: 'all',
  query: '',
  view: 'grid',
  contactMode: new URLSearchParams(window.location.search).has('contact'),
};

const elements = {
  grid: document.querySelector('#catalog-grid'),
  template: document.querySelector('#card-template'),
  filters: document.querySelector('#filters'),
  search: document.querySelector('#search'),
  resultsCount: document.querySelector('#results-count'),
  activeFamily: document.querySelector('#active-family'),
  empty: document.querySelector('#empty-state'),
  dialog: document.querySelector('#card-dialog'),
  dialogCanvas: document.querySelector('#dialog-canvas'),
  dialogId: document.querySelector('#dialog-id'),
  dialogTitle: document.querySelector('#dialog-title'),
  dialogMotif: document.querySelector('#dialog-motif'),
  dialogRationale: document.querySelector('#dialog-rationale'),
  uprightEn: document.querySelector('#dialog-upright-en'),
  uprightZh: document.querySelector('#dialog-upright-zh'),
  reversedEn: document.querySelector('#dialog-reversed-en'),
  reversedZh: document.querySelector('#dialog-reversed-zh'),
  revisionCode: document.querySelector('#revision-code'),
  copyStatus: document.querySelector('#copy-status'),
};

let activeCard = null;
let renderObserver = null;

const normalized = (value) => value.toLocaleLowerCase().normalize('NFKC').trim();

const matchingCards = () => {
  const query = normalized(state.query);
  return cards.filter((card) => {
    const groupMatch = state.group === 'all' || card.group === state.group;
    const searchTarget = normalized([
      card.id,
      card.nameEn,
      card.nameZh,
      card.motif,
      card.uprightEn,
      card.uprightZh,
      card.reversedEn,
      card.reversedZh,
    ].join(' '));
    return groupMatch && (!query || searchTarget.includes(query));
  });
};

const renderCanvas = (canvas, card) => {
  if (canvas.dataset.rendered === 'true') return;
  renderCard(canvas, card, {width: state.contactMode ? 288 : 384});
  canvas.dataset.rendered = 'true';
};

const setupObserver = () => {
  renderObserver?.disconnect();
  if (state.contactMode || !('IntersectionObserver' in window)) return null;
  renderObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const canvas = entry.target;
      const card = cards.find((item) => item.id === canvas.dataset.cardId);
      if (card) renderCanvas(canvas, card);
      renderObserver.unobserve(canvas);
    });
  }, {rootMargin: '500px 0px'});
  return renderObserver;
};

const cardNode = (card) => {
  const fragment = elements.template.content.cloneNode(true);
  const article = fragment.querySelector('.card-entry');
  const button = fragment.querySelector('.card-open');
  const canvas = fragment.querySelector('canvas');
  article.dataset.group = card.group;
  article.dataset.cardId = card.id;
  button.setAttribute('aria-label', `Inspect ${card.nameEn}, ${card.nameZh}, design ${card.id}`);
  button.addEventListener('click', () => openCard(card));
  canvas.dataset.cardId = card.id;
  fragment.querySelector('.card-id').textContent = card.id;
  fragment.querySelector('.card-name').textContent = card.nameEn;
  fragment.querySelector('.card-name-zh').textContent = card.nameZh;
  fragment.querySelector('.card-motif').textContent = card.motif;
  if (state.contactMode || !renderObserver) renderCanvas(canvas, card);
  else renderObserver.observe(canvas);
  return fragment;
};

const renderCatalog = () => {
  const matches = matchingCards();
  setupObserver();
  elements.grid.replaceChildren(...matches.map(cardNode));
  elements.grid.dataset.view = state.view;
  elements.resultsCount.textContent = `${matches.length} concept${matches.length === 1 ? '' : 's'}`;
  const group = GROUPS.find((item) => item.id === state.group);
  elements.activeFamily.textContent = group ? `${group.label} · ${group.labelZh}` : 'All Arcana';
  elements.empty.hidden = matches.length !== 0;
  document.body.dataset.ready = 'true';
};

const renderFilters = () => {
  GROUPS.forEach((group) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.group = group.id;
    button.textContent = `${group.label} · ${group.labelZh}`;
    button.setAttribute('aria-pressed', String(group.id === state.group));
    button.addEventListener('click', () => {
      state.group = group.id;
      document.querySelectorAll('#filters button').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      renderCatalog();
    });
    elements.filters.append(button);
  });
};

const revisionText = (card) => [
  `CARD: ${card.id} — ${card.nameZh} · ${card.nameEn}`,
  'CHANGE: [describe symbol, composition, border, palette, or typography change]',
  'KEEP: [name anything that should remain unchanged]',
  'PRIORITY: [minor / major]',
].join('\n');

function openCard(card) {
  activeCard = card;
  renderCard(elements.dialogCanvas, card, {width: 768});
  elements.dialogId.textContent = `${card.id} / ${card.group.toUpperCase()}`;
  elements.dialogTitle.textContent = `${card.nameZh} · ${card.nameEn}`;
  elements.dialogMotif.textContent = card.motif;
  elements.dialogRationale.textContent = card.rationale;
  elements.uprightEn.textContent = card.uprightEn;
  elements.uprightZh.textContent = card.uprightZh;
  elements.reversedEn.textContent = card.reversedEn;
  elements.reversedZh.textContent = card.reversedZh;
  elements.revisionCode.textContent = revisionText(card);
  elements.copyStatus.textContent = '';
  history.replaceState(null, '', `#${card.id}`);
  elements.dialog.showModal();
}

const copyText = async (text) => {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.append(area);
  area.select();
  const copied = document.execCommand('copy');
  area.remove();
  if (!copied) throw new Error('Copy command failed');
};

document.querySelector('#dialog-close').addEventListener('click', () => elements.dialog.close());
elements.dialog.addEventListener('click', (event) => {
  if (event.target === elements.dialog) elements.dialog.close();
});
elements.dialog.addEventListener('close', () => {
  if (location.hash) history.replaceState(null, '', `${location.pathname}${location.search}`);
});

document.querySelector('#copy-request').addEventListener('click', async () => {
  if (!activeCard) return;
  try {
    await copyText(revisionText(activeCard));
    elements.copyStatus.textContent = 'Change-request template copied. / 修改模板已复制。';
  } catch {
    elements.copyStatus.textContent = 'Copy failed—select the text above manually. / 复制失败，请手动选择。';
  }
});

elements.search.addEventListener('input', (event) => {
  state.query = event.target.value;
  renderCatalog();
});

document.querySelectorAll('[data-view]').forEach((button) => {
  button.addEventListener('click', () => {
    state.view = button.dataset.view;
    document.querySelectorAll('[data-view]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    renderCatalog();
  });
});

const boot = async () => {
  if (state.contactMode) document.body.classList.add('contact-mode');
  await loadDeckArtwork(LOCAL_DECK_ART);
  renderFilters();
  renderCatalog();
  await document.fonts?.ready;
  if (state.contactMode) {
    document.querySelectorAll('.card-entry canvas').forEach((canvas) => {
      const card = cards.find((item) => item.id === canvas.dataset.cardId);
      if (card) renderCard(canvas, card, {width: 288});
    });
    document.body.dataset.contactReady = 'true';
  }
  const hashCard = cards.find((card) => `#${card.id}` === location.hash);
  if (hashCard && !state.contactMode) openCard(hashCard);
};

window.__catalog = {
  cards: cards.map(({id, nameEn, nameZh, group}) => ({id, nameEn, nameZh, group})),
  renderCardDataUrl(id, width = 768) {
    const card = cards.find((item) => item.id === id);
    if (!card) throw new Error(`Unknown card: ${id}`);
    const canvas = document.createElement('canvas');
    renderCard(canvas, card, {width});
    return canvas.toDataURL('image/png');
  },
  renderAllGridCards() {
    document.querySelectorAll('.card-entry canvas').forEach((canvas) => {
      const card = cards.find((item) => item.id === canvas.dataset.cardId);
      if (card) renderCanvas(canvas, card);
    });
  },
};

boot();
