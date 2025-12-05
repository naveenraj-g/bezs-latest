"use server";

import { prismaMain } from "../../prisma/prisma";

export async function getRBAC(userId: string) {
  const rbac = await prismaMain.rBAC.findMany({
    where: {
      userId,
    },
    omit: {
      createdAt: true,
      updatedAt: true,
    },
    include: {
      organization: {
        omit: {
          createdAt: true,
          updatedAt: true,
        },
        include: {
          appOrganization: {
            include: {
              app: true,
            },
          },
        },
      },
      role: {
        omit: {
          createdAt: true,
          updatedAt: true,
        },
        include: {
          menuPermission: {
            include: {
              app: true,
              appMenuItem: true,
            },
          },
        },
      },
    },
  });

  type TData = {
    organizations: {
      name: string;
      id: string;
      metadata: string | null;
      slug: string;
      logo: string | null;
    }[];
    roles: {
      name: string;
      id: string;
      description: string;
    }[];
  };

  const data = rbac.reduce(
    (acc: TData, rbacData) => {
      const { appOrganization, ...org } = rbacData.organization;
      const { menuPermission, ...role } = rbacData.role;
      const orgApp = rbacData.organization.appOrganization.map((app) => app);
      const roleAppMenuItems = rbacData.role.menuPermission;

      return {
        ...acc,
        organizations: [
          ...acc.organizations,
          {
            ...org,
          },
        ],
        roles: [
          ...acc.roles,
          {
            name: role.name,
            id: role.id,
            description: role.description,
          },
        ],
      };
    },
    {
      organizations: [],
      roles: [],
    }
  );

  return {
    userRBAC: rbac,
    roles: data.roles,
    organizations: data.organizations,
  };
}
