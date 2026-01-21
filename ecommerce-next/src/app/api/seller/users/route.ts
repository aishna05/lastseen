
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json({ message: "No token provided" }, { status: 401 });
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.slice(7)
            : authHeader;

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: number;
            role: string;
        };

        // Ensure only SELLER (or ADMIN) can access this
        if (decoded.role !== "SELLER" && decoded.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized access" },
                { status: 403 }
            );
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(users);
    } catch (error: any) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: "Failed to fetch users", message: error.message },
            { status: 500 }
        );
    }
}
