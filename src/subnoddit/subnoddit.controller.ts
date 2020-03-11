import { Controller, Post, Body, Get, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { SubnodditService } from './subnoddit.service';
import { JoiValidationPipe } from 'src/shared/pipes/joi-validation.pipe';
import { filterSchema, createSchema, updateSchema } from './validator';
import { FilterDto, CreateSubnodditDto, UpdateSubnodditDto } from './dto';
import { SubnodditsBody, SubnodditBody } from './interfaces/subnoddit.interface';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { User } from 'src/shared/decorators';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { AppLogger } from 'src/app.logger';
import { Rcid } from 'src/shared/decorators/rcid.decorator';
import { logFormat } from 'src/shared';

@Controller('subnoddit')
export class SubnodditController {
  private logger = new AppLogger('SubnodditController');

  constructor(private readonly subnodditService: SubnodditService) {}

  @Post('/')
  async findMany(
    @Body(new JoiValidationPipe(filterSchema)) filter: FilterDto,
    @Rcid() rcid: string,
  ): Promise<SubnodditsBody> {
    const subnodditsBody = await this.subnodditService.findMany(filter);
    this.logger.debug(logFormat(rcid, 'findMany', 'found all subnoddits', filter, null));

    return subnodditsBody;
  }

  @Get('/:subnodditId')
  async findOne(@Param('subnodditId') subnodditId: number, @Rcid() rcid: string): Promise<SubnodditBody> {
    const subnodditBody = await this.subnodditService.findOne(subnodditId);
    this.logger.debug(`[findOne] subnoddit with id: ${subnodditBody.subnoddit.id} found`);
    this.logger.debug(logFormat(rcid, 'findOne', `subnoddit with id: ${subnodditBody.subnoddit.id} found`, {}, null));

    return subnodditBody;
  }

  @Post('/create')
  @UseGuards(AuthGuard)
  async create(
    @Body(new JoiValidationPipe(createSchema)) createSubnodditDto: CreateSubnodditDto,
    @User() user: JwtPayload,
    @Rcid() rcid: string,
  ): Promise<SubnodditBody> {
    const subnodditBody = await this.subnodditService.create(user.id, createSubnodditDto);
    this.logger.debug(`[create] subnoddit ${subnodditBody.subnoddit.name}(${subnodditBody.subnoddit.id})  created`);
    this.logger.debug(
      logFormat(
        rcid,
        'create',
        `subnoddit ${subnodditBody.subnoddit.name}(${subnodditBody.subnoddit.id}) created`,
        createSubnodditDto,
        user,
      ),
    );

    return subnodditBody;
  }

  @Put('/:subnodditId/update')
  @UseGuards(AuthGuard)
  async update(
    @Param('subnodditId') subnodditId: number,
    @Body(new JoiValidationPipe(updateSchema)) updateSubnodditDto: UpdateSubnodditDto,
    @User() user: JwtPayload,
    @Rcid() rcid: string,
  ): Promise<SubnodditBody> {
    const subnodditBody = await this.subnodditService.update(user.id, subnodditId, updateSubnodditDto);
    this.logger.debug(
      logFormat(
        rcid,
        'update',
        `subnoddit ${subnodditBody.subnoddit.name}(${subnodditBody.subnoddit.id}) updated`,
        updateSubnodditDto,
        user,
      ),
    );

    return subnodditBody;
  }

  @Delete('/:subnodditId/delete')
  @UseGuards(AuthGuard)
  async delete(
    @Param('subnodditId') subnodditId: number,
    @User() user: JwtPayload,
    @Rcid() rcid: string,
  ): Promise<{ message: string }> {
    const res = await this.subnodditService.delete(user.id, subnodditId);
    this.logger.debug(logFormat(rcid, 'delete', `subnoddit with id: ${subnodditId} removed`, {}, user));

    return res;
  }
}
