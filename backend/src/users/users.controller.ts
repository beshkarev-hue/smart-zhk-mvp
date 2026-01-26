import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }

  @Get('executors')
  @UseGuards(JwtAuthGuard)
  async getExecutors() {
    return this.usersService.findByRole('executor');
  }

  @Post(':id/rating')
  @UseGuards(JwtAuthGuard)
  async updateRating(@Param('id') id: string, @Body() body: { rating: number }) {
    await this.usersService.updateRating(id, body.rating);
    return { message: 'Rating updated' };
  }
}
