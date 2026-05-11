export function generateCeraoMatricule(id: bigint | number, year = new Date().getFullYear()) {
  const numericId = typeof id === "bigint" ? Number(id) : id;
  return `${year}-DrCERAO-${numericId.toString().padStart(4, "0")}`;
}
