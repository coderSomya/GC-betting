"use client";
import { TextGenerateEffect } from "./ui/text-generate-effect";

const words = `"Its not gambling when you know you are gonna win"
- A randomass nigga`;

export function Intro() {
  return <TextGenerateEffect words={words} />;
}