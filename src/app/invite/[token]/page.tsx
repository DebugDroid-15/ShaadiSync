import * as React from "react";
import { notFound } from "next/navigation";
import { getInvitationByTokenAction } from "@/lib/actions/rsvp";
import { RsvpClientPortal } from "@/components/rsvp/rsvp-client-portal";

interface InvitePageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;

  const invitationData = await getInvitationByTokenAction(token);

  if (!invitationData.isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory-100 p-4">
        <div className="max-w-md w-full rounded-2xl bg-white border border-slate-200 p-8 text-center shadow-card space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-navy-900">Invitation Link Unavailable</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {invitationData.error || "This link may have been revoked or expired. Please contact the wedding host for a new link."}
          </p>
        </div>
      </div>
    );
  }

  return <RsvpClientPortal token={token} initialData={invitationData} />;
}
