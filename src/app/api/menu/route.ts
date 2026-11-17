import { NextRequest, NextResponse } from "next/server";
import { DataService } from "@/lib/storage";
import { menuItemSchema } from "@/lib/validations/reservation";

export async function GET() {
  try {
    const items = await DataService.getMenuItems();
    return NextResponse.json({ data: items });
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
    const validated = menuItemSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          type: "https://aurelia-dining.com/errors/validation-error",
          title: "Invalid Menu Submission",
          status: 422,
          detail: "Validation failed on one or more menu item fields",
          errors: validated.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const item = await DataService.addMenuItem(validated.data);
    return NextResponse.json({ data: item }, { status: 201 });
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

