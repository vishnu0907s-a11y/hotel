import { NextRequest, NextResponse } from "next/server";
import { DataService } from "@/lib/storage";
import { ReservationStatus } from "@/lib/supabase/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, admin_notes } = body;

    const validStatuses: ReservationStatus[] = [
      "pending",
      "confirmed",
      "seated",
      "completed",
      "cancelled",
      "rejected",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          type: "https://aurelia-dining.com/errors/invalid-status",
          title: "Invalid Reservation Status",
          status: 400,
          detail: `Status must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const updated = await DataService.updateReservationStatus(id, status, admin_notes);
    if (!updated) {
      return NextResponse.json(
        {
          type: "https://aurelia-dining.com/errors/not-found",
          title: "Reservation Not Found",
          status: 404,
          detail: `Reservation ${id} not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: updated });
  } catch (err: any) {
    return NextResponse.json(
      {
        type: "https://aurelia-dining.com/errors/internal",
        title: "Internal Server Error",
        status: 500,
        detail: err.message,
      },
      { status: 500 }
    );
  }
}

