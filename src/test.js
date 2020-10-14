const searchSite = require('./search-site')

async function main() {
  const p1 = Date.now();
  const result = await searchSite('https://learn.javascript.ru/');
  const result2 = await searchSite('Javascript')
  const p2 = Date.now();
  console.log(result);
  console.log(result2)
  console.log((p2 - p1) / 1000);
}
main()

