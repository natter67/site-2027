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

  const content =
    typeof href === "string" ? (
      target ? (
        <a href={href} target={target} onClick={handleClick}>
          {children}
        </a>
      ) : (
        <Link href={href} className="font-montserrat" onClick={handleClick}>
          {children}
        </Link>
      )
    ) : (
      <button type="button" className="font-montserrat w-full" onClick={handleClick}>
        {children}
      </button>
    );

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
