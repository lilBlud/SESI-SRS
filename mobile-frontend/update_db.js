const definitions = {
    "TOTAL REVENUE": "Total income generated from the sale of electricity and related services before any expenses are deducted.",
    "PAT": "Profit After Tax. The net profit earned by the company after deducting all expenses, interest, and taxes.",
    "EBIT": "Earnings Before Interest and Taxes. A measure of the company's profitability from core operations.",
    "SAIDI": "System Average Interruption Duration Index. Measures the average duration of power outages per customer.",
    "SYSTEM LOSS": "The percentage of electricity lost during transmission and distribution before reaching the end consumers.",
    "CAPEX": "Capital Expenditure. Investment in new assets, network upgrades, or infrastructure expansions.",
    "OPEX": "Operating Expenditure. Day-to-day operational expenses, including maintenance, salaries, and administration.",
    "ASSET CAPITALISATION": "The percentage of capital expenditures that have been officially capitalized as assets on the balance sheet.",
    "SYSTEM UNIT": "Measures the operational efficiency and total outage minutes at the generation level.",
    "AUDIT ISSUE": "The closure rate of identified internal and external audit issues and compliance findings.",
    "SAFETY": "Lost Time Injury Frequency Rate (LTIFR). The number of lost time injuries occurring per 1 million hours worked."
};

async function main() {
    try {
        console.log("Fetching terms...");
        const res = await fetch("http://localhost:5195/api/glossary");
        const terms = await res.json();
        
        let count = 0;
        for (const term of terms) {
            const termName = term.term.trim().toUpperCase();
            if (definitions[termName]) {
                // Update it via API
                const updatedTerm = {
                    ...term,
                    desc: definitions[termName]
                };
                
                const updateRes = await fetch(`http://localhost:5195/api/admin/glossary/${term.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: term.id,
                        Term: term.term,
                        FullName: term.full || '',
                        Description: definitions[termName],
                        Formula: term.formula || '',
                        FormulaNotations: term.formulaNotations || '',
                        FormulaTermMeanings: term.formulaTermMeanings || '',
                        Category: term.cat,
                        ChartData: term.chartData || ''
                    })
                });
                
                if (updateRes.ok) {
                    console.log(`Updated ${termName}`);
                    count++;
                } else {
                    console.error(`Failed to update ${termName}: ${updateRes.status}`);
                }
            }
        }
        console.log(`Updated ${count} terms successfully.`);
    } catch (e) {
        console.error(e);
    }
}

main();
