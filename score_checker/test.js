const res = await fetch("https://reiwa.f5.si/arcaea_all.json");
const json = await res.json();
console.log(json);
