import Link from "next/link";
import Content from "@/content";
import Directors from "@layouts/Directors";
import { HISTORY_URL } from "@utilities/navigation";

// The full Note from the Directors (wording unchanged; the home page shows an excerpt card).
export default function DirectorsPage() {
  return (
    <Content title="Note from the Directors" wide>
      <Directors />
      <p className="mx-auto mb-16 mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/about-us/meet-the-committee" className="da-pill da-pill--navy">
          Meet the committee
        </Link>
        <a href={HISTORY_URL} target="_blank" rel="noopener noreferrer" className="da-pill da-pill--secondary">
          History of EOH
        </a>
      </p>
    </Content>
  );
}
