import Content from "@/content";
import Directors from "@layouts/Directors";

// The full Note from the Directors (2026 wording, with the EOH number updated to 107th; the home page shows an excerpt card).
// The "More in About EOH" links under it include the committee and history pages.
export default function DirectorsPage() {
  return (
    <Content title="Note from the Directors" wide>
      <Directors />
    </Content>
  );
}
