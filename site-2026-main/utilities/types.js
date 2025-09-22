/** Returns button/menu-item styles for each type */
export function getStyles(type) {
  if (type === "normal" || typeof type === "undefined")
    return "text-black font-medium hover:text-theme-red";
  else if (type === "big")
    return "border rounded-md text-white font-medium px-3 drop-shadow-md bg-theme-yellow hover:bg-yellow-600";
  else if (type === "mail")
    return "border rounded-md font-medium text-white px-3 drop-shadow-md bg-theme-light-purple hover:bg-theme-dark-purple";
  else if (type === "inactive")
    return "shadow-sm font-medium text-gray-500 bg-gray-100 italic";
  else if (type === "menu")
    return "shadow-sm font-medium text-black border-black hover:bg-gray-100";
}
