export const ADMIN_EMAILS = [
  "nathan49@illinois.edu",
  "vanir2@illinois.edu",
  "shaand3@illinois.edu",
  "aparna4@illinois.edu",
  "mconrad5@illinois.edu",
  "divya5@illinois.edu",
  "bkiene2@illinois.edu",
  "maa38@illinois.edu",
  "azh4@illinois.edu",
];

export function isAdminEmail(email) {
  return !!email && ADMIN_EMAILS.includes(email);
}
