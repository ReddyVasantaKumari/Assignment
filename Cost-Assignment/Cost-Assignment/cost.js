const fs = require('fs');

// Read in the cost per unit per channel from cost.json
const costData = JSON.parse(fs.readFileSync('cost.json'));
const channelCostData = JSON.parse(fs.readFileSync('channel-cost.json'));

// Calculate the total cost per channel per day
const costPerDay = {};

channelCostData.forEach((channel) => {
  const date = channel.date.substring(0, 10);
  const channelName = Object.keys(channel).filter((key) => key !== 'date')[0];
  const channelCount = channel[channelName];

  if (!costPerDay[date]) {
    costPerDay[date] = {};
  }

  if (costData[channelName]) {
    const costPerUnit = costData[channelName];
    const totalCost = costPerUnit * channelCount;
    if (costPerDay[date][channelName]) {
      costPerDay[date][channelName] += totalCost;
    } else {
      costPerDay[date][channelName] = totalCost;
    }
  }
});

// Convert the cost to rupees and sort the data by date
const result = Object.entries(costPerDay).map(([date, channelCosts]) => {
  const costInRupees = {};
  Object.keys(channelCosts).forEach((channelName) => {
    costInRupees[channelName] = channelCosts[channelName] / 100;
  });

  return {
    date,
    ...costInRupees,
  };
}).sort((a, b) => a.date.localeCompare(b.date));

// Write the result to output.json
fs.writeFileSync('output.json', JSON.stringify(result, null, 2));
