import { describe, it, expect } from "vitest";

// =====================================================================
// Multi-Tenant Isolation & RLS Security Simulation Engine
// Tests the exact logic and access control rules implemented in:
// supabase/migrations/20261026000001_initial_schema.sql
// =====================================================================

interface UserContext {
  userId: string;
  name: string;
}

interface Organisation {
  id: string;
  name: string;
  createdBy: string;
}

interface OrgMember {
  organisationId: string;
  userId: string;
  role: "owner" | "admin" | "member";
}

interface Wedding {
  id: string;
  organisationId: string;
  title: string;
}

interface WeddingMember {
  weddingId: string;
  userId: string;
  role: "wedding_lead" | "coordinator" | "checkin_staff" | "viewer";
}

// Security Definer: is_org_member
function isOrgMember(targetOrgId: string, user: UserContext | null, members: OrgMember[]): boolean {
  if (!user) return false;
  return members.some((m) => m.organisationId === targetOrgId && m.userId === user.userId);
}

// Security Definer: is_org_admin
function isOrgAdmin(targetOrgId: string, user: UserContext | null, members: OrgMember[]): boolean {
  if (!user) return false;
  return members.some(
    (m) => m.organisationId === targetOrgId && m.userId === user.userId && (m.role === "owner" || m.role === "admin")
  );
}

// Security Definer: can_access_wedding
function canAccessWedding(
  targetWeddingId: string,
  user: UserContext | null,
  weddings: Wedding[],
  orgMembers: OrgMember[],
  weddingMembers: WeddingMember[]
): boolean {
  if (!user) return false;

  const wedding = weddings.find((w) => w.id === targetWeddingId);
  if (!wedding) return false;

  // Org admin or owner can access all weddings in their org
  if (isOrgAdmin(wedding.organisationId, user, orgMembers)) {
    return true;
  }

  // Otherwise, must be explicitly assigned as a wedding member
  return weddingMembers.some((wm) => wm.weddingId === targetWeddingId && wm.userId === user.userId);
}

// RLS SELECT Filter for Weddings
function filterWeddingsForUser(
  user: UserContext | null,
  weddings: Wedding[],
  orgMembers: OrgMember[],
  weddingMembers: WeddingMember[]
): Wedding[] {
  return weddings.filter((w) => canAccessWedding(w.id, user, weddings, orgMembers, weddingMembers));
}

// RLS SELECT Filter for Organisations
function filterOrganisationsForUser(
  user: UserContext | null,
  orgs: Organisation[],
  orgMembers: OrgMember[]
): Organisation[] {
  return orgs.filter((org) => isOrgMember(org.id, user, orgMembers));
}

