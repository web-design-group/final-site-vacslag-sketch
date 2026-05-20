const GALLERY_BLOCKS = [
  {
    id: 'oc',
    title: 'Original Characters',
    type: 'group',
    tags: ['all', 'original-characters'],
    previewImages: ['images/Image07.jpg', 'images/Image09.jpg', 'images/Image10.jpg'],
    images: ['Image07.jpg', 'Image08.jpg', 'Image09.jpg', 'Image10.jpg']
  },
  {
    id: 'cartoons',
    title: 'Cartoons',
    type: 'group',
    tags: ['all', 'cartoons'],  // ← ИСПРАВЛЕНО: было 'original-characters'
    previewImages: ['images/Image56.jpg', 'images/Image13.jpg', 'images/Image110.jpg'],
    images: ['Image56.jpg', 'Image76.jpg', 'Image06.jpg', 'Image05.jpg', 'Image17.jpg', 'Image13.jpg', 'Image110.jpg']
  },
  {
    id: 'land-1',
    title: 'Landscapes',
    type: 'group',
    tags: ['all', 'landscapes'],
    previewImages: ['images/Image51.jpg', 'images/Image80.jpg', 'images/Image120.jpg'],
    images: ['Image51.jpg', 'Image02.jpg', 'Image11.jpg', 'Image12.jpg', 'Image80.jpg', 'Image120.jpg', 'Image118.jpg']
  },
  {
    id: 'anime-1',
    title: 'Anime/Manga',
    type: 'group',
    tags: ['all', 'anime-manga'],
    previewImages: ['images/Image141.jpg', 'images/Image115(1).jpg', 'images/Image100(1).jpg'],
    images: ['Image141.jpg', 'Image115.jpg', 'Image100.jpg', 'Image32.jpg', 'Image119.jpg']
  },
  {
    id: 'LN',
    title: 'LN-illustrations',
    type: 'group',
    tags: ['all', 'ln-illustration'],  // ← ИСПРАВЛЕНО: убран лишний 'anime-manga' (но можно оставить, если нужно)
    previewImages: ['images/gbs.jpg', 'images/Ash-11.jpg', 'images/Image35.jpg'],
    images: ['gbs.jpg', 'Image35.jpg', 'Ash-1.jpg', 'Ash-2.jpg', 'Ash-3.jpg', 'Ash-4.jpg', 'Ash-5.jpg', 'Ash-6.jpg', 'Ash-7.jpg', 'Ash-8.jpg', 'Ash-9.jpg', 'Ash-10.jpg', 'Ash-11.jpg', 'Ash-12.jpg']
  },
  {
    id: 'game-1',
    title: 'Game Concept Key Art',
    type: 'group',
    tags: ['all', 'games'],
    previewImages: ['images/Image73.jpg', 'images/Image54.jpg', 'images/Image61.jpg'],
    images: ['Image27.jpg', 'Image26.jpg', 'Image46.jpg', 'Image42.jpg', 'Image43.jpg', 'Image81.jpg', 'Image90.jpg', 'Image97.jpg', 'Image114.jpg', 'Image128.jpg', 'Image69.jpg']
  },
  {
    id: 'vocaloid',
    title: 'Vocaloid',
    type: 'group',
    tags: ['all', 'vocaloid'],  // ← ИСПРАВЛЕНО: было 'anime-manga', 'ln-illustration'
    previewImages: ['images/Image47.jpg', 'images/Image19.jpg', 'images/Image124.jpg'],
    images: ['Image47.jpg', 'Image19.jpg', 'Image124.jpg', 'Image24.jpg', 'Image03.jpg', 'Image14.jpg', 'Image88.jpg', 'Image92.jpg', 'Image108.jpg', 'Image103.jpg', 'Image111.jpg', 'Image113.jpg', 'Image122.jpg', 'Image125.jpg', 'Image127.jpg']
  },
  {
    id: 'graphic-design',
    title: 'Graphic design',
    type: 'group',
    tags: ['all', 'graphic-design'],
    previewImages: ['images/Image66.jpg', 'images/Image64.jpg', 'images/Image38.jpg'],
    images: ['Image66.jpg','Image67.jpg' ,'Image64.jpg','Image65.jpg', 'Image38.jpg', 'Image36.jpg', '05LeA-1.jpg','05LeA-2.jpg', 'Image93.jpg']
  }
];
document.addEventListener('DOMContentLoaded', () => {
  initScrollButton();
  initPortfolioRouter();
});

function initScrollButton() {
  const scrollBtn = document.getElementById('scrollToTopBtn');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) scrollBtn.classList.add('show');
    else scrollBtn.classList.remove('show');
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initPortfolioRouter() {
  const root = document.getElementById('galleryRoot');
  if (!root) return;

  window.addEventListener('hashchange', () => renderRoute(root));
  root.addEventListener('click', handleGalleryClick);
  renderRoute(root);
}

