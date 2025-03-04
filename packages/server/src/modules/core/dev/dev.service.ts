import { Injectable } from '@nestjs/common';

import { ServerConfig } from '../../../config/server.config';
import { CreditsService } from '../../global/credits/credits.service';
import { PrismaService } from '../../global/prisma/prisma.service';

import { DevUpdateWorkspaceCreditDto } from './dto/dev-update-workspace-credit.dto';

@Injectable()
export class DevService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly creditsService: CreditsService,
  ) {}

  getWorkspaces = async () => {
    return await this.prisma.workspace.findMany({
      select: {
        id: true,
        createdAt: true,
        createdByWorkspaceUser: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        workspaceUsers: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        billing: {
          select: {
            stripeCustomerId: true,
            planType: true,
            status: true,
          },
        },
        connections: {
          select: {
            _count: true,
          },
        },
        knowledge: {
          select: {
            _count: true,
          },
        },
        variables: {
          select: {
            _count: true,
          },
        },
        usage: {
          select: {
            allottedCredits: true,
            purchasedCredits: true,
            refreshedAt: true,
          },
        },
        projects: {
          select: {
            _count: true,
            workflows: {
              select: {
                _count: true,
                executions: {
                  select: {
                    _count: true,
                  },
                },
              },
            },
            agents: {
              select: {
                _count: true,
                tasks: {
                  select: {
                    _count: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  };

  getWorkspacesByEmail = async ({ email }: { email: string }) => {
    return await this.prisma.workspace.findMany({
      where: {
        workspaceUsers: {
          some: {
            user: {
              email,
            },
          },
        },
      },
      select: {
        id: true,
        createdAt: true,
        createdByWorkspaceUser: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        workspaceUsers: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        billing: {
          select: {
            stripeCustomerId: true,
            planType: true,
            status: true,
          },
        },
        connections: {
          select: {
            _count: true,
          },
        },
        knowledge: {
          select: {
            _count: true,
          },
        },
        variables: {
          select: {
            _count: true,
          },
        },
        usage: {
          select: {
            allottedCredits: true,
            purchasedCredits: true,
            refreshedAt: true,
          },
        },
        projects: {
          select: {
            _count: true,
            workflows: {
              select: {
                _count: true,
                executions: {
                  select: {
                    _count: true,
                  },
                },
              },
            },
            agents: {
              select: {
                _count: true,
                tasks: {
                  select: {
                    _count: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  };

  updateWorkspaceCredits = async (data: DevUpdateWorkspaceCreditDto) => {
    //Since this is a "charge", we make credits negative to add them to the workspace.
    if (data.credits > 0) {
      data.credits = -data.credits;
    } else {
      data.credits = Math.abs(data.credits);
    }

    return await this.creditsService.updateWorkspaceCredits({
      creditsUsed: data.credits,
      workspaceId: data.workspaceId,
      projectId: undefined,
      data: {
        ref: {},
        details: {
          reason: data.reason ?? `Updated by ${ServerConfig.PLATFORM_NAME}`,
        },
      },
    });
  };
}
