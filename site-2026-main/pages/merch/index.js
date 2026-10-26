import Content from "@/content";

// Merch preorders. The button is a greyed-out placeholder: when the preorder form is ready,
// swap the <span> for a link, like the exhibits form buttons on /get-involved.
export default function MerchPage() {
  return (
    <Content title="Merch">
      {/* DRAFT copy */}
      <p className="text-lg">Preorders for EOH 2027 merch open soon.</p>
      <span
        aria-disabled="true"
        className="mt-6 inline-flex cursor-not-allowed items-center justify-center self-center rounded-full border-2 border-gray-400 bg-gray-200 px-6 py-3.5 font-bold text-gray-600"
      >
        Preorder form coming soon
      </span>
    </Content>
  );
}
