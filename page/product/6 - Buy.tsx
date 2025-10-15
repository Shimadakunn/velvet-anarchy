"use client";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function Buy() {
  return (
    <Button
      effect="ringHover"
      className="w-full relative bg-foreground text-background py-4 rounded-lg hover:scale-[1.005] active:scale-[0.98] transition-all duration-200"
      onClick={() => toast.success("Added to cart!")}
    >
      <div className="flex flex-col space-y-[-6px]">
        <h1 className="text-3xl font-black font-Dirty">Add to CaRt</h1>
        <p className="text-background/80">30-Day Guarantee</p>
      </div>

      <ChevronRight
        style={{ width: "28px", height: "28px" }}
        className="absolute right-4 top-1/2 -translate-y-1/2 "
      />
    </Button>
  );
}
