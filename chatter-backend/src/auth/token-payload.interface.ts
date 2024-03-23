import { User } from 'src/users/entities/user.entity';

//Omit _id of type ObjectId from User, and add back _id of type string
export type TokenPayload = Omit<User, '_id'> & { _id: string };
