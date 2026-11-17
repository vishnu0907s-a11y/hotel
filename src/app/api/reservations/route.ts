import { NextRequest, NextResponse } from "next/server";
import { reservationFormSchema } from "@/lib/validations/reservation";
import { DataService } from "@/lib/storage";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (reference) {
      const reservation = await DataService.getReservationByReference(reference);
      if (!reservation) {
        return NextResponse.json(
          {
            type: "https://aurelia-dining.com/errors/not-found",
            title: "Reservation Not Found",
            status: 404,
            detail: `No reservation exists for reference code ${reference}`,
          },
          { status: 404 }
        );
      }
      return NextResponse.json({ data: reservation });
    }

    const reservations = await DataService.getReservations();
    return NextResponse.json({ data: reservations });
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = reservationFormSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          type: "https://aurelia-dining.com/errors/validation-error",
          title: "Invalid Reservation Submission",
          status: 422,
          detail: "Validation failed on one or more reservation fields",
          errors: validated.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const reservation = await DataService.createReservation(validated.data);
    return NextResponse.json({ data: reservation }, { status: 201 });
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

