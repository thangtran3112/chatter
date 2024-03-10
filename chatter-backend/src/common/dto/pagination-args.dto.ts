import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  // the number of page will will skip
  @Field(() => Int)
  skip: number;

  //size of the page
  @Field(() => Int)
  limit: number;
}
