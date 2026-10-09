fetch('http://localhost:5037/glossary').then(r => r.json()).then(d => {
  const item = d.find(x => x.term === 'ASSET CAPITALISATION');
  console.log(item.chartData);
}).catch(console.error);
