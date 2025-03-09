import { Intro } from "@/components/Intro";
import { Motivation } from "@/components/Motivation";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">GC Betting</h1>
      <p className="mb-4">
        not for the faint-hearted
      </p>
      <div className="max-w-md">
      <img src="/bipasha.jpg" alt="img"/>
      </div>
      <Intro/>

      <Motivation/>
    </div>
  );
}