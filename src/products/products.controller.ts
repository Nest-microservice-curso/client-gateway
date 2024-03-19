import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, Payload, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICES } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICES) private readonly productService: ClientProxy,
  ) {}

  @Post()
  createProduct(@Payload() createProductDto: CreateProductDto) {
    return this.productService.send(
      { cmd: 'create-product' },
      createProductDto,
    );
  }

  @Get()
  findAll(@Query() payload: PaginationDto) {
    return this.productService.send({ cmd: 'find-all-products' }, payload);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.send({ cmd: 'find-one-product' }, { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Delete(':id')
  removeProduct(@Param('id') id: string) {
    return this.productService.send({ cmd: 'remove-product' }, { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Patch(':id')
  updateProduct(
    @Body() updateProductDto: UpdateProductDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const data = { id, ...updateProductDto };
    console.log(data);
    return this.productService
      .send({ cmd: 'update-product' }, { id, ...updateProductDto })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }
}
