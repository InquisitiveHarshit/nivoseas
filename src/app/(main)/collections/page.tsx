import { Metadata } from "next";
import CollectionsClient from "./CollectionsClient";

export const metadata: Metadata = {
  title: "Our Collections | From the Drawing Room to the Gate | Nivoseas Lighting LLP",
  description:
    "Explore Nivoseas Lighting collections — from grand drawing room chandeliers and indoor lighting to weather-rated outdoor gate lights and architectural LED systems. Handcrafted with a 2-year warranty.",
};

export default function CollectionsPage() {
  return <CollectionsClient />;
}
