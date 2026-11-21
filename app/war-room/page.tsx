import { WarRoom } from "@/components/WarRoom";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "War Room",
};

export default function WarRoomPage() {
  return <WarRoom />;
}