function renderRoute(root) {
  const hash = window.location.hash || '';
  const [route, param] = hash.replace(/^#\//, '').split('/').reduce((acc, v, i) => (i < 2 ? [...acc, v] : acc), []);

  if (route === 'tag' && param) {
    renderTagView(root, param);
  } else if (route === 'group' && param) {
    renderGroupView(root, param);
  } else {
    renderHomeView(root);
  }

  updateActiveCategory(hash);
}

function renderHomeView(root) {
  root.className = 'gallery-root home-view';
  root.innerHTML = `<div class="gallery-grid">${GALLERY_BLOCKS.map(renderBlockCard).join('')}</div>`;
  // Убрали "two-columns" класс, так как column-count уже применяется ко всем .gallery-grid
}

function renderTagView(root, tagId) {
  const blocks = tagId === 'all' ? GALLERY_BLOCKS : GALLERY_BLOCKS.filter((b) => b.tags.includes(tagId));
  root.className = 'gallery-root tag-view';
  root.innerHTML = `<h2 class="view-title">Tag: ${tagId}</h2><div class="gallery-grid one-column">${blocks.map(renderBlockCard).join('')}</div>`;
}

function renderGroupView(root, groupId) {
  const block = GALLERY_BLOCKS.find((b) => b.id === groupId && b.type === 'group');
  if (!block) {
    root.className = 'gallery-root group-view';
    root.innerHTML = '<p>Group not found.</p>';
    return;
  }

  root.className = 'gallery-root group-view';
  root.innerHTML = `<h2 class="view-title">${block.title}</h2>
    <div class="gallery-grid one-column">
      ${block.images.map((img, i) => {
        // Если картинка в новом формате (с этапами)
        if (typeof img === 'object' && img.src) {
          const stages = img.stages;
          return `<img src="images/${img.src}" alt="${block.title} ${i + 1}" 
            class="gallery-item clickable-image" 
            data-stages='${JSON.stringify(stages)}' 
            data-current-index='0'>`;
        }
        // Если картинка в старом формате (просто строка)
        return `<img src="images/${img}" alt="${block.title} ${i + 1}" 
          class="gallery-item clickable-image" 
          data-stages='${JSON.stringify([img])}' 
          data-current-index='0'>`;
      }).join('')}
    </div>`;
}

function renderBlockCard(block) {
  const overlayMarkup = `<div class="block-overlay"><span>${block.title}</span></div>`;

  if (block.type === 'group') {
    const [main, side1, side2] = block.previewImages;
    return `<article class="gallery-block group-block" data-group-id="${block.id}">
      <div class="group-layout">
        <img src="${main}" alt="${block.title}" class="gallery-item group-main clickable-image" data-images='${JSON.stringify(block.images)}' data-current-index='0'>
        <div class="group-side">
          <img src="${side1}" alt="${block.title}" class="gallery-item clickable-image" data-images='${JSON.stringify(block.images)}' data-current-index='1'>
          <img src="${side2}" alt="${block.title}" class="gallery-item clickable-image" data-images='${JSON.stringify(block.images)}' data-current-index='2'>
        </div>
      </div>
      ${overlayMarkup}
    </article>`;
  }

  return `<article class="gallery-block single-block" data-group-id="${block.id}">
    <img src="${block.previewImages[0]}" alt="${block.title}" class="gallery-item clickable-image" data-images='${JSON.stringify(block.images)}' data-current-index='0'>
    ${overlayMarkup}
  </article>`;
}

function handleGalleryClick(event) {
  const img = event.target.closest('.clickable-image');
  if (img) cycleImage(img);

  const groupBlock = event.target.closest('.group-block');
  if (groupBlock && !window.location.hash.startsWith('#/group/')) {
    window.location.hash = `/group/${groupBlock.dataset.groupId}`;
  }
}

function cycleImage(img) {
  const stages = JSON.parse(img.dataset.stages || '[]');
  if (stages.length < 2) return;
  const current = Number(img.dataset.currentIndex || 0);
  const next = (current + 1) % stages.length;

  img.classList.add('is-fading');
  setTimeout(() => {
    img.src = 'images/' + stages[next];
    img.dataset.currentIndex = String(next);
    img.classList.remove('is-fading');
  }, 180);
}

function updateActiveCategory(hash) {
  const tag = hash.startsWith('#/tag/') ? hash.replace('#/tag/', '') : 'all';
  document.querySelectorAll('.category-link').forEach((link) => {
    link.classList.toggle('active', link.dataset.tag === tag);
  });
}
