import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | Nivoseas Lighting LLP — Noida Experience Center & Trade Inquiries",
  description:
    "Get in touch with Nivoseas Lighting LLP. Visit our lighting experience center in Sector 104, Noida, call +91 99901 79666, or send a project inquiry.",
};

export default function ContactPage() {
  return <ContactClient />;
}
