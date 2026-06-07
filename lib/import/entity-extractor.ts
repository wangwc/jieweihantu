const reignTitles = ["洪武", "建文", "永乐", "宣德", "正统", "景泰", "成化", "弘治", "正德", "嘉靖", "隆庆", "万历", "天启", "崇祯"];
const knownPlaces = ["南京", "北京", "辽东", "西南", "云南", "福建", "广东", "朝鲜", "日本", "琉球", "越南"];
const knownPersons = ["万历帝", "天启帝", "正德帝", "永乐帝", "崇祯帝", "郑和"];

export function extractEntities(text: string) {
  const years = Array.from(new Set((text.match(/[12][0-9]{3}/g) || []).map(String)));
  const reigns = reignTitles.filter((item) => text.includes(item));
  const places = knownPlaces.filter((item) => text.includes(item));
  const persons = knownPersons.filter((item) => text.includes(item));
  const words = text.match(/[\u4e00-\u9fa5]{2,6}/g) || [];
  const keywords = Array.from(new Set([...reigns, ...places, ...persons, ...words])).slice(0, 16);
  return { years, reigns, places, persons, keywords };
}
