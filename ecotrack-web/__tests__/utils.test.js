import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("should combine class names", () => {
    expect(cn("class1", "class2")).toBe("class1 class2");
  });

  it("should handle conditionals", () => {
    expect(cn("class1", false && "class2", true && "class3")).toBe("class1 class3");
  });

  it("should resolve tailwind merges correctly", () => {
    expect(cn("px-2 py-1", "p-4")).toBe("p-4");
  });
});