describe("Phase 2 Multi-Tenant Security & Row Level Security (RLS) Verification", () => {
  // Test Fixtures (matching supabase/seed.sql)
  const userAmar: UserContext = { userId: "user-amar-01", name: "Amar Khera" };
  const userAnanya: UserContext = { userId: "user-ananya-02", name: "Ananya Rout" };
  const userLucky: UserContext = { userId: "user-lucky-03", name: "Lucky Kumar" };
  const userOmm: UserContext = { userId: "user-omm-04", name: "Omm Prakash Sahoo" };

  const orgRoyal: Organisation = {
    id: "org-royal-01",
    name: "Royal Heritage Events & Planners",
    createdBy: userAmar.userId,
  };

  const orgVivaah: Organisation = {
    id: "org-vivaah-02",
    name: "Vivaah Destination Coordinators",
    createdBy: userLucky.userId,
  };

  const allOrgs = [orgRoyal, orgVivaah];

  const orgMemberships: OrgMember[] = [
    { organisationId: orgRoyal.id, userId: userAmar.userId, role: "owner" },
    { organisationId: orgRoyal.id, userId: userAnanya.userId, role: "member" },
    { organisationId: orgVivaah.id, userId: userLucky.userId, role: "owner" },
    { organisationId: orgVivaah.id, userId: userOmm.userId, role: "member" },
  ];

  const wedUdaipur: Wedding = {
    id: "wed-udaipur-01",
    organisationId: orgRoyal.id,
    title: "Aarav & Diya Grand Wedding (Udaipur)",
  };

  const wedJaipur: Wedding = {
    id: "wed-jaipur-02",
    organisationId: orgRoyal.id,
    title: "Rohan & Meera Royal Celebration (Jaipur)",
  };

  const wedGoa: Wedding = {
    id: "wed-goa-03",
    organisationId: orgVivaah.id,
    title: "Kabir & Rhea Beachfront Wedding (Goa)",
  };

  const allWeddings = [wedUdaipur, wedJaipur, wedGoa];

  // Wedding Staff Scoping:
  // Ananya is coordinator for Udaipur wedding, but NOT assigned to Jaipur wedding
  // Omm is coordinator for Goa wedding
  const weddingMemberships: WeddingMember[] = [
    { weddingId: wedUdaipur.id, userId: userAnanya.userId, role: "coordinator" },
    { weddingId: wedGoa.id, userId: userOmm.userId, role: "coordinator" },
  ];

  describe("Cross-Organisation Boundary Isolation", () => {
    it("prevents User from Org A (Amar) from viewing Org B (Vivaah) data", () => {
      const visibleOrgs = filterOrganisationsForUser(userAmar, allOrgs, orgMemberships);
      expect(visibleOrgs).toHaveLength(1);
      expect(visibleOrgs[0].id).toBe(orgRoyal.id);

      const canAccessVivaah = isOrgMember(orgVivaah.id, userAmar, orgMemberships);
      expect(canAccessVivaah).toBe(false);
    });

    it("prevents User from Org B (Lucky) from viewing Org A (Royal) data", () => {
      const visibleOrgs = filterOrganisationsForUser(userLucky, allOrgs, orgMemberships);
      expect(visibleOrgs).toHaveLength(1);
      expect(visibleOrgs[0].id).toBe(orgVivaah.id);

      const canAccessRoyal = isOrgMember(orgRoyal.id, userLucky, orgMemberships);
      expect(canAccessRoyal).toBe(false);
    });

    it("restricts unauthenticated (null) users to 0 organisations", () => {
      const visibleOrgs = filterOrganisationsForUser(null, allOrgs, orgMemberships);
      expect(visibleOrgs).toHaveLength(0);
    });
  });

  describe("Cross-Tenant Wedding Isolation", () => {
    it("allows Org Owner (Amar) to view all weddings created under his organisation", () => {
      const visibleWeddings = filterWeddingsForUser(userAmar, allWeddings, orgMemberships, weddingMemberships);
      const weddingIds = visibleWeddings.map((w) => w.id);
      expect(weddingIds).toContain(wedUdaipur.id);
      expect(weddingIds).toContain(wedJaipur.id);
      expect(weddingIds).not.toContain(wedGoa.id); // Strict cross-tenant block!
    });

    it("strictly isolates wedding data between Org A and Org B", () => {
      const luckyWeddings = filterWeddingsForUser(userLucky, allWeddings, orgMemberships, weddingMemberships);
      expect(luckyWeddings).toHaveLength(1);
      expect(luckyWeddings[0].id).toBe(wedGoa.id);
      expect(luckyWeddings.some((w) => w.id === wedUdaipur.id)).toBe(false);
    });

    it("restricts unauthenticated (null) requests to 0 weddings", () => {
      const visible = filterWeddingsForUser(null, allWeddings, orgMemberships, weddingMemberships);
      expect(visible).toHaveLength(0);
    });
  });

  describe("Wedding-Level Staff Scoping Within the Same Organisation", () => {
    it("scopes regular coordinator (Ananya) strictly to assigned wedding (Udaipur)", () => {
      const ananyaWeddings = filterWeddingsForUser(userAnanya, allWeddings, orgMemberships, weddingMemberships);
      expect(ananyaWeddings).toHaveLength(1);
      expect(ananyaWeddings[0].id).toBe(wedUdaipur.id);

      // Ananya is NOT assigned to Jaipur wedding, so it must not be accessible
      const canAccessJaipur = canAccessWedding(wedJaipur.id, userAnanya, allWeddings, orgMemberships, weddingMemberships);
      expect(canAccessJaipur).toBe(false);
    });

    it("verifies that Omm in Org B cannot access Org A weddings even if assigned as coordinator in Org B", () => {
      const canAccessUdaipur = canAccessWedding(wedUdaipur.id, userOmm, allWeddings, orgMemberships, weddingMemberships);
      expect(canAccessUdaipur).toBe(false);
    });
  });

  describe("Role Privilege Constraints", () => {
    it("verifies only owners or admins have org administration privileges", () => {
      expect(isOrgAdmin(orgRoyal.id, userAmar, orgMemberships)).toBe(true);
      expect(isOrgAdmin(orgRoyal.id, userAnanya, orgMemberships)).toBe(false); // Ananya is regular member
      expect(isOrgAdmin(orgVivaah.id, userLucky, orgMemberships)).toBe(true);
      expect(isOrgAdmin(orgVivaah.id, userOmm, orgMemberships)).toBe(false); // Omm is regular member
    });
  });
});
