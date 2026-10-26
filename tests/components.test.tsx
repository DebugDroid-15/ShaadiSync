import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

describe("ShaadiSync UI Primitives", () => {
  it("renders Button with primary variant and text", () => {
    render(<Button variant="primary">Confirm RSVP</Button>);
    const button = screen.getByRole("button", { name: /confirm rsvp/i });
    expect(button).toBeDefined();
    expect(button.textContent).toBe("Confirm RSVP");
  });

  it("renders Badge with gold variant", () => {
    render(<Badge variant="gold">Baraat</Badge>);
    const badge = screen.getByText("Baraat");
    expect(badge).toBeDefined();
  });

  it("renders Card container with title and content", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Sangeet Ceremony</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Venue: Udaipur Palace</p>
        </CardContent>
      </Card>
    );
    expect(screen.getByText("Sangeet Ceremony")).toBeDefined();
    expect(screen.getByText("Venue: Udaipur Palace")).toBeDefined();
  });
});
