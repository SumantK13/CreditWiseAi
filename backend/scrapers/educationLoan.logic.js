export async function scrapeEducationLoan(page) {
  return page.evaluate(() => {
    const results = [];

    const rows = document.querySelectorAll('table tbody tr');

    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length < 3) return;

      /* ===== Bank Name ===== */
      let bankName = "";
      const link = cells[0].querySelector('a');
      if (link) {
        bankName = link.innerText.replace(/\s+/g, ' ').trim();
      } else {
        bankName = cells[0].innerText.replace(/\s+/g, ' ').trim();
      }
      if (!bankName) return;

      /* ===== Interest Rate ===== */
      const interestRaw = cells[1].innerText.replace(/\s+/g, ' ').trim();

      /* ===== Processing Fee ===== */
      const processingFee = cells[2].innerText.replace(/\s+/g, ' ').trim();

      results.push({
        bankName,
        interestRaw,
        processingFee
      });
    });

    return results;
  });
}
