import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { AuthResponseDto } from './dto/auth-response.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterResponseDto } from './dto/register-response.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import type { AuthenticatedRequest } from './guards/jwt-auth.guard.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a Skillora student user' })
  @ApiCreatedResponse({ type: RegisterResponseDto })
  async register(@Body() body: RegisterDto): Promise<RegisterResponseDto> {
    const user = await this.authService.register(body);
    return { user };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and receive a JWT access token' })
  @ApiOkResponse({ type: AuthResponseDto })
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current authenticated user' })
  @ApiOkResponse({ description: 'The authenticated user profile.' })
  me(@Req() request: AuthenticatedRequest) {
    return request.user;
  }
}
