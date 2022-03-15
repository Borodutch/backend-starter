import { messageModel } from "@/models/messages";
import { Body, Controller, Delete, Flow, Get, Params, Patch, Post, Validate } from "amala";
import { MessagesCreateInput } from "@/validators/messages";
import { result } from "lodash";

@Controller('/messages')
export class messageController {
    @Post('/')
    postMessage(@Body({required: true, messageModel: toString(), textMessage: MessagesCreateInput}):{
        return messageModel.create({
            user: string,
            text: body.text,
                }).then((result) => {
            redirect('/');
                }).catch((err) => console.log(err)
        });
    }

    @Get('/:id')
    findById(@Params('id') id: number) {
        return messageModel.findById(id)
        .then(result => {
            render: 'message', {message: result, title: 'Message'}
        })
        .catch(err => console.log(err))
    }

    @Delete('/:id')
    messageModel.findByIdAndDelete(id)
        .then(result => {
            json({redirect: '/'});
        })
        .catch(err => console.log(err))
}