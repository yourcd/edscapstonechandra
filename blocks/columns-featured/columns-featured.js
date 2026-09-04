export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-featured-${cols.length}-cols`);

  // setup image / text columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-featured-img-col');
          return;
        }
      }

      // text column: label eyebrow, body and CTA for styling
      if (!pic) {
        col.classList.add('columns-featured-text-col');
        const paras = [...col.querySelectorAll(':scope > p')];
        paras.forEach((p) => {
          const link = p.querySelector('a');
          if (link && p.textContent.trim() === link.textContent.trim()) {
            // standalone link paragraph = CTA
            p.classList.add('columns-featured-cta-wrapper');
            link.classList.add('columns-featured-cta');
          } else if (p === paras[0]) {
            // first plain paragraph = eyebrow / pretitle
            p.classList.add('columns-featured-eyebrow');
          } else {
            p.classList.add('columns-featured-body');
          }
        });
      }
    });
  });
}
