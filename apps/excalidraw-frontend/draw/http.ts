import { HTTP_BACKEND } from "@/config";
import axios from "axios";

export async function getExistingShapes(roomId: string) {
  const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
  const messages = res.data.messages;

  //   @ts-ignore
  return messages.map((x) => {
    const messageData = JSON.parse(x.message);
    return messageData;
  });
}
