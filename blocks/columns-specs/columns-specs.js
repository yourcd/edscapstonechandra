export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    // Spec pair rows contain list markup (label list + value list).
    const hasList = row.querySelector('ul, ol');
    if (hasList) {
      row.classList.add('columns-specs-row');
      if (cells[0]) cells[0].classList.add('columns-specs-label');
      if (cells[1]) cells[1].classList.add('columns-specs-value');
    } else {
      // Title / heading row (no label-value list).
      row.classList.add('columns-specs-title');
    }
  });
}
