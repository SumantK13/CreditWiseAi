export async function scrapeHomeLoan(page) {
  return page.evaluate(() => {
    const results = [];

    const rows = document.querySelectorAll('table tbody tr');

    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length < 4) return;

      // 1️⃣ Bank Name
      const bankAnchor = cells[0].querySelector('a');
      const bankName = bankAnchor ? bankAnchor.innerText.trim() : "";
      if (!bankName) return;

      // 2️⃣ Interest Rate (range or single)
      const rateText = cells[1].innerText.trim();

      // extract first numeric value (for DB number field)
      let interestRaw = rateText;
      const rateMatch = rateText.match(/(\d+(\.\d+)?)/);
      if (!rateMatch) return;

      // 3️⃣ Processing Fee
      const feeText = cells[2].innerText.replace(/\s+/g, ' ').trim();

      // 4️⃣ Tenure
      const tenureText = cells[3].innerText.replace(/\s+/g, ' ').trim();

      results.push({
        bankName,
        interestRaw,
        feeRaw: feeText,
        tenureRaw: tenureText
      });
    });

    return results;
  });
}
