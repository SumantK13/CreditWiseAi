export async function scrapeCarLoan(page) {
  return page.evaluate(() => {
    const results = [];

    const rows = document.querySelectorAll('table tbody tr');

    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length < 3) return;

      /* ===== Bank Name ===== */
      let bankName = "";
      const link = cells[0].querySelector('a[href]');
      if (link) {
        bankName = link.innerText.replace(/\s+/g, ' ').trim();
      } else {
        bankName = cells[0].innerText.replace(/\s+/g, ' ').trim();
      }

      if (!bankName) return;

      /* ===== Interest Rate ===== */
      let interestRaw = "";
      const rateCell = cells[1];

      // handles <p> and <ol><li>
      interestRaw = rateCell.innerText.replace(/\s+/g, ' ').trim();

      // skip rows with no numeric interest at all
      if (!interestRaw.match(/\d/)) return;

      /* ===== Tenure ===== */
      const tenureRaw = cells[2].innerText.replace(/\s+/g, ' ').trim();

      results.push({
        bankName,
        interestRaw,
        tenureRaw
      });
    });

    return results;
  });
}
