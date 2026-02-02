export async function scrapePersonalLoan(page) {
  return page.evaluate(() => {
    const results = [];

    const cards = Array.from(document.querySelectorAll('div')).filter(div =>
      div.className.includes('shadow-lg') &&
      div.className.includes('border-slate-300') &&
      div.className.includes('p-3')
    );

    cards.forEach(card => {
      let bankName = "Unknown Bank";

      const nameElement = card.querySelector('h4.inline');
      if (nameElement) {
        bankName = nameElement.innerText.trim();
      } else {
        const headers = card.querySelectorAll('h4');
        if (headers.length > 0) {
          bankName = headers[headers.length - 1].innerText.trim();
        }
      }

      const dataBlocks = card.querySelectorAll('.inline-block.mr-1');
      let interestRaw = "0";
      let feeRaw = "0";

      dataBlocks.forEach(block => {
        const label = block.innerText.toLowerCase();
        const valueElement = block.querySelectorAll('p')[1];
        const valueText = valueElement ? valueElement.innerText.trim() : "";

        if (label.includes('fixed') || label.includes('floating')) {
          interestRaw = valueText;
        }
        if (label.includes('processing fee')) {
          feeRaw = valueText;
        }
      });

      if (bankName !== "Unknown Bank" && interestRaw !== "0") {
        results.push({ bankName, interestRaw, feeRaw });
      }
    });

    return results;
  });
}
