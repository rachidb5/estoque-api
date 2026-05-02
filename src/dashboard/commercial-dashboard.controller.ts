import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import {
  CommercialDashboardResponse,
  CommercialDashboardService,
} from './commercial-dashboard.service';

@ApiTags('Commercial Dashboard')
@Controller('dashboard/commercial')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin', 'gestor')
export class CommercialDashboardController {
  constructor(
    private readonly commercialDashboardService: CommercialDashboardService,
  ) {}

  @Get()
  async findCommercialDashboard(): Promise<CommercialDashboardResponse> {
    return this.commercialDashboardService.getCommercialDashboard();
  }
}
