"use server";

import { getMessages } from "./get-conversations";

export async function loadMessages(conversationId: string) {
  return getMessages(conversationId);
}
