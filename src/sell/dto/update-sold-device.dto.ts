import { PartialType } from '@nestjs/swagger';
import { CreateSoldDeviceDto } from './create-sold-device.dto';

export class UpdateSoldDeviceDto extends PartialType(CreateSoldDeviceDto) {}
