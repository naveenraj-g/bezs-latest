import { auth } from "../betterauth/auth";

export type TSession = typeof auth.$Infer.Session;
export type TOrganizationType = typeof auth.$Infer.Organization;
export type TMemberType = typeof auth.$Infer.Member;
export type TInvitationType = typeof auth.$Infer.Invitation;

export type TRBACsessionType = typeof auth.$Infer.Session.userRBAC;
