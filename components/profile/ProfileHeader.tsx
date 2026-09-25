import { UserRole } from "@prisma/client";

interface ProfileHeaderProps {
  fullName: string;
  username: string;
  role: UserRole;
  headline?: string | null;
  avatarUrl?: string | null;
  coverImageUrl?: string | null;
}

export function ProfileHeader({
  fullName,
  username,
  role,
  headline,
  avatarUrl,
  coverImageUrl,
}: ProfileHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="h-40 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 sm:h-48">
        {coverImageUrl && (
          <img
            src={coverImageUrl}
            alt="Cover"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="relative px-6 pb-6 pt-0 sm:px-8">
        <div className="-mt-16 flex flex-col items-start gap-4 sm:-mt-20 sm:flex-row sm:items-end sm:justify-between">
          <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-4 border-background bg-muted shadow-md sm:h-36 sm:w-36">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary text-2xl font-bold text-primary-foreground sm:text-3xl">
                {fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              {role.replace("_", " ")}
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {fullName}
          </h1>
          <p className="text-sm font-medium text-muted-foreground">@{username}</p>
          {headline && (
            <p className="pt-1 text-sm text-foreground/90 sm:text-base">
              {headline}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
