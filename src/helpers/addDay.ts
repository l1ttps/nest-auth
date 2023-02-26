export default function addDay(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  console.log(d);
  return d;
}
