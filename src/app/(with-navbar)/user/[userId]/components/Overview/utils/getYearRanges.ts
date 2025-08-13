// export function getYearVars() {
//   const now = new Date();
//   const currentYear = now.getFullYear();

//   const makeRange = (year: number) => ({
//     from: `${year}-01-01T00:00:00Z`,
//     to: `${year}-12-31T23:59:59Z`,
//   });

//   return {
//     currentFrom: makeRange(currentYear).from,
//     currentTo: makeRange(currentYear).to,
//     year1From: makeRange(currentYear - 1).from,
//     year1To: makeRange(currentYear - 1).to,
//     year2From: makeRange(currentYear - 2).from,
//     year2To: makeRange(currentYear - 2).to,
//     year3From: makeRange(currentYear - 3).from,
//     year3To: makeRange(currentYear - 3).to,
//     year4From: makeRange(currentYear - 4).from,
//     year4To: makeRange(currentYear - 4).to,
//   };
// }
