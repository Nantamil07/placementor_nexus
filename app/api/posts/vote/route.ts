import { NextRequest, NextResponse } from "next/server";
import { votePost } from "@/services/posts/vote-post";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId, direction } = body;

    if (!postId || (direction !== 1 && direction !== -1)) {
      return NextResponse.json(
        { success: false, error: "Invalid vote payload" },
        { status: 400 }
      );
    }

    const result = await votePost(postId, direction);
    if (!result.success) {
      return NextResponse.json(result, { status: 401 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Vote API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process vote" },
      { status: 500 }
    );
  }
}
