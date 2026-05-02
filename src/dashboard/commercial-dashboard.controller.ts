import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import {
  CommercialDashboardResponse,
  CommercialDashboardService,
} from './commercial-dashboard.service';

@ApiTags('Commercial Dashboard')
@Controller('dashboard/commercial')
export class CommercialDashboardController {
  constructor(
    private readonly commercialDashboardService: CommercialDashboardService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findCommercialDashboard(): Promise<CommercialDashboardResponse> {
    return this.commercialDashboardService.getCommercialDashboard();
  }
}
