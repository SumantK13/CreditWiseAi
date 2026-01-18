/**
 * Calculate an estimated Behavioral Credit Score based on user answers
 * @param {Object} answers - User responses with keys: payOnTime, hasLoans, hasCreditCard
 * @param {number} age - User's age in years
 * @returns {number} Estimated credit score between 300 and 850
 */
export const calculateEstimatedScore = (answers, age) => {
  let score = 650; // Base score

  // 1. Payment History
  if (answers.payOnTime === 'yes') {
    score += 50;
  } else if (answers.payOnTime === 'sometimes') {
    score -= 50;
  } else if (answers.payOnTime === 'no') {
    score -= 100;
  }

  // 2. Credit Experience
  if (answers.hasLoans === 'yes') {
    score += 30;
  }

  // 3. Credit Utilization
  if (answers.hasCreditCard === 'yes') {
    score += 20;
  } else if (answers.hasCreditCard === 'no') {
    score -= 10;
  }

  // 4. Stability (Age)
  if (age > 25) {
    score += 20;
  }

  // Cap the score between 300 and 850
  score = Math.max(300, Math.min(850, score));

  return score;
};
