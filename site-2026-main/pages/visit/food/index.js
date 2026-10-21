import Link from "next/link";
import Content from "@/content";
import Faqs from "@layouts/FAQs";

// Food: the Food FAQs from layouts/FAQs/faqs.json, plus a pointer to the guide's food section.
export default function FoodPage() {
  return (
    <Content title="Food">
      <div className="px-4 text-left">
        <Faqs only={["Food FAQs"]} />
      </div>
      {/* DRAFT copy */}
      <p className="mb-8 text-lg">
        The{" "}
        <Link href="/visit/guide#food" className="font-semibold underline decoration-da-orange decoration-2 underline-offset-4">
          Visitor Guide
        </Link>{" "}
        lists food options too.
      </p>
    </Content>
  );
}
