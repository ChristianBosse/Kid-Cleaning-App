const convertCreditsToMoney = credits => {
    const moneyPerCredit = 0.1; // Each credit is worth 10 cents
    return credits * moneyPerCredit;
};

module.exports = convertCreditsToMoney;
