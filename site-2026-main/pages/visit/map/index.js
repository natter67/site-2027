import Link from "next/link";
import Content from "@/content";
import Map from "@/vv/map";

// Campus map: the same map component as the Event Day Hub (/vv), unchanged.
export default function MapPage() {
  return (
    <Content title="Map" wide>
      <div className="mx-auto w-full max-w-5xl">
        <Map />
      </div>
      {/* DRAFT copy */}
      <p className="mt-8 text-lg">
        On the event days, the{" "}
        <Link href="/vv" className="font-semibold underline decoration-da-orange decoration-2 underline-offset-4">
          Event Day Hub
        </Link>{" "}
        has this map plus exhibits and special events in one place.
      </p>
    </Content>
  );
}
