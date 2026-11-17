import { NextRequest, NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations/reservation";
import { DataService } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = newsletterSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          type: "https://aurelia-dining.com/errors/invalid-email",
          title: "Invalid Email Address",
          status: 422,
          detail: "Please provide a valid email address",
        },
        { status: 422 }
      );
    }

    await DataService.subscribeNewsletter(validated.data.email);
    return NextResponse.json({ success: true, message: "Subscription confirmed" });
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

