import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, QueryFailedError } from 'typeorm';
import { SoldDevice } from './entities/sold-device.entity';
import { CreateSoldDeviceDto } from './dto/create-sold-device.dto';
import { UpdateSoldDeviceDto } from './dto/update-sold-device.dto';

@Injectable()
export class SoldDeviceService {
  constructor(
    @InjectRepository(SoldDevice)
    private readonly soldDeviceRepository: Repository<SoldDevice>,
  ) {}

  async findAll(): Promise<SoldDevice[]> {
    return this.soldDeviceRepository.find();
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{
    data: SoldDevice[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const whereCondition = search
      ? [
          { imei: ILike(`%${search}%`) },
          { aparelho: ILike(`%${search}%`) },
          { comprador: ILike(`%${search}%`) },
          { cor: ILike(`%${search}%`) },
          { observacao: ILike(`%${search}%`) },
        ]
      : {};

    const [data, total] = await Promise.all([
      this.soldDeviceRepository.find({
        where: whereCondition,
        skip,
        take: limit,
        order: { id: 'DESC' },
      }),
      this.soldDeviceRepository.count({ where: whereCondition }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number): Promise<SoldDevice> {
    const soldDevice = await this.soldDeviceRepository.findOne({
      where: { id },
    });

    if (!soldDevice) {
      throw new NotFoundException(`Venda com ID ${id} não encontrada`);
    }

    return soldDevice;
  }

  async create(createSoldDeviceDto: CreateSoldDeviceDto): Promise<SoldDevice> {
    try {
      const soldDevice = this.soldDeviceRepository.create(createSoldDeviceDto);
      return await this.soldDeviceRepository.save(soldDevice);
    } catch (error) {
      console.log(error);
      if (error instanceof QueryFailedError) {
        // PostgreSQL (mais comum no Nest)
        if ((error as any).code === '23505') {
          throw new BadRequestException('Já existe um registro com esse IMEI');
        }

        // MySQL fallback
        if ((error as any).code === 'ER_DUP_ENTRY') {
          throw new BadRequestException('Já existe um registro duplicado');
        }

        throw new BadRequestException('Erro ao salvar no banco de dados');
      }

      throw new InternalServerErrorException('Erro interno ao criar a venda');
    }
  }

  async update(
    id: number,
    updateSoldDeviceDto: UpdateSoldDeviceDto,
  ): Promise<SoldDevice> {
    const soldDevice = await this.findOne(id);
    Object.assign(soldDevice, updateSoldDeviceDto);
    return this.soldDeviceRepository.save(soldDevice);
  }

  // async remove(id: number): Promise<void> {
  //   const soldDevice = await this.findOne(id);
  //   await this.soldDeviceRepository.remove(soldDevice);
  // }
}