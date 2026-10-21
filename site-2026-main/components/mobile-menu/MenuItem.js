import { getStyles } from "@utilities/types";
import Link from "next/link";

export default function MenuItem({
  type,
  href,
  target,
  className,
  children,
  kill,
  onClick,
}) {
  const handleClick = (e) => {
    if (typeof onClick === "function") {
      e?.preventDefault?.();
      onClick(e);
    }
    kill?.();
  };

  // Direction A pill types (da-navy, da-primary, da-secondary) render as a centered pill instead of a full-width row
  const isPill = type?.startsWith("da-") && type !== "da-link";
  const font = type?.startsWith("da-") ? "font-body" : "font-montserrat";
  const linkClass = isPill ? `${font} ${getStyles(type)}` : font;

  const content =
    typeof href === "string" ? (
      target ? (
        <a href={href} target={target} onClick={handleClick} className={linkClass}>
          {children}
        </a>
      ) : (
        <Link href={href} className={linkClass} onClick={handleClick}>
          {children}
        </Link>
      )
    ) : (
      <button type="button" className={`${linkClass} w-full`} onClick={handleClick}>
        {children}
      </button>
    );

  if (isPill) {
    return <div className={`flex w-screen justify-center py-1.5 ${className}`}>{content}</div>;
  }

  return (
    <div
      className={`relative transition delay-150 duration-200 ease-in-out inline-grid items-center border border-transparent
                  text-base font-medium h-10 w-screen text-center
                  ${getStyles(type)}
                  ${typeof href === "undefined" && `cursor-default`}
                  ${className}`}
    >
      {content}
    </div>
  );
}
