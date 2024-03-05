import { Module, forwardRef } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { ChatsModule } from '../chats.module';

@Module({
  //forwarRef is used to avoid circular dependency
  imports: [forwardRef(() => ChatsModule)],
  providers: [MessagesResolver, MessagesService],
})
export class MessagesModule {}
