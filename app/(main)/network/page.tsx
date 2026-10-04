import { requireAuth } from "@/lib/auth";
import { getNetworkData } from "@/services/network/get-connections";
import { acceptConnectionRequest } from "@/services/network/accept-request";
import { ConnectButton } from "@/components/profile/ConnectButton";
import { FollowButton } from "@/components/profile/FollowButton";
import { MessageButton } from "@/components/profile/MessageButton";

export default async function NetworkPage() {
  await requireAuth();
  const { pendingRequests, connections, suggestions } = await getNetworkData();

  return (
    <div className="min-h-screen bg-muted/20 pb-16">
      <main className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Campus Network
          </h1>
          <p className="text-sm text-muted-foreground">
            Grow your professional circle across students, alumni mentors, and college recruiters.
          </p>
        </div>

        {pendingRequests.length > 0 && (
          <section className="rounded-xl border bg-card p-6 shadow-xs">
            <h2 className="text-base font-semibold text-foreground">
              Pending Invitations ({pendingRequests.length})
            </h2>
            <div className="mt-4 divide-y">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {req.sender.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">
                        {req.sender.fullName}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {req.sender.headline}
                      </p>
                      <span className="text-[11px] font-medium text-primary">
                        {req.sender.mutualCount} mutual connections
                      </span>
                    </div>
                  </div>

                  <form
                    action={async () => {
                      "use server";
                      await acceptConnectionRequest(req.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      Accept
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-4">
          <h2 className="text-base font-semibold text-foreground">
            People You May Know on Campus
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((peer) => (
              <div
                key={peer.id}
                className="flex flex-col justify-between rounded-xl border bg-card p-5 shadow-xs transition-shadow hover:shadow-sm"
              >
                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">
                    {peer.fullName.charAt(0)}
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-foreground">
                    {peer.fullName}
                  </h3>
                  <p className="line-clamp-2 mt-1 text-xs text-muted-foreground">
                    {peer.headline}
                  </p>
                  <p className="mt-2 text-[11px] font-medium text-muted-foreground">
                    {peer.mutualCount} mutual connections
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-2 border-t pt-3">
                  <ConnectButton targetUserId={peer.id} />
                  <FollowButton targetUserId={peer.id} />
                  <MessageButton targetUserId={peer.id} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {connections.length > 0 && (
          <section className="rounded-xl border bg-card p-6 shadow-xs space-y-4">
            <h2 className="text-base font-semibold text-foreground">
              My Connections ({connections.length})
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {connections.map((conn) => (
                <div
                  key={conn.id}
                  className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {conn.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-foreground">
                        {conn.fullName}
                      </h4>
                      <p className="line-clamp-1 text-[11px] text-muted-foreground">
                        {conn.headline}
                      </p>
                    </div>
                  </div>

                  <MessageButton targetUserId={conn.id} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
