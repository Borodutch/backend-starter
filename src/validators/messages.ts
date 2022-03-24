import { messages } from "@/models/messages";
import { IsNumber, IsString } from "amala";

export class MessagesCreateInput {
    @IsString()
    @messages: string;

    @IsNumber()
    id: number;
}