import { BaseLinks, Roles } from '../components/LinkRowData';
import { useAuth } from '../context/AuthContext';


export const buildRouteRoleResolver = () => {
  const activeRoleLinks = BaseLinks.filter((roleEntry) => roleEntry.IsActive);

  return (paths: string[]) => {
    const normalizedPaths = paths.map((path) => path.toLowerCase());

    const allowedRoles = activeRoleLinks
      .filter((roleEntry) => roleEntry.RoleName !== Roles.Guest)
      .filter((roleEntry) => roleEntry.Links.some((link) => {
        const normalizedLink = link.Link.toLowerCase();

        return normalizedPaths.some((path) => {
          if (path === normalizedLink) {
            return true;
          }

          if (path.startsWith(`${normalizedLink}/`) && normalizedLink !== '/') {
            return true;
          }

          return false;
        });
      }))
      .map((roleEntry) => roleEntry.RoleName);

    return Array.from(new Set(allowedRoles));
  };
};
export const resolveAllowedRoles = buildRouteRoleResolver();
export const superAdminRoles = resolveAllowedRoles([
    '/super-admin',
    '/tenant-management',
    '/tenant-management/add',
    '/tenant-management/:tenantLocalId/subscription/create',
    '/school-registration',
    '/school-registration/:schoolId',
  ]);

export const schoolAdminRoles = resolveAllowedRoles([
    '/school-admin',
    '/students',
    '/staff',
    '/attendance',
    '/fees',
    '/exams',
    '/reports',
  ]);
